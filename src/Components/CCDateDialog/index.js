import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, POST,PUT } from "../../Screens/dataSaver";
import { Dialog } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import { format ,sub,add} from 'date-fns';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import SecurityIcon from '@mui/icons-material/Security';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { ErrorToaster, SuccessToaster } from "../../utils/toaster";
import style from "./index.module.scss";
import CommonDateField from "../CommonFields/CommonDateField";
import TextField from "@mui/material/TextField";

const CCDateDialog = ({checkedIds,getCCDateDialogOpen,onClose,selectedTab }) => {
  const id = sessionStorage.getItem("applicationId");
  const [calendarStartForCC, setCalendarStartForCC] = useState(false);
  const [selectedDateForCC, setSelectedDateForCC] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const getApplicationDateForCC = async () => {
      let meetingDate = format(new Date(selectedDateForCC), 'yyyy-MM-dd');
      let temp = [checkedIds].flat(); 
  
      await PUT(`application-management-service/application/updateMeetingDate/bulk?meetingDate=${meetingDate}`,temp)
        .then(response => {
          console.log('successfull')
          SuccessToaster("Meeting date updated successfully.");
          onClose();
        })
        .catch((error) => {
          console.log(error)
        });
    }

  console.log("ID1234",checkedIds)

  const handleDateChange = (date) => {
      const formattedDate = format(new Date(date), "yyyy-MM-dd'T'00:00")
      setSelectedDateForCC(formattedDate);
      setCalendarStartForCC(false);
      setIsButtonDisabled(false);
    };
  return (
    <Dialog
      isOpen={getCCDateDialogOpen}
      onClose={() => onClose()}
      className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
      <div>
        <div>
          <div className={style.templateHeader}>
          <div className={style.templateHeadertext}>
            {checkedIds?.length}{" "}
            {selectedTab === "level-3"
              ? "Staff Application for Presenting to CC"
              : "Staff Application Approval Date by MAC"}
          </div>
            <img
              src={CrossPink}
              alt="cross"
              className={`${style.crossStyle} ${style.cursorPointer}`}
              onClick={() => {
                onClose();
              }}
            />
          </div>
          <div>
              <CommonDateField
                className={style.fullWidth}
                onChange={(date) => handleDateChange(date)}
                open={calendarStartForCC}
                onOpen={() => setCalendarStartForCC(true)}
                onClose={() => setCalendarStartForCC(false)}
                minDate={add(new Date(), { days: 1 })}
                maxDate={add(new Date(), { years: 3 })}
                value={selectedDateForCC}
                label={selectedTab === "level-3" ? "CC Meeting Date*" : "MAC Approval Date*"}
                 InputProps={{
                  style: {
                      fontSize: 14,
                      height: 34,
                  },
              }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      placeholder: 'Start Date',
                      readOnly: true
                    }}
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              </div>
          <div className={`${style.actionButtons} ${style.marginTop10}`}>
            <div
                className={`${style.reviewButtonStyle} ${style.reviewButtonStyle}  ${isButtonDisabled ? undefined : style.cursorPointer}`}
                style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
                onClick={isButtonDisabled ? undefined : () => getApplicationDateForCC()}
              >
                <div className={style.reviewButton}>Save</div>
              </div>
         
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CCDateDialog;
