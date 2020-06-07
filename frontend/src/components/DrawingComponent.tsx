import "../styles/DrawingComponent.scss";

import { BlockPicker, ColorResult } from "react-color";
import { Layer, Stage } from "react-konva";
import React, { useEffect, useRef, useState } from "react";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import DrawingDisplay from "./DrawingDisplay"
import { History } from "./tools/History"
import Konva from "konva";
import _ from "lodash";
import { addLine } from "./tools/Line"

const BRUSH_WIDTHS = [4, 9, 16, 25, 36];
const DEFAULT_BRUSH_WIDTH = 16;

interface DrawingComponentProps {
  width?: number,
  height?: number,
}

const defaultProps: DrawingComponentProps = {
  width: 500,
  height: 500,
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
  const [lastDrawMode, setLastDrawMode] = useState("brush");

  function handleColorChange(color: ColorResult) {
    setColor(color.hex);

  }

  function drawLine() {
    if (!stageRef?.current || !layerRef?.current) return;
    addLine(stageRef.current.getStage(), layerRef?.current, histories,
      setHistories, "brush", color, brushWidth);
    setLastDrawMode("brush");
  }
  function eraseLine() {
    if (!stageRef?.current || !layerRef?.current) return;
    addLine(stageRef?.current?.getStage(), layerRef?.current, histories,
      setHistories, "erase");
    setLastDrawMode("erase");
  };

  useEffect(() => {
    if (lastDrawMode === "brush") {
      drawLine();
    } else {
      eraseLine();
    }
  }, [histories, color, brushWidth]);

  function clear() {
    layerRef.current?.destroyChildren();
    layerRef.current?.clear();

    console.log(histories);
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
  }

  function save() {
    console.log(histories);
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
    const brushBoxClassName = isSelected ? "brush-box selected" : "brush-box";
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
    <div className="drawing-section">
      <div className="tools">
        <h3>Brush sizes</h3>
        <div className="brushes">
          {sizeSwatches}
        </div>
        <BlockPicker onChangeComplete={handleColorChange} color={color} />
        <ButtonGroup>
          <Button variant="secondary" onClick={drawLine}>
            Brush
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
          <Button variant="secondary" onClick={save}>
            Save
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
      <DrawingDisplay
        width={props.width || 400}
        histories={histories}
        timescale={.5}
      />
    </div>
  );
}

DrawingComponent.defaultProps = defaultProps;

export default DrawingComponent;
