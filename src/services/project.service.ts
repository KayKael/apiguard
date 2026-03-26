import { ProjectRepository } from '../repositories/project.repository';
import { Project } from '../types/models';

const projectRepository = new ProjectRepository();

export class ProjectService {
  async getProjects(ownerId: number): Promise<Project[]> {
    return projectRepository.findAllByOwner(ownerId);
  }

  async getProjectById(id: number, ownerId: number): Promise<Project> {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw { status: 404, message: 'Project not found' };
    }
    if (project.owner_id !== ownerId) {
      throw { status: 403, message: 'Forbidden' };
    }
    return project;
  }

  async createProject(projectData: Partial<Project>): Promise<Project> {
    return projectRepository.create(projectData);
  }

  async updateProject(id: number, ownerId: number, projectData: Partial<Project>): Promise<Project> {
    const project = await this.getProjectById(id, ownerId);
    const updated = await projectRepository.update(id, projectData);
    return updated!;
  }

  async deleteProject(id: number, ownerId: number): Promise<void> {
    await this.getProjectById(id, ownerId);
    await projectRepository.delete(id);
  }
}
