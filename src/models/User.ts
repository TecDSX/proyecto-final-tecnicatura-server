import { createSchema, Type, typedModel } from 'ts-mongoose';
export const UserSchema = createSchema(
  {
    username: Type.string({ required: true }),
    email: Type.string({ required: true, index: true, unique: true }),
    password: Type.string({ required: true, index: true }),
    active: Type.boolean({ required: true, default: true }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
export const User = typedModel('User', UserSchema);
