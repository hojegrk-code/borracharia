import { prisma, Role, ProviderStatus } from '@borracharia/database';

export function getProviderInfo() {
  return {
    appName: 'BorracharIA Provider PWA',
    targetRole: Role.PROVIDER,
    defaultStatus: ProviderStatus.PENDING_REVIEW,
    dbReady: Boolean(prisma),
  };
}

console.log('BorracharIA Provider PWA initialized');
