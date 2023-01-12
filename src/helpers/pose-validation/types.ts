export type PoseType = 'FRONT' | 'FRONT_WITH_UP_ARMS' | 'SIDE'

export interface Keypoint {
  x: number
  y: number
}

export interface Pose {
  keypoints: Keypoint[]
}
