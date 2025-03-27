export interface JwtResponse {
  jwt: string;
  username:string;
}

export interface resetPassword{
  email:string;
  password:string;
}

export interface ResetResponse
{
  msg:string;
}

export interface User {
  username: string;
  email: string;
  password: string;
}
