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

const ActiveDraftContract = ({ getActiveDraftDialog }) => {
  return (
    <Dialog
      isOpen={getActiveDraftDialog}
      onClose={() => getActiveDraftDialog(false)}
      className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={`${style.spaceBetween} ${style.alignCenter}`}>
          <p className={`${style.popUpHeading}`}>
            Contract has been activated successfully
          </p>
        </div>
        <div className={style.extensionBorder}></div>
        <div className={`${style.popUpHeaderBlockActive} ${style.marginTop}`}>
          <div className={`${style.gridAlignTextEnd}`}>
            <p className={style.extentionLableStyle}>CONTRACT NAME:</p>
            <p className={style.extentionLableStyle}>CONTRACT ID:</p>
            <p className={style.extentionLableStyle}>ACTIVATED ON:</p>
          </div>
          <div className={style.grid}>
            <p className={style.extentionLableStyle}>
              New Contract with No Prior Contract(s) with Entity
            </p>
            <p className={style.extentionLableStyle}>PAMF CONTRACT (0043245)</p>
            <p className={style.extentionLableStyle}>10-23-2022 11:23 AM EST</p>
          </div>
        </div>
        <div>
          <div className={` ${style.marginTop20} ${style.textAlignCenter}`}>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20}`}
              onClick={() => getActiveDraftDialog(false)}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ActiveDraftContract;
