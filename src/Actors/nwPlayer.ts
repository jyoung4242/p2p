import { Actor, Engine, Vector } from "excalibur";
import { NetworkControl } from "../Components/networkControl";
import { NW_MessageType, P2P } from "../Lib/P2P";
import { ExFSM, ExState } from "../Lib/ExFSM";
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
import { UUID } from "../Lib/UUID";
import { ActorSignals } from "../Lib/CustomEmitterManager";
export class nwPlayer extends Actor {
  isClient: boolean = false;
  oldstate: ExState | undefined;
  nwComponent: NetworkControl;
  fsm: ExFSM;
  UUID = UUID.generateUUID();
  constructor(pos: Vector, public P2P: P2P, public type: 1 | 2, client: boolean = false, UUID?: string) {
    super({
      name: "networkplayer",
      pos,
      scale: new Vector(2, 2),
    });
    if (UUID) this.UUID = UUID;
    if (client) this.isClient = true;
    this.nwComponent = new NetworkControl(this);
    this.addComponent(this.nwComponent);
    this.fsm = new ExFSM(this);
    console.log("new network Actor, UUid: " + this.UUID);
  }

  onInitialize(engine: Engine): void {
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

    if (!this.isClient) {
      this.sendNetworkData(NW_MessageType.Creation);
    } else {
      ActorSignals.on("updateActor", (data: any) => {
        if (data.UUID == this.UUID) {
          this.pos = new Vector(data.position.x, data.position.y);
          this.rotation = data.rotation;
        }
      });
    }
    ActorSignals.on("updateActorInput", (data: any) => {
      console.log(data, data.uuid, this.UUID);

      if (data.uuid == this.UUID) {
        console.log("getting actor input event", data);
        switch (data.direction) {
          case "UP":
            console.log("moving actor up");

            this.pos.y -= 10;
            break;
          case "DOWN":
            this.pos.y += 10;
            break;
          case "LEFT":
            this.pos.x -= 10;
            break;
          case "RIGHT":
            this.pos.x += 10;
            break;
        }
      }
    });
  }

  sendNetworkData(type: NW_MessageType) {
    switch (type) {
      case NW_MessageType.StateUpdate:
        if (this.P2P.isClientReady) this.P2P.sendData(`STATE|${this.UUID}|${this.pos.x}|${this.pos.y}|${this.rotation}`);
        break;
      case NW_MessageType.Creation:
        console.log("creation", this.type, this.UUID, this.pos.x, this.pos.y, this.rotation);

        this.P2P.sendData(`CREATE|NWPlayer|${this.UUID}|${this.pos.x}|${this.pos.y}|${this.type}`);
        break;
      case NW_MessageType.Deletion:
        this.P2P.sendData(`DELETE|${this.UUID}`);
        break;
    }
  }

  onPreUpdate(engine: Engine, elapsedMs: number): void {
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
