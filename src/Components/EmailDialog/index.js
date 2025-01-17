// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { GET, POST } from "../../Screens/dataSaver";
// import { Dialog } from "@blueprintjs/core";
// import CrossPink from "../../images/crossPink.png";
// import ReactToPrint, { useReactToPrint } from "react-to-print";
// import HourglassTopIcon from '@mui/icons-material/HourglassTop';
// import SecurityIcon from '@mui/icons-material/Security';
// import MailOutlineIcon from '@mui/icons-material/MailOutline';
// import { ErrorToaster, SuccessToaster } from "../../utils/toaster";
// import style from "./index.module.scss";
// import CommonSelectField from "../CommonFields/CommonSelectField";
// import CommonDivider from "../CommonFields/CommonDivider";

// const EmailTemplateDialog = ({ getIsOpen }) => {
//   const [templateName, setTemplateName] = useState('Application Email Template Name');
//   const [recipients, setRecipients] = useState(['Reference 1']);
//   const id = sessionStorage.getItem("applicationId");

//   return (
//     <Dialog
//       isOpen={getIsOpen}
//       onClose={() => getIsOpen(false)}
//       className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
//       canOutsideClickClose={false}
//       canEscapeKeyClose={false}
//     >
//       <div>
//         <div className={style.emailTemplate}>
//           <div className={style.templateHeader}>
//             <div className={style.templateHeadertext}>
//               {templateName} 
//               <HourglassTopIcon className={style.templateIcon} /> 
//               <SecurityIcon className={style.templateIcon} />
//             </div>
//             <button className={`${style.changeTemplateButton} ${style.templateButtonText}`}>Change Email Template</button>
//             <img
//               src={CrossPink}
//               alt="cross"
//               className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
//               onClick={() => getIsOpen(false)}
//             />
//           </div>
//           <CommonDivider />
//           <div className={`${style.recipientsSection} ${style.marginTop10}`}>
//             <div className={style.center1}>
//               <MailOutlineIcon className={style.templateIcon} /> To:
//               {recipients.map((recipient, index) => (
//                 <span key={index} className={`${style.recipient} ${style.marginTop10}`}>{recipient}</span>
//               ))}
//             </div>
//           </div>
//           <div className={style.textReference}>
//             Reference check emails will be sent to each of the reference contacts individually.
//           </div>
//           <div className={`${style.ccSection} ${style.marginTop10}`}>
//             <div className={style.center1}>
//               <MailOutlineIcon className={style.templateIcon} /> Cc:
//               <input type="text" className={`${style.ccInput} ${style.marginTop10}`} placeholder="Select registered user to Cc..." />
//             </div>
//           </div>
//           <CommonDivider />
//           <div className={`${style.emailContent} ${style.marginTop10} ${style.borderBoxType}`}>
//             <p>Subject: Reference Check for (applicant name)</p>
//           </div>
//           <div className={`${style.emailContent} ${style.marginTop10} ${style.borderBoxType} ${style.greetingTextStyle}`}>
//             <p>Greetings,</p>
//             <p>(applicant name) has listed you as a reference in an application to (Cambridge Memorial Hospital) for an/a (privilege type) appointment.</p>
//             <p>(entity name) utilizes an automated paperless credentialing & privileging software for processing of applicants. Please click on the button or link below to complete & submit the Reference Questionnaire for the applicant.</p>
//             <button className={style.referenceButton}>COMPLETE REFERENCE QUESTIONNAIRE</button>
//             <p>If you could kindly complete the Reference Questionnaire and return to me at your earliest convenience, it would be greatly appreciated.</p>
//             <p>Please let me know if you have any questions.</p>
//             <p>Warm Regards<br />(staff Manager name)<br />519-740-4934</p>
//           </div>
//           <div className={`${style.actionButtons} ${style.marginTop10}`}>
            
//           <div  onClick={() => getIsOpen(false)}>
//               <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>RESET</div>
//             </div>
//             <div
//                 className={`${style.reviewButtonStyle} ${style.reviewButtonStyle} ${style.cursorPointer}`}

//               >
//                 <div className={style.reviewButton}>SEND</div>
//               </div>
         
//           </div>
//         </div>
//       </div>
//     </Dialog>
//   );
// };

// export default EmailTemplateDialog;

// pre tag added

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { GET, POST } from "../../Screens/dataSaver";
// import { Dialog } from "@blueprintjs/core";
// import CrossPink from "../../images/crossPink.png";
// import ReactToPrint, { useReactToPrint } from "react-to-print";
// import HourglassTopIcon from '@mui/icons-material/HourglassTop';
// import SecurityIcon from '@mui/icons-material/Security';
// import MailOutlineIcon from '@mui/icons-material/MailOutline';
// import { ErrorToaster, SuccessToaster } from "../../utils/toaster";
// import style from "./index.module.scss";
// import CommonSelectField from "../CommonFields/CommonSelectField";
// import CommonDivider from "../CommonFields/CommonDivider";

// const EmailTemplateDialog = ({ getIsOpen }) => {
//   const [templateName, setTemplateName] = useState('Application Email Template Name');
//   const [recipients, setRecipients] = useState(['Reference 1']);
//   const topPreRef = useRef(null);
//   const bottomPreRef = useRef(null);
  
//   const [emailContentTop, setEmailContentTop] = useState(`Greetings,

// (applicant name) has listed you as a reference in an application to (Cambridge Memorial Hospital) for an/a (privilege type) appointment.

// (entity name) utilizes an automated paperless credentialing & privileging software for processing of applicants. Please click on the button or link below to complete & submit the Reference Questionnaire for the applicant.`);

//   const [emailContentBottom, setEmailContentBottom] = useState(`If you could kindly complete the Reference Questionnaire and return to me at your earliest convenience, it would be greatly appreciated.

// Please let me know if you have any questions.

// Warm Regards
// (staff Manager name)
// 519-740-4934`);

//   const id = sessionStorage.getItem("applicationId");

//   const setCursorPosition = (element, position) => {
//     const range = document.createRange();
//     const sel = window.getSelection();
    
//     if (element.childNodes[0]) {
//       range.setStart(element.childNodes[0], position);
//       range.collapse(true);
//       sel.removeAllRanges();
//       sel.addRange(range);
//     }
//   };

//   const handleKeyPress = (e, content, setContent, ref) => {
//     const selection = window.getSelection();
//     const position = selection.getRangeAt(0).startOffset;
    
//     if (e.key === 'Backspace') {
//       e.preventDefault();
      
//       if (selection.toString()) {
//         // Handle selected text deletion
//         const start = selection.getRangeAt(0).startOffset;
//         const end = selection.getRangeAt(0).endOffset;
//         const newContent = content.slice(0, start) + content.slice(end);
//         setContent(newContent);
//         setTimeout(() => setCursorPosition(ref.current, start), 0);
//       } else if (position > 0) {
//         // Handle single character deletion
//         const newContent = content.slice(0, position - 1) + content.slice(position);
//         setContent(newContent);
//         setTimeout(() => setCursorPosition(ref.current, position - 1), 0);
//       }
//     } else if (e.key === 'Enter') {
//       e.preventDefault();
//       const newContent = content.slice(0, position) + '\n' + content.slice(position);
//       setContent(newContent);
//       setTimeout(() => setCursorPosition(ref.current, position + 1), 0);
//     }  else if (e.key.length === 1) { // Regular character input
//       e.preventDefault();
//       const newContent = content.slice(0, position) + e.key + content.slice(position);
//       setContent(newContent);
//       setTimeout(() => setCursorPosition(ref.current, position + 1), 0);
//     }
//   };

//   return (
//     <Dialog
//       isOpen={getIsOpen}
//       onClose={() => getIsOpen(false)}
//       className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
//       canOutsideClickClose={false}
//       canEscapeKeyClose={false}
//     >
//       <div>
//         <div className={style.emailTemplate}>
//           <div className={style.templateHeader}>
//             <div className={style.templateHeadertext}>
//               {templateName} 
//               <HourglassTopIcon className={style.templateIcon} /> 
//               <SecurityIcon className={style.templateIcon} />
//             </div>
//             <button className={`${style.changeTemplateButton} ${style.templateButtonText}`}>Change Email Template</button>
//             <img
//               src={CrossPink}
//               alt="cross"
//               className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
//               onClick={() => getIsOpen(false)}
//             />
//           </div>
//           <CommonDivider />
//           <div className={`${style.recipientsSection} ${style.marginTop10}`}>
//             <div className={style.center1}>
//               <MailOutlineIcon className={style.templateIcon} /> To:
//               {recipients.map((recipient, index) => (
//                 <span key={index} className={`${style.recipient} ${style.marginTop10}`}>{recipient}</span>
//               ))}
//             </div>
//           </div>
//           <div className={style.textReference}>
//             Reference check emails will be sent to each of the reference contacts individually.
//           </div>
//           <div className={`${style.ccSection} ${style.marginTop10}`}>
//             <div className={style.center1}>
//               <MailOutlineIcon className={style.templateIcon} /> Cc:
//               <input type="text" className={`${style.ccInput} ${style.marginTop10}`} placeholder="Select registered user to Cc..." />
//             </div>
//           </div>
//           <CommonDivider />
//           <div className={`${style.emailContent} ${style.marginTop10} ${style.borderBoxType}`}>
//             <p>Subject: Reference Check for (applicant name)</p>
//           </div>
//           <div className={`${style.emailContent} ${style.marginTop10} ${style.borderBoxType} ${style.greetingTextStyle}`}>
//             <pre
//               ref={topPreRef}
//               contentEditable={true}
//               suppressContentEditableWarning={true}
//               onKeyDown={(e) => handleKeyPress(e, emailContentTop, setEmailContentTop, topPreRef)}
//               className={style.editablePre}
//             >
//               {emailContentTop}
//             </pre>
            
//             <div className={style.buttonContainer}>
//               <button className={style.referenceButton}>COMPLETE REFERENCE QUESTIONNAIRE</button>
//             </div>

//             <pre
//               ref={bottomPreRef}
//               contentEditable={true}
//               suppressContentEditableWarning={true}
//               onKeyDown={(e) => handleKeyPress(e, emailContentBottom, setEmailContentBottom, bottomPreRef)}
//               className={style.editablePre}
//             >
//               {emailContentBottom}
//             </pre>
//           </div>
//           <div className={`${style.actionButtons} ${style.marginTop10}`}>
//             <div onClick={() => getIsOpen(false)}>
//               <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>RESET</div>
//             </div>
//             <div className={`${style.reviewButtonStyle} ${style.reviewButtonStyle} ${style.cursorPointer}`}>
//               <div className={style.reviewButton}>SEND</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Dialog>
//   );
// };

// export default EmailTemplateDialog;

// / corrected COde for enter 

// import React, { useState, useRef } from "react";
// import { Dialog } from "@blueprintjs/core";
// import CrossPink from "../../images/crossPink.png";
// import HourglassTopIcon from '@mui/icons-material/HourglassTop';
// import SecurityIcon from '@mui/icons-material/Security';
// import MailOutlineIcon from '@mui/icons-material/MailOutline';
// import { ErrorToaster, SuccessToaster } from "../../utils/toaster";
// import style from "./index.module.scss";
// import CommonTextField from "../CommonFields/CommonTextField";
// import CommonDivider from "../CommonFields/CommonDivider";

// const EmailTemplateDialog = ({ getIsOpen }) => {
//   const [templateName, setTemplateName] = useState('Application Email Template Name');
//   const [recipients, setRecipients] = useState(['Reference 1']);
//   const topPreRef = useRef(null);
//   const bottomPreRef = useRef(null);
//   const [subject, setSubject] = useState('Reference Check for (applicant name)');
  
//   const [emailContentTop, setEmailContentTop] = useState(`Greetings,

// (applicant name) has listed you as a reference in an application to (Cambridge Memorial Hospital) for an/a (privilege type) appointment.

// (entity name) utilizes an automated paperless credentialing & privileging software for processing of applicants. Please click on the button or link below to complete & submit the Reference Questionnaire for the applicant.`);

//   const [emailContentBottom, setEmailContentBottom] = useState(`If you could kindly complete the Reference Questionnaire and return to me at your earliest convenience, it would be greatly appreciated.

// Please let me know if you have any questions.

// Warm Regards
// (staff Manager name)
// 519-740-4934`);

//   const id = sessionStorage.getItem("applicationId");

//   const setCursorPosition = (element, position) => {
//     const range = document.createRange();
//     const sel = window.getSelection();
    
//     if (element.childNodes[0]) {
//       range.setStart(element.childNodes[0], position);
//       range.collapse(true);
//       sel.removeAllRanges();
//       sel.addRange(range);
//     }
//   };

//   const handleKeyPress = (e, content, setContent, ref) => {
//     const selection = window.getSelection();
//     const position = selection.getRangeAt(0).startOffset;
    
//     if (e.key === 'Backspace') {
//       e.preventDefault();
      
//       if (selection.toString()) {
//         // Handle selected text deletion
//         const start = selection.getRangeAt(0).startOffset;
//         const end = selection.getRangeAt(0).endOffset;
//         const newContent = content.slice(0, start) + content.slice(end);
//         setContent(newContent);
//         setTimeout(() => setCursorPosition(ref.current, start), 0);
//       } else if (position > 0) {
//         // Handle single character deletion
//         const newContent = content.slice(0, position - 1) + content.slice(position);
//         setContent(newContent);
//         setTimeout(() => setCursorPosition(ref.current, position - 1), 0);
//       }
//     } else if (e.key === 'Enter') {
//       e.preventDefault();
//       const newContent = content.slice(0, position) + '\n' + content.slice(position);
//       setContent(newContent);
//       setTimeout(() => setCursorPosition(ref.current, position + 1), 0);
//     } else if (e.key.length === 1) { // Regular character input
//       e.preventDefault();
//       const newContent = content.slice(0, position) + e.key + content.slice(position);
//       setContent(newContent);
//       setTimeout(() => setCursorPosition(ref.current, position + 1), 0);
//     }
//   };

//   const sendEmail = async () => {
//     const emailContent = `
//       Subject: ${subject}

//       ${emailContentTop}

//       <a href="https://idm.hapicaredev.com/realms/acm-hospital/protocol/openid-connect/auth?response_type=code&client_id=spring-addons-confidential&scope=openid%20profile%20email%20offline_access%20roles&state=TD0O4EGrkyBnPlMh9e-mzlVwQXwzNc_mYN8vXTzRc8k%3D&redirect_uri=https://acm-hospital.hapicaredev.com/login/oauth2/code/acm-hospital&nonce=o-YEeKvyhFoIjORycilJ06xEXzQygzpEZwX732XA5PQ" target="_blank">COMPLETE REFERENCE QUESTIONNAIRE</a>

//       ${emailContentBottom}
//     `;

//     try {
//       const response = await fetch("YOUR_EMAIL_API_ENDPOINT", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           to: "aravinthanrsnkl@gmail.com",
//           subject: subject,
//           text: emailContent
//         })
//       });

//       if (response.ok) {
//         SuccessToaster("Email sent successfully");
//       } else {
//         ErrorToaster("Failed to send email");
//       }
//     } catch (error) {
//       ErrorToaster("Error sending email");
//     }
//   };

//   return (
//     <Dialog
//       isOpen={getIsOpen}
//       onClose={() => getIsOpen(false)}
//       className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
//       canOutsideClickClose={false}
//       canEscapeKeyClose={false}
//     >
//       <div>
//         <div className={style.emailTemplate}>
//           <div className={style.templateHeader}>
//             <div className={style.templateHeadertext}>
//               {templateName} 
//               <HourglassTopIcon className={style.templateIcon} /> 
//               <SecurityIcon className={style.templateIcon} />
//             </div>
//             <button className={`${style.changeTemplateButton} ${style.templateButtonText}`}>Change Email Template</button>
//             <img
//               src={CrossPink}
//               alt="cross"
//               className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
//               onClick={() => getIsOpen(false)}
//             />
//           </div>
//           <CommonDivider />
//           <div className={`${style.recipientsSection} ${style.marginTop10}`}>
//             <div className={style.center1}>
//               <MailOutlineIcon className={style.templateIcon} /> To:
//               {recipients.map((recipient, index) => (
//                 <span key={index} className={`${style.recipient} ${style.marginTop10}`}>{recipient}</span>
//               ))}
//             </div>
//           </div>
//           <div className={style.textReference}>
//             Reference check emails will be sent to each of the reference contacts individually.
//           </div>
//           <div className={`${style.ccSection} ${style.marginTop10}`}>
//             <div className={style.center1}>
//               <MailOutlineIcon className={style.templateIcon} /> Cc:
//               <input type="text" className={`${style.ccInput} ${style.marginTop10}`} placeholder="Select registered user to Cc..." />
//             </div>
//           </div>
//           <CommonDivider />
//           <div className={`${style.emailContent} ${style.marginTop10} ${style.borderBoxType}`}>
//             <p>Subject: 
//               {/* <input
//                 type="text"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 className={style.subjectInput}
//               /> */}
//                <CommonTextField
//                 className={`${style.commentsNotesFontStyle} ${style.notesBorderStyle}`}
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 // placeholder="Enter comments and notes here"
//               />
//             </p>
//           </div>
//           <div className={`${style.emailContent} ${style.marginTop10} ${style.borderBoxType} ${style.greetingTextStyle}`}>
//             <pre
//               ref={topPreRef}
//               contentEditable={true}
//               suppressContentEditableWarning={true}
//               onKeyDown={(e) => handleKeyPress(e, emailContentTop, setEmailContentTop, topPreRef)}
//               className={style.editablePre}
//             >
//               {emailContentTop}
//             </pre>
            
//             <div className={style.buttonContainer}>
//               <a
//                 href="https://idm.hapicaredev.com/realms/acm-hospital/protocol/openid-connect/auth?response_type=code&client_id=spring-addons-confidential&scope=openid%20profile%20email%20offline_access%20roles&state=TD0O4EGrkyBnPlMh9e-mzlVwQXwzNc_mYN8vXTzRc8k%3D&redirect_uri=https://acm-hospital.hapicaredev.com/login/oauth2/code/acm-hospital&nonce=o-YEeKvyhFoIjORycilJ06xEXzQygzpEZwX732XA5PQ"
//                 target="_blank"
//                 className={style.referenceButton}
//               >
//                 COMPLETE REFERENCE QUESTIONNAIRE
//               </a>
//             </div>

//             <pre
//               ref={bottomPreRef}
//               contentEditable={true}
//               suppressContentEditableWarning={true}
//               onKeyDown={(e) => handleKeyPress(e, emailContentBottom, setEmailContentBottom, bottomPreRef)}
//               className={style.editablePre}
//             >
//               {emailContentBottom}
//             </pre>
//           </div>
//           <div className={`${style.actionButtons} ${style.marginTop10}`}>
//             <div onClick={() => getIsOpen(false)}>
//               <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>RESET</div>
//             </div>
//             <div 
//               className={`${style.reviewButtonStyle} ${style.reviewButtonStyle} ${style.cursorPointer}`}
//               onClick={sendEmail}
//             >
//               <div className={style.reviewButton}>SEND</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Dialog>
//   );
// };

// export default EmailTemplateDialog;

// / reset code 

import React, { useState,useEffect, useRef } from "react";
import { GET, POST } from "../../Screens/dataSaver";
import { Dialog } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import SecurityIcon from '@mui/icons-material/Security';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { ErrorToaster, SuccessToaster } from "../../utils/toaster";
import style from "./index.module.scss";
import CommonTextField from "../CommonFields/CommonTextField";
import CommonDivider from "../CommonFields/CommonDivider";
import EmailSendDialog from "../EmailSendDialog";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EmailTemplateDialog = ({ getIsOpen }) => {
  const initialTemplateName = 'Staff Reappointment Approved by the BOD';
  const initialRecipients = ['applicant1@email.com'];
  const initialEmailContentTop = `Hi {First name}: Praesent vehicula sem non vestibulum suscipit. Donec lectus enim, condimentum sit amet nisl et, posuere venenatis dui. Morbi tincidunt cursus odio nec gravida. We are looking forward to your response Warm Regards {sender name}`;
  const initialEmailContentBottom = `If you could kindly complete the Reference Questionnaire and return to me at your earliest convenience, it would be greatly appreciated.

Please let me know if you have any questions.

Warm Regards
$(staff Manager name)
$(519-740-4934)`;
  const initialSubject = `Reference Check for $(applicant name)`;

  const [templateName, setTemplateName] = useState(initialTemplateName);
  const [recipients, setRecipients] = useState(initialRecipients);
  const [emailContentTop, setEmailContentTop] = useState(initialEmailContentTop);
  const [emailContentBottom, setEmailContentBottom] = useState(initialEmailContentBottom);
  const [subject, setSubject] = useState(initialSubject);
    const id = sessionStorage.getItem("applicationId");

  const topPreRef = useRef(null);
  const bottomPreRef = useRef(null);
  const [isEmailReceive, setIsEmailReceive] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
  }, []);

  const getIsEmailReceive = (value) => {
    setIsEmailReceive(value);
}

  const setCursorPosition = (element, position) => {
    const range = document.createRange();
    const sel = window.getSelection();

    if (element.childNodes[0]) {
      range.setStart(element.childNodes[0], position);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const handleKeyPress = (e, content, setContent, ref) => {
    const selection = window.getSelection();
    const position = selection.getRangeAt(0).startOffset;

    if (e.key === 'Backspace') {
      e.preventDefault();

      if (selection.toString()) {
        const start = selection.getRangeAt(0).startOffset;
        const end = selection.getRangeAt(0).endOffset;
        const newContent = content.slice(0, start) + content.slice(end);
        setContent(newContent);
        setTimeout(() => setCursorPosition(ref.current, start), 0);
      } else if (position > 0) {
        const newContent = content.slice(0, position - 1) + content.slice(position);
        setContent(newContent);
        setTimeout(() => setCursorPosition(ref.current, position - 1), 0);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const newContent = content.slice(0, position) + '\n' + content.slice(position);
      setContent(newContent);
      setTimeout(() => setCursorPosition(ref.current, position + 1), 0);
    } else if (e.key.length === 1) {
      e.preventDefault();
      const newContent = content.slice(0, position) + e.key + content.slice(position);
      setContent(newContent);
      setTimeout(() => setCursorPosition(ref.current, position + 1), 0);
    }
  };

  const sendEmail = async () => {
    const emailContent = `
      Subject: ${subject}

      ${emailContentTop}

      <a href="https://idm.hapicaredev.com/realms/acm-hospital/protocol/openid-connect/auth?response_type=code&client_id=spring-addons-confidential&scope=openid%20profile%20email%20offline_access%20roles&state=TD0O4EGrkyBnPlMh9e-mzlVwQXwzNc_mYN8vXTzRc8k%3D&redirect_uri=https://acm-hospital.hapicaredev.com/login/oauth2/code/acm-hospital&nonce=o-YEeKvyhFoIjORycilJ06xEXzQygzpEZwX732XA5PQ" target="_blank">COMPLETE REFERENCE QUESTIONNAIRE</a>

      ${emailContentBottom}
    `;

    // try {
    //   const response = await fetch("YOUR_EMAIL_API_ENDPOINT", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //       to: "aravinthanrsnkl@gmail.com",
    //       subject: subject,
    //       text: emailContent
    //     })
    //   });

    //   if (response.ok) {
    //     SuccessToaster("Email sent successfully");
    //   } else {
    //     const errorData = await response.json();
    //     console.error("Error response:", errorData);
    //     ErrorToaster(`Failed to send email: ${response.status} ${response.statusText}`);
    //   }
    // } catch (error) {
    //   console.error("Error sending email:", error);
    //   ErrorToaster(`Error sending email: ${error.message}`);
    // }

    try {
      const response = await POST(`application-management-service/application/${id}/sendEmail`, {
        body:({
          to: "aravinthanrsnkl@gmail.com",
          subject: subject,
          text: emailContent,
        }),
      });
  
      if (response.ok) {
        SuccessToaster('Task Update Successfully');
        console.log(response?.data);
        // window.location.reload();  // Uncomment if needed
        // getPreApplication();  // Uncomment if needed
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      ErrorToaster('Task Update Failed');
      console.error(error);
    }
  };



  const resetFields = () => {
    setTemplateName(initialTemplateName);
    setRecipients(initialRecipients);
    setEmailContentTop(initialEmailContentTop);
    setEmailContentBottom(initialEmailContentBottom);
    setSubject(initialSubject);
  };

  const onClickEmailSendFunction = (data) => {
    getIsOpen(false);
    getIsEmailReceive(true);
  };

  const handleRemoveRecipient = (index) => {
    const updatedRecipients = recipients.filter((_, i) => i !== index);
    setRecipients(updatedRecipients);
  };

    const handleEditorChange = (setState) => (event, editor) => {
    let data = editor.getData();
    setState(data);
  };

  return (
    <>
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
              {templateName}{" "}
              <HourglassTopIcon className={style.templateIcon} />{" "}
              <SecurityIcon className={style.templateIcon} />
            </div>
            <button className={`${style.changeTemplateButton} ${style.templateButtonText}`}>SEND</button>
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
                <div key={index} className={`${style.emailInputContainer} ${style.alignCenter}`}>
                  <input
                    type="email"
                    className={style.emailInput}
                    value={recipient}
                    readOnly
                  />
                  <button className={style.closeButton} onClick={() => handleRemoveRecipient(index)}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={`${style.ccSection} ${style.marginTop10}`}>
            <div className={style.center1}>
              <MailOutlineIcon className={style.templateIcon} /> Cc:
              <input type="text" className={`${style.ccInput} ${style.marginTop10}`} placeholder="Select registered user to Cc..." />
            </div>
          </div>
          <CommonDivider />
          <div className={`${style.emailContent} ${style.marginTop10} ${style.borderBoxType}`}>
             <p>Subject: 
               {/* <input
//                 type="text"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 className={style.subjectInput}
//               /> */}
                <CommonTextField
                 className={`${style.commentsNotesFontStyle} ${style.notesBorderStyle}`}
                 value={subject}
                 onChange={(e) => setSubject(e.target.value)}
                 // placeholder="Enter comments and notes here"
               />
             </p>
           </div>
          <div className={`${style.emailContent} ${style.marginTop10} ${style.borderBoxType} ${style.greetingTextStyle}`}>
            {/* <pre
              ref={topPreRef}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onKeyDown={(e) => handleKeyPress(e, emailContentTop, setEmailContentTop, topPreRef)}
              className={style.editablePre}
            >
              {emailContentTop}
            </pre>
            <div className={style.buttonContainer}>
              <a
                href="https://idm.hapicaredev.com/realms/acm-hospital/protocol/openid-connect/auth?response_type=code&client_id=spring-addons-confidential&scope=openid%20profile%20email%20offline_access%20roles&state=TD0O4EGrkyBnPlMh9e-mzlVwQXwzNc_mYN8vXTzRc8k%3D&redirect_uri=https://acm-hospital.hapicaredev.com/login/oauth2/code/acm-hospital&nonce=o-YEeKvyhFoIjORycilJ06xEXzQygzpEZwX732XA5PQ"
                target="_blank"
                className={style.referenceButton}
              >
                COMPLETE REFERENCE QUESTIONNAIRE
              </a>
            </div>
            <pre
              ref={bottomPreRef}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onKeyDown={(e) => handleKeyPress(e, emailContentBottom, setEmailContentBottom, bottomPreRef)}
              className={style.editablePre}
            >
              {emailContentBottom}
            </pre> */}
            <CKEditor
            editor={ClassicEditor}
            data={emailContentTop}
            config={{
              removePlugins: ['Title'],
              allowedContent: true,
              extraAllowedContent: 'pre; div; span; p;',
              toolbar: {
                shouldNotGroupWhenFull: true,
                sticky: true,
                items: [
                  'undo', 'redo',
                  '|',
                  'heading',
                  '|',
                  'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                  '|',
                  'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                  '|',
                  'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
              ],
              },
              autoGrow: false,
            }}
            onChange={handleEditorChange(setEmailContentTop)}
          />

          </div>
          {/* <div className={`${style.footer} ${style.marginTop10}`}>
            <div className={style.footerButtons}>
              <div onClick={sendEmail}>
                <div className={`${style.sendButton} ${style.sendButtonTextStyle}`}>SEND</div>
              </div>
              <div onClick={resetFields}>
                <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>RESET</div>
              </div>
              <div onClick={() => getIsOpen(false)}>
                <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>CANCEL</div>
              </div>
            </div>
          </div> */}
            <div className={`${style.actionButtons} ${style.marginTop10}`}>
            <div onClick={resetFields}>
              <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>RESET</div>
            </div>
            <div 
              className={`${style.reviewButtonStyle} ${style.reviewButtonStyle} ${style.cursorPointer}`}
              onClick={() => getIsEmailReceive(true)}
           >
             <div className={style.reviewButton}>SEND</div>
           </div>
           </div>
        </div>
      </div>
    </Dialog>
    {
                isEmailReceive && (
                    <EmailSendDialog getIsOpen={getIsEmailReceive} />
                )
            }
    </>
  );
};

export default EmailTemplateDialog;


// import React, { useState,useEffect, useRef } from "react";
// import { GET, POST } from "../../Screens/dataSaver";
// import { Dialog } from "@blueprintjs/core";
// import CrossPink from "../../images/crossPink.png";
// import HourglassTopIcon from '@mui/icons-material/HourglassTop';
// import SecurityIcon from '@mui/icons-material/Security';
// import MailOutlineIcon from '@mui/icons-material/MailOutline';
// import { ErrorToaster, SuccessToaster } from "../../utils/toaster";
// import style from "./index.module.scss";
// import CommonTextField from "../CommonFields/CommonTextField";
// import CommonDivider from "../CommonFields/CommonDivider";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


// const EmailTemplateDialog = ({ getIsOpen }) => {
//   const initialTemplateName = 'Application Email Template Name';
//   const initialRecipients = ['Reference 1'];
//   const initialEmailContentTop = `Greetings,

// $(applicant name) has listed you as a reference in an application to $(Cambridge Memorial Hospital) for an/a $(privilege type) appointment.

// $(entity name) utilizes an automated paperless credentialing & privileging software for processing of applicants. Please click on the button or link below to complete & submit the Reference Questionnaire for the applicant.`;
//   const initialEmailContentBottom = `If you could kindly complete the Reference Questionnaire and return to me at your earliest convenience, it would be greatly appreciated.

// Please let me know if you have any questions.

// Warm Regards
// $(staff Manager name)
// $(519-740-4934)`;
//   const initialSubject = `Reference Check for $(applicant name)`;

//   const [templateName, setTemplateName] = useState(initialTemplateName);
//   const [recipients, setRecipients] = useState(initialRecipients);
//   const [emailContentTop, setEmailContentTop] = useState(initialEmailContentTop);
//   const [emailContentBottom, setEmailContentBottom] = useState(initialEmailContentBottom);
//   const [subject, setSubject] = useState(initialSubject);
//     const id = sessionStorage.getItem("applicationId");

//   const topPreRef = useRef(null);
//   const bottomPreRef = useRef(null);

//   useEffect(() => {
//     sessionStorage.setItem("fromSummary", false);
//   }, []);

//   const setCursorPosition = (element, position) => {
//     const range = document.createRange();
//     const sel = window.getSelection();

//     if (element.childNodes[0]) {
//       range.setStart(element.childNodes[0], position);
//       range.collapse(true);
//       sel.removeAllRanges();
//       sel.addRange(range);
//     }
//   };

//   const handleKeyPress = (e, content, setContent, ref) => {
//     const selection = window.getSelection();
//     const position = selection.getRangeAt(0).startOffset;

//     if (e.key === 'Backspace') {
//       e.preventDefault();

//       if (selection.toString()) {
//         const start = selection.getRangeAt(0).startOffset;
//         const end = selection.getRangeAt(0).endOffset;
//         const newContent = content.slice(0, start) + content.slice(end);
//         setContent(newContent);
//         setTimeout(() => setCursorPosition(ref.current, start), 0);
//       } else if (position > 0) {
//         const newContent = content.slice(0, position - 1) + content.slice(position);
//         setContent(newContent);
//         setTimeout(() => setCursorPosition(ref.current, position - 1), 0);
//       }
//     } else if (e.key === 'Enter') {
//       e.preventDefault();
//       const newContent = content.slice(0, position) + '\n' + content.slice(position);
//       setContent(newContent);
//       setTimeout(() => setCursorPosition(ref.current, position + 1), 0);
//     } else if (e.key.length === 1) {
//       e.preventDefault();
//       const newContent = content.slice(0, position) + e.key + content.slice(position);
//       setContent(newContent);
//       setTimeout(() => setCursorPosition(ref.current, position + 1), 0);
//     }
//   };

//   const sendEmail = async () => {
//     const emailContent = `
//       Subject: ${subject}

//       ${emailContentTop}

//       <a href="https://idm.hapicaredev.com/realms/acm-hospital/protocol/openid-connect/auth?response_type=code&client_id=spring-addons-confidential&scope=openid%20profile%20email%20offline_access%20roles&state=TD0O4EGrkyBnPlMh9e-mzlVwQXwzNc_mYN8vXTzRc8k%3D&redirect_uri=https://acm-hospital.hapicaredev.com/login/oauth2/code/acm-hospital&nonce=o-YEeKvyhFoIjORycilJ06xEXzQygzpEZwX732XA5PQ" target="_blank">COMPLETE REFERENCE QUESTIONNAIRE</a>

//       ${emailContentBottom}
//     `;

//     // try {
//     //   const response = await fetch("YOUR_EMAIL_API_ENDPOINT", {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "application/json"
//     //     },
//     //     body: JSON.stringify({
//     //       to: "aravinthanrsnkl@gmail.com",
//     //       subject: subject,
//     //       text: emailContent
//     //     })
//     //   });

//     //   if (response.ok) {
//     //     SuccessToaster("Email sent successfully");
//     //   } else {
//     //     const errorData = await response.json();
//     //     console.error("Error response:", errorData);
//     //     ErrorToaster(`Failed to send email: ${response.status} ${response.statusText}`);
//     //   }
//     // } catch (error) {
//     //   console.error("Error sending email:", error);
//     //   ErrorToaster(`Error sending email: ${error.message}`);
//     // }

//     try {
//       const response = await POST(`application-management-service/application/${id}/sendEmail`, {
//         body:({
//           to: "aravinthanrsnkl@gmail.com",
//           subject: subject,
//           text: emailContent,
//         }),
//       });
  
//       if (response.ok) {
//         SuccessToaster('Task Update Successfully');
//         console.log(response?.data);
//         // window.location.reload();  // Uncomment if needed
//         // getPreApplication();  // Uncomment if needed
//       } else {
//         throw new Error('Failed to send email');
//       }
//     } catch (error) {
//       ErrorToaster('Task Update Failed');
//       console.error(error);
//     }
//   };

//   const resetFields = () => {
//     setTemplateName(initialTemplateName);
//     setRecipients(initialRecipients);
//     setEmailContentTop(initialEmailContentTop);
//     setEmailContentBottom(initialEmailContentBottom);
//     setSubject(initialSubject);
//   };

//   const handleEditorChange = (setState) => (event, editor) => {
//     let data = editor.getData();
//     setState(data);
//   };


//   return (
//     <Dialog
//       isOpen={getIsOpen}
//       onClose={() => getIsOpen(false)}
//       className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
//       canOutsideClickClose={false}
//       canEscapeKeyClose={false}
//     >
//       <div>
//         <div className={style.emailTemplate}>
//           <div className={style.templateHeader}>
//             <div className={style.templateHeadertext}>
//               {templateName}
//               <HourglassTopIcon className={style.templateIcon} />
//               <SecurityIcon className={style.templateIcon} />
//             </div>
//             <button className={`${style.changeTemplateButton} ${style.templateButtonText}`}>Change Email Template</button>
//             <img
//               src={CrossPink}
//               alt="cross"
//               className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
//               onClick={() => getIsOpen(false)}
//             />
//           </div>
//           <CommonDivider />
//           <div className={`${style.recipientsSection} ${style.marginTop10}`}>
//             <div className={style.center1}>
//               <MailOutlineIcon className={style.templateIcon} /> To:
//               {recipients.map((recipient, index) => (
//                 <span key={index} className={`${style.recipient} ${style.marginTop10}`}>{recipient}</span>
//               ))}
//             </div>
//           </div>
//           <div className={style.textReference}>
//             Reference check emails will be sent to each of the reference contacts individually.
//           </div>
//           <div className={`${style.ccSection} ${style.marginTop10}`}>
//             <div className={style.center1}>
//               <MailOutlineIcon className={style.templateIcon} /> Cc:
//               <input type="text" className={`${style.ccInput} ${style.marginTop10}`} placeholder="Select registered user to Cc..." />
//             </div>
//           </div>
//           <CommonDivider />
//           <div className={`${style.emailContent} ${style.marginTop10} ${style.borderBoxType}`}>
//              <p>Subject: 
//                {/* <input
// //                 type="text"
// //                 value={subject}
// //                 onChange={(e) => setSubject(e.target.value)}
// //                 className={style.subjectInput}
// //               /> */}
//                 <CommonTextField
//                  className={`${style.commentsNotesFontStyle} ${style.notesBorderStyle}`}
//                  value={subject}
//                  onChange={(e) => setSubject(e.target.value)}
//                  // placeholder="Enter comments and notes here"
//                />
//              </p>
//            </div>
//           {/* <div className={`${style.emailContent} ${style.marginTop10} ${style.borderBoxType} ${style.greetingTextStyle}`}>
//             <pre
//               ref={topPreRef}
//               contentEditable={true}
//               suppressContentEditableWarning={true}
//               onKeyDown={(e) => handleKeyPress(e, emailContentTop, setEmailContentTop, topPreRef)}
//               className={style.editablePre}
//             >
//               {emailContentTop}
//             </pre>
//             <div className={style.buttonContainer}>
//               <a
//                 href="https://idm.hapicaredev.com/realms/acm-hospital/protocol/openid-connect/auth?response_type=code&client_id=spring-addons-confidential&scope=openid%20profile%20email%20offline_access%20roles&state=TD0O4EGrkyBnPlMh9e-mzlVwQXwzNc_mYN8vXTzRc8k%3D&redirect_uri=https://acm-hospital.hapicaredev.com/login/oauth2/code/acm-hospital&nonce=o-YEeKvyhFoIjORycilJ06xEXzQygzpEZwX732XA5PQ"
//                 target="_blank"
//                 className={style.referenceButton}
//               >
//                 COMPLETE REFERENCE QUESTIONNAIRE
//               </a>
//             </div>
//             <pre
//               ref={bottomPreRef}
//               contentEditable={true}
//               suppressContentEditableWarning={true}
//               onKeyDown={(e) => handleKeyPress(e, emailContentBottom, setEmailContentBottom, bottomPreRef)}
//               className={style.editablePre}
//             >
//               {emailContentBottom}
//             </pre>
//           </div> */}
//           {/* <div className={`${style.footer} ${style.marginTop10}`}>
//             <div className={style.footerButtons}>
//               <div onClick={sendEmail}>
//                 <div className={`${style.sendButton} ${style.sendButtonTextStyle}`}>SEND</div>
//               </div>
//               <div onClick={resetFields}>
//                 <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>RESET</div>
//               </div>
//               <div onClick={() => getIsOpen(false)}>
//                 <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>CANCEL</div>
//               </div>
//             </div>
//           </div> */}
//            <CKEditor
//         editor={ClassicEditor}
//         data={emailContentTop}
//         config={{
//           removePlugins: ['Title'],
//           allowedContent: true,
//           extraAllowedContent: 'pre; div; span; p;'
//         }}
//         onChange={handleEditorChange(setEmailContentTop)}
//       />

//             <div className={style.buttonContainer}>
//               <a
//                 href="https://idm.hapicaredev.com/realms/acm-hospital/protocol/openid-connect/auth?response_type=code&client_id=spring-addons-confidential&scope=openid%20profile%20email%20offline_access%20roles&state=TD0O4EGrkyBnPlMh9e-mzlVwQXwzNc_mYN8vXTzRc8k%3D&redirect_uri=https://acm-hospital.hapicaredev.com/login/oauth2/code/acm-hospital&nonce=o-YEeKvyhFoIjORycilJ06xEXzQygzpEZwX732XA5PQ"
//                 target="_blank"
//                 className={style.referenceButton}
//               >
//                 COMPLETE REFERENCE QUESTIONNAIRE
//               </a>
//             </div>

//             <CKEditor
//         editor={ClassicEditor}
//         data={emailContentBottom}
//         config={{
//           removePlugins: ['Title'],
//           allowedContent: true,
//           extraAllowedContent: 'pre; div; span; p;'
//         }}
//         onChange={handleEditorChange(setEmailContentBottom)}
//       />
//             <div className={`${style.actionButtons} ${style.marginTop10}`}>
//             <div onClick={resetFields}>
//               <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>RESET</div>
//             </div>
//             <div 
//               className={`${style.reviewButtonStyle} ${style.reviewButtonStyle} ${style.cursorPointer}`}
//              onClick={sendEmail}
//            >
//              <div className={style.reviewButton}>SEND</div>
//            </div>
//            </div>
//         </div>
//       </div>
//     </Dialog>
//   );
// };

// export default EmailTemplateDialog;


