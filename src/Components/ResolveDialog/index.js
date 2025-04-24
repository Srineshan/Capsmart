import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT ,POST, TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LoadingScreen from "../LoadingScreen";
import DocumentClarificationDialog from "../DocumentClarificationDialog"
import CommonDivider from "../CommonFields/CommonDivider";

const ResolveDialog = ({ getIsOpen, data, formData, form, dateFormat, getActiveApplicationView, selectedTab }) => {
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
  

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
    getLog();
    console.log("neesollu", data, formData, form)
  }, [applicationType]);

  useEffect(() => {
    checkApproveEnabled();
  }, [userNotes]);

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
        console.log("basicLog" +JSON.stringify(basicLog));
        setIsLoadingImage(false)
      };

      const checkApproveEnabled = () => {
        const hasValidComments = userNotes.trim() !== '';
        setIsApproveEnabled(hasValidComments);
      };

      const getIsShowDocumentClarificationDialog = (value) => {
        setIsOpenDocumentClarificationDialog(value);
    }

    const onClose = () => {
      // getActiveApplicationView(false);
      getIsOpen(false);
    };

    const getClarificationStatus = async () => {
      const clarificationStatus = data === "resolve" ? "ACCEPTED" : "REJECTED";
        let temp = {
          notes : userNotes
        };
    
        await PUT(`application-management-service/application/${id}/form/${form?.id}/clarification/${formData?.id}/${clarificationStatus}`, temp)
          .then(response => {
            console.log('successfull notes added');
            onClose();
            getApplication();
          })
          .catch((error) => {
            console.log(error);
          });
    };
  return (
<>
   {isLoadingImage && (
      <div  className={style.loadingOverlay}>
        <LoadingScreen/>
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
            {data === "unresolve" 
                ? `Clarification Required for ${formDetails?.basicDetails?.applicant?.name?.firstName} ${formDetails?.basicDetails?.applicant?.name?.lastName} Marked as Unresolved`
                : `Resolve the Clarification open for ${formDetails?.basicDetails?.applicant?.name?.firstName} ${formDetails?.basicDetails?.applicant?.name?.lastName}`
            }
            </div>
            <div className={style.displayInRow}>
              <img
                src={CrossPink}
                alt="cross"
                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
                onClick={() => {
                  getIsOpen(false);
                }}
              />
            </div>
          </div>
          <div className={`${style.borderStyleTiles}`}></div>
            <div className={`${style.marginTop10}`}>
                <div className={`${style.textBoxTextStyle}`}>
                {data === "unresolve" 
                ? `Comments / Notes on why this is unresolved*`
                : `Acceptance Notes / Comments`
                }
                </div>
                <CKEditor
                    editor={ClassicEditor}
                    data={userNotes}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setUserNotes(data);
                    }}
                    config={{
                        placeholder: "Enter Comments / Notes",
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
        </div>
        <div className={`${style.marginTop} ${style.reviewButtonContainer}`}>
            <div   onClick={() => getIsOpen(false)}>
              <div className={`${style.cancelButton} ${style.cancelButtonTextStyle} ${style.cursorPointer}`}>cancel</div>
            </div>
            <div
              className={`${style.reviewButtonStyle} ${data === "unresolve" && !isApproveEnabled ? "" : style.cursorPointer} ${style.marginLeft}`}
              onClick={() => getClarificationStatus()}
              style={{ 
                pointerEvents: data === "unresolve" && !isApproveEnabled ? 'none' : 'auto', 
                opacity: data === "unresolve" && !isApproveEnabled ? 0.5 : 1 
              }}
            >
              <div className={style.reviewButton}>
                {data === "unresolve" ? `Marked as unresolved` : `resolve`}
              </div>
            </div>
            </div>
      </div>
    </Dialog>
    )}
    {isOpenDocumentClarificationDialog && (
        <DocumentClarificationDialog getIsOpen={getIsShowDocumentClarificationDialog}/>
    )}
</>
  );
};

export default ResolveDialog;
