import { Peer, DataConnection } from "peerjs";
import { model } from "../UI/UI";

export class P2P {
  peer: Peer;
  connections: Map<string, DataConnection> = new Map();
  constructor(public id?: string) {
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
  }

  handleIncomingConnection(connection: DataConnection) {
    this.connections.set(connection.peer, connection);
    console.log("Connection established with: " + connection.peer);
    this.setupConnectionHandlers(connection);
  }

  connectPeer(peerID: string) {
    console.log(`Attempting to connect to ${peerID}`);
    const connection = this.peer.connect(peerID);
    this.setupConnectionHandlers(connection);
    //@ts-ignore
    this.connections[peerId] = connection;
  }

  // Set up data handlers for sending/receiving messages
  setupConnectionHandlers(connection: DataConnection) {
    connection.on("open", () => {
      console.log(`Connected to ${connection.peer}`);
      this.connections.set(connection.peer, connection);
      connection.on("data", this.handleData.bind(this));
      connection.on("close", () => {
        console.log(`Connection with ${connection.peer} closed`);
        //@ts-ignore
        delete this.connections[connection.peer];
      });
    });
  }
  // Handle incoming data (game state updates, etc.)
  handleData(data: any) {
    console.log("Received:", data);
    // Update game state based on received data
  }

  // Send data to all connected peers
  sendData(data: any) {
    console.log("Sending:", data);
    this.connections.forEach((connection: DataConnection) => {
      connection.send(data);
    });
  }
}
