import React from 'react';
//TODO make a call to database
//check that the game id actually exists

// tslint:disable-next-line 
const GamePage = ({match, location}) => {
  const gameID = match;
  return (
    <>
      The game ID is {gameID}
    </>
  );
};

export default GamePage;
