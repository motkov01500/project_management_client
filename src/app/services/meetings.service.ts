import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MeetingResponse } from '../models/meeting/meeting-response';
import { apiUrl } from '../shared/constants';
import { MeetingEdit } from '../models/meeting/meeting-edit';
import { MeetingCreate } from '../models/meeting/meeting-create';

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

  getCurrentUserMeetings(): Observable<MeetingResponse[]> {
    return this.http.get<MeetingResponse[]>(
      `${apiUrl}v1/meeting/get-all-related-meetings`
    );
  }

  create(newMeeting: MeetingCreate): Observable<MeetingResponse> {
    return this.http.post<MeetingResponse>(
      `${apiUrl}v1/meeting/administrator/create`,
      {
        status: newMeeting.status,
        date: newMeeting.date,
        projectId: newMeeting.projectId,
      }
    );
  }

  editById(meetingId: number, editedMeeting: MeetingEdit) {
    return this.http.put<MeetingResponse>(
      `${apiUrl}v1/meeting/administrator/update/${meetingId}`,
      {
        date: editedMeeting.date,
        status: editedMeeting.status,
      }
    );
  }

  delete(meetingId: number): Observable<void> {
    return this.http.delete<void>(
      `${apiUrl}v1/meeting/administrator/delete/${meetingId}`
    );
  }
}
