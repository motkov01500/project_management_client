import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectEdit, ProjectResponse } from '../models';
import { apiUrl } from '../shared/constants';
import { Observable } from 'rxjs';
import { ProjecRequest } from '../models/project/project-request';
import { ProjectUserAssign } from '../models/project/project-user-assign';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(
      `${apiUrl}v1/project/administrator/get-all`
    );
  }

  getById(projectId: number): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(
      `${apiUrl}v1/project/administrator/get-by-id/${projectId}`
    );
  }

  getProjectsWithoutAssignUsers(): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(
      `${apiUrl}v1/project/administrator/get-projects-without-users`
    );
  }

  getProjectsRelatedToCurrentUser(): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(
      `${apiUrl}v1/project/get-projects-current-user`
    );
  }

  createProject(newProject: ProjecRequest): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(
      `${apiUrl}v1/project/administrator/create`,
      {
        key: newProject.key,
        title: newProject.title,
      }
    );
  }

  editProject(
    editedProject: ProjectEdit,
    projectId: number
  ): Observable<ProjectResponse> {
    return this.http.put<ProjectResponse>(
      `${apiUrl}v1/project/administrator/update/${projectId}`,
      {
        key: editedProject.key,
        title: editedProject.title,
      }
    );
  }

  assignUserToProject(assign: ProjectUserAssign): Observable<string> {
    return this.http.patch<string>(
      `${apiUrl}v1/project/administrator/assign-user-to-project`,
      {
        userId: assign.userId,
        projectId: assign.projectId,
      }
    );
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(
      `${apiUrl}v1/project/administrator/delete/${projectId}`
    );
  }
}
