/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const [poseValid, setPoseValid] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'enviroment'>('user')
  const [countCameras, setCountCameras] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)

  const validatePose = useCallback(async (detector: poseDetection.PoseDetector) => {
    const video = videoRef.current

    if (!video) return

    video.width = video.videoWidth
    video.height = video.videoHeight

    const poses = await detector.estimatePoses(video)
    if (!poses.length) return

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
      setPoseValid(false)
      return
    }

    if (rightElbowAngle < RIGHT_ELBOW_ANGLE_MIN_LIMIT || rightElbowAngle > RIGHT_ELBOW_ANGLE_MAX_LIMIT) {
      setPoseValid(false)
      return
    }

    if (leftShoulderAngle < LEFT_SHOULDER_ANGLE_MIN_LIMIT || leftShoulderAngle > LEFT_SHOULDER_ANGLE_MAX_LIMIT) {
      setPoseValid(false)
      return
    }

    if (leftKneeAngle < LEFT_KNEE_ANGLE_MIN_LIMIT || leftKneeAngle > LEFT_KNEE_ANGLE_MAX_LIMIT) {
      setPoseValid(false)
      return
    }

    if (rightKneeAngle < RIGHT_KNEE_ANGLE_MIN_LIMIT || rightKneeAngle > RIGHT_KNEE_ANGLE_MAX_LIMIT) {
      setPoseValid(false)
      return
    }

    setPoseValid(true)
  }, [])

  const runPoseNet = useCallback(async () => {
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig)

    setInterval(() => {
      validatePose(detector)
    }, 1000)
  }, [validatePose])

  const getCameras = useCallback(async () => {
    const mediaDeviceInfo = await navigator.mediaDevices.enumerateDevices()
    const { length } = mediaDeviceInfo.filter(({ kind }) => kind === 'videoinput')

    setCountCameras(length)
  }, [])

  const initializeCamera = useCallback(async () => {
    await getCameras()

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode,
        width: { ideal: 1920 },
        height: { ideal: 1920 },
      },
    })

    if (!videoRef.current) return

    videoRef.current.srcObject = stream

    playVideo(videoRef.current)

    runPoseNet()
  }, [facingMode, getCameras, runPoseNet])

  const handleSwitchCamera = useCallback(() => {
    if (videoRef.current) setFacingMode(oldFacingMode => (oldFacingMode === 'user' ? 'enviroment' : 'user'))
  }, [])

  useEffect(() => {
    initializeCamera()
  }, [initializeCamera, facingMode])

  return (
    <>
      <div className="container">
        <div className="pose-status-container">
          <h1 className="pose-status" style={{ color: poseValid ? 'white' : 'white' }}>
            {poseValid ? 'Pose válida 😎' : 'Pose inválida 🤬'}
          </h1>
        </div>

        <video id="camera" ref={videoRef} autoPlay playsInline />
        {countCameras > 1 && (
          <div className="switch-camera-container">
            <button className="switch-camera" onClick={handleSwitchCamera}>
              VIRAR CAMERA 🔄
            </button>
          </div>
        )}
      </div>
    </>
  )
}
