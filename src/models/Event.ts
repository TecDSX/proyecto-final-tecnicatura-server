/* eslint-disable no-unused-vars */
import {
  createSchema,
  typedModel,
  ExtractDoc,
  ExtractProps,
  Type,
} from 'ts-mongoose';

const EVENT_STATUS = ['active', 'cancelled', 'hide', 'finalized'] as const;

export const EventSchema = createSchema(
  {
    name: Type.string({ required: true }),
    location: Type.string({ required: true }),
    startDate: Type.date({ required: true, index: true }),
    endDate: Type.date({ required: true, index: true }),
    startHour: Type.date({ required: true }),
    endHour: Type.date({ required: true }),
    description: Type.string({ required: true }),
    guestsNumber: Type.number({ required: true }),
    created: Type.date({ required: true, index: true }),
    state: Type.string({
      required: true,
      enum: EVENT_STATUS,
      default: EVENT_STATUS[2],
    }),
  },
  { timestamps: { createdAt: true, updateAt: true } }
);

export const Event = typedModel('Event', EventSchema);
export type EventDoc = ExtractDoc<typeof EventSchema>;
export type EventProps = ExtractProps<typeof EventSchema>;
