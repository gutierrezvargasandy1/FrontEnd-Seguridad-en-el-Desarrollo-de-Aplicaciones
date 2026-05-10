export interface Task {
  id: number;
  name: string;
  description?: string;
  priority: boolean;
  created_at: string;
  user_id: number;
}
