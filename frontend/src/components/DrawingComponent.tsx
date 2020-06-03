import '../styles/DrawingComponent.css';

import { BlockPicker, ColorResult } from 'react-color';
import { Layer, Stage } from 'react-konva';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Konva from 'konva';
import addLine from './tools/Line'

/**
 * React implementation of
 * https://medium.com/better-programming/how-to-make-a-whiteboard-app-with-react-konva-8766a532a39f
 */
function DrawingCanvas() {
  const stageRef = useRef<Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  // const [lines, setLines] = useState<Array<Konva.Line>>([]);
  const [color, setColor] = useState("#ef740e");

  const handleChangeComplete = (color: ColorResult, event: ChangeEvent<HTMLInputElement>) => {
    setColor(color.hex);
  }
  function drawLine() {
    if (!stageRef?.current || !layerRef?.current) return;
    addLine(stageRef.current.getStage(), layerRef?.current, "brush", color);
  }
  function eraseLine() {
    if (!stageRef?.current || !layerRef?.current) return;
    addLine(stageRef?.current?.getStage(), layerRef?.current, "erase");
  };

  function clear() {
    layerRef.current?.destroyChildren();
    layerRef.current?.clear();
  }
  const notYetImplemented = () => {
    window.alert("action not yet implemented!");
  }

  useEffect(drawLine);

  const canvasStyle = {
    border: "1px solid black"
  };
  return (
    <div className="drawing-section">
      <div className="tools">
        <BlockPicker onChangeComplete={handleChangeComplete} />
        <ButtonGroup>
          <Button variant="secondary" onClick={drawLine}>
            Draw
          </Button>
          <Button variant="secondary" onClick={eraseLine}>
            Erase
          </Button>
          <Button variant="secondary" onClick={notYetImplemented}>
            Line
          </Button>
          <Button variant="secondary" onClick={notYetImplemented}>
            Fill
          </Button>
          <Button variant="secondary" onClick={notYetImplemented}>
            Undo
          </Button>
          <Button variant="secondary" onClick={clear}>
            Clear
          </Button>
        </ButtonGroup>
      </div>
      <div className="stage">
        <Stage
          style={canvasStyle}
          ref={stageRef}
          width={600}
          height={400}
        >
          <Layer ref={layerRef}>
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default DrawingCanvas;