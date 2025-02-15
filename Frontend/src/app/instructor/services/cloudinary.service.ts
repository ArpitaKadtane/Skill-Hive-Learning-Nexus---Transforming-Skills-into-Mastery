import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  private http = inject(HttpClient)


  uploadImage(file: any):Observable<any>{
    let data = file;
    return this.http.post('https://api.cloudinary.com/v1_1/skillhivec/image/upload',data);
  }

  uploadFile(file: any): Observable<any> {
    console.log('Uploading file:', file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'pdf_upload_presets');
    formData.append('cloud_name','skillhivec');

    return this.http.post('https://api.cloudinary.com/v1_1/skillhivec/image/upload', formData);


}
}