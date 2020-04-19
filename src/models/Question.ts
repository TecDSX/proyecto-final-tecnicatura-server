import { createSchema, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';
const states = ['waiting', 'active', 'complete'] as const;
export const QuestionSchema: any = createSchema(
  {
    startDate: Type.date({ index: true }),
    endDate: Type.date({}),
    state: Type.string({ required: true, enum: states, default: states[1] }),
    responses: Type.array().of({
      userId: Type.ref(Type.objectId()).to('User', UserSchema),
      response: Type.string(),
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
export const Question = typedModel('Question', QuestionSchema);
export type Question = typeof Question;
