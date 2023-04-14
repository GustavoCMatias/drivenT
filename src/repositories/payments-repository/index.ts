import { prisma } from './../../config/database';

async function postPayment(ticketId: number, value: number, cardIssuer: string, cardLastDigits: string) {
  return prisma.payment.create({
    data: {
      ticketId,
      value,
      cardIssuer,
      cardLastDigits,
    },
  });
}

async function getValueByTicketId(ticketId: number) {
  return prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    select: {
      TicketType: {
        select: {
          price: true,
        },
      },
      Enrollment: {
        select: {
          User: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
}

async function updatePaymentOnTicket(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: 'PAID',
    },
  });
}

async function getPaymentInfoByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      Ticket: {
        id: ticketId,
      },
    },
  });
}

const paymentRepository = {
  postPayment,
  getValueByTicketId,
  updatePaymentOnTicket,
  getPaymentInfoByTicketId,
};

export default paymentRepository;
