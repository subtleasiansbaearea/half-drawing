import { Button, ButtonGroup } from 'react-bootstrap';
import { History, LineHistory } from '../types/History';
import { Layer, Rect, Stage } from 'react-konva';
import React, { useEffect, useRef } from 'react';
import { drawLine, playLine } from './tools/Line'

import Konva from 'konva';

interface DisplayCanvasProps {
  width: number,
  height: number,
  histories?: Array<History>,
  timescale: number,
  coverLeft?: boolean,
  showButton?: boolean,
  className?: string,
}

const STRIP_WIDTH = 30;
/**
 * React implementation of
 * https://medium.com/better-programming/how-to-make-a-whiteboard-app-with-react-konva-8766a532a39f
 */
function DisplayCanvas(props: DisplayCanvasProps) {
  const layerRef = useRef<Konva.Layer>(null);
  const stageRef = useRef<Stage>(null);
  const { width, height, histories, coverLeft } = props;

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
    if (!layerRef?.current || !histories || !histories.length) return;
    const layer = layerRef.current;
    for (let history of histories) {
      enactHistory(history, layer, 0);
    }
  }

  function firstDraw() {
    if (!stageRef?.current || !layerRef?.current) {
      return;
    }
    draw();
    if (coverLeft) {
      // draw background underneath
      const newLayer = new Konva.Layer();
      const background = new Konva.Rect({
        x: width - STRIP_WIDTH,
        y: 0,
        width: STRIP_WIDTH,
        height: height,
        fill: 'white',
      });
      newLayer.add(background);
      stageRef.current.getStage().add(newLayer);
      newLayer.moveToBottom();

      const eraseRect = new Konva.Rect({
        x: 0,
        y: 0,
        width: width - STRIP_WIDTH,
        height: height,
        fill: 'white',
        globalCompositeOperation: 'destination-out'
      })

      layerRef.current.getLayer().add(eraseRect);
    }
    // erase everything to the left
  }

  function play() {
    clear();
    if (!layerRef?.current || !histories || !histories.length) return;
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

  useEffect(firstDraw, []);

  const playDrawButton = props.showButton ? (<ButtonGroup className={"play-button"}>
    <Button
      variant="primary"
      onClick={play}
    >
      Play
    </Button>
    <Button variant="secondary" onClick={draw}>
      Draw
    </Button>
  </ButtonGroup>) : null;

  return (
    <div className={`display-stage ${props.className}`}>
      <Stage
        ref={stageRef}
        className={"display-canvas-container"}
        width={width}
        height={height}
      >
        <Layer ref={layerRef}>
        </Layer>
      </Stage>
      {playDrawButton}
    </div >
  );
}


export default DisplayCanvas;
