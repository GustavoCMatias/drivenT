import { TicketStatus } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createHotel,
  createRoomWithHotelId,
  createTicket,
  createTicketTypeRemote,
  createUser,
  createTicketTypeWithHotel,
} from '../factories';
import { createBooking } from '../factories/bookings-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('/GET booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('When token is valid', () => {
    it('Should respond with 404 if user does not have reservation', async () => {
      await createUser();
      const token = await generateValidToken();

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toEqual(404);
    });

    it('Should respond with 200 and booking info', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      await createBooking(user.id, room.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          Room: expect.objectContaining({
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            hotelId: room.hotelId,
            createdAt: room.createdAt.toISOString(),
            updatedAt: room.updatedAt.toISOString(),
          }),
        }),
      );
    });
  });
});

describe('/POST booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('When token is valid', () => {
    it('Should return 400 if body is invalid', async () => {
      const token = await generateValidToken();

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: faker.word.noun() });

      expect(response.statusCode).toEqual(400);
    });
    it('Should return 403 if there is no ticket', async () => {
      const token = await generateValidToken();

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: faker.datatype.number() });

      expect(response.statusCode).toEqual(403);
    });
    it('Should return 403 if wrong ticket type', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: faker.datatype.number() });

      expect(response.statusCode).toEqual(403);
    });
    it('Should return 403 if ticket not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: faker.datatype.number() });

      expect(response.statusCode).toEqual(403);
    });
    it('Should return 404 if room id does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: faker.datatype.number() });

      expect(response.statusCode).toEqual(404);
    });
    it('Should return 403 if room is full', async () => {
      const user = await createUser();
      const user2 = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id, 1);
      await createBooking(user2.id, room.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.statusCode).toEqual(403);
    });
    it('Should return 200 and booking id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.statusCode).toEqual(200);
      expect(response.body.bookingId).toBeGreaterThan(0);
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is valid', () => {
    it('Should return 400 if body is invalid', async () => {
      await createUser();
      const token = await generateValidToken();

      const response = await server
        .put('/booking/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: faker.word.noun() });

      expect(response.statusCode).toEqual(400);
    });
    it('Should return 403 if bookingId does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .put('/booking/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: faker.datatype.number() });

      expect(response.statusCode).toEqual(403);
    });
    it('Should return 403 if sender is not owner of booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id, 1);
      const user2 = await createUser();
      const booking = await createBooking(user2.id, room.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id });

      expect(response.statusCode).toEqual(403);
    });
    it('Should return 403 if new room is equal to previous one', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id, 2);
      const booking = await createBooking(user.id, room.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id });

      expect(response.statusCode).toEqual(403);
    });
    it('Should return 404 if room id does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id, 1);
      const booking = await createBooking(user.id, room.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id + 1 });

      expect(response.statusCode).toEqual(404);
    });
    it('Should return 403 if room is full', async () => {
      const user = await createUser();
      const user2 = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id, 1);
      const room2 = await createRoomWithHotelId(hotel.id, 1);
      const booking = await createBooking(user.id, room2.id);
      await createBooking(user2.id, room.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id });

      expect(response.statusCode).toEqual(403);
    });
    it('Should return 200 and booking id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id, 1);
      const room2 = await createRoomWithHotelId(hotel.id, 2);
      const booking = await createBooking(user.id, room.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room2.id });

      expect(response.statusCode).toEqual(200);
      expect(response.body.bookingId).toBeGreaterThan(booking.id);
    });
  });
});
