import { poseLandmarks } from '../../lib/pose-detection/constants'

import * as CONSTANTS from './constants'

import { PoseType, Pose, Keypoint } from './types'

export class PoseValidation {
  private _pose: Pose

  constructor() {
    this._pose = { keypoints: [] }
  }

  validatePose(poseType: PoseType, pose: Pose) {
    this._pose = pose

    const poseMap = {
      FRONT: () => this._validateFrontPose(),
      FRONT_WITH_UP_ARMS: () => this._validateFrontWithUpArmsPose(),
      SIDE: () => this._validateSidePose(),
    }

    return poseMap[poseType]()
  }

  private _toDegrees(angle: number) {
    return angle * (180 / Math.PI)
  }

  private _calculateAngle(keypoint1: Keypoint, keypoint2: Keypoint, keypoint3: Keypoint) {
    // Get the required keypoints coordinates.
    const { x: x1, y: y1 } = keypoint1
    const { x: x2, y: y2 } = keypoint2
    const { x: x3, y: y3 } = keypoint3

    // Calculate the angle between the three points
    let angle = this._toDegrees(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y1 - y2, x1 - x2))

    // Check if the angle is less than zero.
    if (angle < 0) {
      // Add 360 to the found angle.
      angle += 360
    }

    return angle
  }

  private _calculateDistance(keypoint1: Keypoint, keypoint2: Keypoint) {
    return Math.sqrt(Math.pow(keypoint1.x - keypoint2.x, 2) + Math.pow(keypoint1.y - keypoint2.y, 2))
  }

  private _getLeftElbowAngle() {
    return this._calculateAngle(
      this._pose.keypoints[poseLandmarks.LEFT_SHOULDER],
      this._pose.keypoints[poseLandmarks.LEFT_ELBOW],
      this._pose.keypoints[poseLandmarks.LEFT_WRIST],
    )
  }

  private _getRightElbowAngle() {
    return this._calculateAngle(
      this._pose.keypoints[poseLandmarks.RIGHT_SHOULDER],
      this._pose.keypoints[poseLandmarks.RIGHT_ELBOW],
      this._pose.keypoints[poseLandmarks.RIGHT_WRIST],
    )
  }

  private _getLeftShoulderAngle() {
    return this._calculateAngle(
      this._pose.keypoints[poseLandmarks.LEFT_ELBOW],
      this._pose.keypoints[poseLandmarks.LEFT_SHOULDER],
      this._pose.keypoints[poseLandmarks.LEFT_HIP],
    )
  }

  private _getLeftKneeAngle() {
    return this._calculateAngle(
      this._pose.keypoints[poseLandmarks.LEFT_HIP],
      this._pose.keypoints[poseLandmarks.LEFT_KNEE],
      this._pose.keypoints[poseLandmarks.LEFT_ANKLE],
    )
  }

  private _getRightKneeAngle() {
    return this._calculateAngle(
      this._pose.keypoints[poseLandmarks.RIGHT_HIP],
      this._pose.keypoints[poseLandmarks.RIGHT_KNEE],
      this._pose.keypoints[poseLandmarks.RIGHT_ANKLE],
    )
  }

  private _validateFrontPose() {
    const leftElbowAngle = this._getLeftElbowAngle()
    const rightElbowAngle = this._getRightElbowAngle()
    const leftShoulderAngle = this._getLeftShoulderAngle()
    const leftKneeAngle = this._getLeftKneeAngle()
    const rightKneeAngle = this._getRightKneeAngle()

    if (
      leftElbowAngle < CONSTANTS.LEFT_ELBOW_ANGLE_MIN_LIMIT ||
      leftElbowAngle > CONSTANTS.LEFT_ELBOW_ANGLE_MAX_LIMIT
    ) {
      return false
    }

    if (
      rightElbowAngle < CONSTANTS.RIGHT_ELBOW_ANGLE_MIN_LIMIT ||
      rightElbowAngle > CONSTANTS.RIGHT_ELBOW_ANGLE_MAX_LIMIT
    ) {
      return false
    }

    if (
      leftShoulderAngle < CONSTANTS.LEFT_SHOULDER_ANGLE_MIN_LIMIT ||
      leftShoulderAngle > CONSTANTS.LEFT_SHOULDER_ANGLE_MAX_LIMIT
    ) {
      return false
    }

    if (leftKneeAngle < CONSTANTS.LEFT_KNEE_ANGLE_MIN_LIMIT || leftKneeAngle > CONSTANTS.LEFT_KNEE_ANGLE_MAX_LIMIT) {
      return false
    }

    if (
      rightKneeAngle < CONSTANTS.RIGHT_KNEE_ANGLE_MIN_LIMIT ||
      rightKneeAngle > CONSTANTS.RIGHT_KNEE_ANGLE_MAX_LIMIT
    ) {
      return false
    }

    return true
  }

  private _validateFrontWithUpArmsPose() {
    const leftElbowAngle = this._getLeftElbowAngle()
    const rightElbowAngle = this._getRightElbowAngle()
    const leftShoulderAngle = this._getLeftShoulderAngle()
    const leftKneeAngle = this._getLeftKneeAngle()
    const rightKneeAngle = this._getRightKneeAngle()

    const leftArmsDistanceFromHip = this._calculateDistance(
      this._pose.keypoints[poseLandmarks.LEFT_WRIST],
      this._pose.keypoints[poseLandmarks.LEFT_HIP],
    )
    const rightArmsDistanceFromHip = this._calculateDistance(
      this._pose.keypoints[poseLandmarks.RIGHT_WRIST],
      this._pose.keypoints[poseLandmarks.RIGHT_HIP],
    )

    if (
      leftArmsDistanceFromHip < CONSTANTS.DISTANCE_ARMS_MIN_LIMIT ||
      leftArmsDistanceFromHip > CONSTANTS.DISTANCE_ARMS_MAX_LIMIT
    ) {
      return false
    }

    if (
      rightArmsDistanceFromHip < CONSTANTS.DISTANCE_ARMS_MIN_LIMIT ||
      rightArmsDistanceFromHip > CONSTANTS.DISTANCE_ARMS_MAX_LIMIT
    ) {
      return false
    }

    if (
      leftElbowAngle < CONSTANTS.LEFT_ELBOW_ANGLE_MIN_LIMIT ||
      leftElbowAngle > CONSTANTS.LEFT_ELBOW_ANGLE_MAX_LIMIT
    ) {
      return false
    }

    if (
      rightElbowAngle < CONSTANTS.RIGHT_ELBOW_ANGLE_MIN_LIMIT ||
      rightElbowAngle > CONSTANTS.RIGHT_ELBOW_ANGLE_MAX_LIMIT
    ) {
      return false
    }

    if (
      leftShoulderAngle < CONSTANTS.LEFT_SHOULDER_ANGLE_MIN_LIMIT ||
      leftShoulderAngle > CONSTANTS.LEFT_SHOULDER_ANGLE_MAX_LIMIT
    ) {
      return false
    }

    if (leftKneeAngle < CONSTANTS.LEFT_KNEE_ANGLE_MIN_LIMIT || leftKneeAngle > CONSTANTS.LEFT_KNEE_ANGLE_MAX_LIMIT) {
      return false
    }

    if (
      rightKneeAngle < CONSTANTS.RIGHT_KNEE_ANGLE_MIN_LIMIT ||
      rightKneeAngle > CONSTANTS.RIGHT_KNEE_ANGLE_MAX_LIMIT
    ) {
      return false
    }

    return true
  }

  private _validateSidePose() {
    return false
  }
}
