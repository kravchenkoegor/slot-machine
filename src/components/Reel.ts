import { Container, Sprite, Texture, Graphics } from 'pixi.js';
import { REEL_WIDTH, SYMBOL_SIZE } from '../THEME';

const availableWidth = Math.round(innerWidth * 0.7);
const availableHeight = Math.round(innerHeight - SYMBOL_SIZE * 1.5);

const Reel = (slotTextures: Texture[]) => {
  const reels = [];
  const reelContainer = new Container();

  const startX = (availableWidth - REEL_WIDTH * 3) / 2;
  const startY = (availableHeight - SYMBOL_SIZE * 5) / 2;

  reelContainer.x = startX;
  reelContainer.y = startY;

  for (let i = 0; i < 3; i++) {
    const rc = new Container();
    rc.x = i * REEL_WIDTH;
    rc.y = 0;
    reelContainer.addChild(rc);

    const reel = {
      container: rc,
      symbols: [] as Sprite[],
      position: 0,
      previousPosition: 0
    };

    // build the symbols
    for (let j = 0; j < 5; j++) {
      const symbol = new Sprite(slotTextures[j]);
      symbol.y = j * symbol.height;
      symbol.x = 0;
      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }

    reels.push(reel);
  }

  return { reels, reelContainer };
};

export default Reel;
