import HttpStatus from 'http-status';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await ticketsService.getTicketTypes();

    res.status(HttpStatus.OK).send(ticketTypes);
  } catch (error) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getUserTicket(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  try {
    const userTicket = await ticketsService.getUserTicket(userId);

    res.status(HttpStatus.OK).send(userTicket);
  } catch (error) {
    if (error.name === 'notFoundError') return res.status(HttpStatus.NOT_FOUND).send(error);
    return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { ticketTypeId }: { ticketTypeId: number } = req.body;

  try {
    const ticket = await ticketsService.postTicket(userId, ticketTypeId);

    res.status(HttpStatus.CREATED).send(ticket);
  } catch (error) {
    if (error.name === 'notFoundError') return res.status(HttpStatus.NOT_FOUND).send(error);
  }
}