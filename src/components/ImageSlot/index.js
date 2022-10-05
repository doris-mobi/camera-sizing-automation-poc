import styles from "./styles.module.css";

export const ImageSlots = ({ firstSlot, secondSlot, thirdSlot }) => {
  return (
    <div className={styles.list}>
      {firstSlot ? (
        <img className={styles.image} src={firstSlot} alt="" />
      ) : (
        <span className={styles.blankSlot}>1</span>
      )}
      {secondSlot ? (
        <img className={styles.image} src={secondSlot} alt="" />
      ) : (
        <span className={styles.blankSlot}>2</span>
      )}
      {thirdSlot ? (
        <img className={styles.image} src={thirdSlot} alt="" />
      ) : (
        <span className={styles.blankSlot}>3</span>
      )}
    </div>
  );
};
