// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { User } from '../../models/User';
const contextReturn = {
  models: {
    User,
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
