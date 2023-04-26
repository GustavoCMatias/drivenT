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

async function getRoomById(roomId: number) {
  return await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
}

async function countBookingsByRoom(roomId: number) {
  return await prisma.booking.count({
    where: {
      roomId,
    },
  });
}

async function postBooking(roomId: number, userId: number) {
  return await prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

async function deleteBooking(bookingId: number) {
  return await prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });
}

async function getBookingById(bookingId: number) {
  return await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
}

export default {
  getReservationByUserId,
  getRoomById,
  countBookingsByRoom,
  postBooking,
  getBookingById,
  deleteBooking,
};
