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
    signalrService.Connection.on('receiveFigure', (figure: Figure) => {
      dashboardService.receiveFigure(figure);
      this.drawAllFigures();
    });
    signalrService.Connection.on('deletedFigure', (figureId: number) => {
      dashboardService.deletedFigure(figureId);
      this.drawAllFigures();
    });
  }

  ctx: CanvasRenderingContext2D;
  tool: string;

  @Input() roomId;

  mouseUp = true;

  //new figure
  painted = true;
  textEl = false;
  newFigure: Figure;

  //variable for cursor tool
  selectedFigure: Figure;
  cursorStX: number;
  cursorStY: number;
  cursorDx: number;
  cursorDy: number;
  cursorDxEndLine: number;
  cursorDyEndLine: number;

  //settings figure
  strokeColor = '#000000';
  enabledStrokeColor = true;
  fillColor = '#000000';
  enabledFillColor = true;
  fontSize = 14;
  fontName = 'Arial';
  lineWidth = 2;

  ngOnInit() {
    this.ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
  }

  initialNewFigure(x: number, y: number, figureType: string): Figure {
    let figure = new Figure();
    figure.figureType = FigureType[figureType];
    figure.x = x;
    figure.y = y;
    figure.strokeColor = this.enabledStrokeColor
      ? this.strokeColor
      : 'transparent';
    return figure;
  }
  createTextElement() {
    let p_canvas = document.getElementsByTagName('canvas')[0].parentElement;
    var textElement = document.createElement('textarea');
    textElement.style.position = 'absolute';
    textElement.style.left = this.newFigure.x + 'px';
    textElement.style.top = this.newFigure.y + 'px';
    textElement.onblur = () => {
      textElement.remove();
      this.textEl = false;
      if (textElement.value.length > 0) {
        this.newFigure.text = textElement.value;
        this.newFigure.y += 18;
        this.newFigure.x += 3;
        this.sendFigure(this.newFigure);
      }
      this.newFigure = null;
    };
    p_canvas.appendChild(textElement);
    this.textEl = true;
    setTimeout(() => textElement.focus(), 100);
  }

  onMouseDown(event) {
    if(event.button !== 0) return;
    this.tool = (document.querySelector(
      'input[name="tool"]:checked'
    ) as HTMLInputElement).value;

    if (this.tool === 'arc' || this.tool === 'rectangle') {
      let figure = this.initialNewFigure(
        event.offsetX,
        event.offsetY,
        this.tool
      );
      figure.fillColor = this.enabledFillColor ? this.fillColor : 'transparent';
      figure.lineWidth = this.lineWidth;
      this.newFigure = figure;
      this.painted = false;
    } else if (this.tool === 'line' || this.tool === 'lines') {
      let figure = this.initialNewFigure(
        event.offsetX,
        event.offsetY,
        this.tool
      );
      figure.lineWidth = this.lineWidth;
      this.newFigure = figure;
      this.painted = false;
    } else if (this.tool === 'text') {
      if (!this.textEl) {
        let figure = this.initialNewFigure(
          event.offsetX,
          event.offsetY,
          this.tool
        );
        figure.fontName = this.fontName;
        figure.fontSize = this.fontSize;
        figure.fillColor = this.enabledFillColor ? this.fillColor : 'transparent';
        this.newFigure = figure;
        this.createTextElement();
      }
    } else if (this.tool === 'cursor') {
      let figure = this.findFigure(
        this.dashboardService.figures,
        event.offsetX,
        event.offsetY
      );
      if (figure != null) {
        this.selectedFigure = figure;
        this.cursorDx = event.offsetX - figure.x;
        this.cursorDy = event.offsetY - figure.y;
        this.cursorStX = figure.x;
        this.cursorStY = figure.y;
        if (figure.figureType === FigureType.line) {
          this.cursorDxEndLine = figure.x_width - figure.x;
          this.cursorDyEndLine = figure.y_height - figure.y;
        }
      }
    }
    this.mouseUp = false;
  }

  onMouseMove(event) {
    if (this.mouseUp) return;
    if (this.tool === 'arc') {
      this.newFigure.radius = Math.round(
        Math.sqrt(
          Math.pow(event.offsetX - this.newFigure.x, 2) +
            Math.pow(event.offsetY - this.newFigure.y, 2)
        )
      );
      this.painted = true;
    } else if (this.tool === 'rectangle') {
      this.newFigure.x_width = event.offsetX - this.newFigure.x;
      this.newFigure.y_height = event.offsetY - this.newFigure.y;
      this.painted = true;
    } else if (this.tool === 'line') {
      this.newFigure.x_width = event.offsetX;
      this.newFigure.y_height = event.offsetY;
      this.painted = true;
    } else if (this.tool === 'lines') {
      this.newFigure.x_width = event.offsetX;
      this.newFigure.y_height = event.offsetY;
      this.sendFigure(this.newFigure);
      let figure = this.initialNewFigure(event.offsetX, event.offsetY, this.tool);
      figure.lineWidth = this.lineWidth;
      this.newFigure = figure;
    } else if (this.tool === 'cursor' && this.selectedFigure != null) {
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
        this.tool === 'line' ||
        this.tool === 'lines'
      ) {
        if (this.painted) {
          this.sendFigure(this.newFigure);
        }
        this.newFigure = null;
      } else if (this.tool === 'cursor' && this.selectedFigure != null) {
        this.sendFigure(this.selectedFigure);
        this.selectedFigure = null;
      }
    }
  }

  onMouseLeave() {
    this.onMouseUp();
  }

  sendFigure(figure: Figure) {
    this.dashboardService.sendFigure(this.roomId, figure).subscribe(
      () => {},
      err => {
        if (this.tool === 'cursor') {
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
    if (this.newFigure != null) {
      this.drawFigure(this.newFigure);
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
        this.ctx.fillStyle = figure.fillColor;
        this.ctx.font = figure.fontSize + 'px ' + figure.fontName;
        if (figure.text) this.ctx.fillText(figure.text, figure.x, figure.y);
        if (figure.text) this.ctx.strokeText(figure.text, figure.x, figure.y);
        break;
    }
    this.ctx.closePath();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ctx) this.drawAllFigures();
  }

  findFigure(figures: Figure[], x: number, y: number): Figure {
    for (
      let i = figures.length - 1, figure = figures[i];
      i >= 0;
      figure = figures[--i]
    ) {
      switch (figure.figureType) {
        case FigureType.rectangle:
          if (
            ((figure.x < x && x < figure.x + figure.x_width) ||
             (figure.x > x && x > figure.x + figure.x_width)) &&
            ((figure.y < y && y < figure.y + figure.y_height) ||
             (figure.y > y && y > figure.y + figure.y_height))
          )
            return figure;
          break;
        case FigureType.arc:
          let r = Math.sqrt(
            Math.pow(x - figure.x, 2) + Math.pow(y - figure.y, 2)
          );
          if (figure.radius > r) return figure;
          break;
        case FigureType.line:
          if (
            figure.x - 15 < x &&
            figure.x + 15 > x &&
            figure.y - 15 < y &&
            figure.y + 15 > y
          )
            return figure;
          break;
        case FigureType.text:
          if (
            figure.x < x &&
            figure.x + 100 > x &&
            figure.y - 20 < y &&
            figure.y + 10 > y
          )
            return figure;
          break;
      }
    }
    return null;
  }

  onDelete(event){
    let figure = this.findFigure(this.dashboardService.figures, event.offsetX, event.offsetY);
    if(figure != null){
      this.dashboardService.deleteFigure(figure.figureId).subscribe();
    }
    return false;
  }
}
