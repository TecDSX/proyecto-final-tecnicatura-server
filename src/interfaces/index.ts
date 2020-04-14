type UserStates = 'connected' | 'disconnect';
export type LoginInput = {
  input: {
    email: string;
    password: string;
  };
};
export type CreateUserInput = {
  input: {
    username: string;
    email: string;
    password: string;
    active?: boolean;
    state?: UserStates;
  };
};
export type UpdateUserInput = {
  userId: string;
  input: {
    username?: string;
    email?: string;
    password?: string;
    active?: boolean;
    state?: UserStates;
  };
};
export type SetUserStateInput = { userId: string; state: UserStates };
export type DeleteUserInput = { userId: string };
