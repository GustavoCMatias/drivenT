import { notFoundError } from '@/errors';
import { noPermission } from '@/errors/no-permission';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getBookingByUserId(userId: number) {
  const reservation = await bookingRepository.getReservationByUserId(userId);
  if (!reservation) throw notFoundError();

  return reservation;
}

async function postBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw noPermission();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw noPermission();

  const room = await bookingRepository.getRoomById(roomId);
  if (!room) throw notFoundError();

  const count = await bookingRepository.countBookingsByRoom(roomId);
  if (room.capacity <= count) throw noPermission();
  const booking = await bookingRepository.postBooking(roomId, userId);
  return booking.id;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const booking = await bookingRepository.getBookingById(bookingId);
  if (!booking || booking.userId !== userId || booking.roomId === roomId) throw noPermission();

  const room = await bookingRepository.getRoomById(roomId);
  if (!room) throw notFoundError();

  const count = await bookingRepository.countBookingsByRoom(roomId);
  if (room.capacity <= count) throw noPermission();

  await bookingRepository.deleteBooking(bookingId);
  const newBooking = await bookingRepository.postBooking(roomId, userId);
  return newBooking.id;
}

export default {
  getBookingByUserId,
  postBooking,
  updateBooking,
};
