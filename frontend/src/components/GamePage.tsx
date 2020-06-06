import React from 'react';
 
import DrawingComponent from './DrawingComponent';

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

  return (
    <>
      The game ID is {gameID}
      <DrawingComponent/>
    </>
  );
};

export default GamePage;
