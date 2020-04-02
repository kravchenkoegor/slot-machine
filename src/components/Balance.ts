import { Text } from 'pixi.js';
import { THEME, SYMBOL_SIZE } from '../THEME';

// create balance value
export const createBalanceAreaText = (balance: number): Text => {
  const text = new Text(`${balance}`, { fill: THEME.TEXT_COLOR, fontSize: 48 });
  const availableWidth = window.innerWidth * 0.3;

  // @ts-ignore
  console.log(window.availableWidthFromLeft);

  text.anchor.set(0.5);
  text.x = innerWidth * 0.7 + availableWidth / 2;
  text.y = window.innerHeight - SYMBOL_SIZE * 0.5;

  return text;
};
