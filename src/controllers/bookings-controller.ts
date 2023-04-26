import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/bookings-service';

export async function getReservation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const booking = await bookingsService.getBookingByUserId(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (err) {
    next(err);
  }
}
