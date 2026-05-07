import React, { useState, useEffect } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  InputGroup,
} from "@blueprintjs/core";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import style from "./index.module.scss";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import { POST, PUT } from "./../dataSaver";
import ArrowDown from "./../../images/arrowDown.png";

// ── Flag icon CDN ─────────────────────────────────────────
const injectFlagIconsCSS = () => {
  if (document.getElementById("flag-icons-css")) return;
  const link = document.createElement("link");
  link.id   = "flag-icons-css";
  link.rel  = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/css/flag-icons.min.css";
  document.head.appendChild(link);
};

const COUNTRY_LIST = [
  { code: "us", name: "USA",       label: "United States"   },
  { code: "gb", name: "UK",        label: "United Kingdom"  },
  { code: "ca", name: "Canada",    label: "Canada"          },
  { code: "au", name: "Australia", label: "Australia"       },
  { code: "in", name: "India",     label: "India"           },
  { code: "de", name: "Germany",   label: "Germany"         },
  { code: "fr", name: "France",    label: "France"          },
  { code: "sg", name: "Singapore", label: "Singapore"       },
  { code: "ae", name: "UAE",       label: "United Arab Emirates" },
  { code: "nz", name: "NZ",        label: "New Zealand"     },
];

const AddCompanyHoliday = ({
  getAddHolidayDialog,
  selectedIndustry,
  isEdit,
  selectedHoliday,
  holidayData,
  IndustryId,
  getHolidayData,
  selectedYear,
}) => {
  const [eventType, setEventType]       = useState("");
  const [eventName, setEventName]       = useState("");
  const [eventDate, setEventDate]       = useState(new Date());
  const [stateName, setStateName]       = useState("");
  const [holidayId, setHolidayId]       = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Country selector
  const [selectedCountry, setSelectedCountry]         = useState(COUNTRY_LIST[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  // Auto day-of-week
  const dayOfWeek = eventDate
    ? new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(eventDate))
    : "";

  useEffect(() => { injectFlagIconsCSS(); }, []);

  useEffect(() => {
    if (isEdit && selectedHoliday) {
      setEventType(selectedHoliday?.eventType  || "");
      setEventName(selectedHoliday?.eventName  || "");
      setEventDate(selectedHoliday?.eventDate ? new Date(selectedHoliday.eventDate) : new Date());
      setStateName(selectedHoliday?.stateName  || "");
      setHolidayId(selectedHoliday?.id         || "");
      // Restore country
      const saved = COUNTRY_LIST.find((c) => c.name === selectedHoliday?.country || c.label === selectedHoliday?.country);
      if (saved) setSelectedCountry(saved);
    } else {
      resetFields();
    }
  }, [isEdit, selectedHoliday]);

  const resetFields = () => {
    setEventType("");
    setEventName("");
    setEventDate(new Date());
    setStateName("");
    setHolidayId("");
    setSelectedCountry(COUNTRY_LIST[0]);
  };

  const validate = () => {
    if (!eventType) {
      ErrorToaster("Please select an Event Type.");
      return false;
    }
    if (!eventName.trim()) {
      ErrorToaster("Holiday Event Name is required.");
      return false;
    }
    if (eventType === "STATE" && !stateName.trim()) {
      ErrorToaster("State Name is required for State events.");
      return false;
    }
    // Duplicate check (add mode only)
    if (!isEdit) {
      const isPresent = holidayData?.find((p) => p.eventName === eventName.trim());
      if (isPresent) {
        ErrorToaster("A holiday with this name already exists.");
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    const data = {
      ...(isEdit && { id: holidayId }),
      eventType:  eventType,
      stateName:  stateName,
      eventName:  eventName.trim(),
      eventDate:  eventDate,
      country:    selectedCountry.name,
      year:       selectedYear,
      industryId: { id: IndustryId },
    };

    try {
      if (!isEdit) {
        await POST("entity-service/holidayMaster", JSON.stringify(data));
        SuccessToaster("Event Added Successfully");
      } else {
        await PUT(`entity-service/holidayMaster/${holidayId}`, JSON.stringify(data));
        SuccessToaster("Event Updated Successfully");
      }
      getHolidayData();
      getAddHolidayDialog(false);
    } catch (error) {
      ErrorToaster(error?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={true}
      onClose={() => getAddHolidayDialog(false)}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>

        {/* ── Header Row ── */}
        <div className={style.spaceBetween} style={{ alignItems: "center" }}>
          <p className={style.extensionStyle} style={{ margin: 0 }}>
            {isEdit ? "Edit" : "Add"} Company Holiday For {selectedIndustry}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

            {/* Country dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setCountryDropdownOpen((p) => !p)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "#f5f6fa", border: "1px solid #dee2e6",
                  borderRadius: 6, padding: "5px 10px",
                  cursor: "pointer", fontSize: 13, color: "#333", fontWeight: 500,
                }}
              >
                <span className={`fi fi-${selectedCountry.code}`}
                  style={{ width: 20, height: 14, borderRadius: 2, display: "inline-block" }} />
                <span>{selectedCountry.name}</span>
                <span style={{ fontSize: 10, color: "#888" }}>▼</span>
              </button>

              {countryDropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 9999,
                  background: "#fff", border: "1px solid #dee2e6", borderRadius: 8,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)", minWidth: 180, overflow: "hidden",
                }}>
                  {COUNTRY_LIST.map((c) => (
                    <div key={c.code}
                      onClick={() => { setSelectedCountry(c); setCountryDropdownOpen(false); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 14px", cursor: "pointer", fontSize: 13,
                        backgroundColor: selectedCountry.code === c.code ? "#f0f9fb" : "transparent",
                        fontWeight: selectedCountry.code === c.code ? 600 : 400,
                      }}
                      onMouseEnter={(e) => { if (selectedCountry.code !== c.code) e.currentTarget.style.backgroundColor = "#f5f6fa"; }}
                      onMouseLeave={(e) => { if (selectedCountry.code !== c.code) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      <span className={`fi fi-${c.code}`}
                        style={{ width: 20, height: 14, borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
                      <span>{c.label}</span>
                      {selectedCountry.code === c.code && (
                        <span style={{ marginLeft: "auto", color: "#06617A" }}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Icon
              icon="cross" size={20} intent={Intent.DANGER}
              className={style.dialogCrossStyle}
              onClick={() => getAddHolidayDialog(false)}
            />
          </div>
        </div>

        {/* Close dropdown on outside click */}
        {countryDropdownOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9998 }}
            onClick={() => setCountryDropdownOpen(false)} />
        )}

        <div className={style.ReferenceListEntityBorder} />

        <div className={style.addHealthCareBoxStyle}>

          {/* Event Type */}
          <div className={style.editHealthCareGrid2}>
            <div className={style.entityLableStyle}>Event Type *</div>
            <FormControl fullWidth size="small">
              <Select
                value={eventType}
                onChange={(e) => {
                  setEventType(e.target.value);
                  if (e.target.value !== "STATE") setStateName("");
                }}
                displayEmpty
                renderValue={(val) =>
                  val ? (val === "FEDERAL" ? "Federal" : "State")
                      : <span style={{ color: "#9e9e9e" }}>Select Event Type</span>
                }
                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 14 } }}
              >
                <MenuItem value="FEDERAL">Federal</MenuItem>
                <MenuItem value="STATE">State</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* State Name — shown only when eventType === STATE */}
          {eventType === "STATE" && (
            <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
              <div className={style.entityLableStyle}>State Name *</div>
              <InputGroup
                value={stateName}
                className={style.halfWidth}
                placeholder="Enter State Name"
                onChange={(e) => setStateName(e.target.value)}
              />
            </div>
          )}

          <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`} />

          {/* Holiday Event Name + Event Date */}
          <div className={`${style.addHealthCareBoxStyle} ${style.marginTop10}`}>

            <div className={style.editHealthCareGrid2}>
              <div className={style.entityLableStyle}>Holiday Event Name *</div>
              <InputGroup
                id="eventName"
                value={eventName}
                className={style.fullWidth}
                placeholder="Enter Holiday Event Name"
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>

            <div className={`${style.AddCompanyHolidayGrid1} ${style.marginTop20}`}>
              <div className={style.entityLableStyle}>Event Date *</div>
              <div className={style.displayInRow}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={eventDate}
                    onChange={(val) => setEventDate(val)}
                    inputFormat="MM-dd-yyyy"
                    InputProps={{ style: { fontSize: 14, height: 36 } }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        inputProps={{ ...params.inputProps, placeholder: "MM-DD-YYYY" }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
              {/* Auto day-of-week display */}
              {dayOfWeek && (
                <p className={style.entityLableStyle2} style={{ color: "#06617A", marginTop: 4 }}>
                  {dayOfWeek}
                </p>
              )}
              <p className={style.entityLableStyle2}>auto: Display day of the week</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${style.floatRight} ${style.marginTop20}`}>
          <button
            className={style.outlinedButton}
            onClick={() => getAddHolidayDialog(false)}
            disabled={isSubmitting}
          >
            CANCEL
          </button>
          <button
            className={`${style.buttonStyle} ${style.marginLeft20}`}
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? "SAVING..." : "SAVE"}
          </button>
        </div>

      </div>
    </Dialog>
  );
};

export default AddCompanyHoliday;