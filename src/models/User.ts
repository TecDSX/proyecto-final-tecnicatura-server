import { createSchema, Type, typedModel } from 'ts-mongoose';
const states = ['connected', 'disconnect'] as const;
export const UserSchema = createSchema(
  {
    username: Type.string({ required: true }),
    email: Type.string({ required: true, index: true, unique: true }),
    password: Type.string({ required: true, index: true }),
    active: Type.boolean({ required: true, default: true, index: true }),
    state: Type.string({ required: true, enum: states, default: states[1] }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
export const User = typedModel('User', UserSchema);
