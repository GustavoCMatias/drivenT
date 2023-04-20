import { prisma } from './../../config/database';

async function listHotel() {
  return prisma.hotel.findMany({
    include: {
      Rooms: true,
    },
  });
}

async function getHotelRooms(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
  });
}

async function getTicketByUserId(userId: number) {
  return prisma.ticket.findFirst({
    where: {
      Enrollment: {
        User: {
          id: userId,
        },
      },
    },
    include: {
      TicketType: true,
    },
  });
}

async function getHotelByUserId(userId: number) {
  return prisma.hotel.findFirst({
    where: {
      Rooms: {
        some: {
          Booking: {
            some: {
              userId: userId,
            },
          },
        },
      },
    },
  });
}

export default {
  listHotel,
  getHotelRooms,
  getTicketByUserId,
  getHotelByUserId,
};
