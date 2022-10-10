import { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";

import { ImageCounter } from "./components/ImageCounter";

import "./global.css";

const VALIDATION_INTERVAL = process.env.REACT_APP_VALIDATION_INTERVAL;

const App = () => {
  const webcamRef = useRef(null);
  const isMounted = useRef(false);
  const countRef = useRef(0);
  const [count, setCount] = useState(0);

  const captureImage = useCallback(async () => {
    const result = await webcamRef.current.getScreenshot();

    if (result) {
      countRef.current = countRef.current + 1;
      setCount(countRef.current);
    }
  }, [setCount]);

  const start = useCallback(() => {
    setInterval(() => {
      captureImage();
    }, VALIDATION_INTERVAL);
  }, [captureImage]);

  useEffect(() => {
    if (!isMounted.current) {
      console.log("TIMEOUT:", VALIDATION_INTERVAL);

      isMounted.current = true;
      start();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ImageCounter count={count} />
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
