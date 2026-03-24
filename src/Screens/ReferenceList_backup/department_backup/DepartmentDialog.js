import React, { useEffect, useState } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import { makeStyles } from "@material-ui/core/styles";
import { FormControlLabel, TextField, Button, Switch } from "@mui/material";
import style from "./../index.module.scss";
import ArrowDown from "./../../../images/arrowDown.png";
import AddHealthcareGroup from "./../../../images/addGroupBlue.png";
import { ErrorToaster, SuccessToaster } from "../../../utils/toaster";
import { POST, PUT } from "../../dataSaver";

const useStyles = makeStyles({
  switch: {
    color: "primary",
  },
});

const DepartmentDialog = ({ open, handleClose, isEdit, selectedApplicant }) => {
  const classes = useStyles();
  const [departName, setDepartName] = useState("");
  const [aliasName1, setAliasName1] = useState("");
  const [aliasName2, setAliasName2] = useState("");
  const [serviceName, setServiceName] = useState([]);
  const [speciality, setSpeciality] = useState(false);

  const resetFormFields = () => {
    setDepartName("");
    setAliasName1("");
    setAliasName2("");
    setServiceName("");
    setSpeciality(false);
  };

  useEffect(() => {
    if (open) {
      if (isEdit && selectedApplicant) {
        // Populate form fields in edit mode
        setDepartName(selectedApplicant.departmentName?.name || "");
        setAliasName1(selectedApplicant.aliasName1 || "");
        setAliasName2(selectedApplicant.aliasName2 || "");
        setServiceName(selectedApplicant.serviceAreas[0]?.name || "");
      } else {
        setDepartName("");
        setAliasName1("");
        setAliasName2("");
        setServiceName("");
        setSpeciality(false);
      }
    } else {
      setDepartName("");
      setAliasName1("");
      setAliasName2("");
      setServiceName("");
      setSpeciality(false);
    }
  }, [open, isEdit, selectedApplicant]);

  useEffect(() => {
    if (!isEdit) {
      setDepartName("");
      setAliasName1("");
      setAliasName2("");
      setServiceName("");
      setSpeciality(false);
    }
  }, [isEdit]);

  const SaveSubmitHandler = async (isSaveAndExit) => {
    const formattedData = {
      departmentName: {
        name: departName,
      },
      serviceAreas: [
        {
          name: serviceName,
        },
      ],
    };
    const dataToSend = [formattedData];

    if (!isEdit) {
      await POST("entity-service/department", JSON.stringify(dataToSend))
        .then((response) => {
          SuccessToaster("Applicant Type Added Successfully");
          resetFormFields();
          if (isSaveAndExit) {
            handleClose(true);
          }
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      var id = selectedApplicant.id;
      await PUT(`entity-service/department/${id}`, JSON.stringify(dataToSend))
        .then((response) => {
          SuccessToaster("Applicant Type Updated Successfully");
          resetFormFields();
          if (isSaveAndExit) {
            handleClose(true);
          }
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }
  };

  const handleDialogClose = () => {
    setDepartName("");
    setAliasName1("");
    setAliasName2("");
    setServiceName("");
    setSpeciality(false);
    handleClose();
  };

  return (
    <Dialog
      isOpen={open}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            Add/ Edit Department / Service Area for Banner Healthcare system
          </p>
          <div className={`${style.floatRight} ${style.imageSpaceAlignment}`}>
            <img
              src={
                "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/125px-Flag_of_the_United_States.svg.png"
              }
              alt="flag"
              className={`${style.departmentFlag} ${style.marginRight15} `}
            />
            <div>
              <Icon
                icon="cross"
                size={30}
                intent={Intent.DANGER}
                className={style.dialogCrossStyle}
                onClick={handleDialogClose} // Call the new close handler
              />
            </div>
          </div>
        </div>

        <div className={`${style.borderstyle} ${style.addHealthCareBoxStyle}`}>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>Site*</div>
            <div className={style.displayInRow}>
              <TextField
                placeholder="Select Site"
                value="Arizona metropolitan hospital"
                InputProps={{
                  endAdornment: (
                    <img
                      src={ArrowDown}
                      className={`${style.colorFileStyle2} ${style.ArrowDown} ${style.marginRight15}`}
                      alt=""
                    />
                  ),
                }}
                className={style.inputField}
                fullWidth
              />
            </div>
          </div>

          <div className={`${style.extentionGrid} ${style.marginTop20} `}>
            <div className={style.entityLableStyle}>Department Name*</div>

            <div className={style.displayInRow}>
              <TextField
                placeholder="Department Name"
                value={departName}
                onChange={(e) => setDepartName(e.target.value)}
                className={`${style.inputField} ${style.marginLeft30}`}
                fullWidth
              />
              <FormControlLabel
                control={
                  <img
                    src={AddHealthcareGroup}
                    alt="blue"
                    className={` ${style.marginLeft20} `}
                  />
                }
                label="ADD SERVICES"
              />
            </div>
          </div>

          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>Alias Name</div>
            <div className={style.displayInRow}>
              <TextField
                placeholder="Alias Name 1"
                value={aliasName1}
                onChange={(e) => setAliasName1(e.target.value)}
                className={`${style.inputField} ${style.gap}`}
                fullWidth
              />
              <TextField
                placeholder="Alias Name 2"
                value={aliasName2}
                onChange={(e) => setAliasName2(e.target.value)}
                className={`${style.inputField} ${style.marginLeft20}`}
                fullWidth
              />
            </div>
          </div>

          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          />

          <div
            className={`${style.inputGroup} ${style.border} ${style.marginTop20} ${style.addHealthCareBoxStyle}`}
          >
            <div className={`${style.marginTop20} ${style.extentionGrid}`}>
              <div className={style.entityLableStyle}>Service Name*</div>
              <TextField
                placeholder="Service Name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className={style.inputField}
                fullWidth
              />
            </div>

            <div className={`${style.marginTop20} ${style.extentionGrid}`}>
              <div className={style.entityLableStyle}>Alias Name</div>
              <div className={`${style.displayInRow} `}>
                <TextField
                  placeholder="Alias Name 1"
                  value={aliasName1}
                  onChange={(e) => setAliasName1(e.target.value)}
                  className={`${style.inputField} ${style.margin20}`}
                  fullWidth
                />
                <TextField
                  placeholder="Alias Name 2"
                  value={aliasName2}
                  onChange={(e) => setAliasName2(e.target.value)}
                  className={`${style.inputField} ${style.marginLeft20}`}
                  fullWidth
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
          <div></div>
          <div
            className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}
          >
            ADD MORE
          </div>
        </div>

        <div>
          <div className={`${style.floatRight} ${style.marginTop30}`}>
            <button
              className={style.outlinedButton}
              onClick={() => SaveSubmitHandler(false)}
            >
              SAVE & ADD More
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20}`}
              onClick={() => SaveSubmitHandler(true)}
            >
              SAVE & CLOSE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DepartmentDialog;
