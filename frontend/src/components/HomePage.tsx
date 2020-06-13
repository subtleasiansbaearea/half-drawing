import React, { Component } from 'react';
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';


import '../styles/HomePage.scss';

const HomePage = () => {

  return (
  <>
    <div className="home-wrapper">
      <span className="name-of-game">Biscuits and Gravy</span>
      <ScreenNameForm/>
      <h3>
        <span className="created-by">Kevin Tang, Michael Owens, Mavey Ma. 2020 SABA Hackathon.</span>
      </h3>
    </div>
  </>
  );
};

type ScreenName = {
  name: string;
  email: string;
};

const ScreenNameForm = () => {
  const { register, handleSubmit } = useForm<ScreenName>();
  const onSubmit = (data: ScreenName) => {
    console.log("data", data);
  };

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
 
      <Button variant="success" type="submit" className="enter-button">Create Game</Button>
    </form>
  );
};


export default HomePage;