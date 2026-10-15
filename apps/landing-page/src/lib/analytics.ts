'use client';

// Declaração de tipos globais para fbq e dataLayer
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    dataLayer?: Array<Record<string, any>>;
  }
}

/**
 * Dispara evento padrão ou personalizado no Meta Pixel (Facebook Ads)
 */
export function trackMetaPixel(
  event:
    | 'PageView'
    | 'Lead'
    | 'CompleteRegistration'
    | 'InitiateCheckout'
    | 'Contact'
    | 'Search'
    | string,
  params?: Record<string, any>,
) {
  if (typeof window !== 'undefined') {
    if (typeof window.fbq === 'function') {
      window.fbq('track', event, params);
      console.log(`[Meta Pixel] Evento enviado: ${event}`, params);
    } else {
      // Log em desenvolvimento ou caso o script ainda esteja carregando
      console.log(`[Meta Pixel Dev] Evento simulado: ${event}`, params);
    }
  }
}

/**
 * Dispara evento no dataLayer do Google Tag Manager / GA4
 */
export function trackGTM(event: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...params });
      console.log(`[GTM] Evento enviado: ${event}`, params);
    } else {
      console.log(`[GTM Dev] Evento simulado: ${event}`, params);
    }
  }
}

/**
 * Evento de Lead (Quando o borracheiro clica em 'Quero ser um Parceiro' ou inicia o fluxo)
 */
export function trackLead(source = 'Landing Page', details?: Record<string, any>) {
  trackMetaPixel('Lead', {
    content_name: 'Interesse em Parceria BorracharIA',
    content_category: 'Borracheiro / Socorrista',
    source,
    currency: 'BRL',
    ...details,
  });

  trackGTM('lead_partner_click', {
    category: 'Parceria',
    source,
    ...details,
  });
}

/**
 * Evento de Conclusão de Cadastro (Quando o prestador conclui o formulário de adesão)
 */
export function trackCompleteRegistration(role = 'PROVIDER', details?: Record<string, any>) {
  trackMetaPixel('CompleteRegistration', {
    content_name:
      role === 'PROVIDER' ? 'Cadastro de Borracheiro Concluído' : 'Cadastro de Motorista Concluído',
    status: 'success',
    role,
    ...details,
  });

  trackGTM('complete_registration', {
    role,
    status: 'success',
    ...details,
  });
}

/**
 * Evento de Início de Solicitação (Quando o motorista clica em Solicitar Socorro)
 */
export function trackInitiateEmergency(serviceName: string, estimatedPrice?: number) {
  trackMetaPixel('InitiateCheckout', {
    content_name: serviceName,
    content_category: 'Emergência de Pneu',
    value: estimatedPrice || 0,
    currency: 'BRL',
  });

  trackGTM('initiate_emergency_request', {
    service_name: serviceName,
    estimated_price: estimatedPrice || 0,
  });
}

/**
 * Evento de Contato / Clique em Suporte
 */
export function trackContact(channel = 'WhatsApp') {
  trackMetaPixel('Contact', {
    channel,
  });

  trackGTM('contact_click', {
    channel,
  });
}
