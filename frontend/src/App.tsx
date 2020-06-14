import './App.scss';
import './'

import { Link, Route, BrowserRouter as Router } from 'react-router-dom';

import GameNotFoundPage from "./components/GameNotFoundPage"
import GamePage from "./components/GamePage"
import HomePage from "./components/HomePage"
import React from 'react';

const App = () => {

  return (
    <div className="App">
      <h1>Biscuits and Gravy</h1>
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/game" component={GameNotFoundPage} />
        <Route exact path="/game/:gameId" component={GamePage} />

        <span>
          <Link to="/">Home</Link><br />
          <Link to="/game">Game404</Link><br />
          <Link to="/game/gameId">Game</Link>
        </span>
      </Router>
    </div>
  );
};

export default App;
