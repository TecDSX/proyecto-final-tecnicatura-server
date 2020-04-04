/* eslint-disable no-unused-vars */
import {
  createSchema,
  typedModel,
  ExtractDoc,
  ExtractProps,
  Type,
} from 'ts-mongoose';
const privileges = ['user', 'admin'] as const;
const states = ['connected', 'disconnected'] as const;
export const UserSchema = createSchema(
  {
    username: Type.string({ required: true }),
    email: Type.string({ required: true, index: true, unique: true }),
    password: Type.string({ required: true, index: true }),
    active: Type.boolean({ required: true, default: true }),
    privilege: Type.string({
      required: true,
      enum: privileges,
      default: 'user',
    }),
    state: Type.string({
      required: true,
      default: 'disconnected',
      enum: states,
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
export const User = typedModel('User', UserSchema);
export type UserDoc = ExtractDoc<typeof UserSchema>;
export type UserProps = ExtractProps<typeof UserSchema>;
