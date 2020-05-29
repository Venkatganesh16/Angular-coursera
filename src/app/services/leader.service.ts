import { Injectable } from '@angular/core';
import {Leader} from '../Shared/Leader';
import {LEADERS} from '../Shared/Leaders';
import {Observable, of} from 'rxjs';
import {delay, map, catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {baseURL} from '../Shared/baseurl';
import {ProcessHTTPMsgService} from './process-httpmsg.service';
import {Dish} from '../Shared/Dish';
@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
              private processHTTPMsgService: ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leadership').pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getLeader(id: string): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership/' + id).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership?featured=true').pipe(map(Leaders => Leaders[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));  }
}
