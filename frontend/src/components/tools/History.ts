export interface PointHistory {
  x: number,
  y: number,
  time: number,
}

export interface History {
  mode: string,
  startTime: number,
}

export interface LineHistory extends History {
  points: Array<PointHistory>,
  width: number;
  color: string;
}
