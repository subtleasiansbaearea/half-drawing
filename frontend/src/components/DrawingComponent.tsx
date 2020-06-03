import '../styles/DrawingComponent.css';

import { BlockPicker, ColorResult } from 'react-color';
import { Layer, Stage } from 'react-konva';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Konva from 'konva';
import addLine from './tools/Line'

const BRUSH_WIDTHS = [4, 9, 16, 25, 36];
const DEFAULT_BRUSH_WIDTH = 16;

interface DrawingCanvasProps {
  width?: number,
  height?: number,
}

const defaultProps: DrawingCanvasProps = {
  width: 600,
  height: 400,
}

/**
 * React implementation of
 * https://medium.com/better-programming/how-to-make-a-whiteboard-app-with-react-konva-8766a532a39f
 */
function DrawingCanvas(props: DrawingCanvasProps) {
  const stageRef = useRef<Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  // const [lines, setLines] = useState<Array<Konva.Line>>([]);
  const [brushWidth, setBrushWidth] = useState(DEFAULT_BRUSH_WIDTH);
  const [color, setColor] = useState("#ef740e");

  const handleChangeComplete = (color: ColorResult, event: ChangeEvent<HTMLInputElement>) => {
    setColor(color.hex);
  }
  function drawLine() {
    if (!stageRef?.current || !layerRef?.current) return;
    addLine(stageRef.current.getStage(), layerRef?.current,
      "brush", color, brushWidth);
  }
  function eraseLine() {
    if (!stageRef?.current || !layerRef?.current) return;
    addLine(stageRef?.current?.getStage(), layerRef?.current, "erase");
  };

  function clear() {
    layerRef.current?.destroyChildren();
    layerRef.current?.clear();
  }

  function undo() {
    if (!layerRef?.current) return;
    const children = layerRef.current.getChildren();
    children[children.length - 1].destroy();
    layerRef.current.draw();
  }
  const notYetImplemented = () => {
    window.alert("action not yet implemented!");
  }

  useEffect(drawLine);

  const canvasStyle = {
    border: "1px solid #ababab"
  };

  const sizeSwatches: Array<JSX.Element> = [];

  // TODO(TangerineCat): move brushes into sub component
  for (const size of BRUSH_WIDTHS) {
    const buttonStyle = {
      height: size,
      width: size,
      background: color,
    };
    const isSelected = size === brushWidth;
    const brushBoxClassName = isSelected ? "brush-box selected" : "brush-box";
    sizeSwatches.push(
      <div className={brushBoxClassName} onClick={() => setBrushWidth(size)}>
        <div
          className="size-button"
          style={buttonStyle}
        />
      </div >

    )
  }
  return (
    <div className="drawing-section">
      <div className="tools">
        <h3>Brush sizes</h3>
        <div className="brushes">
          {sizeSwatches}
        </div>
        <BlockPicker onChangeComplete={handleChangeComplete} color={color} />
        <ButtonGroup>
          <Button variant="secondary" onClick={drawLine}>
            Draw
          </Button>
          <Button variant="secondary" onClick={eraseLine}>
            Erase
          </Button>
          <Button variant="secondary" onClick={undo}>
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
          width={props.width}
          height={props.height}
        >
          <Layer ref={layerRef}>
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

DrawingCanvas.defaultProps = defaultProps;

export default DrawingCanvas;