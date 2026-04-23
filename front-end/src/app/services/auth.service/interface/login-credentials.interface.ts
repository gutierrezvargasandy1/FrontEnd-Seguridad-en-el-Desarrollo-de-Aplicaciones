export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  name: string;
  lastname: string;
  username: string;
  password: string;
  email?: string;
}