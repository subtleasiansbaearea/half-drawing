import './../styles/LobbyPage.scss';

import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import { Player } from '../types/Types';

interface LobbyPageProps {
  players: Player[];
  isReady?: boolean;
  setReady: () => void;
  updateName: (name: string) => void;
  startGame: () => void;

}

const LobbyPage = (props: LobbyPageProps) => {

  const placeholderRulesText = 'Have fun!';
  const { isReady, players, setReady, startGame, updateName } = props;
  const [playerName, setPlayerName] = useState('');

  const canStartGame = players.every(p => p.isReady);

  const playersDivs = players.map(player =>
    <div className="player-names">
      {player.name}
      <div className={
        `ready-indicator ${player.isReady ? 'ready' : 'not-ready'}`
      } />
    </div>);

  return (
    <div className="lobby-page">
      <div className="lobby-column">
        <section>
          <h3>Settings</h3>
          <div className="control-group">
            <label>Player Name</label>
            <InputGroup>
              <FormControl
                value={playerName}
                onChange={newName => setPlayerName(newName.target.value)}
                placeholder="Player name"
                aria-label="player name"
              />
              <Button
                variant="outline-secondary"
                onClick={() => updateName(playerName)}
              >
                Update
              </Button>
            </InputGroup>
          </div>
          <div className="control-group">
            <label>Time limit per round</label>
            <p>120 seconds</p>
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
          {playersDivs}
        </section>
        <ButtonGroup>
          <Button variant="primary" size="lg" onClick={startGame} disabled={!canStartGame}>Start Game</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="primary" size="lg" onClick={setReady}>Ready</Button>
        </ButtonGroup>
      </div>
    </div >
  );
};

export default LobbyPage;
