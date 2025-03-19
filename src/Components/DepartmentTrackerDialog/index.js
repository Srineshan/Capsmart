import React, { useState, useEffect, forwardRef, useCallback, useRef } from "react";
import { GET, PUT, TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import TableTwo from "../TableDesignTwo";
import CircularProgress from "@mui/material/CircularProgress";
import { format } from "date-fns";
import { formatFirstNameLastName } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";
import WorkModeSelect from "../SwitchWorkSpaceDialog";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Tooltip } from "@material-ui/core";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CommonSelectField from '../CommonFields/CommonSelectField';
import CommonSearchField from "../CommonFields/CommonSearchField";

const DepartmentTrackerDialog = ({ getIsOpen, isLoading, getActiveApplicationView, getNotesDialog }) => {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchTermForTable, setSearchTermForTable] = useState('');
  const [searchCount, setSearchount] = useState(0);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [showWorkModeSelectDialog, setShowWorkModeSelectDialog] = useState(false);
  const [showDepartmentsFilter, setShowDepartmentsFilter] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const selectedDepartmentName = departmentList?.find(data => data?.id === selectedDepartment)?.departmentName?.name;
  const [limit, setLimit] = useState(9999);
  useEffect(() => {
    getActiveUserData()
  }, [sortField, sortValue, page, totalCount, selectedDepartment, limit, searchTermForTable]);

  // useEffect(() => {
  //   sessionStorage.setItem("fromSummary", false);
  //   getApplication();
  // }, [applicationType]);


  const onClickCreateNoteFunction = (data) => {
    getNotesDialog(true);
    sessionStorage.setItem("applicationId", data?.id);
    getIsOpen(false);
  };

  useEffect(() => {
    setUserDetails();
  }, [users?.id])

  useEffect(() => {
    getDepartmentList();
  }, [showDepartmentsFilter])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchData([]); // Clear results if input is empty
      return;
    }

    const controller = new AbortController(); // Create an AbortController instance
    const signal = controller.signal;

    getActiveUserDataForSearch(signal); // Call API function with signal

    return () => controller.abort(); // Cleanup: Cancel previous request if a new one starts
  }, [searchTerm]);

  const getWorkModeDialogOpen = (value, data) => {
    setShowWorkModeSelectDialog(value)
    // sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickViewFunction = (data) => {
    setShowWorkModeSelectDialog(true)
    getActiveApplicationView(true);
    sessionStorage.setItem("applicationId", data?.id);
    // getIsOpen(false);
  };

  const getDepartmentList = async () => {
    const { data: department } = await GET(
      `entity-service/department`
    );
    setDepartmentList(department);
  }


  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    console.log("userdataaaa" + JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUserRole(userData?.roles?.map((data) => data?.roleName));
  }

  // const getApplication = async () => {
  //   try {
  //     // setIsLoadingImage(true);
  //     const { data: basicForm } = await GET(`application-management-service/application/${id}`);
  //     setFormDetails(basicForm);
  //     // setIsLoadingImage(false);
  //   } catch (error) {
  //     console.error('Error fetching application:', error);
  //   }
  // };

  const headerValues = [
    "No.",
    "Staff",
    "Type",
    // "OHIP Number",
    "Department",
    "Reappointment",
    "MSO",
    "DH / COS",
    "CC",
    "MAC",
    "BOD",
    "Status",
    "Last Updated by",
    ""
  ];
  const colSortValues = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  const departmentHeadActionsData = [
    {
      data: "View",
      requiredValue: "boolean",
      // onClick: onClickViewFunction,
      onClick: "",
    },
    // {
    //   data: "View Progress Log",
    //   requiredValue: "boolean",
    //   onClick: onClickCreateNoteFunction,
    //   // onClick: "",
    // },
    // {
    //   data: "Create Note",
    //   requiredValue: "boolean",
    //   onClick: onClickCreateNoteFunction,
    //   // onClick: "",
    // },
  ];

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };


  const getActiveUserData = async () => {
    try {
      setIsLoadingImage(true);
      const url = `application-management-service/staff/reappointmentStatusDetails?sortBy=${sortValue}&sortByField=${sortField}&limit=${limit}&searchText=${searchTermForTable}&isPaginationRequired=${limit === 9999 ? false : true}&offset=${page - 1}${selectedDepartment ? `&departmentId=${selectedDepartment}` : ''}`;

      const response = await GET(url);

      setTableData(response?.data?.applications);
      setTotalCount(response?.data?.numberOfElements);
      setSearchount(response?.data?.numberOfElements);
      setIsLoadingImage(false);
      return response?.data?.applications;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getActiveUserDataForSearch = async (signal) => {
    try {
      setIsLoadingImage(true);
      const url = `application-management-service/staff/reappointmentStatusDetails?sortBy=${sortValue}&sortByField=${sortField}&limit=${limit}&offset=${page - 1}&searchText=${searchTerm}&isPaginationRequired=${false}${selectedDepartment ? `&departmentId=${selectedDepartment}` : ''}`;

      const response = await GET(url, { signal });

      setSearchData(response?.data?.applications?.map(item => ({
        id: item.id,
        name: `${formatFirstNameLastName(item?.applicant?.name?.firstName, item?.applicant?.name?.lastName)}` || " ",
        desc: `${item?.basicDetailReferences?.department?.name} | ${item?.basicDetailReferences?.applicantType?.category}`
      })));
      setIsLoadingImage(false);
      return response?.data?.applications;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleShowForSearch = () => {
    console.log('search', searchTerm)
    setPage(1);
    setSearchTermForTable(searchTerm)
  }


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
    const No = [];
    const staff = [];
    const staffType = [];
    const ohipNo = [];
    const department = [];
    const reapointment = [];
    const staffManager = [];
    const deptHead = [];
    const cos = [];
    const cc = [];
    const mac = [];
    const bod = [];
    const status = [];
    const action = [];
    const lastUpdated = [];

    tableData?.map((data, index) => {
      No.push(index + 1 + ".")
      const workflowStaffManagerRole = data?.completedWorkflows?.find(workflow => workflow.role === "Staff Manager");
      const workflowDeptHeadRole = data?.completedWorkflows?.find(workflow => workflow.role === "Department Head");
      const workflowCredRole = data?.completedWorkflows?.find(workflow => workflow.role === "Credentialing Committee");
      const workflowMacRole = data?.completedWorkflows?.find(workflow => workflow.role === "Advisory Committee");
      const workflowBodRole = data?.completedWorkflows?.find(workflow => workflow.role === "Board");

      staff.push(
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );

      // ohipNo.push(`${data?.displayId}` || "123");
      staffType.push(`${data?.basicDetailReferences?.applicantType?.serviceProviderType}` || "Dentist");
      department.push(`${data?.basicDetailReferences?.department?.name}` || "Surgery");
      const color = data?.status === "DECLINED" ? "red"
        : data?.formFillingStatus === "REJECTED" ? "red"
          : data?.formFillingStatus === "IN_PROGRESS" ? "yellow"
            : data?.formFillingStatus === "COMPLETED" ? "green"
              : "grey";

      reapointment.push(color);
      console.log("Matching workflow found:", {
        status: data?.status,
        assignedColor: color
      });

      if (workflowStaffManagerRole) {
        const color = workflowStaffManagerRole?.approvalType === "VERIFIED_AND_ACCEPTED" ? "green"
          : workflowStaffManagerRole?.approvalType === "NOT_RECOMMENDED" ? "red"
            : "grey";
        staffManager.push(color);
        console.log("Matching workflow found:", {
          role: workflowStaffManagerRole.role,
          status: workflowStaffManagerRole?.approvalType,
          assignedColor: color
        });
      } else {
        staffManager.push('grey');
      }
      if (workflowDeptHeadRole) {
        const color = workflowDeptHeadRole?.approvalType === "RECOMMENDED" ? "green"
          : workflowDeptHeadRole?.approvalType === "RECOMMENDED_WITH_NOTES" ? "yellow"
            : workflowDeptHeadRole?.approvalType === "NOT_RECOMMENDED" ? "red"
              : "grey";
        deptHead.push(color);
        console.log("Matching workflow found:", {
          role: workflowDeptHeadRole.role,
          status: workflowDeptHeadRole?.approvalType,
          assignedColor: color
        });
      } else {
        deptHead.push('grey');
      }
      if (workflowCredRole) {
        const color = workflowCredRole?.approvalType === "RECOMMENDED_WITH_NOTES" ? "yellow"
          : workflowCredRole?.approvalType === "RECOMMENDED" ? "green"
            : workflowCredRole?.approvalType === "NOT_RECOMMENDED" ? "red"
              : "grey";
        cc.push(color);
        console.log("Matching workflow found:", {
          role: workflowCredRole.role,
          status: workflowCredRole?.approvalType,
          assignedColor: color
        });
      } else {
        cc.push('grey');
      }
      if (workflowMacRole) {
        const color = workflowMacRole?.approvalType === "RECOMMENDED_WITH_NOTES" ? "yellow"
          : workflowMacRole?.approvalType === "RECOMMENDED" ? "green"
            : workflowMacRole?.approvalType === "NOT_RECOMMENDED" ? "red"
              : "grey";
        mac.push(color);
        console.log("Matching workflow found:", {
          role: workflowMacRole.role,
          status: workflowMacRole.approvalType,
          assignedColor: color
        });
      } else {
        mac.push('grey');
      }
      if (workflowBodRole) {
        const color = workflowBodRole?.approvalType === "RECOMMENDED_WITH_NOTES" ? "yellow"
          : workflowBodRole?.approvalType === "RECOMMENDED" ? "green"
            : workflowBodRole?.approvalType === "NOT_RECOMMENDED" ? "red"
              : "grey";
        bod.push(color);
        console.log("Matching workflow found:", {
          role: workflowBodRole.role,
          status: workflowBodRole.approvalType,
          assignedColor: color
        });
      } else {
        bod.push('grey');
      }
      if (Array.isArray(data?.completedWorkflows) && data?.completedWorkflows?.length > 0) {
        let lastApproval = data?.completedWorkflows
          .filter(item => item.approvalType !== null)
          .pop();

        if (lastApproval) {
          const formattedApprovalType = lastApproval.approvalType.toLowerCase().replace(/_/g, " ");
          status.push(`${lastApproval.role}, ${formattedApprovalType}`)
        } else {
          if (data?.formFillingStatus === "IN_PROGRESS") {
            status.push("Reappointment Application In-Progress");
          } else {
            status.push("MSO Verification Not Started")
          }
        }
      } else {
        if (data?.status === "DECLINED") {
          status.push("Reappointment Application Declined");
        } else {
          if (data?.formFillingStatus === "IN_PROGRESS") {
            status.push("Reappointment Application In-Progress");
          } else if (data?.formFillingStatus === "PENDING") {
            status.push("Reappointment Application Not Started");
          } else {
            status.push("MSO Verification Not Started");
          }
        }
      }

      lastUpdated.push(
        <>
          {data?.updatedBy?.name?.firstName}<br />
          {format(new Date(data?.lastModifiedDate), "MM/dd/yyyy")}
        </>
      );
      action.push(true);
    });

    return [
      { type: "text", value: No },
      { type: "text", value: staff },
      { type: "text", value: staffType },
      // { type: "text", value: ohipNo },
      { type: "text", value: department },
      { type: "dot", value: reapointment },
      { type: "dot", value: staffManager },
      { type: "dot", value: deptHead },
      { type: "dot", value: cc },
      { type: "dot", value: mac },
      { type: "dot", value: bod },
      { type: "text", value: status },
      {
        type: "text",
        value: lastUpdated
      },
      { type: "action", value: action },
    ];
  };

  return (
    <>
      {isLoadingImage && (
        <div className={style.loadingOverlay}>
          <LoadingScreen />
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
                {/* Staff Reappointment Status {" "}({" "}{totalCount|| 0 }{" "}) */}
                Staff Reappointment Status
              </div>
              <div className={style.displayInRow}>
                <div className={`${style.searchFieldWidth}`}>
                  <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} />
                </div>
                {selectedDepartment && (
                  <div className={`${style.filterBackground} ${style.displayInRow}`}>
                    <div className={`${style.filtertextStyle} ${style.marginRight5}`}>Filter by {selectedDepartmentName}</div>
                    <Tooltip title="Remove" arrow>
                      <CancelOutlinedIcon
                        sx={{
                          fontSize: 15,
                          color: "#06617A",
                        }}
                        className={style.cursorPointer}
                        onClick={() => setSelectedDepartment()}
                      />
                    </Tooltip>
                  </div>
                )}
                <div
                  className={`${style.alignCenter} ${style.cursorPointer
                    } ${style.marginRight20}`}
                  style={{
                    opacity: 1,
                  }}
                  onClick={() => setShowDepartmentsFilter(!showDepartmentsFilter)}
                >
                  <Tooltip title="Filter" arrow>
                    <FilterAltOutlinedIcon
                      sx={{
                        fontSize: 25,
                        color: "#06617A",
                      }}

                    />
                  </Tooltip>
                </div>
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
            {/* Expandable Department List */}
            {showDepartmentsFilter && (
              <div className={style.departmentContainer}>
                <div>
                  <CommonSelectField
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className={style.fullWidth}
                    firstOptionLabel={'All'}
                    firstOptionValue={''}
                    valueList={departmentList?.map(data => data?.id)}
                    labelList={departmentList?.map(data => data?.departmentName?.name)}
                    disabledList={departmentList?.map(data => false)}
                    label={'Department'}
                    required={false}
                  />
                </div>
              </div>
            )}
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
                        searchTermForTable={searchTermForTable}
                        searchCount={searchCount}
                        setSearchTermForTable={setSearchTermForTable}
                        onLimitChange={handleLimitChange}
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
      {showWorkModeSelectDialog && (
        <WorkModeSelect getIsOpen={getWorkModeDialogOpen} getActiveApplicationView={getActiveApplicationView} />
      )}
    </>
  );
};

export default DepartmentTrackerDialog;