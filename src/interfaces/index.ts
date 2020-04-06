import { models } from '../bin';
type userPrivileges = 'user' | 'admin';
type userStates = 'connected' | 'disconnected';
type eventStates = 'active' | 'cancelled' | 'hide' | 'finalized';
export interface iCreateUserInput {
  input: {
    username: string;
    email: string;
    password: string;
    active?: boolean;
    privilege?: userPrivileges;
    state?: userStates;
  };
}
export interface iUpdateUserInput {
  _id: string;
  input: {
    username?: string;
    email?: string;
    password?: string;
    active?: boolean;
    privilege?: userPrivileges;
    state?: userStates;
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
export interface iEventInput {
  input: {
    name: string;
    location: string;
    startDate: Date;
    endDate: Date;
    description: string;
    guestsNumber: number;
    state: eventStates;
  };
}
export type tModels = typeof models;
