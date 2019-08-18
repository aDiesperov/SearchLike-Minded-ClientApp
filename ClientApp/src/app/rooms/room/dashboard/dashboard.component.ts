import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DashboardService } from 'src/app/shared/dashboard.service';
import { SignalrService } from 'src/app/shared/signalr.service';
import { Figure, FigureType } from 'src/app/models/figure.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    signalrService: SignalrService
  ) {
    signalrService.connection.on('receiveFigure', (figure: Figure) => {
      dashboardService.receiveFigure(figure);
      this.drawAllFigures();
    });
  }

  ctx: CanvasRenderingContext2D;
  tool: string;

  @Input() roomId;

  mouseUp = true;

  //new figure
  painted = true;
  selectedFigure: Figure;

  //variable for cursor tool
  cursorStX: number;
  cursorStY: number;
  cursorDx: number;
  cursorDy: number;
  cursorDxEndLine: number;
  cursorDyEndLine: number;

  //settings figure
  strokeColor = '#000000';
  fillColor = '#000000';
  fontSize = 14;
  fontName = 'Arial';
  lineWidth = 2;

  ngOnInit() {
    this.ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
  }

  initialNewFigure(x: number, y: number, figureType: string) {
    let figure = new Figure();
    figure.figureType = FigureType[figureType];
    figure.x = x;
    figure.y = y;
    figure.strokeColor = this.strokeColor;
    this.selectedFigure = figure;
  }
  createTextElement() {
    let p_canvas = document.getElementsByTagName('canvas')[0].parentElement;
    var textElement = document.createElement('textarea');
    textElement.style.position = 'absolute';
    textElement.style.left = this.selectedFigure.x + 'px';
    textElement.style.top = this.selectedFigure.y + 'px';
    p_canvas.appendChild(textElement);
    textElement.onblur = () => {
      textElement.remove();
      if (textElement.value.length > 0) {
        this.selectedFigure.text = textElement.value;
        this.selectedFigure.y += 18;
        this.selectedFigure.x += 3;
        this.sendFigure(this.selectedFigure);
        this.drawAllFigures();
      }
      this.selectedFigure = null;
    };
    textElement.onload = () => {
      textElement.focus();
    };
  }

  onMouseDown(event) {
    this.tool = (document.querySelector(
      'input[name="tool"]:checked'
    ) as HTMLInputElement).value;
    if (this.tool === 'arc' || this.tool === 'rectangle') {
      this.initialNewFigure(event.offsetX, event.offsetY, this.tool);
      this.selectedFigure.fillColor = this.fillColor;
      this.selectedFigure.lineWidth = this.lineWidth;
      this.painted = false;
    } else if (this.tool === 'line' || this.tool === 'lines') {
      this.initialNewFigure(event.offsetX, event.offsetY, this.tool);
      this.selectedFigure.lineWidth = this.lineWidth;
      this.painted = false;
    } else if (this.tool === 'text') {
      this.initialNewFigure(event.offsetX, event.offsetY, this.tool);
      this.selectedFigure.fontName = this.fontName;
      this.selectedFigure.fontSize = this.fontSize;
      this.createTextElement();
    } else if (this.tool === 'cursor') {
      let x = event.offsetX;
      let y = event.offsetY;
      this.dashboardService.figures
        .slice()
        .reverse()
        .some(figure => {
          switch (figure.figureType) {
            case FigureType.rectangle:
              if (
                figure.x < x &&
                figure.x + figure.x_width > x &&
                figure.y < y &&
                figure.y + figure.y_height > y
              ) {
                this.selectFigure(figure, event);
                return true;
              }
              break;
            case FigureType.arc:
              let r = Math.sqrt(
                Math.pow(x - figure.x, 2) + Math.pow(y - figure.y, 2)
              );
              if (figure.radius > r) {
                this.selectFigure(figure, event);
                return true;
              }
              break;
            case FigureType.line:
              if (
                figure.x - 15 < x &&
                figure.x + 15 > x &&
                figure.y - 15 < y &&
                figure.y + 15 > y
              ) {
                this.selectFigure(figure, event);
                return true;
              }
              break;
            case FigureType.text:
              if (
                figure.x < x &&
                figure.x + 100 > x &&
                figure.y - 20 < y &&
                figure.y + 10 > y
              ) {
                this.selectFigure(figure, event);
                return true;
              }
              break;
          }
          return false;
        });
    }
    this.mouseUp = false;
  }

  selectFigure(figure, event) {
    this.selectedFigure = figure;
    this.cursorDx = event.offsetX - figure.x;
    this.cursorDy = event.offsetY - figure.y;
    this.cursorStX = figure.x;
    this.cursorStY = figure.y;
    if (figure.FigureType === FigureType.line) {
      this.cursorDxEndLine = figure.x_width - figure.x;
      this.cursorDyEndLine = figure.y_height - figure.y;
    }
  }

  onMouseMove(event) {
    if (this.mouseUp) return;
    if (this.tool === 'arc') {
      this.selectedFigure.radius = Math.round(
        Math.sqrt(
          Math.pow(event.offsetX - this.selectedFigure.x, 2) +
            Math.pow(event.offsetY - this.selectedFigure.y, 2)
        )
      );
      this.painted = true;
    } else if (this.tool === 'rectangle') {
      this.selectedFigure.x_width = event.offsetX - this.selectedFigure.x;
      this.selectedFigure.y_height = event.offsetY - this.selectedFigure.y;
      this.painted = true;
    } else if (this.tool === 'line') {
      this.selectedFigure.x_width = event.offsetX;
      this.selectedFigure.y_height = event.offsetY;
      this.painted = true;
    } else if (this.tool === 'lines') {
      this.selectedFigure.x_width = event.offsetX;
      this.selectedFigure.y_height = event.offsetY;
      this.sendFigure(this.selectedFigure);
      this.initialNewFigure(event.offsetX, event.offsetY, this.tool);
    } else if (this.tool === 'cursor' && this.selectedFigure !== null) {
      this.selectedFigure.x = event.offsetX - this.cursorDx;
      this.selectedFigure.y = event.offsetY - this.cursorDy;
      if (this.selectedFigure.figureType === FigureType.line) {
        this.selectedFigure.x_width =
          event.offsetX - this.cursorDx + this.cursorDxEndLine;
        this.selectedFigure.y_height =
          event.offsetY - this.cursorDy + this.cursorDyEndLine;
      }
    }
    this.drawAllFigures();
  }

  onMouseUp() {
    if (!this.mouseUp) {
      this.mouseUp = true;
      if (
        this.tool === 'arc' ||
        this.tool === 'rectangle' ||
        this.tool === 'line'
      ) {
        if (this.painted) {
          this.dashboardService.figures.push(this.selectedFigure);
          this.sendFigure(this.selectedFigure);
        }
      } else if (this.tool === 'cursor' && this.selectedFigure !== null) {
        this.sendFigure(this.selectedFigure);
      }

      if (this.selectedFigure !== null) this.selectedFigure = null;
    }
  }

  onMouseLeave() {
    this.onMouseUp();
  }

  sendFigure(figure: Figure) {
    this.dashboardService.sendFigure(this.roomId, figure).subscribe(
      (res: number) => {
        figure.figureId = res;
      },
      err => {
        if (this.tool !== 'cursor') {
          for (let i = 0; i < this.dashboardService.figures.length; i++)
            if (figure === this.dashboardService.figures[i]) {
              this.dashboardService.figures.splice(i, 1);
              break;
            }
        } else {
          figure.x = this.cursorStX;
          figure.y = this.cursorStY;
        }
        this.drawAllFigures();
      }
    );
  }

  drawAllFigures() {
    this.ctx.clearRect(0, 0, 748, 620);
    for (let figure of this.dashboardService.figures) {
      this.drawFigure(figure);
    }
    if (this.selectedFigure != null) {
      this.drawFigure(this.selectedFigure);
    }
  }

  drawFigure(figure: Figure) {
    this.ctx.strokeStyle = figure.strokeColor;
    this.ctx.beginPath();
    switch (figure.figureType) {
      case FigureType.rectangle:
        this.ctx.fillStyle = figure.fillColor;
        this.ctx.lineWidth = figure.lineWidth;
        this.ctx.rect(figure.x, figure.y, figure.x_width, figure.y_height);
        this.ctx.fill();
        this.ctx.stroke();
        break;
      case FigureType.arc:
        this.ctx.fillStyle = figure.fillColor;
        this.ctx.lineWidth = figure.lineWidth;
        this.ctx.arc(figure.x, figure.y, figure.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        break;
      case FigureType.line:
      case FigureType.lines:
        this.ctx.lineWidth = figure.lineWidth;
        this.ctx.moveTo(figure.x, figure.y);
        this.ctx.lineTo(figure.x_width, figure.y_height);
        this.ctx.stroke();
        break;
      case FigureType.text:
        this.ctx.font = figure.fontSize + 'px ' + figure.fontName;
        if (figure.text) this.ctx.fillText(figure.text, figure.x, figure.y);
        break;
    }
    this.ctx.closePath();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ctx) this.drawAllFigures();
  }
}
