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
  CSPTypeName,
  siteTypeId,
  isEdit,
  CSPTypeId,
  contractedServiceProviderMaster,  // ← passed from parent for dropdown
  selectedFunctionalTitlesCSPTypeCustomer,
  getFunctionalTitlesCustometData,
}) => {
  const [functionalTitle, setFunctionalTitle] = useState("");
  const [alias1, setAlias1]                   = useState("");
  const [alias2, setAlias2]                   = useState("");
  // CSP type — defaults to the currently selected one, but user can change
  const [selectedCSPTypeId, setSelectedCSPTypeId]     = useState(CSPTypeId || "");
  const [selectedCSPTypeName, setSelectedCSPTypeName] = useState(CSPTypeName || "");

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

  // Sync CSPTypeId/Name whenever props change (including on first open)
  useEffect(() => {
    if (CSPTypeId) setSelectedCSPTypeId(CSPTypeId);
    if (CSPTypeName) setSelectedCSPTypeName(CSPTypeName);
    // If no CSPTypeId but list has items, default to first
    if (!CSPTypeId && contractedServiceProviderMaster?.length > 0) {
      setSelectedCSPTypeId(contractedServiceProviderMaster[0].id);
      setSelectedCSPTypeName(contractedServiceProviderMaster[0].contractedServiceProviderType);
    }
  }, [CSPTypeId, CSPTypeName, contractedServiceProviderMaster]);

  const saveSubmitHandler = async (type) => {
    if (!functionalTitle.trim()) {
      ErrorToaster("Functional Title is required.");
      return;
    }
    const data = {
      ...(isEdit && { id: selectedFunctionalTitlesCSPTypeCustomer?.id }),
      ...(isEdit && { createdDate: selectedFunctionalTitlesCSPTypeCustomer?.createdDate }),
      ...(isEdit && { lastModifiedDate: new Date() }),
      title: functionalTitle.trim(),
      alias1: alias1.trim(),
      alias2: alias2.trim(),
      contractedServiceProviderTypeId: selectedCSPTypeId,
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
      getFunctionalTitlesCustometData(); // reload full custom list
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

  const cspList = contractedServiceProviderMaster || [];

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
          {/* Contracted Service Provider Type dropdown */}
          <div className={style.marginTop20} style={{ width: "100%", boxSizing: "border-box" }}>
            <div className={style.entityLableStyle} style={{ marginBottom: 6 }}>
              Contracted Service Provider Type *
            </div>
            <div style={{ width: "100%", boxSizing: "border-box" }}>
              {cspList.length > 0 ? (
                <select
                  value={selectedCSPTypeId}
                  onChange={(e) => {
                    const chosen = cspList.find((c) => c.id === e.target.value);
                    setSelectedCSPTypeId(e.target.value);
                    setSelectedCSPTypeName(chosen?.contractedServiceProviderType || "");
                  }}
                  style={{ width: "100%", boxSizing: "border-box", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 4, fontSize: 13, color: "#333", background: "#fff", cursor: "pointer", display: "block" }}
                >
                  <option value="">Select Type</option>
                  {cspList.map((c) => (
                    <option key={c.id} value={c.id}>{c.contractedServiceProviderType}</option>
                  ))}
                </select>
              ) : (
                <InputGroup value={selectedCSPTypeName || CSPTypeName || ""} style={{ width: "100%", boxSizing: "border-box" }} disabled={true} />
              )}
            </div>
          </div>

          <div className={`${style.ReferenceListEntityBorder} ${style.marginTop10}`} />

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