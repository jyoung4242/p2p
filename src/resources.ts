// resources.ts
import { ImageSource, Loader, Sprite, SpriteSheet } from "excalibur";
import bug from "./Assets/bug.png";
import player from "./Assets/player.png";
import player2 from "./Assets/player2.png";

export const Resources = {
  bug: new ImageSource(bug),
  player: new ImageSource(player),
  player2: new ImageSource(player2),
};

export const bugSS = SpriteSheet.fromImageSource({
  image: Resources.bug,
  grid: {
    rows: 1,
    columns: 6,
    spriteWidth: 16,
    spriteHeight: 16,
  },
});

export const playerSS = SpriteSheet.fromImageSource({
  image: Resources.player,
  grid: {
    rows: 5,
    columns: 3,
    spriteWidth: 24,
    spriteHeight: 24,
  },
});

export const player2SS = SpriteSheet.fromImageSource({
  image: Resources.player2,
  grid: {
    rows: 5,
    columns: 3,
    spriteWidth: 24,
    spriteHeight: 24,
  },
});

export const loader = new Loader();

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
