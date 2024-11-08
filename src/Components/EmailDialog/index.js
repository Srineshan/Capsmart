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

const EmailTemplateDialog = ({ getIsOpen }) => {
  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});
  const [tasks, setTasks] = useState([]);
  const [formDetails, setFormDetails] = useState([]);
  const [templateName, setTemplateName] = useState('Application Email Template Name');
  const [recipients, setRecipients] = useState(['Reference 1']);
  const id = sessionStorage.getItem("applicationId");
  const componentRef = useRef(null);
  const [editorData, setEditorData] = useState('');


  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getPreApplication();
    getApplication();
  }, [id]);

  const handleChange = (taskId, event, label) => {
    const status = event.target.value;
    setSelectedOption((prevState) => ({
      ...prevState,
      [taskId]: status,
    }));
    updateTaskStatus(taskId, status, label);
  };

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef]);

  const handlePrintClick = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Staff Application",
    removeAfterPrint: true,
  });

  const getApplication = async () => {
    const { data: basicForm } = await GET(`application-management-service/application/${id}`);
    setFormDetails(basicForm);
  };

  const getPreApplication = async () => {
    const { data: tasks } = await GET(`application-management-service/application/${id}/tasks`);
    setTasks(tasks);
  };

  const updateTaskStatus = async (taskId, status, label) => {
    const data = { status, label };
    await POST(`application-management-service/application/${id}/task/${taskId}/execute`, data)
      .then(response => {
        SuccessToaster('Task Update Successfully');
        getPreApplication();
      })
      .catch(error => {
        ErrorToaster('Task Update Failed');
      });
  };

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
              <HourglassTopIcon className={style.templateIcon} /> 
              <SecurityIcon className={style.templateIcon} />
            </div>
            <button className={`${style.changeTemplateButton} ${style.templateButtonText}`}>Change Email Template</button>
            <img
              src={CrossPink}
              alt="cross"
              className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
              onClick={() => getIsOpen(false)}
            />
          </div>
          <CommonDivider />
          <div className={`${style.recipientsSection} ${style.marginTop10}`}>
            <div className={style.center1}>
              <MailOutlineIcon className={style.templateIcon} /> To:
              {recipients.map((recipient, index) => (
                <span key={index} className={`${style.recipient} ${style.marginTop10}`}>{recipient}</span>
              ))}
            </div>
          </div>
          <div className={style.textReference}>
            Reference check emails will be sent to each of the reference contacts individually.
          </div>
          <div className={`${style.ccSection} ${style.marginTop10}`}>
            <div className={style.center1}>
              <MailOutlineIcon className={style.templateIcon} /> Cc:
              <input type="text" className={`${style.ccInput} ${style.marginTop10}`} placeholder="Select registered user to Cc..." />
            </div>
          </div>
          <CommonDivider />
          <div className={`${style.emailContent} ${style.marginTop10} ${style.borderBoxType}`}>
            <p>Subject: Reference Check for (applicant name)</p>
          </div>
          <div className={`${style.emailContent} ${style.marginTop10} ${style.borderBoxType} ${style.greetingTextStyle}`}>
            <p>Greetings,</p>
            <p>(applicant name) has listed you as a reference in an application to (Cambridge Memorial Hospital) for an/a (privilege type) appointment.</p>
            <p>(entity name) utilizes an automated paperless credentialing & privileging software for processing of applicants. Please click on the button or link below to complete & submit the Reference Questionnaire for the applicant.</p>
            <button className={style.referenceButton}>COMPLETE REFERENCE QUESTIONNAIRE</button>
            <p>If you could kindly complete the Reference Questionnaire and return to me at your earliest convenience, it would be greatly appreciated.</p>
            <p>Please let me know if you have any questions.</p>
            <p>Warm Regards<br />(staff Manager name)<br />519-740-4934</p>
          </div>
          <div className={`${style.actionButtons} ${style.marginTop10}`}>
            
          <div  onClick={() => getIsOpen(false)}>
              <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>RESET</div>
            </div>
            <div
                className={`${style.reviewButtonStyle} ${style.reviewButtonStyle} ${style.cursorPointer}`}

              >
                <div className={style.reviewButton}>SEND</div>
              </div>
         
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EmailTemplateDialog;
