export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  rol: string;
}

export interface RegistroRequest {
  username: string;
  password: string;
  rol: string;
}

export interface Usuario {
  username: string;
  rol: string;
  token: string;
}
