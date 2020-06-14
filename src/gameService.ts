import * as Transport from "../frontend/src/types/Transport";

import { DrawingPair, GAME_STATE, Game, Player } from "../frontend/src/types/Types";

import { LOBBY_MESSAGE_TYPE } from "../frontend/src/types/Transport";
import { WSAEACCES } from "constants";

class GameService implements Game {
  drawingPairs: { [drawingPairId: string]: DrawingPair };
  players: { [playerId: string]: Player };
  timerId: NodeJS.Timeout;
  state: GAME_STATE;
  hostId?: string; // playerId

  constructor(timerId: NodeJS.Timeout) {
    this.drawingPairs = {};
    this.players = {};
    this.timerId = timerId;
    this.state = GAME_STATE.LOBBY;
    this.hostId = '';
  }

  fireLobbyUpdate() {

  }

  handleLobbyMessage(message: Transport.LobbyRequest) {
    const { lobbyType } = message;
    switch (lobbyType) {
      case LOBBY_MESSAGE_TYPE.NEW_PLAYER_REQUEST:
        message as Transport.NewPlayerRequest;

        break;
      case LOBBY_MESSAGE_TYPE.UPDATE_NAME_REQUEST:
        const { playerId, newName } = (message as Transport.UpdateNameRequest);
        this.players[playerId].name = newName;

        break;
      case LOBBY_MESSAGE_TYPE.UPDATE_READY_STATE_REQUEST:
        break;
      case LOBBY_MESSAGE_TYPE.START_GAME_REQUEST:
        break;
    }
    this.fireLobbyUpdate();
  }

  handleNewPlayerRequest(message: Transport.NewPlayerRequest) {

  }


  handleGameMessage(message: Transport.GameResponse) {
    const { gameState } = message;
    switch (gameState) {
      case GAME_STATE.LOBBY:
        break;
      case GAME_STATE.PHASE_ONE:
        break;
      case GAME_STATE.PHASE_TWO:
        break;
      case GAME_STATE.DISPLAY:
        break;
    }
  }
}

export default GameService;