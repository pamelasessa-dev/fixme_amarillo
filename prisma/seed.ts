import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@tienda.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@tienda.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  await prisma.producto.createMany({
    data: [
      {
        nombre: 'Refrigeradora 300L',
        descripcion: 'Refrigeradora No Frost de 300 litros.',
        precio: 899.99,
        stock: 10,
      },
      {
        nombre: 'Lavadora 18kg',
        descripcion: 'Lavadora automática de carga superior.',
        precio: 649.5,
        stock: 15,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed completado. Usuario admin: admin@tienda.com / Admin123!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
