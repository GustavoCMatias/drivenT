import Joi from 'joi';
import { BookingRequestBody } from '@/protocols';

export const bookingsSchema = Joi.object<BookingRequestBody>({
  roomId: Joi.number().greater(0).required(),
});
