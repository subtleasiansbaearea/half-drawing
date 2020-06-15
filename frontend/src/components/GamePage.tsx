import './../styles/GamePage.scss';

import * as Transport from '../types/Transport';

import { Drawing, DrawingPair, GAME_STATE, Player } from '../types/Types';
import React, { useEffect, useState } from 'react';
import { TEST_DISPLAY_COMMAND, TEST_PHASE_ONE_COMMAND, TEST_PHASE_TWO_COMMAND } from '../types/TestCommands';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DisplayPage from './DisplayPage';
import DrawingPage from './DrawingPage';
import { History } from '../types/History';
import { LOBBY_MESSAGE_TYPE } from '../types/Transport';
import LobbyPage from './LobbyPage';
import Timer from './Timer';

// import { WsConnection } from '../clients/api';

//TODO make a call to database
//check that the game id actually exists

interface Route {
  match: {
    params: {
      gameId: string;
    }
  }
}

const DRAWING_HEIGHT = 540;

const GamePage = (route: Route) => {
  const [gameState, setGameState] = useState(GAME_STATE.LOBBY);
  const [prompt, setPrompt] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [drawingPairId, setDrawingPairId] = useState('');
  const [drawingPairs, setDrawingPairs] = useState<Array<DrawingPair>>([]);
  const [leftDrawing, setLeftDrawing] = useState<Drawing | undefined>(undefined);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);
  const {
    match: {
      params: { gameId }
    }
  } = route;



  const connectAndAddNewPlayer = () => {
    const ws = new WebSocket('ws://localhost:40510', 'json');
    // event emmited when connected
    ws.onopen = function () {
      setIsLoading(false);
      // save the ws reference
      setWs(ws);
      console.log('websocket is connected ...')
      // when a player joins a lobby
      const addNewPlayerRequest: Transport.NewPlayerRequest = {
        gameState: GAME_STATE.LOBBY,
        lobbyType: Transport.LOBBY_MESSAGE_TYPE.NEW_PLAYER_REQUEST,
        gameId,
      };
      ws.send(JSON.stringify(addNewPlayerRequest));
    }
    // event emmited when receiving message 
    ws.onmessage = function (ev) {
      handleCommand(JSON.parse(ev.data) as Transport.ServerCommand);
    }
  };

  useEffect(connectAndAddNewPlayer, []);

  function updatePlayerState() {
    const user = players.find(p => p.playerId === playerId);
    setIsReady(user?.isReady || false);
    setPlayerName(user?.name || '');
  }

  function handleCommand(command: Transport.ServerCommand) {
    console.log(command);
    switch (command.gameState) {
      case GAME_STATE.LOBBY:
        const { playerId, players } = (command as Transport.LobbyUpdateCommand);
        setPlayerId(playerId);
        setPlayers(players);
        if (!playerName) {
          const name =
            players.find(player => player.playerId === playerId)?.name;
          setPlayerName(name ? name : '');
        }
        updatePlayerState()
        break;
      case GAME_STATE.PHASE_ONE:
        handlePhaseOneCommand(command as Transport.PhaseOneCommand);
        break;
      case GAME_STATE.PHASE_TWO:
        handlePhaseTwoCommand(command as Transport.PhaseTwoCommand);
        break;
      case GAME_STATE.DISPLAY:
        handleDisplayCommand(command as Transport.DisplayCommand)
        break;
    }
    setGameState(command.gameState);
  }

  function handlePhaseOneCommand(command: Transport.PhaseOneCommand) {
    const { prompt, drawingPairId } = command;
    setPrompt(prompt);
    setDrawingPairId(drawingPairId);
  }

  function handlePhaseTwoCommand(command: Transport.PhaseTwoCommand) {
    const { prompt, drawingPairId, leftDrawing } = command;
    setPrompt(prompt);
    setDrawingPairId(drawingPairId);
    setLeftDrawing(leftDrawing);
  }

  function handleDisplayCommand(command: Transport.DisplayCommand) {
    const { drawingPairs } = command;
    setDrawingPairs(drawingPairs);
  }

  function createAndSendDrawing(histories: Array<History>) {
    const drawing: Drawing = {
      histories,
      playerName,
    }

    const response: Transport.DrawingResponse = {
      gameId,
      gameState,
      drawing,
      drawingPairId,
      playerId,
    }

    ws?.send(JSON.stringify(response));
  }
  function onUpdateName(name: string) {
    const message: Transport.UpdateNameRequest = {
      gameState: GAME_STATE.LOBBY,
      lobbyType: LOBBY_MESSAGE_TYPE.UPDATE_NAME_REQUEST,
      gameId,
      playerId,
      newName: name,
    };
    ws?.send(JSON.stringify(message));
  }

  function onSetReady() {
    const updateLobbyReadyStateMessage: Transport.UpdateReadyRequest = {
      gameState: GAME_STATE.LOBBY,
      lobbyType: LOBBY_MESSAGE_TYPE.UPDATE_READY_STATE_REQUEST,
      gameId,
      playerId,
      isReady: !players.find(p => p.playerId === playerId)?.isReady,
    };

    ws?.send(JSON.stringify(updateLobbyReadyStateMessage));
  }

  function onStartGame() {
    const startGameRequestMessage: Transport.StartGameRequest = {
      gameId,
      gameState,
      lobbyType: LOBBY_MESSAGE_TYPE.START_GAME_REQUEST,
    };
    ws?.send(JSON.stringify(startGameRequestMessage));
  }


  let component;
  switch (gameState) {
    case GAME_STATE.LOBBY:
      component = (<LobbyPage
        players={players}
        updateName={onUpdateName}
        isReady={isReady}
        setReady={onSetReady}
        startGame={onStartGame}
      />);
      break;
    case GAME_STATE.PHASE_ONE:
      component = (<DrawingPage
        prompt={prompt}
        width={DRAWING_HEIGHT}
        height={DRAWING_HEIGHT}
        isLeft={true}
        sendDrawing={createAndSendDrawing}
      />);
      break;
    case GAME_STATE.PHASE_TWO:
      component = (<DrawingPage
        prompt={prompt}
        width={DRAWING_HEIGHT}
        height={DRAWING_HEIGHT}
        isLeft={false}
        sendDrawing={createAndSendDrawing}
        leftDrawing={leftDrawing}
      />);
      break;
    case GAME_STATE.DISPLAY:
      component = (<DisplayPage
        drawingPairs={drawingPairs}
        width={DRAWING_HEIGHT}
        height={DRAWING_HEIGHT}
      />);
      break;
  }

  return (
    <div className={"game-page"}>
      {isLoading ? <h1>LOADING. . .</h1> :
        <>
          <ButtonGroup>
            <Button
              variant="primary"
              onClick={() => setGameState(GAME_STATE.LOBBY)}
              active={gameState === GAME_STATE.LOBBY}
            >
              Lobby
            </Button>
            <Button
              variant="primary"
              onClick={() => handleCommand(TEST_PHASE_ONE_COMMAND)}
              active={gameState === GAME_STATE.PHASE_ONE}
            >
              Phase 1
            </Button>
            <Button
              variant="primary"
              onClick={() => handleCommand(TEST_PHASE_TWO_COMMAND)}
              active={gameState === GAME_STATE.PHASE_TWO}
            >
              Phase 2
            </Button>
            <Button
              variant="primary"
              onClick={() => handleCommand(TEST_DISPLAY_COMMAND)}
              active={gameState === GAME_STATE.DISPLAY}
            >
              Display
            </Button>
          </ButtonGroup>
          {component}
        </>
      }
    </div >
  );
};

export default GamePage;
