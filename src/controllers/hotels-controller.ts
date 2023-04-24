import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function listHotel(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const result = await hotelsService.listHotel(userId);
    res.status(200).send(result);
  } catch (err) {
    if (err.name === 'notFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (err.name === 'paymentRequired') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params as Record<string, string>;
  const userId = req.userId;
  try {
    const result = await hotelsService.getHotelRooms(Number(hotelId), userId);
    res.status(200).send(result);
  } catch (err) {
    if (err.name === 'notFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (err.name === 'paymentRequired') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
