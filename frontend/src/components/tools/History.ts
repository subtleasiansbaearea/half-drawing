export interface PointHistory {
  x: number,
  y: number,
  time: number,
}

export interface History {
  mode: string,
  timeStarted: number,
}

export interface LineHistory extends History {
  points: Array<PointHistory>,
}
