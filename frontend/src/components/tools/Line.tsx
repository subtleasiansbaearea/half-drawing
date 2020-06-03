import Konva from "konva";

function addLine(
  stage: Konva.Stage,
  layer: Konva.Layer,
  mode = "brush",
  color = "#000000",
  width = 5
) {
  let isPaint = false;
  let lastLine: Konva.Line;
  stage.off("mousedown touchstart");
  stage.off("mouseup touchend");
  stage.off("mousemove touchmove");

  stage.on("mousedown touchstart", function (e) {
    isPaint = true;
    const pos = stage.getPointerPosition();
    if (!pos) {
      return;
    }
    lastLine = new Konva.Line({
      stroke: mode === "brush" ? color : "white",
      strokeWidth: mode === "brush" ? width : 20,
      globalCompositeOperation: mode === "brush" ? "source-over" : "destination-out",
      points: [pos.x, pos.y],
      lineJoin: "round",
      lineCap: "round",
    });
    layer.add(lastLine);
  });

  stage.on("mouseup touchend", function () {
    isPaint = false;
  });

  stage.on("mousemove touchmove", function () {
    const pos = stage.getPointerPosition();
    if (!isPaint || !pos) {
      return;
    }
    const newPoints = lastLine.points().concat([pos.x, pos.y]);
    lastLine.points(newPoints);
    layer.batchDraw();
  });
};

export default addLine;