import { History, LineHistory } from './History'

import Konva from "konva";

function addLine(
  stage: Konva.Stage,
  layer: Konva.Layer,
  addToHistory: (history: History) => void,
  mode = "brush",
  color = "#000000",
  width = 5
) {
  let isPaint = false;
  let lastLine: Konva.Line;
  let lastLineHistory: LineHistory;

  stage.off("mousedown touchstart");
  stage.off("mouseup touchend");
  stage.off("mousemove touchmove");

  stage.on("mousedown touchstart", function (e) {
    isPaint = true;
    const pos = stage.getPointerPosition();
    if (!pos) {
      return;
    }
    lastLineHistory = {
      timeStarted: Date.now(),
      mode: mode,
      points: [{ x: pos.x, y: pos.y, time: Date.now() }],
    };
    const isBrush = mode === "brush";
    lastLine = new Konva.Line({
      stroke: isBrush ? color : "white",
      strokeWidth: isBrush ? width : 20,
      globalCompositeOperation: isBrush ? "source-over" : "destination-out",
      points: [pos.x, pos.y],
      lineJoin: "round",
      lineCap: "round",
    });
    layer.add(lastLine);
  });

  stage.on("mouseup touchend", function () {
    isPaint = false;
    addToHistory(lastLineHistory);
  });

  stage.on("mousemove touchmove", function () {
    const pos = stage.getPointerPosition();
    if (!isPaint || !pos) {
      return;
    }
    const newPoints = lastLine.points().concat([pos.x, pos.y]);
    lastLine.points(newPoints);
    lastLineHistory.points.push({ x: pos.x, y: pos.y, time: Date.now() });
    layer.batchDraw();
  });
};

export default addLine;
