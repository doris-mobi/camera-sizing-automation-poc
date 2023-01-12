/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as poseDetection from '@tensorflow-models/pose-detection'
import * as tf from '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'

import './styles.css'

import { playVideo } from './playVideo'

import { PoseValidation } from '../../helpers/pose-validation'

const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }

const poseValidation = new PoseValidation()

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

    setPoseValid(poseValidation.validatePose('FRONT_WITH_UP_ARMS', poses[0]))
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
