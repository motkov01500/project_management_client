import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskResponse } from '../models/task/task-response';
import { apiUrl } from '../shared/constants';
import { TaskEdit } from '../models/task/task-edit';
import { TaskCreate } from '../models/task/task-create';
import { TaskProgress } from '../models/task/task-update-progress';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(
      `${apiUrl}v1/task/administrator/get-all`
    );
  }

  getById(taskId: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${apiUrl}v1/task/get-by-id/${taskId}`);
  }

  getCurrentUserRelatedTasks(
    projectKey: string | null
  ): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(
      `${apiUrl}v1/task/current-user-project-related/${projectKey}`
    );
  }

  getCurrentProjectTasks(
    projectKey: string | null
  ): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(
      `${apiUrl}v1/task/administrator/get-all-related-to-project/${projectKey}`
    );
  }

  create(newTask: TaskCreate): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(
      `${apiUrl}v1/task/administrator/create`,
      {
        initialEstimation: newTask.initialEstimation,
        projectId: newTask.projectId,
      }
    );
  }

  edit(taskId: number, editedTask: TaskEdit): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(
      `${apiUrl}v1/task/administrator/update/${taskId}`,
      {
        progress: editedTask.progress,
        hoursSpent: editedTask.hoursSpent,
      }
    );
  }

  updateProgress(
    taskId: number,
    newProgress: TaskProgress
  ): Observable<TaskResponse> {
    return this.http.patch<TaskResponse>(
      `${apiUrl}v1/task/update-progress/${taskId}`,
      {
        progress: newProgress.progress,
      }
    );
  }

  assignUserToTask(username: string, taskId: number): Observable<void> {
    return this.http.patch<void>(
      `${apiUrl}v1/task/administrator/assign-user-to-task`,
      {
        username: username,
        taskId: taskId,
      }
    );
  }

  delete(taskId: number): Observable<void> {
    return this.http.delete<void>(
      `${apiUrl}v1/task/administrator/delete/${taskId}`
    );
  }
}
