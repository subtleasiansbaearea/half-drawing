import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import '../styles/MyComponent.css';
import { Mode } from './constants'

/**
 * React implementation of
 * https://konvajs.org/docs/sandbox/Free_Drawing.html
 */
function DrawingCanvas() {
  const stageRef = useRef<Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const stage = stageRef.current;
  const layer = layerRef.current;
  const [isPaint, setIsPaint] = useState(false);
  const [mode, setMode] = useState(Mode.Brush);
  const [lines, setLines] = useState<Array<Konva.Line>>([]);
  const [lastLine, setLastLine] = useState<Konva.Line>();
  const [color, setColor] = useState("#ef740e");
  const width = window.innerWidth - 20;

  function onMouseDown() {
    setIsPaint(true);
    console.log('mouseDown');
    const pos = stage?.getStage().getPointerPosition();
    if (pos == null) {
      return;
    }

    setLastLine(new Konva.Line({
      stroke: color,
      strokeWidth: 5,
      points: [pos.x, pos.y],
      globalCompositeOperation: mode === 'brush' ? 'source-over' : 'destination-out',
    }));
    if (lastLine) {
      layer?.add(lastLine);
    }
  }

  function onMouseUp() {
    setIsPaint(false);
    console.log('mouseUp');
  }

  function onMouseMove() {
    if (!isPaint) {
      return;
    }
    console.log('painting and moving');
    const pos = stage?.getStage().getPointerPosition();
    if (pos == null) {
      return;
    }
    var newPoints = lastLine?.points().concat([pos.x, pos.y]);
    if (newPoints) {
      console.log('new points');
      lastLine?.points(newPoints);
    }
    layer?.batchDraw();
    if (lastLine) {
      console.log('last line');
      lines.push(lastLine);
    }
  }

  const style = {
    border: "1px solid black"
  };

  return (
    <Stage
      style={style}
      ref={stageRef}
      width={width}
      height={400}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchMove={onMouseMove}
    >
      <Layer ref={layerRef}>
      </Layer>
    </Stage>
  );
}

export default DrawingCanvas;