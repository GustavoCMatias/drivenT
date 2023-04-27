import { Router } from 'express';
import { getReservation, postReservation, updateReservation } from '@/controllers/booking-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingsSchema } from '@/schemas/bookings-schemas';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getReservation)
  .post('/', validateBody(bookingsSchema), postReservation)
  .put('/:bookingId', validateBody(bookingsSchema), updateReservation);

export { bookingsRouter };
