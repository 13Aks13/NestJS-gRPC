export interface CreateUserRequest {
  email: string;
  password: string;
  name?: string;
}

export interface GetUserRequest {
  id: string;
}

export interface GetUserByEmailRequest {
  email: string;
}

export interface ListUsersRequest {}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ListUsersResponse {
  users: UserResponse[];
}
