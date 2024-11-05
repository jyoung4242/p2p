import { Actor, Engine, Vector, Graphic, Material, toRadians, Ray, Debug, Color, Collider, CollisionContact, Side } from "excalibur";
import { ExFSM, ExState } from "../Lib/ExFSM";
import { tintShader } from "../Shaders/tint";
import {
  plyrAnimIdleDown,
  plyrAnimIdleDownLeft,
  plyrAnimIdleDownRight,
  plyrAnimIdleLeft,
  plyrAnimIdleRight,
  plyrAnimIdleUp,
  plyrAnimIdleUpLeft,
  plyrAnimIdleUpRight,
  plyrAnimWalkDown,
  plyrAnimWalkDownLeft,
  plyrAnimWalkDownRight,
  plyrAnimWalkLeft,
  plyrAnimWalkRight,
  plyrAnimWalkUp,
  plyrAnimWalkUpLeft,
  plyrAnimWalkUpRight,
  weaponAnimIdleDown,
  weaponAnimIdleDownLeft,
  weaponAnimIdleDownRight,
  weaponAnimIdleLeft,
  weaponAnimIdleRight,
  weaponAnimIdleUp,
  weaponAnimIdleUpLeft,
  weaponAnimIdleUpRight,
  weaponAnimWalkDown,
  weaponAnimWalkDownLeft,
  weaponAnimWalkDownRight,
  weaponAnimWalkLeft,
  weaponAnimWalkRight,
  weaponAnimWalkUp,
  weaponAnimWalkUpLeft,
  weaponAnimWalkUpRight,
  plyrLegsAnimIdleDown,
  plyrLegsAnimIdleDownLeft,
  plyrLegsAnimIdleDownRight,
  plyrLegsAnimIdleLeft,
  plyrLegsAnimIdleRight,
  plyrLegsAnimIdleUp,
  plyrLegsAnimIdleUpLeft,
  plyrLegsAnimIdleUpRight,
  plyrLegsAnimWalkDown,
  plyrLegsAnimWalkDownLeft,
  plyrLegsAnimWalkDownRight,
  plyrLegsAnimWalkLeft,
  plyrLegsAnimWalkRight,
  plyrLegsAnimWalkUp,
  plyrLegsAnimWalkUpLeft,
  plyrLegsAnimWalkUpRight,
} from "../Animations/playerAnimations";
import { ActorSignals } from "../Lib/CustomEmitterManager";
import { muzzleFlashAnim } from "../Animations/muzzleflashAnimation";
import { playerColliders } from "../main";
import { Wall } from "../Lib/roomBuilder";
import { Bug } from "./bug";
import { WeaponSystem, WeaponType } from "../Components/Weapon";
import { Spreader } from "../Components/Weapons/Spreader";

enum StickPosition {
  "Left" = "Left",
  "Right" = "Right",
  "Idle" = "Idle",
  "Up" = "Up",
  "Down" = "Down",
  "UpLeft" = "upLeft",
  "UpRight" = "upRight",
  "DownLeft" = "downLeft",
  "DownRight" = "downRight",
}

type Direction = "Left" | "Right" | "Up" | "Down" | "upLeft" | "upRight" | "downLeft" | "downRight";

const trueDirection = {
  Left: "lowerWalkLeft",
  Right: "lowerWalkRight",
  Up: "lowerWalkUp",
  Down: "lowerWalkDown",
  upLeft: "lowerWalkUpLeft",
  upRight: "lowerWalkUpRight",
  downLeft: "lowerWalkDownLeft",
  downRight: "lowerWalkDownRight",
};

const reverseDirection = {
  Left: "lowerWalkRight",
  Right: "lowerWalkLeft",
  Up: "lowerWalkDown",
  Down: "lowerWalkUp",
  upLeft: "lowerWalkDownRight",
  upRight: "lowerWalkDownLeft",
  downLeft: "lowerWalkUpRight",
  downRight: "lowerWalkUpLeft",
};

const opposites = {
  Left: [StickPosition.Right, StickPosition.UpRight, StickPosition.DownRight],
  Right: [StickPosition.Left, StickPosition.UpLeft, StickPosition.DownLeft],
  Up: [StickPosition.Down, StickPosition.DownLeft, StickPosition.DownRight],
  Down: [StickPosition.Up, StickPosition.UpLeft, StickPosition.UpRight],
  upLeft: [StickPosition.Down, StickPosition.Right, StickPosition.DownRight],
  upRight: [StickPosition.Down, StickPosition.Left, StickPosition.DownLeft],
  downLeft: [StickPosition.Up, StickPosition.UpRight, StickPosition.Right],
  downRight: [StickPosition.Up, StickPosition.UpLeft, StickPosition.Left],
};

const MuzzleMap = {
  Down: { angle: 90, position: new Vector(7.5, 26), z: 1 },
  Right: { angle: 0, position: new Vector(24, 15), z: 1 },
  Left: { angle: 180, position: new Vector(0, 15), z: 1 },
  Up: { angle: 270, position: new Vector(15, 0), z: 0 },
  upLeft: { angle: 225, position: new Vector(-1, 8), z: 0 },
  upRight: { angle: 315, position: new Vector(24, 8), z: 0 },
  downLeft: { angle: 135, position: new Vector(7, 23), z: 1 },
  downRight: { angle: 45, position: new Vector(21, 23), z: 1 },
};

const VectorDirMap = {
  Down: Vector.Down,
  Up: Vector.Up,
  Left: Vector.Left,
  Right: Vector.Right,
  upLeft: Vector.Up.add(Vector.Left),
  upRight: Vector.Up.add(Vector.Right),
  downLeft: Vector.Down.add(Vector.Left),
  downRight: Vector.Down.add(Vector.Right),
};

class Muzzleflash extends Actor {
  weaponSystem: WeaponSystem;
  direction: Direction = "Down";
  vecDir: Vector = VectorDirMap[this.direction];
  isVisible: boolean = false;
  muzzleGraphics: Graphic;
  flashMaterial: Material | null = null;
  flashColor: Color = Color.fromHex("#63DEFF");
  fireRateLimit = 10;
  fireRateTik = 0;
  constructor(private owner: Upper) {
    super({
      name: "muzzleflash",
      width: 12,
      height: 12,
      anchor: Vector.Half,
      pos: new Vector(7.5, 26),
      scale: new Vector(1, 1),
      z: 5,
    });
    this.muzzleGraphics = muzzleFlashAnim;
    this.rotation = toRadians(90);
    this.z = -1;
    this.weaponSystem = new WeaponSystem(this);
    this.addComponent(this.weaponSystem);
  }

  setState(direction: Direction) {
    this.direction = direction;
  }

  fireRay(engine: Engine) {
    const convertedDirection = VectorDirMap[this.direction];

    const ray = new Ray(this.getGlobalPos(), convertedDirection);
    Debug.drawRay(ray, { color: Color.Red, distance: 2000 });
    const hits = engine.currentScene.physics.rayCast(ray, {
      searchAllColliders: false,
      collisionMask: 0b1100,
      ignoreCollisionGroupAll: true,
      maxDistance: 2000,
    });

    if (hits && hits.length > 0) {
      if (hits[0].body.owner instanceof Bug) {
        hits[0].body.owner.showDamage(convertedDirection);
      } else if (hits[0].body.owner instanceof Wall) {
        hits[0].body.owner.showSparks(engine, hits[0].point);
      }
    }

    return hits;
  }

  onInitialize(engine: Engine): void {
    this.graphics.use(this.muzzleGraphics);
    this.graphics.hide();
    ActorSignals.on("shoot", data => {
      if (this.owner.isArmed) this.isVisible = true;
    });
    ActorSignals.on("stopshoot", data => {
      console.log("stopshoot");

      this.isVisible = false;
    });

    //setup tint shader
    this.flashMaterial = engine.graphicsContext.createMaterial({
      name: "outline",
      fragmentSource: tintShader,
    });
    this.graphics.material = this.flashMaterial;
    if (this.flashMaterial) this.flashMaterial.use();

    this.flashMaterial.update(shader => {
      shader.setUniform("uniform3f", "U_color", this.flashColor.r / 255, this.flashColor.g / 255, this.flashColor.b / 255);
    });

    // Signals
    ActorSignals.on("walkLeft", data => this.setState("Left"));
    ActorSignals.on("walkRight", data => this.setState("Right"));
    ActorSignals.on("walkDown", data => this.setState("Down"));
    ActorSignals.on("walkUp", data => this.setState("Up"));
    ActorSignals.on("walkUpRight", data => this.setState("upRight"));
    ActorSignals.on("walkDownLeft", data => this.setState("downLeft"));
    ActorSignals.on("walkDownRight", data => this.setState("downRight"));
    ActorSignals.on("walkUpLeft", data => this.setState("upLeft"));
    ActorSignals.on("rightStickLeft", data => this.setState("Left"));
    ActorSignals.on("rightStickRight", data => this.setState("Right"));
    ActorSignals.on("rightStickDown", data => this.setState("Down"));
    ActorSignals.on("rightStickUp", data => this.setState("Up"));
    ActorSignals.on("rightStickUpRight", data => this.setState("upRight"));
    ActorSignals.on("rightStickDownLeft", data => this.setState("downLeft"));
    ActorSignals.on("rightStickDownRight", data => this.setState("downRight"));
    ActorSignals.on("rightStickUpLeft", data => this.setState("upLeft"));
    this.weaponSystem.loadWeapon(new Spreader());
    this.flashColor = this.weaponSystem.switchWeapon(WeaponType.spreader);
    console.log("starting color", this.flashColor);

    ActorSignals.on("outOfAmmo", data => {
      console.log("out of ammo");
      this.flashColor = this.weaponSystem.switchWeapon(WeaponType.primary);
      console.log("new color", this.flashColor);
    });
  }

  onPreUpdate(engine: Engine, delta: number): void {
    this.vecDir = VectorDirMap[this.direction];

    if (this.flashMaterial)
      this.flashMaterial.update(shader => {
        shader.setUniform("uniform3f", "U_color", this.flashColor.r / 255, this.flashColor.g / 255, this.flashColor.b / 255);
      });

    if (this.isVisible) {
      this.pos = MuzzleMap[this.direction].position;
      this.rotation = toRadians(MuzzleMap[this.direction].angle);
      this.z = MuzzleMap[this.direction].z;
      this.graphics.use(this.muzzleGraphics);

      if (this.weaponSystem.currentWeapon == "primary") {
        this.weaponSystem.setFiringStatus(false);
        this.fireRateTik++;
        if (this.fireRateTik > this.fireRateLimit) {
          this.fireRateTik = 0;
          this.fireRay(engine);
        }
      } else this.weaponSystem.setFiringStatus(true);
    } else {
      this.graphics.hide();
      this.weaponSystem.setFiringStatus(false);
    }
  }
}

class Upper extends Actor {
  facing: Direction;
  gamePadDetected: boolean = false;
  lStick: StickPosition = StickPosition.Idle;
  rStick: StickPosition = StickPosition.Idle;
  isArmed: boolean = true;
  fsm: ExFSM;
  muzzleFlash: Muzzleflash = new Muzzleflash(this);
  constructor() {
    super({
      name: "upper",
      width: 24,
      height: 24,
      z: 2,
      anchor: Vector.Zero,
    });

    this.fsm = new ExFSM(this);
    this.facing = "Down";
    this.addChild(this.muzzleFlash);
  }

  onInitialize(engine: Engine): void {
    ActorSignals.on("gamepadDetected", data => (this.gamePadDetected = true));

    ActorSignals.on("leftStickDown", data => (this.lStick = StickPosition.Down));
    ActorSignals.on("leftStickUp", data => (this.lStick = StickPosition.Up));
    ActorSignals.on("leftStickLeft", data => (this.lStick = StickPosition.Left));
    ActorSignals.on("leftStickRight", data => (this.lStick = StickPosition.Right));
    ActorSignals.on("leftStickDownLeft", data => (this.lStick = StickPosition.DownLeft));
    ActorSignals.on("leftStickDownRight", data => (this.lStick = StickPosition.DownRight));
    ActorSignals.on("leftStickUpLeft", data => (this.lStick = StickPosition.UpLeft));
    ActorSignals.on("leftStickUpRight", data => (this.lStick = StickPosition.UpRight));
    ActorSignals.on("leftStickIdle", data => (this.lStick = StickPosition.Idle));

    ActorSignals.on("rightStickDown", data => (this.rStick = StickPosition.Down));
    ActorSignals.on("rightStickUp", data => (this.rStick = StickPosition.Up));
    ActorSignals.on("rightStickLeft", data => (this.rStick = StickPosition.Left));
    ActorSignals.on("rightStickRight", data => (this.rStick = StickPosition.Right));
    ActorSignals.on("rightStickDownLeft", data => (this.rStick = StickPosition.DownLeft));
    ActorSignals.on("rightStickDownRight", data => (this.rStick = StickPosition.DownRight));
    ActorSignals.on("rightStickUpLeft", data => (this.rStick = StickPosition.UpLeft));
    ActorSignals.on("rightStickUpRight", data => (this.rStick = StickPosition.UpRight));
    ActorSignals.on("rightStickIdle", data => (this.rStick = StickPosition.Idle));

    this.fsm.register(new IdleDown(this.fsm));
    this.fsm.register(new IdleUp(this.fsm));
    this.fsm.register(new IdleLeft(this.fsm));
    this.fsm.register(new IdleRight(this.fsm));
    this.fsm.register(new IdleUpRight(this.fsm));
    this.fsm.register(new IdleUpLeft(this.fsm));
    this.fsm.register(new IdleDownRight(this.fsm));
    this.fsm.register(new IdleDownLeft(this.fsm));

    this.fsm.register(new playerAnimWalkDown(this.fsm));
    this.fsm.register(new playerAnimWalkUp(this.fsm));
    this.fsm.register(new playerAnimWalkLeft(this.fsm));
    this.fsm.register(new playerAnimWalkRight(this.fsm));
    this.fsm.register(new playerAnimWalkDownRight(this.fsm));
    this.fsm.register(new playerAnimWalkDownLeft(this.fsm));
    this.fsm.register(new playerAnimWalkUpRight(this.fsm));
    this.fsm.register(new playerAnimWalkUpLeft(this.fsm));
    this.fsm.set("idleDown");

    ActorSignals.on("toggleArm", data => {
      if (this.isArmed) this.isArmed = false;
      else this.isArmed = true;
    });
  }

  onPreUpdate(engine: Engine, delta: number): void {
    let animstate;

    if (this.gamePadDetected && this.isArmed && this.rStick != StickPosition.Idle) {
      this.muzzleFlash.setState(this.rStick);
      this.muzzleFlash.isVisible = true;
    } else if (this.gamePadDetected && this.isArmed && this.rStick == StickPosition.Idle) this.muzzleFlash.isVisible = false;

    if (this.lStick == StickPosition.Idle && this.rStick != StickPosition.Idle) {
      //idle
      animstate = "idle" + this.rStick;
      this.fsm.set(animstate);
    } else if (this.lStick != StickPosition.Idle && this.rStick != StickPosition.Idle) {
      //moving
      animstate = "walk" + this.rStick;
      this.facing = this.rStick;
    } else {
      //idle idle
      animstate = "idle" + this.facing;
    }
    //idle
    this.fsm.set(animstate);
    this.fsm.update();
  }
}

class Lower extends Actor {
  facing: Direction;
  lStick: StickPosition = StickPosition.Idle;
  rStick: StickPosition = StickPosition.Idle;
  fsm: ExFSM;

  constructor() {
    super({
      name: "lower",
      width: 24,
      height: 24,
      z: 1,
      anchor: Vector.Zero,
    });

    this.fsm = new ExFSM(this);
    this.facing = "Down";
  }

  onInitialize(engine: Engine): void {
    ActorSignals.on("leftStickDown", data => (this.lStick = StickPosition.Down));
    ActorSignals.on("leftStickUp", data => (this.lStick = StickPosition.Up));
    ActorSignals.on("leftStickLeft", data => (this.lStick = StickPosition.Left));
    ActorSignals.on("leftStickRight", data => (this.lStick = StickPosition.Right));
    ActorSignals.on("leftStickDownLeft", data => (this.lStick = StickPosition.DownLeft));
    ActorSignals.on("leftStickDownRight", data => (this.lStick = StickPosition.DownRight));
    ActorSignals.on("leftStickUpLeft", data => (this.lStick = StickPosition.UpLeft));
    ActorSignals.on("leftStickUpRight", data => (this.lStick = StickPosition.UpRight));
    ActorSignals.on("leftStickIdle", data => (this.lStick = StickPosition.Idle));

    ActorSignals.on("rightStickDown", data => (this.rStick = StickPosition.Down));
    ActorSignals.on("rightStickUp", data => (this.rStick = StickPosition.Up));
    ActorSignals.on("rightStickLeft", data => (this.rStick = StickPosition.Left));
    ActorSignals.on("rightStickRight", data => (this.rStick = StickPosition.Right));
    ActorSignals.on("rightStickDownLeft", data => (this.rStick = StickPosition.DownLeft));
    ActorSignals.on("rightStickDownRight", data => (this.rStick = StickPosition.DownRight));
    ActorSignals.on("rightStickUpLeft", data => (this.rStick = StickPosition.UpLeft));
    ActorSignals.on("rightStickUpRight", data => (this.rStick = StickPosition.UpRight));
    ActorSignals.on("rightStickIdle", data => (this.rStick = StickPosition.Idle));

    this.fsm.register(new LowerIdleDown(this.fsm));
    this.fsm.register(new LowerIdleUp(this.fsm));
    this.fsm.register(new LowerIdleLeft(this.fsm));
    this.fsm.register(new LowerIdleRight(this.fsm));
    this.fsm.register(new LowerIdleUpRight(this.fsm));
    this.fsm.register(new LowerIdleUpLeft(this.fsm));
    this.fsm.register(new LowerIdleDownRight(this.fsm));
    this.fsm.register(new LowerIdleDownLeft(this.fsm));
    this.fsm.register(new LowerWalkDown(this.fsm));
    this.fsm.register(new LowerWalkUp(this.fsm));
    this.fsm.register(new LowerWalkLeft(this.fsm));
    this.fsm.register(new LowerWalkRight(this.fsm));
    this.fsm.register(new LowerWalkDownRight(this.fsm));
    this.fsm.register(new LowerWalkDownLeft(this.fsm));
    this.fsm.register(new LowerWalkUpRight(this.fsm));
    this.fsm.register(new LowerWalkUpLeft(this.fsm));

    this.fsm.set("lowerIdleDown");
  }

  onPreUpdate(engine: Engine, delta: number): void {
    if (this.lStick == StickPosition.Idle) {
      //left stick Idle, use Right Stick to pick idle direction
      switch (this.rStick) {
        case StickPosition.Down:
          this.fsm.set("lowerIdleDown");
          this.facing = "Down";
          break;
        case StickPosition.Up:
          this.fsm.set("lowerIdleUp");
          this.facing = "Up";
          break;
        case StickPosition.Left:
          this.fsm.set("lowerIdleLeft");
          this.facing = "Left";
          break;
        case StickPosition.Right:
          this.fsm.set("lowerIdleRight");
          this.facing = "Right";
          break;
        case StickPosition.DownLeft:
          this.fsm.set("lowerIdleDownLeft");
          this.facing = "downLeft";
          break;
        case StickPosition.DownRight:
          this.fsm.set("lowerIdleDownRight");
          this.facing = "downRight";
          break;
        case StickPosition.UpLeft:
          this.fsm.set("lowerIdleUpLeft");
          this.facing = "upLeft";
          break;
        case StickPosition.UpRight:
          this.fsm.set("lowerIdleUpRight");
          this.facing = "upRight";
          break;
        default:
          switch (this.facing) {
            case "Left":
              this.fsm.set("lowerIdleLeft");
              break;
            case "Right":
              this.fsm.set("lowerIdleRight");
              break;
            case "Up":
              this.fsm.set("lowerIdleUp");
              break;
            case "Down":
              this.fsm.set("lowerIdleDown");
              break;
            case "upLeft":
              this.fsm.set("lowerIdleUpLeft");
              break;
            case "upRight":
              this.fsm.set("lowerIdleRight");
              break;
            case "downLeft":
              this.fsm.set("lowerIdleDownLeft");
              break;
            case "downRight":
              this.fsm.set("lowerIdleDownRight");
              break;
          }
          break;
      }
    } else {
      let animation;
      if (checkForOpposite(this.lStick, this.rStick)) {
        // walk backwards
        animation = reverseDirection[this.lStick];
      } else {
        // use lstick
        animation = trueDirection[this.lStick];
      }
      this.fsm.set(animation);
    }

    this.fsm.update();
  }
}

export class Player extends Actor {
  collisionDirection: Array<"left" | "right" | "top" | "bottom"> = [];
  upper: Upper = new Upper();
  lower: Lower = new Lower();
  constructor() {
    super({
      name: "player",
      width: 24,
      height: 24,
      anchor: Vector.Zero,
      z: 4,
      scale: new Vector(2, 2),
      pos: new Vector(250, 250),
      collisionGroup: playerColliders,
    });

    this.addChild(this.upper);
    this.addChild(this.lower);
  }

  onCollisionStart(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {
    //test if other.owner is of a instance Wall
    if (other.owner instanceof Wall) {
      switch (side) {
        case Side.None:
          this.collisionDirection = [];
          break;
        case Side.Top:
          //check array for top
          if (this.collisionDirection.indexOf("top") == -1) {
            this.collisionDirection.push("top");
          }
          break;
        case Side.Bottom:
          if (this.collisionDirection.indexOf("bottom") == -1) {
            this.collisionDirection.push("bottom");
          }
          break;
        case Side.Left:
          if (this.collisionDirection.indexOf("left") == -1) {
            this.collisionDirection.push("left");
          }
          break;
        case Side.Right:
          if (this.collisionDirection.indexOf("right") == -1) {
            this.collisionDirection.push("right");
          }
          break;
      }
    }
  }

  onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {
    if (other.owner instanceof Wall) {
      let index;
      switch (side) {
        case Side.None:
          this.collisionDirection = [];
          break;
        case Side.Top:
          index = this.collisionDirection.indexOf("top");
          if (index > -1) this.collisionDirection.splice(index, 1);
          break;
        case Side.Bottom:
          index = this.collisionDirection.indexOf("bottom");
          if (index > -1) this.collisionDirection.splice(index, 1);
          break;
        case Side.Left:
          index = this.collisionDirection.indexOf("left");
          if (index > -1) this.collisionDirection.splice(index, 1);
          break;
        case Side.Right:
          index = this.collisionDirection.indexOf("right");
          if (index > -1) this.collisionDirection.splice(index, 1);
          break;
      }
    }
  }

  onPreUpdate(engine: Engine, delta: number): void {
    let playvelocity = 50;

    switch (this.lower.lStick) {
      case StickPosition.Left:
        //add collision check
        if (this.collisionDirection.indexOf("left") == -1) this.vel = new Vector(-playvelocity, 0);
        else this.vel = new Vector(0, 0);
        break;
      case StickPosition.Right:
        if (this.collisionDirection.indexOf("right") == -1) this.vel = new Vector(playvelocity, 0);
        else this.vel = new Vector(0, 0);
        break;
      case StickPosition.Idle:
        this.vel = new Vector(0, 0);
        break;
      case StickPosition.Up:
        if (this.collisionDirection.indexOf("top") == -1) this.vel = new Vector(0, -playvelocity);
        else this.vel = new Vector(0, 0);
        break;
      case StickPosition.Down:
        if (this.collisionDirection.indexOf("bottom") == -1) this.vel = new Vector(0, playvelocity);
        else this.vel = new Vector(0, 0);
        break;
      case StickPosition.UpLeft:
        if (this.collisionDirection.indexOf("top") == -1 && this.collisionDirection.indexOf("left") == -1)
          this.vel = new Vector(-playvelocity, -playvelocity);
        else this.vel = new Vector(0, 0);
        break;
      case StickPosition.UpRight:
        if (this.collisionDirection.indexOf("top") == -1 && this.collisionDirection.indexOf("right") == -1)
          this.vel = new Vector(playvelocity, -playvelocity);
        else this.vel = new Vector(0, 0);
        break;
      case StickPosition.DownLeft:
        if (this.collisionDirection.indexOf("bottom") == -1 && this.collisionDirection.indexOf("left") == -1)
          this.vel = new Vector(-playvelocity, playvelocity);
        else this.vel = new Vector(0, 0);
        break;
      case StickPosition.DownRight:
        if (this.collisionDirection.indexOf("bottom") == -1 && this.collisionDirection.indexOf("right") == -1)
          this.vel = new Vector(playvelocity, playvelocity);
        else this.vel = new Vector(0, 0);
        break;
    }
  }
}

//#region states

class Idle extends ExState {
  constructor(public machine: ExFSM) {
    super("idle", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) {
      switch (this.machine.owner.muzzleFlash.direction) {
        case "up":
          this.machine.owner.graphics.use(weaponAnimIdleUp);
          break;
        case "down":
          this.machine.owner.graphics.use(weaponAnimIdleDown);
          break;
        case "left":
          this.machine.owner.graphics.use(weaponAnimIdleLeft);
          break;
        case "right":
          this.machine.owner.graphics.use(weaponAnimIdleRight);
          break;
        case "upleft":
          this.machine.owner.graphics.use(weaponAnimIdleUpLeft);
          break;
        case "upright":
          this.machine.owner.graphics.use(weaponAnimIdleUpRight);
          break;
        case "downleft":
          this.machine.owner.graphics.use(weaponAnimIdleDownLeft);
          break;
        case "downright":
          this.machine.owner.graphics.use(weaponAnimIdleDownRight);
          break;
      }
    } else {
      switch (this.machine.owner.muzzleFlash.direction) {
        case "up":
          this.machine.owner.graphics.use(plyrAnimIdleUp);
          break;
        case "down":
          this.machine.owner.graphics.use(plyrAnimIdleDown);
          break;
        case "left":
          this.machine.owner.graphics.use(plyrAnimIdleLeft);
          break;
        case "right":
          this.machine.owner.graphics.use(plyrAnimIdleRight);
          break;
        case "upleft":
          this.machine.owner.graphics.use(plyrAnimIdleUpLeft);
          break;
        case "upright":
          this.machine.owner.graphics.use(plyrAnimIdleUpRight);
          break;
        case "downleft":
          this.machine.owner.graphics.use(plyrAnimIdleDownLeft);
          break;
        case "downright":
          this.machine.owner.graphics.use(plyrAnimIdleDownRight);
          break;
      }
    }
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) {
      switch (this.machine.owner.muzzleFlash.direction) {
        case "up":
          this.machine.owner.graphics.use(weaponAnimIdleUp);
          break;
        case "down":
          this.machine.owner.graphics.use(weaponAnimIdleDown);
          break;
        case "left":
          this.machine.owner.graphics.use(weaponAnimIdleLeft);
          break;
        case "right":
          this.machine.owner.graphics.use(weaponAnimIdleRight);
          break;
        case "upleft":
          this.machine.owner.graphics.use(weaponAnimIdleUpLeft);
          break;
        case "upright":
          this.machine.owner.graphics.use(weaponAnimIdleUpRight);
          break;
        case "downleft":
          this.machine.owner.graphics.use(weaponAnimIdleDownLeft);
          break;
        case "downright":
          this.machine.owner.graphics.use(weaponAnimIdleDownRight);
          break;
      }
    } else {
      switch (this.machine.owner.muzzleFlash.direction) {
        case "up":
          this.machine.owner.graphics.use(plyrAnimIdleUp);
          break;
        case "down":
          this.machine.owner.graphics.use(plyrAnimIdleDown);
          break;
        case "left":
          this.machine.owner.graphics.use(plyrAnimIdleLeft);
          break;
        case "right":
          this.machine.owner.graphics.use(plyrAnimIdleRight);
          break;
        case "upleft":
          this.machine.owner.graphics.use(plyrAnimIdleUpLeft);
          break;
        case "upright":
          this.machine.owner.graphics.use(plyrAnimIdleUpRight);
          break;
        case "downleft":
          this.machine.owner.graphics.use(plyrAnimIdleDownLeft);
          break;
        case "downright":
          this.machine.owner.graphics.use(plyrAnimIdleDownRight);
          break;
      }
    }
  }
}

type AnimationKey =
  | "plyrAnimIdleDownRight"
  | "plyrAnimIdleDown"
  | "plyrAnimIdleDownLeft"
  | "plyrAnimIdleLeft"
  | "plyrAnimIdleRight"
  | "plyrAnimIdleUp"
  | "plyrAnimIdleUpLeft"
  | "plyrAnimIdleUpRight"
  | "weaponAnimIdleDown"
  | "weaponAnimIdleDownLeft"
  | "weaponAnimIdleDownRight"
  | "weaponAnimIdleLeft"
  | "weaponAnimIdleRight"
  | "weaponAnimIdleUp"
  | "weaponAnimIdleUpLeft"
  | "weaponAnimIdleUpRight";

const animationMap = {
  plyrAnimIdleDown,
  plyrAnimIdleLeft,
  plyrAnimIdleDownRight,
  plyrAnimIdleUp,
  plyrAnimIdleUpRight,
  plyrAnimIdleUpLeft,
  plyrAnimIdleRight,
  plyrAnimIdleDownLeft,
  weaponAnimIdleDown,
  weaponAnimIdleDownLeft,
  weaponAnimIdleDownRight,
  weaponAnimIdleLeft,
  weaponAnimIdleRight,
  weaponAnimIdleUp,
  weaponAnimIdleUpLeft,
  weaponAnimIdleUpRight,
};

class IdleDown extends ExState {
  constructor(public machine: ExFSM) {
    super("idleDown", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleDown";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }

  update(...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleDown";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }
}

class IdleUp extends ExState {
  constructor(public machine: ExFSM) {
    super("idleUp", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleUp";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }

  update(...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleUp";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }
}

class IdleLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("idleLeft", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleLeft";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }

  update(...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleLeft";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }
}

class IdleRight extends ExState {
  constructor(public machine: ExFSM) {
    super("idleRight", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleRight";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }

  update(...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleRight";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }
}

class IdleUpRight extends ExState {
  constructor(public machine: ExFSM) {
    super("idleupRight", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleUpRight";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }

  update(...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleUpRight";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }
}
class IdleUpLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("idleupLeft", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleUpLeft";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }

  update(...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleUpLeft";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }
}

class IdleDownLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("idledownLeft", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleDownLeft";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }

  update(...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleDownLeft";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }
}

class IdleDownRight extends ExState {
  constructor(public machine: ExFSM) {
    super("idledownRight", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleDownRight";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }

  update(...params: any): void | Promise<void> {
    let armedstate: AnimationKey;
    let tempstring: string;
    if (this.machine.owner.isArmed) tempstring = "weaponAnim";
    else tempstring = "plyrAnim";
    armedstate = tempstring + "IdleDownRight";

    this.machine.owner.graphics.use(animationMap[armedstate as AnimationKey]);
  }
}

class playerAnimWalkLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("walkLeft", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkLeft);
    else this.machine.owner.graphics.use(plyrAnimWalkLeft);
  }
  update(...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkLeft);
    else this.machine.owner.graphics.use(plyrAnimWalkLeft);
  }
}

class playerAnimWalkRight extends ExState {
  constructor(public machine: ExFSM) {
    super("walkRight", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkRight);
    else this.machine.owner.graphics.use(plyrAnimWalkRight);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkRight);
    else this.machine.owner.graphics.use(plyrAnimWalkRight);
  }
}

class playerAnimWalkUp extends ExState {
  constructor(public machine: ExFSM) {
    super("walkUp", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkUp);
    else this.machine.owner.graphics.use(plyrAnimWalkUp);
  }
  update(...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkUp);
    else this.machine.owner.graphics.use(plyrAnimWalkUp);
  }
}

class playerAnimWalkDown extends ExState {
  constructor(public machine: ExFSM) {
    super("walkDown", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkDown);
    else this.machine.owner.graphics.use(plyrAnimWalkDown);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkDown);
    else this.machine.owner.graphics.use(plyrAnimWalkDown);
  }
}

class playerAnimWalkDownRight extends ExState {
  constructor(public machine: ExFSM) {
    super("walkdownRight", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkDownRight);
    else this.machine.owner.graphics.use(plyrAnimWalkDownRight);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkDownRight);
    else this.machine.owner.graphics.use(plyrAnimWalkDownRight);
  }
}

class playerAnimWalkDownLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("walkdownLeft", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkDownLeft);
    else this.machine.owner.graphics.use(plyrAnimWalkDownLeft);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkDownLeft);
    else this.machine.owner.graphics.use(plyrAnimWalkDownLeft);
  }
}
class playerAnimWalkUpRight extends ExState {
  constructor(public machine: ExFSM) {
    super("walkupRight", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkUpRight);
    else this.machine.owner.graphics.use(plyrAnimWalkUpRight);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkUpRight);
    else this.machine.owner.graphics.use(plyrAnimWalkUpRight);
  }
}

class playerAnimWalkUpLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("walkupLeft", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkUpLeft);
    else this.machine.owner.graphics.use(plyrAnimWalkUpLeft);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.isArmed) this.machine.owner.graphics.use(weaponAnimWalkUpLeft);
    else this.machine.owner.graphics.use(plyrAnimWalkUpLeft);
  }
}

//#endregion states

//#region lowerstates

class LowerIdleDown extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerIdleDown", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleDown);
  }

  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleDown);
  }
}

class LowerIdleUp extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerIdleUp", machine);
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleUp);
  }

  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleUp);
  }
}
class LowerIdleLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerIdleLeft", machine);
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleLeft);
  }

  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleLeft);
  }
}

class LowerIdleRight extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerIdleRight", machine);
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleRight);
  }

  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleRight);
  }
}

class LowerIdleDownLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerIdleDownLeft", machine);
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleDownLeft);
  }

  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleDownLeft);
  }
}

class LowerIdleDownRight extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerIdleDownRight", machine);
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleDownRight);
  }

  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleDownRight);
  }
}

class LowerIdleUpLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerIdleUpLeft", machine);
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleUpLeft);
  }

  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleUpLeft);
  }
}

class LowerIdleUpRight extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerIdleUpRight", machine);
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleUpRight);
  }
  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimIdleUpRight);
  }
}

class LowerWalkDown extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerWalkDown", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkDown);
  }

  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkDown);
  }
}

class LowerWalkUp extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerWalkUp", machine);
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkUp);
  }
  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkUp);
  }
}

class LowerWalkLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerWalkLeft", machine);
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkLeft);
  }
  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkLeft);
  }
}

class LowerWalkRight extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerWalkRight", machine);
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkRight);
  }
  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkRight);
  }
}

class LowerWalkDownLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerWalkDownLeft", machine);
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkDownLeft);
  }
  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkDownLeft);
  }
}

class LowerWalkDownRight extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerWalkDownRight", machine);
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkDownRight);
  }
  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkDownRight);
  }
}

class LowerWalkUpLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerWalkUpLeft", machine);
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkUpLeft);
  }
  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkUpLeft);
  }
}

class LowerWalkUpRight extends ExState {
  constructor(public machine: ExFSM) {
    super("lowerWalkUpRight", machine);
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkUpRight);
  }
  update(...params: any): void | Promise<void> {
    this.machine.owner.graphics.use(plyrLegsAnimWalkUpRight);
  }
}

//#endregion lowerstates

function checkForOpposite(leftstick: StickPosition, rightstick: StickPosition): boolean {
  if (leftstick != StickPosition.Idle) {
    let oppositesSticks = opposites[leftstick];

    //look if rightstick is in returned list
    if (oppositesSticks.includes(rightstick)) {
      return true;
    }
  }

  return false;
}

function dec2bin(dec: number) {
  return (dec >>> 0).toString(2);
}
