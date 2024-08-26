import React from "react";
import styles from "./card.module.scss";
import Divider from "@mui/material/Divider";

const Card = ({ step, title, description, completed, status, onClick }) => {
  const message = step > 1 ? `You need to Complete Step ${step - 1}` : "";

  const stepTextClass = step == 1 ? "" : styles.lightText;

  return (
    <div className={styles.card}>
      {message && <div className={styles.message}>{message}</div>}
      <div className={styles.cardItem} onClick={onClick}>
        <p className={`${styles.steps} ${stepTextClass}`}>Step {step}</p>
        <div
          className={`${styles.cardCommonTitleDescription} ${stepTextClass}`}
        >
          <h2 className={`${styles.cardTitle} ${stepTextClass}`}>{title}</h2>
          <p className={`${styles.cardDescription} ${stepTextClass}`}>
            {description}
          </p>
        </div>
        <div className={`${styles.cardCompleteStatus} ${stepTextClass}`}>
          <h2 className={`${styles.cardStatus} ${stepTextClass}`}>
            {completed} Completed
          </h2>
          <button className={`${styles.cardButton} ${stepTextClass}`}>
            {status}
          </button>
        </div>
      </div>
      {/* Popup message */}
      <div className={styles.popupMessage}>Click to start</div>
      <Divider />
    </div>
  );
};

export default Card;
