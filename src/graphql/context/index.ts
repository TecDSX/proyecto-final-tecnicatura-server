// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { User } from '../../models/User';
import { Event } from '../../models/Event';
const contextReturn = {
  models: {
    User,
    Event,
  },
};
type reqRes = {
  req: Request;
  res: Response;
};
type contextBody = typeof contextReturn & reqRes;
export type Context = contextBody;
export const context = ({ req, res }: { req: Request; res: Response }) =>
  contextReturn;
