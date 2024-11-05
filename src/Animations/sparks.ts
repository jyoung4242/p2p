import { AnimationStrategy, Animation } from "excalibur";
import { sparksSS } from "../resources";

export const sparksAnimation = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: sparksSS.getSprite(0, 0),
      duration: 50,
    },
    {
      graphic: sparksSS.getSprite(1, 0),
      duration: 50,
    },
    {
      graphic: sparksSS.getSprite(2, 0),
      duration: 50,
    },
    {
      graphic: sparksSS.getSprite(3, 0),
      duration: 50,
    },
    {
      graphic: sparksSS.getSprite(4, 0),
      duration: 50,
    },
    {
      graphic: sparksSS.getSprite(5, 0),
      duration: 50,
    },
    {
      graphic: sparksSS.getSprite(6, 0),
      duration: 50,
    },
  ],
});
