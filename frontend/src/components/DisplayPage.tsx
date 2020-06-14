import '../styles/DisplayPage.scss';

import DisplayCanvas from './DisplayCanvas';
import { DrawingPair } from "../types/Types"
import React from 'react';
import { getHeartDrawingPairs } from './tools/TestHistories';

interface DisplayPageProps {
  drawingPairs: Array<DrawingPair>,
  width: number,
  height: number,
}


const defaultProps: DisplayPageProps = {
  drawingPairs: getHeartDrawingPairs(),
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
            <DisplayCanvas
              width={width}
              height={height}
              histories={pair.left?.histories}
              timescale={0.5}
            />
          </div>
          <div className={"center-column"} />
          <div className={"right-drawing"}>
            <DisplayCanvas
              width={width}
              height={height}
              histories={pair.right?.histories}
              timescale={0.5}
            />
          </div>
        </div>
        <div className={"labels"}>
          <div>{pair.left?.playerName}</div>
          <div>{pair.right?.playerName}</div>
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
