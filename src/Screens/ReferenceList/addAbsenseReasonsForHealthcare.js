<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Dialog, Classes, Icon, Intent, InputGroup } from "@blueprintjs/core";
import ArrowDown from "./../../images/arrowDown.png";
import style from "./index.module.scss";
import { POST, PUT } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";

const AddAbsenseReasonsForHealthcare = ({
  getAddEntityDialog,
  isEdit,
  IndustryId,
  selectedAbsence,
  getEntityData,
  tableEntityData,
  selectedTitle,
  getIndustryData,
}) => {
  const [absenseId, setAbsenseId] = useState("");
  const [absenseType, setAbsenseType] = useState("Planned");
  const [absenceReason, setAbsenseReason] = useState("");
  const [notificationPeriod, setNotificationPeriod] = useState("14");
  const [createdDate, setCreatedDate] = useState("");

  const arrowDown = () => {
    return (
      <img
        src={ArrowDown}
        className={`${style.colorFileStyle3} ${style.marginRight}`}
        alt=""
      />
    );
  };

  const saveSubmitHandler = async (type) => {
    const isPresent = tableEntityData
      .filter((e) => e.absenceType === absenseType.toUpperCase())
      .find((p) => p.absenceReason === absenceReason);
    if (isPresent) {
      ErrorToaster("Already This Absence Reason Exists");
      document.getElementById("absenceEl").focus();
      getAddEntityDialog(true);
      return;
    }

    if (!absenceReason && absenceReason === "") {
      document.getElementById("absenceEl").focus();
      return;
    }

    const data = {
      ...(isEdit && { id: absenseId }),
      ...(isEdit && { createdDate: createdDate }),
      absenceType: absenseType.toUpperCase(),
      absenceReason: absenceReason,
      notificationPeriod: {
        numberOfDays: parseInt(notificationPeriod),
      },
      industryId: {
        id: IndustryId,
      },
    };

    if (!isEdit) {
      await POST("entity-service/absenceReasonMaster", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("Absence Added Successfully");
          getIndustryData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      await PUT(
        `entity-service/absenceReasonMaster/${absenseId}`,
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Absence Updated Successfully");
          getIndustryData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }

    if (type !== "Add More") {
      getAddEntityDialog(false);
      getIndustryData();
    } else {
      setAbsenseReason("");
      document.getElementById("absenceEl").focus();
    }
  };

  useEffect(() => {
    if (isEdit) {
      setAbsenseId(selectedAbsence?.id);
      setAbsenseType(
        selectedAbsence?.absenceType.charAt(0).toUpperCase() +
          selectedAbsence?.absenceType.slice(1).toLowerCase()
      );
      setAbsenseReason(selectedAbsence?.absenceReason);
      setNotificationPeriod(selectedAbsence?.notificationPeriod?.numberOfDays);
      setCreatedDate(selectedAbsence?.createdDate);
    }
  }, [isEdit, selectedAbsence]);

  return (
    <Dialog
      isOpen={getAddEntityDialog}
      onClose={() => getAddEntityDialog(false)}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            {isEdit
              ? "Add/Edit Absence Reasons"
              : `New Absence Reason For ${selectedTitle}`}
          </p>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.dialogCrossStyle}
            onClick={() => getAddEntityDialog(false)}
          />
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={`${style.extentionGrid}`}>
            <div className={style.entityLableStyle}>Absence Type*</div>
            <div className={style.displayInRow}>
              <select
                name="class"
                id="class"
                value={absenseType}
                onChange={(e) => {
                  setAbsenseType(e.target.value);
                  if (e.target.value === "Planned") {
                    setNotificationPeriod("14");
                  } else {
                    setNotificationPeriod("7");
                  }
                }}
                className={`${style.width75Percent}`}
              >
                <option value="Planned">Planned</option>
                <option value="Unplanned">Unplanned</option>
              </select>
            </div>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          <div className={`${style.addHealthCareBoxStyle}`}>
            <div className={`${style.absenseCareGrid2}`}>
              <div className={style.entityLableStyle}>Absense Reason*</div>
              <div className={style.displayInRow}>
                <InputGroup
                  value={absenceReason}
                  placeholder="Reason"
                  id="absenceEl"
                  className={style.fullWidth}
                  onChange={(e) => setAbsenseReason(e.target.value)}
                />
              </div>
            </div>
            {/* <div className={`${style.absenseCareGrid2} ${style.marginTop20}`}>
              <div className={style.entityLableStyle}>
                {absenseType === "Planned"
                  ? "Request Notification Period*"
                  : "Notification Period"}
              </div>
              <div className={style.displayInRow}>
                <div className={style.entityLableStyle}>Not more than</div>
                <InputGroup
                  value={notificationPeriod}
                  name="notificationPeriod"
                  type="number"
                  className={style.marginLeft20}
                  onChange={(e) => setNotificationPeriod(e.target.value)}
                />
                <div
                  className={`${style.entityLableStyle} ${style.marginLeft20}`}
                >
                  Days
                </div>
              </div>
            </div> */}
          </div>

          <div className={`${style.spaceBetween} ${style.marginTop20}`}>
            <div></div>
            {!isEdit && (
              <>
                {absenceReason.length > 0 ? (
                  <div
                    className={`${style.buttonStyle3} ${style.addMoreCardStyle}`}
                    onClick={() => saveSubmitHandler("Add More")}
                  >
                    ADD MORE
                  </div>
                ) : (
                  <div
                    className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}
                    onClick={() => saveSubmitHandler("Add More")}
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
              onClick={() => getAddEntityDialog(false)}
            >
              CANCEL
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20}`}
              onClick={() => saveSubmitHandler("Save & Exit")}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddAbsenseReasonsForHealthcare;
