import React, { useEffect, useState } from 'react';

interface TimerProps {
  time?: number; // in seconds
  cb: () => void;
}

function Timer(props: TimerProps) {
  const { cb, time } = props;
  const [countdown, setCountDown] = useState(time ? time : 120);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setTimeout(() => {
      if (countdown > 0) {
        setCountDown(countdown - 1);
      }
    }, 1000)
    if (countdown === 0) {
      cb();
    }
  })
  
  return (
    <div>
      <h1>{countdown}</h1>
    </div>
  )
}

export default Timer;