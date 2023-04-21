import { faker } from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.firstName(),
      image: faker.image.business(),
    },
  });
}

export async function createRooms(hotelId: number) {
  return await prisma.room.create({
    data: {
      name: faker.word.noun(),
      capacity: 5,
      hotelId: hotelId,
    },
  });
}

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}
