import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config';
const {
  security: { expiresIn, secretKey },
} = config;
export const encrypt = (data: any) =>
  crypto.createHash('sha1').update(data).digest();
export const createToken = async (data: any) =>
  jwt.sign({ data: data }, secretKey, { expiresIn });
