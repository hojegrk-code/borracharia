import { prisma, Role } from '@borracharia/database';

export function getCustomerInfo() {
  return {
    appName: 'BorracharIA Customer PWA',
    targetRole: Role.CUSTOMER,
    dbReady: Boolean(prisma),
  };
}

console.log('BorracharIA Customer PWA initialized');
