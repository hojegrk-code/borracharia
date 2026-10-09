import { prisma, Role } from '@borracharia/database';

export function getAdminInfo() {
  return {
    appName: 'BorracharIA Admin Dashboard',
    targetRole: Role.ADMIN,
    dbReady: Boolean(prisma),
  };
}

console.log('BorracharIA Admin Dashboard initialized');
