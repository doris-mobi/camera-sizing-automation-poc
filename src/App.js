import { useState } from "react";

import { ImageSlots } from "./components/ImageSlot";
import { ImageStatus } from "./components/ImageStatus";
import { Timer } from "./components/Timer";

import "./global.css";

const App = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [timer, setTimer] = useState(0);

  const toggleState = () => {
    setIsValidating(!isValidating);
    setTimer(!timer);
  };

  return (
    <>
      <ImageSlots
        firstSlot="https://via.placeholder.com/150&text=1"
        secondSlot="https://via.placeholder.com/150&text=2"
        // thirdSlot="https://via.placeholder.com/150&text=3"
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
