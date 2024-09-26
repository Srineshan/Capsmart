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
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import TableTwo from "../../../Components/TableDesignTwo";
import CommonCheckBox from "../../../Components/CommonFields/CommonCheckBox";

const SwitchBoardDialog = ({
  open,
  handleClose,
  selectedValue,
  selectedApplicant,
  editorContent,
  toEmail,
  previewData,
}) => {
  const [emailRecipients, setEmailRecipients] = useState([]);
  const [ccRecipients, setCcRecipients] = useState([]);
  const [email, setEmail] = useState("switchboard@gmail.com");
  const [ccemail, setccEmail] = useState("");
  const [selectedCCValues, setSelectedCCValues] = useState([
    "static1@gmail.com",
    "static2@gmail.com",
  ]);
  const handleEmailSelect = (event) => {
    setEmailRecipients(event.target.value);
  };

  console.log("file", previewData);
  useEffect(() => {
    if (previewData) {
      const toEmails = previewData?.mail?.recipientEmails || [];
      setEmail(toEmails.join(", "));

      const ccEmails = previewData?.mail?.ccRecipientEmails || [];
      setSelectedCCValues(ccEmails);
    }
  }, [previewData]);

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
  console.log("previewDatain SwitchBoardDialog", previewData);

  const handleCCEmailChange = (event) => {
    setccEmail(event.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (email.trim() !== "") {
        setSelectedCCValues([...selectedCCValues, email]);
        setccEmail("");
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
          <div>
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
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <img src={Email} alt="Email" />
                  <span style={{ marginRight: "8px" }}>To:</span>
                </InputAdornment>
              ),
            }}
            required
          />
        </div>
        <div className={style.marginTop20}>
          <TextField
            value={ccemail}
            // onChange={handleCCEmailChange}
            // onKeyDown={handleKeyDown} // Capture Enter key press
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
          <p
            dangerouslySetInnerHTML={{ __html: previewData?.mail?.content }}
          ></p>
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
              <span className={style.spanAlignment}>Add To Library</span>
            </p>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>CHECKBOX</TableCell>
                    <TableCell>Document Name</TableCell>
                    <TableCell>Format</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Last Updated On</TableCell>
                    <TableCell>Last Updated By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData &&
                  Array.isArray(previewData.externalFormSource?.document) &&
                  previewData.externalFormSource.document.length > 0 ? (
                    previewData.externalFormSource.document.map(
                      (row, index) => (
                        <TableRow key={index} className={style.grayRow}>
                          <TableCell>
                            <CommonCheckBox />
                          </TableCell>
                          <TableCell>{row.fileName}</TableCell>
                          <TableCell>{row.fileFormat}</TableCell>
                          <TableCell>{row.fileSize}</TableCell>
                          <TableCell>{row.lastmodifiedDate}</TableCell>
                          <TableCell>{row.lastUpdatedBy}</TableCell>
                        </TableRow>
                      )
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No documents available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default SwitchBoardDialog;
