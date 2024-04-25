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

  getImageUrl(imageData: any): Observable<Image> {
    return this.http.post<Image>(
      `https://a.klaviyo.com/api/images`,
      {
        type: 'image',
        attributes: {
          import_from_url: imageData,
          hidden: false,
        },
      },
      {
        headers: {
          Authorization:
            'Klaviyo-API-Key pk_197c27c36e0371f709fd22af0998684fcb',
          accept: 'application/json',
          'content-type': 'application/json',
        },
      }
    );
  }
}
