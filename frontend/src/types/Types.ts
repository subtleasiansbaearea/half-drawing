// Types for representing game state

import { History } from "./History";

/** State of the game */
export enum GAME_STATE {
  LOBBY,
  PHASE_ONE,
  PHASE_TWO,
  DISPLAY,
}

/**
 * Main representation object of a game.
 */
export interface Game {
  timerId: string, // for timimg out and GC
  players: { [playerId: string]: Player },
  drawingPairs: { [drawingPairId: string]: DrawingPair },
  state: GAME_STATE,
  hostId?: string, // playerId
}

/**
 * Represenation of a player.
 */
export interface Player {
  playerId: string,
  name: string,
  isReady: boolean,
}

/**
 * One pair of drawing and the prompt
 */
export interface DrawingPair {
  drawingPairId: string,
  leftPlayerId: string,
  rightPlayerId: string,
  left?: Drawing,
  right?: Drawing,
  prompt: string,
}

/**
 * A singular drawing by a player.
 */
export interface Drawing {
  histories: Array<History>,
  playerName: string,
}
