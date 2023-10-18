import React, { useState } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  TextArea,
  RadioGroup,
  Radio,
} from "@blueprintjs/core";
import style from "./index.module.scss";
import RedWarning from "./../../images/redWarning.png";

const MissedMandatoryFieldAlert = ({
  alert,
  getSaveInProgressAlert,
  fieldData,
  saveInProgressFunction,
}) => {
  return (
    <Dialog
      isOpen={alert}
      onClose={() => getSaveInProgressAlert(false)}
      className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}  ${style.margin20}`}
      >
        <div className={`${style.warningTextAlign} `}>
          <div className={`${style.extensionStyle} ${style.warningTextAlign}`}>
            <img
              src={RedWarning}
              alt="WARNING"
              className={`${style.warningIconStyle}`}
            />
            <span className={style.marginLeft5}>
              Alert! You Missed Mandatory Fields
            </span>
          </div>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.crossStyle}
            onClick={() => getSaveInProgressAlert(false)}
          />
        </div>
        <div className={style.extensionBorder}></div>
        <div className={`${style.marginTop30} ${style.marginLeft30}`}>
          <p className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}>
            {fieldData}
            <div className={`${style.marginTop20}`}>
              <span className={`${style.blueColor} ${style.marginTop30} `}>
                Following Above data are missing
              </span>
            </div>
          </p>
        </div>

        <div className={`${style.positionCenter} ${style.marginTop20}`}>
          <button
            className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`}
            onClick={() => getSaveInProgressAlert(false)}
          >
            BACK
          </button>
          <button
            className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`}
            onClick={saveInProgressFunction}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default MissedMandatoryFieldAlert;
