export interface PreAuthorizeParams {
  customerId: string;
  amount: number;
  creditCardToken?: string | undefined;
  serviceRequestId: string;
}

export interface PreAuthorizeResponse {
  success: boolean;
  transactionId: string;
  status: 'AUTHORIZED' | 'FAILED';
  amount: number;
  authorizedAt: string;
  gateway: 'ASAAS';
  message: string;
}

export interface GeneratePixParams {
  customerId: string;
  amount: number;
  serviceRequestId: string;
}

export interface GeneratePixResponse {
  success: boolean;
  txId: string;
  pixCopyPaste: string;
  qrCodeUrl: string;
  expiresInMinutes: number;
  amount: number;
  gateway: 'ASAAS';
}

class AsaasPaymentService {
  /**
   * Simula a pré-autorização (retenção / hold) de saldo no cartão de crédito
   * seguindo o modelo Uber de marketplace emergencial.
   */
  async preAuthorizeCreditCard(params: PreAuthorizeParams): Promise<PreAuthorizeResponse> {
    const transactionId = `asaas_hold_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const formattedAmount = params.amount.toFixed(2);

    console.log(
      `\x1b[36m[Asaas Mock]\x1b[0m Iniciando pré-autorização (Hold) no cartão para cliente [${params.customerId}]...`,
    );
    console.log(
      `\x1b[36m[Asaas Mock]\x1b[0m Valor retido: R$ ${formattedAmount} para o chamado [${params.serviceRequestId}].`,
    );

    // Simula latência de rede do gateway
    await new Promise((resolve) => setTimeout(resolve, 80));

    console.log(
      `\x1b[32m[Asaas Mock] ✔ Pré-autorização APROVADA!\x1b[0m ID da Transação: ${transactionId} (Saldo retido até conclusão do serviço)`,
    );

    return {
      success: true,
      transactionId,
      status: 'AUTHORIZED',
      amount: params.amount,
      authorizedAt: new Date().toISOString(),
      gateway: 'ASAAS',
      message: 'Pré-autorização realizada com sucesso. Saldo retido no cartão do cliente.',
    };
  }

  /**
   * Simula a geração de cobrança imediata via Pix Copia e Cola.
   */
  async generatePixCopyPaste(params: GeneratePixParams): Promise<GeneratePixResponse> {
    const txId = `pix_asaas_${Date.now()}`;
    const formattedAmount = params.amount.toFixed(2);

    console.log(
      `\x1b[36m[Asaas Mock]\x1b[0m Gerando cobrança Pix dinâmico para cliente [${params.customerId}], valor R$ ${formattedAmount}...`,
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const pixPayload = `00020101021226840014br.gov.bcb.pix2562pix-borracharia-mock.asaas.com/qr/v2/${txId}5204000053039865406${formattedAmount}5802BR5911BORRACHARIA6009SAO PAULO62070503***6304ABCD`;

    console.log(`\x1b[32m[Asaas Mock] ✔ Pix gerado com sucesso!\x1b[0m txId: ${txId}`);

    return {
      success: true,
      txId,
      pixCopyPaste: pixPayload,
      qrCodeUrl: `https://mock.asaas.com/qr/${txId}.png`,
      expiresInMinutes: 15,
      amount: params.amount,
      gateway: 'ASAAS',
    };
  }
}

export const asaasService = new AsaasPaymentService();
