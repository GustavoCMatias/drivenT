import { notFoundError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payments-repository';

async function postPayment(ticketId: number, issuer: string, cardNumber: string, userId: number) {
  const cardLastDigits = cardNumber.substr(-4);

  const value = await paymentRepository.getValueByTicketId(ticketId);

  if (value === null) throw notFoundError;
  if (value.Enrollment.User.id !== userId) throw unauthorizedError;

  const payment = await paymentRepository.postPayment(ticketId, value.TicketType.price, issuer, cardLastDigits);

  await paymentRepository.updatePaymentOnTicket(ticketId);

  return payment;
}

async function getPaymentInfoByTicketId(ticketId: number, userId: number) {
  const value = await paymentRepository.getValueByTicketId(ticketId);

  if (value === null) throw notFoundError;
  if (value.Enrollment.User.id !== userId) throw unauthorizedError;

  const payment = paymentRepository.getPaymentInfoByTicketId(ticketId);

  return payment;
}
const paymentService = {
  postPayment,
  getPaymentInfoByTicketId,
};

export default paymentService;
