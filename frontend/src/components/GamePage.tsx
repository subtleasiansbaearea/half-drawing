import './../styles/GamePage.scss';

import React, { useEffect, useRef, useState } from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DisplayPage from './DisplayPage';
import DrawingPage from './DrawingPage';
import { GAME_STATE } from '../types/Types'
import LobbyPage from './LobbyPage';

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

const GamePage = (match: Route) => {
  const [gameState, setGameState] = useState(GAME_STATE.LOBBY);
  const {
    match: {
      params: { gameId }
    }
  } = match;
  let Component;

  switch (gameState) {
    case GAME_STATE.LOBBY:
      Component = (<LobbyPage />);
      break;
    case GAME_STATE.PHASE_ONE:
      Component = (<DrawingPage
        width={DRAWING_HEIGHT}
        height={DRAWING_HEIGHT}
        isLeft={true}
      />);
      break;
    case GAME_STATE.PHASE_TWO:
      Component = (<DrawingPage
        width={DRAWING_HEIGHT}
        height={DRAWING_HEIGHT}
        isLeft={false}
      />);
      break;
    case GAME_STATE.DISPLAY:
      Component = (<DisplayPage />);
      break;
  }

  return (
    <div className={"game-page"}>
      <div>The game ID is {gameId}</div>
      <ButtonGroup>
        <Button variant="primary" onClick={() => setGameState(GAME_STATE.LOBBY)}>
          Lobby
        </Button>
        <Button variant="primary" onClick={() => setGameState(GAME_STATE.PHASE_ONE)}>
          Phase 1
        </Button>
        <Button variant="primary" onClick={() => setGameState(GAME_STATE.PHASE_TWO)}>
          Phase 2
        </Button>
        <Button variant="primary" onClick={() => setGameState(GAME_STATE.DISPLAY)}>
          Display
        </Button>
      </ButtonGroup>
      {Component}
    </div>
  );
};

export default GamePage;
