import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config';
export const encrypt = (data: any) => {
  return crypto.createHash('sha1').update(data).digest();
};
export const createToken = async (data: any) => {
  const {
    security: { expiresIn, secretKey },
  } = config;
  return jwt.sign({ data: data }, secretKey, { expiresIn });
};
