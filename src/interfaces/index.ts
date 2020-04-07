/* eslint-disable no-unused-vars */
import { models } from '../bin';
import { UserProps } from '../models/User';
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
    friends?: UserProps[];
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
    friends?: UserProps[];
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
export interface iAddFriend {
  _id: string;
  friendId: string;
}
export interface iAddFriends {
  _id: string;
  friendsIdArray: string[];
}
export type tModels = typeof models;
