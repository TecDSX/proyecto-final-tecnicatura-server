type UserStates = 'connected' | 'disconnect';
type EventStates = 'active' | 'finalized' | 'cancelled' | 'hidden';
export type LoginInput = {
  input: {
    email: string;
    password: string;
  };
};
// User inputs
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
// Event inputs
export type CreateEventInput = {
  input: {
    name: string;
    location: string;
    start: string;
    end: string;
    description: string;
    state?: EventStates;
  };
};
export type UpdateEventInput = {
  eventId: string;
  input: {
    name: string;
    location: string;
    start: string;
    end: string;
    description: string;
    state?: EventStates;
  };
};
export type SetUserStateInput = { userId: string; state: UserStates };
export type DeleteUserInput = { userId: string };

export type SetEventStateInput = { eventId: string; state: EventStates };
export type DeleteEventInput = { eventId: string };
