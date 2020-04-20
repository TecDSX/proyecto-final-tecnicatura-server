import { createSchema, Type, typedModel } from 'ts-mongoose';
import { QuestionSchema } from './Question';
export const EventStates = [
  'waiting',
  'active',
  'finalized',
  'cancelled',
] as const;
export const EventSchema = createSchema(
  {
    name: Type.string({ required: true, index: true }),
    location: Type.string({}),
    start: Type.date({
      required: true,
      index: true,
      default: new Date().toISOString(),
    }),
    end: Type.date({ required: true, index: true }),
    description: Type.string({}),
    state: Type.string({
      required: true,
      enum: EventStates,
      default: EventStates[0],
      index: true,
    }),
    questions: Type.array({ default: [] }).of(
      Type.ref(Type.objectId()).to('Question', QuestionSchema)
    ),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
export const Event = typedModel('Event', EventSchema);
export type Event = typeof Event;
