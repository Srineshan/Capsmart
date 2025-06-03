import React, { useState, useEffect } from "react";
import { GET, PUT, POST, TenantID } from "../../Screens/dataSaver";
import { Dialog } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import { format, sub, add } from 'date-fns';
import { ErrorToaster, SuccessToaster } from "../../utils/toaster";
import style from "./index.module.scss";
import { fileLoadingURL } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";
import { Tooltip } from "@mui/material";

const BulkMoveDialog = ({ checkedIds, getBulkApproveDialogOpen, onClose, selectedTab }) => {
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const temp = Array.isArray(checkedIds) ? checkedIds : [checkedIds];
  const [multiFormDetails, setMultiFormDetails] = useState([]);
  const [multiLogDetails, setMultiLogDetails] = useState([]);
  const [entity, setEntity] = useState([]);
  const [userRoleComments, setUserRoleComments] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoadingImageDocs, setIsLoadingImageDocs] = useState(false);
  const [uploadFileData, setUploadFileData] = useState('');
  const [documentDesc, setDocumentDesc] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const [calendarStartForApproval, setCalendarStartForApproval] = useState(false);
  const [selectedDateForApproval, setSelectedDateForApproval] = useState(null);
  const workModeType = sessionStorage.getItem('workModeType')
  const applicationType = sessionStorage.getItem('applicationCreationType') ?? 'REAPPOINTMENT';

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
    getApplicationLog();
    getApplicationEntity();
  }, [checkedIds]);

  useEffect(() => {
    checkApproveEnabled();
    console.log("uploadFileData", uploadFileData)
  }, [userRoleComments, documentTitle, uploadFileData, selectedDateForApproval]);

  const getApplication = async () => {
    try {
      setIsLoadingImage(true);
      const applicationPromises = temp?.map(async (id) => {
        const { data: basicForm } = await GET(`application-management-service/application/${id}`);
        return basicForm;
      });

      const applications = await Promise.all(applicationPromises);
      setMultiFormDetails(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      ErrorToaster("Error fetching applications.");
    } finally {
      setIsLoadingImage(false);
    }
  };

  const getApplicationLog = async () => {
    try {
      setIsLoadingImage(true);
      const logPromises = temp.map(async (id) => {
        const { data: logData } = await GET(`application-management-service/application/${id}/logs`);
        return logData;
      });

      const logs = await Promise.all(logPromises);
      setMultiLogDetails(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      ErrorToaster("Error fetching application logs.");
    } finally {
      setIsLoadingImage(false);
    }
  };

  const getApplicationEntity = async () => {
    try {
      const { data: basicFormEntity } = await GET(`entity-service/entity/${TenantID}`);
      setEntity(basicFormEntity);
    } catch (error) {
      console.error("Error fetching entity:", error);
    }
  };

  const checkApproveEnabled = () => {
    const hasCheckedIds = checkedIds?.length > 0;
    setIsApproveEnabled(hasCheckedIds);
  };

  const handleDateChange = (date) => {
    const formattedDate = format(new Date(date), "yyyy-MM-dd'T'00:00")
    setSelectedDateForApproval(formattedDate);
    setCalendarStartForApproval(false);
  };

  const onClickApproveMoveFunction = () => {
    handleApplicationMove(true);
  };

  const handleApplicationMove = async () => {
    setIsLoadingImage(true)
    let role;
    let title;
    let approvedDate;
    let isDelegate = true;
    let applicationIdsParam = checkedIds?.length
      ? checkedIds.map(id => `&applicationIds=${id}`).join("")
      : "";
    // let approvedDate = selectedTab === "level-4"
    //   ? format(new Date(selectedDateForApproval), "yyyy-MM-dd")
    //   : new Date().toISOString();

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
        role = "Credentialing Committee";
        title = "Credentialing Committee Review";
      } else if (workModeType === "Credentialing Committee User") {
        role = "Credentialing Committee";
        title = "Credentialing Committee User Review";
      } else if (workModeType === "Staff Manager") {
        role = "Credentialing Committee";
        title = "Credentialing Committee User Review";
      }
    } else if (selectedTab === 'level-4' && applicationType === "REAPPOINTMENT") {
      role = "Advisory Committee";
      title = "MAC Review";
    } else if (selectedTab === 'level-4' && applicationType === "LOCUM") {
      role = "Board";
      title = "BOD Approval";
    } else if (selectedTab === 'level-5') {
      role = "Board";
      title = "BOD Approval";
    } else if (selectedTab === 'level-1') {
      role = "Staff Manager";
      title = "Staff Manager Verification";
      isDelegate = false;
    }

    // Prepare the payload
    let temp = {
      role: isDelegate ? role : "",
      //   approvedDate : new Date().toISOString(),
      title: title,
    };

    await PUT(`application-management-service/application/workflow/move/bulk/APPROVED?isDelegate=${isDelegate}&approvalType=RECOMMENDED${applicationIdsParam}`, temp)
      .then(response => {
        console.log('success');
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoadingImage(false)
  };

  const renderApplicationDetails = () => {
    return multiFormDetails.map((formDetails, index) => {
      const logDetails = multiLogDetails[index] || {};
      const lastModifiedDate = formDetails?.lastModifiedDate;
      const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), "MM/dd/yyyy") : "-";
      const lastSubmittedLog = logDetails?.logs?.find((log) => log.workflowStatus === "SUBMITTED");
      const lastSubmittedDate = lastSubmittedLog?.lastModifiedDate;
      const formattedSubmissionDate = lastSubmittedDate ? format(new Date(lastSubmittedDate), "MM/dd/yyyy") : "-";

      return (
        <div key={formDetails?.displayId} className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
          <div className={`${style.marginTop10} ${style.displayInRowCenter}`}>
            <div className={`${style.gridContainer} ${style.marginLeftRight20} ${style.marginBottom10}`}>
              <div className={`${style.gridRow}`}>
                <div className={style.gridItem1}><span className={style.rejectionHeadingTextStyle}>
                  {formDetails?.basicDetails?.applicant?.name?.lastName?.charAt(0).toUpperCase() +
                    formDetails?.basicDetails?.applicant?.name?.lastName?.slice(1).toLowerCase()}{", "}
                  {formDetails?.basicDetails?.applicant?.name?.firstName
                    ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                    formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                    : ""}
                </span>
                  <span className={`${style.rejectionTextStyle}`}>
                    {", "}{formDetails?.providerType?.serviceProviderType}
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
                      : ""}{formDetails?.updatedBy?.name?.lastName?.toUpperCase()}, {formDetails?.updatedBy?.title?.title}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      {isLoadingImageDocs && (
        <div
          className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
        >
          <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
        </div>
      )}
      {isLoadingImage && (
        <div className={style.loadingOverlay}>
          <LoadingScreen />
        </div>
      )}
      {!isLoadingImage && (
        <Dialog
          isOpen={getBulkApproveDialogOpen}
          onClose={onClose}
          className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
          canOutsideClickClose={false}
          canEscapeKeyClose={false}
        >
          <div>
            <div className={style.templateHeader}>
              <div className={style.templateHeadertext}>
                {(() => {
                  const isLocum = applicationType === "LOCUM";
                  const isReappointment = applicationType === "REAPPOINTMENT";
                  const count = checkedIds?.length || 0;
                  const noun =
                    count <= 1
                      ? (isLocum ? "Application" : "Reappointment")
                      : (isLocum ? "Applications" : "Reappointments");

                  if ((selectedTab === "level-3" && isReappointment) || (selectedTab === "level-2" && isLocum)) {
                    return `Staff ${noun} Approved by the Cred. Comm.`;
                  } else if ((selectedTab === "level-4" && isReappointment) || (selectedTab === "level-3" && isLocum)) {
                    return `Staff ${noun} Approved by the MAC.`;
                  } else {
                    return `Staff ${noun} send by the BOD.`;
                  }
                })()}
              </div>
              <Tooltip title="Click to Close" arrow>
                <img src={CrossPink} alt="close" className={`${style.crossStyle} ${style.cursorPointer}`} onClick={onClose} /></Tooltip>
            </div>
            {renderApplicationDetails()}
            <div className={`${style.actionButtons} ${style.marginTop}`}>
              <div className={`${style.reviewButtonStyle} ${isApproveEnabled ? style.cursorPointer : undefined}`}
                style={{
                  pointerEvents: isApproveEnabled ? 'auto' : 'none',
                  opacity: isApproveEnabled ? 1 : 0.5
                }}
                onClick={onClickApproveMoveFunction}
              >
                <Tooltip title={isApproveEnabled ? "Click to Save" : ""} arrow>
                  <div className={style.reviewButton}>Send as Mail</div></Tooltip>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default BulkMoveDialog;
