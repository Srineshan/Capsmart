import React, { useState, useEffect, forwardRef } from 'react';
import { GET, POST, PUT } from '../../Screens/dataSaver';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import ApplicationHeader from "../../Components/ApplicationHeader";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";
import TableTwo from "../../Components/TableDesignTwo";
import style from './index.module.scss';
import Checkbox from '@mui/material/Checkbox';
import Resend from './../../images/Resend.png';
import ResendDisabled from './../../images/Resend-disabled.png';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import { ErrorToaster2, SuccessToaster, SuccessToaster2 } from '../../utils/toaster';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatFirstNameLastName } from "../../utils/formatting";
import CommonSearchField from '../../Components/CommonFields/CommonSearchField';
import { Tooltip } from '@mui/material';


const ReappointmentApplication = forwardRef(({ isLoading, basicForm }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedOption, setSelectedOption] = useState({});
  const [tableData, setTableData] = useState([]);
  const [sortField, setSortField] = useState("REAPPOINTMENT_STATUS");
  const [sortValue, setSortValue] = useState("DESCENDING");
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedServiceArea, setSelectedServiceArea] = useState("");
  const [privilegeCategories, setPrivilegeCategories] = useState([]);
  const [selectedPrivilegeCategory, setSelectedPrivilegeCategory] = useState('');
  const [applicantType, setApplicantType] = useState([]);
  const [selectedApplicantType, setSelectedApplicantType] = useState('');
  const [selectedReappointmentStatus, setSelectedReappointmentStatus] = useState('');
  const [selectedReappointmentSubStatus, setSelectedReappointmentSubStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [applicationStatus, setApplicationStatus] = useState("CREATED");
  // Replace sessionStorage with state
  const [checkedIds, setCheckedIds] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchTermForTable, setSearchTermForTable] = useState('');
  const [searchCount, setSearchount] = useState(0);
  const [limit, setLimit] = useState(9999);
  const [applicationCreationType, setApplicationCreationType] = useState(sessionStorage.getItem('applicationCreationType'))
  const selectedDepartmentName = departmentList?.find(data => data?.id === selectedDepartment)?.departmentName?.name;
  const selectedApplicantName = applicantType?.find(data => data?.id === selectedApplicantType)?.applicantType;
  let availableApplicationStatus = {
    "CREATED": "Not Submitted",
    "SUBMITTED": "Submitted",
    "APPROVED": "Approved",
    "REJECTED": "Rejected",
    "COMPLETED": "Completed",
    "REVIEW_INPROGRESS": "Review In Progress",
    "DECLINED": "Declined"
  }

  console.log("selectedReappointmentSubStatus", selectedReappointmentStatus)
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
    getDepartmentList();
    getApplicantType();
  }, [])

  useEffect(() => {
    getPrivilegeCategory();
  }, [selectedApplicantType])

  useEffect(() => {
    getActiveUserData().then(() => {
      setIsDataLoaded(false);
    });
    setCheckedIds([]);
  }, [selectedDepartment, selectedPrivilegeCategory, selectedApplicantType, selectedReappointmentStatus, applicationStatus, sortField, sortValue, page, totalCount, limit, searchTermForTable, selectedServiceArea, selectedReappointmentSubStatus]);

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

  useEffect(() => {
    if (isDataLoaded) {
      // Once data is loaded, set all IDs as checked
      const allIds = tableData.map(data => data.id);
      setCheckedIds(allIds);
    }
  }, [isDataLoaded, tableData]);

  const handleSelectAllClick = () => {
    if (checkedIds?.length === tableData?.length) {
      // If all are already selected, deselect all
      setCheckedIds([]);
    } else {
      // Select all IDs
      const allIds = tableData.map(data => data.id);
      setCheckedIds(allIds);
    }
    // console.log("allIdsall" + checkedIds)
  };

  const handleCheckboxClick = (id) => {
    setCheckedIds(prevCheckedIds => {
      // Toggle the ID in the array
      return prevCheckedIds.includes(id)
        ? prevCheckedIds.filter(checkedId => checkedId !== id)
        : [...prevCheckedIds, id];
    });
    // console.log("Idschecked" + checkedIds)
  };

  console.log("Idscheckedsssssssssss" + checkedIds)

  const headerValues = [
    <CommonCheckBox
      size="medium"
      checked={checkedIds?.length === tableData?.length}
      onChange={handleSelectAllClick}
      className={style.padding0}
    />,
    "No.",
    `${applicationCreationType === "LOCUM" ? "Locum Staff Name" : "Staff Name"}`,
    "Email",
    `${applicationCreationType === "LOCUM" ? "Locum Staff Type" : "Staff Type"}`,
    "Department",
    "Status",
    "Completed %",
    "Last Sent",
    // "Reminder Status",
    // "Application Status",
    "Action"
  ];
  const colSortValues = [false, false, true, false, true, true, true, true, false, false];

  // Rest of the methods remain the same as in your original code...
  const handleCloseClick = () => {
    navigate("/applications");
  };

  const getActiveUserData = async () => {
    try {
      const queryParams = new URLSearchParams({
        status: 'ACTIVE'
      });

      // const types = ['PERMANENT', 'LOCUM'];
      // types.forEach(type => queryParams.append('type', type));

      if (applicationCreationType === "LOCUM") {
        queryParams.append('type', 'LOCUM')
      } else {
        queryParams.append('type', 'PERMANENT')
      }

      // if (selectedDepartment) {
      //   queryParams.append('departmentId', selectedDepartment);
      // }

      if (selectedPrivilegeCategory) {
        queryParams.append('credentialingAndPrivilegingCategoryId', selectedPrivilegeCategory);
      }

      if (selectedApplicantType) {
        queryParams.append('applicantTypeId', selectedApplicantType);
      }

      if (applicationStatus && selectedReappointmentStatus !== 'NOT_SENT') {
        queryParams.append('applicationStatus', applicationStatus);
      }

      if (selectedReappointmentStatus) {
        queryParams.append('reappointmentStatus', selectedReappointmentStatus);
      }

      // if (selectedReappointmentStatus?.length > 0) {
      //   selectedReappointmentStatus.forEach(status => queryParams.append('reappointmentStatus', status));
      // }

      const departmentParam = selectedDepartment || selectedServiceArea ? `&departmentSpecialties=${selectedDepartment}%23${selectedServiceArea}` : "";
      const subStatusParam = selectedReappointmentSubStatus ? `&applicationSubStatus=${selectedReappointmentSubStatus}` : "";
      const response = await GET(
        `application-management-service/staff?${queryParams.toString()}&sortBy=${sortValue}&sortByField=${sortField}&sendForReappointment=false&limit=${limit}&offset=${page - 1}${departmentParam}${subStatusParam}&searchText=${searchTermForTable}&isPaginationRequired=${limit === 9999 ? false : true}`
      );

      // Filter out any data that might have 'type' as 'PROVISIONAL' in case backend returns it
      // const filteredData = response?.data?.staffs?.filter(item => item?.type !== 'PROVISIONAL') || [];

      setTableData(response?.data?.staffs);
      setTotalCount(response?.data?.numberOfElements);
      setSearchount(response?.data?.numberOfElements);
      return response?.data?.staffs;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getActiveUserDataForSearch = async (signal) => {
    try {
      const queryParams = new URLSearchParams({
        status: 'ACTIVE'
      });

      const types = ['PERMANENT', 'LOCUM'];
      types.forEach(type => queryParams.append('type', type));

      if (selectedDepartment) {
        queryParams.append('departmentId', selectedDepartment);
      }

      if (selectedPrivilegeCategory) {
        queryParams.append('credentialingAndPrivilegingCategoryId', selectedPrivilegeCategory);
      }

      if (selectedApplicantType) {
        queryParams.append('applicantTypeId', selectedApplicantType);
      }

      if (applicationStatus && selectedReappointmentStatus !== 'NOT_SENT') {
        queryParams.append('applicationStatus', applicationStatus);
      }

      if (selectedReappointmentStatus) {
        queryParams.append('reappointmentStatus', selectedReappointmentStatus);
      }

      const response = await GET(
        `application-management-service/staff?${queryParams.toString()}&sortBy=${sortValue}&sortByField=${sortField}&sendForReappointment=false&limit=${limit}&offset=${page - 1}&searchText=${searchTerm}&isPaginationRequired=${false}`, { signal }
      );

      // Filter out any data that might have 'type' as 'PROVISIONAL' in case backend returns it
      // const filteredData = response?.data?.staffs?.filter(item => item?.type !== 'PROVISIONAL') || [];

      setSearchData(response?.data?.staffs?.map(item => ({
        id: item.id,
        name: `${formatFirstNameLastName(item?.applicant?.name?.firstName, item?.applicant?.name?.lastName)}` || " ",
        desc: `${item?.basicDetailReferences?.department?.name} | ${item?.basicDetailReferences?.applicantType?.category}`,
        lastName: `${item?.applicant?.name?.lastName}`
      })));
      return response?.data?.staffs;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const onClickUserFunction = (data, index) => {
    setSearchTermForTable(data?.lastName)
    console.log("searchData", index, "searchTermForTable", searchTermForTable, "searchTerm", searchTerm, 'data', data)
  }

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const reappointmentApplicationbulk = async () => {
    if (checkedIds?.length === 0) {
      console.log('No checked IDs to process');
      return;
    }

    try {
      const response = await POST(
        `application-management-service/staff/reappoint/bulk`,
        checkedIds
      );
      if (response?.data) {
        SuccessToaster('Reappointment Application Sent Successfully');
      }
      console.log(response?.data);
      getActiveUserData();
    } catch (error) {
      console.log(error);
    }
  };

  const reappointmentApplicationResendbulk = async () => {
    if (checkedIds?.length === 0) {
      console.log('No checked IDs to process');
      return;
    }

    try {
      const response = await POST(
        `application-management-service/staff/resendReappointmentEmail/bulk`,
        checkedIds
      );
      if (response?.data) {
        SuccessToaster('Reappointment Application Sent Successfully');
      }
      console.log(response?.data);
      getActiveUserData();
    } catch (error) {
      console.log(error);
    }
  };

  const getDepartmentList = async () => {
    const { data: department } = await GET(
      `entity-service/department`
    );
    setDepartmentList(department);
  }

  const getPrivilegeCategory = async () => {
    if (selectedApplicantType !== '') {
      const { data: privilege } = await GET(
        `entity-service/privilege?applicantTypeId=${selectedApplicantType}`
      );
      setPrivilegeCategories(privilege);
    } else {
      const { data: privilege } = await GET(
        `entity-service/privilege`
      );
      setPrivilegeCategories(privilege);
    }
  }

  const getApplicantType = async () => {
    const { data: applicant } = await GET(
      `entity-service/applicantType`
    );
    setApplicantType(applicant)
    // setApplicantType(applicant?.filter(data => data?.id !== "66dc4517788741fedc982f05"));
    // if (applicant?.filter(data => data?.applicantType === "Physician")?.length !== 0) {
    //   setSelectedApplicantType(applicant?.filter(data => data?.applicantType === "Physician")?.[0]?.id);
    // } else {
    //   setSelectedApplicantType(applicant?.[0]?.id);
    // }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleShowForSearch = () => {
    console.log('search', searchTerm)
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

  const handleResend = async (id) => {
    await PUT(
      `application-management-service/staff/${id}/resendReappointmentEmail`
    ).then(() => {
      SuccessToaster2("Application mail resent successfully!")
    });
  }

  const handleNavigate = () => {
    navigate("/reportTypeOverview/staffbyTypes", {
      state: { tableData },
    });
  };

  let checkbox = [];
  let applicantName = [];
  let applicantId = [];
  let applicantTypeName = [];
  let department = [];
  let reappointment = [];
  let Percentage = [];
  let DateSend = [];
  let ReminderCount = [];
  let applicationStatusList = [];
  let actionList = [];
  let emailList = [];
  let applicantNumber = [];
  let dotTooltipValues = [];
  let remindTooltipCount = [];
  let No = [];

  const getTableValues = () => {
    checkbox = [];
    applicantName = [];
    applicantId = [];
    applicantTypeName = [];
    department = [];
    reappointment = [];
    Percentage = [];
    DateSend = [];
    ReminderCount = [];
    applicationStatusList = [];
    actionList = [];
    emailList = [];
    applicantNumber = [];
    dotTooltipValues = [];
    remindTooltipCount = [];
    No = [];

    tableData?.forEach((data, index) => {
      // Checkbox with individual checked state
      checkbox.push(
        <CommonCheckBox
          checked={checkedIds.includes(data.id)}
          onChange={() => handleCheckboxClick(data.id)}
          color="primary"
          inputProps={{ 'aria-label': `Select ${data.name}` }}
          className={style.padding0}
        />
      );
      No.push(index + 1 + ".");
      <Tooltip title={`${data?.applicant?.name?.firstName}`} arrow>
        {applicantName.push(
          `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
        )}
      </Tooltip>
      applicantNumber.push([data?.applicant?.mobileNumber ? data?.applicant?.mobileNumber : "-"]);
      // applicantId.push(`${data?.staffId}` || "123");
      applicantTypeName.push(`${data?.basicDetailReferences?.applicantType?.serviceProviderType}` || "Dentist");
      emailList.push(data?.applicant?.email?.officialEmail)
      department.push(`${data?.basicDetailReferences?.department?.name}` || "Surgery");
      reappointment.push(
        // <>
        //   {data?.reAppointmentInitiated !== undefined && (
        //     data.reAppointmentInitiated ? (
        //       <span>Sent</span>
        //     ) : (
        //       <span>Not Sent</span>
        //     )
        //   )}
        // </>
        `${data?.reappointmentStatus === "SENT" ? 'Sent' : data?.reappointmentStatus === "NOT_SENT" ? 'Not Sent' : data?.reappointmentStatus === "RE_SENT" ? 'Reminder Sent' : data?.reappointmentStatus}`
      );
      applicationStatusList.push(availableApplicationStatus[data?.onGoingApplication?.status])
      actionList.push(
        // <CommonCheckBox
        //   checked={checkedIds.includes(data.id)}
        //   onChange={() => handleCheckboxClick(data.id)}
        //   color="primary"
        //   inputProps={{ 'aria-label': `Select ${data.name}` }}
        // />
        (data?.reappointmentStatus === "SENT" || data?.reappointmentStatus === "RE_SENT") ?
          <div className={style.justifyCenter} onClick={() => handleResend(data.id)}> <Tooltip arrow title={data?.onGoingApplication?.subStatus === 'STARTED' ? "Click to Send Remind Email" : "Click to Resend Email"}><img src={Resend} alt="" className={style.resentIcon} /></Tooltip></div> :
          <div className={`${style.justifyCenter} ${style.disabled}`}> <Tooltip arrow title="Not Sent"><img src={ResendDisabled} alt="" className={style.resentIcon} /></Tooltip></div>
      );
      // Percentage.push(
      //   data?.onGoingApplication?.completionPercentage === 0
      //     ? "-"
      //     : `${data?.onGoingApplication?.completionPercentage + "%"}`
      // );

      if (data?.reappointmentStatus === "NOT_SENT") {
        Percentage.push('grey');
        dotTooltipValues.push('Application Not Sent')
      }

      else if (data?.onGoingApplication?.expiryDate && new Date(data?.onGoingApplication?.expiryDate) < new Date()) {
        Percentage.push('red');
        dotTooltipValues.push(`${data?.onGoingApplication?.completionPercentage}% Past Due`);
      } else {
        const completionPercentage = data?.onGoingApplication?.completionPercentage;

        if (completionPercentage === 0) {
          Percentage.push('red');
        } else if (completionPercentage === 100) {
          Percentage.push('darkgreen');
        } else {
          Percentage.push('yellow');
        }

        dotTooltipValues.push(`${completionPercentage}%`);
      }

      const reminderCount = data?.onGoingApplication?.reminderLog?.submissionReminders?.length || 0;
      const reminderText = reminderCount === 0 ? "No Reminder Sent" : `${reminderCount} Reminder${reminderCount === 1 ? "" : "s"} Sent`;

      const reminderDates =
        reminderCount > 0
          ? data?.onGoingApplication?.reminderLog?.submissionReminders?.map(reminder => (
            <div key={reminder?.date}>{format(new Date(reminder?.date), 'MMM dd yyyy')}</div>
          ))
          : null;

      const remindTooltipValue = reminderCount >= 0 ? (
        <div>
          <div>{reminderText}</div>
          <div>{reminderDates}</div>
        </div>
      ) : null;


      remindTooltipCount.push(remindTooltipValue);
      DateSend.push(
        format(new Date(data?.reAppointmentSentDate), "MMM dd, yyyy")
      );
    });

    return [
      { type: "checkbox", value: checkbox },
      { type: "text", value: No },
      // { type: "text", 
      //   value: applicantName, 
      //   hoverText: applicantNumber, 
      //   isShowHoverText: true
      // },
      {
        type: "text",
        value: applicantName,
        // ...(applicantNumber !== "" ? { tooltipValueText: applicantNumber } : {}),
        tooltipValueText: applicantNumber,
        // isShowHoverText: applicantNumber !== "" && applicantNumber !== undefined && applicantNumber !== null
      },
      // { type: "text", value: applicantId },
      { type: "text", value: emailList },
      { type: "text", value: applicantTypeName },
      { type: "text", value: department },
      { type: "text", value: reappointment },
      { type: "dot", value: Percentage, tooltipValue: dotTooltipValues },
      { type: "text", value: DateSend, tooltipValueText: remindTooltipCount },
      // { type: "text", value: ReminderCount },
      // { type: "text", value: applicationStatusList },
      { type: "icon", icon: actionList },
    ];
  };

  const isDataAvailable = tableData?.length > 0;

  // Rest of the render method remains the same
  return (
    <div>
      <ApplicationHeader
        title={applicationCreationType === "LOCUM" ? `Eligible Locum Staff for applications renewal / extension (${tableData?.length})` : `Eligible Staff for Reappointment applications (${tableData?.length})`}
        close={true}
        closeClick={handleCloseClick}
        handleNavigate={handleNavigate}
        isShowPrint={true}
      />
      <div className={` ${style.screenPadding}`}>
        <div className={style.bigCardStyle1}>
          <div className={`${style.numberOfContractorsGrid} ${style.filterPadding}`}>
            <div>
              <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={`${style.filterType}`}>
                  Department
                </div>
              </div>
              <div className={style.marginTop10}>
                <CommonSelectField
                  value={selectedDepartment}
                  onChange={handleChange}
                  className={style.fullWidth}
                  firstOptionLabel={'All'}
                  firstOptionValue={''}
                  valueList={transformedOptions.map(option => option?.value)}
                  labelList={transformedOptions.map(option => option?.label)}
                  disabledList={transformedOptions.map(() => false)}
                  // label={'Dept / Division & Specialty'}
                  required={false}
                />

              </div>
            </div>
            <div>
              <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={`${style.filterType}`}>
                  {applicationCreationType === "LOCUM" ? 'Locum Staff Type' : `Staff Type`}
                </div>
              </div>
              <div className={style.marginTop10}>


                <CommonSelectField
                  value={selectedApplicantType}
                  onChange={(e) => setSelectedApplicantType(e.target.value)}
                  className={style.fullWidth}
                  firstOptionLabel={'All'}
                  firstOptionValue={''}
                  valueList={applicantType?.map(data => data?.id)}
                  labelList={applicantType?.map(data => data?.applicantType)}
                  disabledList={applicantType?.map(data => false)}
                  required={false}
                />

              </div>
            </div>
            {/* <div>
              <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={`${style.filterType}`}>
                  Privilege Category
                </div>

              </div>
              <div className={style.marginTop10}>


                <CommonSelectField
                  value={selectedPrivilegeCategory}
                  onChange={(e) => setSelectedPrivilegeCategory(e.target.value)}
                  className={style.fullWidth}
                  firstOptionLabel={'All'}
                  firstOptionValue={''}
                  valueList={privilegeCategories?.map(data => data?.id)}
                  labelList={privilegeCategories?.map(data => data?.category === basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory ? `${data?.category} (Current Privilege Category)` : data?.category)}
                  disabledList={privilegeCategories?.map(data => data?.category === basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory ? true : false)}
                  required={false}
                />

              </div>
            </div> */}
            <div>
              <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={`${style.filterType}`}>
                  Application Sent Status
                </div>
              </div>
              <div className={style.marginTop10}>


                <CommonSelectField
                  value={selectedReappointmentStatus}
                  onChange={(e) => setSelectedReappointmentStatus(e.target.value)}
                  className={style.fullWidth}
                  firstOptionLabel={'All'}
                  firstOptionValue={''}
                  valueList={["NOT_SENT", "SENT", "RE_SENT"]}
                  labelList={['Not Sent', 'Sent', "Reminder Sent"]}
                  disabledList={false}
                  required={false}
                />

              </div>
            </div>
            {/* <div>
              <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={`${style.filterType}`}>
                  Application Status
                </div>
              </div>
              <div className={style.marginTop10}>


                <CommonSelectField
                  value={applicationStatus}
                  onChange={(e) => setApplicationStatus(e.target.value)}
                  className={style.fullWidth}
                  firstOptionLabel={'All'}
                  firstOptionValue={''}
                  // valueList={["CREATED", "SUBMITTED", "APPROVED", "REJECTED", "COMPLETED", "REVIEW_INPROGRESS", "DECLINED"]}
                  // labelList={['Not Submitted', 'Submitted', "Approved", "Rejected", "Completed", "Review In Progress", "Declined"]}
                  valueList={["CREATED"]}
                  labelList={['Not Submitted']}
                  disabledList={false}
                  required={false}
                />

              </div>
            </div> */}
          </div>
        </div>
        <div className={`${style.bigCardStyle1} ${style.marginTop5}`}>
          <div className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginLeftRight20} ${style.marginBottom10}`}>
            <Tooltip title={selectedReappointmentStatus === "SENT" ? "Click to Remove Filter" : "Click to Filter Sent Applications"} arrow>
              <div className={`${selectedReappointmentStatus === "SENT" ? style.filterTypeGreenActive : style.filterTypeGreen} ${style.marginBottom5} ${style.cursorPointer}`} onClick={() => selectedReappointmentStatus ? setSelectedReappointmentStatus("") : setSelectedReappointmentStatus("SENT")}>
                Sent {tableData?.filter(data => (data?.reappointmentStatus === "SENT"))?.length}
              </div>
            </Tooltip>
            {/* <div className={style.verticalBorder}></div> */}
            <Tooltip title={selectedReappointmentStatus === "NOT_SENT" ? "Click to Remove Filter" : "Click to Filter Not Sent Applications"} arrow>
              <div className={`${selectedReappointmentStatus === "NOT_SENT" ? style.filterTypeGreyActive : style.filterTypeGrey} ${style.marginBottom5} ${style.cursorPointer}`} onClick={() => selectedReappointmentStatus ? setSelectedReappointmentStatus("") : setSelectedReappointmentStatus("NOT_SENT")}>
                Not Sent {tableData?.filter(data => data?.reappointmentStatus === "NOT_SENT")?.length}
              </div>
            </Tooltip>
            {/* <div className={style.verticalBorder}></div> */}
            <Tooltip title={selectedReappointmentStatus === "RE_SENT" ? "Click to Remove Filter" : "Click to Filter Reminders Sent Applications"} arrow>
              <div className={`${selectedReappointmentStatus === "RE_SENT" ? style.filterTypeGreyActive : style.filterTypeGrey} ${style.marginLeft30} ${style.marginBottom5} ${style.cursorPointer}`} onClick={() => selectedReappointmentStatus ? setSelectedReappointmentStatus("") : setSelectedReappointmentStatus("RE_SENT")}>
                Reminders Sent {tableData?.filter(data => data?.reappointmentStatus === "RE_SENT")?.length}
              </div>
            </Tooltip>
            {/* <div className={style.verticalBorder}></div> */}
            <Tooltip
              title={selectedReappointmentSubStatus === "PAST_DUE" ? "Click to Remove Past Due Filter" : "Click to Filter Past Due Applications"}
              arrow
            >
              <div className={`${selectedReappointmentSubStatus === "PAST_DUE" ? style.filterTypeRedActive : style.filterTypeRed} ${style.marginBottom5} ${style.cursorPointer} ${style.flex}`} onClick={() => selectedReappointmentSubStatus === "PAST_DUE" ? setSelectedReappointmentSubStatus("") : setSelectedReappointmentSubStatus("PAST_DUE")}>
                Past Due {tableData?.filter(data => data?.onGoingApplication?.expiryDate && new Date(data?.onGoingApplication?.expiryDate) < new Date())?.length}
                {selectedReappointmentSubStatus === "PAST_DUE" && (
                  <CancelIcon
                    sx={{
                      fontSize: 15,
                      color: "#FFFFFF",
                    }}
                    className={`${style.cursorPointer} ${style.marginLeft5}`}
                    onClick={() => setSelectedReappointmentSubStatus("")}
                  />
                )}
              </div>
            </Tooltip>
            {/* <div className={style.verticalBorder}></div> */}
            <Tooltip
              title={selectedReappointmentSubStatus === "SUBMISSION_PENDING" ? "Click to Remove 'Submission Pending' Filter" : "Click to Filter Submission Pending Applications"}
              arrow
            >
              <div className={`${selectedReappointmentSubStatus === "SUBMISSION_PENDING" ? style.filterTypeLightGreenActive : style.filterTypeLightGreen} ${style.marginBottom5} ${style.cursorPointer} ${style.flex}`} onClick={() => selectedReappointmentSubStatus === "SUBMISSION_PENDING" ? setSelectedReappointmentSubStatus("") : setSelectedReappointmentSubStatus("SUBMISSION_PENDING")}>
                Completed but not submitted {tableData?.filter(data => data?.onGoingApplication?.completionPercentage === 100 && data?.onGoingApplication?.status === "CREATED")?.length}
                {selectedReappointmentSubStatus === "SUBMISSION_PENDING" && (
                  <CancelIcon
                    sx={{
                      fontSize: 15,
                      color: "#FFFFFF",
                    }}
                    className={`${style.cursorPointer} ${style.marginLeft5}`}
                    onClick={() => setSelectedReappointmentSubStatus("")}
                  />
                )}
              </div>
            </Tooltip>
            {/* <div className={style.verticalBorder}></div> */}
            <Tooltip
              title={selectedReappointmentSubStatus === "PARTIALLY_COMPLETED" ? "Click to Remove 'Partially Completed' Filter" : "Click to Filter Partially Completed Applications"}
              arrow
            >
              <div className={`${selectedReappointmentSubStatus === "PARTIALLY_COMPLETED" ? style.filterTypeYellowActive : style.filterTypeYellow} ${style.marginBottom5} ${style.cursorPointer} ${style.flex}`} onClick={() => selectedReappointmentSubStatus === "PARTIALLY_COMPLETED" ? setSelectedReappointmentSubStatus("") : setSelectedReappointmentSubStatus("PARTIALLY_COMPLETED")}>
                Partially Completed {tableData?.filter(data => data?.onGoingApplication?.completionPercentage !== 0 && data?.onGoingApplication?.completionPercentage !== 100)?.length}
                {selectedReappointmentSubStatus === "PARTIALLY_COMPLETED" && (
                  <CancelIcon
                    sx={{
                      fontSize: 15,
                      color: "#FFFFFF",
                    }}
                    className={`${style.cursorPointer} ${style.marginLeft5}`}
                    onClick={() => setSelectedReappointmentSubStatus("")}
                  />
                )}
              </div>
            </Tooltip>
            <Tooltip
              title={selectedReappointmentSubStatus === "NOT_STARTED" ? "Click to Remove Not Yet Started Filter" : "Click to Filter Not Yet Started Applications"}
              arrow
            >
              <div className={`${selectedReappointmentSubStatus === "NOT_STARTED" ? style.filterTypeRedActive : style.filterTypeRed} ${style.marginBottom5} ${style.cursorPointer} ${style.flex}`} onClick={() => selectedReappointmentSubStatus === "NOT_STARTED" ? setSelectedReappointmentSubStatus("") : setSelectedReappointmentSubStatus("NOT_STARTED")}>
                Not Yet Started {tableData?.filter(data => data?.onGoingApplication?.completionPercentage === 0)?.length}
                {selectedReappointmentSubStatus === "NOT_STARTED" && (
                  <CancelIcon
                    sx={{
                      fontSize: 15,
                      color: "#FFFFFF",
                    }}
                    className={`${style.cursorPointer} ${style.marginLeft5}`}
                    onClick={() => setSelectedReappointmentSubStatus("")}
                  />
                )}
              </div>
            </Tooltip>
          </div>
        </div>
        {/* <div className={style.spaceBetween}>
          <div></div>
          <div className={`${style.searchFieldWidth} ${style.marginTop10}`}>
            <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} />
          </div>
        </div> */}
        <div className={`${style.bigCardStyle1} ${style.marginTop10}`}>
          <div className={`${style.flex} ${style.gap}`}>
            {selectedDepartment && (
              <div className={`${style.searchChips} ${style.flex} ${style.marginLeft} ${style.alignItemCenter}`}>
                <div className={`${style.marginRight5}`}>Filter by {selectedDepartmentName}</div>
                <Tooltip title="Click to Remove Filter" arrow>
                  <CancelIcon
                    sx={{
                      fontSize: 20,
                      color: "#06617A",
                    }}
                    className={`${style.cursorPointer} ${style.marginLeft5}`}
                    onClick={() => { setSelectedDepartment(''); setSelectedServiceArea('') }}
                  />
                </Tooltip>
              </div>
            )}
            {selectedApplicantType && (
              <div className={`${style.searchChips} ${style.flex} ${style.marginLeft5} ${style.alignItemCenter}`}>
                <div className={`${style.marginRight5}`}>Filter by {selectedApplicantName}</div>
                <Tooltip title="Click to Remove Filter" arrow>
                  <CancelIcon
                    sx={{
                      fontSize: 20,
                      color: "#06617A",
                    }}
                    className={`${style.cursorPointer} ${style.marginLeft5}`}
                    onClick={() => { setSelectedApplicantType('') }}
                  />
                </Tooltip>
              </div>
            )}
            {selectedReappointmentStatus && (
              <div className={`${style.searchChips} ${style.flex} ${style.marginLeft5} ${style.alignItemCenter}`}>
                <div className={`${style.marginRight5}`}>
                  Filter by {" "}
                  {Array.isArray(selectedReappointmentStatus) ? "Sent" :
                    selectedReappointmentStatus === 'RE_SENT' ? 'Reminder Sent' :
                      selectedReappointmentStatus === 'SENT' ? 'Sent' :
                        selectedReappointmentStatus === 'NOT_SENT' ? 'Not Sent' :
                          selectedReappointmentStatus}
                </div>
                <Tooltip title="Click to Remove Filter" arrow>
                  <CancelIcon
                    sx={{
                      fontSize: 20,
                      color: "#06617A",
                    }}
                    className={`${style.cursorPointer} ${style.marginLeft5}`}
                    onClick={() => { setSelectedReappointmentStatus('') }}
                  />
                </Tooltip>
              </div>
            )}
          </div>
          {isLoading ? (
            <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
              <CircularProgress sx={{ color: "#06617A" }} />
            </div>
          ) : (
            <div className={`${style.marginLeftRight20}`}>
              <TableTwo
                tableHeaderValues={headerValues}
                tableDataValues={getTableValues()}
                tableData={tableData}
                gridStyle={style.permanentStaffGrid}
                scrollStyle={style.scrollStyle}
                tableSortValues={colSortValues}
                heading={"There are no records to display"}
                getHandleSort={getHandleSort}
                sortValue={{ sortBy: sortValue, sortByField: sortField }}
                getSelectedPage={getSelectedPage}
                totalCount={totalCount}
                page={page}
                // hidePagination={true}
                // Pass checkedIds as a prop
                checkedIds={checkedIds}
                // Optional: pass the checkbox click handler if TableTwo needs it
                handleCheckboxClick={handleCheckboxClick}
                searchTermForTable={searchTermForTable}
                searchCount={searchCount}
                setSearchTermForTable={setSearchTermForTable}
                onLimitChange={handleLimitChange}
                searchField={<CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} placeholder={applicationCreationType === "LOCUM" ? "Search By Locum Staff" : 'Search By Staff Name'} isOnClickAvailable={true} onClickFunc={onClickUserFunction} />}
              />
            </div>
          )}
        </div>

        <div className={style.spaceBetween}>
          <div></div>
          <div className={style.displayInRow}>
            <div className={style.displayInRow}>
              <Tooltip title={"Click to Reset"} arrow>
                <div
                  className={`${style.saveInProgress} ${style.marginTop} ${style.marginLeft}`}
                  onClick={() => window.location.reload()}
                >
                  RESET
                </div>
              </Tooltip>
              {!(selectedReappointmentStatus === "NOT_SENT" && applicationCreationType === "LOCUM") && (
                <Tooltip title={selectedReappointmentStatus === "SENT" || selectedReappointmentStatus === "RE_SENT" ? "Click to Resend Reappointment Application" : "Click to Send Reappointment Application"} disableHoverListener={!(checkedIds?.length > 0)} arrow>
                  <div
                    className={`${style.continue} ${style.marginTop} ${style.marginLeft}`}
                    onClick={() => {
                      if (isDataAvailable && checkedIds?.length > 0) {
                        if (selectedReappointmentStatus === "SENT" || selectedReappointmentStatus === "RE_SENT") {
                          reappointmentApplicationResendbulk();
                        } else {
                          reappointmentApplicationbulk();
                        }
                      }
                    }}
                    disabled={!isDataAvailable && checkedIds?.length === 0}
                    style={{ opacity: isDataAvailable && checkedIds?.length > 0 ? 1 : 0.5 }}

                  >
                    {(selectedReappointmentStatus === "SENT" || selectedReappointmentStatus === "RE_SENT" || applicationCreationType === "LOCUM") ? `RESEND ${applicationCreationType === "LOCUM" ? '' : 'REAPPOINTMENT'} APPLICATION` : 'SEND REAPPOINTMENT APPLICATION'}
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ReappointmentApplication;