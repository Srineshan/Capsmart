import React, { useState, useEffect, useRef } from "react";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import style from "./index.module.scss";
import TableTwo from "../TableDesignTwo";
import CircularProgress from "@mui/material/CircularProgress";
import { formatFirstNameLastName } from "../../utils/formatting";
import { format } from "date-fns";
import LoadingScreen from "../LoadingScreen";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CommonSelectField from '../CommonFields/CommonSelectField';
import CommonSearchField from "../CommonFields/CommonSearchField";
import { Tooltip } from "@mui/material";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import { useReactToPrint } from "react-to-print";
import { GET, POST } from "../../Screens/dataSaver";
import { SuccessToaster, ErrorToaster, SuccessToaster2, ErrorToaster2 } from "../../utils/toaster";
import axios from "axios";

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
  const [selectedApplicationType, setSelectedApplicationType] = useState('REAPPOINTMENT');
  const [applicantType, setApplicantType] = useState([]);
  const [LMSList, setLMSList] = useState([]);
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

  const getLMSList = async () => {
    setIsLoadingImage(true);
    try {
      const departmentParam =
        selectedDepartment || selectedServiceArea
          ? `&departmentSpecialties=${selectedDepartment}%23${selectedServiceArea}`
          : "";
      const applicantTypeParam = selectedApplicantType
        ? `&applicantTypeId=${selectedApplicantType}`
        : "";
      const { data: lms } = await GET(
        `application-management-service/application/lmsTracker?applicationCreationType=${selectedApplicationType}&positionType=${selectedApplicationType === "LOCUM_RENEWAL" ? "LOCUM" : "PERMANENT"}&searchText=${searchTermForTable}&sortBy=${sortValue}&sortByField=${sortField}&limit=${limit}&offset=${page - 1}&isPaginationRequired=${true}${departmentParam}${applicantTypeParam}`
      );
      setLMSList(lms?.applications || []);
    } catch (error) {
      console.error("Error fetching LMS list:", error);
    }
    setIsLoadingImage(false);
  };

  // Static reference data
  useEffect(() => {
    getDepartmentList();
    getApplicantType();
  }, []);

  // All filters/sort/search/pagination drive API query
  useEffect(() => {
    getLMSList();
  }, [
    selectedDepartment,
    selectedServiceArea,
    selectedApplicantType,
    selectedApplicationType,
    searchTermForTable,
    sortField,
    sortValue,
    page,
    limit,
  ]);

  // Map API response to table rows (no extra filtering – all filters from API)
  useEffect(() => {
    setIsLoadingImage(true);

    const mappedData = (LMSList || []).map((item) => {
      const courses = item?.lmsDetails?.courses || [];
      const totalCourses = courses.length;
      const completedCourses = courses.filter(
        (c) =>
          c?._course_completed === true ||
          c?.is_course_completed === true ||
          c?.course_status === "completed"
      ).length;
      const inProgressCourses = courses.filter(
        (c) => c?.course_status === "in_progress"
      ).length;
      const notStartedCourses =
        totalCourses - completedCourses - inProgressCourses;

      return {
        id: item.id,
        courses,
        staff: {
          firstName: item?.basicDetails?.applicant?.name?.firstName,
          lastName: item?.basicDetails?.applicant?.name?.lastName,
        },
        staffType: item?.basicDetails?.applicant?.applicantType,
        department: item?.basicDetails?.departmentSpecialty?.department,
        applicantId: item?.applicant?.id,
        noOfCourses: totalCourses,
        noOfCoursesNotStarted: notStartedCourses,
        noOfCoursesInProgress: inProgressCourses,
        noOfCoursesCompleted: completedCourses,
      };
    });

    setTableData(mappedData);
    setTotalCount(mappedData.length);
    setSearchount(mappedData.length);
    setIsLoadingImage(false);
  }, [LMSList, dateFormat]);

  const [printMode, setPrintMode] = useState("BY_STAFF"); // BY_STAFF | COURSE_NOT_COMPLETED | COURSE_COMPLETED | BY_DEPARTMENT

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

  const headerValuesByStaff = [
    "No.",
    "Staff",
    "Staff Type",
    "Department",
    "Courses",
    "Not Started",
    "In Progress",
    "Completed",
    "Action"
  ];

  const headerValuesByCourseNotCompleted = [
    "Staff",
    "Staff Type",
    "Department",
    "Action",
  ];

  const headerValuesByCourseCompleted = [
    "Staff",
    "Staff Type",
    "Department",
    "Certificate",
  ];

  const headerValues =
    printMode === "COURSE_NOT_COMPLETED"
      ? headerValuesByCourseNotCompleted
      : printMode === "COURSE_COMPLETED"
        ? headerValuesByCourseCompleted
        : headerValuesByStaff;

  const colSortValues = [false, true, true, true, false, false, false, false, false];

  const getLMSUsername = async (id) => {
    const { data: userData } = await GET(`user-management-service/user/${id}`);
    return userData?.lmsUserName;
  };

  const handleSendReminder = async (row) => {
    const id = row?.id;
    if (!id) {
      ErrorToaster2("Unable to send reminder: id is missing.");
      return;
    }

    try {
      await POST("application-management-service/lms/sendReminder", [{ id }]);
      SuccessToaster2("Reminder sent successfully.");
    } catch (error) {
      console.error("Error sending reminder:", error);
      ErrorToaster2(
        error?.response?.data?.message || "Failed to send reminder."
      );
    }
  };

  const eduSmartActionsData = [
    {
      data: "Send Reminder",
      requiredValue: "boolean",
      onClick: handleSendReminder,
      conditionToShow:
        "data?.noOfCourses > 0 && data?.noOfCoursesCompleted !== data?.noOfCourses",
    },
  ];

  const handleResetCourse = async (row, courseId) => {
    try {
      const applicantId = row?.applicantId;
      const username = applicantId ? await getLMSUsername(applicantId) : null;

      if (!courseId || !username) {
        ErrorToaster2("Missing course id or LMS username to reset course.");
        return;
      }

      await axios.post("https://lms.indocaribe.com/custom-api/reset-course/", {
        course_id: courseId,
        username,
      });

      SuccessToaster2("Course has been reset successfully.");
    } catch (error) {
      console.error("Error resetting course:", error);
      ErrorToaster2("Failed to reset course. Please try again.");
    }
  };

  const handleCertificateClick = (course) => {
    const certificateUrl =
      course?.certificate_details?.view_url ||
      course?.certificate_details?.download_url;
    if (certificateUrl) {
      window.open(certificateUrl, "_blank");
    }
  };

  const getStaffTableValues = (rows) => {
    const No = [];
    const staff = [];
    const staffType = [];
    const department = [];
    const noOfCourses = [];
    const noOfCoursesHover = [];
    const noOfCoursesNotStarted = [];
    const noOfCoursesNotStartedHover = [];
    const noOfCoursesInProgress = [];
    const noOfCoursesInProgressHover = [];
    const noOfCoursesCompleted = [];
    const noOfCoursesCompletedHover = [];
    const action = [];

    (rows || [])?.map((data, index) => {
      No.push(index + 1 + ".");
      staff.push(
        `${formatFirstNameLastName(data?.staff?.firstName, data?.staff?.lastName)}` || "-"
      );
      staffType.push(data?.staffType || "-");
      department.push(data?.department || "-");

      const courses = data?.courses || [];
      const completedCourses = courses.filter(
        (c) =>
          c?._course_completed === true ||
          c?.is_course_completed === true ||
          c?.course_status === "completed"
      );
      const inProgressCourses = courses.filter(
        (c) => c?.course_status === "in_progress"
      );
      const completedIds = new Set(
        completedCourses.map((c) => c.course_id || c.course_name)
      );
      const inProgressIds = new Set(
        inProgressCourses.map((c) => c.course_id || c.course_name)
      );
      const notStartedCoursesList = courses.filter((c) => {
        const key = c.course_id || c.course_name;
        return !completedIds.has(key) && !inProgressIds.has(key);
      });

      const totalCourses = data?.noOfCourses ?? courses.length ?? 0;
      const notStartedCount =
        data?.noOfCoursesNotStarted ?? notStartedCoursesList.length ?? 0;
      const inProgressCount =
        data?.noOfCoursesInProgress ?? inProgressCourses.length ?? 0;
      const completedCount =
        data?.noOfCoursesCompleted ?? completedCourses.length ?? 0;

      // Total courses count + hover (only when > 0)
      if (totalCourses > 0) {
        noOfCourses.push(totalCourses);
        const totalHoverArray = courses.map((course, idx) => (
          <div key={idx}>
            <span>{course?.course_name || "-"}</span>
            {idx !== courses.length - 1 && (
              <hr style={{ margin: "5px 0 -10px 0px" }} />
            )}
          </div>
        ));
        noOfCoursesHover.push(totalHoverArray);
      } else {
        noOfCourses.push("-");
        noOfCoursesHover.push(["-"]);
      }

      // Not started count + hover (only when > 0)
      if (notStartedCount > 0) {
        noOfCoursesNotStarted.push(notStartedCount);
        const notStartedHoverArray = notStartedCoursesList.map(
          (course, idx) => (
            <div key={idx}>
              <span>{course?.course_name || "-"}</span>
              {idx !== notStartedCoursesList.length - 1 && (
                <hr style={{ margin: "5px 0 -10px 0px" }} />
              )}
            </div>
          )
        );
        noOfCoursesNotStartedHover.push(notStartedHoverArray);
      } else {
        noOfCoursesNotStarted.push("-");
        noOfCoursesNotStartedHover.push(["-"]);
      }

      // In-progress count + hover (only when > 0)
      if (inProgressCount > 0) {
        noOfCoursesInProgress.push(inProgressCount);
        const inProgressHoverArray = inProgressCourses.map((course, idx) => (
          <div key={idx}>
            <span>{course?.course_name || "-"}</span>
            {idx !== inProgressCourses.length - 1 && (
              <hr style={{ margin: "5px 0 -10px 0px" }} />
            )}
          </div>
        ));
        noOfCoursesInProgressHover.push(inProgressHoverArray);
      } else {
        noOfCoursesInProgress.push("-");
        noOfCoursesInProgressHover.push(["-"]);
      }

      // Completed count + hover (only when > 0; with completion date + certificate icon)
      if (completedCount > 0) {
        noOfCoursesCompleted.push(completedCount);
        const completedHoverArray = completedCourses.map((course, idx) => {
          const completionDate =
            course?.course_completion_date &&
              !Number.isNaN(new Date(course.course_completion_date))
              ? format(
                new Date(course.course_completion_date),
                dateFormat
              )
              : null;
          const hasCertificate = !!(
            course?.certificate_details?.view_url ||
            course?.certificate_details?.download_url
          );

          return (
            <div
              key={idx}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <span>
                {course?.course_name || "-"}
                {completionDate
                  ? ` — ${completionDate}`
                  : " — Completion date N/A"}
              </span>
              {hasCertificate && (
                <CardMembershipIcon
                  sx={{
                    fontSize: 24,
                    color: "#FFFFFF", // default white for better contrast on dark hover
                    cursor: "pointer",
                  }}
                  onClick={() => handleCertificateClick(course)}
                />
              )}
              {idx !== completedCourses.length - 1 && (
                <hr style={{ margin: "5px 0 -10px 0px" }} />
              )}
            </div>
          );
        });
        noOfCoursesCompletedHover.push(completedHoverArray);
      } else {
        noOfCoursesCompleted.push("-");
        noOfCoursesCompletedHover.push(["-"]);
      }

      action.push(true);
    });

    return [
      { type: "text", value: No },
      { type: "text", value: staff },
      { type: "text", value: staffType },
      { type: "text", value: department },
      {
        type: "countWithHover",
        value: noOfCourses,
        hoverText: noOfCoursesHover,
        isShowHoverText: true,
      },
      {
        type: "countWithHover",
        value: noOfCoursesNotStarted,
        hoverText: noOfCoursesNotStartedHover,
        isShowHoverText: true,
      },
      {
        type: "countWithHover",
        value: noOfCoursesInProgress,
        hoverText: noOfCoursesInProgressHover,
        isShowHoverText: true,
      },
      {
        type: "countWithHover",
        value: noOfCoursesCompleted,
        hoverText: noOfCoursesCompletedHover,
        isShowHoverText: true,
      },
      { type: "action", value: action },
    ];
  };

  const getCourseNotCompletedTableValues = (rows) => {
    const staff = [];
    const staffType = [];
    const department = [];
    const action = [];

    (rows || []).forEach((data) => {
      staff.push(
        `${formatFirstNameLastName(
          data?.staff?.firstName,
          data?.staff?.lastName
        )}` || "-"
      );
      staffType.push(data?.staffType || "-");
      department.push(data?.department || "-");
      action.push(true);
    });

    return [
      { type: "text", value: staff },
      { type: "text", value: staffType },
      { type: "text", value: department },
      { type: "action", value: action },
    ];
  };

  const getCourseCompletedTableValues = (rows, courseId) => {
    const staff = [];
    const staffType = [];
    const department = [];
    const certificateField = [];

    (rows || []).forEach((data) => {
      staff.push(
        `${formatFirstNameLastName(
          data?.staff?.firstName,
          data?.staff?.lastName
        )}` || "-"
      );
      staffType.push(data?.staffType || "-");
      department.push(data?.department || "-");

      const course =
        data?.courses?.find((c) => {
          const key = c?.course_id || c?.course_name;
          const isCompleted =
            c?._course_completed === true ||
            c?.is_course_completed === true ||
            c?.course_status === "completed";
          return key === courseId && isCompleted;
        }) || null;

      const hasCertificate = !!(
        course?.certificate_details?.view_url ||
        course?.certificate_details?.download_url
      );

      if (course && hasCertificate) {
        certificateField.push(
          <div
            key={courseId + (data?.id || "")}
            className={style.verticalAlignCenter}
            style={{ width: "100%", minHeight: "100%" }}
          >
            <Tooltip title="View certificate" arrow>
              <CardMembershipIcon
                sx={{
                  fontSize: 22,
                  color: "#06617A",
                  cursor: "pointer",
                }}
                onClick={() => handleCertificateClick(course)}
              />
            </Tooltip>
          </div>
        );
      } else {
        certificateField.push(
          <div
            key={courseId + (data?.id || "")}
            className={style.verticalAlignCenter}
            style={{ width: "100%" }}
          >
            <span />
          </div>
        );
      }
    });

    return [
      { type: "text", value: staff },
      { type: "text", value: staffType },
      { type: "text", value: department },
      { type: "field", field: certificateField },
    ];
  };

  const getDisplayTableData = () => {
    // BY_STAFF uses the full tableData as-is
    return tableData || [];
  };

  const displayTableData = getDisplayTableData();
  const displayTotalCount = displayTableData?.length || 0;

  const buildDepartmentGroups = () => {
    const map = new Map();
    (tableData || []).forEach((row) => {
      const dept = row?.department || "No Department";
      if (!map.has(dept)) {
        map.set(dept, []);
      }
      map.get(dept).push(row);
    });
    return Array.from(map.entries()).map(([department, rows]) => ({
      department,
      rows,
    }));
  };

  const buildCourseGroups = (showCompleted) => {
    const map = new Map();
    (tableData || []).forEach((row) => {
      const courses = row?.courses || [];
      courses.forEach((course) => {
        const key = course?.course_id || course?.course_name;
        if (!key) return;
        const isCompleted =
          course?._course_completed === true ||
          course?.is_course_completed === true ||
          course?.course_status === "completed";
        const hasCertificate = !!(
          course?.certificate_details?.view_url ||
          course?.certificate_details?.download_url
        );
        const matches = showCompleted
          ? isCompleted && hasCertificate // Completed view: only when certificate is available
          : !isCompleted; // Not completed view: anything not completed
        if (!matches) return;

        if (!map.has(key)) {
          map.set(key, {
            id: key,
            name: course?.course_name || key,
            rows: [],
          });
        }
        // attach course context to the row for later certificate lookup
        map.get(key).rows.push(row);
      });
    });
    return Array.from(map.values());
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
              <div className={`${style.displayInRow}`}>
                <div className={`${style.heading} ${style.displayInRow}`}>
                  EduSmart Courses Status Tracker
                </div>
                <div className={`${style.alignCenter} ${style.marginLeft}`}>
                  <CommonSelectField
                    value={printMode}
                    onChange={(e) => setPrintMode(e.target.value)}
                    className={style.printModeSelect}
                    firstOptionLabel={''}
                    firstOptionValue={''}
                    valueList={[
                      "BY_STAFF",
                      "COURSE_NOT_COMPLETED",
                      "COURSE_COMPLETED",
                      "BY_DEPARTMENT",
                    ]}
                    labelList={[
                      "By Staff",
                      "By Course (Not Completed)",
                      "By Course (Completed)",
                      "By Department",
                    ]}
                    disabledList={[false, false, false, false]}
                    label={""}
                    required={false}
                  />
                </div>
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
                {selectedApplicationType && (
                  <div className={`${style.filterBackground} ${style.displayInRow}`}>
                    <div className={`${style.filtertextStyle} ${style.marginRight5}`}>Filter by {selectedApplicationType === "NEW" ? 'New' : selectedApplicationType === "REAPPOINTMENT" ? 'Reappointment' : 'Locum'}</div>
                    <Tooltip title="Remove" arrow>
                      <CancelOutlinedIcon
                        sx={{ fontSize: 15, color: "#06617A" }}
                        className={style.cursorPointer}
                        onClick={() => { setSelectedApplicationType(''); }}
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
                  <Tooltip
                    title={`Print – ${printMode === "BY_STAFF"
                      ? "By Staff"
                      : printMode === "COURSE_NOT_COMPLETED"
                        ? "By Course (Not Completed)"
                        : printMode === "COURSE_COMPLETED"
                          ? "By Course (Completed)"
                          : "By Department"
                      }`}
                    arrow
                  >
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
                <div>
                  <CommonSelectField
                    value={selectedApplicationType}
                    onChange={(e) => setSelectedApplicationType(e.target.value)}
                    className={style.fullWidth}
                    firstOptionLabel={'All'}
                    firstOptionValue={''}
                    valueList={['NEW', 'REAPPOINTMENT', 'LOCUM_RENEWAL']}
                    labelList={['New', 'Reappointment', 'Locum']}
                    disabledList={['New', 'Reappointment', 'Locum']?.map(() => false)}
                    label={'Application Type'}
                    required={false}
                  />
                </div>
              </div>
            )}

            <div className={`${style.marginTop10}`} ref={componentRef}>
              {printMode === "BY_STAFF" && (
                <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
                  {isLoading ? (
                    <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
                      <CircularProgress sx={{ color: "#06617A" }} />
                    </div>
                  ) : (
                    <div className={`${style.reduceMarginTop10} staffApplicationList`}>
                      <TableTwo
                        tableHeaderValues={headerValues}
                        tableDataValues={getStaffTableValues(displayTableData)}
                        tableData={displayTableData}
                        gridStyle={style.eduSmartCoursesGrid}
                        actions={eduSmartActionsData}
                        // scrollStyle={style.contractScrollStyle}
                        tableSortValues={colSortValues}
                        heading={"There are no records to display"}
                        getHandleSort={getHandleSort}
                        sortValue={{ sortBy: sortValue, sortByField: sortField }}
                        getSelectedPage={getSelectedPage}
                        totalCount={displayTotalCount}
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
              )}

              {printMode === "BY_DEPARTMENT" && (
                <div className={style.printSection}>
                  {buildDepartmentGroups().map((group) => (
                    <div key={group.department} className={style.printBlock}>
                      <h4 className={style.printHeading}>{group.department}</h4>
                      <div className={`${style.bigCardStyle}`}>
                        <div className={`${style.reduceMarginTop10} staffApplicationList`}>
                          <TableTwo
                            tableHeaderValues={headerValues}
                            tableDataValues={getStaffTableValues(group.rows)}
                            tableData={group.rows}
                            gridStyle={style.eduSmartCoursesGrid}
                            actions={eduSmartActionsData}
                            // scrollStyle={style.contractScrollStyle}
                            tableSortValues={colSortValues}
                            heading={"There are no records to display"}
                            getHandleSort={getHandleSort}
                            sortValue={{ sortBy: sortValue, sortByField: sortField }}
                            getSelectedPage={() => { }}
                            totalCount={group.rows.length}
                            page={1}
                            searchTermForTable={""}
                            searchCount={group.rows.length}
                            setSearchTermForTable={() => { }}
                            onLimitChange={() => { }}
                            searchField={null}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {printMode === "COURSE_NOT_COMPLETED" && (
                <div className={style.printSection}>
                  {buildCourseGroups(false).map((group) => (
                    <div key={group.id} className={style.printBlock}>
                      <h4 className={style.printHeading}>{group.name}</h4>
                      <div className={`${style.bigCardStyle}`}>
                        <div className={`${style.reduceMarginTop10} staffApplicationList`}>
                          <TableTwo
                            tableHeaderValues={headerValues}
                            tableDataValues={getCourseNotCompletedTableValues(group.rows)}
                            tableData={group.rows}
                            gridStyle={style.eduSmartStaffAndDeptGrid}
                            actions={[
                              {
                                data: "Send Reminder",
                                requiredValue: "boolean",
                                onClick: handleSendReminder,
                              },
                              {
                                data: "Reset Course",
                                requiredValue: "boolean",
                                onClick: (row) => handleResetCourse(row, group.id),
                              },
                            ]}
                            // scrollStyle={style.contractScrollStyle}
                            tableSortValues={colSortValues}
                            heading={"There are no records to display"}
                            getHandleSort={getHandleSort}
                            sortValue={{ sortBy: sortValue, sortByField: sortField }}
                            getSelectedPage={() => { }}
                            totalCount={group.rows.length}
                            page={1}
                            searchTermForTable={""}
                            searchCount={group.rows.length}
                            setSearchTermForTable={() => { }}
                            onLimitChange={() => { }}
                            searchField={null}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {printMode === "COURSE_COMPLETED" && (
                <div className={style.printSection}>
                  {buildCourseGroups(true).map((group) => (
                    <div key={group.id} className={style.printBlock}>
                      <h4 className={style.printHeading}>{group.name}</h4>
                      <div className={`${style.bigCardStyle}`}>
                        <div className={`${style.reduceMarginTop10} staffApplicationList`}>
                          <TableTwo
                            tableHeaderValues={headerValues}
                            tableDataValues={getCourseCompletedTableValues(group.rows, group.id)}
                            tableData={group.rows}
                            gridStyle={style.eduSmartStaffAndDeptGrid}
                            actions={[]}
                            // scrollStyle={style.contractScrollStyle}
                            tableSortValues={colSortValues}
                            heading={"There are no records to display"}
                            getHandleSort={getHandleSort}
                            sortValue={{ sortBy: sortValue, sortByField: sortField }}
                            getSelectedPage={() => { }}
                            totalCount={group.rows.length}
                            page={1}
                            searchTermForTable={""}
                            searchCount={group.rows.length}
                            setSearchTermForTable={() => { }}
                            onLimitChange={() => { }}
                            searchField={null}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default EduSmartCoursesTrackerDialog;
