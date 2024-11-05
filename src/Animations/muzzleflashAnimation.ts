import { Animation, AnimationStrategy } from "excalibur";
import { muzzleFlashSS } from "../resources";

export const muzzleFlashAnim = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: muzzleFlashSS.getSprite(0, 0),
      duration: 50,
    },
    {
      graphic: muzzleFlashSS.getSprite(1, 0),
      duration: 50,
    },
    {
      graphic: muzzleFlashSS.getSprite(2, 0),
      duration: 50,
    },
    {
      graphic: muzzleFlashSS.getSprite(3, 0),
      duration: 50,
    },
    {
      graphic: muzzleFlashSS.getSprite(4, 0),
      duration: 50,
    },
    {
      graphic: muzzleFlashSS.getSprite(5, 0),
      duration: 50,
    },
  ],
});
