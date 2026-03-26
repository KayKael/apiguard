export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  created_at: Date;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  owner_id: number;
  created_at: Date;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  project_id: number;
  assigned_to?: number;
  due_date?: Date;
  created_at: Date;
}
