import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config';

import { Event } from '../models/Event';

const {
  security: { expiresIn, secretKey },
} = config;
export const encrypt = (data: any) =>
  crypto.createHash('sha1').update(data).digest();
export const createToken = async (data: any) =>
  jwt.sign({ data: data }, secretKey, { expiresIn });

// Handlers

export const EventHandlerFinallizer = async () => {
  setInterval(async () => {
    const dateNow = new Date().toISOString();
    await Event.update(
      { state: 'active', end: { $lte: dateNow } },
      { $set: { state: 'finalized' } }
    );
  }, 1000);
};
