import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay, map, catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {baseURL} from '../Shared/baseurl';
import {ProcessHTTPMsgService} from './process-httpmsg.service';
import {Feedback} from '../Shared/feedback';
import {Dish} from '../Shared/Dish';
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
              private processHTTPMsgService: ProcessHTTPMsgService) { }
  submitFeedback(feedback: Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Feedback>(baseURL + 'feedback/', feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}