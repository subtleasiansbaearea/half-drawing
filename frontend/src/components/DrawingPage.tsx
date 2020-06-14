import '../styles/DrawingPage.scss';

import * as ImageConstants from '../img/constants'

import { ColorResult, GithubPicker } from 'react-color';
import { Layer, Stage } from 'react-konva';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from 'react-bootstrap';
import DisplayCanvas from './DisplayCanvas';
import { Drawing } from '../types/Types';
import { History } from '../types/History'
import Konva from 'konva';
import _ from 'lodash';
import { addLine } from './tools/Line'

const BRUSH_WIDTHS = [4, 9, 16, 25, 36];
const DEFAULT_BRUSH_WIDTH = 16;
const PHASE_ONE_PROMPT = 'Draw half of ';
const PHASE_TWO_PROMPT = 'Finish the drawing of ';

interface DrawingComponentProps {
  prompt: string,
  width: number,
  height: number,
  isLeft: boolean,
  leftDrawing?: Drawing,
  sendDrawing?: (histories: Array<History>) => void
}

const defaultProps: DrawingComponentProps = {
  prompt: 'Draw love',
  width: 540,
  height: 540,
  isLeft: true,
}

/**
 * React implementation of
 * https://medium.com/better-programming/how-to-make-a-whiteboard-app-with-react-konva-8766a532a39f
 */
function DrawingComponent(props: DrawingComponentProps) {
  const stageRef = useRef<Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const [brushWidth, setBrushWidth] = useState(DEFAULT_BRUSH_WIDTH);
  const [color, setColor] = useState('#ef740e');
  const [histories, setHistories] = useState<Array<History>>([]);
  const { prompt, width, height, isLeft, leftDrawing, sendDrawing } = props;

  function handleColorChange(color: ColorResult) {
    setColor(color.hex);
  }

  function drawLine() {
    if (!stageRef?.current || !layerRef?.current) return;
    addLine(stageRef.current.getStage(), layerRef.current, histories,
      setHistories, 'brush', color, brushWidth);
  }
  function eraseLine() {
    if (!stageRef?.current || !layerRef?.current) return;
    addLine(stageRef.current.getStage(), layerRef.current, histories,
      setHistories, 'erase');
  };

  useEffect(drawLine, [histories, brushWidth, color]);

  function clear() {
    layerRef.current?.destroyChildren();
    layerRef.current?.clear();
    setHistories(histories =>
      [...histories, { mode: 'clear', startTime: Date.now() }]);
  }

  function undo() {
    if (!layerRef?.current) return;
    const children = layerRef.current.getChildren();
    if (children.length) {
      children[children.length - 1].destroy();
    }
    setHistories(histories =>
      [...histories, { mode: 'undo', startTime: Date.now() }]);
    layerRef.current.draw();
  }

  function keydownHandler(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'z') {
      _.debounce(undo, 500)();
    }
  };

  function onInit() {
    console.log('on init');
    window.addEventListener('keydown', keydownHandler);
    setHistories([]);
    drawLine();
    return () => window.removeEventListener('keydown', keydownHandler);
  }

  useEffect(onInit, [isLeft]);

  const sizeSwatches: Array<JSX.Element> = [];
  const promptPrefix = isLeft ? PHASE_ONE_PROMPT : PHASE_TWO_PROMPT;

  // TODO(TangerineCat): move brushes into sub component
  for (const size of BRUSH_WIDTHS) {
    const buttonStyle = {
      height: size,
      width: size,
      background: color,
    };
    const isSelected = size === brushWidth;
    const brushBoxClassName = isSelected ? 'black-border-box' : 'grey-border-box';
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

  const ActiveStage = (<Stage
    className={"active-stage"}
    ref={stageRef}
    width={width}
    height={height}
  >
    <Layer ref={layerRef}>
    </Layer>
  </Stage>);

  const PassiveStage = (<DisplayCanvas
    className={"passive-stage"}
    width={width}
    height={height}
    timescale={0.2}
    coverLeft={!isLeft}
    showButton={false}
    histories={leftDrawing?.histories}
  />)

  return (
    <div className="drawing-section">
      <div className="prompt">
        {`${promptPrefix} ${prompt}`}
      </div>
      <div className="stage">
        {isLeft ? ActiveStage : PassiveStage}
        {isLeft ? PassiveStage : ActiveStage}
      </div>
      <div className="tools">
        <div className="brushes">
          {sizeSwatches}
        </div>
        <GithubPicker onChangeComplete={handleColorChange} color={color} />
        <div className="control-buttons">
          <div className="black-border-box" onClick={eraseLine}>
            <img src={ImageConstants.ERASER_ICON} alt="Eraser"></img>
          </div>
          <div className="black-border-box" onClick={undo}>
            <img src={ImageConstants.UNDO_ICON} alt="Undo"></img>
          </div>
          <div className="black-border-box" onClick={clear}>
            <img src={ImageConstants.BLANK_PAGE_ICON} alt="Blank"></img>
          </div>
          <Button onClick={() => sendDrawing && sendDrawing(histories)}>
            done?
          </Button>
        </div>
      </div>
    </div>
  );
}

DrawingComponent.defaultProps = defaultProps;

export default DrawingComponent;
