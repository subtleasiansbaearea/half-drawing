import "../styles/DrawingComponent.scss";

import * as ImageConstants from '../img/constants'

import { ColorResult, GithubPicker } from 'react-color';
import { Layer, Stage } from "react-konva";
import React, { useEffect, useRef, useState } from 'react';

import DrawingDisplay from "./DrawingDisplay"
import { History } from "./tools/History"
import Konva from "konva";
import _ from "lodash";
import { addLine } from "./tools/Line"

const BRUSH_WIDTHS = [4, 9, 16, 25, 36];
const DEFAULT_BRUSH_WIDTH = 16;

interface DrawingComponentProps {
  width: number,
  height: number,
}

const defaultProps: DrawingComponentProps = {
  width: 540,
  height: 540,
}

/**
 * React implementation of
 * https://medium.com/better-programming/how-to-make-a-whiteboard-app-with-react-konva-8766a532a39f
 */
function DrawingComponent(props: DrawingComponentProps) {
  const stageRef = useRef<Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const [brushWidth, setBrushWidth] = useState(DEFAULT_BRUSH_WIDTH);
  const [color, setColor] = useState("#ef740e");
  const [histories, setHistories] = useState<Array<History>>([]);

  function handleColorChange(color: ColorResult) {
    setColor(color.hex);
  }

  function drawLine() {
    if (!stageRef?.current || !layerRef?.current) return;
    addLine(stageRef.current.getStage(), layerRef.current, histories,
      setHistories, "brush", color, brushWidth);
  }
  function eraseLine() {
    if (!stageRef?.current || !layerRef?.current) return;
    addLine(stageRef.current.getStage(), layerRef.current, histories,
      setHistories, "erase");
  };

  useEffect(drawLine, [histories, brushWidth, color]);

  function clear() {
    layerRef.current?.destroyChildren();
    layerRef.current?.clear();
    setHistories([...histories, { mode: "clear", startTime: Date.now() }]);
  }

  function undo() {
    if (!layerRef?.current) return;
    const children = layerRef.current.getChildren();
    if (children.length) {
      children[children.length - 1].destroy();
    }
    setHistories([...histories, { mode: "undo", startTime: Date.now() }]);
    layerRef.current.draw();
  }

  function keydownHandler(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === "z") {
      _.debounce(undo, 500)();
    }
    if (e.ctrlKey && e.key === "l") {
      _.debounce(() => console.log(histories), 1000);
    }
  }

  function onInit() {
    if (layerRef?.current?.children.length === 0) {
      drawLine();
    }
    document.addEventListener("keydown", keydownHandler, false);
  }

  useEffect(onInit, []);

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

  const canvasStyle = {
    border: "1px solid #ababab"
  };

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
          <GithubPicker onChangeComplete={handleColorChange} color={color} />
          <div className="black-border-box" onClick={eraseLine}>
            <img id="erase-image" src={ImageConstants.ERASER_ICON} alt="Eraser"></img>
          </div>
          <div className="black-border-box" onClick={undo}>
            <img id="undo-image" src={ImageConstants.UNDO_ICON} alt="Undo"></img>
          </div>
          <div className="black-border-box" onClick={clear}>
            <img id="blank-image" src={ImageConstants.BLANK_PAGE_ICON} alt="Blank"></img>
          </div>
        </div>
      </div>
      <DrawingDisplay
        width={props.width}
        height={props.height}
        histories={histories}
        timescale={0.5}
      />
    </>
  );
}

DrawingComponent.defaultProps = defaultProps;

export default DrawingComponent;
