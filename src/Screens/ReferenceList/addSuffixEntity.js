import React, { useState } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  InputGroup,
  Checkbox,
} from "@blueprintjs/core";
import style from "./index.module.scss";
import AddHealthcareGroup from "./../../images/addGroupBlue.png";
import { POST, PUT, TenantID } from "../dataSaver";
import ArrowDown from "./../../images/arrowDown.png";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import { useEffect } from "react";

const AddSuffixEntity = ({
  getAddEntityDialog,
  selectedTitle,
  IndustryId,
  selectedEntity,
  isEdit,
  getEntityData,
  tableEntityData,
  getIndustryData,
  callingFrom,
}) => {
  const [entityId, setEntityId] = useState("");
  const [entityName, setEntityName] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [addSuffix, setAddSuffix] = useState(true);

  console.log("selectedEntiy", selectedEntity);

  const saveSubmitHandler = async (type) => {
    const isPresent = tableEntityData.find((p) => p.suffix === entityName);
    if (isPresent) {
      ErrorToaster("Already This Name Exists");
      document.getElementById("entityNameEl").focus();
      getAddEntityDialog(true);
      return false;
    }
    if (!entityName && entityName === "") {
      document.getElementById("entityNameEl").focus();
      return false;
    }

    const data = {
      ...(isEdit && { id: selectedEntity?.id }),
      ...(isEdit && { createdDate: createdDate }),
      suffix: entityName,
      industryId: {
        id: IndustryId,
      },
      ...(callingFrom === "Customer Admin" && {
        customized: true,
        entityId: {
          id: TenantID,
        },
      }),
    };

    let ApiData = callingFrom === "Customer Admin" && !isEdit ? [data] : data;

    let ApiUrl =
      callingFrom === "Super Admin"
        ? "entity-service/nameSuffixMaster"
        : `entity-service/nameSuffix`;
    if (!isEdit) {
      await POST(ApiUrl, JSON.stringify(ApiData))
        .then((response) => {
          SuccessToaster("Event Added Successfully");
          getEntityData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      await PUT(`${ApiUrl}/${data?.id}`, JSON.stringify(ApiData))
        .then((response) => {
          SuccessToaster("Event Updated Successfully");
          getEntityData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }
    if (callingFrom === "Super Admin") {
      getIndustryData();
    }
    if (type !== "Add More") {
      getAddEntityDialog(false);
      getEntityData();
    } else {
      setEntityName("");
      document.getElementById("entityNameEl").focus();
    }
  };

  useEffect(() => {
    if (isEdit) {
      setEntityName(selectedEntity?.suffix);
      setEntityId(selectedEntity?.id);
      setCreatedDate(selectedEntity?.createdDate);
    }
  }, [isEdit, selectedEntity]);

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
            {`Add / Edit Suffix For ${selectedTitle}`}
          </p>
          <div className={`${style.displayInRow}`}>
            <div className={`${style.displayInRow} ${style.marginRight20}`}>
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
            </div>
            <Icon
              icon="cross"
              size={20}
              intent={Intent.DANGER}
              className={style.dialogCrossStyle}
              onClick={() => getAddEntityDialog(false)}
            />
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <>
            <div
              className={`${style.editHealthCareGrid1} ${style.marginTop20}`}
            >
              <div className={style.entityLableStyle}>Industry Name*</div>
              <div className={style.displayInRow}>
                <InputGroup value={selectedTitle} className={style.halfWidth} />
                <Checkbox
                  value="ADD SUFFIX"
                  checked={addSuffix}
                  onChange={(e) => setAddSuffix(e.target.checked)}
                  className={` ${style.marginLeft20} ${style.marginTop}`}
                  label="ADD SUFFIX"
                />
              </div>
            </div>
            <div
              className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
            ></div>
          </>

          {addSuffix && (
            <div className={`${style.addHealthCareBoxStyle}`}>
              <div
                className={`${style.editHealthCareGrid2} ${style.marginTop20}`}
              >
                <div className={style.entityLableStyle}>Suffix Name*</div>
                <div className={style.displayInRow}>
                  <InputGroup
                    value={entityName}
                    id="entityNameEl"
                    className={style.fullWidth}
                    onChange={(e) => setEntityName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {!isEdit && (
            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
              <div></div>
              {entityName.length > 0 ? (
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
            </div>
          )}
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

export default AddSuffixEntity;
