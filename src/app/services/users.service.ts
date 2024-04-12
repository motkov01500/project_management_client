import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserEdit, UserResponse } from '../models';
import { apiUrl } from '../shared/constants';
import { UserRequest } from '../models/user/user-request';
import { UserImageUpload } from '../models/user/user-upload-image';
import { UserPasswordUpdate } from '../models/user/user-update-password';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(
      `${apiUrl}v1/user/administrator/get-all`
    );
  }

  getUnassignedToProjectUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(
      `${apiUrl}v1/user/administrator/get-all-unassigned`
    );
  }

  getRelatedToProject(projectKey: string): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(
      `${apiUrl}v1/user/get-all-related-to-project/${projectKey}`
    );
  }

  getCurrentLoggedUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${apiUrl}v1/user/current-user`);
  }

  getRelatedToMeeting(meetingId: number): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(
      `${apiUrl}v1/user/get-all-related-to-meeting/${meetingId}`
    );
  }

  getById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(
      `${apiUrl}v1/user/administrator/get-by-id/${id}`
    );
  }

  createUser(userCredentials: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      `${apiUrl}v1/user/administrator/create`,
      {
        username: userCredentials.username,
        password: userCredentials.password,
        fullName: userCredentials.fullName,
      }
    );
  }

  editUser(userCredentials: UserEdit, id: number): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${apiUrl}v1/user/update/${id}`, {
      username: userCredentials.username,
      password: userCredentials.password,
      fullName: userCredentials.fullName,
      roleName: userCredentials.role,
    });
  }

  updateUserPassword(
    userId: number,
    updatedUser: UserPasswordUpdate
  ): Observable<UserResponse> {
    return this.http.patch<UserResponse>(
      `${apiUrl}v1/user/update-password/${userId}`,
      {
        password: updatedUser.password,
      }
    );
  }

  uploadImage(uploadedImage: UserImageUpload): Observable<UserResponse> {
    return this.http.patch<UserResponse>(`${apiUrl}v1/user/upload-image`, {
      imageUrl: uploadedImage.imageUrl,
    });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(
      `${apiUrl}v1/user/administrator/delete/${id}`
    );
  }
}
