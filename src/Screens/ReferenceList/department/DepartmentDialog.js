import React, { useState } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  TextArea,
  InputGroup,
  Button,
  RadioGroup,
  Radio,
  Switch,
} from "@blueprintjs/core";
import AddHealthcareGroup from "./../../../images/addGroupBlue.png";
import WritingFile from "./../../../images/writing-file.svg";
import ArrowDown from "./../../../images/arrowDown.png";

import style from "./../index.module.scss";

function DepartmentDialog({ open, onClose }) {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const handleSwitchChange = (event) => {
    setIsSwitchOn(event.target.checked);
  };

  const switchLabel = isSwitchOn ? "Yes" : "No";

  // Accept onClose as a prop
  const arrowDown = () => {
    return (
      <img
        src={ArrowDown}
        className={`${style.colorFileStyle3} ${style.marginRight}`}
      />
    );
  };
  return (
    <Dialog
      isOpen={open}
      className={`${style.departmentDialogStyle} ${style.dialogPaddingBottom}`}
      onClose={onClose}
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
              Add A NEW Department / Service Area Or Speciality{" "}
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
              onClick={onClose}
            />
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div>
            <div className={style.entityLabelStyle}>SPECIFIC SITE*</div>
            <div className={style.fullWidth}>
              <InputGroup
                value="Select Sites"
                rightElement={arrowDown()}
                className={style.fullWidth}
              />
            </div>
          </div>
          <div className={style.marginTop20}>
            <div className={style.entityLabelStyle}>SPECIFIC DEPARTEMENT*</div>
            <div className={style.fullWidth}>
              <InputGroup
                value="Select Department"
                rightElement={arrowDown()}
                className={style.fullWidth}
              />
            </div>
          </div>
          <div className={style.marginTop20}>
            <div style={{ display: "flex" }}>
              <div className={style.entityLabelStyle}>
                SERVICE AREA / SPECIALITY
              </div>
              <div style={{ marginLeft: "20px" }}>
                <div className={style.switchContainer}>
                  <span
                    style={{ marginLeft: "20px" }}
                    className={style.switchLabel}
                  >
                    {switchLabel}
                  </span>
                  <Switch
                    checked={isSwitchOn}
                    onChange={handleSwitchChange}
                    className={style.toggleSwitch}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button className={style.dialogOutlinedButton}>SAVE & EXIT</button>
            <button
              className={`${style.dialogButtonStyle} ${style.marginLeft20}`}
              onClick={onClose} // Close the dialog when clicked
            >
              SAVE & ADD MORE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default DepartmentDialog;
