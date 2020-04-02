import { Graphics, Container, Text } from 'pixi.js';
import { THEME, SYMBOL_SIZE } from '../THEME';

const { BUTTON_WIDTH, BUTTON_HEIGHT } = THEME;

const createButtonText = (): Text => {
  const buttonText = new Text('SPIN TO WIN!', { fill: 0xffffff });
  const buttonCenterX = Math.round((window.innerWidth * 0.7) / 2);
  const buttonCenterY = window.innerHeight - SYMBOL_SIZE * 0.75;
  buttonText.x = buttonCenterX;
  buttonText.y = buttonCenterY;
  buttonText.anchor.set(0.5);

  return buttonText;
};

const createButton = (): Graphics => {
  const button = new Graphics();
  button.beginFill(THEME.RED_COLOR, 1);

  const availableWidth = window.innerWidth * 0.7;

  button.drawRect(
    availableWidth / 2 - BUTTON_WIDTH / 2,
    window.innerHeight - SYMBOL_SIZE * 0.75 - BUTTON_HEIGHT / 2,
    BUTTON_WIDTH,
    BUTTON_HEIGHT
  );

  const text = createButtonText();
  button.addChild(text);

  return button;
};

const createBalanceAreaTitle = () => {
  const text = new Text('Your balance:', { fill: THEME.TEXT_COLOR });
  const availableWidth = window.innerWidth * 0.3;

  text.anchor.set(0.5);
  text.x = innerWidth * 0.7 + availableWidth / 2;
  text.y = window.innerHeight - SYMBOL_SIZE * 1.5 + 40;

  return text;
};

const BottomPanel = (startPlay: () => void): Container => {
  const bottomPanel = new Container();

  const left = new Graphics();
  left.beginFill(THEME.BOTTOM_PANEL_COLOR, 1);
  left.drawRect(
    0,
    window.innerHeight - SYMBOL_SIZE * 1.5,
    window.innerWidth * 0.7,
    SYMBOL_SIZE * 1.5
  );
  const button = createButton();
  // set the interactivity
  button.interactive = true;
  button.buttonMode = true;
  button.addListener('pointerdown', startPlay);
  left.addChild(button);

  const right = new Graphics();
  right.beginFill(THEME.SIDEBAR_COLOR, 1);
  right.drawRect(
    window.innerWidth * 0.7,
    window.innerHeight - SYMBOL_SIZE * 1.5,
    window.innerWidth * 0.3,
    SYMBOL_SIZE * 1.5
  );
  right.addChild(createBalanceAreaTitle());

  bottomPanel.addChild(left);
  bottomPanel.addChild(right);

  return bottomPanel;
};

export default BottomPanel;
