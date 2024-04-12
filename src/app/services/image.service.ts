import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../shared/constants';
import { Image } from '../models/ImageFile';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  getImageUrl(data: any): Observable<Image> {
    return this.http.post<Image>(`https://imgbb.com/json`, data);
  }
}
