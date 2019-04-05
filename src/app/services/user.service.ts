import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { Kweet } from '../models/kweet';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  API_URL = 'http://localhost:8080/Kwetter/api'

  constructor(private http: HttpClient) { }

  getProfile(username: String): Observable<User> {
    return this.http.get<User>(this.API_URL + `/user/${username}`)
      .pipe(catchError(this.errorHandler));
  }

  getTimeline(username: String): Observable<Kweet[]> {
    return this.http.get<Kweet[]>(this.API_URL + `/kweet/${username}/timeline`)
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.error || 'Server error');
  }
}
