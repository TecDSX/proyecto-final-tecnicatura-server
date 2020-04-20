import { createSchema, Type, typedModel } from 'ts-mongoose';
export const QuestionStates = ['waiting', 'active', 'complete'] as const;
export const QuestionSchema: any = createSchema(
  {
    startDate: Type.date({ index: true, default: new Date().toISOString() }),
    endDate: Type.date({ index: true }),
    state: Type.string({
      required: true,
      index: true,
      enum: QuestionStates,
      default: QuestionStates[0],
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
export const Question = typedModel('Question', QuestionSchema);
export type Question = typeof Question;
