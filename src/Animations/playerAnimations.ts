import { Animation, AnimationStrategy, Graphic } from "excalibur";
import { playerSS, weaponSS, playerLegsSS } from "../resources";

//#region playeranimations
export const plyrAnimIdleDown = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(0, 0),
      duration: 150,
    },
  ],
});

export const plyrAnimIdleUp = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(0, 1),
      duration: 150,
    },
  ],
});

export const plyrAnimIdleRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(0, 2),
      duration: 150,
    },
  ],
});

export let plyrAnimIdleLeft = plyrAnimIdleRight.clone();
plyrAnimIdleLeft.flipHorizontal = true;

export let plyrAnimIdleDownRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(0, 3),
      duration: 150,
    },
  ],
});

export let plyrAnimIdleUpRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerSS.getSprite(0, 4),
      duration: 150,
    },
  ],
});

export let plyrAnimIdleDownLeft = plyrAnimIdleDownRight.clone();
plyrAnimIdleDownLeft.flipHorizontal = true;

export let plyrAnimIdleUpLeft = plyrAnimIdleUpRight.clone();
plyrAnimIdleUpLeft.flipHorizontal = true;

export const plyrAnimWalkRight = new Animation({
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

export let plyrAnimWalkLeft = plyrAnimWalkRight.clone();
plyrAnimWalkLeft.flipHorizontal = true;

export const plyrAnimWalkDown = new Animation({
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

export const plyrAnimWalkUp = new Animation({
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

export const plyrAnimWalkDownRight = new Animation({
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

export let plyrAnimWalkDownLeft = plyrAnimWalkDownRight.clone();
plyrAnimWalkDownLeft.flipHorizontal = true;

export const plyrAnimWalkUpRight = new Animation({
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

export let plyrAnimWalkUpLeft = plyrAnimWalkUpRight.clone();
plyrAnimWalkUpLeft.flipHorizontal = true;

//#endregion playeranimations

//#region weaponanimations
export const weaponAnimIdleDown = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: weaponSS.getSprite(0, 0),
      duration: 150,
    },
  ],
});

export const weaponAnimIdleUp = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: weaponSS.getSprite(0, 2),
      duration: 150,
    },
  ],
});

export const weaponAnimIdleRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: weaponSS.getSprite(0, 3),
      duration: 150,
    },
  ],
});

export const weaponAnimIdleLeft = weaponAnimIdleRight.clone();
weaponAnimIdleLeft.flipHorizontal = true;

export let weaponAnimIdleDownRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: weaponSS.getSprite(0, 3),
      duration: 150,
    },
  ],
});

export let weaponAnimIdleDownLeft = weaponAnimIdleDownRight.clone();
weaponAnimIdleDownLeft.flipHorizontal = true;

export let weaponAnimIdleUpRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: weaponSS.getSprite(0, 4),
      duration: 150,
    },
  ],
});

export let weaponAnimIdleUpLeft = weaponAnimIdleUpRight.clone();
weaponAnimIdleUpLeft.flipHorizontal = true;

export const weaponAnimWalkRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: weaponSS.getSprite(1, 2),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(0, 2),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(2, 2),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(0, 2),
      duration: 150,
    },
  ],
});

export let weaponAnimWalkLeft = weaponAnimWalkRight.clone();
weaponAnimWalkLeft.flipHorizontal = true;

export const weaponAnimWalkDown = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: weaponSS.getSprite(1, 0),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(0, 0),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(2, 0),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(0, 0),
      duration: 150,
    },
  ],
});

export const weaponAnimWalkUp = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: weaponSS.getSprite(1, 1),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(0, 1),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(2, 1),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(0, 1),
      duration: 150,
    },
  ],
});

export const weaponAnimWalkDownRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: weaponSS.getSprite(1, 3),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(0, 3),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(2, 3),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(0, 3),
      duration: 150,
    },
  ],
});

export let weaponAnimWalkDownLeft = weaponAnimWalkDownRight.clone();
weaponAnimWalkDownLeft.flipHorizontal = true;

export const weaponAnimWalkUpRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: weaponSS.getSprite(1, 4),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(0, 4),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(2, 4),
      duration: 150,
    },
    {
      graphic: weaponSS.getSprite(0, 4),
      duration: 150,
    },
  ],
});

export let weaponAnimWalkUpLeft = weaponAnimWalkUpRight.clone();
weaponAnimWalkUpLeft.flipHorizontal = true;

//#endregion weaponanimations

//#region player legs animations

export const plyrLegsAnimIdleDown = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerLegsSS.getSprite(0, 0),
      duration: 150,
    },
  ],
});

export const plyrLegsAnimIdleRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerLegsSS.getSprite(0, 1),
      duration: 150,
    },
  ],
});

export const plyrLegsAnimIdleLeft = plyrLegsAnimIdleRight.clone();
plyrLegsAnimIdleLeft.flipHorizontal = true;

export const plyrLegsAnimIdleUp = plyrLegsAnimIdleDown.clone();

export const plyrLegsAnimWalkDown = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerLegsSS.getSprite(1, 0),
      duration: 150,
    },
    {
      graphic: playerLegsSS.getSprite(0, 0),
      duration: 150,
    },
    {
      graphic: playerLegsSS.getSprite(2, 0),
      duration: 150,
    },
    {
      graphic: playerLegsSS.getSprite(0, 0),
      duration: 150,
    },
  ],
});

export const plyrLegsAnimWalkUp = plyrLegsAnimWalkDown.clone();

export const plyrLegsAnimWalkRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerLegsSS.getSprite(1, 1),
      duration: 150,
    },
    {
      graphic: playerLegsSS.getSprite(0, 1),
      duration: 150,
    },
    {
      graphic: playerLegsSS.getSprite(2, 1),
      duration: 150,
    },
    {
      graphic: playerLegsSS.getSprite(0, 1),
      duration: 150,
    },
  ],
});

export const plyrLegsAnimWalkLeft = plyrLegsAnimWalkRight.clone();
plyrLegsAnimWalkLeft.flipHorizontal = true;

export const plyrLegsAnimIdleUpLeft = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerLegsSS.getSprite(0, 2),
      duration: 150,
    },
  ],
});

export const plyrLegsAnimIdleUpRight = plyrLegsAnimIdleUpLeft.clone();
plyrLegsAnimIdleUpRight.flipHorizontal = true;

export const plyrLegsAnimIdleDownRight = plyrLegsAnimIdleUpLeft.clone();

export const plyrLegsAnimIdleDownLeft = plyrLegsAnimIdleUpRight.clone();
plyrLegsAnimIdleDownLeft.flipHorizontal = true;

export const plyrLegsAnimWalkUpRight = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: playerLegsSS.getSprite(1, 2),
      duration: 150,
    },
    {
      graphic: playerLegsSS.getSprite(0, 2),
      duration: 150,
    },
    {
      graphic: playerLegsSS.getSprite(2, 2),
      duration: 150,
    },
    {
      graphic: playerLegsSS.getSprite(0, 2),
      duration: 150,
    },
  ],
});

export const plyrLegsAnimWalkUpLeft = plyrLegsAnimWalkUpRight.clone();
plyrLegsAnimWalkUpLeft.flipHorizontal = true;

export const plyrLegsAnimWalkDownRight = plyrLegsAnimWalkUpRight.clone();

export const plyrLegsAnimWalkDownLeft = plyrLegsAnimWalkUpRight.clone();
plyrAnimWalkDownLeft.flipHorizontal = true;
//#endregion
