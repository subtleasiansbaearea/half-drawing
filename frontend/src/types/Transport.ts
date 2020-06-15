import { Drawing, DrawingPair, GAME_STATE, Player } from "./Types";

// Non websocket transport types
export interface CreateGameResponse {
  gameId: string;
}

// Base Types
/** From client to server */
export interface ClientMessage {
  gameId: string;
  gameState: GAME_STATE;
}

/** From server to client. */
export interface ServerCommand {
  gameState: GAME_STATE;
}

// Lobby transport types
export enum LOBBY_MESSAGE_TYPE {
  NEW_PLAYER_REQUEST,
  UPDATE_NAME_REQUEST,
  UPDATE_READY_STATE_REQUEST,
  START_GAME_REQUEST,
}

export interface LobbyRequest extends ClientMessage {
  lobbyType: LOBBY_MESSAGE_TYPE;
}

export interface NewPlayerRequest extends LobbyRequest { }

export interface StartGameRequest extends LobbyRequest { }

export interface UpdateNameRequest extends LobbyRequest {
  playerId: string;
  newName: string;
}

export interface UpdateReadyRequest extends LobbyRequest {
  playerId: string;
  isReady: boolean;
}

export interface LobbyUpdateCommand extends ServerCommand {
  playerId: string;
  players: Player[];
}

// Game Transport Types
export interface GameResponse extends ClientMessage {
  playerId: string;
}

export interface PhaseOneCommand extends ServerCommand {
  prompt: string;
  drawingPairId: string;
}

export interface PhaseTwoCommand extends ServerCommand {
  prompt: string;
  drawingPairId: string;
  leftDrawing?: Drawing;
}

export interface DrawingResponse extends GameResponse {
  drawing: Drawing;
  drawingPairId: string;
}

export interface DisplayCommand extends ServerCommand {
  drawingPairs: Array<DrawingPair>;
}
