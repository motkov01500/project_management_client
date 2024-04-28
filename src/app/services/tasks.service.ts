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
    return this.http.get<TaskResponse>(
      `${apiUrl}v1/task/administrator/get-by-id/${taskId}`
    );
  }

  getCurrentUserRelatedTasks(): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(
      `${apiUrl}v1/task/current-user-related`
    );
  }

  create(newTask: TaskCreate): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(
      `${apiUrl}v1/task/administrator/create`,
      {
        status: newTask.status,
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
        statusName: editedTask.status,
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

  delete(taskId: number): Observable<void> {
    return this.http.delete<void>(
      `${apiUrl}v1/task/administrator/delete/${taskId}`
    );
  }
}
