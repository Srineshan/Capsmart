import React from "react";
import style from "./../index.module.scss";

export const ReferenceListActionButton = ({
  button1,
  button2,
  onButton1Click, // handler for "Save In-Progress"
  onButton2Click, // handler for "Mark as Done"
  button2Active,  // when true, "Mark as Done" shows as filled/active — XD image 3
}) => {
  return (
    <div className={style.actionsFooter}>
      {/* SAVE IN-PROGRESS — outlined style */}
      <button
        className={`${style.actionsFooterButton} ${style.textColurBlue}`}
        onClick={onButton1Click}
      >
        {button1}
      </button>

      {/* MARK AS DONE — filled/active style when button2Active is true */}
      <button
        className={`${style.actionsFooterButton} ${style.backgroundBlue} ${style.textColorWhite} ${
          button2Active ? style.markAsDoneActive : ""
        }`}
        onClick={onButton2Click}
      >
        {button2}
      </button>
    </div>
  );
};