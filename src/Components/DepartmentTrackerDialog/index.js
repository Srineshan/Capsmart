import React, { useState, useEffect,forwardRef, useCallback, useRef } from "react";
import { GET, PUT , TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import TableTwo from "../TableDesignTwo";
import CircularProgress from "@mui/material/CircularProgress";
import { format } from "date-fns";
import { fileLoadingURL,dataLoadingGIF } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";

const ApprovalWithNotesDialog = ({ getIsOpen, isLoading, getActiveApplicationView }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [userNotes, setUserNotes] = useState('');
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const id = sessionStorage.getItem("applicationId");
  const [dateTime] = useState(new Date().toISOString());
  const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
  const [encryptedText, setEncryptedText] = useState('');
  const [isCheckedSign, setIsCheckedSign] = useState(false);
  const [name, setName] = useState('')
  const [applicationType, setApplicationType] = useState(() =>
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );
  const [tableData, setTableData] = useState([]);
  const [sortField, setSortField] = useState("DEFAULT");
  const [sortValue, setSortValue] = useState("DESCENDING");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    getActiveUserData()
  }, [ sortField, sortValue,page,totalCount]);

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
  }, [applicationType]);



  useEffect(() => {
    setUserDetails();
  }, [users?.id])

  const onClickViewFunction = (data) => {
    getActiveApplicationView(true);
    sessionStorage.setItem("applicationId", data?.id);
    getIsOpen(false);
  };


  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    console.log("userdataaaa" + JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUserRole(userData?.roles?.map((data) => data?.roleName));
  }

  const getApplication = async () => {
    try {
      // setIsLoadingImage(true);
      const { data: basicForm } = await GET(`application-management-service/application/${id}`);
      setFormDetails(basicForm);
      // setIsLoadingImage(false);
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };

const headerValues = [
    "",
    "Staff",
    // "Staff ID",
    "Staff Type",
    "Staff Manager",
    "CC Status",
    "MAC Status",
    "BOD Status",
    "Last Updated by",
    ""
  ];
  const colSortValues = [false, false, false, false, false, false];
  const departmentHeadActionsData = [
    {
      data:  "View" ,
      requiredValue: "boolean",
      onClick: onClickViewFunction,
    },
    // {
    //   data: "Request For Clarification",
    //   requiredValue: "boolean",
    //   isParagraph: true,
    //   hideForRoles: "Staff Manager",
    //   showForRoles: "Chief Of Staff",
    //   showForRoles2: "Department Head",
    // },
    // { data: applicationType === "NEW" ? "From Applicant" : "From Staff", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Staff Manager", showForRoles2: "Chief Of Staff", showForRoles: "Department Head", },
    // { data: "From Internal Approver", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Staff Manager", showForRoles2: "Chief Of Staff", showForRoles: "Department Head", },
    // { data: "From Institution", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Staff Manager", showForRoles2: "Chief Of Staff", showForRoles: "Department Head", },
  ];


  const getActiveUserData = async () => {
    try {
      setIsLoadingImage(true);
      const response = await GET(
        `application-management-service/application?sortBy=${sortValue}&sortByField=${sortField}&limit=${10}&offset=${page - 1}`
      );

      setTableData(response?.data?.applications);
      setTotalCount(response?.data?.numberOfElements);
      setIsLoadingImage(false);
      return response?.data?.applications;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getSelectedPage = (value) => {
    setPage(value);
}

  const getHandleSort = (value, sortBy) => {
    if (sortBy === "ASCENDING") {
      setSortField(value);
      setSortValue("DESCENDING");
    } else if (sortBy === "DESCENDING") {
      setSortField("DEFAULT");
      setSortValue("ASCENDING");
    } else if (sortBy === "NONE") {
      setSortField(value);
      setSortValue("ASCENDING");
    }
  };

  const getTableValues = () => {
    const dot = [];
    const staff = [];
    const staffId = [];
    const staffType = [];
    const staffManager = [];
    const cc = [];
    const mac = [];
    const bod = [];
    const action = [];
    const lastUpdated = [];

    tableData?.forEach((data) => {
        const workflowStaffManagerRole = data?.completedWorkflows?.find(workflow => workflow.role === "Staff Manager");
        const workflowCredRole = data?.completedWorkflows?.find(workflow => workflow.role === "Credentialing Committee");
        const workflowMacRole = data?.completedWorkflows?.find(workflow => workflow.role === "Advisory Committee");
        const workflowBodRole = data?.completedWorkflows?.find(workflow => workflow.role === "Board");

        const color = data?.status === "REJECTED" ? "red"
          : data?.status === "REVIEW_INPROGRESS" ? "yellow"
          : data?.status === "COMPLETED" ? "green"
            : "grey";
            dot.push(color);
        console.log("Matching workflow found:", {
          status: data?.status,
          assignedColor: color
        });
  
      staff.push(
        <>
          {`${data?.applicant?.name?.firstName.charAt(0).toUpperCase() +
            data?.applicant?.name?.firstName.slice(1).toLowerCase()
            },  ${data?.applicant?.name?.lastName.toUpperCase()}` || " "}
        </>
      );

      // staffId.push(`${data?.displayId}` || "123");
      staffType.push(`${data?.basicDetailReferences?.applicantType?.serviceProviderType}` || "Dentist");
      if (workflowStaffManagerRole) {
        const color = workflowStaffManagerRole?.status === "IN_PROGRESS" ? "yellow"
          : workflowStaffManagerRole?.status === "COMPLETED" ? "green"
            : "grey";
            staffManager.push(color);
        console.log("Matching workflow found:", {
          role: workflowStaffManagerRole.role,
          status: workflowStaffManagerRole?.status,
          assignedColor: color
        });
      }
      if (workflowCredRole) {
        const color = workflowCredRole?.status === "IN_PROGRESS" ? "yellow"
          : workflowCredRole?.status === "COMPLETED" ? "green"
            : "grey";
            cc.push(color);
        console.log("Matching workflow found:", {
          role: workflowCredRole.role,
          status: workflowCredRole?.status,
          assignedColor: color
        });
      }
      if (workflowMacRole) {
        const color = workflowMacRole?.status === "IN_PROGRESS" ? "yellow"
          : workflowMacRole?.status === "COMPLETED" ? "green"
            : "grey";
            mac.push(color);
        console.log("Matching workflow found:", {
          role: workflowMacRole.role,
          status: workflowMacRole.status,
          assignedColor: color
        });
      }
      if (workflowBodRole) {
        const color = workflowBodRole?.status === "IN_PROGRESS" ? "yellow"
          : workflowBodRole?.status === "COMPLETED" ? "green"
            : "grey";
            bod.push(color);
        console.log("Matching workflow found:", {
          role: workflowBodRole.role,
          status: workflowBodRole.status,
          assignedColor: color
        });
      }
      lastUpdated.push(
        <>
          {data?.updatedBy?.name?.firstName}<br />
          {format(new Date(data?.lastModifiedDate), "MMM dd, yyyy")}
        </>
      );
      action.push(true);
    });

    return [
      { type: "dot", value: dot },
      { type: "text", value: staff },
      // { type: "text", value: staffId },
      { type: "text", value: staffType },
      { type: "dot", value: staffManager },
      { type: "dot", value: cc },
      { type: "dot", value: mac },
      { type: "dot", value: bod },
      {
        type: "iconWithCount",
        value: lastUpdated
      },
      { type: "action", value: action },
    ];
  };

  return (
<>
 {isLoadingImage && (
     <div  className={style.loadingOverlay}>
       <LoadingScreen/>
     </div>
    )}
 {/* {!isLoadingImage && ( */}

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
            Reappointments Status Tracker {" "}({" "}{totalCount|| 0 }{" "})
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
            <div className={`${style.marginTop10}`}>
            <div>
        <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
          {isLoading ? (
            <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
              <CircularProgress sx={{ color: "#06617A" }} />
            </div>
          ) : (
            <div className={`${style.reduceMarginTop10} ${style.margin20} staffApplicationList`}>
              <TableTwo
                tableHeaderValues={headerValues}
                tableDataValues={getTableValues()}
                tableData={tableData}
                gridStyle={style.permanentStaffGrid}
                actions={departmentHeadActionsData}
                scrollStyle={style.contractScrollStyle}
                tableSortValues={colSortValues}
                heading={"There are no record to display"}
                getHandleSort={getHandleSort}
                sortValue={{ sortBy: sortValue, sortByField: sortField }}
                getSelectedPage={getSelectedPage}
                totalCount={totalCount}
                page={page}
              />
            </div>
          )}
        </div>
      </div>
    </div>
   </div>
 </div>
</Dialog>
{/* // )} */}
</>
  );
};

export default ApprovalWithNotesDialog;
