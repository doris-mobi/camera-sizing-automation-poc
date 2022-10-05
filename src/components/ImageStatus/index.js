import styles from "./styles.module.css";

const poseMap = {
  A: {
    text: "Fique de frente e braços abaixados",
    image: "https://i.imgur.com/0uuHLr1.png",
  },
  B: {
    text: "Fique de lado e braços abaixados",
    image: "https://i.imgur.com/BPD1HoL.png",
  },
  C: {
    text: "Fique de frente e braços levantados",
    image: "https://i.imgur.com/VIBMZp3.png",
  },
};

export const ImageStatus = ({ pose }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.text}>{poseMap[pose].text}</p>
      <img className={styles.image} src={poseMap[pose].image} alt="" />
    </div>
  );
};
