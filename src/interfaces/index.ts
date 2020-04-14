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
  };
};
export type UpdateUser = (
  patern: any,
  args: {
    userId: string;
    input: {
      username?: string;
      email?: string;
      password?: string;
      active?: boolean;
    };
  },
  context: any
) => undefined;
