import React from 'react';
 
//TODO make a call to database
//check that the game id actually exists

interface Route {
  match: {
    params: {
      gameID: string;
    }
  }
  location: {

  }
}
const GamePage = (match: Route) => {
  console.log(match);

  const {
    match: {
      params: { gameID }}
  } = match;

  return (
    <>
      The game ID is {gameID}
    </>
  );
};

export default GamePage;
