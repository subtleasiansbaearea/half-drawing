import { Drawing, DrawingPair, GAME_STATE } from "./Types";

/** From server to client. */
export interface ServerCommand {
  gameState: GAME_STATE,
}

/** From client to server. */
export interface ClientResponse {
  gameId: string,
  gameState: GAME_STATE,
}

export interface PhaseOneCommand extends ServerCommand {
  prompt: string;
  drawingPairId: string;
  playerId: string;
}

export interface PhaseTwoCommand extends ServerCommand {
  prompt: string;
  drawingPairId: string;
  leftDrawing?: Drawing;
}

export interface DrawingResponse extends ClientResponse {
  drawing: Drawing;
  drawingPairId: string;
  playerId: string;
}

export interface DisplayCommand extends ServerCommand {
  drawingPairs: Array<DrawingPair>;
}
