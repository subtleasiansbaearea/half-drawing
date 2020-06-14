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
  timerId: NodeJS.Timeout, // for timimg out and GC
  drawingPairs: Map<string, DrawingPair>;
  players: Map<string, Player>;
  gameState: GAME_STATE,
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
