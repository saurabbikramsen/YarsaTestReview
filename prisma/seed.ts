import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as argon from 'argon2';

const prisma = new PrismaClient();

const fakeStats = (): any => ({
  experience_point: faker.number.int({ min: 1000, max: 2000 }),
  coins: faker.number.int({ min: 200, max: 500 }),
  games_played: faker.number.int({ min: 30, max: 50 }),
  games_won: faker.number.int({ min: 10, max: 25 }),
});
const fakerUser = () => ({
  name: faker.person.firstName(),
  email: faker.internet.email(),
});

async function main() {
  const fakerRounds = 100;
  dotenv.config();
  console.log('Seeding...');
  for (let i = 0; i < fakerRounds; i++) {
    const stats = await prisma.statistics.create({ data: fakeStats() });
    const data = fakerUser();
    const userData = {
      ...data,
      password: await argon.hash(data.name + '123'),
    };
    await prisma.player.create({
      data: { ...userData, statistics: { connect: { id: stats.id } } },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
