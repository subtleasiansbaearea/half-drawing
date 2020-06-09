import '../styles/DrawingComponent.scss';

import { Button, ButtonGroup } from 'react-bootstrap';
import { History, LineHistory } from './tools/History';
import { Layer, Stage } from 'react-konva';
import React, { useEffect, useRef } from 'react';
import { drawLine, playLine } from './tools/Line'

import Konva from 'konva';

interface DrawingDisplayProps {
  width: number,
  height: number,
  histories: Array<History>,
  timescale: number,
}

/**
 * React implementation of
 * https://medium.com/better-programming/how-to-make-a-whiteboard-app-with-react-konva-8766a532a39f
 */
function DrawingDisplay(props: DrawingDisplayProps) {
  const layerRef = useRef<Konva.Layer>(null);
  const { width, height, histories } = props;

  function clear() {
    layerRef.current?.destroyChildren();
    layerRef.current?.draw();
  }

  function undo() {
    if (!layerRef?.current) return;
    const children = layerRef.current.getChildren();
    if (children.length) {
      children[children.length - 1].destroy();
    }
    layerRef.current.draw();
  }

  function enactHistory(
    history: History,
    layer: Konva.Layer,
    timescale = 0) {
    switch (history.mode) {
      case "brush":
      // falls through
      case "erase":
        const lineHistory = history as LineHistory;
        if (timescale === 0) {
          drawLine(layer, lineHistory);
        } else {
          playLine(layer, lineHistory, timescale);
        }
        break;
      case "undo":
        undo();
        break;
      case "clear":
        clear();
        break;
    }
  }

  function draw() {
    clear();
    if (!layerRef?.current || !histories.length) return;
    const layer = layerRef.current;
    for (let history of histories) {
      enactHistory(history, layer, 0);
    }
  }

  function play() {
    clear();
    if (!layerRef?.current || !histories.length) return;
    const layer = layerRef.current;
    const startTime = histories[0].startTime;
    console.log(histories);
    for (const history of histories) {
      const timeDiff = history.startTime - startTime;
      setTimeout(
        () => enactHistory(history, layer, props.timescale),
        timeDiff * props.timescale);
    }
  }

  useEffect(draw, []);
  return (
    <div className="display-stage">
      <Stage
        className={"display-canvas-container"}
        width={width}
        height={height}
      >
        <Layer ref={layerRef}>
        </Layer>
      </Stage>
      <ButtonGroup className={"play-button"}>
        <Button
          variant="primary"
          onClick={play}
        >
          Play
        </Button>
        <Button variant="secondary" onClick={draw}>
          Draw
        </Button>
      </ButtonGroup>
    </div>
  );
}


export default DrawingDisplay;
