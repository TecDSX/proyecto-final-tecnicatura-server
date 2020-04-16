import { createSchema, Type, typedModel } from 'ts-mongoose';
const states = ['active', 'finalized', 'cancelled', 'hidden'] as const;
export const EventSchema = createSchema(
  {
    name: Type.string({ required: true, index: true }),
    location: Type.string({ required: true }),
    start: Type.string({ required: true, index: true }),
    end: Type.string({ required: true }),
    description: Type.string({ required: true }),
    guestsNumber: Type.number({ required: true }),
    state: Type.string({ required: true, enum: states, default: states[0] }),
    active: Type.boolean({ required: true, default: true, index: true }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
export const Event = typedModel('Event', EventSchema);
