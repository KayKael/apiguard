import { TaskRepository } from '../repositories/task.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { Task } from '../types/models';

const taskRepository = new TaskRepository();
const projectRepository = new ProjectRepository();

export class TaskService {
  async getTasksByProject(projectId: number, ownerId: number): Promise<Task[]> {
    const project = await projectRepository.findById(projectId);
    if (!project || project.owner_id !== ownerId) {
      throw { status: 403, message: 'Forbidden' };
    }
    return taskRepository.findAllByProject(projectId);
  }

  async getTaskById(id: number, ownerId: number): Promise<Task> {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw { status: 404, message: 'Task not found' };
    }
    const project = await projectRepository.findById(task.project_id);
    if (!project || project.owner_id !== ownerId) {
      throw { status: 403, message: 'Forbidden' };
    }
    return task;
  }

  async createTask(taskData: Partial<Task>, ownerId: number): Promise<Task> {
    const project = await projectRepository.findById(taskData.project_id!);
    if (!project || project.owner_id !== ownerId) {
      throw { status: 403, message: 'Forbidden' };
    }
    return taskRepository.create(taskData);
  }

  async updateTask(id: number, ownerId: number, taskData: Partial<Task>): Promise<Task> {
    await this.getTaskById(id, ownerId);
    const updated = await taskRepository.update(id, taskData);
    return updated!;
  }

  async deleteTask(id: number, ownerId: number): Promise<void> {
    await this.getTaskById(id, ownerId);
    await taskRepository.delete(id);
  }
}
