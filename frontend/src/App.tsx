import React from 'react';
import logo from './logo.svg';
import './App.css';
import HerComponent from './components/HerComponent';
import DrawingComponent from './components/DrawingComponent';

function App() {
  return (
    <div className="App">
      <DrawingComponent/>
      <HerComponent/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello Mavey
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
