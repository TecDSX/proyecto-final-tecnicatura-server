// eslint-disable-next-line no-unused-vars
import { Request, Response as rs } from 'express';
import { User } from '../../models/User';
import { Event } from '../../models/Event';
import { Question } from '../../models/Question';
import { Response } from '../../models/Response';
import { Participation } from '../../models/Participation';
const contextReturn = {
  models: {
    User,
    Event,
    Question,
    Response,
    Participation,
  },
};
type reqRes = {
  req: Request;
  res: rs;
};
type contextBody = typeof contextReturn & reqRes;
export type Context = contextBody;
export const context = ({ req, res }: { req: Request; res: rs }) =>
  contextReturn;
