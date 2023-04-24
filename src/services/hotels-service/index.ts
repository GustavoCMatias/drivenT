import { notFoundError } from '@/errors';
import { paymentRequired } from '@/errors/payment-required';
import hotelsRepository from '@/repositories/hotels-repository';

async function listHotel(userId: number) {
  const ticket = await hotelsRepository.getTicketByUserId(userId);
  if (!ticket) throw notFoundError;
  if (ticket.status === 'RESERVED' || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote)
    throw paymentRequired;

  // const hotel = await hotelsRepository.getHotelByUserId(userId);
  // if (!hotel) throw notFoundError;

  return await hotelsRepository.listHotel();
}

async function getHotelRooms(hotelId: number, userId: number) {
  const ticket = await hotelsRepository.getTicketByUserId(userId);
  if (!ticket) throw notFoundError;
  if (ticket.status === 'RESERVED' || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote)
    throw paymentRequired;

  // const hotel = await hotelsRepository.getHotelByUserId(userId);
  // if (!hotel) throw notFoundError;

  const hotelRooms = await hotelsRepository.getHotelRooms(hotelId);
  if (!hotelRooms) throw notFoundError;

  return hotelRooms;
}

export default {
  listHotel,
  getHotelRooms,
};
