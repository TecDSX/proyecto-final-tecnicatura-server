// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
const contextReturn = {
  user: 'lol',
};
export const context = ({ req, res }: { req: Request; res: Response }) =>
  contextReturn;
export type tContext = typeof contextReturn;
