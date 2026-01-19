import React, { useState, useEffect, useCallback, useRef, useDebugValue } from "react";
import { GET, PUT, POST, TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import CryptoJS from 'crypto-js';
import { format, parseISO, differenceInDays } from 'date-fns';
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import { fileLoadingURL, FormatPhoneNumber, FormatPostalCode } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";
import { Tooltip } from "@mui/material";
import { Style } from "@mui/icons-material";

const OverrideNotesDialog = ({ getIsOpen, getActiveApplicationView, selectedTab }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [logDetails, setLogDetails] = useState([]);
  const [userRoleComments, setUserRoleComments] = useState('');
  const [isChecked, setIsChecked] = useState({ isChecked1: false, isChecked2: false });
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const id = sessionStorage.getItem("applicationId");
  const componentRef = useRef(null);
  const [isSigned, setIsSigned] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [dateTime] = useState(new Date().toISOString());
  const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
  const [encryptedText, setEncryptedText] = useState('');
  const [isCheckedSign, setIsCheckedSign] = useState(false);
  const [name, setName] = useState('')
  const [applicationType, setApplicationType] = useState(() =>
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );
  const [entity, setEntity] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropzoneStyle = {
    width: "100%",
    height: "auto",
    borderWidth: 2,
    borderColor: "rgb(102, 102, 102)",
    borderStyle: "dashed",
    borderRadius: 5,
  };
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const workModeType = sessionStorage.getItem('workModeType')
  const [isApproverDept1, setIsApproverDept1] = useState("");
  const [isApproverCred, setIsApproverCred] = useState(false);
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userSelectOverideApplicant, setUserSelectOverideApplicant] = useState('');
  const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
  const dateFormat = canadaData?.dateFormat || 'MMM dd, yyyy';
  const rawExpireDate = userSelectOverideApplicant?.application?.priorCyclePeriod?.to ?? null;
  const ExpireDate = rawExpireDate ? parseISO(rawExpireDate) : null;
  const formattedExpiringDate = ExpireDate ? format(new Date(ExpireDate), dateFormat) : "-";
  const daysRemaining = ExpireDate ? Math.abs(differenceInDays(new Date(ExpireDate), new Date())) : null;

  useEffect(() => {
    getApplicationEntity();
    getLog();
  }, [applicationType]);

  useEffect(() => {
    getRequestUserData()
    console.log("userSelectOverideApplicant", userSelectOverideApplicant)
  }, [])

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
  }, [applicationType, id]);

  console.log(`Approverssssss ${workModeType}: ${isApproverDept1}`);


  console.log("approvebydept", isApproverDept1)
  console.log("Updated Lastnameuserssssss", userFirstName);
  console.log("Updated Lastnameuserssssss", userLastName);

  const onClicksignFunction = () => {
    setTodayDate();
    handleSignatureClick();
  };


  const setTodayDate = () => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    setCurrentDate(formattedDate);
  };


  useEffect(() => {
    setIsCheckedSign(formDetails?.forms?.[19]?.acknowledged || true);
    setIsSigned(
      formDetails?.forms?.[19]?.esign?.esign !== undefined &&
      formDetails?.forms?.[19]?.acknowledged
    );
  }, [formDetails]);

  useEffect(() => {
    if (name && dateTime) {
      setEncryptedText(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());
    }
  }, [name, dateTime, publicKey]);

  useEffect(() => {
    checkApproveEnabled();
  }, [isChecked, userRoleComments, isSigned]);

  useEffect(() => {
    setUserDetails();
  }, [users?.id])


  const changeHandler = async (event) => {
    setIsLoading(true);
    const filesArray = Array.from(event);
    setFiles(filesArray);
    console.log(event, 'Test');


    const formData = new FormData();
    let fileNameArray = [];
    filesArray?.forEach(file => {
      fileNameArray.push({ "fileName": file?.name });
      formData.append('documents', file);
    });




    formData.append('files', new Blob([JSON.stringify(fileNameArray)], {
      type: "application/json"
    }));

    fileNameArray.forEach(file => {
      console.log("File name:", file.fileName);
    });

    console.log("file?.name" + JSON.stringify(fileNameArray));
    console.log(fileNameArray)
    console.log(event?.name);

    try {
      const response = await POST(`application-management-service/application/${id}/files/bulk?isLLMRequired=${false}`, formData);
      SuccessToaster('File Uploaded Successfully');
      console.log(response?.data?.fileName);



      setIsLoading(false);
      return response?.data;
    } catch (error) {
      ErrorToaster('File Upload Failed');
      console.error(error);
      setIsLoading(false);
      return null;
    }
  };


  const setUserDetails = async () => {
    try {
      const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
      console.log("userdataaaa", JSON.stringify(userData));
      sessionStorage.setItem('user', JSON.stringify(userData));
      setUserRole(userData?.roles?.map((data) => data?.roleName) || []);
      setUserFirstName(`${userData?.name?.firstName}`);
      setUserLastName(`${userData?.name?.lastName}`);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const getApplicationEntity = async () => {
    const { data: basicFormEntity } = await GET(`entity-service/entity/${TenantID}`);
    setEntity(basicFormEntity);
  };

  const getLog = async () => {
    setIsLoadingImage(true);
    const { data: basicLog } = await GET(`application-management-service/application/${id}/logs`);
    setLogDetails(basicLog);
    console.log("basicLog" + JSON.stringify(basicLog));
    setIsLoadingImage(false)
  };

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

  const getRequestUserData = async () => {
    try {
      let response;
      response = await GET(
        `application-management-service/application/request?requestType=OVERRIDE_REQUEST&status=PENDING&role=Chief Of Staff`,
      );
      const requests = response?.data?.requests || [];
      const filteredRequest = requests.find(item => item?.application?.id === id);
      console.log("Filtered Application Data", filteredRequest);
      setUserSelectOverideApplicant(filteredRequest);
    }
    catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  // const checkRequirements = () => {
  //   return userRole.includes('Chief Of Staff')
  //     ? isChecked.isChecked1
  //     : (isChecked.isChecked2);
  // };

  const handleSignatureClick = () => {
    {
      setIsSigned(!isSigned);
      setIsEdited(true);
    }
  };

  const checkApproveEnabled = () => {
    const hasValidComments = userRoleComments.trim() !== '';

    if (workModeType === 'Chief Of Staff') {
      setIsApproveEnabled(isChecked.isChecked1 && hasValidComments && isSigned);
    } else {
      // setIsApproveEnabled(isChecked.isChecked2 && hasValidComments && isSigned);
      setIsApproveEnabled(hasValidComments);
    }
  };
  const onClose = () => {
    getActiveApplicationView(false);
    getIsOpen(false);
  };

  const onClickApproveMoveFunction = () => {
    handleApplicationApprove(true);
    getApplicationMoveToNext(true);
  }

  const handleApplicationApprove = async () => {
    let role;
    let title;
    let notesComments = userRoleComments;
    let isDelegate = true;

    // Determine role based on selectedTab and applicationType
    if (selectedTab === 'level-2') {
      if (workModeType === "Department Head") {
        role = "Department Head";
        isDelegate = false;
        title = "Dept. Head / Chief Review"
      } else {
        role = "Department Head";
        title = "Dept. Head / Chief Review"
      }
    } else if (selectedTab === 'level-3') {
      if (workModeType === "Credentialing Committee") {
        role = "Credentialing Committee";
        title = "Credentialing Committee Review";
        isDelegate = false;
      } else if (workModeType === "Chief Of Staff") {
        role = "Chief Of Staff";
        isDelegate = false;
        title = "Chief Of Staff Review";
      }
    } else if (selectedTab === 'level-4') {
      role = "Advisory Committee";
      title = "MAC Review";
    } else if (selectedTab === 'level-5') {
      role = "Board";
      title = "BOD Approval";
    } else if (selectedTab === 'level-1') {
      role = "Staff Manager";
      title = "Staff Manager Verification";
    }

    // Prepare the payload
    let temp = {
      role: isDelegate ? role : "",
      notes: {
        notes: notesComments
      },
      approvedDate: new Date().toISOString(),
      title: title
    };

    await PUT(`application-management-service/application/${id}/workflow/complete/APPROVED?isDelegate=${isDelegate}&approvalType=RECOMMENDED_WITH_NOTES`, temp)
      .then(response => {
        console.log('success');
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const getApplicationMoveToNext = async () => {
    let role;
    let title;
    let notesComments = userRoleComments;
    let isDelegate = true;

    // Determine role based on selectedTab and applicationType
    if (selectedTab === 'level-2') {
      if (workModeType === "Department Head") {
        role = "Department Head";
        isDelegate = false;
        title = "Dept. Head / Chief Review"
      } else {
        role = "Department Head";
        title = "Dept. Head / Chief Review"
      }
    } else if (selectedTab === 'level-3') {
      if (workModeType === "Credentialing Committee") {
        role = "Credentialing Committee";
        title = "Credentialing Committee Review";
        isDelegate = false;
      } else if (workModeType === "Chief Of Staff") {
        role = "Chief Of Staff";
        isDelegate = false;
        title = "Chief Of Staff Review";
      }
    } else if (selectedTab === 'level-4') {
      role = "Advisory Committee";
      title = "MAC Review";
    } else if (selectedTab === 'level-5') {
      role = "Board";
      title = "BOD Approval";
    } else if (selectedTab === 'level-1') {
      role = "Staff Manager";
      title = "Staff Manager Verification";
    }

    // Prepare the payload
    let temp = {
      role: isDelegate ? role : "",
      notes: {
        notes: notesComments
      },
      approvedDate: new Date().toISOString(),
      title: title
    };


    await PUT(`application-management-service/application/${id}/workflow/move?isDelegate=${isDelegate}`, temp)
      .then(response => {
        console.log('successfull');
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCheckboxChange = (checkboxName) => (event) => {
    const newIsChecked = {
      ...isChecked,
      [checkboxName]: event.target.checked,
    };
    setIsChecked(newIsChecked);
  };

  const dynamicValues = {
    ApplicantName: `${formDetails?.basicDetails?.applicant?.name?.firstName || ''} ${formDetails?.basicDetails?.applicant?.name?.lastName || ''}`,
    EntityName: "Cambridge memorial Hospital",
  };

  const formatLabel = (template, values) =>
    template.replace(/{(.*?)}/g, (_, key) => values[key] || '');

  const lastModifiedDate = formDetails?.lastModifiedDate;
  const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), dateFormat) : "-";
  const lastSubmittedLog = logDetails?.logs?.find((log) => log.workflowStatus === "SUBMITTED");
  const lastSubmittedDate = lastSubmittedLog ? lastSubmittedLog.lastModifiedDate : null;
  const formattedSubmissionDate = lastSubmittedDate ? format(new Date(lastSubmittedDate), dateFormat) : "-";
  const CredUpcomingDate = formDetails?.upcomingCredCommitteeMeetingDate;
  const upcomingCredCommitteeMeetingDate = CredUpcomingDate ? format(new Date(CredUpcomingDate), dateFormat) : "-";

  if (
    workModeType === 'Staff Manager'
    // || 
    // (workModeType === 'Department Head' && isApproverDept1 === "notApproved") || 
    // (workModeType === 'Chief Of Staff' && isApproverDept1 === "notApproved") ||
    // (workModeType === 'Credentialing Committee' && isApproverCred === "notApproved")
  ) {
    return (
      isLoadingImage && (
        <div className={style.loadingOverlay}>
          <LoadingScreen />
        </div>
      )
    );
  }

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
                <div className={style.heading}>
                  Chief of Staff Review & Approval for Override Request
                </div>
                <div className={style.displayInRow}>
                  <Tooltip title={"Click to Close"} arrow>
                    <img
                      src={CrossPink}
                      alt="cross"
                      className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
                      onClick={() => {
                        getIsOpen(false); getActiveApplicationView(false);
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
              <div className={`${style.headingLocum} ${style.marginTop10}`}>
                {applicationType === "NEW" ? 'Review Staff for Appointment' : `Review Locum Staff for Privilege ${userSelectOverideApplicant?.locumRenewalDetails?.reappointmentType === "EXTENSION" ? "Extension" : "Renewal"}`}
              </div>
              <div ref={componentRef} className={`${style.pagebreak}`}>

                <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
                  <div className={style.marginTop10}>
                    <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                      <div className={`${style.displayInRow} ${style.displayInRowCenter}`}>
                        <span className={style.rejectionHeadingTextStyle}>
                          {userSelectOverideApplicant?.application?.applicant?.name?.lastName?.charAt(0).toUpperCase() +
                            userSelectOverideApplicant?.application?.applicant?.name?.lastName?.slice(1).toLowerCase()}
                          {", "}
                          {userSelectOverideApplicant?.application?.applicant?.name?.firstName
                            ? userSelectOverideApplicant?.application?.applicant?.name?.firstName.charAt(0).toUpperCase() +
                            userSelectOverideApplicant?.application?.applicant?.name?.firstName.slice(1).toLowerCase()
                            : ""}
                        </span>
                        <div className={`${style.rejectionTextStyle} ${style.marginLeft2}`}>
                          {applicationType === "NEW" ? '' : 'Locum'} {userSelectOverideApplicant?.application?.basicDetailReferences?.applicantType?.serviceProviderType}
                        </div>
                      </div>
                      <div className={`${style.displayInRow} ${style.displayInRowCenter}`}>
                        <span className={`${style.rejectionHeadingTextStyle}`}>
                          {userSelectOverideApplicant?.application?.basicDetailReferences?.department?.name || ""}
                          {userSelectOverideApplicant?.application?.basicDetailReferences?.specialty
                            ? ` - ${userSelectOverideApplicant?.application?.basicDetailReferences?.specialty?.name}`
                            : ""}
                        </span>
                      </div>
                      {entity?.multiSiteEntity && (
                        <div className={`${style.twoColumnGridInner}`}>
                          <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
                          <span className={`${style.rejectionTextStyle1}`}>{entity?.multiSiteEntity?.[0]?.name || "-"}</span>
                        </div>
                      )}
                      {applicationType === "LOCUM" && (
                        <>
                          <div className={`${style.twoColumnGridInner}`}>
                            <span className={`${style.rejectionTextStyle}`}>Expiration Date:</span>
                            <span className={`${style.rejectionTextStyle1}`}>{formattedExpiringDate}</span>
                          </div>
                          <div className={`${style.twoColumnGridInner}`}>
                            <span className={`${style.rejectionTextStyle}`}>{userSelectOverideApplicant?.locumRenewalDetails?.reappointmentType === "EXTENSION" ? "Days From Expiration :" : "Days Since Expiration :"}</span>
                            <span className={`${style.rejectionTextStyle1}`}> {userSelectOverideApplicant?.locumRenewalDetails?.reappointmentType === "EXTENSION" ? `${daysRemaining} days` : `${daysRemaining} days`}</span>
                          </div>
                        </>
                      )}
                      {/* <div className={`${style.twoColumnGridInner}`}>
        <span className={`${style.rejectionTextStyle}`}>OHIP Number :</span>
        <span className={`${style.rejectionTextStyle1}`}>-</span>
        </div> */}
                    </div>
                  </div>
                </div>
                <div className={`${style.marginTop} ${style.credDateTextStyle}`}>
                  Override Request Reason From Staff Manager
                </div>
                <hr color="grey" size="2"></hr>
                {userSelectOverideApplicant?.notes?.length > 0 && (
                  userSelectOverideApplicant?.notes?.map((note, index) => (
                    <div key={note?.id || index} className={`${style.marginTop10}`}>
                      <div className={style.commentsNotesFontStyle} dangerouslySetInnerHTML={{ __html: note?.notes?.notes || '' }} />
                    </div>
                  ))
                )}
                <div className={`${style.marginTop} ${style.reviewButtonContainer}`} onClick={() => getIsOpen(false)}>
                  <Tooltip title={"Click to Start the Review Process"} arrow><div className={style.reviewButton}>REVIEW FOR OVERRIDE</div></Tooltip>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default OverrideNotesDialog;


