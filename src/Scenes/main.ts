import { Engine, Scene, Vector } from "excalibur";
import { P2P, HostStatus } from "../Lib/P2P";
import { Player } from "../Actors/Player";
import { Bug } from "../Actors/bug";
import { EngineSignals } from "../Lib/CustomEmitterManager";
import { UUID } from "../Lib/UUID";

export class Main extends Scene {
  bugs: Bug[] = [];

  p2p: P2P | undefined;
  constructor(UUID?: string) {
    super();
  }

  onActivate(incomingData: any): void {
    this.p2p = incomingData.data[0];

    if (this.p2p?.hoststatus == HostStatus.Host) {
      //setup real actors
      this.bugs.push(new Bug(new Vector(100, 205), this.p2p));
      this.bugs.push(new Bug(new Vector(200, 305), this.p2p));
      this.bugs.push(new Bug(new Vector(300, 405), this.p2p));

      this.bugs.forEach(bug => {
        this.add(bug);
      });
    } else {
      EngineSignals.on("createActor", (data: any) => {
        if (this.p2p && data.type == "BUG") {
          let lastbugadded = this.bugs.push(new Bug(data.position, this.p2p, true, data.UUID));
          this.add(this.bugs[lastbugadded - 1]);
        }
      });
      EngineSignals.on("deleteActor", (data: any) => {
        if (this.p2p) {
          //@ts-ignore
          let bug2kill = this.world.entities.find(bug => bug.UUID == data.UUID);
          if (bug2kill) bug2kill.kill();
        }
      });
    }
  }

  onInitialize(engine: Engine): void {}
}
