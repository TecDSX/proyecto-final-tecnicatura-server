/* eslint-disable no-unused-vars */
import { Context } from '../context';
import {
  SetQuestionStateInput,
  CreateQuestionInput,
  UpdateQuestionInput,
  DeleteQuestionInput,
} from '../../interfaces';
import { existsEvent } from './Event';
import { dateGreaterOrEqualThanDate } from '../../utils/utils';
import { Question } from '../../models/Question';
import { withFilter } from 'graphql-yoga';
import { pubsub } from '../pubsub';

export const existsQuestion = async (questionId: string, Question: any) => {
  const question = await Question.findById({ _id: questionId });
  if (!question) throw new Error('Question not exists');
  if (question.state === 'complete')
    throw new Error('You can not update complete Questions');
};
const existsQuestionInEvent = async (
  questionId: string,
  eventId: string,
  Event: any
) => {
  const event = await Event.findOne({ _id: eventId, questions: questionId });
  if (!event) throw new Error('Question not exists in Event');
};
export default {
  Question: {
    responses: async (
      { responses }: any,
      _: any,
      { models: { Response } }: Context
    ) => await Response.find({ _id: responses }),
  },
  Query: {
    getQuestions: async (_: any, __: any, { models: { Question } }: Context) =>
      await Question.find(),
  },
  Mutation: {
    setQuestionState: async (
      _: any,
      { state, questionId }: SetQuestionStateInput,
      { models: { Question } }: Context
    ) => {
      await existsQuestion(questionId, Question);
      const question = await Question.findOneAndUpdate(
        { _id: questionId },
        { $set: { state } },
        (err, doc) => Promise.all([err, doc])
      );
      pubsub.publish('subscribeQuestion', { subscribeQuestion: question });
      return !!question || false;
    },

    createQuestion: async (
      _: any,
      { input: { eventId, ...data } }: CreateQuestionInput,
      { models: { Question, Event } }: Context
    ) => {
      await existsEvent(eventId, Event);
      if (data.endDate.length <= 0) throw new Error('EndDate can not be null');
      if (!dateGreaterOrEqualThanDate(data.endDate, new Date().toString()))
        throw new Error('Event can not end in this date');
      const question = await Question.create({ ...data });
      await Event.updateOne(
        {
          _id: eventId,
        },
        { $addToSet: { questions: question._id } }
      );
      return question;
    },

    updateQuestion: async (
      _: any,
      { input: { ...data }, questionId }: UpdateQuestionInput,
      { models: { Question } }: Context
    ) => {
      await existsQuestion(questionId, Question);
      if (data.endDate.length <= 0) throw new Error('EndDate can not be null');
      if (
        data.endDate &&
        !dateGreaterOrEqualThanDate(data.endDate, new Date().toString())
      )
        throw new Error('Event can not end in this date');
      const questionData = data;
      const question = await Question.findByIdAndUpdate(
        { _id: questionId },
        { $set: questionData },
        (err, doc) => Promise.all([err, doc])
      );
      pubsub.publish('subscribeQuestion', { subscribeQuestion: question });
      return question;
    },

    deleteQuestion: async (
      _: any,
      { questionId, eventId }: DeleteQuestionInput,
      { models: { Question, Event } }: Context
    ) => {
      await existsEvent(eventId, Event);
      await existsQuestion(questionId, Question);
      await existsQuestionInEvent(questionId, eventId, Event);
      await Event.updateOne(
        { _id: eventId },
        { $pull: { questions: questionId } }
      );
      pubsub.publish('subscribeDeleteQuestion', {
        subscribeDeleteQuestion: { _id: questionId, deleted: true },
      });
      await Question.deleteOne({ _id: questionId });
      return true;
    },
  },
  Subscription: {
    subscribeQuestion: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('subscribeQuestion'),
        ({ subscribeQuestion: { _id } }, { questionId }) => {
          return String(_id) === String(questionId);
        }
      ),
    },
    subscribeDeleteQuestion: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('subscribeDeleteQuestion'),
        ({ subscribeDeleteQuestion: { _id } }, { questionId }) => {
          return String(_id) === String(questionId);
        }
      ),
    },
  },
};
