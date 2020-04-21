type UserStates = 'connected' | 'disconnect';
export type EventStates = 'active' | 'finalized' | 'cancelled' | 'hidden';
type QuestionStates = 'waiting' | 'active' | 'complete' | 'deleted';
type ParticipationStates = 'waiting' | 'cancelled' | 'accepted';
type UserPrivileges = 'guest' | 'admin';

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
export type GetEventInput = {
  eventId: string;
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
    questions: string[];
    state?: EventStates;
  };
};

// Question inputs
export type CreateQuestionInput = {
  input: {
    eventId: string;
    endDate: string;
    state?: QuestionStates;
  };
};
export type UpdateQuestionInput = {
  questionId: string;
  input: {
    endDate: string;
    state?: QuestionStates;
  };
};

// Response inputs
export type CreateResponseInput = {
  input: {
    questionId: string;
    userId: string;
    value: string;
  };
};
export type UpdateResponseInput = {
  responseId: string;
  input: {
    value?: string;
  };
};

// Participate inputs
export type CreateParticipationInput = {
  input: {
    userId: string;
    eventId: string;
    userPrivilege?: UserPrivileges;
    state?: ParticipationStates;
  };
};
export type UpdateParticipationInput = {
  participationId: string;
  input: {
    userPrivilege?: UserPrivileges;
    state?: ParticipationStates;
  };
};

export type SetUserStateInput = { userId: string; state: UserStates };
export type DeleteUserInput = { userId: string };

export type SetEventStateInput = { eventId: string; state: EventStates };
export type DeleteEventInput = { eventId: string };

export type SetQuestionStateInput = {
  questionId: string;
  state: QuestionStates;
};
export type DeleteQuestionInput = { questionId: string; eventId: string };

export type DeleteResponseInput = { responseId: string };
