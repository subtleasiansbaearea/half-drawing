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
  width: number,
  color: string,
}

export interface Drawing {
  user_id: number,
  user_name: string,
  histories: Array<History>,
}

export interface DrawingPair {
  left: Drawing,
  right: Drawing
}
