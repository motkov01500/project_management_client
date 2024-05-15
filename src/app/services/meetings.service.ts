import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MeetingResponse } from '../models/meeting/meeting-response';
import { apiUrl } from '../shared/constants';
import { MeetingEdit } from '../models/meeting/meeting-edit';
import { MeetingCreate } from '../models/meeting/meeting-create';
import { TaskResponse } from '../models/task/task-response';

@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<MeetingResponse[]> {
    return this.http.get<MeetingResponse[]>(
      `${apiUrl}v1/meeting/administrator/get-all`
    );
  }

  getCurrentProjectMeetings(
    projectKey: string | null,
    page: number,
    offset: number
  ): Observable<MeetingResponse[]> {
    return this.http.get<MeetingResponse[]>(
      `${apiUrl}v1/meeting/get-all-related-to-project/${projectKey}/${page}/${offset}`
    );
  }

  getById(meetingId: number): Observable<MeetingResponse> {
    return this.http.get<MeetingResponse>(
      `${apiUrl}v1/meeting/administrator/get-by-id/${meetingId}`
    );
  }

  getUnfinishedMeetings(projectKey: string): Observable<MeetingResponse[]> {
    return this.http.get<MeetingResponse[]>(
      `${apiUrl}v1/meeting/get-unfinished/${projectKey}`
    );
  }

  getCurrentUserMeetings(
    projectKey: string | null,
    page: number,
    offset: number
  ): Observable<MeetingResponse[]> {
    return this.http.get<MeetingResponse[]>(
      `${apiUrl}v1/meeting/get-current-user-meetings/${projectKey}/${page}/${offset}`
    );
  }

  create(newMeeting: MeetingCreate): Observable<MeetingResponse> {
    return this.http.post<MeetingResponse>(
      `${apiUrl}v1/meeting/administrator/create`,
      {
        title: newMeeting.title,
        date: newMeeting.date,
        projectId: newMeeting.projectId,
      }
    );
  }

  editById(
    meetingId: number,
    editedMeeting: MeetingEdit
  ): Observable<MeetingResponse> {
    return this.http.put<MeetingResponse>(
      `${apiUrl}v1/meeting/administrator/update/${meetingId}`,
      {
        date: editedMeeting.date,
        status: editedMeeting.status,
      }
    );
  }

  assignUserToMeeting(
    userId: any,
    meetingId: any
  ): Observable<MeetingResponse> {
    return this.http.patch<MeetingResponse>(
      `${apiUrl}v1/meeting/administrator/assign-user-to-meeting`,
      {
        userId: userId,
        meetingId: meetingId,
      }
    );
  }

  removeUserFromMeeting(
    userId: number | null,
    meetingId: any
  ): Observable<string> {
    return this.http.patch<string>(
      `${apiUrl}v1/meeting/administrator/remove-user-from-meeting`,
      {
        userId: userId,
        meetingId: meetingId,
      }
    );
  }

  delete(meetingId: number): Observable<void> {
    return this.http.delete<void>(
      `${apiUrl}v1/meeting/administrator/delete/${meetingId}`
    );
  }
}
