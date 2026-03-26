import { query } from '../config/database';
import { Project } from '../types/models';

export class ProjectRepository {
  async findAllByOwner(ownerId: number): Promise<Project[]> {
    const result = await query('SELECT * FROM projects WHERE owner_id = $1', [ownerId]);
    return result.rows;
  }

  async findById(id: number): Promise<Project | null> {
    const result = await query('SELECT * FROM projects WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(project: Partial<Project>): Promise<Project> {
    const { name, description, owner_id } = project;
    const result = await query(
      'INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, owner_id]
    );
    return result.rows[0];
  }

  async update(id: number, project: Partial<Project>): Promise<Project | null> {
    const { name, description } = project;
    const result = await query(
      'UPDATE projects SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM projects WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
