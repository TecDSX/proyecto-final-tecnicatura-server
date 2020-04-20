import { createSchema, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';
export const ResponseSchema = createSchema(
  {
    user: Type.ref(Type.objectId({ unique: true })).to('User', UserSchema),
    value: Type.string(),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Response = typedModel('Response', ResponseSchema);
export type Response = typeof Response;
