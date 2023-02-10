import React, { useState } from "react";
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
import { useEffect } from "react";

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
  const [eventType, setEventType] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("USA");
  const [holidayId, setHolidayId] = useState("");

  useEffect(() => {
    if (isEdit) {
      setEventType(selectedHoliday?.eventType);
      setEventName(selectedHoliday?.eventName);
      setEventDate(selectedHoliday?.eventDate);
      setStateName(selectedHoliday?.stateName);
      setCountry(selectedHoliday?.country);
      setHolidayId(selectedHoliday?.id);
    }
  }, [isEdit, selectedHoliday]);

  const handleSave = async () => {
    if (!eventName && eventName === "") {
      document.getElementById("eventName").focus();
      return false;
    }

    const isPresent = holidayData.find((p) => p.eventName === eventName);

    if (isPresent) {
      ErrorToaster("Already This Name Exists");
      document.getElementById("eventName").focus();
      getAddHolidayDialog(true);
      return false;
    }

    let data = {
      ...(isEdit && { id: holidayId }),
      eventType: eventType,
      stateName: stateName,
      eventName: eventName,
      eventDate: eventDate,
      country: country,
      year: selectedYear,
      industryId: {
        id: IndustryId,
      },
    };
    if (!isEdit) {
      await POST("entity-service/holidayMaster", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("Event Added Successfully");
          getHolidayData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      await PUT(
        `entity-service/holidayMaster/${holidayId}`,
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Event Updated Successfully");
          getHolidayData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }
    getAddHolidayDialog(false);
  };

  return (
    <Dialog
      isOpen={getAddHolidayDialog}
      onClose={() => getAddHolidayDialog(false)}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            {isEdit ? "Edit" : "Add"} Company Holiday For {selectedIndustry}
          </p>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.dialogCrossStyle}
            onClick={() => getAddHolidayDialog(false)}
          />
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={`${style.editHealthCareGrid2}`}>
            <div className={style.entityLableStyle}>Event Type*</div>
            <div className={style.displayInRow}>
              <select
                name="class"
                id="Class"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className={`${style.halfWidth} ${style.transparentBackground}`}
              >
                <option value="">Select Event Type</option>
                <option value="FEDERAL">Federal</option>
                <option value="STATE">State</option>
              </select>
            </div>
          </div>
          {eventType === "STATE" && (
            <div
              className={`${style.editHealthCareGrid2} ${style.marginTop20}`}
            >
              <div className={style.entityLableStyle}>State Name*</div>
              <div className={style.displayInRow}>
                <InputGroup
                  value={stateName}
                  className={style.halfWidth}
                  onChange={(e) => setStateName(e.target.value)}
                />
              </div>
            </div>
          )}
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          <div className={style.editHealthCareGrid1}>
            <p></p>
          </div>
          <div className={`${style.addHealthCareBoxStyle}`}>
            <div className={`${style.editHealthCareGrid2}`}>
              <div className={style.entityLableStyle}>Holiday Event Name*</div>
              <div className={style.displayInRow}>
                <InputGroup
                  id="eventName"
                  value={eventName}
                  className={style.fullWidth}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
            </div>
            <div
              className={`${style.AddCompanyHolidayGrid1} ${style.marginTop20}`}
            >
              <div className={style.entityLableStyle}>Event date*</div>
              <div className={style.displayInRow}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    InputProps={{
                      style: {
                        fontSize: 14,
                        height: 30,
                      },
                    }}
                    value={eventDate}
                    onChange={(e) => {
                      setEventDate(e.target.value);
                    }}
                    inputFormat="MM-dd-yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          placeholder: "MM-DD-YYYY",
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
              <p className={`${style.entityLableStyle2}`}>
                auto: Display day of the week
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              onClick={() => getAddHolidayDialog(false)}
            >
              CANCEL
            </button>
            <button
              onClick={() => {
                handleSave();
              }}
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

export default AddCompanyHoliday;
