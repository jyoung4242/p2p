import { Animation, AnimationStrategy } from "excalibur";
import { playerSS, player2SS } from "../resources";

//#region playeranimations
export const plyr1AnimIdleDown = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(0, 0),
      duration: 150,
    },
  ],
});

export const plyr1AnimIdleUp = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(0, 1),
      duration: 150,
    },
  ],
});

export const plyr1AnimIdleRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(0, 2),
      duration: 150,
    },
  ],
});

export let plyr1AnimIdleLeft = plyr1AnimIdleRight.clone();
plyr1AnimIdleLeft.flipHorizontal = true;

export let plyr1AnimIdleDownRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(0, 3),
      duration: 150,
    },
  ],
});

export let plyr1AnimIdleUpRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(0, 4),
      duration: 150,
    },
  ],
});

export let plyr1AnimIdleDownLeft = plyr1AnimIdleDownRight.clone();
plyr1AnimIdleDownLeft.flipHorizontal = true;

export let plyr1AnimIdleUpLeft = plyr1AnimIdleUpRight.clone();
plyr1AnimIdleUpLeft.flipHorizontal = true;

export const plyr1AnimWalkRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(1, 2),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(0, 2),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(2, 2),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(0, 2),
      duration: 150,
    },
  ],
});

export let plyr1AnimWalkLeft = plyr1AnimWalkRight.clone();
plyr1AnimWalkLeft.flipHorizontal = true;

export const plyr1AnimWalkDown = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(1, 0),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(0, 0),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(2, 0),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(0, 0),
      duration: 150,
    },
  ],
});

export const plyr1AnimWalkUp = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(1, 1),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(0, 1),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(2, 1),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(0, 1),
      duration: 150,
    },
  ],
});

export const plyr1AnimWalkDownRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(1, 3),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(0, 3),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(2, 3),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(0, 3),
      duration: 150,
    },
  ],
});

export let plyr1AnimWalkDownLeft = plyr1AnimWalkDownRight.clone();
plyr1AnimWalkDownLeft.flipHorizontal = true;

export const plyr1AnimWalkUpRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(1, 4),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(0, 4),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(2, 4),
      duration: 150,
    },
    {
      graphic: playerSS.getSprite(0, 4),
      duration: 150,
    },
  ],
});

export let plyr1AnimWalkUpLeft = plyr1AnimWalkUpRight.clone();
plyr1AnimWalkUpLeft.flipHorizontal = true;

//#endregion playeranimations

//#region player2animations

export const plyr2AnimIdleDown = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: player2SS.getSprite(0, 0),
      duration: 150,
    },
  ],
});

export const plyr2AnimIdleUp = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: player2SS.getSprite(0, 1),
      duration: 150,
    },
  ],
});

export const plyr2AnimIdleRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: player2SS.getSprite(0, 2),
      duration: 150,
    },
  ],
});

export let plyr2AnimIdleLeft = plyr2AnimIdleRight.clone();
plyr1AnimIdleLeft.flipHorizontal = true;

export let plyr2AnimIdleDownRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: player2SS.getSprite(0, 3),
      duration: 150,
    },
  ],
});

export let plyr2AnimIdleUpRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: player2SS.getSprite(0, 4),
      duration: 150,
    },
  ],
});

export let plyr2AnimIdleDownLeft = plyr2AnimIdleDownRight.clone();
plyr1AnimIdleDownLeft.flipHorizontal = true;

export let plyr2AnimIdleUpLeft = plyr2AnimIdleUpRight.clone();
plyr1AnimIdleUpLeft.flipHorizontal = true;

export const plyr2AnimWalkRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: player2SS.getSprite(1, 2),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(0, 2),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(2, 2),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(0, 2),
      duration: 150,
    },
  ],
});

export let plyr2AnimWalkLeft = plyr2AnimWalkRight.clone();
plyr1AnimWalkLeft.flipHorizontal = true;

export const plyr2AnimWalkDown = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: player2SS.getSprite(1, 0),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(0, 0),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(2, 0),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(0, 0),
      duration: 150,
    },
  ],
});

export const plyr2AnimWalkUp = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: player2SS.getSprite(1, 1),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(0, 1),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(2, 1),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(0, 1),
      duration: 150,
    },
  ],
});

export const plyr2AnimWalkDownRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: player2SS.getSprite(1, 3),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(0, 3),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(2, 3),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(0, 3),
      duration: 150,
    },
  ],
});

export let plyr2AnimWalkDownLeft = plyr2AnimWalkDownRight.clone();
plyr1AnimWalkDownLeft.flipHorizontal = true;

export const plyr2AnimWalkUpRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: player2SS.getSprite(1, 4),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(0, 4),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(2, 4),
      duration: 150,
    },
    {
      graphic: player2SS.getSprite(0, 4),
      duration: 150,
    },
  ],
});

export let plyr2AnimWalkUpLeft = plyr1AnimWalkUpRight.clone();
plyr1AnimWalkUpLeft.flipHorizontal = true;

//#endregion player2animations
