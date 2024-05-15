import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../shared/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SizeService {
  constructor(private http: HttpClient) {}

  getProjectsRelatedToCurrentUserSize(): Observable<number> {
    return this.http.get<number>(
      `${apiUrl}v1/project/get-projects-current-user-size`
    );
  }

  getUsersRelatedToMeetingSize(meetingId: any): Observable<number> {
    return this.http.get<number>(
      `${apiUrl}v1/user/get-all-related-to-meeting-size/${meetingId}`
    );
  }

  getRelatedToProjectSize(projectKey: string | null): Observable<number> {
    return this.http.get<number>(
      `${apiUrl}v1/user/get-all-related-to-project-size/${projectKey}`
    );
  }

  getUsersRelatedToTaskSize(taskId: any): Observable<number> {
    return this.http.get<number>(
      `${apiUrl}v1/user/get-all-related-to-task-size/${taskId}`
    );
  }

  getTasksCurrentUserRelatedTasksSize(
    projectKey: string | null
  ): Observable<number> {
    return this.http.get<number>(
      `${apiUrl}v1/task/current-user-project-related-size/${projectKey}`
    );
  }

  getCurrentUserMeetingsSize(projectKey: string | null): Observable<number> {
    return this.http.get<number>(
      `${apiUrl}v1/meeting/get-current-user-meetings-size/${projectKey}`
    );
  }

  getUsersRelatedToMeeting(meetingId: number | null): Observable<number> {
    return this.http.get<number>(
      `${apiUrl}v1/user/get-all-related-to-meeting-size/${meetingId}`
    );
  }

  getAllUsersSize(): Observable<number> {
    return this.http.get<number>(`${apiUrl}v1/user/administrator/get-all-size`);
  }

  getAllProjectsSize(): Observable<number> {
    return this.http.get<number>(
      `${apiUrl}v1/project/administrator/get-all-size`
    );
  }

  getCurrentProjectMeetingsSize(projectKey: string | null): Observable<number> {
    return this.http.get<number>(
      `${apiUrl}v1/meeting/get-all-related-to-project-size/${projectKey}`
    );
  }

  getCurrentProjectTasksSize(projectKey: string | null): Observable<number> {
    return this.http.get<number>(
      `${apiUrl}v1/task/administrator/get-all-related-to-project-size/${projectKey}`
    );
  }
}
