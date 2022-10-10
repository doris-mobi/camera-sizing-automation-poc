import { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs-backend-webgl";

import {
  validateHandsDownFrontPhoto,
  validPoseOpenArmsPhoto,
  validateSidePhoto,
} from "./utils/validatePose";
import { ImageSlots } from "./components/ImageSlot";
import { ImageStatus } from "./components/ImageStatus";
import { Timer } from "./components/Timer";

import "./global.css";

const DEBUG = false;
const VALIDATION_INTERVAL = 2000;
const positionMap = {
  A: "Front + Near Arms",
  B: "Sideways",
  C: "Front + Open Arms",
};

const App = () => {
  const webcamRef = useRef(null);

  const [isValidating, setIsValidating] = useState(true);
  const [slotA, setSlotA] = useState(undefined);
  const [slotB, setSlotB] = useState(undefined);
  const [slotC, setSlotC] = useState(undefined);
  const [timer, setTimer] = useState(0);
  const [currentPosition, setCurrentPosition] = useState("A");

  const [isTypeAValid, setIsTypeAValid] = useState(false);
  const [isTypeBValid, setIsTypeBValid] = useState(false);
  const [isTypeCValid, setIsTypeCValid] = useState(false);

  const captureImage = useCallback(() => {
    const base64Image = webcamRef.current.getScreenshot();
    return base64Image;
  }, [webcamRef]);

  const setImageToSlot = (slot, image) => {
    if (slot === 1) {
      setSlotA(image);
      return;
    }

    if (slot === 2) {
      setSlotB(image);
      return;
    }

    setSlotC(image);
  };

  const validateWebcamFeed = async (posenetModel) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      video.width = videoWidth;
      video.height = videoHeight;

      const pose = await posenetModel.estimateSinglePose(video);

      console.log("");
      console.log({
        position: positionMap["A"],
        valid: validateHandsDownFrontPhoto(pose).valid,
      });
      setIsTypeAValid(validateHandsDownFrontPhoto(pose).valid);
      console.log({
        position: positionMap["B"],
        valid: validateSidePhoto(pose).valid,
      });
      setIsTypeBValid(validateSidePhoto(pose).valid);
      console.log({
        position: positionMap["C"],
        valid: validPoseOpenArmsPhoto(pose).valid,
      });
      setIsTypeCValid(validPoseOpenArmsPhoto(pose).valid);
      console.log("");

      // if (currentPosition === "A" && !validateHandsDownFrontPhoto(pose).valid) {

      //   setIsValidating(true);
      //   setTimer(false);

      //   const photo = captureImage();
      //   setSlotA(photo);

      //   return;
      // }

      // if (currentPosition === "B" && !validPoseOpenArmsPhoto(pose).valid) {
      //   setIsValidating(true);
      //   setTimer(false);

      //   const photo = captureImage();
      //   setSlotA(photo);

      //   return;
      // }
    }
  };

  const runPosenet = async () => {
    try {
      const posenetModel = await posenet.load({
        inputResolution: { width: 640, height: 480 },
        scale: 0.8,
      });

      setInterval(() => {
        validateWebcamFeed(posenetModel);
      }, VALIDATION_INTERVAL);
    } catch (error) {
      console.log({ error });
    }
  };

  const toggleState = () => {
    setIsValidating(!isValidating);
    setTimer(!timer);
  };

  useEffect(() => {
    runPosenet();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimer(false);
    setIsValidating(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition]);

  return (
    <>
      <span
        style={{
          padding: "10px",
          backgroundColor: "black",
          color: "yellow",
          fontSize: "10px",
          zIndex: 3,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {positionMap["A"]}: {isTypeAValid ? "✅ " : "❌"}
        <br />
        {positionMap["B"]}: {isTypeBValid ? "✅ " : "❌"}
        <br />
        {positionMap["C"]}: {isTypeCValid ? "✅ " : "❌"}
      </span>
      {/* <ImageSlots firstSlot={slotA} secondSlot={slotB} thirdSlot={slotC} /> */}
      {/* {!isValidating && timer && <Timer />} */}
      {/* {isValidating && !timer && <ImageStatus pose="A" />} */}
      {DEBUG && (
        <button
          onClick={toggleState}
          style={{
            position: "absolute",
            right: "2vmin",
            bottom: "2vmin",
            zIndex: 2,
          }}
        >
          TOGGLE STATE
        </button>
      )}
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 1,
          width: "100%",
          height: "100%",
        }}
      />
    </>
  );
};

export default App;
