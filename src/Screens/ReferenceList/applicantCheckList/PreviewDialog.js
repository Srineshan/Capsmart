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
import WritingFile from "./../../../images/writing-file.svg";
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
import SwitchBoardDialog from "./SwitchBoardDialog";

const PreviewDialog = ({ open, handleClose }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

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
          <div className={`${style.floatRight} ${style.imageSpaceAlignment}`}>
            <PrintOutlinedIcon
              className={`${style.headerPrintIcon} ${style.cursorPointer}`}
            />
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
        <div style={{ display: "flex" }}>
          <div className={style.entityLableStyle}>John Doe,</div>
          <div className={style.entityLableStyle2}>John Doe,</div>
          <div className={style.entityLableStyle3}>John Doe</div>
        </div>
        <div className={`${style.flexContainer} ${style.marginTop20}`}>
          <p>Send Email Notification To SwitchBoard</p>
          <p> Ready to Send</p>
          <p onClick={handleOpenDialog} style={{ cursor: "pointer" }}>
            Send To Switchboard
          </p>
        </div>
      </div>
      <SwitchBoardDialog open={isDialogOpen} />
    </Dialog>
  );
};

export default PreviewDialog;
