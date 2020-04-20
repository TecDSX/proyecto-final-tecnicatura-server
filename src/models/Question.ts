import { createSchema, Type, typedModel } from 'ts-mongoose';
import { ResponseSchema } from './Response';
export const Questionstates = ['waiting', 'active', 'complete'] as const;
export const QuestionSchema: any = createSchema(
  {
    startDate: Type.date({ index: true, default: new Date().toISOString() }),
    endDate: Type.date({ index: true }),
    responses: Type.array({ default: [] }).of(
      Type.ref(Type.objectId()).to('Response', ResponseSchema)
    ),
    state: Type.string({
      required: true,
      index: true,
      enum: Questionstates,
      default: Questionstates[0],
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
export const Question = typedModel('Question', QuestionSchema);
export type Question = typeof Question;
