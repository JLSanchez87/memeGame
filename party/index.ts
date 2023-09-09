import type {
  Party,
  PartyConnection,
  PartyConnectionContext,
  PartyServer,
  PartyWorker,
} from "partykit/server";

import { gameUpdater, initialGame, Action } from "../game/logic";
import { GameState } from "../game/types";

interface ServerMessage {
  state: GameState;
}

export default class Server implements PartyServer {
  private gameState: GameState;

  constructor(readonly party: Party) {
    this.gameState = initialGame;
    // party.storage.put;
  }
  onConnect(connection: PartyConnection, ctx: PartyConnectionContext) {
    // A websocket just connected!

    // let's send a message to the connection
    // conn.send();
    this.gameState = gameUpdater(
      { type: "UserEntered", user: { id: connection.id } },
      this.gameState
    );
    this.party.broadcast(JSON.stringify(this.gameState));
  }
  onClose(connection: PartyConnection) {
    this.gameState = gameUpdater(
      {
        type: "UserExit",
        user: { id: connection.id },
      },
      this.gameState
    );
    this.party.broadcast(JSON.stringify(this.gameState));
  }
  // onMessage(message: string, sender: PartyConnection) {
  //   this.party.broadcast(`${sender.id}: ${message}`, []);
  // }
}

Server satisfies PartyWorker;
