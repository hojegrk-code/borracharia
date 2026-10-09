import 'dotenv/config';
import { prisma, Role, ProviderStatus } from './index.js';

async function main() {
  console.log('Testing Prisma database connection and CRUD operations...');

  // 1. Create a User with Customer Profile
  const customerUser = await prisma.user.create({
    data: {
      email: `customer-${Date.now()}@borracharia.com.br`,
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

  console.log('✔ Created Customer User:', {
    id: customerUser.id,
    email: customerUser.email,
    profileId: customerUser.customer_profile?.id,
  });

  // 2. Create Vehicle Types
  const moto = await prisma.vehicleType.upsert({
    where: { name: 'Moto' },
    update: {},
    create: { name: 'Moto' },
  });

  const carro = await prisma.vehicleType.upsert({
    where: { name: 'Veículo de Passeio' },
    update: {},
    create: { name: 'Veículo de Passeio' },
  });

  // 3. Create a User with Provider Profile and N:M Vehicle Types
  const providerUser = await prisma.user.create({
    data: {
      email: `provider-${Date.now()}@borracharia.com.br`,
      phone: `+55118${Math.floor(10000000 + Math.random() * 90000000)}`,
      role: Role.PROVIDER,
      provider_profile: {
        create: {
          status: ProviderStatus.PENDING_REVIEW,
          cnh_url: null, // Nullable as per requirements
          tools_photo_url: null, // Nullable
          validation_video_url: null, // Nullable
          asaas_wallet_id: 'wal_dummy_asaas_123456',
          vehicle_types: {
            create: [{ vehicle_type_id: moto.id }, { vehicle_type_id: carro.id }],
          },
        },
      },
    },
    include: {
      provider_profile: {
        include: {
          vehicle_types: {
            include: {
              vehicle_type: true,
            },
          },
        },
      },
    },
  });

  console.log('✔ Created Provider User with N:M Vehicle Types:', {
    id: providerUser.id,
    email: providerUser.email,
    providerProfileId: providerUser.provider_profile?.id,
    status: providerUser.provider_profile?.status,
    asaasWalletId: providerUser.provider_profile?.asaas_wallet_id,
    vehicleTypes: providerUser.provider_profile?.vehicle_types.map((vt) => vt.vehicle_type.name),
  });

  console.log('✔ Database and ORM test completed successfully!');
}

main()
  .catch((e) => {
    console.error('Database test error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
