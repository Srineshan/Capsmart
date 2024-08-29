import React from "react";
import { Dialog, Classes, Icon, Intent, InputGroup } from "@blueprintjs/core";
import style from "./index.module.scss";
import WritingFile from "./../../../images/writing-file.svg"; // Adjust the path as necessary
import ArrowDown from "./../../../images/arrowDown.png"; // Import arrowDown image

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
          <div
            className={`${style.flagBoxContainer}`}
            style={{ marginBottom: "10px" }}
          >
            <img
              src={
                "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/125px-Flag_of_the_United_States.svg.png"
              }
              alt="refresh"
              className={`${style.departmentFlag} ${style.marginRight15}  `}
            />
            <span
              className={`${style.departmentCountryName} ${style.marginLeft10}`}
            >
              USA
            </span>
            <img
              src={ArrowDown}
              className={`${style.colorFileStyle2} ${style.ArrowDown} ${style.marginRight15}`}
              alt=""
            />
          </div>
          <div>
            <p className={style.extensionStyle}>
              Add New Applicant Type for {"{"}Healthcare{"}"}
            </p>
          </div>
          <div>
            <img
              src={WritingFile}
              className={style.dialogCrossStyle}
              alt="Writing File"
            />
          </div>
          <div>
            <Icon
              icon="cross"
              size={30}
              intent={Intent.DANGER}
              className={style.departmentCrossStyle}
            />
          </div>
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
