import * as Transport from "../frontend/src/types/Transport";

import { ADJECTIVES, ANIMALS, WORDPAIRS } from "./constants";
import { DrawingPair, GAME_STATE, Game, Player } from "../frontend/src/types/Types";

import { LOBBY_MESSAGE_TYPE } from "../frontend/src/types/Transport";
import WebSocket from "ws";
import { v4 as uuidv4 } from 'uuid';

/** Class that respresent a single game played between multiple players. */
class GameService implements Game {
  timerId: NodeJS.Timeout;
  drawingPairs: Map<string, DrawingPair>;
  players: Map<string, Player>;
  gameState: GAME_STATE;
  websockets: Map<string, WebSocket>;

  constructor(timerId: NodeJS.Timeout) {
    this.drawingPairs = new Map<string, DrawingPair>();
    this.players = new Map<string, Player>();
    this.timerId = timerId;
    this.gameState = GAME_STATE.LOBBY;
    this.websockets = new Map<string, WebSocket>();
    // Host is just the first entry in Map
    // as ES6 preserves insertion order
  }

  logLobbyStatus() {
    console.log(this.players);
  }

  /** Send a lobby update command to all players. */
  fireLobbyUpdate() {
    this.logLobbyStatus();
    for (const [playerId, socket] of this.websockets) {
      const command: Transport.LobbyUpdateCommand = {
        gameState: this.gameState,
        playerId,
        players: Array.from(this.players.values()),
      }
      const playerName = this.players.get(playerId)?.name;
      console.log(`sending lobby update to ${playerName}`);
      socket.send(JSON.stringify(command));
    }
  }

  /**
   * 
   * @param n number of pairs to initialize
   */
  private initializeDrawingPairs(n: number) {
    const prompts = getNUniqueFromArray(n, WORDPAIRS);
    const playerIds = Array.from(this.players.keys());
    // By "Caesar shifting" the indices by a value from 1 to n-1, 
    // we guarentee a derangement. 
    let cycleOffset = randomIndex(n - 1) + 1;
    // Prevent case where two people get each other twice, except when n=2
    while (n > 2 && n % 2 == 0 && cycleOffset == n / 2) {
      cycleOffset = randomIndex(n - 1) + 1;
    }
    for (let i = 0; i < n; i++) {
      const offsetIndex = (i + cycleOffset) % n;
      const drawingPairId = uuidv4();
      const pair: DrawingPair = {
        prompt: prompts[i],
        drawingPairId,
        leftPlayerId: playerIds[i],
        rightPlayerId: playerIds[offsetIndex],
      };
      this.drawingPairs.set(drawingPairId, pair);
    }
  }

  /**
   * Begin phase one of the game.
   * Initialize all drawing prompts, then send commands to everyone.
   */
  phaseOne() {
    const n = this.players.size;
    if (n < 2) {
      return;
    }
    // Initialize drawing pairs
    this.initializeDrawingPairs(n);

    // send commands to all clients to start phase one
    this.gameState = GAME_STATE.PHASE_ONE;
    for (const [drawingPairId, pair] of this.drawingPairs.entries()) {
      const { leftPlayerId, prompt } = pair;
      const command: Transport.PhaseOneCommand = {
        gameState: this.gameState,
        prompt,
        drawingPairId
      }
      const socket = this.websockets.get(leftPlayerId);
      if (socket) socket.send(JSON.stringify(command));
    }
  }

  /** Returns true if every pair has a left drawing. */
  readyForPhaseTwo() {
    return Array.from(this.drawingPairs.values())
      .every(pair => !!pair.left);
  }

  phaseTwo() {
    this.gameState = GAME_STATE.PHASE_TWO;
    for (const [drawingPairId, pair] of this.drawingPairs.entries()) {
      const { rightPlayerId, prompt } = pair;
      const command: Transport.PhaseTwoCommand = {
        gameState: this.gameState,
        prompt,
        drawingPairId,
        leftDrawing: pair.left,
      }
      const socket = this.websockets.get(rightPlayerId);
      if (socket) socket.send(JSON.stringify(command));
    }
  }

  /** Returns true if every pair has a right drawing. */
  readyForDisplay() {
    return Array.from(this.drawingPairs.values())
      .every(pair => !!pair.right);
  }

  display() {
    this.gameState = GAME_STATE.DISPLAY;
    const drawingPairs = Array.from(this.drawingPairs.values());
    const command: Transport.DisplayCommand = {
      gameState: this.gameState,
      drawingPairs,
    };

    for (const socket of this.websockets.values()) {
      socket.send(JSON.stringify(command));
    }
  }

  handleLobbyMessage(ws: WebSocket, message: Transport.LobbyRequest) {
    if (this.gameState !== GAME_STATE.LOBBY) return;
    const { lobbyType } = message;
    switch (lobbyType) {
      case LOBBY_MESSAGE_TYPE.NEW_PLAYER_REQUEST:
        this.handleNewPlayerRequest(ws, message as Transport.NewPlayerRequest);
        this.fireLobbyUpdate();
        break;
      case LOBBY_MESSAGE_TYPE.UPDATE_NAME_REQUEST: {
        const { playerId, newName } = message as Transport.UpdateNameRequest;
        const player = this.players.get(playerId);
        if (player) player.name = newName;
        this.fireLobbyUpdate();
        break;
      }
      case LOBBY_MESSAGE_TYPE.UPDATE_READY_STATE_REQUEST: {
        const { playerId, isReady } = message as Transport.UpdateReadyRequest;
        const player = this.players.get(playerId);
        if (player) player.isReady = isReady;
        this.fireLobbyUpdate();
        break;
      }
      case LOBBY_MESSAGE_TYPE.START_GAME_REQUEST:
        this.phaseOne();
        break;
    }
  }

  handleNewPlayerRequest(ws: WebSocket, message: Transport.NewPlayerRequest) {
    const playerId = uuidv4();
    const newPlayer: Player = {
      playerId,
      name: this.getRandomName(),
      isReady: false,
    }
    this.players.set(playerId, newPlayer);
    this.websockets.set(playerId, ws);
  }

  handleClientMessage(ws: WebSocket, message: Transport.ClientMessage) {
    const { gameState } = message;
    // Command consumed during wrong time!
    if (this.gameState !== gameState) return;
    switch (gameState) {
      case GAME_STATE.LOBBY:
        this.handleLobbyMessage(ws, message as Transport.LobbyRequest);
        break;
      case GAME_STATE.PHASE_ONE: {
        const { drawing, drawingPairId } = message as Transport.DrawingResponse
        const pair = this.drawingPairs.get(drawingPairId);
        if (pair) pair.left = drawing;
        if (this.readyForPhaseTwo()) this.phaseTwo();
        break;
      }
      case GAME_STATE.PHASE_TWO: {
        const { drawing, drawingPairId } = message as Transport.DrawingResponse
        const pair = this.drawingPairs.get(drawingPairId);
        if (pair) pair.right = drawing;
        if (this.readyForDisplay()) this.display();
        break;
      }
      case GAME_STATE.DISPLAY:
        // There is no player response in the display area...yet
        break;
    }
  }

  getRandomName(): string {
    const animal = ANIMALS[randomIndex(ANIMALS.length)];
    const adjective = ADJECTIVES[randomIndex(ADJECTIVES.length)];
    return adjective + ' ' + animal;
  }
}

/**
 * Get a random number from 0 to n-1.
 * @param n size of object
 */
function randomIndex(n: number): number {
  return Math.floor(Math.random() * n);
}

function getNUniqueFromArray<X>(n: number, array: Array<X>) {
  const copy = [...array];
  const result = [];
  for (let i = 0; i < n; i++) {
    const idx = randomIndex(copy.length);
    result.push(copy.slice(idx, idx + 1)[0]);
  }
  return result;
}

export default GameService;