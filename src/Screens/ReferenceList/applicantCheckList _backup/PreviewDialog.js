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
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import SwitchBoardDialog from "./SwitchBoardDialog";
import CompletedIcon from "./../../../images/completedIcon.png";

const PreviewDialog = ({
  open,
  handleClose,
  selectedValue,
  selectedApplicant,
  previewData,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectOption, setSelectOption] = useState("");

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  console.log("previewDatainPreviewDialog", previewData);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
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
          <p
            className={style.extensionStyle}
          >{`Applicant Processing Status For:`}</p>
          <div className={`${style.floatRight} ${style.imageSpaceAlignment2}`}>
            <div className={style.marginRight20}>
              <PrintOutlinedIcon
                className={`${style.headerPrintIcon} ${style.cursorPointer}`}
              />
            </div>
            <div>
              <Icon
                icon="cross"
                size={30}
                intent={Intent.DANGER}
                className={style.dialogCrossStyle}
                onClick={() => handleClose()}
              />
            </div>
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className={style.entityLableStyle}>John Doe,</div>
          <div className={style.entityLableStyle4}>John Doe,</div>
          <div className={style.entityLableStyle3}>John Doe</div>
        </div>
        <div className={`${style.flexContainer} ${style.marginTop20}`}>
          {(selectedValue === 1 ||
            selectedValue === 4 ||
            selectedValue === 5 ||
            selectedValue === 6) && (
            <>
              <p>Send Email Notification To SwitchBoard</p>
              <p>Ready to Send</p>
              <p
                onClick={handleOpenDialog}
                style={{ cursor: "pointer", color: "#7165E3" }}
              >
                {selectedValue === 1
                  ? "Send To Switchboard"
                  : selectedValue === 4
                  ? "Send To Applicant"
                  : selectedValue === 5
                  ? "Send To Applicant"
                  : "Send Email"}
              </p>
            </>
          )}
          {selectedValue === 2 && (
            <>
              <img
                src={CompletedIcon}
                alt="completed"
                className={`${style.completedIconStyle}`}
              ></img>
              <div className={style.entityLableStyle}>
                Add To Outlook For Medical &Professional Staff
              </div>
              <p>Last updated</p>
              <FormControl size="small">
                <Select
                  value={selectOption}
                  onChange={(e) => setSelectOption(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select an Option
                  </MenuItem>
                  <MenuItem value={1}>Option 1</MenuItem>
                  <MenuItem value={2}>Option 2</MenuItem>
                  <MenuItem value={3}>Option 3</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </div>
      </div>
      <SwitchBoardDialog
        open={isDialogOpen}
        selectedValue={selectedValue}
        selectedApplicant={selectedApplicant}
        handleClose={handleCloseDialog}
        previewData={previewData}
      />
    </Dialog>
  );
};

export default PreviewDialog;
