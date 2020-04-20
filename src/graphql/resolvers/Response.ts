/* eslint-disable no-unused-vars */
import { Context } from '../context';
import {
  CreateResponseInput,
  UpdateResponseInput,
  DeleteResponseInput,
} from '../../interfaces';
import { existsUser } from './User';
import { existsQuestion } from './Question';

export const existsResponse = async (responseId: string, Response: any) => {
  const response = await Response.findById({ _id: responseId });
  if (!response) throw new Error('Response not exists');
};
export default {
  Response: {
    user: async ({ user }: any, _: any, { models: { User } }: Context) =>
      await User.findById({ _id: user }),
  },
  Query: {
    getResponses: async (_: any, __: any, { models: { Response } }: Context) =>
      await Response.find(),
  },
  Mutation: {
    createResponse: async (
      _: any,
      { input: { userId, questionId, value } }: CreateResponseInput,
      { models: { Response, User, Question } }: Context
    ) => {
      await existsQuestion(questionId, Question);
      await existsUser(userId, User);
      const response = await Response.create({
        user: userId,
        questionId,
        value,
      });
      await Question.updateOne(
        {
          _id: questionId,
        },
        { $addToSet: { responses: response._id } }
      );
      return response;
    },

    updateResponse: async (
      _: any,
      { input: { ...data }, responseId }: UpdateResponseInput,
      { models: { Response } }: Context
    ) => {
      await existsResponse(responseId, Response);
      return await Response.findOneAndUpdate(
        { _id: responseId },
        { $set: data },
        (err, doc) => Promise.all([err, doc])
      );
    },

    deleteResponse: async (
      _: any,
      { responseId }: DeleteResponseInput,
      { models: { Response } }: Context
    ) => {
      await existsResponse(responseId, Response);
      await Response.deleteOne({ _id: responseId });
      return true;
    },
  },
};
