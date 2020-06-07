import React from 'react';
import Button from 'react-bootstrap/Button';
 
import DrawingComponent from './DrawingComponent';
import LobbyPage from './LobbyPage';

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
  const {
    match: {
      params: {gameID}
    }
  } = match;
  let lobbyPageClassName: string = '100%';
  let drawingPageClassName: string = '100%';

  // Set a full width CSS temporarily just for debugging purposes
  const FULL_WIDTH_CSS = { width: '100%' };

  return (
    <>
      <div style={FULL_WIDTH_CSS}>The game ID is {gameID}</div>
      <section style={FULL_WIDTH_CSS}>
        <h2 style={FULL_WIDTH_CSS}>Lobby Page</h2>
        <LobbyPage/>
      </section>
       <section>
        <h2 style={FULL_WIDTH_CSS}>Drawing Page</h2>
        <DrawingComponent/>
      </section>
      <div style={FULL_WIDTH_CSS}>
      </div>
    </>
  );
};

export default GamePage;
