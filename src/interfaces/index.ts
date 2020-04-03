import { models } from '../bin';
export interface iSayHelloInput {
  input: {
    name?: string;
  };
}
export interface iSayHello {
  message: string;
}
export interface iCreateUserInput {
  input: {
    username: string;
    email: string;
    password: string;
    active?: boolean;
    privilege?: string;
  };
}
export interface iLoginInput {
  input: {
    email: string;
    password: string;
  };
}
export interface iLogin {
  token: string;
}
export type tModels = typeof models;
