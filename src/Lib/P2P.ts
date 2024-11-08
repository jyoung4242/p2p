import { Peer, DataConnection } from "peerjs";
import { model } from "../UI/UI";
import { Actor, Engine, Vector } from "excalibur";
import { ActorSignals, EngineSignals } from "./CustomEmitterManager";

export enum HostStatus {
  NotHost = 0,
  Host = 1,
  Client = 2,
}

export enum NW_MessageType {
  StateUpdate = 0,
  Creation = 1,
  Deletion = 2,
  InputUpdate = 3,
}

export class P2P {
  tstamp1: number = 0;
  pingtime: number = 0;
  pings: number[] = [];
  interval: any;
  isClientReady: boolean = false;
  hoststatus: HostStatus = HostStatus.NotHost;
  peer: Peer;
  connections: Map<string, DataConnection> = new Map();
  messageQueue: any[] = [];

  constructor(public engine: Engine, public id?: string) {
    if (id) {
      this.peer = new Peer(id, { secure: false });
    } else {
      this.peer = new Peer("", { secure: false });
    }
    this.peer.on("connection", this.handleIncomingConnection.bind(this));
    this.peer.on("open", id => {
      console.log("My peer ID is: " + id);
      model.id = id;
      this.id = id;
    });
    this.interval = setInterval(this.pingPong, 500);
  }

  getHostStatus() {
    return this.hoststatus;
  }

  pingPong = () => {
    if (this.hoststatus == HostStatus.Host) {
      this.sendData("PING");
      this.tstamp1 = performance.now();
    }

    if (this.isClientReady && this.messageQueue.length > 0) {
      this.messageQueue.forEach((message: any) => this.sendData(message));
      this.messageQueue = [];
    }
  };

  handleIncomingConnection(connection: DataConnection) {
    this.connections.set(connection.peer, connection);
    this.setupConnectionHandlers(connection);
    this.hoststatus = HostStatus.Host;
    this.engine.emit("hostStatusChanged", { status: this.hoststatus });
  }

  connectPeer(peerID: string) {
    const connection = this.peer.connect(peerID);
    this.setupConnectionHandlers(connection);
    this.connections.set(peerID, connection);
    this.hoststatus = HostStatus.Client;
    this.engine.emit("hostStatusChanged", { status: this.hoststatus });
  }

  getPingTime() {
    return this.pings.reduce((a, b) => a + b, 0) / this.pings.length;
  }

  // Set up data handlers for sending/receiving messages
  setupConnectionHandlers(connection: DataConnection) {
    connection.on("open", () => {
      console.log(`Connected to ${connection.peer}`);
      this.connections.set(connection.peer, connection);
      connection.on("data", this.handleData.bind(this));
      connection.on("close", () => {
        console.log(`Connection with ${connection.peer} closed`);
        this.connections.delete(connection.peer);
      });
    });
  }
  // Handle incoming data (game state updates, etc.)
  handleData(data: any) {
    // Update game state based on received data
    if (data == "PING") {
      this.isClientReady = true;
      this.sendData("PONG");
    } else if (data == "PONG") {
      //mesure ping time
      this.pingtime = performance.now() - this.tstamp1;
      this.pings.push(this.pingtime);
      if (this.pings.length > 50) this.pings.shift();
      this.isClientReady = true;
    } else {
      if (!this.isClientReady) return;
      //parse data
      const message = data.split("|");
      let position;
      switch (message[0]) {
        case "INPUT":
          console.log("input", message);

          const direction = message[1];
          const uuid = message[2];
          ActorSignals.emit("updateActorInput", { direction, uuid });
          break;
        case "STATE":
          position = new Vector(parseFloat(message[2]), parseFloat(message[3]));
          ActorSignals.emit("updateActor", {
            UUID: message[1],
            position,
            rotation: parseFloat(message[4]),
          });
          break;
        case "CREATE":
          position = new Vector(parseFloat(message[3]), parseFloat(message[4]));
          EngineSignals.emit("createActor", {
            type: message[1],
            UUID: message[2],
            position,
            rotation: parseFloat(message[5]),
          });
          break;
        case "DELETE":
          EngineSignals.emit("deleteActor", {
            UUID: message[1],
          });
          break;
      }
    }
  }

  // Send data to all connected peers
  sendData = (data: any) => {
    if (!this.isClientReady && data != "PING") {
      this.messageQueue.push(data);
    } else {
      this.connections.forEach((connection: DataConnection) => {
        connection.send(data);
      });
    }
  };
}
