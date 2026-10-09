import 'dotenv/config';
import {
  prisma,
  Role,
  ProviderStatus,
  ServiceRequestStatus,
  ProposalStatus,
  Prisma,
} from './index.js';

async function main() {
  console.log('--- [BorracharIA] Teste Operacional de Serviços, Chamados e Lances (Wave 3) ---');

  // 1. Cadastrar/Garantir Serviços Base
  console.log('\n1. Criando tipos de serviços base...');
  const tireChange = await prisma.serviceType.upsert({
    where: { name: 'Troca de Pneu Emergencial' },
    update: {},
    create: {
      name: 'Troca de Pneu Emergencial',
      description: 'Substituição no local por estepe ou pneu novo socorrido',
      estimated_base_price_min: new Prisma.Decimal('80.00'),
      estimated_base_price_max: new Prisma.Decimal('180.00'),
      is_active: true,
    },
  });

  const tireRepair = await prisma.serviceType.upsert({
    where: { name: 'Calibragem e Vulcanização' },
    update: {},
    create: {
      name: 'Calibragem e Vulcanização',
      description: 'Reparo de furos, remendo a frio ou calibragem de emergência',
      estimated_base_price_min: new Prisma.Decimal('40.00'),
      estimated_base_price_max: new Prisma.Decimal('90.00'),
      is_active: true,
    },
  });

  console.log('✔ Serviços base configurados:', [tireChange.name, tireRepair.name]);

  // 2. Criar 1 Cliente
  console.log('\n2. Criando Cliente...');
  const customerUser = await prisma.user.create({
    data: {
      email: `cliente-${Date.now()}@borracharia.com.br`,
      phone: `+55119${Math.floor(10000000 + Math.random() * 90000000)}`,
      role: Role.CUSTOMER,
      customer_profile: {
        create: {},
      },
    },
    include: {
      customer_profile: true,
    },
  });

  const customerProfileId = customerUser.customer_profile!.id;
  console.log('✔ Cliente criado:', {
    userId: customerUser.id,
    email: customerUser.email,
    customerProfileId,
  });

  // 3. Criar 2 Profissionais (Providers)
  console.log('\n3. Criando 2 Profissionais...');
  const provider1User = await prisma.user.create({
    data: {
      email: `borracheiro1-${Date.now()}@borracharia.com.br`,
      phone: `+55118${Math.floor(10000000 + Math.random() * 90000000)}`,
      role: Role.PROVIDER,
      provider_profile: {
        create: {
          status: ProviderStatus.APPROVED,
          asaas_wallet_id: 'wal_asaas_borracheiro_01',
        },
      },
    },
    include: {
      provider_profile: true,
    },
  });

  const provider2User = await prisma.user.create({
    data: {
      email: `borracheiro2-${Date.now()}@borracharia.com.br`,
      phone: `+55117${Math.floor(10000000 + Math.random() * 90000000)}`,
      role: Role.PROVIDER,
      provider_profile: {
        create: {
          status: ProviderStatus.APPROVED,
          asaas_wallet_id: 'wal_asaas_borracheiro_02',
        },
      },
    },
    include: {
      provider_profile: true,
    },
  });

  const provider1ProfileId = provider1User.provider_profile!.id;
  const provider2ProfileId = provider2User.provider_profile!.id;
  console.log('✔ Profissionais criados:', {
    pro1: { email: provider1User.email, id: provider1ProfileId },
    pro2: { email: provider2User.email, id: provider2ProfileId },
  });

  // 4. Cliente cria Chamado de Emergência (ServiceRequest)
  console.log('\n4. Cliente criando Chamado de Emergência (ServiceRequest)...');
  // Coordenadas: Av. Paulista, São Paulo (-23.5615, -46.6560)
  const serviceRequest = await prisma.serviceRequest.create({
    data: {
      customer_id: customerProfileId,
      service_type_id: tireChange.id,
      latitude: -23.5615,
      longitude: -46.656,
      status: ServiceRequestStatus.SEARCHING_PROVIDER,
    },
  });

  console.log('✔ Chamado de Emergência criado:', {
    serviceRequestId: serviceRequest.id,
    service: tireChange.name,
    coords: { lat: serviceRequest.latitude, lng: serviceRequest.longitude },
    status: serviceRequest.status,
  });

  // 5. Profissional 1 envia Lance (Proposal)
  console.log('\n5. Profissional 1 enviando Proposta...');
  const proposal1 = await prisma.proposal.create({
    data: {
      service_request_id: serviceRequest.id,
      provider_id: provider1ProfileId,
      proposed_price: new Prisma.Decimal('120.00'),
      estimated_arrival_time_mins: 15,
      status: ProposalStatus.PENDING,
    },
  });

  // 6. Profissional 2 envia Lance (Proposal)
  console.log('\n6. Profissional 2 enviando Proposta...');
  const proposal2 = await prisma.proposal.create({
    data: {
      service_request_id: serviceRequest.id,
      provider_id: provider2ProfileId,
      proposed_price: new Prisma.Decimal('95.50'),
      estimated_arrival_time_mins: 25,
      status: ProposalStatus.PENDING,
    },
  });

  console.log('✔ Lances recebidos:', [
    {
      id: proposal1.id,
      pro: provider1User.email,
      preco: `R$ ${proposal1.proposed_price.toString()}`,
      tempo: `${proposal1.estimated_arrival_time_mins} min`,
    },
    {
      id: proposal2.id,
      pro: provider2User.email,
      preco: `R$ ${proposal2.proposed_price.toString()}`,
      tempo: `${proposal2.estimated_arrival_time_mins} min`,
    },
  ]);

  // 7. Atualizar status do chamado para PROPOSALS_RECEIVED
  const updatedRequest = await prisma.serviceRequest.update({
    where: { id: serviceRequest.id },
    data: { status: ServiceRequestStatus.PROPOSALS_RECEIVED },
    include: {
      customer: {
        include: { user: true },
      },
      service_type: true,
      proposals: {
        include: {
          provider: {
            include: { user: true },
          },
        },
      },
    },
  });

  console.log('\n7. Consulta Consolidada do Chamado com Propostas:');
  console.log({
    chamadoId: updatedRequest.id,
    servico: updatedRequest.service_type.name,
    status: updatedRequest.status,
    cliente: updatedRequest.customer.user.email,
    totalPropostas: updatedRequest.proposals.length,
    propostas: updatedRequest.proposals.map((p) => ({
      propostaId: p.id,
      prestador: p.provider.user.email,
      preco: Number(p.proposed_price),
      tempoChegadaMins: p.estimated_arrival_time_mins,
      status: p.status,
    })),
  });

  console.log('\n✔ Fluxo operacional validado com sucesso total no banco de dados!');
}

main()
  .catch((e) => {
    console.error('Erro na execução do teste:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
