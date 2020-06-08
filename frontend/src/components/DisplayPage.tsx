import '../styles/DisplayPage.scss';

import * as TestHistories from "./tools/TestHistories";

import DrawingDisplay from './DrawingDisplay';
import { DrawingPair } from "./tools/History"
import React from 'react';

interface DisplayPageProps {
  drawingPairs: Array<DrawingPair>,
  width: number,
  height: number,
}

const defaultProps: DisplayPageProps = {
  drawingPairs: [
    {
      left: {
        user_id: 1,
        user_name: "Henry",
        histories: TestHistories.HEART_LEFT,
      },
      right: {
        user_id: 2,
        user_name: "Mavey",
        histories: TestHistories.HEART_RIGHT,
      },
    }
  ],
  width: 540,
  height: 540,
}

function DisplayPage(props: DisplayPageProps) {
  const { drawingPairs, width, height } = props;

  const drawings = []
  for (const [index, pair] of drawingPairs.entries()) {
    drawings.push(
      <div className={"drawing"} key={index}>
        <div className={"left-drawing"}>
          <DrawingDisplay
            width={width}
            height={height}
            histories={pair.left.histories}
            timescale={0.5}
          />
          <div>{pair.left.user_name}</div>
        </div>
        <div className={"center-column"}>
        </div>
        <div className={"right-drawing"}>
          <DrawingDisplay
            width={width}
            height={height}
            histories={pair.right.histories}
            timescale={0.5}
          />
          <div>{pair.right.user_name}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={"display-page"}>
      {drawings}
    </div>
  );
};

DisplayPage.defaultProps = defaultProps;

export default DisplayPage;
