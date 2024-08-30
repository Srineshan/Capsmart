import React, { useState } from "react";
import { Dialog, Classes, Icon, Intent, InputGroup } from "@blueprintjs/core";
import ArrowDown from "./../../../images/arrowDown.png";
import style from "./../index.module.scss";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Switch } from "@material-ui/core";
import WritingFile from "./../../../images/writing-file.svg";
import { Box } from "@mui/material";

const StaffPrivilegeDialog = ({
  open,
  handleClose,
  isEdit,
  selectedTermination,
}) => {
  const [secondaryReason, setSecondaryReason] = useState("");
  const [entityTypes, setEntityTypes] = useState([]);
  const [primaryReason, setPrimaryReason] = useState("");
  const [currentEntityType, setCurrentEntityType] = useState(
    selectedTermination?.entityId?.id ? selectedTermination?.entityId?.id : ""
  );
  const [selectedType, setSelectedType] = useState("basic");
  const [proofRequired, setProofRequired] = useState(true);
  const [toggleState, setToggleState] = useState(false);

  const arrowDown = () => {
    return (
      <img
        src={ArrowDown}
        className={`${style.colorFileStyle3} ${style.marginRight}`}
        alt=""
      />
    );
  };
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
          <p className={style.extensionStyle}>
            Setup and maintain your Staff Privileges
          </p>
          <div className={`${style.displayInRow}`}>
            <div style={{ marginRight: "40px" }}>
              <img
                src={WritingFile}
                className={style.dialogCrossStyle}
                alt="Writing File"
              />
            </div>
            <Icon
              icon="cross"
              size={30}
              intent={Intent.DANGER}
              className={style.dialogCrossStyle}
              onClick={handleClose}
            />
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div className={style.entityLableStyle}>Industry Type*</div>
              <div className={style.displayInRow}>
                <select
                  value={""}
                  className={`${style.fullWidth} ${style.customSelect}`}
                  rightElement={arrowDown()}
                >
                  {/* {industryTypes.map((type) => (
                  <option value={type.id}>{type.industry}</option>
                ))} */}
                </select>
              </div>
            </div>
            <div style={{ marginLeft: "30px" }}>
              <div className={style.entityLableStyle}>SPECIFIC SITE*</div>
              <div className={style.displayInRow}>
                <select
                  value={currentEntityType}
                  className={`${style.fullWidth} ${style.customSelect}`}
                  rightElement={arrowDown()}
                >
                  {entityTypes.map((type) => (
                    <option value={type.id}>{type.type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginLeft: "30px" }}>
              <div className={style.entityLableStyle}>APPLICATION TYPE*</div>
              <div className={style.displayInRow}>
                <select
                  value={currentEntityType}
                  className={`${style.fullWidth} ${style.customSelect}`}
                  rightElement={arrowDown()}
                >
                  {entityTypes.map((type) => (
                    <option value={type.id}>{type.type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div
            className={`${style.extentionGrid} ${style.marginTop20}`}
            style={{ marginLeft: "10px" }}
          >
            <div className={style.entityLableStyle}>INSTRUCTION TEXT*</div>
            <div className={style.displayInRow} style={{ marginLeft: "10px" }}>
              <InputGroup
                className={style.fullWidth}
                placeholder="Enter Text Here"
                rows={1}
              />
            </div>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          <div className={`${style.marginTop20}`} style={{ display: "flex" }}>
            <div>
              <div className={style.entityLableStyle}>PRIVILEGE ID</div>
              <InputGroup value="Surgical Services" />
            </div>
            <div style={{ marginLeft: "30px" }}>
              <div className={style.entityLableStyle}>PRIVILEGE TITLE</div>
              <InputGroup
                className={`${style.fullWidth} ${style.customSelect}`}
                placeholder="Enter Text Here"
                rows={1}
              />
            </div>
          </div>

          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>PRIVILEGE DESCRIPTION</div>
            <InputGroup
              className={style.fullWidth}
              placeholder="Add Description"
              rows={1}
            />
          </div>
          <div
            className={`${style.marginTop20}`}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className={style.entityLableStyle}>CATEGORY?</div>
            <div style={{ marginLeft: "10px" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={toggleState}
                    onChange={(e) => setToggleState(e.target.checked)}
                  />
                }
                className={`${style.switchFontStyle}`}
                label={toggleState ? "YES" : "NO"}
              />
            </div>
            {/* <div className={style.entityLableStyle}>CATEGORY TITLE</div> */}
            {/* <div className={style.displayInRow}>
              <TextArea
                className={style.fullWidth}
                placeholder="Enter Text Here"
                rows={1}
              />
            </div> */}
            <div></div>
          </div>
          <div className={`${style.spaceBetween} ${style.marginTop20}`}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <span className={style.entityLableStyle}>TYPE</span>
              <div style={{ marginLeft: "30px" }}>
                <input
                  type="radio"
                  name="type"
                  value="basic"
                  checked={selectedType === "basic"}
                  onChange={() => setSelectedType("basic")}
                />
                <span className={style.radioLabel}>Basic</span>
              </div>
              <div style={{ marginLeft: "30px" }}>
                <input
                  type="radio"
                  name="type"
                  value="special"
                  checked={selectedType === "special"}
                  onChange={() => setSelectedType("special")}
                />
                <span>Special</span>
              </div>
              {selectedType === "special" && (
                <div style={{ marginLeft: "30px" }}>
                  <span>Proof of Documentation Required?</span>
                  <label>
                    <input
                      type="checkbox"
                      checked={proofRequired}
                      onChange={() => setProofRequired(!proofRequired)}
                    />
                  </label>
                  <span>{proofRequired ? "Yes" : "No"}</span>
                </div>
              )}
            </div>
            <div></div>
            <div style={{ marginBottom: "-20px" }}>
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
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className={style.marginTop20} style={{ float: "left" }}>
            <button
              className={style.outlinedButton}
              //   onClick={() => getAddEntityDialog(false)}
            >
              BULK UPLOAD
            </button>
          </div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              //   onClick={() => getAddEntityDialog(false)}
            >
              SAVE & EXIT
            </button>
            <button
              //   onClick={() => SaveSubmitHandler("Save & Exit")}
              className={`${style.buttonStyle} ${style.marginLeft20}`}
            >
              SAVE & ADD MORE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
export default StaffPrivilegeDialog;
