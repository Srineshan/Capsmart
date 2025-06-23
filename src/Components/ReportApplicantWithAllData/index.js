import React, { useState, useEffect } from "react";
import { GET, TenantID } from "../../Screens/dataSaver";
import { differenceInCalendarDays, format } from "date-fns";
import style from './index.module.scss';

const ReportsApplicantWithAllDataTable = ({ tableData, declinedReport }) => {
  const [entity, setEntity] = useState([]);

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplicationEntity();
  }, []);


  const getApplicationEntity = async () => {
    try {
      const { data: basicFormEntity } = await GET(`entity-service/entity/${TenantID}`);
      setEntity(basicFormEntity);
    } catch (error) {
      console.error("Error fetching entity:", error);
    }
  };

  const renderApplicationDetails = () => {
    return tableData?.map((formDetails, index) => {
      const lastModifiedDate = formDetails?.lastModifiedDate;
      const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), "MMM dd, yyyy") : "-";
      const formattedSubmissionDate = formDetails?.submittedDate ? format(new Date(formDetails?.submittedDate), "MMM dd, yyyy") : "-";

      return (
        <div key={formDetails?.displayId} className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
          <div className={style.marginTop10}>
            <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
              <div className={`${style.displayInRow} ${style.displayInRowCenter}`}>
                <span className={style.rejectionHeadingTextStyle}>
                  {formDetails?.applicant?.name?.lastName?.charAt(0).toUpperCase() + formDetails?.applicant?.name?.lastName?.slice(1).toLowerCase()}{", "}
                  {formDetails?.applicant?.name?.firstName
                    ? formDetails?.applicant?.name?.firstName?.charAt(0)?.toUpperCase() +
                    formDetails?.applicant?.name?.firstName?.slice(1)?.toLowerCase()
                    : ""}{", "}
                </span>
                <div className={`${style.rejectionTextStyle} ${style.marginLeft2}`}>{formDetails?.basicDetailReferences?.applicantType?.serviceProviderType}</div>
                {declinedReport && (
                  <div className={`${style.declinedTextStyle} ${style.marginLeft20}`}>{formDetails?.onGoingApplication?.status === "DECLINED" ? 'Declined' : 'Not Renewed'}</div>
                )}
              </div>
              <div className={`${style.twoColumnGridInner} ${style.displayInRowCenter}`}>
                <span className={`${style.rejectionTextStyle}`}>Privilege Category:</span>
                <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetailReferences?.credentialingAndPrivilegingCategory?.name || "-"}</span>
              </div>
              <div className={style.twoColumnGridInner}>
                <span className={style.rejectionTextStyle}>Department:</span>
                <span className={style.rejectionTextStyle1}>{formDetails?.basicDetailReferences?.department?.name || "-"}</span>
              </div>
              {!declinedReport && (
                <div className={style.twoColumnGridInner}>
                  <span className={style.rejectionTextStyle}>Application ID:</span>
                  <span className={style.rejectionTextStyle1}>{formDetails?.displayId || "-"}</span>
                </div>
              )}
              <div className={style.twoColumnGridInner}>
                <span className={style.rejectionTextStyle}>Division / Specialty:</span>
                <span className={style.rejectionTextStyle1}>{formDetails?.basicDetailReferences?.specialty?.name || "-"}</span>
              </div>
              {entity?.multiSiteEntity && (
                <div className={style.twoColumnGridInner}>
                  <span className={style.rejectionTextStyle}>Site Name:</span>
                  <span className={style.rejectionTextStyle1}>{entity?.multiSiteEntity?.[0]?.name || "-"}</span>
                </div>
              )}
              {!declinedReport && (
                <div className={style.twoColumnGridInner}>
                  <span className={style.rejectionTextStyle}>Submission Date:</span>
                  <span className={style.rejectionTextStyle1}>{formattedSubmissionDate}</span>
                </div>
              )}
              {!declinedReport && (
                <div className={style.twoColumnGridInner}>
                  <span className={style.rejectionTextStyle}>Last Updated:</span>
                  <span className={style.rejectionTextStyle1}>{formattedDate}</span>
                </div>
              )}
              {!declinedReport && (
                <div className={`${style.twoColumnGridInner}`}>
                  <span className={`${style.rejectionTextStyle}`}>Last Updated by:</span>
                  <span className={`${style.rejectionTextStyle1}`}>
                    {formDetails?.applicant?.name?.firstName
                      ? formDetails?.updatedBy?.name?.firstName.charAt(0).toUpperCase() +
                      formDetails?.updatedBy?.name?.firstName.slice(1).toLowerCase()
                      : ""}{formDetails?.updatedBy?.name?.lastName?.toUpperCase()} {formDetails?.updatedBy?.title?.title  ? `, ${formDetails?.updatedBy?.title?.title}`: ""}
                  </span>
                </div>
              )}
              {declinedReport && (
                <div className={style.twoColumnGridInner}>
                  <span className={style.rejectionTextStyle}>Expiration Date:</span>
                  <span className={style.rejectionTextStyle1}>{formDetails?.tenure?.to ? format(new Date(formDetails?.tenure?.to), 'MMM dd, yyyy') : '-'}</span>
                </div>
              )}
              {declinedReport && (
                <div className={style.twoColumnGridInner}>
                  <span className={style.rejectionTextStyle}>Days From Expiration:</span>
                  <span className={style.rejectionTextStyle1}>{formDetails?.tenure?.to ? Math.abs(differenceInCalendarDays(new Date(formDetails?.tenure?.to), new Date())) : '-'}</span>
                </div>
              )}
              {declinedReport && (
                <div className={style.twoColumnGridInner}>
                  <span className={style.rejectionTextStyle}>CPSO Number:</span>
                  <span className={style.rejectionTextStyle1}>{formDetails?.applicant?.licenseNumber || '-'}</span>
                </div>
              )}
              {declinedReport && (
                <div className={style.twoColumnGridInner}>
                  <span className={style.rejectionTextStyle}>OHIP Number:</span>
                  <span className={style.rejectionTextStyle1}>{formDetails?.applicant?.ohipNumber || '-'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });
  };


  return (
    <>
      <div>
        {renderApplicationDetails()}
      </div>
    </>
  )
}

export default ReportsApplicantWithAllDataTable;