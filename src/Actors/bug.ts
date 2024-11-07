import {
  Actor,
  Collider,
  CollisionContact,
  Engine,
  Side,
  toRadians,
  Vector,
  Color,
  Flash,
  ParallelActions,
  Blink,
  EaseTo,
  EasingFunctions,
} from "excalibur";
import { bugAnimation } from "../Animations/bugAnimations";
import { NetworkControl } from "../Components/networkControl";
import { NW_MessageType, P2P } from "../Lib/P2P";
import { UUID } from "../Lib/UUID";
import { ActorSignals } from "../Lib/CustomEmitterManager";

export class Bug extends Actor {
  UUID = UUID.generateUUID();
  isClient: boolean = false;
  NWcomponent: NetworkControl | undefined;
  isTempInvulnerable = false;
  tempInvulnerableTimer = 0;
  tempInvulnerableDuration = 100;
  constructor(pos: Vector, public P2P: P2P, ghost: boolean = false, UUID?: string) {
    super({
      name: "bug",
      pos,
      width: 16,
      height: 16,
      z: 4,
    });
    this.graphics.use(bugAnimation);
    if (UUID) this.UUID = UUID;
    ghost ? (this.isClient = true) : (this.isClient = false);
    this.NWcomponent = new NetworkControl(this);
    this.addComponent(this.NWcomponent);
  }

  onInitialize(engine: Engine): void {
    this.vel = new Vector(0, -50);
    if (!this.isClient) this.sendNetworkData(NW_MessageType.Creation);
    else {
      ActorSignals.on("updateActor", (data: any) => {
        if (data.UUID == this.UUID) {
          this.pos = new Vector(data.position.x, data.position.y);
          this.rotation = data.rotation;
        }
      });
    }
  }

  onRemove(engine: Engine): void {
    if (!this.isClient) this.sendNetworkData(NW_MessageType.Deletion);
  }

  sendNetworkData(type: NW_MessageType) {
    switch (type) {
      case NW_MessageType.StateUpdate:
        if (this.P2P.isClientReady) this.P2P.sendData(`STATE|${this.UUID}|${this.pos.x}|${this.pos.y}|${this.rotation}`);
        break;
      case NW_MessageType.Creation:
        this.P2P.sendData(`CREATE|BUG|${this.UUID}|${this.pos.x}|${this.pos.y}|${this.rotation}`);
        break;
      case NW_MessageType.Deletion:
        this.P2P.sendData(`DELETE|${this.UUID}`);
        break;
    }
  }

  onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {}

  showDamage(direction: Vector) {
    if (!this.isTempInvulnerable) {
      this.isTempInvulnerable = true;
      const PAs = new ParallelActions([
        new Flash(this, Color.Red, 500),
        new Blink(this, 50, 50, 10),
        new EaseTo(this, this.pos.add(direction.scale(10)).x, this.pos.add(direction.scale(10)).y, 25, EasingFunctions.EaseInOutQuad),
      ]);
      //use direction vector to do a knockback
      this.actions.runAction(PAs);
    }
  }

  onPreUpdate(engine: Engine, delta: number): void {
    if (this.isClient) return;
    if (this.pos.y < 200) {
      this.vel = new Vector(0, 50);
      this.actions.rotateBy(toRadians(180), 10);
    } else if (this.pos.y > 400) {
      this.actions.rotateBy(toRadians(-180), 10);
      this.vel = new Vector(0, -50);
    }
    this.sendNetworkData(NW_MessageType.StateUpdate);
  }
}
