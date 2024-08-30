import React, { useEffect, useState } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  InputGroup,
  RadioGroup,
  Radio,
  Checkbox,
} from "@blueprintjs/core";
import ArrowDown from "./../../images/arrowDown.png";
import style from "./../index.module.scss";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Switch, Typography, makeStyles } from "@material-ui/core";

function staffPrivilegeDialog({ open, handleClose }) {
  return (
    <Dialog
      isOpen={open}
      onClose={handleClose}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p
            className={style.extensionStyle}
          >{`Add / Edit Termination Reasons For ${selectedTitle}`}</p>
          <div className={`${style.displayInRow}`}>
            {/* <div className={`${style.displayInRow} ${style.marginRight20}`}>
                <img
                  src={
                    "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/125px-Flag_of_the_United_States.svg.png"
                  }
                  alt="refresh"
                  className={`${style.headerFlag} ${style.marginRight15}`}
                />
                <span
                  className={`${style.headerCountryName} ${style.marginLeft10}`}
                >
                  USA
                </span>
                <img
                  src={ArrowDown}
                  className={`${style.colorFileStyle2} ${style.marginLeft10}  ${style.marginTop10}`}
                  alt=""
                />
              </div> */}
            <Icon
              icon="cross"
              size={20}
              intent={Intent.DANGER}
              className={style.dialogCrossStyle}
            />
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={`${style.extentionGrid}`}>
            <div className={style.entityLableStyle}>Industry Type*</div>
            <div className={style.displayInRow}>
              <select
                value={currentindustryType}
                className={style.fullWidth}
                rightElement={arrowDown()}
              >
                {/* {industryTypes.map((type) => (
                  <option value={type.id}>{type.industry}</option>
                ))} */}
              </select>
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>SPECIFIC SITE*</div>
            <div className={style.displayInRow}>
              <select
                value={currentEntityType}
                className={style.fullWidth}
                rightElement={arrowDown()}
              >
                {entityTypes.map((type) => (
                  <option value={type.id}>{type.type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>APPLICATION TYPE*</div>
            <div className={style.displayInRow}>
              <select
                value={currentEntityType}
                className={style.fullWidth}
                rightElement={arrowDown()}
              >
                {entityTypes.map((type) => (
                  <option value={type.id}>{type.type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>INSTRUCTION TEXT*</div>
            <div className={style.displayInRow}></div>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>PRIVILEGE ID*</div>
            <div className={style.displayInRow}>
              <InputGroup
                value="Surgical Services"
                className={style.fullWidthInput}
              />
            </div>
          </div>

          <div className={`${style.spaceBetween} ${style.marginTop20}`}>
            <div></div>
            {!isEdit && (
              <>
                {primaryReason.length > 0 || secondaryReason.length > 0 ? (
                  <div
                    className={`${style.buttonStyle3} ${style.addMoreCardStyle}`}
                    // onClick={() => SaveSubmitHandler("Add More")}
                  >
                    ADD MORE
                  </div>
                ) : (
                  <div
                    className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}
                    // onClick={() => SaveSubmitHandler("Add More")}
                  >
                    ADD MORE
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              //   onClick={() => getAddEntityDialog(false)}
            >
              CANCEL
            </button>
            <button
              //   onClick={() => SaveSubmitHandler("Save & Exit")}
              className={`${style.buttonStyle} ${style.marginLeft20}`}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default staffPrivilegeDialog;
