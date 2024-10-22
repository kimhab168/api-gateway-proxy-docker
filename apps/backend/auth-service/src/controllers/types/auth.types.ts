export interface SignUpRequest {
  username?: string;
  email: string;
  password: string;
}

export interface VerifyUserRequest {
  username: string;
  code: string;
}
export interface SignInRequest {
  username: string;
  password: string;
}
