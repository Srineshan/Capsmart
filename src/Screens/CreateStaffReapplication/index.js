import React, { useState, useEffect, forwardRef } from 'react';
import { GET, POST, PUT } from '../../Screens/dataSaver';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import ApplicationHeader from "../../Components/ApplicationHeader";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import TableTwo from "../../Components/TableDesignTwo";
import style from './index.module.scss';
import Checkbox from '@mui/material/Checkbox';
import Resend from './../../images/Resend.png';
import ResendDisabled from './../../images/Resend-disabled.png';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import { ErrorToaster2, SuccessToaster, SuccessToaster2 } from '../../utils/toaster';
import { Tooltip } from '@material-ui/core';
import { formatFirstNameLastName } from "../../utils/formatting";
import CommonSearchField from '../../Components/CommonFields/CommonSearchField';


const ReappointmentApplication = forwardRef(({ isLoading, basicForm }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedOption, setSelectedOption] = useState({});
  const [tableData, setTableData] = useState([]);
  const [sortField, setSortField] = useState("REAPPOINTMENT_STATUS");
  const [sortValue, setSortValue] = useState("DESCENDING");
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [privilegeCategories, setPrivilegeCategories] = useState([]);
  const [selectedPrivilegeCategory, setSelectedPrivilegeCategory] = useState('');
  const [applicantType, setApplicantType] = useState([]);
  const [selectedApplicantType, setSelectedApplicantType] = useState('');
  const [selectedReappointmentStatus, setSelectedReappointmentStatus] = useState('');
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
  const [limit, setLimit] = useState(10);
  let availableApplicationStatus = {
    "CREATED": "Not Submitted",
    "SUBMITTED": "Submitted",
    "APPROVED": "Approved",
    "REJECTED": "Rejected",
    "COMPLETED": "Completed",
    "REVIEW_INPROGRESS": "Review In Progress",
    "DECLINED": "Declined"
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
  }, [selectedDepartment, selectedPrivilegeCategory, selectedApplicantType, selectedReappointmentStatus, applicationStatus, sortField, sortValue, page, totalCount, limit, searchTermForTable]);

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
    if (checkedIds.length === tableData.length) {
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
      checked={checkedIds.length === tableData.length}
      onChange={handleSelectAllClick}
    />,
    "Staff Name",
    "Email",
    "Staff Type",
    "Department",
    "Status",
    // "Application Status",
    "Action"
  ];
  const colSortValues = [false, true, false, false, true];

  // Rest of the methods remain the same as in your original code...
  const handleCloseClick = () => {
    navigate("/applications");
  };

  const getActiveUserData = async () => {
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

      if (applicationStatus) {
        queryParams.append('applicationStatus', applicationStatus);
      }

      if (selectedReappointmentStatus) {
        queryParams.append('reappointmentStatus', selectedReappointmentStatus);
      }

      const response = await GET(
        `application-management-service/staff?${queryParams.toString()}&sortBy=${sortValue}&sortByField=${sortField}&sendForReappointment=false&limit=${limit}&offset=${page - 1}&searchText=${searchTermForTable}&isPaginationRequired=${limit === 9999 ? false : true}`
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

      if (applicationStatus) {
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
        desc: `${item?.basicDetailReferences?.department?.name} | ${item?.basicDetailReferences?.applicantType?.category}`
      })));
      return response?.data?.staffs;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const reappointmentApplicationbulk = async () => {
    if (checkedIds.length === 0) {
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
    if (checkedIds.length === 0) {
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
    setApplicantType(applicant);
    if (applicant?.filter(data => data?.applicantType === "Physician")?.length !== 0) {
      setSelectedApplicantType(applicant?.filter(data => data?.applicantType === "Physician")?.[0]?.id);
    } else {
      setSelectedApplicantType(applicant?.[0]?.id);
    }
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

  const getTableValues = () => {
    const checkbox = [];
    const applicantName = [];
    const applicantId = [];
    const applicantType = [];
    const department = [];
    const reappointment = [];
    const applicationStatusList = [];
    const actionList = [];
    const emailList = [];

    tableData?.forEach((data) => {
      // Checkbox with individual checked state
      checkbox.push(
        <CommonCheckBox
          checked={checkedIds.includes(data.id)}
          onChange={() => handleCheckboxClick(data.id)}
          color="primary"
          inputProps={{ 'aria-label': `Select ${data.name}` }}
        />
      );
      applicantName.push(
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );

      // applicantId.push(`${data?.staffId}` || "123");
      applicantType.push(`${data?.basicDetailReferences?.applicantType?.serviceProviderType}` || "Dentist");
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
        `${data?.reappointmentStatus === "SENT" ? 'Sent' : data?.reappointmentStatus === "NOT_SENT" ? 'Not Sent' : data?.reappointmentStatus === "RE_SENT" ? 'Re-Sent' : data?.reappointmentStatus}`
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
          <div className={style.justifyCenter} onClick={() => handleResend(data.id)}> <Tooltip arrow title={data?.onGoingApplication?.subStatus === 'STARTED' ? "Click to Remind" : "Click to Resend"}><img src={Resend} alt="" className={style.resentIcon} /></Tooltip></div> :
          <div className={`${style.justifyCenter} ${style.disabled}`}> <Tooltip arrow title="Not Sent"><img src={ResendDisabled} alt="" className={style.resentIcon} /></Tooltip></div>
      );
    });

    return [
      { type: "checkbox", value: checkbox },
      { type: "text", value: applicantName },
      // { type: "text", value: applicantId },
      { type: "text", value: emailList },
      { type: "text", value: applicantType },
      { type: "text", value: department },
      { type: "text", value: reappointment },
      // { type: "text", value: applicationStatusList },
      { type: "icon", icon: actionList },
    ];
  };

  const isDataAvailable = tableData.length > 0;

  // Rest of the render method remains the same
  return (
    <div>
      <ApplicationHeader
        title={`Staff Reappointment Applications To Be Sent (${tableData?.length})`}
        close={true}
        closeClick={handleCloseClick}
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
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className={style.fullWidth}
                  firstOptionLabel={'All'}
                  firstOptionValue={''}
                  valueList={departmentList?.map(data => data?.id)}
                  labelList={departmentList?.map(data => data?.departmentName?.name)}
                  disabledList={departmentList?.map(data => false)}
                  // label={'Department / Division or Specialty'}
                  required={false}
                />

              </div>
            </div>
            <div>
              <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={`${style.filterType}`}>
                  Staff Type
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
                  reappointment status
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
                  labelList={['Not Sent', 'Sent', "Re-Sent"]}
                  disabledList={false}
                  required={false}
                />

              </div>
            </div>
            <div className={`${style.searchFieldWidth} ${style.alignBottom}`}>
              <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} />
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
        {/* <div className={style.spaceBetween}>
          <div></div>
          <div className={`${style.searchFieldWidth} ${style.marginTop10}`}>
            <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} />
          </div>
        </div> */}
        {/* Filtering section remains the same */}
        <div className={`${style.bigCardStyle} ${style.marginTop10}`}>
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
                heading={"There are no record to display"}
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
              />
            </div>
          )}
        </div>

        <div className={style.spaceBetween}>
          <div></div>
          <div className={style.displayInRow}>
            <div className={style.displayInRow}>
              <div
                className={`${style.saveInProgress} ${style.marginTop} ${style.marginLeft}`}
                onClick={() => window.location.reload()}
              >
                CLEAR
              </div>
              <div
                className={`${style.continue} ${style.marginTop} ${style.marginLeft}`}
                onClick={() => {
                  if (isDataAvailable) {
                    if (selectedReappointmentStatus === "SENT" || selectedReappointmentStatus === "RE_SENT") {
                      reappointmentApplicationResendbulk();
                    } else {
                      reappointmentApplicationbulk();
                    }
                  }
                }}
                disabled={!isDataAvailable}
                style={{ opacity: isDataAvailable ? 1 : 0.5 }}
              >
                {(selectedReappointmentStatus === "SENT" || selectedReappointmentStatus === "RE_SENT") ? 'RESEND REAPPOINTMENT APPLICATION' : 'SEND REAPPOINTMENT APPLICATION'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ReappointmentApplication;