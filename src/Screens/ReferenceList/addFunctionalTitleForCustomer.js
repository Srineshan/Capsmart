import React, { useState, useEffect } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  InputGroup,
} from "@blueprintjs/core";
import style from "./index.module.scss";
import { POST, PUT, TenantID } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";

const AddFunctionalTitlesForCustomer = ({
  getAddFunctionalTitlesDialog,
  siteTypeId,
  isEdit,
  selectedFunctionalTitlesCSPTypeCustomer,
  getFunctionalTitlesCustometData,
}) => {
  const [functionalTitle, setFunctionalTitle] = useState("");
  const [alias1, setAlias1]                   = useState("");
  const [alias2, setAlias2]                   = useState("");

  useEffect(() => {
    if (isEdit && selectedFunctionalTitlesCSPTypeCustomer) {
      setFunctionalTitle(selectedFunctionalTitlesCSPTypeCustomer?.title || "");
      setAlias1(selectedFunctionalTitlesCSPTypeCustomer?.alias1 || "");
      setAlias2(selectedFunctionalTitlesCSPTypeCustomer?.alias2 || "");
    } else {
      setFunctionalTitle("");
      setAlias1("");
      setAlias2("");
    }
  }, [selectedFunctionalTitlesCSPTypeCustomer, isEdit]);

  const saveSubmitHandler = async (type) => {
    if (!functionalTitle.trim()) {
      ErrorToaster("Functional Title is required.");
      return;
    }
    const data = {
      ...(isEdit && { id: selectedFunctionalTitlesCSPTypeCustomer?.id }),
      ...(isEdit && { createdDate: selectedFunctionalTitlesCSPTypeCustomer?.createdDate }),
      ...(isEdit && { lastModifiedDate: new Date().toISOString() }),
      title: functionalTitle.trim(),
      alias1: alias1.trim(),
      alias2: alias2.trim(),
      siteTypeId: { id: siteTypeId },
      entityId:   { id: TenantID },
      customized: true,
    };

    try {
      if (!isEdit) {
        await POST("entity-service/functionalTitlesForCSPType", JSON.stringify([data]));
        SuccessToaster("Functional Title Added Successfully");
      } else {
        await PUT(`entity-service/functionalTitlesForCSPType/${selectedFunctionalTitlesCSPTypeCustomer?.id}`, JSON.stringify(data));
        SuccessToaster("Functional Title Updated Successfully");
      }
      getFunctionalTitlesCustometData();
    } catch (error) {
      ErrorToaster(error?.message || "Something went wrong.");
    }

    if (type !== "Add More") {
      getAddFunctionalTitlesDialog(false);
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
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            Add/Edit Functional Titles For Contracted Service Providers
          </p>
          <Icon icon="cross" size={20} intent={Intent.DANGER}
            className={style.dialogCrossStyle}
            onClick={() => getAddFunctionalTitlesDialog(false)}
          />
        </div>
        <div className={style.ReferenceListEntityBorder} />

        <div className={`${style.addHealthCareBoxStyle}`} style={{ width: "100%", boxSizing: "border-box", overflow: "hidden" }}>
          <div className={`${style.editHealthCareGrid2}`}>
            <div className={style.entityLableStyle}>Functional Title *</div>
            <InputGroup value={functionalTitle} className={`${style.fullWidth}`} onChange={(e) => setFunctionalTitle(e.target.value)} />
          </div>
          <div className={`${style.editFunctionalTitlesGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>Alias Name</div>
            <InputGroup value={alias1} onChange={(e) => setAlias1(e.target.value)} className={`${style.fullWidth}`} />
            <InputGroup value={alias2} onChange={(e) => setAlias2(e.target.value)} className={`${style.fullWidth}`} />
          </div>

          {!isEdit && (
            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
              <div />
              <div className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`} onClick={() => saveSubmitHandler("Add More")}>
                ADD MORE
              </div>
            </div>
          )}
        </div>

        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button className={style.outlinedButton} onClick={() => getAddFunctionalTitlesDialog(false)}>CANCEL</button>
            <button onClick={() => saveSubmitHandler("Save & Exit")} className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE</button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddFunctionalTitlesForCustomer;