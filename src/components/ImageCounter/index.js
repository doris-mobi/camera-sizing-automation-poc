import styles from "./styles.module.css";

export const ImageCounter = ({ count }) => (
  <span className={styles.text}>{count}</span>
);
