import { poseLandmarks } from '../../lib/pose-detection/constants'

import * as CONSTANTS from './constants'

import { PoseType, Pose, Keypoint } from './types'

export class PoseValidation {
  private _pose: Pose
  private _poseType: PoseType = 'FRONT'

  constructor() {
    this._pose = { keypoints: [] }
  }

  set poseType(value: PoseType) {
    this._poseType = value
  }


  validatePose(pose: Pose) {
    this._pose = pose

    const poseMap = {
      FRONT: () => this._validateFrontPose(),
      FRONT_WITH_UP_ARMS: () => this._validateFrontWithUpArmsPose(),
      SIDE: () => this._validateSidePose(),
    }

    return poseMap[this._poseType]()
  }

  private _toDegrees(angle: number) {
    return angle * (180 / Math.PI)
  }

  private _calculateAngle(keypoint1: Keypoint, keypoint2: Keypoint, keypoint3: Keypoint) {
    const { x: x1, y: y1 } = keypoint1
    const { x: x2, y: y2 } = keypoint2
    const { x: x3, y: y3 } = keypoint3

    let angle = this._toDegrees(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y1 - y2, x1 - x2))

    if (angle < 0) {
      angle += 360
    }

    return angle
  }

  private _calculateDistance(keypoint1: Keypoint, keypoint2: Keypoint) {
    return Math.sqrt(Math.pow(keypoint1.x - keypoint2.x, 2) + Math.pow(keypoint1.y - keypoint2.y, 2))
  }

  private _checkIfDistanceBetweenWristAndHipIsValid() {
    const distanceFromWristAndHipLeft = this._calculateDistance(
      this._pose.keypoints[poseLandmarks.LEFT_WRIST],
      this._pose.keypoints[poseLandmarks.LEFT_HIP],
    )

    const distanceFromWristAndHipRight = this._calculateDistance(
      this._pose.keypoints[poseLandmarks.RIGHT_WRIST],
      this._pose.keypoints[poseLandmarks.RIGHT_HIP],
    )

    if (
      distanceFromWristAndHipLeft < CONSTANTS.DISTANCE_FROM_WRIST_AND_HIP_MIN_LIMIT ||
      distanceFromWristAndHipLeft > CONSTANTS.DISTANCE_FROM_WRIST_AND_HIP_MAX_LIMIT ||
      distanceFromWristAndHipRight < CONSTANTS.DISTANCE_FROM_WRIST_AND_HIP_MIN_LIMIT ||
      distanceFromWristAndHipRight > CONSTANTS.DISTANCE_FROM_WRIST_AND_HIP_MAX_LIMIT
    ) {
      return false
    }

    return true
  }

  private _checkIfDistanceBetweenArmsAndHipIsValid() {
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
      leftArmsDistanceFromHip > CONSTANTS.DISTANCE_ARMS_MAX_LIMIT ||
      rightArmsDistanceFromHip < CONSTANTS.DISTANCE_ARMS_MIN_LIMIT ||
      rightArmsDistanceFromHip > CONSTANTS.DISTANCE_ARMS_MAX_LIMIT
    ) {
      return false
    }

    return true
  }

  private _checkIfDistanceFromShouldersIsValid() {
    const distanceFromShoulders = this._calculateDistance(
      this._pose.keypoints[poseLandmarks.LEFT_SHOULDER],
      this._pose.keypoints[poseLandmarks.RIGHT_SHOULDER],
    )

    if (
      distanceFromShoulders < CONSTANTS.DISTANCE_SHOULDERS_MIN_LIMIT ||
      distanceFromShoulders > CONSTANTS.DISTANCE_SHOULDERS_MAX_LIMIT
    ) {
      return false
    }

    return true
  }

  private _checkIfDistanceFromHipsIsValid() {
    const distanceFromHips = this._calculateDistance(
      this._pose.keypoints[poseLandmarks.LEFT_HIP],
      this._pose.keypoints[poseLandmarks.RIGHT_HIP],
    )

    if (distanceFromHips < CONSTANTS.DISTANCE_HIPS_MIN_LIMIT || distanceFromHips > CONSTANTS.DISTANCE_HIPS_MAX_LIMIT) {
      return false
    }

    return true
  }

  private _checkIfDistanceFromKneesIsValid() {
    const distanceFromKnees = this._calculateDistance(
      this._pose.keypoints[poseLandmarks.LEFT_KNEE],
      this._pose.keypoints[poseLandmarks.RIGHT_KNEE],
    )

    if (
      distanceFromKnees < CONSTANTS.DISTANCE_KNEES_MIN_LIMIT ||
      distanceFromKnees > CONSTANTS.DISTANCE_KNEES_MAX_LIMIT
    ) {
      return false
    }

    return true
  }

  private _checkIfDistanceFromAnklesIsValid() {
    const distanceFromAnkles = this._calculateDistance(
      this._pose.keypoints[poseLandmarks.LEFT_ANKLE],
      this._pose.keypoints[poseLandmarks.RIGHT_ANKLE],
    )

    if (
      distanceFromAnkles < CONSTANTS.DISTANCE_ANKLES_MIN_LIMIT ||
      distanceFromAnkles > CONSTANTS.DISTANCE_ANKLES_MAX_LIMIT
    ) {
      return false
    }

    return true
  }

  private _checkIfLeftElbowAngleIsValid() {
    const leftElbowAngle = this._calculateAngle(
      this._pose.keypoints[poseLandmarks.LEFT_SHOULDER],
      this._pose.keypoints[poseLandmarks.LEFT_ELBOW],
      this._pose.keypoints[poseLandmarks.LEFT_WRIST],
    )

    if (
      leftElbowAngle < CONSTANTS.LEFT_ELBOW_ANGLE_MIN_LIMIT ||
      leftElbowAngle > CONSTANTS.LEFT_ELBOW_ANGLE_MAX_LIMIT
    ) {
      return false
    }

    return true
  }

  private _checkIfRightElbowAngleIsValid() {
    const rightElbowAngle = this._calculateAngle(
      this._pose.keypoints[poseLandmarks.RIGHT_SHOULDER],
      this._pose.keypoints[poseLandmarks.RIGHT_ELBOW],
      this._pose.keypoints[poseLandmarks.RIGHT_WRIST],
    )

    if (
      rightElbowAngle < CONSTANTS.RIGHT_ELBOW_ANGLE_MIN_LIMIT ||
      rightElbowAngle > CONSTANTS.RIGHT_ELBOW_ANGLE_MAX_LIMIT
    ) {
      return false
    }

    return true
  }

  private _checkIfLeftShoulderAngleIsValid() {
    const leftShoulderAngle = this._calculateAngle(
      this._pose.keypoints[poseLandmarks.LEFT_ELBOW],
      this._pose.keypoints[poseLandmarks.LEFT_SHOULDER],
      this._pose.keypoints[poseLandmarks.LEFT_HIP],
    )

    if (
      leftShoulderAngle < CONSTANTS.LEFT_SHOULDER_ANGLE_MIN_LIMIT ||
      leftShoulderAngle > CONSTANTS.LEFT_SHOULDER_ANGLE_MAX_LIMIT
    ) {
      return false
    }

    return true
  }

  private _checkIfLeftKneeAngleIsValid() {
    const leftKneeAngle = this._calculateAngle(
      this._pose.keypoints[poseLandmarks.LEFT_HIP],
      this._pose.keypoints[poseLandmarks.LEFT_KNEE],
      this._pose.keypoints[poseLandmarks.LEFT_ANKLE],
    )

    if (leftKneeAngle < CONSTANTS.LEFT_KNEE_ANGLE_MIN_LIMIT || leftKneeAngle > CONSTANTS.LEFT_KNEE_ANGLE_MAX_LIMIT) {
      return false
    }

    return true
  }

  private _checkIfRightKneeAngleIsValid() {
    const rightKneeAngle = this._calculateAngle(
      this._pose.keypoints[poseLandmarks.RIGHT_HIP],
      this._pose.keypoints[poseLandmarks.RIGHT_KNEE],
      this._pose.keypoints[poseLandmarks.RIGHT_ANKLE],
    )

    if (
      rightKneeAngle < CONSTANTS.RIGHT_KNEE_ANGLE_MIN_LIMIT ||
      rightKneeAngle > CONSTANTS.RIGHT_KNEE_ANGLE_MAX_LIMIT
    ) {
      return false
    }

    return true
  }

  private _validateFrontPose() {
    if (
      !this._checkIfLeftElbowAngleIsValid() ||
      !this._checkIfRightElbowAngleIsValid() ||
      !this._checkIfLeftShoulderAngleIsValid() ||
      !this._checkIfLeftKneeAngleIsValid() ||
      !this._checkIfRightKneeAngleIsValid()
    ) {
      return false
    }

    return true
  }

  private _validateFrontWithUpArmsPose() {
    if (
      // !this._checkIfLeftElbowAngleIsValid() ||
      // !this._checkIfRightElbowAngleIsValid() ||
      // !this._checkIfLeftShoulderAngleIsValid() ||
      !this._checkIfLeftKneeAngleIsValid() ||
      !this._checkIfRightKneeAngleIsValid() ||
      !this._checkIfDistanceBetweenArmsAndHipIsValid()
    ) {
      return false
    }

    return true
  }

  private _validateSidePose() {
    if (
      !this._checkIfDistanceBetweenWristAndHipIsValid() ||
      !this._checkIfDistanceFromShouldersIsValid() ||
      !this._checkIfDistanceFromHipsIsValid() ||
      !this._checkIfDistanceFromKneesIsValid() ||
      !this._checkIfDistanceFromAnklesIsValid()
    ) {
      return false
    }

    return true
  }
}
