import { PrismaClient } from '@prisma/client';
import { Location, User } from './mock.js';

const prisma = new PrismaClient();

async function main(){
    //기존 데이터 삭제
    
    // Review가 존재하는 경우에만 삭제
    const reviewCount = await prisma.review.count();
    if (reviewCount > 0) {
        await prisma.review.deleteMany();
    }
    await prisma.location.deleteMany();
    await prisma.user.deleteMany();

    //목 데이터 삽입
    await prisma.location.createMany({
        data: Location,
        skipDuplicates: true,
    });
    await prisma.user.createMany({
        data: User,
        skipDuplicates: true,
    });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });