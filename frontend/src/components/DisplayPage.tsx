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
    TestHistories.getHeartWithNames("Henry", 1, "Mavey", 2),
    TestHistories.getHeartWithNames("Kevin", 3, "Michael", 4),
    TestHistories.getHeartWithNames("Michael", 4, "Henry", 1),
    TestHistories.getHeartWithNames("Mavey", 2, "Kevin", 3),
    TestHistories.getHeartWithNames("Michael", 4, "Kevin", 3),
  ],
  width: 540,
  height: 540,
}

function DisplayPage(props: DisplayPageProps) {
  const { drawingPairs, width, height } = props;

  const drawings = []
  for (const [index, pair] of drawingPairs.entries()) {
    drawings.push(
      <div className={"drawing-display"} key={index}>
        <div className={"drawing"}>
          <div className={"left-drawing"}>
            <DrawingDisplay
              width={width}
              height={height}
              histories={pair.left.histories}
              timescale={0.5}
            />
          </div>
          <div className={"center-column"} />
          <div className={"right-drawing"}>
            <DrawingDisplay
              width={width}
              height={height}
              histories={pair.right.histories}
              timescale={0.5}
            />
          </div>
        </div>
        <div className={"labels"}>
          <div>{pair.left.user_name}</div>
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
