import * as poseDetection from '@tensorflow-models/pose-detection'


export const toDegrees = (angle: number) => {
  return angle * (180 / Math.PI);
};

export const calculateAngle = (keypoint1: poseDetection.Keypoint, keypoint2: poseDetection.Keypoint, keypoint3: poseDetection.Keypoint) => {
  // Get the required keypoints coordinates.
  const { x: x1, y: y1 } = keypoint1;
  const { x: x2, y: y2 } = keypoint2;
  const { x: x3, y: y3 } = keypoint3;

  // Calculate the angle between the three points
  let angle = toDegrees(
    Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y1 - y2, x1 - x2)
  );

  // Check if the angle is less than zero.
  if (angle < 0) {
    // Add 360 to the found angle.
    angle += 360;
  }

  return angle;
};