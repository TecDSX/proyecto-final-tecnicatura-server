import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config';

import { Event, EventStates } from '../models/Event';
import { Question, Questionstates } from '../models/Question';

const {
  security: { expiresIn, secretKey },
} = config;
export const encrypt = (data: any) =>
  crypto.createHash('sha1').update(data).digest();
export const createToken = async (data: any) =>
  jwt.sign({ data: data }, secretKey, { expiresIn });

// Handlers

export const EventHandlerFinallizer = () => {
  setInterval(async () => {
    const dateNow = new Date();
    await Event.updateMany(
      {
        state: { $nin: ['finalized', 'cancelled', 'waiting'] },
        startDate: { $gt: dateNow },
      },
      { $set: { state: EventStates[3] } }
    );
    await Event.updateMany(
      {
        state: { $nin: ['finalized', 'cancelled', 'active'] },
        startDate: { $lte: dateNow },
      },
      { $set: { state: EventStates[0] } }
    );
    await Event.updateMany(
      {
        state: { $nin: ['finalized', 'cancelled', 'waiting'] },
        end: { $gt: dateNow },
      },
      { $set: { state: EventStates[1] } }
    );
    // desde aqui
    await Question.updateMany(
      { state: { $nin: ['complete', 'waiting'] }, startDate: { $gt: dateNow } },
      { $set: { state: Questionstates[0] } }
    );
    await Question.updateMany(
      { state: { $nin: ['complete', 'active'] }, startDate: { $lte: dateNow } },
      { $set: { state: Questionstates[1] } }
    );
    await Question.updateMany(
      { state: { $nin: ['complete', 'waiting'] }, endDate: { $gt: dateNow } },
      { $set: { state: Questionstates[2] } }
    );
  }, 1000);
};
