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
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CommonInputField from "../../../Components/CommonFields/CommonInputField";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Switch } from "@material-ui/core";
import { Box } from "@mui/material";
import Chip from "@mui/material/Chip";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@material-ui/icons/Email";
import Email from "./../../../images/Email.png";
import DeleteIcon from "@mui/icons-material/Delete";
const SwitchBoardDialog = ({ open }) => {
  const [applicantName, setApplicantName] = useState("");
  const [privilegeType, setPrivilegeType] = useState("");
  const [applicantType, setApplicantType] = useState("");
  const [expectedStartDate, setExpectedStartDate] = useState("");
  const [departmentArea, setDepartmentArea] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [billingNumber, setBillingNumber] = useState("");
  const [emailRecipients, setEmailRecipients] = useState([]);
  const [email, setEmail] = useState("switchboard@gmail.com");
  const [ccemail, setccEmail] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);

  const [ccRecipients, setCcRecipients] = useState([
    "HIM_clerks",
    "HIM_Coding",
  ]);
  const handleEmailSelect = (event) => {
    setEmailRecipients(event.target.value);
  };

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
        setSelectedValues([...selectedValues, email]);
        setccEmail(""); // Clear the input field
      }
    }
  };
  const handleDeleteChip = (valueToDelete) => {
    setSelectedValues(
      selectedValues.filter((value) => value !== valueToDelete)
    );
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
                  <span style={{ marginRight: "8px" }}>Cc:</span>
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

                  {selectedValues.map((value, index) => (
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
      </div>
    </Dialog>
  );
};

export default SwitchBoardDialog;
