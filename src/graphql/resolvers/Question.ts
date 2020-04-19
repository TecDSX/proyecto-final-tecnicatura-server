/* eslint-disable no-unused-vars */
import { Context } from '../context';
import {
  SetQuestionStateInput,
  CreateQuestionInput,
  UpdateQuestionInput,
  DeleteQuestionInput,
} from '../../interfaces';
import { existsEvent } from './Event';

const existsQuestion = async (questionId: string, Question: any) => {
  const question = await Question.findById({ _id: questionId });
  if (!question) throw new Error('Question not exists');
};

export default {
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
      const question = await Question.findByIdAndUpdate(
        { _id: questionId },
        { $set: { state } },
        (err, doc) => Promise.all([err, doc])
      );
      return !!question || false;
    },

    createQuestion: async (
      _: any,
      { input: { eventId, ...data } }: CreateQuestionInput,
      { models: { Question, Event } }: Context
    ) => {
      await existsEvent(eventId, Event);
      await Event.updateOne(
        {
          _id: eventId,
        },
        { questions: eventId }
      );
      return await Question.create({ ...data });
    },

    updateQuestion: async (
      _: any,
      { input: { ...data }, questionId }: UpdateQuestionInput,
      { models: { Question } }: Context
    ) => {
      await existsQuestion(questionId, Question);
      const questionData = data;
      return await Question.findByIdAndUpdate(
        { _id: questionId },
        { $set: questionData },
        (err, doc) => Promise.all([err, doc])
      );
    },

    deleteQuestion: async (
      _: any,
      { questionId }: DeleteQuestionInput,
      { models: { Question } }: Context
    ) => {
      await existsQuestion(questionId, Question);
      const question = await Question.findByIdAndUpdate(
        { _id: questionId },
        { $set: { state: 'deleted' } },
        (err, doc) => Promise.all([err, doc])
      );
      return !!question || false;
    },
  },
};
