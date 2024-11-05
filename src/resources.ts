// resources.ts
import { ImageSource, Loader, Sprite, SpriteSheet } from "excalibur";
import bug from "./Assets/bug.png";

export const Resources = {
  bug: new ImageSource(bug),
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

export const loader = new Loader();

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
