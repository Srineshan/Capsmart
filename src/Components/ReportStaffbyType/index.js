import React, { useState, useEffect } from "react";
import { GET,TenantID } from "../../Screens/dataSaver";
import { format } from "date-fns";
import style from './index.module.scss';
import LoadingScreen from "../LoadingScreen";

const ReportsStaffTable = ({ tableData}) => {
 const [isLoadingImage, setIsLoadingImage] = useState(false);
 const [entity, setEntity] = useState([]);

 console.log("tablessssss2:",tableData);
 

 useEffect(() => {
     sessionStorage.setItem("fromSummary", false);
     getApplicationEntity();
   }, []);

// const getApplication = async () => {
//     try {
//         setIsLoadingImage(true);
// const { data: basicForm } = await GET(`application-management-service/staff?status=ACTIVE&applicantTypeId=${temp}&reappointmentStatus=SENT&reappointmentStatus=RE_SENT`);
// setMultiStaffs(basicForm.staffs);
//     } catch (error) {
//         console.error("Error fetching applications:", error);
//         // ErrorToaster("Error fetching applications.");
//     } finally {
//         setIsLoadingImage(false);
//     }
// };

  const getApplicationEntity = async () => {
    try {
      const { data: basicFormEntity } = await GET(`entity-service/entity/${TenantID}`);
      setEntity(basicFormEntity);
    } catch (error) {
      console.error("Error fetching entity:", error);
    }
  };


  const getApplicationStatus = (data) => {
    const now = new Date();
    if (
      data.onGoingApplication.subStatus === "NOT_STARTED" &&
      data.onGoingApplication.completionPercentage === 0
    ) {
      return "Application Not Yet Started";
    } else if (
      data.onGoingApplication.completionPercentage > 0 &&
      data.onGoingApplication.completionPercentage < 100
    ) {
      return "Application Completion In-Progress"
    } else if (new Date(data.onGoingApplication.expiryDate) < now) {
      return "Application Submission Past Due"
    } else if (
      data.onGoingApplication.subStatus === "STARTED" &&
      data.onGoingApplication.completionPercentage === 100
    ) {
      return "Application Completed, Not Yet Submitted";
    } else if (
      data.onGoingApplication.status === "COMPLETED" &&
      data.onGoingApplication.completionPercentage === 100
    ) {
      return "Application Completed";
    }
     else if (
        data.onGoingApplication.status === "DECLINED" &&
        data.onGoingApplication.completionPercentage === 100
      ) {
        return "Application Declined";
    } 
    else if (
      data.onGoingApplication.status === "REVIEW_INPROGRESS" &&
      data.onGoingApplication.completionPercentage === 100
    ) {
      return "Application Review In Progress";
    }
    else {
      return "Application Not Yet Started";
    };
  };
  

  const renderApplicationDetails = () => {
return tableData.map((data, index) => {
  const reappointmentDate = data?.reAppointmentSentDate 
  ? format(new Date(data.reAppointmentSentDate), "MM/dd/yyyy")
  : "-";

    const dueDate = data?.onGoingApplication.expiryDate ?  format(new Date(data?.onGoingApplication.expiryDate), "MM/dd/yyyy") : "-";
       return (
         <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
           <div className={style.marginTop10}>
           <div className={`${style.twoColumnGrid1} ${style.marginLeftRight20} ${style.marginBottom10}`}>
      <div className={style.firstColumn}>
        <div className={style.nameStatusContainer}>
          <span className={style.rejectionHeadingTextStyle}>
          {data?.applicant?.name?.lastName?.charAt(0).toUpperCase() + data?.applicant?.name?.lastName?.slice(1).toLowerCase()}{", "}
                 {data?.applicant?.name?.firstName
                 ? data?.applicant.name.firstName.charAt(0).toUpperCase() +
                   data?.applicant.name.firstName.slice(1).toLowerCase()
                 : ""}
            {", "}
          </span>
          <div className={`${style.rejectionTextStyle} ${style.marginLeft2}`}>
            {data?.basicDetailReferences?.applicantType?.serviceProviderType}
          </div>
          <div className={`${style.rejectionHeadingTextStyle} ${style.marginLeft10}`}>
            {getApplicationStatus(data)}
          </div>
        </div>
      </div>
      
      <div className={style.secondColumn}>
        <div className={style.displayIdContainer}>
          <span className={style.rejectionHeadingTextStyle1}>{data?.staffId || ""}</span>
        </div>
      </div>
    </div>
             <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
             <div className={`${style.twoColumnGridInner}`}>
               <span className={`${style.rejectionTextStyle}`}>Email ID:</span>
               <span className={`${style.rejectionTextStyle1}`}>{data?.applicant?.email?.officialEmail || "-"}</span>
             </div>
             {/* <div className={`${style.twoColumnGridInner}`}>
               <span className={`${style.rejectionTextStyle}`}>Delivery Status:</span>
               <span className={`${style.rejectionTextStyle1}`}>Email Delivered</span>
             </div> */}
               <div className={style.twoColumnGridInner}>
                 <span className={style.rejectionTextStyle}>Department:</span>
                 <span className={style.rejectionTextStyle1}>{data?.basicDetailReferences?.department?.name || "-"}</span>
               </div>
               <div className={`${style.twoColumnGridInner}`}>
               <span className={`${style.rejectionTextStyle}`}>Privilege Category:</span>
               <span className={`${style.rejectionTextStyle1}`}>{data?.basicDetailReferences?.credentialingAndPrivilegingCategory?.name || "-"}</span>
             </div>
               <div className={style.twoColumnGridInner}>
                 <span className={style.rejectionTextStyle}>Division / Speciality:</span>
                 <span className={style.rejectionTextStyle1}>{data?.basicDetailReferences?.specialty?.name|| "-"}</span>
               </div>
               {entity?.multiSiteEntity && (
                 <div className={style.twoColumnGridInner}>
                   <span className={style.rejectionTextStyle}>Site Name:</span>
                   <span className={style.rejectionTextStyle1}>{entity?.multiSiteEntity?.[0]?.name || "-"}</span>
                 </div>
               )}
               {/* <div className={style.twoColumnGridInner}>
                 <span className={style.rejectionTextStyle}>OHIP Number:</span>
                 <span className={style.rejectionTextStyle1}>{data?.applicant?.ohipNumber || "-"}</span>
               </div> */}
                <div className={style.twoColumnGridInner}>
                  <span className={style.rejectionTextStyle}>Sent On:</span>
                  <span className={style.rejectionTextStyle1}>{reappointmentDate}</span>
                </div>
                <div className={`${style.twoColumnGridInner}`}>
                  <span className={`${style.rejectionTextStyle}`}>Due Date:</span>
                  <span className={`${style.rejectionTextStyle1}`}>
                    {dueDate}
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
            <div  className={style.loadingOverlay}>
            <LoadingScreen/>
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

export default ReportsStaffTable;