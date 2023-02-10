import React, { useState, useEffect } from "react";
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
import style from "./index.module.scss";
import { POST, PUT } from "./../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";

const AddNewDepartments = ({
  getAddEntityDialog,
  selectedEntity,
  isEdit,
  getEntityData,
  selectedDepart,
  departmentList,
  selectedTitle,
  isService,
}) => {
  const [departId, setDepartId] = useState("");
  const [departName, setDepartName] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [addService, setAddService] = useState(true);
  const [serviceArea, setSerrviceArea] = useState("");

  const saveSubmitHandler = async (type) => {
    let ServiceAreaData = [];

    if (selectedDepart?.serviceAreas) {
      ServiceAreaData = [...selectedDepart.serviceAreas];
    }

    // const isPresent = departmentList.find(
    //   (p) => p.departmentName.name === departName
    // );
    // if (isPresent) {
    //   ErrorToaster("Already This Name Exists");
    //   document.getElementById("departmentEl").focus();
    //   getAddEntityDialog(true);
    //   return false;
    // }

    if (!departName && departName === "") {
      document.getElementById("departmentEl").focus();
      return false;
    }

    if (serviceArea !== "") {
      ServiceAreaData.push({
        name: serviceArea,
      });
    }

    const data = {
      ...(isEdit && { id: departId }),
      ...(isEdit && { createdDate: createdDate }),
      departmentName: {
        name: departName,
      },
      siteTypeId: {
        id: selectedEntity?.id,
      },
      departmentGroupBy: {
        name: departName,
      },
      serviceAreas: ServiceAreaData,
    };

    await POST("entity-service/departmentMaster", JSON.stringify(data))
      .then((response) => {
        SuccessToaster("Department Added Successfully");
        getEntityData();
      })
      .catch((error) => {
        ErrorToaster(error);
      });

    // if (!isEdit) {
    //   await POST("entity-service/departmentMaster", JSON.stringify(data))
    //     .then((response) => {
    //       SuccessToaster("Department Added Successfully");
    //       getEntityData();
    //     })
    //     .catch((error) => {
    //       ErrorToaster(error);
    //     });
    // } else {
    //   await PUT(
    //     `entity-service/departmentMaster/${departId}`,
    //     JSON.stringify(data)
    //   )
    //     .then((response) => {
    //       SuccessToaster("Department Updated Successfully");
    //       //   getAddEntityDialog(false);
    //       getEntityData();
    //     })
    //     .catch((error) => {
    //       ErrorToaster(error);
    //     });
    // }

    if (type !== "Add More") {
      getAddEntityDialog(false);
    } else {
      setDepartName("");
      document.getElementById("departmentEl").focus();
    }
  };

  useEffect(() => {
    if (isEdit) {
      setDepartId(selectedDepart?.id);
      setDepartName(selectedDepart?.departmentName?.name);
      setCreatedDate(selectedDepart?.createdDate);
      if (isService) {
        setSerrviceArea(selectedDepart?.serviceAreas[0]?.name);
      }
    }
  }, [selectedDepart]);

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
            {` New Departments / Services Area For ${selectedTitle}`}
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
            <div className={style.entityLableStyle}>Department Name*</div>
            <div className={style.twoCol}>
              <InputGroup
                placeholder="Enter Department Name"
                id="departmentEl"
                value={departName}
                className={style.fullWidth}
                onChange={(e) => setDepartName(e.target.value)}
              />
              <Checkbox
                value="ADD SERVICES"
                checked={addService}
                onChange={(e) => setAddService(e.target.checked)}
                className={` ${style.marginLeft20} ${style.marginTop}`}
                label="ADD SERVICES"
              />
            </div>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          {addService && (
            <div className={`${style.addHealthCareBoxStyle}`}>
              <div className={`${style.editHealthCareGrid2}`}>
                <div className={style.entityLableStyle}>Service Area*</div>
                <div className={style.displayInRow}>
                  <InputGroup
                    value={serviceArea}
                    className={style.fullWidth}
                    onChange={(e) => setSerrviceArea(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className={`${style.spaceBetween} ${style.marginTop20}`}>
            <div></div>
            {!isEdit && (
              <>
                {departName.length > 0 ? (
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

export default AddNewDepartments;
