import React, { useState, useEffect, forwardRef } from 'react';
import { GET, POST } from '../../Screens/dataSaver';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import ApplicationHeader from "../../Components/ApplicationHeader";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import TableTwo from "../../Components/TableDesignTwo";
import style from './index.module.scss';
import Checkbox from '@mui/material/Checkbox';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import { SuccessToaster } from '../../utils/toaster';

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

  // Replace sessionStorage with state
  const [checkedIds, setCheckedIds] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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
  }, [selectedDepartment, selectedPrivilegeCategory, selectedApplicantType, selectedReappointmentStatus, sortField, sortValue, page, totalCount]);

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
    "Staff Type",
    "Department",
    "Reappointment"
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

      if (selectedReappointmentStatus) {
        queryParams.append('reappointmentStatus', selectedReappointmentStatus);
      }

      const response = await GET(
        `application-management-service/staff?${queryParams.toString()}&sortBy=${sortValue}&sortByField=${sortField}&sendForReappointment=false&limit=${10}&offset=${page - 1}`
      );

      // Filter out any data that might have 'type' as 'PROVISIONAL' in case backend returns it
      // const filteredData = response?.data?.staffs?.filter(item => item?.type !== 'PROVISIONAL') || [];

      setTableData(response?.data?.staffs);
      setTotalCount(response?.data?.numberOfElements);
      return response?.data?.staffs;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
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
    const checkbox = [];
    const applicantName = [];
    const applicantId = [];
    const applicantType = [];
    const department = [];
    const reappointment = [];

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

      // Rest of the table value preparations remain the same
      applicantName.push(
        <>
          {/* {data?.applicant?.name?.lastName?.toUpperCase() || ""},{" "}
          {data?.applicant?.name?.firstName
            ? data?.applicant?.name?.firstName?.charAt(0).toUpperCase() +
            data?.applicant?.name?.firstName?.slice(1).toLowerCase()
            : ""} */}
          {data?.applicant?.name?.firstName}{" "} {data?.applicant?.name?.lastName.toLowerCase()}
        </>
      );

      // applicantId.push(`${data?.staffId}` || "123");
      applicantType.push(`${data?.basicDetailReferences?.applicantType?.serviceProviderType}` || "Dentist");
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
        `${data?.reappointmentStatus}`
      );
    });

    return [
      { type: "checkbox", value: checkbox },
      { type: "text", value: applicantName },
      // { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      { type: "text", value: department },
      { type: "text", value: reappointment },
    ];
  };

  const isDataAvailable = tableData.length > 0;

  // Rest of the render method remains the same
  return (
    <div>
      <ApplicationHeader
        title={"Staff Member Reappointment Credentialing and Privileging Status Tracker"}
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
            <div>
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
            </div>
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
                  valueList={["NOT_SENT", "SENT"]}
                  labelList={['Not Sent', 'Sent']}
                  disabledList={false}
                  required={false}
                />

              </div>
            </div>

          </div>
        </div>
        {/* Filtering section remains the same */}
        <div className={`${style.bigCardStyle} ${style.marginTop10}`}>
          {isLoading ? (
            <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
              <CircularProgress sx={{ color: "#06617A" }} />
            </div>
          ) : (
            <div className={`${style.margin20}`}>
              <TableTwo
                tableHeaderValues={headerValues}
                tableDataValues={getTableValues()}
                tableData={tableData}
                gridStyle={style.permanentStaffGrid}
                scrollStyle={style.contractScrollStyle}
                tableSortValues={colSortValues}
                heading={"There are no record to display"}
                getHandleSort={getHandleSort}
                sortValue={{ sortBy: sortValue, sortByField: sortField }}
                getSelectedPage={getSelectedPage}
                totalCount={totalCount}
                page={page}
                // Pass checkedIds as a prop
                checkedIds={checkedIds}
                // Optional: pass the checkbox click handler if TableTwo needs it
                handleCheckboxClick={handleCheckboxClick}
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
                    reappointmentApplicationbulk();
                  }
                }}
                disabled={!isDataAvailable}
                style={{ opacity: isDataAvailable ? 1 : 0.5 }}
              >
                SEND REAPPOINTMENT APPLICATION
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ReappointmentApplication;