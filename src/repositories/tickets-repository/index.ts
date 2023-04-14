import { TicketStatus } from '@prisma/client';
import { prisma } from './../../config/database';

async function getTicketTypes() {
  return prisma.ticketType.findMany();
}

async function getUserTicket(id: number) {
  return prisma.ticket.findFirst({
    where: {
      Enrollment: {
        User: {
          id,
        },
      },
    },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function postTicket(ticketTypeId: number, enrollmentId: number) {
  return prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: 'RESERVED',
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketsRepository = {
  getTicketTypes,
  getUserTicket,
  postTicket,
};

export default ticketsRepository;
