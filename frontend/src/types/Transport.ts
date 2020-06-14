import { Drawing, DrawingPair, GAME_STATE, Player } from "./Types";

enum CLIENT_MESSAGE_TYPE {
  NEW_PLAYER_REQUEST,
  USERNAME_UPDATE_REQUEST,
  READY_STATE_UPDATE,
  START_GAME_REQUEST
}

export interface ClientMessage {
  gameId: string;
  type: CLIENT_MESSAGE_TYPE
}

export interface ServerMessage {}

/** From server to client. */
export interface ServerCommand extends ServerMessage {
  gameState: GAME_STATE,
}

/** From client to server. */
export interface ClientResponse extends ClientMessage {
  playerId: string,
  gameState: GAME_STATE,
}

export interface CreateGameResponse {
  gameId: string,
}

export interface NewPlayerRequest extends ClientMessage {}

export interface LobbyUpdate  extends ServerMessage {
  playerId: string,
  players: Player[],
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
}

export interface DisplayCommand extends ServerCommand {
  drawingPairs: Array<DrawingPair>;
}
