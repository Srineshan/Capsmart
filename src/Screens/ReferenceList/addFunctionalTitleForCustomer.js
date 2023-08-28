import React, { useState, useEffect } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  TextArea,
  InputGroup,
  Button,
} from "@blueprintjs/core";
import ArrowDown from "./../../images/arrowDown.png";
import style from "./index.module.scss";
import { Link } from "react-router-dom";
import { POST, PUT, TenantID } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";

const AddFunctionalTitlesForCustomer = ({
  getAddFunctionalTitlesDialog,
  CSPTypeName,
  siteTypeId,
  isEdit,
  CSPTypeId,
  selectedFunctionalTitlesCSPTypeCustomer,
  getFunctionalTitlesCustometData,
}) => {
  const arrowDown = () => {
    return (
      <img
        src={ArrowDown}
        className={`${style.colorFileStyle3} ${style.marginRight}`}
        alt="ArrowDown"
      />
    );
  };

  const [functionalTitle, setFunctionalTitle] = useState("");
  const [alias1, setAlias1] = useState("");
  const [alias2, setAlias2] = useState("");

  // console.log(selectedFunctionalTitlesCSPTypeCustomer);
  useEffect(() => {
    if (isEdit) {
      setFunctionalTitle(selectedFunctionalTitlesCSPTypeCustomer?.title);
      setAlias1(selectedFunctionalTitlesCSPTypeCustomer?.alias1);
      setAlias2(selectedFunctionalTitlesCSPTypeCustomer?.alias2);
    } else {
      setFunctionalTitle("");
      setAlias1("");
      setAlias2("");
    }
  }, [selectedFunctionalTitlesCSPTypeCustomer]);

  const saveSubmitHandler = async (type) => {
    const data = {
      ...(isEdit && { id: selectedFunctionalTitlesCSPTypeCustomer?.id }),
      ...(isEdit && {
        createdDate: selectedFunctionalTitlesCSPTypeCustomer?.createdDate,
      }),
      ...(isEdit && { lastModifiedDate: new Date() }),
      title: functionalTitle,
      alias1: alias1,
      alias2: alias2,
      contractedServiceProviderTypeId: CSPTypeId,
      siteTypeId: {
        id: siteTypeId,
      },
      entityId: {
        id: TenantID,
      },
      customized: true,
    };

    if (!isEdit) {
      await POST(
        "entity-service/functionalTitlesForCSPType",
        JSON.stringify([data])
      )
        .then((response) => {
          SuccessToaster("Functional Titles CSPType Added Successfully");
          getFunctionalTitlesCustometData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      await PUT(
        `entity-service/functionalTitlesForCSPType/${selectedFunctionalTitlesCSPTypeCustomer?.id}`,
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Functional Titles CSPType Updated Successfully");
          getFunctionalTitlesCustometData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }
    if (type !== "Add More") {
      getAddFunctionalTitlesDialog(false);
      getFunctionalTitlesCustometData();
    } else {
      setFunctionalTitle("");
      setAlias1("");
      setAlias2("");
    }
  };

  return (
    <Dialog
      isOpen={getAddFunctionalTitlesDialog}
      onClose={() => getAddFunctionalTitlesDialog(false)}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            Add/Edit Functional Titles For Contracted Service Providers
          </p>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.dialogCrossStyle}
            onClick={() => getAddFunctionalTitlesDialog(false)}
          />
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          {/* <div className={`${style.editHealthCareGrid2}`}>
            <div className={style.entityLableStyle}>Industry Type*</div>
            <div className={style.displayInRow}>
              <InputGroup
                value="Healthcare"
                className={`${style.width150} ${style.entityLableStyle1}`}
                rightElement={arrowDown()}
              />
            </div>
          </div> */}
          {/* <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>Entity / Site Type*</div>
            <div className={style.displayInRow}>
              <InputGroup
                value="Hospital / Acute Care Facility (ACF)"
                className={`${style.width150} ${style.entityLableStyle1}`}
                rightElement={arrowDown()}
              />
            </div>
          </div> */}
          <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>
              Contracted Service Provide Type*
            </div>
            <div className={style.displayInRow}>
              <InputGroup
                value={CSPTypeName}
                className={style.width150}
                rightElement={arrowDown()}
                disabled={true}
              />
            </div>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop10}`}
          ></div>
          <div className={`${style.addHealthCareBoxStyle}`}>
            <div className={`${style.editHealthCareGrid2}`}>
              <div className={style.entityLableStyle}>Functional Title*</div>
              <InputGroup
                value={functionalTitle}
                className={`${style.fullWidth}`}
                onChange={(e) => setFunctionalTitle(e.target.value)}
              />
            </div>
            <div
              className={`${style.editFunctionalTitlesGrid} ${style.marginTop20}`}
            >
              <div className={style.entityLableStyle}>ALias Name</div>
              <InputGroup
                value={alias1}
                onChange={(e) => setAlias1(e.target.value)}
                className={`${style.fullWidth} `}
              />
              <InputGroup
                value={alias2}
                onChange={(e) => setAlias2(e.target.value)}
                className={`${style.fullWidth}`}
              />
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
              onClick={() => getAddFunctionalTitlesDialog(false)}
            >
              CANCEL
            </button>
            <button
              onClick={() => saveSubmitHandler("Save & Exit")}
              className={`${style.buttonStyle} ${style.marginLeft20}`}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddFunctionalTitlesForCustomer;
