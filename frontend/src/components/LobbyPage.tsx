import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

import './../styles/LobbyPage.scss';

const LobbyPage = () => {

  function startButton() {
    console.log('Start');
  }

  function readyButton() {
    console.log('Ready');
  }

  const placeholderRulesText = 'Lorem Ipsum '.repeat(80);

  return (
    <div className="lobby-page">
      <div className="lobby-column">
        <section>
          <h3>Settings</h3>
          <div className="control-group">
            <label>Name</label>
            <InputGroup>
              <FormControl/>
            </InputGroup>
          </div>
          <div className="control-group">
            <label>Time limit per round</label>
            <p>90 seconds</p>
          </div>
        </section>
        <section>
          <h3>Rules</h3>
          <p>{placeholderRulesText}</p>
        </section>
      </div>
      <div className="lobby-column">
        <section>
          <h3>Players</h3>
          <div className="player-names">
            <div className="control-group">
              <div id="first-player-name">Alice</div>
            </div>
            <div className="control-group">
              <div id="second-player-name">Bob</div>
            </div>
          </div>
        </section>
        <ButtonGroup>
          <Button variant="primary" size="lg" onClick={startButton}>Start Game</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="primary" size="lg" onClick={readyButton}>Ready</Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default LobbyPage;
