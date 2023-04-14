import { Router } from 'express';
import { paymentSchema } from './../schemas/payments-schemas';
import { authenticateToken, validateBody } from '@/middlewares';
import { postPayment, getPaymentInfoByTicketId } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .post('/process', validateBody(paymentSchema), postPayment)
  .get('/', getPaymentInfoByTicketId);

export { paymentsRouter };
