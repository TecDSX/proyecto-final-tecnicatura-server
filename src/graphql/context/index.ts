// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
const contextReturn = {};
type reqRes = {
  req: Request;
  res: Response;
};
type contextBody = typeof contextReturn & reqRes;
export type tContext = contextBody;
export const context = ({ req, res }: { req: Request; res: Response }) =>
  contextReturn;
