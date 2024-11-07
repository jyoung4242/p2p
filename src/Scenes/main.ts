import { Engine, KeyEvent, Keys, Scene, Vector } from "excalibur";
import { P2P, HostStatus } from "../Lib/P2P";
import { Player } from "../Actors/Player";
import { Bug } from "../Actors/bug";
import { EngineSignals } from "../Lib/CustomEmitterManager";
import { UUID } from "../Lib/UUID";
import { nwPlayer } from "../Actors/nwPlayer";

export class Main extends Scene {
  bugs: Bug[] = [];
  localPlayer: Player | nwPlayer | undefined;
  remotePlayer: Player | nwPlayer | undefined;

  p2p: P2P | undefined;
  constructor(UUID?: string) {
    super();
  }

  onActivate(incomingData: any): void {
    this.p2p = incomingData.data[0];

    console.log("p2p", this.p2p?.hoststatus);

    if (this.p2p?.hoststatus == HostStatus.Host) {
      //setup real actors
      this.bugs.push(new Bug(new Vector(100, 205), this.p2p));
      this.bugs.push(new Bug(new Vector(200, 305), this.p2p));
      this.bugs.push(new Bug(new Vector(300, 405), this.p2p));

      this.bugs.forEach(bug => this.add(bug));
      this.localPlayer = new Player(new Vector(400, 400), this.p2p, 1);
      this.remotePlayer = new nwPlayer(new Vector(500, 500), this.p2p, 2, false);
      this.add(this.remotePlayer);
      this.add(this.localPlayer);
    } else {
      EngineSignals.on("createActor", (data: any) => {
        if (this.p2p && data.type == "BUG") {
          let lastbugadded = this.bugs.push(new Bug(data.position, this.p2p, true, data.UUID));
          this.add(this.bugs[lastbugadded - 1]);
        } else if (this.p2p && data.type == "NWPlayer") {
          console.log("nwplayer", data);
          const newPlayer = new nwPlayer(data.position, this.p2p, data.rotation as 1 | 2, true, data.UUID); //data.rotation is a substitue for type 1|2
          if (data.rotation == 1) this.localPlayer = newPlayer;
          else this.remotePlayer = newPlayer;
          this.add(newPlayer);
        }

        incomingData.engine.currentScene.input.keyboard.on("press", (key: KeyEvent) => {
          console.log("key", key.key);

          if (key.key == Keys.ArrowUp) {
            this.p2p?.sendData(`INPUT|UP|${this.remotePlayer?.UUID}`);
          } else if (key.key == Keys.ArrowDown) {
            this.p2p?.sendData(`INPUT|DOWN|${this.remotePlayer?.UUID}`);
          } else if (key.key == Keys.ArrowLeft) {
            this.p2p?.sendData(`INPUT|LEFT|${this.remotePlayer?.UUID}`);
          } else if (key.key == Keys.ArrowRight) {
            this.p2p?.sendData(`INPUT|RIGHT|${this.remotePlayer?.UUID}`);
          }
        });
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

  onInitialize(engine: Engine): void {
    engine.input.keyboard.on("press", (key: KeyEvent) => {
      if (this.p2p?.hoststatus == HostStatus.Host && key.key == Keys.Space) {
        console.log("Average Ping: ", this.p2p?.getPingTime().toFixed(2), "ms");
      }
    });
  }
}
