import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs-backend-webgl";

import { ImageSlots } from "./components/ImageSlot";
import { ImageStatus } from "./components/ImageStatus";
import { Timer } from "./components/Timer";
import { MINIMUM_SCORE } from "./constants";

import "./global.css";

const App = () => {
  const webcamRef = useRef(null);

  const [isValidating, setIsValidating] = useState(true);
  const [slotA, setSlotA] = useState("https://via.placeholder.com/150&text=1");
  const [slotB, setSlotB] = useState("https://via.placeholder.com/150&text=2");
  const [slotC, setSlotC] = useState(undefined);
  const [timer, setTimer] = useState(0);

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

  const detectWebcamFeed = async (posenetModel) => {
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

      if (pose.score < MINIMUM_SCORE) {
        console.error(`LOW SCORE (UNDER ${MINIMUM_SCORE})`);
        setIsValidating(true);
        setTimer(false);
        return;
      }

      console.log(pose);
      setIsValidating(false);
      setTimer(true);
    }
  };

  const runPosenet = async () => {
    try {
      const posenetModel = await posenet.load({
        inputResolution: { width: 640, height: 480 },
        scale: 0.8,
      });

      setInterval(() => {
        detectWebcamFeed(posenetModel);
      }, 1000);
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

  return (
    <>
      <ImageSlots firstSlot={slotA} secondSlot={slotB} thirdSlot={slotC} />
      {!isValidating && timer && <Timer />}
      {isValidating && !timer && <ImageStatus pose="A" />}
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
