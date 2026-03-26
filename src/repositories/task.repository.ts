import { query } from '../config/database';
import { Task } from '../types/models';

export class TaskRepository {
  async findAllByProject(projectId: number): Promise<Task[]> {
    const result = await query('SELECT * FROM tasks WHERE project_id = $1', [projectId]);
    return result.rows;
  }

  async findById(id: number): Promise<Task | null> {
    const result = await query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(task: Partial<Task>): Promise<Task> {
    const { title, description, status, priority, project_id, assigned_to, due_date } = task;
    const result = await query(
      'INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, status || 'TODO', priority || 'MEDIUM', project_id, assigned_to, due_date]
    );
    return result.rows[0];
  }

  async update(id: number, task: Partial<Task>): Promise<Task | null> {
    const { title, description, status, priority, assigned_to, due_date } = task;
    const result = await query(
      'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status), priority = COALESCE($4, priority), assigned_to = COALESCE($5, assigned_to), due_date = COALESCE($6, due_date) WHERE id = $7 RETURNING *',
      [title, description, status, priority, assigned_to, due_date, id]
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM tasks WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
