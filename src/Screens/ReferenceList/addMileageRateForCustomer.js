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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import { POST, PUT, TenantID } from "./../dataSaver";
import style from "./index.module.scss";
import CrossPink from "./../../images/crossPink.png";

const AddMileageRateForCustomer = ({
  getAddMileageRateDialog,
  isEdit,
  getMileageRateData,
  mileageRateData,
  selectedMileageRate
}) => {

  const [mileageRateId, setMileageRateId] = useState("");
  const [mileageRateValue, setMileageRateValue] = useState(0);
  const [selectedYear, setSelectedYear] = useState("");
  const [createdDate, setCreatedDate] = useState("");

  const yearsData = Array.from(
    { length: 20 },
    (_, index) => new Date().getFullYear() + index
  );

  // console.log(selectedMileageRate)
  useEffect(() => {
    if (isEdit) {
      setMileageRateId(selectedMileageRate?.id);
      setMileageRateValue(selectedMileageRate?.mileageRate?.value);
      setSelectedYear(selectedMileageRate?.year);
      setCreatedDate(selectedMileageRate?.createdDate);
    }
  }, [isEdit, selectedMileageRate]);

  const handleSave = async () => {

    if (mileageRateValue === null || mileageRateValue === undefined|| mileageRateValue === 0|| mileageRateValue === "") {
      ErrorToaster('Enter Mileage Rate');
      return;
    }

    if (selectedYear === null || selectedYear === undefined|| selectedYear === "") {
      ErrorToaster('Select Year');
      return;
    }

    if (isEdit) {
      let data = {
        "id": mileageRateId,
        "year": selectedYear,
        "entityId": {
          "id": TenantID,
        },
        "mileageRate": {
          "value": Number(mileageRateValue),
        },
        "createdDate":createdDate,
      };
      await PUT(`entity-service/mileageRate/${mileageRateId}`, JSON.stringify(data))
        .then((response) => {
          SuccessToaster("MileageRate Updated Successfully");
          getAddMileageRateDialog(false);
          getMileageRateData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      let data = [
        {
          "year": selectedYear,
          "entityId": {
            "id": TenantID,
          },
          "mileageRate": {
            "value": Number(mileageRateValue),
          },
        },
      ];
      await POST("entity-service/mileageRate", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("MileageRate Added Successfully");
          getAddMileageRateDialog(false);
          getMileageRateData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }
  };

 
// Filter array1 to exclude years present in array2
// const filteredArray1 = yearsData.filter(year => !mileageRateData.some(obj => obj.year === String(year)));
// console.log(filteredArray1);

return (
    <Dialog
      isOpen={getAddMileageRateDialog}
      onClose={() => getAddMileageRateDialog(false)}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            {isEdit ? "Edit" : "Add"} Mileage Rate
          </p>
          <img
            src={CrossPink}
            alt=""
            className={`${style.colorFileStyle2} ${style.marginLeft20}`}
            onClick={() => getAddMileageRateDialog(false)}
          />
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={`${style.editHealthCareGrid2}`}>
            <div className={style.entityLableStyle}>Year*</div>
            <div className={style.displayInRow}>
              <select
                name="class"
                id="Class"
                value={selectedYear} 
                disabled={isEdit ? selectedYear : ""}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={`${style.halfWidth} ${style.transparentBackground}`}
              >
                {!isEdit &&  <option value="">Select a year</option> }
                {isEdit ?  yearsData
                    .map((year,index)=>{
                      return (
                        <option key={index} value={year}>{year}</option>
                      )
                    }) : 
                     yearsData
                      .filter((data) => !mileageRateData.some((rate) => rate.year === String(data)))
                      .map((year,index)=>{
                        return (
                          <option key={index} value={year}>{year}</option>
                        )
                      })
                     
                  }  
              </select>
            </div>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          <div className={style.editHealthCareGrid1}>
            <p></p>
          </div>
          <div className={`${style.addHealthCareBoxStyle}`}>
            <div className={`${style.editHealthCareGrid2}`}>
              <div className={style.entityLableStyle}>Mileage Rate*</div>
              <div className={style.displayInRow}>
                <InputGroup
                  value={mileageRateValue}
                  onChange={(e) =>{
                    if(!isNaN(Number(e.target.value))){
                      setMileageRateValue(e.target.value)}
                    }
                  } 
                  className={style.fullWidth}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              onClick={() => getAddMileageRateDialog(false)}
            >
              CANCEL
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20}`}
              onClick={() => handleSave()}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddMileageRateForCustomer;
