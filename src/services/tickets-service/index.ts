import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';

async function getTicketTypes() {
  const ticketTypes = await ticketsRepository.getTicketTypes();
  if (ticketTypes === null) return [];
  return ticketTypes;
}

async function getUserTicket(userId: number) {
  const userTicket = await ticketsRepository.getUserTicket(userId);

  if (userTicket === null) throw notFoundError;

  return userTicket;
}

async function postTicket(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (enrollment === null) throw notFoundError;

  return await ticketsRepository.postTicket(ticketTypeId, enrollment.id);
}

const ticketsService = {
  getTicketTypes,
  getUserTicket,
  postTicket,
};

export default ticketsService;
