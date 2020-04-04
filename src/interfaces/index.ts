import { models } from '../bin';
type privileges = 'user' | 'admin';
type states = 'connected' | 'disconnected';
export interface iCreateUserInput {
  input: {
    username: string;
    email: string;
    password: string;
    active?: boolean;
    privilege?: privileges;
    state?: states;
  };
}
export interface iUpdateUserInput {
  _id: string;
  input: {
    username?: string;
    email?: string;
    password?: string;
    active?: boolean;
    privilege?: privileges;
    state?: states;
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
