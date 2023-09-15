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

const ActivationAlertDraftContract = ({ getActivationAlertDraftDialog }) => {
  const [contractActivation, setContractActivation] =
    useState("Without Automated");

  const handleChangeHandler = (e) => {
    setContractActivation(e.target.value);
  };

  return (
    <Dialog
      isOpen={getActivationAlertDraftDialog}
      onClose={() => getActivationAlertDraftDialog(false)}
      className={`${style.newCloneDialog} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}  ${style.margin20}`}
      >
        <div className={`${style.spaceBetween}`}>
          <div
            className={`${style.extensionStyle} ${style.spaceBetween} ${style.marginAuto}`}
          >
            Contract Activation Alert
          </div>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.crossStyle}
            onClick={() => getActivationAlertDraftDialog(false)}
          />
        </div>
        <div className={style.extensionBorder}></div>
        <div className={`${style.marginTop30} ${style.marginLeft30}`}>
          <label className={style.container}>
            <input
              type="radio"
              value="Without Automated"
              name="choose"
              onChange={handleChangeHandler}
              checked={contractActivation === "Without Automated"}
            />
            <span className={style.checkmark}></span>
            <p
              className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}
            >
              Activate your contract without automated review and approval
              workflow
            </p>
          </label>
          <label className={style.container}>
            <input
              type="radio"
              value="Paperless Automated"
              name="choose"
              onChange={handleChangeHandler}
              checked={contractActivation === "Paperless Automated"}
            />
            <span className={style.checkmark}></span>
            <p
              className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore,
              <span
                className={`${style.blueColor} ${style.marginLeft20} ${style.textUnderline}`}
              >
                quis nostrud xercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat
              </span>
            </p>
          </label>
        </div>

        <div className={`${style.positionCenter} ${style.marginTop20}`}>
          <button
            className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`}
            onClick={() => getActivationAlertDraftDialog(true)}
          >
            RETURN
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ActivationAlertDraftContract;
