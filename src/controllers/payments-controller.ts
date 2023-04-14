import httpStatus from 'http-status';
import { Response } from 'express';
import { invalidDataError } from '@/errors';
import { AuthenticatedRequest } from '@/middlewares';
import paymentService from '@/services/payments-service';

export type CardData = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId }: { ticketId: number } = req.body;
  const { cardData }: { cardData: CardData } = req.body;

  const userId = req.userId;

  try {
    const payment = await paymentService.postPayment(ticketId, cardData.issuer, cardData.number.toString(), userId);

    res.status(httpStatus.OK).send(payment);
  } catch (err) {
    if (err.name === 'notFoundError') return res.status(httpStatus.NOT_FOUND).send(err);
    if (err.name === 'unauthorizedError') return res.status(httpStatus.UNAUTHORIZED).send(err);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getPaymentInfoByTicketId(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { ticketId } = req.query as Record<string, string>;

  try {
    if (!ticketId) throw invalidDataError;
    const payment = await paymentService.getPaymentInfoByTicketId(Number(ticketId), userId);
    res.status(httpStatus.OK).send(payment);
  } catch (err) {
    if (err.name === 'invalidDataError') return res.status(httpStatus.BAD_REQUEST).send(err);
    if (err.name === 'notFoundError') return res.status(httpStatus.NOT_FOUND).send(err);
    if (err.name === 'unauthorizedError') return res.status(httpStatus.UNAUTHORIZED).send(err);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
