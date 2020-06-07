import React from 'react';

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

  // Set a full width CSS temporarily just for debugging purposes
  const FULL_WIDTH_CSS = { width: '100%' };
  const SEPARATOR_CSS = { paddingBottom: '50px' };

  return (
    <>
      <div style={FULL_WIDTH_CSS}>The game ID is {gameID}</div>
      <section style={SEPARATOR_CSS}>
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
