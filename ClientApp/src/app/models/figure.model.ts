export enum FigureType
{
    arc, rectangle, line, lines, text
}

export class Figure{
    figureId: number;
    radius: number;
    color: string;
    thickness: number;
    text: string;
    font: string;
    x: number;
    y: number;
    x_width: number;
    y_height: number;
    figureType: FigureType;
}