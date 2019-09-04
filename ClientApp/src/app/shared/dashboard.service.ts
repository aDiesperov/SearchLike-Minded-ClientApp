import { Injectable } from '@angular/core';
import { Figure } from '../models/figure.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  deletedFigure(figureId: number) {
    this.figures = this.figures.filter(f => f.figureId !== figureId);
  }

  deleteFigure(figureId: number) {
    return this.http.delete(
      environment.remoteUrl_api + '/dashboard/' + figureId
    );
  }

  constructor(private http: HttpClient) {}

  figures = new Array<Figure>();

  sendFigure(idRoom: number, figure: Figure) {
    return this.http.put(
      environment.remoteUrl_api + '/dashboard/' + idRoom,
      figure
    );
  }

  getFigures(id: number) {
    return this.http
      .get(environment.remoteUrl_api + '/dashboard/' + id)
      .pipe(tap((res: Figure[]) => (this.figures = res)));
  }

  receiveFigure(figure: Figure) {
    if (
      !this.figures.some((f, index) => {
        if (f.figureId == figure.figureId) {
          this.figures[index] = figure;
          return true;
        }
      })
    )
      this.figures.push(figure);
  }
}
