import '../styles/Global.scss';

import { Button } from 'react-bootstrap';
import React from 'react';
import { useHistory } from 'react-router-dom';

function createLobby() {
  return fetch('http://localhost:5000/lobby/init/', { method: 'POST', })
    .then(data => data.json())
}

const HomePage = () => {
  const history = useHistory();
  const handleOnCreateGameClick = () => createLobby()
    .then((data: { id: string }) => {
      history.push(`game/${data.id}`);
    }).catch(e => console.error(e));

  return (
    <div className="home-wrapper">
      <h1 className="name-of-game">Biscuits and Gravy</h1>
      <Button variant="success" type="submit" className="enter-button" onClick={handleOnCreateGameClick}>Create Game</Button>
      <h3>
        <span className="created-by">Kevin Tang, Michael Owens, Mavey Ma, Henry Ling. 2020 SABA Hackathon.</span>
      </h3>
    </div>
  );
};

export default HomePage;