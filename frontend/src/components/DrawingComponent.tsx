import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { GithubPicker, ColorResult } from 'react-color';
import { Layer, Stage } from 'react-konva';
import Konva from 'konva';
import _ from 'lodash';

import addLine from './tools/Line'
import * as ImageConstants from '../img/constants'

import '../styles/DrawingComponent.scss';

const BRUSH_WIDTHS = [4, 9, 16, 25, 36];
const DEFAULT_BRUSH_WIDTH = 16;

interface DrawingCanvasProps {
  width?: number,
  height?: number,
}

const defaultProps: DrawingCanvasProps = {
  width: 540,
  height: 540,
}

/**
 * React implementation of
 * https://medium.com/better-programming/how-to-make-a-whiteboard-app-with-react-konva-8766a532a39f
 */
function DrawingCanvas(props: DrawingCanvasProps) {
  const stageRef = useRef<Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  // eslint-disable-next-line
  const undoRef = useRef<HTMLButtonElement>(null);
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
    if (children.length) {
      children[children.length - 1].destroy();
    }
    layerRef.current.draw();
  }

  function keydownHandler(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'z') {
      _.debounce(undo, 500)();
    }
  }

  function onInit() {
    drawLine();
    document.addEventListener("keydown", keydownHandler, false);
  }

  useEffect(onInit);

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
    const brushBoxClassName = isSelected ? "black-border-box" : "grey-border-box";
    sizeSwatches.push(
      <div
        key={size}
        className={brushBoxClassName}
        onClick={() => setBrushWidth(size)}
      >
        <div
          className="size-button"
          style={buttonStyle}
        />
      </div >
    )
  }
  return (
    <>
      <div className="drawing-section">
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
        <div className="tools">
          <div className="brushes">
            {sizeSwatches}
          </div>
          <GithubPicker onChangeComplete={handleChangeComplete} color={color} />
          <div className="black-border-box" onClick={eraseLine}>
            <img id="erase-image" src={ImageConstants.ERASER_ICON}></img>
          </div>
          <div className="black-border-box" onClick={undo}>
            <img id="undo-image" src={ImageConstants.UNDO_ICON}></img>
          </div>
          <div className="black-border-box" onClick={clear}>
            <img id="blank-image" src={ImageConstants.BLANK_PAGE_ICON}></img>
          </div>
        </div>
      </div>
    </>
  );
}

DrawingCanvas.defaultProps = defaultProps;

export default DrawingCanvas;
