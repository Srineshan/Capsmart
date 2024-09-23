import React, { useEffect, useState } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  TextArea,
  InputGroup,
  Button,
  RadioGroup,
  Radio,
} from "@blueprintjs/core";
import style from "./../index.module.scss";
import { GET, POST, PUT, TenantID } from "../../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import MaskGroup206 from "./../../../images/MaskGroup206.png";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Email from "./../../../images/Email.png";
import TableTwo from "../../../Components/TableDesignTwo";

const SwitchBoardDialog = ({
  open,
  handleClose,
  selectedValue,
  selectedApplicant,
}) => {
  const [emailRecipients, setEmailRecipients] = useState([]);
  const [ccRecipients, setCcRecipients] = useState([]);
  const [email, setEmail] = useState("switchboard@gmail.com");
  const [ccemail, setccEmail] = useState("");
  const [selectedCCValues, setSelectedCCValues] = useState([]);

  const handleEmailSelect = (event) => {
    setEmailRecipients(event.target.value);
  };
  console.log("selectedApplicant", selectedApplicant);
  const handleEmailChange = (event) => {
    const newValue = event.target.value.replace(/^To:\s*/, "");
    setEmail(newValue);
  };

  const handleCcSelect = (event) => {
    setCcRecipients(event.target.value);
  };

  const handleDelete = (recipientToDelete) => {
    setCcRecipients((recipients) =>
      recipients.filter((recipient) => recipient !== recipientToDelete)
    );
  };

  const handleCCEmailChange = (event) => {
    setccEmail(event.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Add the new value to selectedValues when Enter is pressed
      if (email.trim() !== "") {
        setSelectedCCValues([...selectedCCValues, email]);
        setccEmail(""); // Clear the input field
      }
    }
  };
  const handleDeleteChip = (valueToDelete) => {
    setSelectedCCValues(
      selectedCCValues.filter((value) => value !== valueToDelete)
    );
  };

  useEffect(() => {
    console.log("SwitchBoardDialog open:", open);
  }, [open]);

  useEffect(() => {
    if (selectedApplicant) {
      switch (selectedValue) {
        case 1:
          setEmailRecipients(
            selectedApplicant.notificationEmail?.taskEmailDetails?.recipients
              ?.recipientEmails || []
          );
          setCcRecipients(
            selectedApplicant.notificationEmail?.taskEmailDetails?.ccRecipients
              ?.recipientEmails || []
          );
          break;
        case 4:
          setEmailRecipients(
            selectedApplicant.externalFormDocument?.taskEmailDetails
              ?.recipientEmails || []
          );
          setCcRecipients(
            selectedApplicant.externalFormDocument?.taskEmailDetails
              ?.ccRecipients || []
          );
          break;
        case 5:
          setEmailRecipients(
            selectedApplicant.completedApplicantDetails?.taskEmailDetails
              ?.recipientEmails || []
          );
          setCcRecipients(
            selectedApplicant.completedApplicantDetails?.taskEmailDetails
              ?.ccRecipients || []
          );
          break;
        case 6:
          setEmailRecipients(
            selectedApplicant.formDetails?.taskEmailDetails?.recipients
              ?.recipientEmails || []
          );
          setCcRecipients(
            selectedApplicant.formDetails?.taskEmailDetails?.ccRecipients
              ?.recipientEmails || []
          );
          break;
        default:
          setEmailRecipients([]);
          setCcRecipients([]);
          break;
      }
    }
  }, [selectedValue, selectedApplicant]);

  return (
    <Dialog
      isOpen={open}
      onClose={handleClose}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p className={style.extensionStyle}>{`SwitchBoard Credentials`}</p>
            <div className={style.marginLeft20}>
              <img
                src={MaskGroup206}
                className={style.dialogCrossStyle}
                alt="Mask Group"
              />
            </div>
          </div>
          <div className={`${style.floatRight} ${style.imageSpaceAlignment}`}>
            <div>
              <Icon
                icon="cross"
                size={30}
                intent={Intent.DANGER}
                className={style.dialogCrossStyle}
                onClick={() => {
                  handleClose();
                }}
              />
            </div>
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={style.marginTop20}>
          <TextField
            value={email}
            className={`${style.fullWidth}`}
            onChange={handleEmailChange}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <img src={Email} alt="Email" />
                  <span style={{ marginRight: "8px" }}>T0:</span>
                </InputAdornment>
              ),
            }}
            required
          />
        </div>
        <div className={style.marginTop20}>
          <TextField
            value={ccemail}
            onChange={handleCCEmailChange}
            onKeyDown={handleKeyDown} // Capture Enter key press
            variant="outlined"
            className={`${style.fullWidth}`}
            placeholder="Type and press Enter"
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <img src={Email} alt="Email" />
                  <span style={{ marginRight: "8px" }}>Cc:</span>

                  {selectedCCValues.map((value, index) => (
                    <Chip
                      key={index}
                      label={value}
                      onDelete={() => handleDeleteChip(value)}
                      sx={{
                        backgroundColor: "#EDE7F6", // Light purple background
                        color: "#673AB7", // Dark purple text color
                        marginRight: "5px",
                      }}
                      deleteIcon={<span style={{ fontSize: "14px" }}>✖</span>}
                    />
                  ))}
                </InputAdornment>
              ),
            }}
            required
          />
        </div>

        <div
          className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
        ></div>
        <div className={style.marginTop20}>
          <div className={style.entityLableStyle}>
            Switchboard Credentials for {"applicantname"}
          </div>
        </div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <p>
            Hello,<br></br>
            We Have a new<br></br>
            Name:<br></br>
            phone no:<br></br>
            CPSO Number:<br></br>
            OHIP Billing Number:<br></br>
          </p>
        </div>
        {(selectedValue === 4 || selectedValue === 5) && (
          <div className={style.marginTop20}>
            <div
              className={style.entityLableStyle}
              style={{ fontStyle: "bold" }}
            >
              Would to Like to send any additional documents to the applicant?
            </div>
            <p>
              Review the list of documents available and select as
              needed.Missing Documents?
            </p>
            <TableTwo
              tableHeaderValues={[
                "CHECKBOX",
                "documentName",
                "format",
                "size",
                "Requirement",
                "lastUpdatedOn",
                "lastUpdatedBy",
              ]}
              gridStyle={style.ApplicantStyle}
              tableSortValues={[]}
            />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default SwitchBoardDialog;
