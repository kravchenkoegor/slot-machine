import { Graphics } from 'pixi.js';
import { THEME, REEL_WIDTH, SYMBOL_SIZE } from '../THEME';

const availableWidth = Math.round(innerWidth * 0.7);
const availableHeight = Math.round(innerHeight - SYMBOL_SIZE * 1.5);

const startX = (availableWidth - REEL_WIDTH * 3) / 2;
const startY = (availableHeight - SYMBOL_SIZE * 5) / 2;

const lineColor: number = THEME.RED_COLOR;
const lineHeight: number = 10;
const margin: number = lineHeight / 2;

const WinLines = (): { [k: string]: Graphics } => {
  const topWinLine = new Graphics();
  topWinLine.beginFill(lineColor);
  topWinLine.drawRect(
    startX,
    startY + (SYMBOL_SIZE / 2 - margin),
    REEL_WIDTH * 3,
    lineHeight
  );
  topWinLine.visible = false;

  const centerWinLine = new Graphics();
  centerWinLine.beginFill(lineColor, 1);
  centerWinLine.drawRect(
    startX,
    startY + ((SYMBOL_SIZE * 5) / 2 - margin),
    REEL_WIDTH * 3,
    lineHeight
  );
  centerWinLine.visible = false;

  const bottomWinLine = new Graphics();
  bottomWinLine.beginFill(lineColor, 1);
  bottomWinLine.drawRect(
    startX,
    startY + (SYMBOL_SIZE * 5 - SYMBOL_SIZE / 2 - margin),
    REEL_WIDTH * 3,
    lineHeight
  );
  bottomWinLine.visible = false;

  return {
    topWinLine,
    centerWinLine,
    bottomWinLine
  };
};

export default WinLines;
