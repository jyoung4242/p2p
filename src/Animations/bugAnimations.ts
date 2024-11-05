import { AnimationStrategy, Animation } from "excalibur";
import { bugSS } from "../resources";

export const bugAnimation = new Animation({
  strategy: AnimationStrategy.PingPong,
  frames: [
    {
      graphic: bugSS.getSprite(0, 0),
      duration: 50,
    },
    {
      graphic: bugSS.getSprite(1, 0),
      duration: 50,
    },
    {
      graphic: bugSS.getSprite(2, 0),
      duration: 50,
    },
    {
      graphic: bugSS.getSprite(3, 0),
      duration: 50,
    },
    {
      graphic: bugSS.getSprite(4, 0),
      duration: 50,
    },
    {
      graphic: bugSS.getSprite(5, 0),
      duration: 50,
    },
  ],
});
