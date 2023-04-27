import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/booking-service';

export async function getReservation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const booking = await bookingsService.getBookingByUserId(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (err) {
    next(err);
  }
}

export async function postReservation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { roomId } = req.body;
  try {
    const bookingId = await bookingsService.postBooking(userId, roomId);
    return res.status(httpStatus.OK).send({ bookingId });
  } catch (err) {
    next(err);
  }
}

export async function updateReservation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { roomId } = req.body;
  const { bookingId } = req.params;
  try {
    const newBookingId = await bookingsService.updateBooking(userId, roomId, Number(bookingId));
    return res.status(httpStatus.OK).send({ bookingId: newBookingId });
  } catch (err) {
    next(err);
  }
}
