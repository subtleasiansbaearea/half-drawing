import '../styles/Global.scss';

import { Button } from 'react-bootstrap';
import React from 'react';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      <div className="home-wrapper">
        <h1 className="name-of-game">Biscuits and Gravy</h1>
        <ScreenNameForm />
        <h3>
          <span className="created-by">Kevin Tang, Michael Owens, Mavey Ma, Henry Ling. 2020 SABA Hackathon.</span>
        </h3>
      </div>
    </>
  );
};

type ScreenName = {
  name: string;
  email: string;
};

type createLobbyResponse = {
  id: string;
}

const ScreenNameForm = () => {
  const history = useHistory();

  const { register, handleSubmit } = useForm<ScreenName>();
  const onSubmit = (data: ScreenName) => {
    //TODO
  };

  const submitButtonHandler = () => {

    fetch('http://localhost:5000/lobby/init/', {
      method: 'POST',
    })
      .then(data => data.json())
      .then((data: createLobbyResponse) => {
        history.push(`game/${data.id}`);
      }).catch(e => console.error(e))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="inp">
        <input
          type="text"
          id="name"
          name="inp"
          ref={register}
          placeholder="Enter your name"
        />
      </div>

      <Button variant="success" type="submit" className="enter-button" onClick={submitButtonHandler}>Create Game</Button>
    </form>
  );
};


export default HomePage;