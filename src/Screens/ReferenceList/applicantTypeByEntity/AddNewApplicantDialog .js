import React from "react";
import { Dialog, Classes, Icon, Intent, InputGroup } from "@blueprintjs/core";
import style from "./index.module.scss";

const AddNewApplicantDialog = ({ open, handleClose }) => {
  //   const arrowDown = () => (
  //     <img
  //       src={ArrowDown}
  //       className={`${style.colorFileStyle3} ${style.marginRight}`}
  //       alt="Arrow Down"
  //     />
  //   );

  return (
    <Dialog
      isOpen={open}
      onClose={handleClose}
      className={`${style.healthCareDialogStyle}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            Add New Applicant Type for {"{"}Healthcare{"}"}
          </p>

          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.dialogCrossStyle}
            onClick={handleClose}
          />
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.labelInputWrapper}>
              <div className={style.entityLableStyle}>APPLICANT TYPE*</div>
              <InputGroup
                value="Arizona Metripolitian hospital"
                className={style.fullWidthInput}
              />
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.labelInputWrapper}>
              <div className={style.entityLableStyle}>
                SITE APPLICANT REQUIRED FOR*
              </div>
              <InputGroup
                value="Surgical Services"
                className={style.fullWidthInput}
              />
            </div>
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={`${style.outlinedButton} ${style.whiteBackground}`}
            >
              SAVE & EXIT
            </button>
            <button className={`${style.buttonStyle} ${style.marginLeft20}`}>
              SAVE & ADD MORE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddNewApplicantDialog;
