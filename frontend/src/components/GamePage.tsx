import './../styles/GamePage.scss';

import * as Transport from '../types/Transport';

import { Drawing, DrawingPair, GAME_STATE } from '../types/Types';
import React, { useEffect, useState } from 'react';
import { TEST_DISPLAY_COMMAND, TEST_PHASE_ONE_COMMAND, TEST_PHASE_TWO_COMMAND } from '../types/TestCommands';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DisplayPage from './DisplayPage';
import DrawingPage from './DrawingPage';
import { History } from '../types/History';
import { LOBBY_MESSAGE_TYPE } from '../types/Transport';
import LobbyPage from './LobbyPage';

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
  const {
    match: {
      params: { gameId }
    }
  } = route;

  

  const addNewPlayer = () => {
    const ws = new WebSocket('ws://localhost:40510', 'json');
    // event emmited when connected
    ws.onopen = function () {
      console.log('websocket is connected ...')
      // sending a send event to websocket server
      const addNewPlayerRequest: Transport.NewPlayerRequest = {
        type: Transport.MESSAGE_TYPE.LOBBY,
        lobbyType: LOBBY_MESSAGE_TYPE.NEW_PLAYER_REQUEST,
        gameId,
      };
      ws.send(JSON.stringify(addNewPlayerRequest));
    }
    // event emmited when receiving message 
    ws.onmessage = function (ev) {
      console.log(ev.data);
      // ws.send(JSON.stringify({`got message ${ev.data}`}));
    }

    // const ws = new WebSocket('wss://localhost:40510', 'json');
    // // event emmited when connected
    // ws.onopen = function () {
    //   console.log('websocket is connected ...');
    //   const addNewPlayerRequest: Transport.NewPlayerRequest = {
    //     type: Transport.MESSAGE_TYPE.LOBBY,
    //     lobbyType: LOBBY_MESSAGE_TYPE.NEW_PLAYER_REQUEST,
    //     gameId,
    //   };
    //   ws.send(JSON.stringify(addNewPlayerRequest));

    // };
    // // event emmited when receiving message 
    // ws.onmessage = function (ev) {
    //   console.log(ev.data);
    //   // ws.send(JSON.stringify({`got message ${ev.data}`}));
    // };
    setWs(ws);
  };

  useEffect(addNewPlayer, []);

  function handleCommand(command: Transport.ServerCommand) {
    console.log(command.gameState);
    switch (command.gameState) {
      case GAME_STATE.LOBBY:
        // do nothing
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

  function sendResponse(response: Transport.GameResponse) {
    console.log(JSON.stringify(response));
  }

  function createAndSendDrawing(histories: Array<History>) {
    const drawing: Drawing = {
      histories: histories,
      playerName: playerName,
    }

    const response: Transport.DrawingResponse = {
      gameId: gameId,
      gameState: gameState,
      drawing: drawing,
      drawingPairId: drawingPairId,
      playerId: playerId,
    }

    sendResponse(response);
  }

  let Component;
  switch (gameState) {
    case GAME_STATE.LOBBY:
      Component = (<LobbyPage
        updateName={setPlayerName}
        setReady={() => console.log('ready')}
      />);
      break;
    case GAME_STATE.PHASE_ONE:
      Component = (<DrawingPage
        prompt={prompt}
        width={DRAWING_HEIGHT}
        height={DRAWING_HEIGHT}
        isLeft={true}
        sendDrawing={createAndSendDrawing}
      />);
      break;
    case GAME_STATE.PHASE_TWO:
      Component = (<DrawingPage
        prompt={prompt}
        width={DRAWING_HEIGHT}
        height={DRAWING_HEIGHT}
        isLeft={false}
        sendDrawing={createAndSendDrawing}
        leftDrawing={leftDrawing}
      />);
      break;
    case GAME_STATE.DISPLAY:
      Component = (<DisplayPage
        drawingPairs={drawingPairs}
        width={DRAWING_HEIGHT}
        height={DRAWING_HEIGHT}
      />);
      break;
  }

  return (
    <div className={"game-page"}>
      <div>The game ID is {gameId}</div>
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
      {Component}
    </div >
  );
};

export default GamePage;
