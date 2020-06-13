import { History, LineHistory, PointHistory } from "../../types/History";

import Konva from "konva";

export function addLine(
  stage: Konva.Stage,
  layer: Konva.Layer,
  histories: Array<History>,
  setHistories: (histories: Array<History>) => void,
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
      startTime: Date.now(),
      mode: mode,
      width: width,
      color: color,
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
    histories = [...histories, lastLineHistory];
    setHistories(histories);
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

export function drawLine(
  layer: Konva.Layer,
  history: LineHistory,
) {
  const points = history.points.map(
    (pointHistory: PointHistory) => [pointHistory.x, pointHistory.y]).flat();
  const isBrush = history.mode === "brush";
  const line = new Konva.Line({
    stroke: isBrush ? history.color : "white",
    strokeWidth: isBrush ? history.width : 20,
    globalCompositeOperation: isBrush ? "source-over" : "destination-out",
    points: points,
    lineJoin: "round",
    lineCap: "round",
  });

  layer.add(line);
  layer.draw();
};

export function playLine(
  layer: Konva.Layer,
  history: LineHistory,
  timescale = 1,
) {
  const startTime = history.startTime;

  const isBrush = history.mode === "brush";
  const line = new Konva.Line({
    stroke: isBrush ? history.color : "white",
    strokeWidth: isBrush ? history.width : 20,
    globalCompositeOperation: isBrush ? "source-over" : "destination-out",
    points: [],
    lineJoin: "round",
    lineCap: "round",
  });

  for (const point of history.points) {
    const timeDiff = point.time - startTime;
    setTimeout(
      () => line.points().concat([point.x, point.y]),
      timeDiff * timescale);
    layer.batchDraw();
  }
}

export default {
  addLine,
  drawLine,
  playLine,
}