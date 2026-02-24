import React, { useState, useEffect, useRef } from "react";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import style from "./index.module.scss";
import TableTwo from "../TableDesignTwo";
import CircularProgress from "@mui/material/CircularProgress";
import { formatFirstNameLastName } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CommonSelectField from '../CommonFields/CommonSelectField';
import CommonSearchField from "../CommonFields/CommonSearchField";
import { Tooltip } from "@mui/material";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import { useReactToPrint } from "react-to-print";
import { GET } from "../../Screens/dataSaver";

// Dummy data for EduSmart courses - replace with API call later
const DUMMY_EDUSMART_DATA = [
  {
    id: 1,
    staff: { firstName: "John", lastName: "Smith" },
    staffType: "Physician",
    department: "Surgery",
    noOfCourses: 5,
    noOfCoursesNotStarted: 1,
    noOfCoursesInProgress: 2,
    noOfCoursesCompleted: 2,
  },
  {
    id: 2,
    staff: { firstName: "Jane", lastName: "Doe" },
    staffType: "Nurse Practitioner",
    department: "Cardiology",
    noOfCourses: 8,
    noOfCoursesNotStarted: 0,
    noOfCoursesInProgress: 3,
    noOfCoursesCompleted: 5,
  },
  {
    id: 3,
    staff: { firstName: "Robert", lastName: "Johnson" },
    staffType: "Physician",
    department: "Emergency Medicine",
    noOfCourses: 4,
    noOfCoursesNotStarted: 2,
    noOfCoursesInProgress: 1,
    noOfCoursesCompleted: 1,
  },
  {
    id: 4,
    staff: { firstName: "Sarah", lastName: "Williams" },
    staffType: "Dentist",
    department: "Dental",
    noOfCourses: 6,
    noOfCoursesNotStarted: 1,
    noOfCoursesInProgress: 2,
    noOfCoursesCompleted: 3,
  },
  {
    id: 5,
    staff: { firstName: "Michael", lastName: "Brown" },
    staffType: "Physician",
    department: "Internal Medicine",
    noOfCourses: 3,
    noOfCoursesNotStarted: 0,
    noOfCoursesInProgress: 0,
    noOfCoursesCompleted: 3,
  },
];

const EduSmartCoursesTrackerDialog = ({ getIsOpen, isLoading }) => {
  const componentRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [sortField, setSortField] = useState("DEFAULT");
  const [sortValue, setSortValue] = useState("DESCENDING");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermForTable, setSearchTermForTable] = useState('');
  const [searchCount, setSearchount] = useState(0);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedServiceArea, setSelectedServiceArea] = useState("");
  const [applicantType, setApplicantType] = useState([]);
  const [selectedApplicantType, setSelectedApplicantType] = useState('');
  const selectedDepartmentName = departmentList?.find(data => data?.id === selectedDepartment)?.departmentName?.name;
  const selectedApplicantTypeName = applicantType?.find(data => data?.id === selectedApplicantType)?.applicantType;
  const [limit, setLimit] = useState(9999);
  const workModeType = sessionStorage.getItem('workModeType');
  const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
  const dateFormat = canadaData?.dateFormat || 'MMM dd, yyyy';

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

    return [departmentEntry, ...serviceAreaEntries];
  }) || [];

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const [departmentId, serviceAreaId] = selectedValue.split("|");
    setSelectedDepartment(departmentId || "");
    setSelectedServiceArea(serviceAreaId || "");
  };

  const getDepartmentList = async () => {
    try {
      const { data: department } = await GET(`entity-service/department`);
      setDepartmentList(department || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const getApplicantType = async () => {
    try {
      const { data: applicant } = await GET(`entity-service/applicantType`);
      setApplicantType(applicant || []);
    } catch (error) {
      console.error("Error fetching applicant types:", error);
    }
  };

  useEffect(() => {
    getDepartmentList();
    getApplicantType();
  }, [showFilter]);

  useEffect(() => {
    // Using dummy data for now - replace with API call later
    const loadData = () => {
      setIsLoadingImage(true);
      let filteredData = [...DUMMY_EDUSMART_DATA];

      // Apply department filter (dummy - filter by department name for now)
      if (selectedDepartment) {
        const deptName = departmentList?.find(d => d?.id === selectedDepartment)?.departmentName?.name;
        if (deptName) {
          filteredData = filteredData.filter(item => item.department === deptName);
        }
      }

      // Apply staff type filter
      if (selectedApplicantType) {
        const staffTypeName = applicantType?.find(a => a?.id === selectedApplicantType)?.applicantType;
        if (staffTypeName) {
          filteredData = filteredData.filter(item => item.staffType === staffTypeName);
        }
      }

      // Apply search filter
      if (searchTermForTable.trim()) {
        const searchLower = searchTermForTable.toLowerCase();
        filteredData = filteredData.filter(item => {
          const fullName = `${item.staff?.firstName || ''} ${item.staff?.lastName || ''}`.toLowerCase();
          return fullName.includes(searchLower) ||
            (item.staffType || '').toLowerCase().includes(searchLower) ||
            (item.department || '').toLowerCase().includes(searchLower);
        });
      }

      setTableData(filteredData);
      setTotalCount(filteredData.length);
      setSearchount(filteredData.length);
      setIsLoadingImage(false);
    };

    loadData();
  }, [selectedDepartment, selectedServiceArea, selectedApplicantType, searchTermForTable, showFilter]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "EduSmart Courses Status Tracker",
  });

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowForSearch = () => {
    setPage(1);
    setSearchTermForTable(searchTerm);
  };

  const getSelectedPage = (value) => {
    setPage(value);
  };

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

  const headerValues = [
    "No.",
    "Staff",
    "Staff Type",
    "Dept",
    "No. of Courses",
    "No. of Courses Not Started",
    "No. of Courses In Progress",
    "No. of Courses Completed",
    "Action"
  ];

  const colSortValues = [false, true, true, true, true, true, true, true, false];

  const eduSmartActionsData = [
    {
      data: "View",
      requiredValue: "boolean",
      onClick: (data) => {
        // Placeholder for action - add navigation or dialog later
        console.log("View clicked for:", data);
      },
    },
  ];

  const getTableValues = () => {
    const No = [];
    const staff = [];
    const staffType = [];
    const department = [];
    const noOfCourses = [];
    const noOfCoursesNotStarted = [];
    const noOfCoursesInProgress = [];
    const noOfCoursesCompleted = [];
    const action = [];

    tableData?.map((data, index) => {
      No.push(index + 1 + ".");
      staff.push(
        `${formatFirstNameLastName(data?.staff?.firstName, data?.staff?.lastName)}` || "-"
      );
      staffType.push(data?.staffType || "-");
      department.push(data?.department || "-");
      noOfCourses.push(data?.noOfCourses ?? "-");
      noOfCoursesNotStarted.push(data?.noOfCoursesNotStarted ?? "-");
      noOfCoursesInProgress.push(data?.noOfCoursesInProgress ?? "-");
      noOfCoursesCompleted.push(data?.noOfCoursesCompleted ?? "-");
      action.push(true);
    });

    return [
      { type: "text", value: No },
      { type: "text", value: staff },
      { type: "text", value: staffType },
      { type: "text", value: department },
      { type: "text", value: noOfCourses },
      { type: "text", value: noOfCoursesNotStarted },
      { type: "text", value: noOfCoursesInProgress },
      { type: "text", value: noOfCoursesCompleted },
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
                EduSmart Courses Status Tracker
              </div>
              <div className={style.displayInRow}>
                {(selectedDepartment && workModeType !== "Department Head") && (
                  <div className={`${style.filterBackground} ${style.displayInRow}`}>
                    <div className={`${style.filtertextStyle} ${style.marginRight5}`}>Filter by {selectedDepartmentName}</div>
                    <Tooltip title="Remove" arrow>
                      <CancelOutlinedIcon
                        sx={{ fontSize: 15, color: "#06617A" }}
                        className={style.cursorPointer}
                        onClick={() => { setSelectedDepartment(""); setSelectedServiceArea(""); }}
                      />
                    </Tooltip>
                  </div>
                )}
                {selectedApplicantType && (
                  <div className={`${style.filterBackground} ${style.displayInRow} ${style.marginLeft5}`}>
                    <div className={`${style.filtertextStyle} ${style.marginRight5}`}>Filter by {selectedApplicantTypeName}</div>
                    <Tooltip title="Remove" arrow>
                      <CancelOutlinedIcon
                        sx={{ fontSize: 15, color: "#06617A" }}
                        className={style.cursorPointer}
                        onClick={() => setSelectedApplicantType("")}
                      />
                    </Tooltip>
                  </div>
                )}
                <div
                  className={`${style.alignCenter} ${style.cursorPointer}`}
                  style={{ opacity: 1 }}
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <Tooltip title="Filter" arrow>
                    <FilterAltOutlinedIcon sx={{ fontSize: 25, color: "#06617A" }} />
                  </Tooltip>
                </div>
                <div className={`${style.alignCenter} ${style.cursorPointer} ${style.marginLeft10}`}>
                  <Tooltip title="Print Data" arrow>
                    <PrintOutlinedIcon
                      sx={{ fontSize: 25, color: "#06617A" }}
                      onClick={handlePrint}
                    />
                  </Tooltip>
                </div>
                <Tooltip title="Close" arrow>
                  <img
                    src={CrossPink}
                    alt="cross"
                    className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft10}`}
                    onClick={() => getIsOpen(false)}
                  />
                </Tooltip>
              </div>
            </div>

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
                    disabledList={applicantType?.map(() => false)}
                    label={'Staff Type'}
                    required={false}
                  />
                </div>
              </div>
            )}

            <div className={`${style.marginTop10}`} ref={componentRef}>
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
                        gridStyle={style.eduSmartCoursesGrid}
                        actions={eduSmartActionsData}
                        scrollStyle={style.contractScrollStyle}
                        tableSortValues={colSortValues}
                        heading={"There are no records to display"}
                        getHandleSort={getHandleSort}
                        sortValue={{ sortBy: sortValue, sortByField: sortField }}
                        getSelectedPage={getSelectedPage}
                        totalCount={totalCount}
                        page={page}
                        searchTermForTable={searchTermForTable}
                        searchCount={searchCount}
                        setSearchTermForTable={setSearchTermForTable}
                        onLimitChange={handleLimitChange}
                        searchField={
                          <CommonSearchField
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            onChange={handleSearch}
                            searchData={[]}
                            handleShowForSearch={handleShowForSearch}
                            placeholder="Search EduSmart Courses"
                          />
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default EduSmartCoursesTrackerDialog;
