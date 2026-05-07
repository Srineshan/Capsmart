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
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import { POST, PUT, TenantID } from "./../dataSaver";
import style from "./index.module.scss";

const AddCompanyHolidayForCustomer = ({
  getAddCompanyHolidayDialog,
  isEdit,
  selectedHoliday,
  selectedYear,
  getHolidayData,
}) => {
  const [eventType, setEventType]   = useState("");
  const [eventName, setEventName]   = useState("");
  const [eventDate, setEventDate]   = useState(new Date());
  const [country, setCountry]       = useState("USA");
  const [year, setYear]             = useState("");
  const [stateName, setStateName]   = useState("");
  const [holidayId, setHolidayId]   = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derive the day-of-week label from eventDate
  const dayOfWeek = eventDate
    ? new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(eventDate))
    : "";

  useEffect(() => {
    if (isEdit && selectedHoliday) {
      setEventType(selectedHoliday?.eventType || "");
      setEventName(selectedHoliday?.eventName || "");
      setEventDate(selectedHoliday?.eventDate ? new Date(selectedHoliday.eventDate) : new Date());
      setStateName(selectedHoliday?.stateName || "");
      setCountry(selectedHoliday?.country    || "USA");
      setHolidayId(selectedHoliday?.id       || "");
      setYear(selectedHoliday?.year          || "");
    } else {
      resetFields();
    }
  }, [isEdit, selectedHoliday]);

  const resetFields = () => {
    setEventType("");
    setEventName("");
    setEventDate(new Date());
    setStateName("");
    setCountry("USA");
    setYear("");
    setHolidayId("");
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
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      if (isEdit) {
        const data = {
          id:        holidayId,
          eventType: eventType,
          stateName: stateName,
          eventName: eventName.trim(),
          eventDate: eventDate,
          country:   country,
          entityId:  { id: TenantID },
          year:      year,
          customized: true,
        };
        await PUT(`entity-service/holiday/${holidayId}`, JSON.stringify(data));
        SuccessToaster("Event Updated Successfully");
      } else {
        const data = [{
          eventType:  eventType,
          stateName:  stateName,
          eventName:  eventName.trim(),
          eventDate:  eventDate,
          country:    country,
          entityId:   { id: TenantID },
          year:       selectedYear,
          customized: true,
        }];
        await POST("entity-service/holiday", JSON.stringify(data));
        SuccessToaster("Event Added Successfully");
      }
      getHolidayData();
      getAddCompanyHolidayDialog(false);
    } catch (error) {
      ErrorToaster(error?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={true}
      onClose={() => getAddCompanyHolidayDialog(false)}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>

        {/* Header */}
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            {isEdit ? "Edit" : "Add"} Company Holiday
          </p>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.dialogCrossStyle}
            onClick={() => getAddCompanyHolidayDialog(false)}
          />
        </div>

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
                className={style.fullWidth}
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
                    inputFormat="MM/dd/yyyy"
                    InputProps={{ style: { fontSize: 14, height: 36 } }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        inputProps={{ ...params.inputProps, placeholder: "MM/DD/YYYY" }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
              {/* Auto display day of week */}
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
            onClick={() => getAddCompanyHolidayDialog(false)}
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

export default AddCompanyHolidayForCustomer;