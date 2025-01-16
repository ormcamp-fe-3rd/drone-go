export interface Robot {
  _id: string;
  name: string;
  robot_id: string;
}

export interface Operation {
  _id: string;
  name: string;
  robot: string;
}
