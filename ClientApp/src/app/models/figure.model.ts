export enum FigureType
{
    arc, rectangle, line, lines, text
}

export class Figure{
    figureId: number;
    strokeColor: string;
    fillColor: string;
    lineWidth: number;
    
    x: number;
    y: number;
    
    x_width: number;
    y_height: number;

    radius: number;

    text: string;
    fontName: string;
    fontSize: number;

    figureType: FigureType;
}