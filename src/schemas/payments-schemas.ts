import Joi from 'joi';

type CardData = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

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
