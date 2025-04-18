
import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT, POST, TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LoadingScreen from "../LoadingScreen";
import CommonInputField from "../CommonFields/CommonInputField";
import DocumentClarificationDialog from "../DocumentClarificationDialog"
import { Tooltip } from "@mui/material";

const ClarificationDialog = ({ getIsOpen, data, type, getDocumentClarificationDialog, dateFormat, getActiveApplicationView, selectedTab }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [userNotes, setUserNotes] = useState('');
  const [logDetails, setLogDetails] = useState([]);
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const id = sessionStorage.getItem("applicationId");
  const [applicationType, setApplicationType] = useState(() =>
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isOpenDocumentClarificationDialog, setIsOpenDocumentClarificationDialog] = useState(false);
  const [clarificationSubject, setClarificationSubject] = useState("");
  const [form, setForm] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
    getLog();
  }, [applicationType]);

  useEffect(() => {
    checkApproveEnabled();
  }, [userNotes, clarificationSubject]);

  useEffect(() => {
    setUserDetails();
  }, [users?.id])

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    console.log("userdataaaa" + JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUserRole(userData?.roles?.map((data) => data?.roleName));
  }

  const getApplication = async () => {
    try {
      setIsLoadingImage(true);
      const { data: basicForm } = await GET(`application-management-service/application/${id}`);
      setFormDetails(basicForm);
      setIsLoadingImage(false)
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };

  const getLog = async () => {
    setIsLoadingImage(true);
    const { data: basicLog } = await GET(`application-management-service/application/${id}/logs`);
    setLogDetails(basicLog);
    console.log("basicLog" + JSON.stringify(basicLog));
    setIsLoadingImage(false)
  };

  const checkApproveEnabled = () => {
    const hasValidComments = userNotes.trim() !== '';
    const hasValidSubject = clarificationSubject.trim() !== '';
    setIsApproveEnabled(hasValidComments && hasValidSubject);
  };

  //   const getIsShowDocumentClarificationDialog = () => {
  //     // handleSubmitRequestForClarificationNow();
  //     getDocumentClarificationDialog();
  // }

  const onClickDocumentClarificationRequestFunction = () => {
    handleSubmitRequestForClarificationNow();
    // getIsShowDocumentClarificationDialog(true, data, form);
  };

  const handleSubmitRequestForClarificationNow = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    let clarificationRequiredForTitle = data?.title;

    let temp = {
      clarificationRequiredFor: clarificationRequiredForTitle,
      clarificationTitle: clarificationSubject,
      clarificationDescription: userNotes,
      clarificationRequiredFrom: type,
      clarificationRequestedBy: {
        id: user?.id,
        name: {
          firstName: user?.name?.firstName,
          lastName: user?.name?.lastName,
          middleName: user?.name?.middleName
        },
        email: {
          officialEmail: user?.email?.officialEmail
        },
        title: {
          title: user?.title?.title
        }
      },
    };

    try {
      setIsSubmitting(true);
      setIsLoadingImage(true)

      await POST(
        `application-management-service/application/${id}/form/${data?.id}/clarificationRequest`,
        temp
      );

      console.log("API call successful");

      const { data: updatedApplication } = await GET(`application-management-service/application/${id}`);

      const updatedForm = updatedApplication?.forms?.find(form => form?.id === data?.id);
      const latestClarification = updatedForm?.clarifications?.[updatedForm?.clarifications?.length - 1] || {};

      setForm(latestClarification);

      setIsSubmitting(false);
      getIsOpen(false)
      setIsLoadingImage(false)

      getDocumentClarificationDialog(true, latestClarification, data);

    } catch (error) {
      console.log("API Error:", error);
      setIsSubmitting(false);
    }
  };

  const handleSubmitRequestForClarification = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    let clarificationRequiredForTitle = data?.title
    let temp = {
      clarificationRequiredFor: clarificationRequiredForTitle,
      clarificationTitle: clarificationSubject,
      clarificationDescription: userNotes,
      clarificationRequiredFrom: type,
      clarificationRequestType: data?.schemaCategory === "UploadYourDoc" ? 'REQUEST_ADDITIONAL_DOCUMENTS' : 'NA',
      clarificationRequestedBy: {
        id: user?.id,
        name: {
          firstName: user?.name?.firstName,
          lastName: user?.name?.lastName,
          middleName: user?.name?.middleName
        },
        email: {
          officialEmail: user?.email?.officialEmail
        },
        title: {
          title: user?.title?.title
        }
      },
    }
    await POST(`application-management-service/application/${id}/form/${data?.id}/clarificationRequest`, temp)
      .then(response => {
        console.log("onetwo", response)
        getIsOpen(false)
        getApplication()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  console.log(data, 'console')

  return (
    <>
      {isLoadingImage && (
        <div className={style.loadingOverlay}>
          <LoadingScreen />
        </div>
      )}
      {!isLoadingImage && (
        <Dialog
          isOpen={getIsOpen}
          onClose={() => getIsOpen(false)}
          className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
          canOutsideClickClose={false}
          canEscapeKeyClose={false}
        >
          <div>
            <div className={Classes.DIALOG_BODY}>
              <div className={style.spaceBetween}>
                <div className={`${style.heading}`}>
                  Clarification Required for {data?.title} from {formDetails?.basicDetails?.applicant?.name?.firstName}{" "}{formDetails?.basicDetails?.applicant?.name?.lastName.toLowerCase()}
                </div>
                <div className={style.displayInRow}>
                <Tooltip title="Click to Save" arrow>
                  <img
                    src={CrossPink}
                    alt="cross"
                    className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
                    onClick={() => {
                      getIsOpen(false);
                    }}
                  />
                  </Tooltip>
                </div>
              </div>
              {/* <div className={`${style.marginTop10} ${style.detailsTextStyle}`}>License / Certification Details</div> */}
              {/* <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
              <div className={style.spaceBetween}>
                <div>
                    <div className={style.subHeadingtextStyle}>License/Certification Issued By</div>
                    <div className={style.subAnswerTextStyle}>Queen's University</div>
                </div>
                <div>
                    <div className={style.subHeadingtextStyle}>License/Registration Number</div>
                    <div className={style.subAnswerTextStyle}>13578656</div>
                </div>
                <div>
                    <div className={style.subHeadingtextStyle}>Licensure Type</div>
                    <div className={style.subAnswerTextStyle}>Independent</div>
                </div>
                <div>
                    <div className={style.subHeadingtextStyle}>Expiry Date</div>
                    <div className={style.subAnswerTextStyle}>MM-DD-YYYY</div>
                </div>
                <div>
                    <div className={style.subHeadingtextStyle}>First Issued</div>
                    <div className={style.subAnswerTextStyle}>MM-DD-YYYY</div>
                </div>
              </div>
            </div> */}
              <div className={`${style.marginTop10}`}>
                <div className={`${style.textBoxTextStyle}`}>
                  Clarification Required Subject*
                </div>
                <CommonInputField
                  value={clarificationSubject}
                  onChange={(e) => setClarificationSubject(e.target.value)}
                  className={style.marginTop5}
                  placeholder="Enter Subject"
                />
              </div>

              <div className={`${style.marginTop10}`}>
                <div className={`${style.textBoxTextStyle} ${style.marginBottom5}`}>
                  Specify the clarification that is needed*
                </div>
                <CKEditor
                  editor={ClassicEditor}
                  data={userNotes}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setUserNotes(data);
                  }}
                  config={{
                    placeholder: "Enter a Clarification You Needed",
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
                  onReady={(editor) => {
                    const editorElement = editor.editing.view.document.getRoot();
                    editor.editing.view.change(writer => {
                      writer.setStyle(
                        'min-height',
                        '150px',
                        editorElement
                      );
                    });
                  }}

                />
              </div>
              <div className={`${style.marginTop10} ${style.spaceBetween} ${style.cursorPointer}`}>
                {data?.schemaCategory !== "UploadYourDoc" ? (
                  <div
                    style={{
                      // pointerEvents: isApproveEnabled ? 'auto' : 'none', 
                      opacity: isApproveEnabled ? 1 : 0.5,
                      cursor: isApproveEnabled ? 'pointer' : 'default'
                    }}
                    onClick={isApproveEnabled ? () => onClickDocumentClarificationRequestFunction() : undefined}
                  // onClick={() => getIsShowDocumentClarificationDialog(true,data)}
                  // onClick={() => getIsOpen(false)}
                  >
                    <Tooltip title={isApproveEnabled ? "Click to Request Document Clarification Now" : ""} arrow>
                    <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>DOCUMENT CLARIFICATION NOW</div></Tooltip>
                  </div>
                ) : (
                  <div></div>
                )}
                <div className={style.flex}>
                  {/* <div
                    className={`${style.reviewButtonStyle}`}
                    onClick={isApproveEnabled ? () => getIsOpen(false) : undefined}
                    style={{
                      // pointerEvents: isApproveEnabled ? 'auto' : 'none', 
                      opacity: isApproveEnabled ? 1 : 0.5,
                      cursor: isApproveEnabled ? 'pointer' : 'default'
                    }}
                  >
                    <div className={style.reviewButton}>SAVE & SEND BY EMAIL</div>
                  </div> */}
                  <div
                    className={`${style.reviewButtonStyle} ${style.marginLeft}`}
                    onClick={isApproveEnabled ? () => handleSubmitRequestForClarification() : undefined}
                    style={{
                      opacity: isApproveEnabled ? 1 : 0.5,
                      cursor: isApproveEnabled ? 'pointer' : 'default'
                    }}
                  >
                    <Tooltip title={isApproveEnabled ? "Click to Save and Send by Email" : ""} arrow>
                    <div className={style.reviewButton}>SAVE & SEND BY EMAIL</div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
      {/* {isOpenDocumentClarificationDialog && (
        <DocumentClarificationDialog getIsOpen={getIsShowDocumentClarificationDialog} form={data} data={form}/>
    )} */}
    </>
  );
};

export default ClarificationDialog;
