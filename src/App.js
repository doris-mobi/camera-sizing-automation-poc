import { useState } from "react";

import { ImageSlots } from "./components/ImageSlot";
import { ImageStatus } from "./components/ImageStatus";
import { Timer } from "./components/Timer";

import "./global.css";

const App = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [firstSlotImage, setFirstSlotImage] = useState(
    "https://via.placeholder.com/150&text=1"
  );
  const [secondSlotImage, setSecondSlotImage] = useState(
    "https://via.placeholder.com/150&text=2"
  );
  const [thirdSlotImage, setThirdSlotImage] = useState(undefined);

  const [timer, setTimer] = useState(0);

  const setImageToSlot = (slot, image) => {
    if (slot === 1) {
      setFirstSlotImage(image);
      return;
    }

    if (slot === 2) {
      setSecondSlotImage(image);
      return;
    }

    setThirdSlotImage(image);
  };

  const toggleState = () => {
    setIsValidating(!isValidating);
    setTimer(!timer);
  };

  return (
    <>
      <ImageSlots
        firstSlot={firstSlotImage}
        secondSlot={secondSlotImage}
        thirdSlot={thirdSlotImage}
      />
      {!isValidating && timer && <Timer />}
      {isValidating && !timer && <ImageStatus pose="A" />}
      <button
        onClick={toggleState}
        style={{ position: "absolute", right: "2vmin", bottom: "2vmin" }}
      >
        TOGGLE STATE
      </button>
    </>
  );
};

export default App;
