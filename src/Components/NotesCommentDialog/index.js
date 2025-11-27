import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT, POST, TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import CryptoJS from 'crypto-js';
import { format } from 'date-fns';
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import { fileLoadingURL, FormatPhoneNumber, FormatPostalCode } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";
import { Tooltip } from "@mui/material";

const NotesCommentsDialog = ({ getIsOpen, getActiveApplicationView, selectedTab }) => {
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
  const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
  const dateFormat = canadaData?.dateFormat || 'MMM dd, yyyy';
  let approverDetailsDept;
  let approverDetailsCred;

  useEffect(() => {
    getApplicationEntity();
    getLog();
  }, [applicationType]);

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
  }, [applicationType, id]);

  useEffect(() => {

    if (workModeType === "Department Head" || workModeType === "Chief Of Staff") {
      approverDetailsDept = formDetails?.completedWorkflows?.find(
        (workflow) => workflow?.role === "Department Head"
      );
    }
    // else if (workModeType === "Credentialing Committee") {
    //   approverDetails = formDetails?.completedWorkflows?.find(
    //     (workflow) => workflow?.role === "Credentialing Committee"
    //   );
    // }

    const firstName = approverDetailsDept?.approverDetails?.[0]?.approverDetail?.name?.firstName;
    const lastName = approverDetailsDept?.approverDetails?.[0]?.name?.lastName;

    console.log("Updated firstname:", approverDetailsDept, formDetails?.id);
    console.log("Updated lastname:", lastName);




    if (firstName === userFirstName && lastName === userLastName) {

      setIsApproverDept1("Approve");
    } else {
      setIsApproverDept1("notApproved")
    }
  }, [workModeType, formDetails, userFirstName, userLastName, id]);

  useEffect(() => {
    if (workModeType === "Credentialing Committee") {
      approverDetailsCred = formDetails?.completedWorkflows?.find(
        (workflow) => workflow?.role === "Credentialing Committee"
      );
    }

    const approverDetailsArray = approverDetailsCred?.approverDetails || [];

    // const firstName = approverDetailsCred?.approverDetail?.name?.firstName;
    // const lastName = approverDetailsCred?.approverDetail?.name?.lastName;


    const matchedApprover = approverDetailsArray.find((approverObj) => {
      const approverName = approverObj?.approverDetail?.name;
      return (
        approverName?.firstName === userFirstName &&
        approverName?.lastName === userLastName
      );
    });

    console.log("Matched Approver:", matchedApprover, formDetails?.id);

    console.log("Updated firstname:", approverDetailsCred, formDetails?.id);
    // console.log("Updated lastname:", lastName);


    if (matchedApprover) {
      setIsApproverDept1("Approve");
    } else {
      setIsApproverDept1("notApproved")
    }
  }, [workModeType, formDetails, userFirstName, userLastName, id]);

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
                  {`Staff ${applicationType === "LOCUM"
                    ? `${formDetails?.reappointmentType === "EXTENSION" ? "Locum Extension" : "Locum Renewal"}`
                    : applicationType === "NEW" ? "Appointment" : "Reappointment"
                    } for Review & Approval`}
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
              <div ref={componentRef} className={`${style.pagebreak}`}>

                <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
                  <div className={`${style.marginTop10} ${style.displayInRowCenter}`}>
                    <div className={`${style.gridContainer2} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                      <div className={`${style.gridRow}`}>
                        <div className={style.gridItem1}><span className={style.rejectionHeadingTextStyle}>
                          {formDetails?.basicDetails?.applicant?.name?.lastName?.charAt(0).toUpperCase() +
                            formDetails?.basicDetails?.applicant?.name?.lastName?.slice(1).toLowerCase()}{", "}
                          {formDetails?.basicDetails?.applicant?.name?.firstName
                            ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                            formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                            : ""}
                        </span>
                          <span className={`${style.rejectionTextStyle} ${style.marginLeft4}`}>
                            {" "} {applicationType === "LOCUM" ? "Locum" : ""} {formDetails?.providerType?.serviceProviderType}
                          </span>
                        </div>
                        <div className={`${style.gridItem2}`}>
                          <span className={`${style.rejectionHeadingTextStyle}`}>
                            {formDetails?.basicDetails?.departmentSpecialty?.department || ""}
                            {formDetails?.basicDetails?.departmentSpecialty?.specialty
                              ? ` - ${formDetails.basicDetails.departmentSpecialty.specialty}`
                              : ""}
                          </span>
                        </div>
                        <div className={`${style.twoColumnGridInner2} `}>
                          <span className={`${style.rejectionTextStyle}`}>Privilege Category:</span>
                          <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || "-"}</span>
                        </div>
                      </div>
                      <div className={style.gridRow}>
                        {
                          entity?.multiSiteEntity && (
                            <div className={`${style.twoColumnGridInner}`}>
                              <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
                              <span className={`${style.rejectionTextStyle1}`}>
                                {entity?.multiSiteEntity?.[0]?.name || "-"}
                              </span>
                            </div>
                          )
                        }
                        <div className={`${style.twoColumnGridInner}`}>
                          <span className={`${style.rejectionTextStyle}`}>Submission Date:</span>
                          <span className={`${style.rejectionTextStyle1}`}>{formattedSubmissionDate}</span>
                        </div>
                        <div className={`${style.twoColumnGridInner}`}>
                          <span className={`${style.rejectionTextStyle}`}>Last Updated :</span>
                          <span className={`${style.rejectionTextStyle1}`}>{formattedDate}</span>
                        </div>
                        <div className={`${style.twoColumnGridInner2}`}>
                          <span className={`${style.rejectionTextStyle}`}>Last Updated by:</span>
                          <span className={`${style.rejectionTextStyle1}`}>
                            {formDetails?.basicDetails?.applicant?.name?.firstName
                              ? formDetails?.updatedBy?.name?.firstName.charAt(0).toUpperCase() +
                              formDetails?.updatedBy?.name?.firstName.slice(1).toLowerCase()
                              : ""}{formDetails?.updatedBy?.name?.lastName?.toUpperCase()} {formDetails?.updatedBy?.title?.title ? `, ${formDetails?.updatedBy?.title?.title}` : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {logDetails?.logs?.filter(log => log.role && log.notes).map((log, index) => (
                  <>
                    <div className={style.marginTop}>
                      <div className={style.commentsNotesHeadingFontStyle}>
                        {log.title} Comments & Notes
                        {/* Staff Manager Comments & Notes */}
                      </div>
                      <hr color="grey" size="2"></hr>
                      <div>
                        <div className={style.commentsNotesFontStyle}>
                          {/* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy. */}
                          <div dangerouslySetInnerHTML={{ __html: (log.notes) }} />
                        </div>
                      </div>
                    </div>
                  </>
                ))}
                {((workModeType === "Department Head") || (workModeType === "Chief Of Staff")) &&
                  <>
                    {/* <div className={`${style.marginTop} ${style.credDateTextStyle}`}>
               Upcoming Credentials Committee Meeting Date: {upcomingCredCommitteeMeetingDate}
               </div> */}

                    <div className={`${style.marginTop} ${style.credDateTextStyle}`}>
                      Assigned Credentials Committee: {
                        (() => {
                          const credentialingWorkflow = formDetails?.completedWorkflows?.find(
                            (workflow) => workflow.role === "Credentialing Committee"
                          );

                          const approverList = credentialingWorkflow?.approverDetails || [];

                          if (approverList.length > 0) {
                            const names = approverList.map(({ approverDetail }) => {
                              const { firstName = '', lastName = '' } = approverDetail?.name || {};
                              return `${firstName} ${lastName}`.trim();
                            });

                            return `${names.join(', ')}, Credentialing Committee`;
                          }

                          return "No approver found";
                        })()
                      }
                    </div>
                  </>
                }
                <div className={`${style.marginTop} ${style.reviewButtonContainer}`} onClick={() => getIsOpen(false)}>
                  {workModeType === "Department Head" ? <Tooltip title={"Click to Start the Review Process"} arrow><div className={style.reviewButton}>START REVIEW</div></Tooltip> : <Tooltip title={"Click to Continue to the Next Step"} arrow> <div className={style.reviewButton}>CONTINUE</div></Tooltip>}
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default NotesCommentsDialog;


