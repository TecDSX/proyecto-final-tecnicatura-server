import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config';

import { Event, EventStates } from '../models/Event';
import { Question, QuestionStates } from '../models/Question';
import { pubsub } from '../graphql/pubsub';

const {
  security: { expiresIn, secretKey },
} = config;

export const encrypt = (data: any) =>
  crypto.createHash('sha1').update(data).digest();

export const createToken = async (data: any) =>
  jwt.sign({ data: data }, secretKey, { expiresIn });
const changeState = async (
  model: any,
  subscriptionEvent: string,
  conditional: object,
  value: object
) => {
  const eventsWillUpdate = await model.find(conditional);
  if (eventsWillUpdate.length > 0)
    eventsWillUpdate.map((element: any) => {
      pubsub.publish(`${subscriptionEvent}`, {
        // @ts-ignore
        [subscriptionEvent]: { ...element._doc, ...value },
      });
    });
  await model.updateMany(conditional, { $set: value });
};
export const autoComplete = () => {
  setInterval(async () => {
    const dateNow = new Date();
    changeState(
      Event,
      'subscribeEvent',
      {
        $and: [
          { state: { $nin: ['cancelled', 'finalized'] } },
          { state: 'active', start: { $gt: dateNow } },
        ],
      },
      { state: EventStates[0] }
    );
    changeState(
      Event,
      'subscribeEvent',
      {
        $and: [
          { state: { $nin: ['cancelled', 'finalized'] } },
          { state: 'waiting', start: { $lte: dateNow } },
        ],
      },
      { state: EventStates[1] }
    );
    changeState(
      Event,
      'subscribeEvent',
      {
        $and: [
          { state: { $nin: ['cancelled', 'finalized'] } },
          { state: 'active', end: { $lt: dateNow } },
        ],
      },
      { state: EventStates[2] }
    );
    changeState(
      Question,
      'subscribeQuestion',
      { state: 'active', startDate: { $gt: dateNow } },
      { state: QuestionStates[0] }
    );
    changeState(
      Question,
      'subscribeQuestion',
      { state: 'waiting', startDate: { $lte: dateNow } },
      { $set: { state: QuestionStates[1] } }
    );
    changeState(
      Question,
      'subscribeQuestion',
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
