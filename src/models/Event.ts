import { createSchema, Type, typedModel } from 'ts-mongoose';
const states = ['active', 'finalized', 'cancelled', 'hidden'] as const;
export const EventSchema = createSchema(
  {
    name: Type.string({ required: true, index: true }),
    location: Type.string({}),
    start: Type.date({ index: true, default: new Date().toISOString() }),
    end: Type.date({ required: true }),
    description: Type.string({}),
    state: Type.string({ required: true, enum: states, default: states[0] }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
export const Event = typedModel('Event', EventSchema);
export type Event = typeof Event;
