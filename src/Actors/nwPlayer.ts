import { Actor, Vector } from "excalibur";
import { NetworkControl } from "../Components/networkControl";

export class nwPlayer extends Actor {
  nwComponent: NetworkControl;
  constructor(pos: Vector, ghost: boolean = false) {
    super();

    this.nwComponent = new NetworkControl(this);
    this.addComponent(this.nwComponent);
  }
  networkUpdate(data: any) {
    console.log("networkUpdate", data);
  }
}
