export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: UserInfo;
}

export interface ValidateRequest {
  access_token: string;
}

export interface ValidateResponse {
  id: string;
  email: string;
  name: string;
}
