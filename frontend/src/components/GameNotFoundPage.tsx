import React from 'react';

import '../styles/HomePage.scss';

const GameNotFoundPage = () => {
  return (
    <>
    	<div className="home-wrapper">
	      <span className="name-of-game">Whoops! Can't find that game.</span>
	      <h3>
	        <span className="created-by">Kevin Tang, Michael Owens, Mavey Ma. 2020 SABA Hackathon.</span>
	      </h3>
	    </div>
    </>
  );
};

export default GameNotFoundPage;