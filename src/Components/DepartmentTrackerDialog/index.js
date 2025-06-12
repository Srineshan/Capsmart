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
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CommonSelectField from '../CommonFields/CommonSelectField';
import CommonSearchField from "../CommonFields/CommonSearchField";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

const DepartmentTrackerDialog = ({ getIsOpen, isLoading, getActiveApplicationView, getNotesDialog }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const navigate = useNavigate();
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
  const [showFilter, setShowFilter] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedServiceArea, setSelectedServiceArea] = useState("");
  const [applicantType, setApplicantType] = useState([]);
  const [selectedApplicantType, setSelectedApplicantType] = useState('');
  const selectedDepartmentName = departmentList?.find(data => data?.id === selectedDepartment)?.departmentName?.name;
  const selectedApplicantTypeName = applicantType?.find(data => data?.id === selectedApplicantType)?.applicantType;
  const [limit, setLimit] = useState(9999);
  const workModeType = sessionStorage.getItem('workModeType')

  const transformedOptions = departmentList?.flatMap((department) => {
    const departmentEntry = {
      value: department?.id,
      label: department?.departmentName?.name,
      type: 'department'
    };

    const serviceAreaEntries = department.serviceAreas?.map((serviceArea) => ({
      value: `${department.id}|${serviceArea.id}`,
      label: (
        <span className={style.marginLeft}>
          {serviceArea?.name}
        </span>
      ),
      type: 'serviceArea'
    })) || [];

    return [departmentEntry, ...serviceAreaEntries]; // Include department first, then service areas
  }) || [];

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const [departmentId, serviceAreaId] = selectedValue.split("|");

    setSelectedDepartment(departmentId || "");
    setSelectedServiceArea(serviceAreaId || "");

    console.log("selectedDept", selectedValue)
  }

  useEffect(() => {
    getActiveUserData()
  }, [sortField, sortValue, page, totalCount, selectedDepartment, selectedServiceArea, selectedApplicantType, limit, searchTermForTable]);

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
  }, [users?.id, workModeType])

  useEffect(() => {
    getDepartmentList();
    getApplicantType();
  }, [showFilter])

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

  const getApplicantType = async () => {
    const { data: applicant } = await GET(
      `entity-service/applicantType`
    );
    setApplicantType(applicant);
    // if (applicant?.filter(data => data?.applicantType === "Physician")?.length !== 0) {
    //   setSelectedApplicantType(applicant?.filter(data => data?.applicantType === "Physician")?.[0]?.id);
    // } else {
    //   setSelectedApplicantType(applicant?.[0]?.id);
    // }
  }


  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    console.log("userdataaaa" + JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUserRole(userData?.roles?.map((data) => data?.roleName));
    if(workModeType === "Department Head"){
      setSelectedDepartment(userData?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.id);
    }
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
    "Staff Type",
    // "OHIP Number",
    "Department",
    "Reappointment Application",
    "MSO",
    "DH / COS",
    "CC",
    "MAC",
    "BOD",
    "Status",
    "Last Updated by",
    ""
  ];
  const locumHeaderValues = [
    "No.",
    "Staff Name",
    "Staff Type",
    "Expiration Date",
    "Department",
    "Dept Head",
    "Renewal Application",
    "MSO Verification",
    "COS",
    "CC",
    "MAC",
    "BOD Approval",
    "Status",
    "Last Updated by",
  ];
  const colSortValues = [false, true, true, true, false, false, false, false, false, false, false, false, false, false, false];
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
      const departmentParam = selectedDepartment || selectedServiceArea ? `&departmentSpecialties=${selectedDepartment}%23${selectedServiceArea}` : "";
      const url = `application-management-service/staff/reappointmentStatusDetails?sortBy=${sortValue}&sortByField=${sortField}&positionType=${applicationType === "LOCUM" ? "LOCUM" : "PERMANENT"}&limit=${limit}&searchText=${searchTermForTable}&isPaginationRequired=${limit === 9999 ? false : true}&offset=${page - 1}${departmentParam}${selectedApplicantType ? `&applicantTypeId=${selectedApplicantType}` : ''}`;

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
      const departmentParam = selectedDepartment || selectedServiceArea ? `&departmentSpecialties=${selectedDepartment}%23${selectedServiceArea}` : "";
      const url = `application-management-service/staff/reappointmentStatusDetails?sortBy=${sortValue}&sortByField=${sortField}&limit=${limit}&offset=${page - 1}&searchText=${searchTerm}&isPaginationRequired=${false}${departmentParam}`;

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

  const handleNavigateStatus = () => {
    if (applicationType === "LOCUM") {
      navigate("/reportTypeOverview/locumStaffRenewalStatusTracker", { state: { tableData } });
    } else {
      navigate("/reportTypeOverview/staffReappointmentTracker", { state: { tableData } });
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
    const expirationDate = []

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
            : data?.formFillingStatus === "COMPLETED" ? "darkgreen"
              : "grey";

      reapointment.push(color);
      console.log("Matching workflow found:", {
        status: data?.status,
        assignedColor: color
      });

      expirationDate.push(data?.priorCyclePeriod?.to ? format(new Date(data?.priorCyclePeriod?.to), 'MM/dd/yyyy') : '-')

      if (workflowStaffManagerRole) {
        const color = workflowStaffManagerRole?.approvalType === "VERIFIED_AND_ACCEPTED" ? "darkgreen"
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
        const color = workflowDeptHeadRole?.approvalType === "RECOMMENDED" ? "darkgreen"
          : workflowDeptHeadRole?.approvalType === "RECOMMENDED_WITH_NOTES" ? "green"
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
        const color = workflowCredRole?.approvalType === "RECOMMENDED_WITH_NOTES" ? "green"
          : workflowCredRole?.approvalType === "RECOMMENDED" ? "darkgreen"
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
        const color = workflowMacRole?.approvalType === "RECOMMENDED_WITH_NOTES" ? "green"
          : workflowMacRole?.approvalType === "RECOMMENDED" ? "darkgreen"
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
        const color = workflowBodRole?.approvalType === "RECOMMENDED_WITH_NOTES" ? "green"
          : workflowBodRole?.approvalType === "RECOMMENDED" ? "darkgreen"
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
          const formattedApprovalType = lastApproval?.approvalType.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
          status.push(`${lastApproval?.role}, ${formattedApprovalType}`);
        } else {
          if (data?.status === "DECLINED") {
            status.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Declined`);
          } else if (data?.formFillingStatus === "COMPLETED" && data?.status === "CREATED") {
            status.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Not Submitted`);
          } else if (data?.formFillingStatus === "IN_PROGRESS") {
            status.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application In-Progress`);
          } else {
            status.push("MSO Verification Not Started");
          }
        }
      } else {
        if (data?.status === "DECLINED") {
          status.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Declined`);
        } else if (data?.formFillingStatus === "COMPLETED" && data?.status === "CREATED") {
          status.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Not Submitted`);
        } else if (data?.formFillingStatus === "IN_PROGRESS") {
          status.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application In-Progress`);
        } else {
          status.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Not Started`);
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

    return applicationType === "LOCUM" ? [
      { type: "text", value: No },
      { type: "text", value: staff },
      { type: "text", value: staffType },
      { type: "text", value: expirationDate },
      { type: "text", value: department },
      { type: "dot", value: reapointment },
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
    ] : [
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
                {applicationType === "LOCUM" ? 'Locum Renewal Status Tracker' : 'Staff Reappointment Status'}
              </div>
              <div className={style.displayInRow}>
                {(selectedDepartment && workModeType !== "Department Head") && (
                  <div className={`${style.filterBackground} ${style.displayInRow}`}>
                    <div className={`${style.filtertextStyle} ${style.marginRight5}`}>Filter by {selectedDepartmentName}</div>
                    <Tooltip title="Remove" arrow>
                      <CancelOutlinedIcon
                        sx={{
                          fontSize: 15,
                          color: "#06617A",
                        }}
                        className={style.cursorPointer}
                        onClick={() => { setSelectedDepartment(); setSelectedServiceArea() }}
                      />
                    </Tooltip>
                  </div>
                )}
                {selectedApplicantType && (
                  <div className={`${style.filterBackground} ${style.displayInRow} ${style.marginLeft5}`}>
                    <div className={`${style.filtertextStyle} ${style.marginRight5}`}>Filter by {selectedApplicantTypeName}</div>
                    <Tooltip title="Remove" arrow>
                      <CancelOutlinedIcon
                        sx={{
                          fontSize: 15,
                          color: "#06617A",
                        }}
                        className={style.cursorPointer}
                        onClick={() => setSelectedApplicantType()}
                      />
                    </Tooltip>
                  </div>
                )}
                <div
                  className={`${style.alignCenter} ${style.cursorPointer
                    }`}
                  style={{
                    opacity: 1,
                  }}
                  onClick={() => setShowFilter(!showFilter)}
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
                <div
                  className={`${style.alignCenter
                    } ${style.cursorPointer} ${style.marginLeft10}`}
                >
                  <Tooltip title='Print Data' arrow >
                    <PrintOutlinedIcon
                      sx={{
                        fontSize: 25,
                        color: "#06617A",
                      }}
                      onClick={handleNavigateStatus}
                    />
                  </Tooltip>
                </div>
                <Tooltip title="Close" arrow>
                  <img
                    src={CrossPink}
                    alt="cross"
                    className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft10}`}
                    onClick={() => {
                      getIsOpen(false);
                    }}
                  />
                </Tooltip>
              </div>
            </div>
            {/* Expandable Department List */}
            {showFilter && (
              <div className={style.departmentContainer}>
                {workModeType !== "Department Head" && (
                  <div>
                  <CommonSelectField
                    value={selectedDepartment}
                    onChange={handleChange}
                    className={style.fullWidth}
                    firstOptionLabel={'All'}
                    firstOptionValue={''}
                    valueList={transformedOptions.map(option => option?.value)}
                    labelList={transformedOptions.map(option => option?.label)}
                    disabledList={transformedOptions.map(() => false)}
                    label={'Dept / Division & Specialty'}
                    required={false}
                  />
                </div>
                )}
                <div>
                  <CommonSelectField
                    value={selectedApplicantType}
                    onChange={(e) => setSelectedApplicantType(e.target.value)}
                    className={style.fullWidth}
                    firstOptionLabel={'All'}
                    firstOptionValue={''}
                    valueList={applicantType?.map(data => data?.id)}
                    labelList={applicantType?.map(data => data?.applicantType)}
                    disabledList={applicantType?.map(data => false)}
                    label={'Staff Type'}
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
                        tableHeaderValues={applicationType === "LOCUM" ? locumHeaderValues : headerValues}
                        tableDataValues={getTableValues()}
                        tableData={tableData}
                        gridStyle={applicationType === "LOCUM" ? style.permanentLocumStaffGrid : style.permanentStaffGrid}
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
                        searchField={<CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} placeholder={applicationType === "LOCUM" ? 'Search Locum Staff' : 'Search Staff Reappointment'} />}
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