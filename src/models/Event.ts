/* eslint-disable no-unused-vars */
import {
  createSchema,
  typedModel,
  ExtractDoc,
  ExtractProps,
  Type,
} from 'ts-mongoose';

const EVENT_STATES = ['active', 'cancelled', 'hide', 'finalized'];

export const EventSchema = createSchema(
  {
    name: Type.string({ required: true }),
    location: Type.string({ required: true }),
    startDate: Type.date({ required: true, index: true }),
    endDate: Type.date({ required: true, index: true }),
    description: Type.string({ required: true }),
    guestsNumber: Type.number({ required: true }),
    state: Type.string({
      required: true,
      enum: EVENT_STATES,
      default: EVENT_STATES[2],
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Event = typedModel('Event', EventSchema);
export type EventDoc = ExtractDoc<typeof EventSchema>;
export type EventProps = ExtractProps<typeof EventSchema>;
