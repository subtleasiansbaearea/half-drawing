import { Drawing, DrawingPair } from "./Types";

/** From server to client. */
export interface Command { }

/** From client to server. */
export interface Response { }

export interface StartPhaseOneCommand extends Command {
  prompt: string;
  drawingPairId: string;
  playerId: string;
}

export interface EndPhaseOneResponse extends Response {
  drawing: Drawing;
  drawingPairId: string;
  playerId: string;
}

export interface StartPhaseTwoCommand extends Command {
  prompt: string;
  drawingPairId: string;
  previousDrawing: Drawing;
}

export interface EndPhaseTwoResponse extends Response {
  drawing: Drawing;
  playerId: string;
  drawingPairId: string;
}

export interface StartDisplay extends Command {
  drawingPairs: Array<DrawingPair>;
}
