import React from "react";
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

const SaveInProgressDialog = ({ getSaveInProgressDialog }) => {
  return (
    <Dialog
      isOpen={getSaveInProgressDialog}
      onClose={() => getSaveInProgressDialog(false)}
      className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={`${style.popUpHeading}`}>Save In Progress</p>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.crossStyle}
            onClick={() => getSaveInProgressDialog(false)}
          />
        </div>
        <div className={style.extensionBorder}></div>
        <div className={`${style.popUpHeaderBlock} ${style.marginTop}`}>
          <div>
            <p className={style.extentionLableStyle}>
              New Contract with No Prior Contract(s) with Entity
            </p>
            <p className={style.extentionLableStyle}>PAMF CONTRACT (0043245)</p>
            <p className={style.extentionLableStyle}>
              MULTIPLE CONTRACTORS (23)
            </p>
          </div>
          <div>
            <p className={style.extentionLableStyle}>
              Ranjith T (Contract Manager)
            </p>
            <p className={style.extentionLableStyle}>
              SITE NAME ONLY IF MULTISITE
            </p>
            <p className={style.extentionLableStyle}>
              LAST UPDATED ON 09-23-2022
            </p>
          </div>
        </div>
        <div className={`${style.marginTop}`}></div>
        <div className={style.extensionBorder}></div>
        <div>
          <p
            className={`${style.cloneContent} ${style.marginTop20} ${style.contentTextAlign}`}
          >
            The contract that you are entering will be saved as a ”
            <span className={`${style.blueColor}`}>DRAFT</span> ” mode. You can
            access this contract to continue working on it from your list of
            draft contracts
          </p>
        </div>
        <div>
          <div className={`${style.positionCenter} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              onClick={() => getSaveInProgressDialog(false)}
            >
              CANCEL
            </button>
            <button className={`${style.buttonStyle} ${style.marginLeft20}`}>
              SAVE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SaveInProgressDialog;
