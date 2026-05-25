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
import { POST, PUT, TenantID } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import { useEffect } from "react";

// ── Country flag dropdown ─────────────────────────────────────────────────────
const COUNTRY_LIST = [
  { code: "us", name: "USA",         label: "United States"        },
  { code: "gb", name: "UK",          label: "United Kingdom"       },
  { code: "ca", name: "Canada",      label: "Canada"               },
  { code: "au", name: "Australia",   label: "Australia"            },
  { code: "in", name: "India",       label: "India"                },
  { code: "de", name: "Germany",     label: "Germany"              },
  { code: "fr", name: "France",      label: "France"               },
  { code: "sg", name: "Singapore",   label: "Singapore"            },
  { code: "ae", name: "UAE",         label: "United Arab Emirates" },
  { code: "nz", name: "New Zealand", label: "New Zealand"          },
];

const FlagImg = ({ code, size = 20 }) => (
  <img
    src={`https://flagcdn.com/w${size}/${code}.png`}
    srcSet={`https://flagcdn.com/w${size * 2}/${code}.png 2x`}
    width={size}
    height={Math.round(size * 0.67)}
    alt={code.toUpperCase()}
    style={{ objectFit: "cover", borderRadius: 2, flexShrink: 0 }}
    onError={(e) => { e.target.style.display = "none"; }}
  />
);

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

  // ── Country dropdown state ─────────────────────────────────────────────────
  const [selectedCountry, setSelectedCountry]         = useState(COUNTRY_LIST[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  const saveSubmitHandler = async (type) => {
    // FIX 1: Skip duplicate check in edit mode to allow saving unchanged name
    const isPresent = !isEdit && tableEntityData.find((p) => p.suffix === entityName);
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
        .then(() => {
          SuccessToaster("Event Added Successfully");
          // FIX 2: Removed duplicate getEntityData() call here; called once below
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      await PUT(`${ApiUrl}/${data?.id}`, JSON.stringify(ApiData))
        .then(() => {
          SuccessToaster("Event Updated Successfully");
          // FIX 2: Removed duplicate getEntityData() call here; called once below
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
      getEntityData(); // FIX 2: Single call — refreshes list after close
    } else {
      getEntityData(); // FIX 2: Single call — refreshes list after "Add More"
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* ── Country dropdown ── */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setCountryDropdownOpen((p) => !p)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "#f5f5f5", border: "1px solid #ccc",
                  borderRadius: 4, padding: "4px 10px", cursor: "pointer",
                  font: "normal normal 600 13px/18px var(--font-style)",
                  color: "#333",
                }}
              >
                <FlagImg code={selectedCountry.code} size={20} />
                <span>{selectedCountry.name}</span>
                <span style={{ fontSize: 9, color: "#777", marginLeft: 2 }}>▾</span>
              </button>
              {countryDropdownOpen && (
                <>
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 9998 }}
                    onClick={() => setCountryDropdownOpen(false)}
                  />
                  <div style={{
                    position: "absolute", top: "110%", right: 0, zIndex: 9999,
                    background: "#fff", border: "1px solid #ddd", borderRadius: 6,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)", minWidth: 220,
                    maxHeight: 280, overflowY: "auto",
                  }}>
                    {COUNTRY_LIST.map((c) => (
                      <div
                        key={c.code}
                        onClick={() => { setSelectedCountry(c); setCountryDropdownOpen(false); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "9px 14px", cursor: "pointer", fontSize: 13,
                          backgroundColor: c.code === selectedCountry.code ? "#e8f4f7" : "transparent",
                          fontWeight: c.code === selectedCountry.code ? 600 : 400,
                        }}
                      >
                        <FlagImg code={c.code} size={20} />
                        <span style={{ flex: 1 }}>{c.label}</span>
                        <span style={{ color: "#aaa", fontSize: 11 }}>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
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