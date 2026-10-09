import { prisma, Prisma, ProposalStatus, ServiceRequestStatus } from '@borracharia/database';
import { BadRequestError, NotFoundError } from '../errors/app-error.js';
import { AcceptProposalInput, CreateProposalInput } from '../schemas/requests.schemas.js';
import { asaasService } from './asaas.service.js';

export class ProposalsService {
  /**
   * Profissional submete um lance para um chamado de emergência.
   * Rejeita se o chamado já tiver prestador atribuído, estiver cancelado ou finalizado.
   */
  async createProposal(requestId: string, providerId: string, input: CreateProposalInput) {
    // 1. Validar se o perfil do prestador existe
    const provider = await prisma.providerProfile.findUnique({
      where: { id: providerId },
      include: { user: true },
    });

    if (!provider) {
      throw new NotFoundError(`Perfil de prestador não encontrado para o ID [${providerId}]`);
    }

    // 2. Validar se o chamado existe
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });

    if (!serviceRequest) {
      throw new NotFoundError(`Chamado [${requestId}] não encontrado`);
    }

    // 3. Regra Funcional: Rejeitar criação de lances para chamados com prestador já atribuído, cancelados ou encerrados
    const invalidStatuses: ServiceRequestStatus[] = [
      ServiceRequestStatus.PROVIDER_ASSIGNED,
      ServiceRequestStatus.PROVIDER_EN_ROUTE,
      ServiceRequestStatus.PROVIDER_ARRIVED,
      ServiceRequestStatus.SERVICE_IN_PROGRESS,
      ServiceRequestStatus.SERVICE_COMPLETED,
      ServiceRequestStatus.PAYMENT_PENDING,
      ServiceRequestStatus.CLOSED,
      ServiceRequestStatus.CANCELLED,
      ServiceRequestStatus.FAILED,
    ];

    if (invalidStatuses.includes(serviceRequest.status)) {
      throw new BadRequestError(
        `Não é possível enviar proposta para este chamado. O chamado já se encontra no status [${serviceRequest.status}].`,
      );
    }

    // 4. Criar o lance em transação e avançar o status do chamado se for o primeiro lance
    const proposal = await prisma.$transaction(async (tx) => {
      const createdProposal = await tx.proposal.create({
        data: {
          service_request_id: requestId,
          provider_id: providerId,
          proposed_price: new Prisma.Decimal(input.proposed_price.toFixed(2)),
          estimated_arrival_time_mins: input.estimated_arrival_time_mins,
          status: ProposalStatus.PENDING,
        },
        include: {
          provider: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      });

      // Se o chamado estava em CREATED ou SEARCHING_PROVIDER, atualiza para PROPOSALS_RECEIVED
      if (
        serviceRequest.status === ServiceRequestStatus.CREATED ||
        serviceRequest.status === ServiceRequestStatus.SEARCHING_PROVIDER
      ) {
        await tx.serviceRequest.update({
          where: { id: requestId },
          data: { status: ServiceRequestStatus.PROPOSALS_RECEIVED },
        });
      }

      return createdProposal;
    });

    return proposal;
  }

  /**
   * Lista todas as propostas recebidas para um chamado específico
   */
  async getProposalsForRequest(requestId: string) {
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });

    if (!serviceRequest) {
      throw new NotFoundError(`Chamado [${requestId}] não encontrado`);
    }

    const proposals = await prisma.proposal.findMany({
      where: { service_request_id: requestId },
      orderBy: [{ proposed_price: 'asc' }, { estimated_arrival_time_mins: 'asc' }],
      include: {
        provider: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
              },
            },
            vehicle_types: {
              include: {
                vehicle_type: true,
              },
            },
          },
        },
      },
    });

    return proposals;
  }

  /**
   * Cliente aceita um dos lances recebidos.
   * Executa a pré-autorização financeira via Asaas (modelo Uber) e atualiza os status atomicamente.
   */
  async acceptProposal(
    requestId: string,
    proposalId: string,
    customerId: string,
    input: AcceptProposalInput,
  ) {
    // 1. Validar se o chamado existe
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { customer: true },
    });

    if (!serviceRequest) {
      throw new NotFoundError(`Chamado [${requestId}] não encontrado`);
    }

    // 2. Validar permissão (o cliente que aceita deve ser o dono do chamado)
    if (customerId && serviceRequest.customer_id !== customerId) {
      throw new BadRequestError('Você não tem permissão para aceitar propostas neste chamado');
    }

    // 3. Validar se o chamado ainda permite aceite
    if (serviceRequest.status === ServiceRequestStatus.PROVIDER_ASSIGNED) {
      throw new BadRequestError('Este chamado já possui um prestador atribuído');
    }

    if (
      serviceRequest.status === ServiceRequestStatus.CLOSED ||
      serviceRequest.status === ServiceRequestStatus.CANCELLED
    ) {
      throw new BadRequestError(
        `Chamado encerrado ou cancelado (status: ${serviceRequest.status})`,
      );
    }

    // 4. Buscar a proposta a ser aceita
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        provider: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!proposal || proposal.service_request_id !== requestId) {
      throw new NotFoundError(`Proposta [${proposalId}] não encontrada para este chamado`);
    }

    if (proposal.status !== ProposalStatus.PENDING) {
      throw new BadRequestError(
        `Apenas propostas com status PENDING podem ser aceitas (status atual: ${proposal.status})`,
      );
    }

    // 5. Integração com Gateway Asaas: modelo Uber (Retenção / Pré-autorização no aceite)
    const priceNumber = Number(proposal.proposed_price);
    let paymentResult;

    if (input.payment_method === 'CREDIT_CARD') {
      paymentResult = await asaasService.preAuthorizeCreditCard({
        customerId: serviceRequest.customer_id,
        amount: priceNumber,
        creditCardToken: input.credit_card_token,
        serviceRequestId: requestId,
      });
    } else {
      paymentResult = await asaasService.generatePixCopyPaste({
        customerId: serviceRequest.customer_id,
        amount: priceNumber,
        serviceRequestId: requestId,
      });
    }

    // 6. Transação atômica no banco de dados:
    // - Proposta selecionada -> ACCEPTED
    // - Demais propostas do chamado -> REJECTED
    // - ServiceRequest -> PROVIDER_ASSIGNED
    const transactionResult = await prisma.$transaction(async (tx) => {
      // Aceita a proposta escolhida
      const accepted = await tx.proposal.update({
        where: { id: proposalId },
        data: { status: ProposalStatus.ACCEPTED },
      });

      // Rejeita todas as outras propostas ativas para este chamado
      await tx.proposal.updateMany({
        where: {
          service_request_id: requestId,
          id: { not: proposalId },
          status: ProposalStatus.PENDING,
        },
        data: { status: ProposalStatus.REJECTED },
      });

      // Atualiza o chamado para PROVIDER_ASSIGNED
      const updatedRequest = await tx.serviceRequest.update({
        where: { id: requestId },
        data: { status: ServiceRequestStatus.PROVIDER_ASSIGNED },
        include: {
          service_type: true,
          customer: {
            include: { user: true },
          },
        },
      });

      return {
        acceptedProposal: accepted,
        updatedRequest,
      };
    });

    return {
      message: 'Proposta aceita e pré-autorização financeira efetuada com sucesso!',
      service_request: transactionResult.updatedRequest,
      accepted_proposal: {
        id: proposal.id,
        provider: {
          id: proposal.provider.id,
          name: proposal.provider.user.email,
          phone: proposal.provider.user.phone,
          asaas_wallet_id: proposal.provider.asaas_wallet_id,
        },
        proposed_price: Number(proposal.proposed_price),
        estimated_arrival_time_mins: proposal.estimated_arrival_time_mins,
        status: ProposalStatus.ACCEPTED,
      },
      payment_authorization: paymentResult,
    };
  }
}

export const proposalsService = new ProposalsService();
