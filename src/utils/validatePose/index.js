import {
  MINIMUM_SCORE,
  MAX_NEAR_ARMS_DISTANCE,
  OPEN_ARMS_MAX_DISTANCE_FROM_SHOULDER,
  SIDEWAYS_BODY_MAXIMUM_RATIO,
} from "../../constants";

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

export const validPoseOpenArmsPhoto = (pose) => {
  const result = { valid: false, score: pose.score };

  if (!validateGeneralScore(pose)) {
    result.valid = false;
    return result;
  }

  const leftShoulder = pose.keypoints[5];
  const rightShoulder = pose.keypoints[6];
  const leftHip = pose.keypoints[11];
  const rightHip = pose.keypoints[12];
  const leftWrist = pose.keypoints[9];
  const rightWrist = pose.keypoints[10];
  const hipWidth = leftHip.position.x - rightHip.position.x;
  const leftWristDistanceFromHip = leftWrist.position.x - leftHip.position.x;
  const rightWristDistanceFromHip = rightHip.position.x - rightWrist.position.x;
  const bodyHeight = leftHip.position.y - leftShoulder.position.y;
  const rightWristDistanceFromLeftShoulder =
    rightWrist.position.y - rightShoulder.position.y;
  const leftWristDistanceFromLeftShoulder =
    leftWrist.position.y - leftShoulder.position.y;
  // const leftWristDistanceFromLeftShoulder = getProportion(bodyHeight, leftWristDistanceFromHip)

  const isRightWristUnderChest =
    getProportion(bodyHeight, rightWristDistanceFromLeftShoulder) >=
    OPEN_ARMS_MAX_DISTANCE_FROM_SHOULDER;
  const isLeftWristUnderChest =
    getProportion(bodyHeight, leftWristDistanceFromLeftShoulder) >=
    OPEN_ARMS_MAX_DISTANCE_FROM_SHOULDER;
  const isLeftHandFromHipOk =
    getProportion(hipWidth, leftWristDistanceFromHip) >= MAX_NEAR_ARMS_DISTANCE;
  const isRightHandFromHipOk =
    getProportion(hipWidth, rightWristDistanceFromHip) >=
    MAX_NEAR_ARMS_DISTANCE;

  if (
    isRightWristUnderChest &&
    isLeftWristUnderChest &&
    isLeftHandFromHipOk &&
    isRightHandFromHipOk
  ) {
    result.valid = true;
  }

  return result;
};

const makePositive = (value) => {
  if (value < 0) {
    return value * -1;
  }

  return value;
};

export const validateSidePhoto = (pose) => {
  const result = { valid: false, score: pose.score };

  const leftShoulder = pose.keypoints[5];
  const rightShoulder = pose.keypoints[6];
  const leftHip = pose.keypoints[11];
  const rightHip = pose.keypoints[12];

  const upperbodyWidth = makePositive(
    leftShoulder.position.x - rightShoulder.position.x
  );
  const lowerBodyWidth = makePositive(leftHip.position.x - rightHip.position.x);
  const averageTrunkWidth = (upperbodyWidth + lowerBodyWidth) / 2;
  const bodyHeight = leftHip.position.y - leftShoulder.position.y;

  // console.log({
  //   upperbodyWidth: upperbodyWidth,
  //   lowerBodyWidth: lowerBodyWidth,
  //   averageTrunkWidth: averageTrunkWidth,
  //   bodyHeight: bodyHeight,
  // });

  if (bodyHeight / averageTrunkWidth / 100 <= SIDEWAYS_BODY_MAXIMUM_RATIO) {
    result.valid = true;
  }

  return result;
};
