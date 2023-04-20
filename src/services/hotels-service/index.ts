import { notFoundError } from '@/errors';
import { paymentRequired } from '@/errors/payment-required';
import hotelsRepository from '@/repositories/hotels-repository';

async function listHotel(userId: number) {
  const ticket = await hotelsRepository.getTicketByUserId(userId);
  if (!ticket) throw notFoundError;
  if (ticket.status === 'RESERVED' || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote)
    throw paymentRequired;

  const hotel = await hotelsRepository.getHotelByUserId(userId);
  if (!hotel) throw notFoundError;

  return await hotelsRepository.listHotel();
}

async function getHotelRooms(hotelId: number, userId: number) {
  const ticket = await hotelsRepository.getTicketByUserId(userId);
  if (!ticket) throw notFoundError;
  if (ticket.status === 'RESERVED' || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote)
    throw paymentRequired;

  const hotel = await hotelsRepository.getHotelByUserId(userId);
  if (!hotel) throw notFoundError;

  return await hotelsRepository.getHotelRooms(hotelId);
}

export default {
  listHotel,
  getHotelRooms,
};
