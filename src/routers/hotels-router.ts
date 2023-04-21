import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotelRooms, listHotel } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', listHotel).get('/:hotelId', getHotelRooms);

export { hotelsRouter };
