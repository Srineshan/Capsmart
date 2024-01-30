/* eslint-disable array-callback-return */
import React, { useState,useEffect } from "react";
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
import { index } from "d3";

const MissedMandatoryFieldAlert = ({
  alert,
  getSaveInProgressAlert,
  fieldData,
  saveInProgressFunction,
  setContinueLoading,
  buttonName,
}) => {

  const handleContinueClick = () => {
    saveInProgressFunction(buttonName)
  };

  const handleClose = () => {
    setContinueLoading(false);
    getSaveInProgressAlert(false);
  };
  
  return (
    <Dialog
      isOpen={alert}
      onClose={handleClose}
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
            onClick={handleClose}
          />
        </div>
        <div className={style.extensionBorder}></div>
        <div className={`${style.marginTop30} ${style.marginLeft30}`}>
          {fieldData?.map((data, index) => {
            return (
              <p
                className={`${style.deleteDescriptionStyle} ${style.marginTop10}`}
                key={index}
              >
                {data}
              </p>
            );
          })}
        </div>

        <div className={`${style.positionCenter} ${style.marginTop20}`}>
          <button
            className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`}
            onClick={handleClose}
          >
            BACK
          </button>
          <button
            className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`}
            onClick={handleContinueClick}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default MissedMandatoryFieldAlert;
