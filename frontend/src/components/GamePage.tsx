import './../styles/GamePage.scss';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DisplayPage from './DisplayPage';
import DrawingPage from './DrawingPage';
import { GAME_STATE } from '../types/Types'
import LobbyPage from './LobbyPage';
import React from 'react';

//TODO make a call to database
//check that the game id actually exists

interface Route {
  match: {
    params: {
      gameID: string;
    }
  }
}

const GamePage = (match: Route) => {
  let gameState = GAME_STATE.LOBBY;
  let gameId = null
  function setTempLobby() {

  }

  return (
    <div className={"game-page"}>
      <div>The game ID is {gameId}</div>
      <ButtonGroup>
        <Button variant="primary" onClick={setTempLobby}>
          Lobby
        </Button>
        <Button variant="primary" onClick={setTempLobby}>
          Phase 1
        </Button>
        <Button variant="primary" onClick={setTempLobby}>
          Phase 2
        </Button>
        <Button variant="primary" onClick={setTempLobby}>
          Display
        </Button>
      </ButtonGroup>
      <LobbyPage />
      <DrawingPage />
      <DisplayPage />
    </div>
  );
};

export default GamePage;
