import { EngineEvents, EventEmitter, Vector } from "excalibur";
import { ActorEvents } from "excalibur/build/dist/Actor";

export interface CustomActorEventBus extends ActorEvents {
  myEvent: { myEventData: any };
  testEvent: { testEventData: any };
  updateActor: { UUID: string; position: Vector; rotation: number };
}

export interface CustomeEngineEventBus extends EngineEvents {
  hostStatusChanged: { status: string };
  createActor: { actor: string; id: number };
}

export const ActorSignals = new EventEmitter<CustomActorEventBus>();

export const EngineSignals = new EventEmitter<CustomeEngineEventBus>();

// publisher
/*
ActorSignals.emit("myEvent", { health: 0 }); // works, and event name shows in intellisense
EngineSignals.emit("testEvent", { keypress: 0 });
*/
// subscriber
/*
ActorSignals.on("myEvent", data => {
  console.log("myEvent", data);
});

EngineSignals.on("testEvent", data => {
  console.log("testEvent", data);
});
*/
