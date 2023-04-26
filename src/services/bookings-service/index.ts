import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';

async function getBookingByUserId(userId: number) {
  const reservation = await bookingRepository.getReservationByUserId(userId);
  if (!reservation) throw notFoundError();

  return reservation;
}

export default {
  getBookingByUserId,
};
