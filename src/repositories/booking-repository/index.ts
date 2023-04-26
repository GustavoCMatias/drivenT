import { prisma } from './../../config/database';

async function getReservationByUserId(userId: number) {
  return await prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

export default {
  getReservationByUserId,
};
