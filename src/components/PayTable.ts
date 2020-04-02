import { Graphics, Text, TextStyle } from 'pixi.js';
import { THEME } from '../THEME';

export interface ICombination {
  title: string;
  value: number;
}

const startX: number = Math.round(innerWidth * 0.7);
const marginTop: number = 50;
const tableTextStyle: TextStyle = new TextStyle({
  fill: THEME.TEXT_COLOR,
  fontSize: 20,
  wordWrap: true,
  wordWrapWidth: innerWidth * 0.25,
  padding: 10
});

export const combinations: ICombination[] = [
  {
    title: '3 CHERRY symbols on top line',
    value: 2000
  },
  {
    title: '3 CHERRY symbols on center line',
    value: 1000
  },
  {
    title: '3 CHERRY symbols on bottom line',
    value: 4000
  },
  {
    title: '3 7 symbols on any line',
    value: 150
  },
  {
    title: 'Any combination of CHERRY and 7 on any line',
    value: 75
  },
  {
    title: '3 3xBAR symbols on any line',
    value: 50
  },
  {
    title: '3 2xBAR symbols on any line',
    value: 20
  },
  {
    title: '3 BAR symbols on any line',
    value: 10
  },
  {
    title: 'Combination of any BAR symbols on any line',
    value: 5
  }
];

// create text with combination description and value
// for pay table
export const createCombination = (
  { title, value }: ICombination,
  totalHeight: number
): Graphics => {
  const tableRow = new Graphics();
  const combinationText = new Text(title, tableTextStyle);
  const combinationValue = new Text(`${value}`, {
    fontSize: 32,
    fill: THEME.RED_COLOR
  });

  combinationText.x = combinationValue.x = startX + marginTop / 2;
  combinationText.y = marginTop + totalHeight;
  combinationValue.y = combinationText.y + combinationText.height;

  tableRow.addChild(combinationText);
  tableRow.addChild(combinationValue);

  return tableRow;
};
