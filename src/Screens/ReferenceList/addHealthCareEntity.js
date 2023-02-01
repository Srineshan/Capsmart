/* eslint-disable no-const-assign */
import React, { useState } from "react";
import { Dialog, Classes, Icon, Intent, InputGroup } from "@blueprintjs/core";
import AddHealthcareGroup from "./../../images/addGroupBlue.png";
import { POST, PUT } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import { useEffect } from "react";
import style from "./index.module.scss";

const AddHealthCareEntity = ({
  getAddHcEntityDialog,
  selectedTitle,
  IndustryId,
  seletedEntity,
  isEdit,
  getEntityData,
  tableEntityData,
}) => {
  const [entityId, setEntityId] = useState("");
  const [entityName, setEntityName] = useState("");
  const [createdDate, setCreatedDate] = useState("");

  const saveSubmitHandler = async (type) => {
    const isPresent = tableEntityData.find((p) => p.type === entityName);
    if (isPresent) {
      ErrorToaster("Already This Name Exists");
      document.getElementById("entityName").focus();
      getAddHcEntityDialog(true);
      return false;
    }

    if (!entityName && entityName === "") {
      document.getElementById("entityName").focus();
      return false;
    }

    const data = {
      ...(isEdit && { id: entityId }),
      ...(isEdit && { createdDate: createdDate }),
      type: entityName,
      industryId: {
        id: IndustryId,
      },
    };

    if (!isEdit) {
      await POST("entity-service/entityTypeMaster", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("Event Added Successfully");
          getEntityData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      await PUT(
        `entity-service/entityTypeMaster/${entityId}`,
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Event Updated Successfully");
          getEntityData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }

    if (type !== "Add More") {
      getAddHcEntityDialog(false);
    } else {
      setEntityName("");
      document.getElementById("entityName").focus();
    }
  };

  useEffect(() => {
    if (isEdit) {
      setEntityName(seletedEntity?.type);
      setEntityId(seletedEntity?.id);
      setCreatedDate(seletedEntity?.createdDate);
    }
  }, [isEdit, seletedEntity]);

  return (
    <Dialog
      isOpen={getAddHcEntityDialog}
      onClose={() => getAddHcEntityDialog(false)}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            {`Add/Edit Entity Types For ${selectedTitle}`}
          </p>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.dialogCrossStyle}
            onClick={() => getAddHcEntityDialog(false)}
          />
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={`${style.editHealthCareGrid1} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>Industry Name*</div>
            <div className={style.displayInRow}>
              <InputGroup value={selectedTitle} className={style.halfWidth} />
              {/* <img src={AddHealthcareGroup} className={`${style.colorFileStyle} ${style.marginLeft20}`} alt="" /> */}
              {/* <p className={`${style.marginTop} ${style.marginLeft5}`}>ADD ENTITY</p> */}
            </div>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          <div className={`${style.addHealthCareBoxStyle}`}>
            <div
              className={`${style.editHealthCareGrid2} ${style.marginTop20}`}
            >
              <div className={style.entityLableStyle}>Entity Name*</div>
              <div className={style.displayInRow}>
                <InputGroup
                  value={entityName}
                  id="entityName"
                  className={style.fullWidth}
                  onChange={(e) => setEntityName(e.target.value)}
                />
              </div>
            </div>
          </div>
          {!isEdit && (
            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
              <div></div>
              <div
                className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}
                onClick={() => saveSubmitHandler("Add More")}
              >
                ADD MORE
              </div>
            </div>
          )}
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              onClick={() => getAddHcEntityDialog(false)}
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

export default AddHealthCareEntity;
