import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectDetails, ProjectEdit, ProjectResponse } from '../models';
import { apiUrl } from '../shared/constants';
import { Observable } from 'rxjs';
import { ProjecRequest } from '../models/project/project-request';
import { ProjectUserAssign } from '../models/project/project-user-assign';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private http: HttpClient) {}

  getAllProjects(
    page: number,
    offset: number,
    sortColumn?: string,
    sortOrder?: string
  ): Observable<ProjectResponse[]> {
    return this.http.post<ProjectResponse[]>(
      `${apiUrl}v1/project/administrator/get-all`,
      {
        page: page,
        offset: offset,
        sortColumn: sortColumn ? sortColumn : '',
        sortOrder: sortOrder ? sortOrder : 'default',
      }
    );
  }

  getAllProjectsWithoutPaging(): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(
      `${apiUrl}v1/project/administrator/get-all-without-paging`
    );
  }

  getProjectByKey(projectKey: string | null): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(
      `${apiUrl}v1/project/get-project-by-key/${projectKey}`
    );
  }

  getById(projectId?: number): Observable<ProjectDetails> {
    return this.http.get<ProjectDetails>(
      `${apiUrl}v1/project/administrator/get-by-id/${projectId}`
    );
  }

  getProjectsWithoutAssignUsers(): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(
      `${apiUrl}v1/project/administrator/get-projects-without-users`
    );
  }

  getProjectsRelatedToCurrentUser(
    page: number,
    offset: number,
    sortColumn?: string,
    sortOrder?: string
  ): Observable<ProjectResponse[]> {
    return this.http.post<ProjectResponse[]>(
      `${apiUrl}v1/project/get-projects-current-user`,
      {
        page: page,
        offset: offset,
        sortColumn: sortColumn ? sortColumn : '',
        sortOrder: sortOrder ? sortOrder : 'default',
      }
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

  removeUserFromProject(
    userId: number,
    projectKey: string | null
  ): Observable<string> {
    return this.http.patch<string>(
      `${apiUrl}v1/project/administrator/remove-user-from-project`,
      {
        userId: userId,
        projectKey: projectKey,
      }
    );
  }

  assignUserToProject(users: any, projectId: any): Observable<string> {
    return this.http.patch<string>(
      `${apiUrl}v1/project/administrator/assign-user-to-project`,
      {
        users: users,
        projectId: projectId,
      }
    );
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(
      `${apiUrl}v1/project/administrator/delete/${projectId}`
    );
  }
}
