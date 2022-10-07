import { MINIMUM_SCORE, MAX_NEAR_ARMS_DISTANCE } from "../../constants";

export const getProportion = (reference, value) => {
  return (value * 100) / reference / 100;
};

export const validateGeneralScore = (pose) => {
  if (pose.score < MINIMUM_SCORE) {
    console.error(`LOW SCORE (UNDER ${MINIMUM_SCORE})`);
    return false;
  }

  return true;
};

export const validateHandsDownFrontPhoto = (pose) => {
  const result = { valid: false, score: pose.score };

  if (!validateGeneralScore(pose)) {
    console.log("d");
    result.valid = false;
    return result;
  }

  const leftHip = pose.keypoints[11];
  const rightHip = pose.keypoints[12];
  const leftWrist = pose.keypoints[9];
  const rightWrist = pose.keypoints[10];
  const hipWidth = leftHip.position.x - rightHip.position.x;
  const leftWristDistanceFromHip = leftWrist.position.x - leftHip.position.x;
  const rightWristDistanceFromHip = rightHip.position.x - rightWrist.position.x;

  const isLeftSideOk =
    getProportion(hipWidth, leftWristDistanceFromHip) <= MAX_NEAR_ARMS_DISTANCE;
  const isRightSideOk =
    getProportion(hipWidth, rightWristDistanceFromHip) <=
    MAX_NEAR_ARMS_DISTANCE;

  if (isLeftSideOk && isRightSideOk) {
    result.valid = true;
  }

  return result;
};
