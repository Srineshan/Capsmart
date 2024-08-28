import React from "react";
import style from "./../index.module.scss";

export const ReferenceListActionButton = ({ button1, button2 }) => {
  return (
    <div className={style.actionsFooter}>
      <button className={`${style.actionsFooterButton} ${style.textColurBlue}`}>
        {button1}
      </button>
      <button
        className={`${style.actionsFooterButton}  ${style.backgroundBlue} ${style.padding20} ${style.textColorWhite}`}
      >
        {button2}
      </button>
    </div>
  );
};
