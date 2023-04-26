import { Router } from 'express';
import { getReservation } from '@/controllers/bookings-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingsSchema } from '@/schemas/bookings-schemas';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getReservation)
  .post('/', validateBody(bookingsSchema))
  .put('/:bookingId', validateBody(bookingsSchema));

export { bookingsRouter };
