import { useState, useRef } from "react";
import Webcam from "react-webcam";

import { ImageSlots } from "./components/ImageSlot";
import { ImageStatus } from "./components/ImageStatus";
import { Timer } from "./components/Timer";

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

  const toggleState = () => {
    setIsValidating(!isValidating);
    setTimer(!timer);
  };

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
