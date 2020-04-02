import { TEXTURES } from '../THEME';
import { Graphics } from 'pixi.js';

const TripleBar = TEXTURES[0];
const Bar = TEXTURES[1];
const DoubleBar = TEXTURES[2];
const Seven = TEXTURES[3];
const Cherry = TEXTURES[4];

const topLineIndex: number = 0;
const centerLineIndex: number = (TEXTURES.length - 1) / 2;
const bottomLineIndex: number = TEXTURES.length - 1;

// functions to detect winning combinations
const tripleCherry = (line: string[]): boolean => {
  return line.every((s: string) => s === Cherry);
};

const tripleSeven = (line: string[]): boolean => {
  return line.every((s: string) => s === Seven);
};

const cherrySevenCombination = (line: string[]): boolean => {
  return line.includes(Cherry) && line.includes(Seven);
};

const tripleTripleBar = (line: string[]) => {
  return line.every((s: string) => s === TripleBar);
};

const tripleDoubleBar = (line: string[]) => {
  return line.every((s: string) => s === DoubleBar);
};

const tripleBar = (line: string[]) => {
  return line.every((s: string) => s === Bar);
};

const barCombination = (line: string[]) => {
  return line.some((s: string) => s !== Cherry || s !== Seven);
};

// function to check if combination wins
const checkPayout = (
  reels: Array<string[]>
): { line: string; payout: number } => {
  const topLine: string[] = [];
  const centerLine: string[] = [];
  const bottomLine: string[] = [];

  reels.forEach((reel: string[]) => {
    topLine.push(reel[topLineIndex]);
    centerLine.push(reel[centerLineIndex]);
    bottomLine.push(reel[bottomLineIndex]);
  });

  switch (true) {
    case tripleCherry(topLine):
      return { line: 'top', payout: 2000 };
    case tripleCherry(centerLine):
      return { line: 'center', payout: 1000 };
    case tripleCherry(bottomLine):
      return { line: 'bottom', payout: 4000 };
    case tripleSeven(topLine):
      return { line: 'top', payout: 150 };
    case tripleSeven(centerLine):
      return { line: 'center', payout: 150 };
    case tripleSeven(bottomLine):
      return { line: 'bottom', payout: 150 };
    case cherrySevenCombination(topLine):
      return { line: 'top', payout: 75 };
    case cherrySevenCombination(centerLine):
      return { line: 'center', payout: 75 };
    case cherrySevenCombination(bottomLine):
      return { line: 'bottom', payout: 75 };
    case tripleTripleBar(topLine):
      return { line: 'top', payout: 50 };
    case tripleTripleBar(centerLine):
      return { line: 'center', payout: 50 };
    case tripleTripleBar(bottomLine):
      return { line: 'bottom', payout: 50 };
    case tripleDoubleBar(topLine):
      return { line: 'top', payout: 20 };
    case tripleDoubleBar(centerLine):
      return { line: 'center', payout: 20 };
    case tripleDoubleBar(bottomLine):
      return { line: 'bottom', payout: 20 };
    case tripleBar(topLine):
      return { line: 'top', payout: 10 };
    case tripleBar(centerLine):
      return { line: 'center', payout: 10 };
    case tripleBar(bottomLine):
      return { line: 'bottom', payout: 10 };
    case barCombination(topLine):
      return { line: 'top', payout: 5 };
    case barCombination(centerLine):
      return { line: 'center', payout: 5 };
    case barCombination(bottomLine):
      return { line: 'bottom', payout: 5 };
    default:
      return { line: '', payout: 0 };
  }
};

export const indicateCombinations = (
  reels: Array<string[]>
): { line: string; payout: number } => checkPayout(reels);

// blinking function
// I guess it's not a best choice,
// but I didn't have enough time to think about it
export const blink = (el: Graphics): void => {
  const step: number = 250;
  let counter = 0;

  const int = setInterval(() => {
    if (counter < 6) {
      counter++;
      el.visible = !el.visible;
    } else {
      clearInterval(int);
    }
  }, step);
};
