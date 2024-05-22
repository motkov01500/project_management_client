import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectDetails } from 'app/models';
import { apiUrl } from 'app/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProjectDetailsService {
  constructor(private http: HttpClient) {}

  getAll(
    page: number,
    offset: number,
    sortColumn?: string,
    sortOrder?: string
  ): Observable<ProjectDetails[]> {
    return this.http.post<ProjectDetails[]>(
      `${apiUrl}v1/user-task-statistics/get-all`,
      {
        page: page,
        offset: offset,
        sortColumn: sortColumn ? sortColumn : '',
        sortOrder: sortOrder ? sortOrder : 'default',
      }
    );
  }
}
