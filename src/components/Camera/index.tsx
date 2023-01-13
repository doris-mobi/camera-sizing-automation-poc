/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { ChangeEvent, ChangeEventHandler, EventHandler, useCallback, useEffect, useRef, useState } from 'react'
import * as poseDetection from '@tensorflow-models/pose-detection'
import * as tf from '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'

import './styles.css'

import { playVideo } from './playVideo'

import { PoseValidation } from '../../helpers/pose-validation'
import { Pose, PoseType } from '../../helpers/pose-validation/types'
import { MovenetDetector } from '../../helpers/movenet-detector'

const poseValidation = new PoseValidation()
const movenetDetector = new MovenetDetector()

export const Camera: React.FC = () => {
  const [poseValid, setPoseValid] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'enviroment'>('user')
  const [selectedPose, setSelectedPose] = useState<PoseType>('FRONT')

  const mountedRef = useRef(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream>()
  const intervalRef = useRef<NodeJS.Timer>()
  const detectorRef = useRef<poseDetection.PoseDetector>()

  const validatePose = useCallback(async () => {
    const video = videoRef.current
    const detector = detectorRef.current

    if (!video || !detector) return

    video.width = video.videoWidth
    video.height = video.videoHeight

    const poses = await detector.estimatePoses(video)

    if (!poses.length) return

    setPoseValid(poseValidation.validatePose(poses[0]))
  }, [])

  const runPoseNet = useCallback(async () => {
    intervalRef.current = setInterval(() => {
      validatePose()
    }, 1000)
  }, [validatePose])

  const initializeCamera = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode,
        width: { ideal: 1920 },
        height: { ideal: 1920 },
      },
    })

    streamRef.current = stream

    if (!videoRef.current) return

    videoRef.current.srcObject = streamRef.current

    playVideo(videoRef.current)

    runPoseNet()
  }, [facingMode, runPoseNet])

  const handleChangePose = useCallback((value: PoseType) => {
    poseValidation.poseType = value
    setSelectedPose(value)
  }, [])

  useEffect(() => {
    if (mountedRef.current) return

    mountedRef.current = true

    initializeCamera()

    movenetDetector.initialize().then(() => {
      return (detectorRef.current = movenetDetector.poseDetector!)
    })
  }, [initializeCamera, selectedPose])

  return (
    <>
      <div className="container">
        <div className="pose-status-container">
          <h1 className="pose-status" style={{ color: poseValid ? 'white' : 'white' }}>
            {poseValid ? 'Pose válida 😎' : 'Pose inválida 🤬'}
          </h1>
        </div>

        <video id="camera" ref={videoRef} autoPlay playsInline />
        <div className="switch-pose-container">
          <select
            name="change-pose"
            id="change-pose"
            onChange={event => handleChangePose(event.target.value as PoseType)}
          >
            <option value="FRONT">Front Pose</option>
            <option value="FRONT_WITH_UP_ARMS">Up Arms Pose</option>
            <option value="SIDE">Side Pose</option>
          </select>
        </div>
      </div>
    </>
  )
}
