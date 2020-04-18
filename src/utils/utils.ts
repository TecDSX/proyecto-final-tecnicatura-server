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

export const autoCompleteEvent = () => {
  setInterval(async () => {
    const dateNow = new Date();
    await Event.updateMany(
      { state: 'active', end: { $lte: dateNow } },
      { $set: { state: 'finalized' } }
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
