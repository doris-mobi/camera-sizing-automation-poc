import { MINIMUM_SCORE, MAX_NEAR_ARMS_DISTANCE } from "../../constants";

export const compareDistance = (reference, value) => {
  return (value * 100) / reference / 100;
};

export const validateHandsDownFrontPhoto = (pose) => {
  const result = { valid: false, score: pose.score };

  if (pose.score < MINIMUM_SCORE) {
    result.valid = false;
    result.score = pose.score;
    return result;
  }

  const leftHip = pose.keypoints[11];
  const rightHip = pose.keypoints[12];
  const leftWrist = pose.keypoints[9];
  const rightWrist = pose.keypoints[10];
  const hipWidth = leftHip.position.x - rightHip.position.x;
  const leftWristDistanceFromHip = leftWrist.position.x - leftHip.position.x;

  console.log(compareDistance(hipWidth, leftWristDistanceFromHip));

  if (
    compareDistance(hipWidth, leftWristDistanceFromHip) <=
    MAX_NEAR_ARMS_DISTANCE
  ) {
    result.valid = true;
  }

  return result;
};
