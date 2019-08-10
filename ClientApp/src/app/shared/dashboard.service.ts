import { Injectable } from '@angular/core';
import { Figure } from '../models/figure.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  sendFigure(figure: Figure, id: number){
    return this.http.put(environment.remoteUrl + '/dashboard/' + id, figure);
  }

  getFigures(id: number){
    return this.http.get(environment.remoteUrl + '/dashboard/' + id);
  }
}
