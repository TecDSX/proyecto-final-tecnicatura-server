import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config';

import { Event, EventStates } from '../models/Event';
import { Question, QuestionStates } from '../models/Question';

const {
  security: { expiresIn, secretKey },
} = config;

export const encrypt = (data: any) =>
  crypto.createHash('sha1').update(data).digest();

export const createToken = async (data: any) =>
  jwt.sign({ data: data }, secretKey, { expiresIn });

export const autoComplete = () => {
  setInterval(async () => {
    const dateNow = new Date();
    await Event.updateMany(
      {
        state: 'active',
        start: { $gt: dateNow },
      },
      { $set: { state: EventStates[0] } }
    );
    await Event.updateMany(
      {
        state: 'waiting',
        start: { $lte: dateNow },
      },
      { $set: { state: EventStates[1] } }
    );
    await Event.updateMany(
      {
        state: 'active',
        end: { $lt: dateNow },
      },
      { $set: { state: EventStates[2] } }
    );
    await Question.updateMany(
      { state: 'active', startDate: { $gt: dateNow } },
      { $set: { state: QuestionStates[0] } }
    );
    await Question.updateMany(
      { state: 'waiting', startDate: { $lte: dateNow } },
      { $set: { state: QuestionStates[1] } }
    );
    await Question.updateMany(
      { state: 'active', endDate: { $lt: dateNow } },
      { $set: { state: QuestionStates[2] } }
    );
  }, 1000);
};
// Compare that dateNow less or equal than date param
export const dateGreaterThanDate = (firstDate: string, secondDate: string) => {
  return new Date(firstDate).getTime() > new Date(secondDate).getTime();
};
export const dateEqualThanDate = (firstDate: string, secondDate: string) => {
  return new Date(firstDate).getTime() === new Date(secondDate).getTime();
};
export const dateGreaterOrEqualThanDate = (
  firstDate: string,
  secondDate: string
) => {
  return new Date(firstDate).getTime() >= new Date(secondDate).getTime();
};
