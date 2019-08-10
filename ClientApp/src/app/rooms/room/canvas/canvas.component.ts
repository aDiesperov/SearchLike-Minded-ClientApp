import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Figure, FigureType } from 'src/app/models/figure.model';
import { DashboardService } from 'src/app/shared/dashboard.service';
import { SignalrService } from 'src/app/shared/signalr.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.sass']
})
export class CanvasComponent implements OnInit {

  constructor(private dashboard: DashboardService, signalr: SignalrService) {
    signalr.connection.on('receiveFigure', (figure: Figure) => {
      if(!this.figures.some((f, index) => {
        if(f.figureId == figure.figureId){
          this.figures[index] = figure;
          return true;
        }
      })) this.figures.push(figure);
      this.drawFigures();
    });
  }

  ctx;
  tool: string;
  @Input() roomId;
  @Input() figures;

  mouseUp = true;
  painted = true;
  cursorIndexElement = -1;

  cursorDx: number;
  cursorDy: number;
  cursorDxEndLine: number;
  cursorDyEndLine: number;
  color = '#000000';
  

  ngOnInit() {
    this.ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
    this.ctx.font = "14px Arial";

    document.getElementById('colorTool').onchange = (e) => this.onChangeColor(e);
  }

  onMouseDown(event) {
    this.tool = (document.querySelector('input[name="tool"]:checked') as HTMLInputElement).value;
    if (
      this.tool === 'arc' ||
      this.tool === 'rectangle' ||
      this.tool === 'line' ||
      this.tool === 'lines' ||
      this.tool === 'text'
    ) {
      let figure = new Figure();
      figure.figureType = FigureType[this.tool];
      figure.x = event.offsetX;
      figure.y = event.offsetY;
      figure.color = this.color;      
      this.figures.push(figure);

      if(this.tool === 'text') {
        let p_canvas = document.getElementsByTagName('canvas')[0].parentElement;
        var textEl = document.createElement("textarea");
        textEl.style.position = 'absolute';
        textEl.style.left = figure.x + "px";
        textEl.style.top = figure.y + "px";
        p_canvas.appendChild(textEl);
        textEl.onblur = () => {
          textEl.remove();
          if(textEl.value.length > 0){
            figure.text = textEl.value;
            figure.y += 18;
            figure.x += 3;
            this.sendFigure(this.figures.length -1);
            this.drawFigures();
          }
          else{
            this.figures.pop();
          }
        }
      }
      else{
        this.painted = false;
      }
    }
    else if(this.tool === 'cursor') {
      let x = event.offsetX;
      let y = event.offsetY;
      this.figures.slice().reverse().some(
        (figure, index) => {
          let finded = false;
          switch(figure.figureType){
            case FigureType.rectangle:
              if(figure.x < x && figure.x + figure.x_width > x && figure.y < y && figure.y + figure.y_height > y){
                this.selectFigure(index, event, figure)
                finded = true;
              }
              break;
            case FigureType.arc:
              let r = Math.sqrt(Math.pow(x - figure.x, 2) + Math.pow(y - figure.y, 2));
              if(figure.radius > r){
                this.selectFigure(index, event, figure);
                finded = true;
              }
              break;
            case FigureType.line:
              if(figure.x - 5 < x && figure.x + 5 > x && figure.y - 5 < y && figure.y + 5 > y){
                this.selectFigure(index, event, figure)
                finded = true;
                this.cursorDxEndLine = figure.x_width - figure.x;
                this.cursorDyEndLine = figure.y_height - figure.y;
              }
              break;
            case FigureType.text:
                if(figure.x < x && figure.x + 100 > x && figure.y < y + 20 && figure.y + 10 > y){
                  this.selectFigure(index, event, figure)
                  finded = true;
                }
              break;
          }
          return finded;
        }
      )
    }
    this.mouseUp = false;
  }

  selectFigure(index, event, figure) {
    this.cursorIndexElement = this.figures.length - index - 1;
    this.cursorDx = event.offsetX - figure.x;
    this.cursorDy = event.offsetY - figure.y;
  }

  onMouseMove(event) {
    if (this.mouseUp) return;
    if (this.tool === 'arc'){
      this.figures[this.figures.length - 1].radius = Math.round(Math.sqrt(
        Math.pow(event.offsetX - this.figures[this.figures.length - 1].x, 2) +
          Math.pow(event.offsetY - this.figures[this.figures.length - 1].y, 2)
      ));
      this.painted = true;
    }
    else if(this.tool === 'rectangle'){
      this.figures[this.figures.length - 1].x_width = event.offsetX - this.figures[this.figures.length - 1].x;
      this.figures[this.figures.length - 1].y_height = event.offsetY - this.figures[this.figures.length - 1].y;
      this.painted = true;
    }
    else if(this.tool === 'line'){
      this.figures[this.figures.length - 1].x_width = event.offsetX;
      this.figures[this.figures.length - 1].y_height = event.offsetY;
      this.painted = true;
    }
    else if(this.tool === 'lines'){
      this.figures[this.figures.length - 1].x_width = event.offsetX;
      this.figures[this.figures.length - 1].y_height = event.offsetY;
      this.sendFigure(this.figures.length - 1);
      let figure = new Figure();
      figure.x = event.offsetX;
      figure.y = event.offsetY;
      figure.figureType = FigureType[this.tool];
      figure.color = this.color;
      this.figures.push(figure);
    }
    else if(this.tool === 'cursor' && this.cursorIndexElement !== -1) {
      this.figures[this.cursorIndexElement].x = event.offsetX - this.cursorDx;
      this.figures[this.cursorIndexElement].y = event.offsetY - this.cursorDy;
      if(this.figures[this.cursorIndexElement].figureType === FigureType.line) {
        this.figures[this.cursorIndexElement].x_width = event.offsetX - this.cursorDx + this.cursorDxEndLine;
        this.figures[this.cursorIndexElement].y_height = event.offsetY - this.cursorDy + this.cursorDyEndLine;
      }
    }
    this.drawFigures();
  }

  onMouseUp() {
    this.onMouseLeave();
  }

  onMouseLeave(){
    if(!this.mouseUp){
      this.mouseUp = true;
      if(this.painted && (
        this.tool === 'arc' ||
        this.tool === 'rectangle' ||
        this.tool === 'line')){
          this.sendFigure(this.figures.length - 1);
      } else if(!this.painted)
        this.figures.pop();
      else if(this.tool === 'cursor' && this.cursorIndexElement != -1){
        this.sendFigure(this.cursorIndexElement);
        this.cursorIndexElement = -1;
      }
    }
  }

  drawFigures(){
    this.ctx.clearRect(0, 0, 748, 620);
    for(let figure of this.figures){
      this.ctx.strokeStyle = figure.color;
      this.ctx.fillStyle = figure.color;
      this.ctx.beginPath();
      switch(figure.figureType){
        case FigureType.rectangle:
          this.ctx.rect(figure.x, figure.y, figure.x_width, figure.y_height);
          this.ctx.stroke();
          break;
        case FigureType.line:
        case FigureType.lines:
          this.ctx.moveTo(figure.x, figure.y);
          this.ctx.lineTo(figure.x_width, figure.y_height);
          this.ctx.stroke();
          break;
        case FigureType.arc:
          this.ctx.arc(figure.x, figure.y, figure.radius, 0, 2 * Math.PI);
          this.ctx.stroke();
          break;
        case FigureType.text:
          if(figure.text)
            this.ctx.fillText(figure.text, figure.x, figure.y);
          break;
      }
      this.ctx.closePath();
    }
  }

  onChangeColor(event){
    this.color = event.target.value;
    let elem = event.target.nextElementSibling as HTMLElement;
    elem.style.color = event.target.value;
  }

  sendFigure(id: number){
    this.dashboard.sendFigure(this.figures[id], this.roomId).subscribe(
      (res: number) => this.figures[id].figureId = res,
      err => {
        if(this.tool !== 'cursor') this.figures.splice(id, 1);
        this.drawFigures();
      }
    )
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(this.ctx)
      this.drawFigures();
  }
}
