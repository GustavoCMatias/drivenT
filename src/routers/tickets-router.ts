import { Router } from 'express';
import { ticketSchema } from './../schemas/tickets-schemas';
import { getTicketTypes, getUserTicket, postTicket } from '@/controllers/tickets-controller';
import { authenticateToken, validateBody } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketTypes)
  .get('/', getUserTicket)
  .post('/', validateBody(ticketSchema), postTicket);

export { ticketsRouter };
