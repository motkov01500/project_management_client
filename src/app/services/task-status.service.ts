import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskStatus } from '../models/task-status';
import { apiUrl } from '../shared/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskStatusService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<TaskStatus[]> {
    return this.http.get<TaskStatus[]>(`${apiUrl}v1/task-status/find-all`);
  }

  //questionable
  findByName(statusName: string): Observable<TaskStatus> {
    return this.http.get<TaskStatus>(
      `${apiUrl}/v1/task-status/find-by-name/${statusName}`
    );
  }
}
