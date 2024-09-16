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
import { Switch, makeStyles } from "@material-ui/core";
import { Box } from "@mui/material";
import Chip from "@mui/material/Chip";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

const SwitchBoardDialog = ({ open }) => {
  const [applicantName, setApplicantName] = useState("");
  const [privilegeType, setPrivilegeType] = useState("");
  const [applicantType, setApplicantType] = useState("");
  const [expectedStartDate, setExpectedStartDate] = useState("");
  const [departmentArea, setDepartmentArea] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [billingNumber, setBillingNumber] = useState("");
  const [emailRecipients, setEmailRecipients] = useState([]);
  const [ccRecipients, setCcRecipients] = useState([]);
  const [email, setEmail] = useState("switchboard@gmail.com");

  const availableEmails = ["HIM_clerks", "HIM_Coding"]; // Example emails for CC

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

  return (
    <Dialog
      isOpen={open}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div style={{ display: "flex" }}>
          <p className={style.extensionStyle}>{`SwitchBoard Credentials`}</p>
          <img
            src={MaskGroup206}
            className={style.dialogCrossStyle}
            alt="Mask Group"
          />

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
          <CommonInputField
            value={`To: ${email}`} // Prepend "To: " to the value
            className={style.fullWidth}
            multiple
            onChange={handleEmailChange} // handle input change
            required={true}
          />
        </div>
        <div className={style.marginTop20}>
          <CommonInputField
            value={""}
            className={style.fullWidth}
            multiple
            placeholder={`CC: ${"switchboard@gmail.com"}`}
            required={true}
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
