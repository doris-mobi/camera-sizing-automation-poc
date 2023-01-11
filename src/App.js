import React, { useRef } from "react";
// eslint-disable-next-line no-unused-vars
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";

import "./App.css";

const poseLandmarks = {
  NOSE: 0,
  LEFT_EYE: 1,
  RIGHT_EYE: 2,
  LEFT_EAR: 3,
  RIGHT_EAR: 4,
  LEFT_SHOULDER: 5,
  RIGHT_SHOULDER: 6,
  LEFT_ELBOW: 7,
  RIGHT_ELBOW: 8,
  LEFT_WRIST: 9,
  RIGHT_WRIST: 10,
  LEFT_HIP: 11,
  RIGHT_HIP: 12,
  LEFT_KNEE: 13,
  RIGHT_KNEE: 14,
  LEFT_ANKLE: 15,
  RIGHT_ANKLE: 16,
};

const LEFT_KNEE_ANGLE_MIN_LIMIT = 170;
const LEFT_KNEE_ANGLE_MAX_LIMIT = 195;

const RIGHT_KNEE_ANGLE_MIN_LIMIT = 140;
const RIGHT_KNEE_ANGLE_MAX_LIMIT = 195;

const LEFT_SHOULDER_ANGLE_MIN_LIMIT = 10;
const LEFT_SHOULDER_ANGLE_MAX_LIMIT = 35;

const RIGHT_ELBOW_ANGLE_MIN_LIMIT = 158;
const RIGHT_ELBOW_ANGLE_MAX_LIMIT = 195;

const LEFT_ELBOW_ANGLE_MIN_LIMIT = 170;
const LEFT_ELBOW_ANGLE_MAX_LIMIT = 195;

function App() {
  const webcamRef = useRef(null);

  const toDegrees = (angle) => {
    return angle * (180 / Math.PI);
  };

  // eslint-disable-next-line no-unused-vars
  const calculateAngle = (landmark1, landmark2, landmark3) => {
    // Get the required landmarks coordinates.
    const { x: x1, y: y1 } = landmark1;
    const { x: x2, y: y2 } = landmark2;
    const { x: x3, y: y3 } = landmark3;

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

  //  Load posenet
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    //
    setInterval(() => {
      detect(net);
    }, 1000);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
      const pose = await net.estimateSinglePose(video);

      const leftElbowAngle = calculateAngle(
        pose.keypoints[poseLandmarks.LEFT_SHOULDER].position,
        pose.keypoints[poseLandmarks.LEFT_ELBOW].position,
        pose.keypoints[poseLandmarks.LEFT_WRIST].position
      );

      const rightElbowAngle = calculateAngle(
        pose.keypoints[poseLandmarks.RIGHT_SHOULDER].position,
        pose.keypoints[poseLandmarks.RIGHT_ELBOW].position,
        pose.keypoints[poseLandmarks.RIGHT_WRIST].position
      );

      const leftShoulderAngle = calculateAngle(
        pose.keypoints[poseLandmarks.LEFT_ELBOW].position,
        pose.keypoints[poseLandmarks.LEFT_SHOULDER].position,
        pose.keypoints[poseLandmarks.LEFT_HIP].position
      );

      const leftKneeAngle = calculateAngle(
        pose.keypoints[poseLandmarks.LEFT_HIP].position,
        pose.keypoints[poseLandmarks.LEFT_KNEE].position,
        pose.keypoints[poseLandmarks.LEFT_ANKLE].position
      );

      const rightKneeAngle = calculateAngle(
        pose.keypoints[poseLandmarks.RIGHT_HIP].position,
        pose.keypoints[poseLandmarks.RIGHT_KNEE].position,
        pose.keypoints[poseLandmarks.RIGHT_ANKLE].position
      );

      if (
        leftElbowAngle < LEFT_ELBOW_ANGLE_MIN_LIMIT ||
        leftElbowAngle > LEFT_ELBOW_ANGLE_MAX_LIMIT
      ) {
        console.log("arms very close");
      }

      if (
        rightElbowAngle < RIGHT_ELBOW_ANGLE_MIN_LIMIT ||
        rightElbowAngle > RIGHT_ELBOW_ANGLE_MAX_LIMIT
      ) {
        console.log("arms too far apart");
      }

      if (
        leftShoulderAngle < LEFT_SHOULDER_ANGLE_MIN_LIMIT ||
        leftShoulderAngle > LEFT_SHOULDER_ANGLE_MAX_LIMIT
      ) {
        console.log("your shoulders should be straight");
      }

      if (
        leftKneeAngle < LEFT_KNEE_ANGLE_MIN_LIMIT ||
        leftKneeAngle > LEFT_KNEE_ANGLE_MAX_LIMIT
      ) {
        console.log("legs too far apart");
      }

      if (
        rightKneeAngle < RIGHT_KNEE_ANGLE_MIN_LIMIT ||
        rightKneeAngle > RIGHT_KNEE_ANGLE_MAX_LIMIT
      ) {
        console.log("legs very close");
      }
    }
  };

  runPosenet();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
