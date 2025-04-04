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
import { useNavigate } from "react-router-dom";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

const MDTrackerDialog = ({ getIsOpen, isLoading }) => {
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
  const [currentTab, setCurrentTab] = useState('ByMedicalDirective')
  const [displayInnerList, setDisplayInnerList] = useState(false);


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

    console.log("selectedDept", selectedValue)
  }

  useEffect(() => {
    getActiveUserData()
  }, [sortField, sortValue, page, totalCount, selectedDepartment, selectedServiceArea, selectedApplicantType, limit, searchTermForTable]);

  useEffect(() => {
    setUserDetails();
  }, [users?.id])

  useEffect(() => {
    getDepartmentList();
    getApplicantType();
  }, [showFilter])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchData([]);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    getActiveUserDataForSearch(signal);

    return () => controller.abort();
  }, [searchTerm]);

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
  }


  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    console.log("userdataaaa" + JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUserRole(userData?.roles?.map((data) => data?.roleName));
  }

  const headerValuesForByMedicalDirective = [
    "",
    "No.",
    "MD ID",
    "MD Title",
    "Department / Division",
    "Attested",
    "Not Attested",
    ""
  ];

  const headerValuesForByApplicants = [
    "",
    "No.",
    "Applicant name",
    "Applicant ID",
    "Type",
    "Department / Division",
    "Attested",
    "Not Attested",
    ""
  ];

  const innerHeaderValuesForByMedicalDirective = [
    "No.",
    "Applicant Type",
    "Applicant Name",
    "Applicant Status",
    "Attestation Date",
    ""
  ];

  const innerHeaderValuesForByApplicants = [
    "",
    "No.",
    "MD ID",
    "MD Title",
    "Department / Division",
    "Last Attested",
    ""
  ];

  const headerValues = currentTab === "ByApplicants" ? headerValuesForByApplicants : headerValuesForByMedicalDirective
  const innerHeaderValues = currentTab === "ByApplicants" ? innerHeaderValuesForByApplicants : innerHeaderValuesForByMedicalDirective
  const colSortValues = [false, false, false, false, false, false];
  const actionsData = [
    {
      data: "View",
      requiredValue: "boolean",
      onClick: () => { setDisplayInnerList(true) },
    },
  ];

  const innerActionsData = [
    {
      data: "View",
      requiredValue: "boolean",
      onClick: () => { },
    },
  ];

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };


  const getActiveUserData = async () => {
    try {
      setIsLoadingImage(true);
      const departmentParam = selectedDepartment || selectedServiceArea ? `&departmentSpecialties=${selectedDepartment}%23${selectedServiceArea}` : "";
      const url = `application-management-service/staff/reappointmentStatusDetails?sortBy=${sortValue}&sortByField=${sortField}&limit=${limit}&searchText=${searchTermForTable}&isPaginationRequired=${limit === 9999 ? false : true}&offset=${page - 1}${departmentParam}${selectedApplicantType ? `&applicantTypeId=${selectedApplicantType}` : ''}`;

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
    navigate("/reportTypeOverview/submittedTimesheetsPaymentStatus", { state: { tableData } });
  };

  const getTableValuesByApplicants = () => {
    const No = [];
    const dot = []
    const dotTooltipValues = []
    const applicantName = [];
    const applicantId = [];
    const type = [];
    const departmentSpecific = [];
    const attestedBy = [];
    const notAttested = [];
    const action = [];

    tableData?.map((data, index) => {
      dot.push("green");
      dotTooltipValues.push("All Attested")
      No.push(index + 1 + ".")
      applicantName.push(`MD ${index + 1}`);
      applicantId.push(`MD ID${index + 1}`);
      type.push('New')
      departmentSpecific.push(`MD ${index + 1}`);
      attestedBy.push(`${index + 1}`);
      notAttested.push(0)
      action.push(true);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: No },
      { type: "text", value: applicantName },
      { type: "text", value: applicantId },
      { type: "text", value: type },
      { type: "text", value: departmentSpecific },
      { type: "text", value: attestedBy },
      { type: "text", value: notAttested },
      { type: "action", value: action },
    ];
  };

  const getTableValuesByMedicalDirecties = () => {
    const No = [];
    const dot = []
    const dotTooltipValues = []
    const mdName = [];
    const mdId = [];
    const departmentSpecific = [];
    const attestedBy = [];
    const notAttested = [];
    const action = [];

    tableData?.map((data, index) => {
      dot.push("green");
      dotTooltipValues.push("All Attested")
      No.push(index + 1 + ".")
      mdName.push(`MD ${index + 1}`);
      mdId.push(`MD ID${index + 1}`);
      departmentSpecific.push(`MD ${index + 1}`);
      attestedBy.push(`${index + 1}`);
      notAttested.push(0)
      action.push(true);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: No },
      { type: "text", value: mdName },
      { type: "text", value: mdId },
      { type: "text", value: departmentSpecific },
      { type: "text", value: attestedBy },
      { type: "text", value: notAttested },
      { type: "action", value: action },
    ];
  };
  const getInnerTableValuesByApplicants = () => {
    const No = [];
    const dot = []
    const dotTooltipValues = []
    const mdName = [];
    const mdId = [];
    const departmentSpecific = [];
    const lastAttested = [];
    const action = [];

    tableData?.map((data, index) => {
      dot.push("green");
      dotTooltipValues.push("All Attested")
      No.push(index + 1 + ".")
      mdName.push(`MD ${index + 1}`);
      mdId.push(`MD ID${index + 1}`);
      departmentSpecific.push(`MD ${index + 1}`);
      lastAttested.push(`${index + 1}`);
      action.push(true);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: No },
      { type: "text", value: mdName },
      { type: "text", value: mdId },
      { type: "text", value: departmentSpecific },
      { type: "text", value: lastAttested },
      { type: "action", value: action },
    ];
  };

  const getInnerTableValuesByMedicalDirecties = () => {
    const No = [];
    const dot = []
    const dotTooltipValues = []
    const applicantName = [];
    const type = [];
    const attestationDate = [];
    const action = [];

    tableData?.map((data, index) => {
      dot.push("green");
      dotTooltipValues.push("All Attested")
      No.push(index + 1 + ".")
      applicantName.push(`MD ${index + 1}`);
      type.push('New')
      attestationDate.push(`${index + 1}`);
      action.push(true);
    });

    return [
      { type: "text", value: No },
      { type: "text", value: type },
      { type: "text", value: applicantName },
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: attestationDate },
      { type: "action", value: action },
    ];
  };

  const tableValues = currentTab === "ByApplicants" ? getTableValuesByApplicants() : getTableValuesByMedicalDirecties()
  const innerTableValues = currentTab === "ByApplicants" ? getInnerTableValuesByApplicants() : getInnerTableValuesByMedicalDirecties()

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
          {!displayInnerList ? (
            <div className={Classes.DIALOG_BODY}>
              <div className={style.spaceBetween}>
                <div>
                  <div className={`${style.heading}`}>
                    {/* Staff Reappointment Status {" "}({" "}{totalCount|| 0 }{" "}) */}
                    Medical Directive Attestation Log For Reappointment Staff With Applications Submitted ({194})
                  </div>
                  <div className={style.currentStatusText}>{`Current status as of ${format(new Date(), 'MMM dd, yyyy')}`}</div>
                </div>
                <div className={style.displayInRow}>
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
                  {/* <div
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
                </div> */}
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
              {/* {showFilter && (
              <div className={style.departmentContainer}>
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
            )} */}
              <div className={`${style.marginTop10}`}>
                <div>
                  <div className={` ${style.marginTop20}`}>
                    {isLoading ? (
                      <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
                        <CircularProgress sx={{ color: "#06617A" }} />
                      </div>
                    ) : (
                      <>
                        <div className={`${style.displayInRow} ${style.marginLeft}`}>
                          <div className={`${style.tabGrid} ${style.cursorPointer} ${currentTab === "ByMedicalDirective" ? style.activeTab : ''}`} onClick={() => setCurrentTab('ByMedicalDirective')}>
                            <div>By Medical Directive</div>
                            <div>194</div>
                          </div>
                          <div className={`${style.tabGrid} ${style.cursorPointer} ${currentTab === "ByApplicants" ? style.activeTab : ''}`} onClick={() => setCurrentTab('ByApplicants')}>
                            <div>By Applicants</div>
                            <div>21</div>
                          </div>
                        </div>
                        <div className={`${style.reduceMarginTop} staffApplicationList`}>
                          <TableTwo
                            tableHeaderValues={headerValues}
                            tableDataValues={tableValues}
                            tableData={tableData}
                            gridStyle={currentTab === "ByApplicants" ? style.byApplicantGrid : style.byMedicalDirectiveGrid}
                            actions={actionsData}
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
                          // searchField={<CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} />}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={Classes.DIALOG_BODY}>
              <div className={style.spaceBetween}>
                <div>
                  <div className={`${style.heading}`}>
                    {/* Staff Reappointment Status {" "}({" "}{totalCount|| 0 }{" "}) */}
                    {currentTab === "ByApplicants" ? `Medical Directive Attestation Log For { Applicant Name} {Type} {Department}` : `Attestation Log For {MD - 155} - {Paediatric Emergency Department Asthma Care Pathway}`}
                  </div>
                  <div className={style.currentStatusText}>{`Current status as of ${format(new Date(), 'MMM dd, yyyy')}`}</div>
                </div>
                <div className={style.displayInRow}>
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
                  {/* <div
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
                </div> */}
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
              {/* {showFilter && (
              <div className={style.departmentContainer}>
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
            )} */}
              <div className={`${style.marginTop10}`}>
                <div>
                  <div className={` ${style.marginTop20}`}>
                    {isLoading ? (
                      <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
                        <CircularProgress sx={{ color: "#06617A" }} />
                      </div>
                    ) : (
                      <>

                        <div className={`${style.reduceMarginTop} staffApplicationList`}>
                          <TableTwo
                            tableHeaderValues={innerHeaderValues}
                            tableDataValues={innerTableValues}
                            tableData={tableData}
                            gridStyle={currentTab === "ByApplicants" ? style.byInnerApplicantGrid : style.byInnerMedicalDirectiveGrid}
                            actions={innerActionsData}
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
                          // searchField={<CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} />}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default MDTrackerDialog;