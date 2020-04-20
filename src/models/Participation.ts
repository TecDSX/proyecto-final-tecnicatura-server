import { createSchema, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';
import { EventSchema } from './Event';
export const UserPrivileges = ['guest', 'admin'] as const;
export const ParticipationStates = ['waiting', 'cancelled', 'accepted'] as const;
export const ParticipationSchema: any = createSchema(
  {
    user: Type.ref(Type.objectId({ index: true })).to('User', UserSchema),
    event: Type.ref(Type.objectId({ index: true })).to('Event', EventSchema),
    userPrivilege: Type.string({
      index: true,
      enum: UserPrivileges,
      default: UserPrivileges[0],
    }),
    state: Type.string({
      index: true,
      enum: ParticipationStates,
      default: ParticipationStates[0],
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
export const Participation = typedModel('Participate', ParticipationSchema);
export type Participation = typeof Participation;
