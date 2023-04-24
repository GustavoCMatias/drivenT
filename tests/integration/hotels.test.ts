import { TicketStatus, User, Enrollment, Address, Hotel } from '@prisma/client';
import supertest from 'supertest';
import { createUser, createEnrollmentWithAddress, createTicketType, createTicket } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createBooking, createHotel, createRooms } from '../factories/hotels-factory';
import app, { init } from '@/app';
import { prisma } from '@/config';

const api = supertest(app);

beforeAll(async () => {
  await init();
  await cleanDb();
});

let user: User,
  token: string,
  enrollment: Enrollment & {
    Address: Address[];
  };
describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await api.get('/hotels');

    expect(response.status).toBe(401);
  });
  it('Should return 404 when there is no ticket associated with id', async () => {
    user = await createUser();
    token = await generateValidToken(user);

    const resultado = await api.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(resultado.statusCode).toBe(404);
  });
  //   it('Should return 404 when there is no hotel associated with id', async () => {
  //     enrollment = await createEnrollmentWithAddress(user);
  //     const ticketType = await createTicketType(false, true);
  //     await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

  //     const resultado = await api.get('/hotels').set('Authorization', `Bearer ${token}`);
  //     expect(resultado.statusCode).toBe(404);
  //   });
  it('Should return 402 when ticket doesnt fit requirements', async () => {
    await prisma.ticket.deleteMany({});
    await prisma.ticketType.deleteMany({});
    enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const resultado = await api.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(resultado.statusCode).toBe(402);
  });
  it('Should return 200 and list of hotels when all is correct', async () => {
    await prisma.ticket.deleteMany({});
    await prisma.ticketType.deleteMany({});
    const ticketType = await createTicketType(false, true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    const room = await createRooms(hotel.id);
    await createBooking(user.id, room.id);

    const resultado = await api.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(resultado.statusCode).toBe(200);
    expect(resultado.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          image: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          Rooms: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              capacity: expect.any(Number),
              hotelId: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
        }),
      ]),
    );
  });
});

let hotel: Hotel;
describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    await cleanDb();
    const response = await api.get('/hotels/1');

    expect(response.status).toBe(401);
  });
  it('Should return 404 when there is no ticket associated with id', async () => {
    user = await createUser();
    token = await generateValidToken(user);

    const resultado = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(resultado.statusCode).toBe(404);
  });
  //   it('Should return 404 when there is no hotel associated with id', async () => {
  //     enrollment = await createEnrollmentWithAddress(user);
  //     const ticketType = await createTicketType(false, true);
  //     await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

  //     const resultado = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);
  //     expect(resultado.statusCode).toBe(404);
  //   });
  it('Should return 402 when ticket doesnt fit requirements', async () => {
    await prisma.ticket.deleteMany({});
    await prisma.ticketType.deleteMany({});
    enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const resultado = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(resultado.statusCode).toBe(402);
  });
  it('Should return 404 when hotelId does not exist', async () => {
    await prisma.ticket.deleteMany({});
    await prisma.ticketType.deleteMany({});
    const ticketType = await createTicketType(false, true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    hotel = await createHotel();
    const resultado = await api.get(`/hotels/${hotel.id + 1}`).set('Authorization', `Bearer ${token}`);
    expect(resultado.statusCode).toBe(404);
  });

  it('Should return 200 and list of hotels when all is correct', async () => {
    const room = await createRooms(hotel.id);
    await createBooking(user.id, room.id);

    const resultado = await api.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(resultado.statusCode).toBe(200);
    expect(resultado.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        image: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Rooms: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            capacity: expect.any(Number),
            hotelId: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      }),
    );
  });
});
