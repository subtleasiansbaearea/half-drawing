import './App.scss';

import React, { useEffect } from 'react';

import DrawingComponent from './components/DrawingComponent';

function App() {
  const callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  useEffect(() => {
    callApi().then(resp => console.log(resp))
  });
  return (
    <div className="App">

      <DrawingComponent />
    </div>
  );
}

export default App;
