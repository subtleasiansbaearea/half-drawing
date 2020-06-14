import { Drawing, DrawingPair, GAME_STATE, Player } from "./Types";

// Non websocket transport types
export interface CreateGameResponse {
  gameId: string;
}

// Websocket transport types
export enum MESSAGE_TYPE {
  LOBBY,
  GAME
}

export interface ClientMessage {
  gameId: string;
  type: MESSAGE_TYPE;
}

export interface ServerMessage {
  type: MESSAGE_TYPE;
}

// Lobby transport types
export enum LOBBY_MESSAGE_TYPE {
  NEW_PLAYER_REQUEST,
  UPDATE_NAME_REQUEST,
  UPDATE_READY_STATE_REQUEST,
  START_GAME_REQUEST,
  UPDATE_LOBBY_COMMAND,
  // TODO: responses
}

export interface LobbyRequest extends ClientMessage {
  lobbyType: LOBBY_MESSAGE_TYPE;
}

export interface LobbyCommand extends ServerMessage {
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

export interface LobbyUpdate extends LobbyCommand {
  playerId: string;
  players: Player[];
}

// Client Transport Types
/** From server to client. */
export interface ServerCommand extends ServerMessage {
  gameState: GAME_STATE;
}

/** From client to server. */
export interface ClientResponse extends ClientMessage {
  playerId: string;
  gameState: GAME_STATE;
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
