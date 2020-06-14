import './../styles/LobbyPage.scss';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import { Player } from '../types/Types';
import React from 'react';

interface LobbyPageProps {
  setReady: () => void;
  isReady?: boolean;
  updateName: (name: string) => void;
  startGame: () => void;
  players: Player[];
}

const LobbyPage = (props: LobbyPageProps) => {

  const placeholderRulesText = 'Lorem Ipsum '.repeat(80);
  const { isReady, players, setReady, startGame } = props;

  const canStartGame = players.every(p => p.isReady);

  return (
    <>
      <div className="lobby-page">
        <div className="lobby-column">
          <section>
            <h3>Settings</h3>
            <div className="control-group">
              <label>Name</label>
              <InputGroup>
                <FormControl />
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
                <div id="first-player-name">Alice {isReady ? ' is Ready' : null}</div>
              </div>
              <div className="control-group">
                <div id="second-player-name">Bob {isReady ? ' is Ready' : null}</div>
              </div>
            </div>
          </section>
          <ButtonGroup>
            <Button variant="primary" size="lg" onClick={startGame} disabled={!canStartGame}>Start Game</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="primary" size="lg" onClick={setReady}>Ready</Button>
          </ButtonGroup>
        </div>
      </div>
    </>
  );
};

export default LobbyPage;
