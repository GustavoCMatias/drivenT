import Joi from 'joi';
import { CreateAddressParams } from './../repositories/address-repository/index';
import { CardData } from '@/controllers';

type CreatePaymentParams = {
  ticketId: number;
  cardData: CardData;
};

export const paymentSchema = Joi.object<CreatePaymentParams>({
  ticketId: Joi.number().integer().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().integer().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.number().integer().required(),
  }),
});
