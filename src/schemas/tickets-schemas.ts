import Joi from 'joi';

type CreatePostParams = { ticketTypeId: number };

export const ticketSchema = Joi.object<CreatePostParams>({
  ticketTypeId: Joi.number().integer().required(),
});
