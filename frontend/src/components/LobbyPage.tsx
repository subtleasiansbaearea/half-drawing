import React from 'react';
import Button from 'react-bootstrap/Button';

import './../styles/LobbyPage.scss';

const LobbyPage = () => {

  function startButton() {
    console.log('Start');
  }

  function readyButton() {
    console.log('Ready');
  }

  return (
    <div className="lobby-page">
      <div className="lobby-column">Left side</div>
      <div className="lobby-column">
        <Button onClick={startButton}>START GAME</Button>
        <Button onClick={readyButton}>READY</Button>
      </div>
    </div>
  );
};

export default LobbyPage;
