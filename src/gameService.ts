import { Game, DrawingPair, GAME_STATE } from "../frontend/src/types/Types";

export const prompts: string[] = ['Biscuits and gravy', 'Mac and Cheese'];
export const games: {[LobbyId: string]: Game} = {};

export class GameImpl implements Game {
  drawingPairs: { [drawingPairId: string]: DrawingPair };
  players: {};
  timerId: '';
  state: GAME_STATE;
  hostId?: string; // playerId

  constructor() {
    this.drawingPairs = {};
    this.players = {};
    this.timerId = '';
    this.state = GAME_STATE.LOBBY;
    this.hostId = '';
  }
};