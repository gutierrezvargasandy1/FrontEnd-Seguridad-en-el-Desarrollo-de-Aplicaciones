export interface User {
  id: number;
  name: string;
  lastname: string;
  username: string;
  email?: string;
  role?: 'ADMIN' | 'CLIENT';  
  created_at: string;
  password?: string;
}