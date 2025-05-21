import React, { useState, useEffect } from "react";
import { GET, PUT, POST, TenantID } from "../../Screens/dataSaver";
import { format } from "date-fns";
import style from './index.module.scss';
import LoadingScreen from "../LoadingScreen";

const ReportsApplicantTable = ({ tableData }) => {
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [multiFormDetails, setMultiFormDetails] = useState([]);
  const [multiLogDetails, setMultiLogDetails] = useState([]);
  const temp = tableData?.map(item => item.id);
  const [entity, setEntity] = useState([]);

  console.log("Extracted IDs:", temp);

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
    getApplicationLog();
    getApplicationEntity();
  }, []);

  const getApplication = async () => {
    try {
      setIsLoadingImage(true);
      const applicationPromises = temp.map(async (id) => {
        const { data: basicForm } = await GET(`application-management-service/application/${id}`);
        return basicForm;
      });

      const applications = await Promise.all(applicationPromises);
      setMultiFormDetails(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      // ErrorToaster("Error fetching applications.");
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
      // ErrorToaster("Error fetching application logs.");
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

  const renderApplicationDetails = () => {
    return multiFormDetails.map((formDetails, index) => {
      const logDetails = multiLogDetails[index] || {};
      const lastModifiedDate = formDetails?.lastModifiedDate;
      const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), "MMM dd, yyyy") : "-";
      const lastSubmittedLog = logDetails?.logs?.find((log) => log.workflowStatus === "SUBMITTED");
      const lastSubmittedDate = lastSubmittedLog?.lastModifiedDate;
      const formattedSubmissionDate = lastSubmittedDate ? format(new Date(lastSubmittedDate), "MMM dd, yyyy") : "-";

      return (
        <div key={formDetails?.displayId} className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
          <div className={style.marginTop10}>
            <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
              <div className={`${style.displayInRow} ${style.displayInRowCenter}`}>
                <span className={style.rejectionHeadingTextStyle}>
                  {formDetails?.basicDetails?.applicant?.name?.lastName?.charAt(0).toUpperCase() + formDetails?.basicDetails?.applicant?.name?.lastName?.slice(1).toLowerCase()}{", "}
                  {formDetails?.basicDetails?.applicant?.name?.firstName
                    ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                    formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                    : ""}{", "}
                </span>
                <div className={`${style.rejectionTextStyle} ${style.marginLeft2}`}>{formDetails?.providerType?.serviceProviderType}</div>
              </div>
              <div className={`${style.twoColumnGridInner} ${style.displayInRowCenter}`}>
                <span className={`${style.rejectionTextStyle}`}>Privilege Category:</span>
                <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || "-"}</span>
              </div>
              <div className={style.twoColumnGridInner}>
                <span className={style.rejectionTextStyle}>Department:</span>
                <span className={style.rejectionTextStyle1}>{formDetails?.basicDetails?.departmentSpecialty?.department || "-"}</span>
              </div>
              <div className={style.twoColumnGridInner}>
                <span className={style.rejectionTextStyle}>Application ID:</span>
                <span className={style.rejectionTextStyle1}>{formDetails?.displayId || "-"}</span>
              </div>
              <div className={style.twoColumnGridInner}>
                <span className={style.rejectionTextStyle}>Division / Specialty:</span>
                <span className={style.rejectionTextStyle1}>{formDetails?.basicDetails?.departmentSpecialty?.specialty || "-"}</span>
              </div>
              {entity?.multiSiteEntity && (
                <div className={style.twoColumnGridInner}>
                  <span className={style.rejectionTextStyle}>Site Name:</span>
                  <span className={style.rejectionTextStyle1}>{entity?.multiSiteEntity?.[0]?.name || "-"}</span>
                </div>
              )}
              <div className={style.twoColumnGridInner}>
                <span className={style.rejectionTextStyle}>Submission Date:</span>
                <span className={style.rejectionTextStyle1}>{formattedSubmissionDate}</span>
              </div>
              <div className={style.twoColumnGridInner}>
                <span className={style.rejectionTextStyle}>Last Updated:</span>
                <span className={style.rejectionTextStyle1}>{formattedDate}</span>
              </div>
              <div className={`${style.twoColumnGridInner}`}>
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
      );
    });
  };


  return (
    <>
      {isLoadingImage && (
        <div className={style.loadingOverlay}>
          <LoadingScreen />
        </div>
      )}
      {!isLoadingImage && (
        <div>
          {renderApplicationDetails()}
        </div>
      )}
    </>
  )
}

export default ReportsApplicantTable;