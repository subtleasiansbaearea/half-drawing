import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/HomePage.scss';

const GameNotFoundPage = () => {
  return (
    <>
    	<div className="home-wrapper">
	      <h1 className="name-of-game">Whoops!</h1>
	      <h2>We can't find this game. Please click <Link to="/">here</Link> to return to the home page.</h2>
	      <h3>
	        <span className="created-by">Kevin Tang, Michael Owens, Mavey Ma. 2020 SABA Hackathon.</span>
	      </h3>
	    </div>
    </>
  );
};

export default GameNotFoundPage;