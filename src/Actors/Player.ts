import {
  Actor,
  Engine,
  Vector,
  Graphic,
  Material,
  toRadians,
  Ray,
  Debug,
  Color,
  Collider,
  CollisionContact,
  Side,
  KeyEvent,
  Keys,
} from "excalibur";
import { ExFSM, ExState } from "../Lib/ExFSM";
import { tintShader } from "../Shaders/tint";
import {
  plyr1AnimIdleDown,
  plyr1AnimIdleDownLeft,
  plyr1AnimIdleDownRight,
  plyr1AnimIdleLeft,
  plyr1AnimIdleRight,
  plyr1AnimIdleUp,
  plyr1AnimIdleUpLeft,
  plyr1AnimIdleUpRight,
  plyr1AnimWalkDown,
  plyr1AnimWalkDownLeft,
  plyr1AnimWalkDownRight,
  plyr1AnimWalkLeft,
  plyr1AnimWalkRight,
  plyr1AnimWalkUp,
  plyr1AnimWalkUpLeft,
  plyr1AnimWalkUpRight,
  plyr2AnimIdleDown,
  plyr2AnimIdleDownLeft,
  plyr2AnimIdleDownRight,
  plyr2AnimIdleLeft,
  plyr2AnimIdleRight,
  plyr2AnimIdleUp,
  plyr2AnimIdleUpLeft,
  plyr2AnimIdleUpRight,
  plyr2AnimWalkDown,
  plyr2AnimWalkDownLeft,
  plyr2AnimWalkDownRight,
  plyr2AnimWalkLeft,
  plyr2AnimWalkRight,
  plyr2AnimWalkUp,
  plyr2AnimWalkUpLeft,
  plyr2AnimWalkUpRight,
} from "../Animations/playerAnimations";
import { ActorSignals } from "../Lib/CustomEmitterManager";
import { muzzleFlashAnim } from "../Animations/muzzleflashAnimation";
import { NW_MessageType, P2P } from "../Lib/P2P";
import { UUID } from "../Lib/UUID";

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

export class Player extends Actor {
  oldstate: ExState | undefined;
  UUID = UUID.generateUUID();
  fsm: ExFSM;
  facing: Direction = "Down";
  collisionDirection: Array<"left" | "right" | "top" | "bottom"> = [];
  lStick: StickPosition;
  rStick: StickPosition;
  constructor(pos: Vector, public P2P: P2P, public type: 1 | 2) {
    super({
      name: "player",
      width: 24,
      height: 24,
      anchor: Vector.Zero,
      z: 4,
      scale: new Vector(2, 2),
      pos,
    });
    if (this.type == 1) this.graphics.use(plyr1AnimIdleDown);
    else this.graphics.use(plyr2AnimIdleDown);
    this.lStick = StickPosition.Idle;
    this.rStick = StickPosition.Idle;
    this.fsm = new ExFSM(this);
    console.log("my uuid: ", this.UUID);
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
    this.oldstate = this.fsm.get();

    this.sendNetworkData(NW_MessageType.Creation);

    engine.currentScene.input.keyboard.on("press", (key: KeyEvent) => {
      if (key.key == Keys.ArrowUp) {
        this.pos.y -= 10;
      } else if (key.key == Keys.ArrowDown) {
        this.pos.y += 10;
      } else if (key.key == Keys.ArrowLeft) {
        this.pos.x -= 10;
      } else if (key.key == Keys.ArrowRight) {
        this.pos.x += 10;
      }
    });
  }

  sendNetworkData(type: NW_MessageType) {
    switch (type) {
      case NW_MessageType.StateUpdate:
        if (this.P2P.isClientReady) this.P2P.sendData(`STATE|${this.UUID}|${this.pos.x}|${this.pos.y}|${this.rotation}`);
        break;
      case NW_MessageType.Creation:
        this.P2P.sendData(`CREATE|NWPlayer|${this.UUID}|${this.pos.x}|${this.pos.y}|${this.type}`);
        break;
      case NW_MessageType.Deletion:
        this.P2P.sendData(`DELETE|${this.UUID}`);
        break;
    }
  }

  onPreUpdate(engine: Engine, delta: number): void {
    let playvelocity = 50;
    let animstate: string;
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

    // do this if state changes
    if (this.oldstate?.name != animstate) {
      this.fsm.set(animstate);
      this.oldstate = this.fsm.get();
    }
    this.fsm.update();
    this.sendNetworkData(NW_MessageType.StateUpdate);
  }
}

//#region states

type AnimationKey =
  | "plyr1AnimIdleDown"
  | "plyr1AnimIdleLeft"
  | "plyr1AnimIdleRight"
  | "plyr1AnimIdleUp"
  | "plyr1AnimIdleUpLeft"
  | "plyr1AnimIdleUpRight"
  | "plyr1AnimIdleDownLeft"
  | "plyr1AnimIdleDownRight"
  | "plyr1AnimWalkDown"
  | "plyr1AnimWalkLeft"
  | "plyr1AnimWalkRight"
  | "plyr1AnimWalkUp"
  | "plyr1AnimWalkUpLeft"
  | "plyr1AnimWalkUpRight"
  | "plyr1AnimWalkDownLeft"
  | "plyr1AnimWalkDownRight"
  | "plyr2AnimIdleDown"
  | "plyr2AnimIdleLeft"
  | "plyr2AnimIdleRight"
  | "plyr2AnimIdleUp"
  | "plyr2AnimIdleUpLeft"
  | "plyr2AnimIdleUpRight"
  | "plyr2AnimIdleDownLeft"
  | "plyr2AnimIdleDownRight"
  | "plyr2AnimWalkDown"
  | "plyr2AnimWalkLeft"
  | "plyr2AnimWalkRight"
  | "plyr2AnimWalkUp"
  | "plyr2AnimWalkUpLeft"
  | "plyr2AnimWalkUpRight"
  | "plyr2AnimWalkDownLeft"
  | "plyr2AnimWalkDownRight";

const animationMap = {
  plyr1AnimIdleDown,
  plyr1AnimIdleLeft,
  plyr1AnimIdleRight,
  plyr1AnimIdleUp,
  plyr1AnimIdleUpLeft,
  plyr1AnimIdleUpRight,
  plyr1AnimIdleDownLeft,
  plyr1AnimIdleDownRight,

  plyr1AnimWalkDown,
  plyr1AnimWalkLeft,
  plyr1AnimWalkRight,
  plyr1AnimWalkUp,
  plyr1AnimWalkUpLeft,
  plyr1AnimWalkUpRight,
  plyr1AnimWalkDownLeft,
  plyr1AnimWalkDownRight,

  plyr2AnimIdleDown,
  plyr2AnimIdleLeft,
  plyr2AnimIdleRight,
  plyr2AnimIdleUp,
  plyr2AnimIdleUpLeft,
  plyr2AnimIdleUpRight,
  plyr2AnimIdleDownLeft,
  plyr2AnimIdleDownRight,

  plyr2AnimWalkDown,
  plyr2AnimWalkLeft,
  plyr2AnimWalkRight,
  plyr2AnimWalkUp,
  plyr2AnimWalkUpLeft,
  plyr2AnimWalkUpRight,
  plyr2AnimWalkDownLeft,
  plyr2AnimWalkDownRight,
};

class IdleDown extends ExState {
  constructor(public machine: ExFSM) {
    super("idleDown", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    console.log(this.machine.owner);

    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleDown);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleDown);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleDown);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleDown);
  }
}

class IdleUp extends ExState {
  constructor(public machine: ExFSM) {
    super("idleUp", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleUp);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleUp);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleUp);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleUp);
  }
}

class IdleLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("idleLeft", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleLeft);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleLeft);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleLeft);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleLeft);
  }
}

class IdleRight extends ExState {
  constructor(public machine: ExFSM) {
    super("idleRight", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleRight);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleRight);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleRight);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleRight);
  }
}

class IdleUpRight extends ExState {
  constructor(public machine: ExFSM) {
    super("idleupRight", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleUpRight);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleUpRight);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleUpRight);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleUpRight);
  }
}
class IdleUpLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("idleupLeft", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleUpLeft);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleUpLeft);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleUpLeft);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleUpLeft);
  }
}

class IdleDownLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("idledownLeft", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleDownLeft);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleDownLeft);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleDownLeft);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleDownLeft);
  }
}

class IdleDownRight extends ExState {
  constructor(public machine: ExFSM) {
    super("idledownRight", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleDownRight);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleDownRight);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimIdleDownRight);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimIdleDownRight);
  }
}

class playerAnimWalkLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("walkLeft", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkLeft);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkLeft);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkLeft);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkLeft);
  }
}

class playerAnimWalkRight extends ExState {
  constructor(public machine: ExFSM) {
    super("walkRight", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkRight);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkRight);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkRight);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkRight);
  }
}

class playerAnimWalkUp extends ExState {
  constructor(public machine: ExFSM) {
    super("walkUp", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkUp);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkUp);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkUp);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkUp);
  }
}

class playerAnimWalkDown extends ExState {
  constructor(public machine: ExFSM) {
    super("walkDown", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkDown);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkDown);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkDown);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkDown);
  }
}

class playerAnimWalkDownRight extends ExState {
  constructor(public machine: ExFSM) {
    super("walkdownRight", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkDownRight);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkDownRight);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkDownRight);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkDownRight);
  }
}

class playerAnimWalkDownLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("walkdownLeft", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkDownLeft);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkDownLeft);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkDownLeft);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkDownLeft);
  }
}
class playerAnimWalkUpRight extends ExState {
  constructor(public machine: ExFSM) {
    super("walkupRight", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkUpRight);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkUpRight);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkUpRight);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkUpRight);
  }
}

class playerAnimWalkUpLeft extends ExState {
  constructor(public machine: ExFSM) {
    super("walkupLeft", machine);
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkUpLeft);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkUpLeft);
  }

  update(...params: any): void | Promise<void> {
    if (this.machine.owner.type == 1) this.machine.owner.graphics.use(plyr1AnimWalkUpLeft);
    else if (this.machine.owner.type == 2) this.machine.owner.graphics.use(plyr2AnimWalkUpLeft);
  }
}

//#endregion states

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
