import React, { useState, useEffect } from "react";
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
} from "@blueprintjs/core";
import ArrowDown from "./../../images/arrowDown.png";
import style from "./index.module.scss";
import AddHealthcareGroup from "./../../images/addGroupBlue.png";
import { POST, PUT } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";

const AddContractedServiceForHealthcare = ({
  getAddEntityDialog,
  siteTypeData,
  getEntityData,
  seletedEntity,
  isEdit,
  siteTypeTableData,
  selectedTitle,
}) => {
  const [entityType, setEntityType] = useState("");
  const [csProviderTypeId, setCsProviderTypeId] = useState("");
  const [csProviderType, setCsProviderType] = useState("");
  const [createdDate, setCreatedDate] = useState("");

  const arrowDown = () => {
    return (
      <img
        src={ArrowDown}
        className={`${style.colorFileStyle3} ${style.marginRight}`}
      />
    );
  };

  const saveSubmitHandler = async (type) => {
    const isAvailable = siteTypeTableData
      .filter((e) => e.id === entityType)[0]
      .items.map((i) => i.contractedServiceProviderType)
      .includes(csProviderType);
    if (isAvailable) {
      ErrorToaster("Already This CSPType Exists");
      document.getElementById("cspTypeEl").focus();
      getAddEntityDialog(true);
      return false;
    }

    if (!csProviderType && csProviderType === "") {
      document.getElementById("cspTypeEl").focus();
      return false;
    }

    const data = {
      ...(isEdit && { id: csProviderTypeId }),
      ...(isEdit && { createdDate: createdDate }),
      contractedServiceProviderType: csProviderType,
      siteTypeId: {
        id: entityType,
      },
    };

    if (!isEdit) {
      await POST(
        "entity-service/contractedServiceProviderMaster",
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Contracted Service Provider Added Successfully");
          getEntityData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      await PUT(
        `entity-service/contractedServiceProviderMaster/${csProviderTypeId}`,
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Contracted Service Provider Updated Successfully");
          getEntityData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }

    if (type !== "Add More") {
      getAddEntityDialog(false);
    } else {
      setCsProviderType("");
      document.getElementById("cspTypeEl").focus();
    }
  };

  useEffect(() => {
    setEntityType(siteTypeData?.[0]?.id);
  }, [siteTypeData]);

  useEffect(() => {
    if (isEdit) {
      setEntityType(seletedEntity?.siteTypeId.id);
      setCsProviderType(seletedEntity?.contractedServiceProviderType);
      setCsProviderTypeId(seletedEntity?.id);
      setCreatedDate(seletedEntity?.createdDate);
    } else {
      setEntityType(seletedEntity?.id);
    }
  }, [isEdit, seletedEntity]);

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
            {`Add/Edit Contracted Service Providers For ${selectedTitle}`}
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
            <div className={style.entityLableStyle}>Entity / Site Type*</div>
            <div className={style.displayInRow}>
              <select
                name="class"
                id="Class"
                value={entityType}
                onChange={(e) => {
                  setEntityType(e.target.value);
                }}
                className={`${style.width75Percent}`}
              >
                {siteTypeData?.map((data) => {
                  return <option value={data.id}>{data.type}</option>;
                })}
              </select>
            </div>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          <div className={`${style.addHealthCareBoxStyle}`}>
            <div className={`${style.absenseCareGrid2}`}>
              <div className={style.entityLableStyle}>
                Contracted Service Provider Type*
              </div>
              <div className={style.displayInRow}>
                <InputGroup
                  value={csProviderType}
                  id="cspTypeEl"
                  className={style.fullWidth}
                  onChange={(e) => setCsProviderType(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={`${style.spaceBetween} ${style.marginTop20}`}>
            <div></div>
            {!isEdit && (
              <div
                className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}
                onClick={() => saveSubmitHandler("Add More")}
              >
                ADD MORE
              </div>
            )}
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              onClick={() => getAddEntityDialog(false)}
              className={style.outlinedButton}
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

export default AddContractedServiceForHealthcare;
