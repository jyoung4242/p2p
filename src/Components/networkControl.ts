import { Actor, Component, Engine } from "excalibur";
import { ActorSignals } from "../Lib/CustomEmitterManager";
import { ActorEvents } from "excalibur/build/dist/Actor";

export class NetworkControl extends Component {
  constructor(public owner: Actor) {
    super();
  }

  onAdd(): void {
    this.owner.on("preupdate", this.onPreUpdate.bind(this));
  }

  onInitialize(engine: Engine): void {
    ActorSignals.on("networkUpdate", (data: any) => {
      if (data.id != this.owner.id) return;
      //@ts-ignore
      this.owner.networkUpdate(data);
    });
  }

  onPreUpdate(event: ActorEvents["preupdate"]): void {}
}
