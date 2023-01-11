/* eslint-disable jsx-a11y/media-has-caption */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as poseDetection from '@tensorflow-models/pose-detection'
import * as tf from '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'

import './styles.css'

import { playVideo } from './playVideo'
import {
  LEFT_ELBOW_ANGLE_MAX_LIMIT,
  LEFT_ELBOW_ANGLE_MIN_LIMIT,
  LEFT_KNEE_ANGLE_MAX_LIMIT,
  LEFT_KNEE_ANGLE_MIN_LIMIT,
  LEFT_SHOULDER_ANGLE_MAX_LIMIT,
  LEFT_SHOULDER_ANGLE_MIN_LIMIT,
  poseLandmarks,
  RIGHT_ELBOW_ANGLE_MAX_LIMIT,
  RIGHT_ELBOW_ANGLE_MIN_LIMIT,
  RIGHT_KNEE_ANGLE_MAX_LIMIT,
  RIGHT_KNEE_ANGLE_MIN_LIMIT,
} from '../../lib/pose-detection/constants'
import { calculateAngle } from '../../lib/pose-detection/utils'

const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }

export const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [poseValid, setPoseValid] = useState(false)

  const validatePose = useCallback(async (detector: poseDetection.PoseDetector) => {
    const video = videoRef.current

    if (!video) return

    const poses = await detector.estimatePoses(video)
    const pose = poses[0]

    const leftElbowAngle = calculateAngle(
      pose.keypoints[poseLandmarks.LEFT_SHOULDER],
      pose.keypoints[poseLandmarks.LEFT_ELBOW],
      pose.keypoints[poseLandmarks.LEFT_WRIST],
    )

    const rightElbowAngle = calculateAngle(
      pose.keypoints[poseLandmarks.RIGHT_SHOULDER],
      pose.keypoints[poseLandmarks.RIGHT_ELBOW],
      pose.keypoints[poseLandmarks.RIGHT_WRIST],
    )

    const leftShoulderAngle = calculateAngle(
      pose.keypoints[poseLandmarks.LEFT_ELBOW],
      pose.keypoints[poseLandmarks.LEFT_SHOULDER],
      pose.keypoints[poseLandmarks.LEFT_HIP],
    )

    const leftKneeAngle = calculateAngle(
      pose.keypoints[poseLandmarks.LEFT_HIP],
      pose.keypoints[poseLandmarks.LEFT_KNEE],
      pose.keypoints[poseLandmarks.LEFT_ANKLE],
    )

    const rightKneeAngle = calculateAngle(
      pose.keypoints[poseLandmarks.RIGHT_HIP],
      pose.keypoints[poseLandmarks.RIGHT_KNEE],
      pose.keypoints[poseLandmarks.RIGHT_ANKLE],
    )

    if (leftElbowAngle < LEFT_ELBOW_ANGLE_MIN_LIMIT || leftElbowAngle > LEFT_ELBOW_ANGLE_MAX_LIMIT) {
      console.log('arms very close')
      setPoseValid(false)
      return
    }

    if (rightElbowAngle < RIGHT_ELBOW_ANGLE_MIN_LIMIT || rightElbowAngle > RIGHT_ELBOW_ANGLE_MAX_LIMIT) {
      console.log('arms too far apart')
      setPoseValid(false)
      return
    }

    if (leftShoulderAngle < LEFT_SHOULDER_ANGLE_MIN_LIMIT || leftShoulderAngle > LEFT_SHOULDER_ANGLE_MAX_LIMIT) {
      console.log('your shoulders should be straight')
      setPoseValid(false)
      return
    }

    if (leftKneeAngle < LEFT_KNEE_ANGLE_MIN_LIMIT || leftKneeAngle > LEFT_KNEE_ANGLE_MAX_LIMIT) {
      console.log('legs too far apart')
      setPoseValid(false)
      return
    }

    if (rightKneeAngle < RIGHT_KNEE_ANGLE_MIN_LIMIT || rightKneeAngle > RIGHT_KNEE_ANGLE_MAX_LIMIT) {
      console.log('legs very close')
      setPoseValid(false)
      return
    }

    setPoseValid(true)
  }, [])

  const runPoseNet = useCallback(async () => {
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig)

    setInterval(() => {
      validatePose(detector)
    }, 1000 / 30)
  }, [validatePose])

  const initializeCamera = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })

    if (!videoRef.current) return

    videoRef.current.srcObject = stream

    playVideo(videoRef.current)

    runPoseNet()
  }, [runPoseNet])

  useEffect(() => {
    initializeCamera()
  }, [initializeCamera])

  return (
    <>
      <h1 className="pose-status" style={{ color: poseValid ? 'green' : 'red' }}>
        {poseValid ? '😎 POSE VALIDA CARAI 😎' : '⚠️ POSE INVALIDA ⚠️'}
      </h1>
      <video width={1024} height={768} ref={videoRef} />
    </>
  )
}
