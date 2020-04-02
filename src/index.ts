import { Application, Texture, Text, Graphics } from 'pixi.js';
import Reel from './components/Reel';
import BottomPanel from './components/BottomPanel';
import WinLines from './components/WinLines';
import {
  combinations,
  createCombination,
  ICombination
} from './components/PayTable';
import { createBalanceAreaText } from './components/Balance';
import { indicateCombinations, blink } from './functions/combinations';
import { THEME, SYMBOL_SIZE, TEXTURES } from './THEME';

// starting X point for pay table and balance area
const startX: number = Math.round(innerWidth * 0.7);
// initial user balance
let USER_BALANCE: number = 0;

// helper variable to store Graphics with combinations
// necessary to determine which combination is completed
const combinationsGraphics: Graphics[] = [];
// variable to determine Y point of next combination Graphics
let totalCombinationsHeight = 0;
// create combination Graphics and store them in our helper variable
combinations.forEach((c: ICombination) => {
  const row = createCombination(c, totalCombinationsHeight);
  totalCombinationsHeight += row.height;
  combinationsGraphics.push(row);
});
// create balanceText variable to set initial balance from input
let balanceText: Text | null = null;
// function to update user balance
const updateBalance = (newBalance: number): void => {
  USER_BALANCE = newBalance;
  if (balanceText) {
    balanceText.text = `${newBalance}`;
  }
};

// create app
const app = new Application({
  backgroundColor: THEME.BACKGROUND_COLOR,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: devicePixelRatio
});
document.body.appendChild(app.view);

// add textures
TEXTURES.forEach((t: string) => app.loader.add(t, `images/Reel/${t}`));

// callback to run after all assets are loaded
const onAssetsLoaded = (): void => {
  const slotTextures = TEXTURES.map((t: string) => Texture.from(t));

  // build the reels
  const { reels, reelContainer } = Reel(slotTextures);
  app.stage.addChild(reelContainer);

  // function to start playing
  const startPlay = (): void => {
    if (running) return;

    if (!USER_BALANCE) {
      alert('Please set initial balance!');
      return;
    }

    running = true;

    hideWinLines();
    updateBalance(USER_BALANCE - 1);

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      // variable to determine random reel shift
      const extra = Math.floor(Math.random() * reels.length * reels.length);
      // target position of reel
      const target = r.position + 10 + i * 5 + extra;
      // spinning time
      const time = 2000 + i * 500;

      tweenTo(
        // reel
        r,
        // property to change
        'position',
        // target value of r.position
        target,
        // time to perform function
        time,
        // easing function
        backout(0.5),
        // callback onComplete
        i === reels.length - 1 ? reelsComplete : null
      );
    }
  };

  // build bottom panel
  const bottomPanel = BottomPanel(startPlay);
  app.stage.addChild(bottomPanel);

  // build winlines
  const { topWinLine, centerWinLine, bottomWinLine } = WinLines();
  app.stage.addChild(topWinLine);
  app.stage.addChild(centerWinLine);
  app.stage.addChild(bottomWinLine);

  // function to hide winlines.
  // used when user wins and presses the button before winline hides
  const hideWinLines = () => {
    topWinLine.visible = false;
    centerWinLine.visible = false;
    bottomWinLine.visible = false;
  };

  // build pay table
  const table = new Graphics();
  table.beginFill(THEME.SIDEBAR_COLOR, 1);
  table.drawRect(
    startX,
    0,
    Math.round(innerWidth * 0.3),
    Math.round(innerHeight - SYMBOL_SIZE * 1.5)
  );
  combinationsGraphics.forEach((c: Graphics) => table.addChild(c));
  app.stage.addChild(new Graphics().addChild(table));

  // variable to disable interactions when spinning
  let running: boolean = false;

  // handler when reels are done
  const reelsComplete = (): void => {
    running = false;

    const RESULT: Array<string[]> = [];
    reels.forEach(({ position, symbols }) => {
      // calculate shift in relation to initial reel
      const shift: number = Math.floor(position % symbols.length);
      // create new array with texture names
      // to prevent from modifying original array
      const textures: string[] = TEXTURES.map((t: string): string => t);
      // take shifted part of the initial array
      const shifted = textures.slice(textures.length - shift);
      // take unchanged part of the initial array
      const rest = textures.slice(0, textures.length - shift);
      // combine shifted and unchanged part together
      RESULT.push([...shifted, ...rest]);
    });

    const { line, payout } = indicateCombinations(RESULT);
    if (payout && line) {
      updateBalance(USER_BALANCE + payout);
      // find the index of winning combination in our helper variable
      const combinationIndex: number = combinations.findIndex(
        (c: ICombination): boolean => c.value === payout
      );
      // find winning combination Graphics
      const winCombination = combinationsGraphics[combinationIndex];
      // start blinking
      blink(winCombination);
    }

    switch (line) {
      case 'top':
        topWinLine.visible = true;
        setTimeout(() => (topWinLine.visible = false), 1500);
        break;
      case 'center':
        centerWinLine.visible = true;
        setTimeout(() => (centerWinLine.visible = false), 1500);
        break;
      case 'bottom':
        bottomWinLine.visible = true;
        setTimeout(() => (bottomWinLine.visible = false), 1500);
        break;
      default:
        break;
    }
  };

  // listening for animation updates
  app.ticker.add(() => {
    // update slots
    for (let i = 0; i < reels.length; i++) {
      const reel = reels[i];
      const { symbols } = reel;
      reel.previousPosition = reel.position;

      // update symbol positions on reel
      for (let j = 0; j < symbols.length; j++) {
        // get the symbol
        const symbol = symbols[j];
        // remember previous symbol Y
        const prevY = symbol.y;
        // set new symbol Y
        symbol.y = ((reel.position + j) % symbols.length) * SYMBOL_SIZE;

        if (symbol.y < 0 && prevY > SYMBOL_SIZE) {
          const randomIndex = Math.floor(Math.random() * slotTextures.length);
          symbol.texture = slotTextures[randomIndex];
          symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        }
      }
    }
  });
};

// run callback after loading all the assets
app.loader.load(onAssetsLoaded);

// IMPORTANT: all the code below was taken from https://pixijs.io/examples/#/demos/slots-demo.js
// I understand only about a half of this,
// so I could not explain functions "lerp", "backout", and the second usage of app.ticker.
// But I guess that they are used for animating reels spinning

// Very simple tweening utility function.
// This should be replaced with a proper tweening library in a real product.
const tweening: any[] = [];

function tweenTo(
  object: any,
  property: string,
  target: number,
  time: number,
  easing: any,
  oncomplete: any
) {
  const tween = {
    object,
    property,
    propertyBeginValue: object[property],
    target,
    easing,
    time,
    complete: oncomplete,
    start: Date.now()
  };

  tweening.push(tween);
  return tween;
}

// Listen for animate update.
app.ticker.add(delta => {
  const now = Date.now();
  const remove = [];

  for (let i = 0; i < tweening.length; i++) {
    const t = tweening[i];
    const phase = Math.min(1, (now - t.start) / t.time);

    t.object[t.property] = lerp(
      t.propertyBeginValue,
      t.target,
      t.easing(phase)
    );

    if (t.change) t.change(t);

    if (phase === 1) {
      t.object[t.property] = t.target;
      if (t.complete) t.complete(t);
      remove.push(t);
    }
  }

  for (let i = 0; i < remove.length; i++) {
    tweening.splice(tweening.indexOf(remove[i]), 1);
  }
});

// Basic lerp funtion.
function lerp(a1: number, a2: number, t: number) {
  return a1 * (1 - t) + a2 * t;
}

// Backout function from tweenjs.
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
function backout(amount: number) {
  return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
}

window.addEventListener('load', () => {
  const $form = document.querySelector('.form-control');

  if ($form) {
    $form.removeAttribute('style');
    const $input = $form.querySelector('input');
    const $button = $form.querySelector('button');

    if ($button && $input) {
      $button.addEventListener('click', e => {
        e.preventDefault();

        const balance: number = Number($input.value);
        if (balance >= 1 && balance <= 5000) {
          // build balance area
          balanceText = createBalanceAreaText(balance);
          app.stage.addChild(balanceText);

          updateBalance(balance);
          ($form.parentNode as HTMLElement).removeChild($form);
        } else {
          alert(
            'User balance must be in range from 1 to 5000! Please enter correct value.'
          );
          $input.value = '';
        }
      });
    }
  }
});
