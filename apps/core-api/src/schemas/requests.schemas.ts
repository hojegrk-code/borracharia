import { z } from 'zod';

export const createServiceRequestSchema = z.object({
  service_type_id: z.string().uuid({ message: 'service_type_id deve ser um UUID válido' }),
  latitude: z
    .number({ required_error: 'latitude é obrigatória' })
    .min(-90, 'Latitude deve ser >= -90')
    .max(90, 'Latitude deve ser <= 90'),
  longitude: z
    .number({ required_error: 'longitude é obrigatória' })
    .min(-180, 'Longitude deve ser >= -180')
    .max(180, 'Longitude deve ser <= 180'),
});

export type CreateServiceRequestInput = z.infer<typeof createServiceRequestSchema>;

export const nearbyRequestsQuerySchema = z.object({
  latitude: z.coerce.number({ required_error: 'latitude é obrigatória' }).min(-90).max(90),
  longitude: z.coerce.number({ required_error: 'longitude é obrigatória' }).min(-180).max(180),
  radius_km: z.coerce.number().positive().default(15),
});

export type NearbyRequestsQueryInput = z.infer<typeof nearbyRequestsQuerySchema>;

export const createProposalSchema = z.object({
  proposed_price: z.coerce
    .number({ required_error: 'proposed_price é obrigatório' })
    .positive('O preço do lance deve ser positivo')
    .min(1.0, 'Preço mínimo é R$ 1,00'),
  estimated_arrival_time_mins: z.coerce
    .number({ required_error: 'estimated_arrival_time_mins é obrigatório' })
    .int('Tempo deve ser um número inteiro de minutos')
    .min(1, 'Tempo mínimo de chegada é 1 minuto')
    .max(360, 'Tempo máximo de chegada é 360 minutos'),
});

export type CreateProposalInput = z.infer<typeof createProposalSchema>;

export const acceptProposalSchema = z.object({
  payment_method: z.enum(['CREDIT_CARD', 'PIX']).default('CREDIT_CARD'),
  credit_card_token: z.string().optional(),
});

export type AcceptProposalInput = z.infer<typeof acceptProposalSchema>;

export const requestIdParamSchema = z.object({
  id: z.string().uuid({ message: 'ID do chamado inválido' }),
});

export const requestAndProposalIdParamSchema = z.object({
  id: z.string().uuid({ message: 'ID do chamado inválido' }),
  proposalId: z.string().uuid({ message: 'ID da proposta inválido' }),
});
