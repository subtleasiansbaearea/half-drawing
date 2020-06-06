import React from 'react';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

import HomePage from "./components/HomePage"
import GameNotFoundPage from "./components/GameNotFoundPage"
import GamePage from "./components/GamePage"
import './App.scss';

const App = () => {
  return (
    <div className="App">
      <h1>Biscuits and Gravy</h1>
      <Router>
        <Link to="/">Home</Link><br/>
        <Link to="/game">Game404</Link><br/>
        <Link to="/game/:gameID">Game</Link>
        
        <Route exact path="/" component={HomePage}/>
        <Route exact path="/game" component={GameNotFoundPage}/>
        <Route exact path="/game/:gameID" component={GamePage}/>
      </Router>
    </div>
  );
};

export default App;
