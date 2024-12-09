import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, POST } from "../../Screens/dataSaver";
import { Dialog } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";

import ReactToPrint, { useReactToPrint } from "react-to-print";
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import SecurityIcon from '@mui/icons-material/Security';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { ErrorToaster, SuccessToaster } from "../../utils/toaster";
import style from "./index.module.scss";
import CommonSelectField from "../CommonFields/CommonSelectField";
import CommonDivider from "../CommonFields/CommonDivider";
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';

const EmailTemplateDialog = ({ getIsOpen }) => {
  const [templateName, setTemplateName] = useState('{Application Email Template Name} sent');
  const [recipients, setRecipients] = useState(['Reference 1']);
  const id = sessionStorage.getItem("applicationId");

  return (
    <Dialog
      isOpen={getIsOpen}
      onClose={() => getIsOpen(false)}
      className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
      <div>
        <div className={style.emailTemplate}>
          <div className={style.templateHeader}>
            <div className={style.templateHeadertext}>
              {templateName} 
            </div>
            <img
              src={CrossPink}
              alt="cross"
              className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
              onClick={() => getIsOpen(false)}
            />
          </div>
          <div className={`${style.displayInRow} ${style.alignCenter}`}>
            <div>
          <ForwardToInboxIcon style={{ height: 100, width: 100, color: '#06617A' }} />
          </div>
          <div className={` ${style.marginLeft} `}>
            <div className={`${style.marginBottom}`}>Email notification has been send to: <br></br>applicant<br></br> Cred Comm member, COS, D COS, Dept Head</div>
          </div>
          </div>
          <div className={`${style.actionButtons} ${style.marginTop10}`}>
            <div
                className={`${style.reviewButtonStyle} ${style.reviewButtonStyle} ${style.cursorPointer}`}

              >
                <div className={style.reviewButton}>OKAY</div>
              </div>
         
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EmailTemplateDialog;
