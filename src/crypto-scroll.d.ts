export type APIUser = {
  name: {
    first: string;
    last: string;
  };
  picture: {
    large: string;
  };
  email: string;
};

export type APIMultipleUsersResponse = {
  results: APIUser[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
};