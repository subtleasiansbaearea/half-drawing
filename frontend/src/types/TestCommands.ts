import { DisplayCommand, MESSAGE_TYPE, PhaseOneCommand, PhaseTwoCommand } from "./Transport";
import { HEART_LEFT, getHeartDrawingPairs } from "../components/tools/TestHistories";

import { GAME_STATE } from "./Types";

export const TEST_PHASE_ONE_COMMAND: PhaseOneCommand = {
  gameState: GAME_STATE.PHASE_ONE,
  type: MESSAGE_TYPE.GAME,
  prompt: 'Draw biscuits and gravy',
  drawingPairId: 'drawingPairId1',
  playerId: 'player1id'
};

export const TEST_PHASE_TWO_COMMAND: PhaseTwoCommand = {
  type: MESSAGE_TYPE.GAME,
  gameState: GAME_STATE.PHASE_TWO,
  prompt: 'Draw Love',
  drawingPairId: 'drawingPairId2',
  leftDrawing: {
    histories: HEART_LEFT,
    playerName: 'player2'
  }
};

export const TEST_DISPLAY_COMMAND: DisplayCommand = {
  type: MESSAGE_TYPE.GAME,
  gameState: GAME_STATE.DISPLAY,
  drawingPairs: getHeartDrawingPairs(),
}