import React, { useState, useEffect, Fragment } from "react";
import { GET } from "./../../dataSaver";
import SideBar from "../../../Components/Sidebar";
import Navbar from "../../../Components/Navbar";
import Tile from "../../../Components/Tile";
import Table from "../../../Components/TableDesign";
import { useNavigate } from "react-router-dom";
import style from "./index.module.scss";
import SearchBar from "../../../Components/SearchBar";
import ManageMedicalDirectives from "./manageMedicalDirectives";
import DataUpload from "./dataUpload";
import FeedbackTicket from "./feedbackTicket";
import ReferenceList from "./../../ReferenceList";
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';
import CommonInputField from '../../../Components/CommonFields/CommonInputField';
import MDManagerStep1 from "./step1";
import MDManagerStep2 from "./step2";
import MDManagerStep3 from "./step3";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CommonSearchField from "../../../Components/CommonFields/CommonSearchField";
import CommonDateField from "../../../Components/CommonFields/CommonDateField";
import { TextField, Tooltip } from "@material-ui/core";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { format } from "date-fns";
import CommonMultiSelectField from "../../../Components/CommonFields/CommonMultiSelectField";
import MDManagerStep4 from "./step4";

const MDManager = () => {
  const navigate = useNavigate();
  const [alertsData, setAlertsData] = useState([]);
  const [feedBackTileData, setFeedBackTileData] = useState([]);
  const [userMetadata, setUserMetadata] = useState([]);
  const [viewAlerts, setViewAlerts] = useState(true);
  const [selectedOption, setSelectedOption] = useState("MANAGE MEDICAL DIRECTIVES");
  const [isExpanded, setIsExpanded] = useState(true);
  let selectedOptionValue = sessionStorage.getItem("selectedOption");
  const [entityId, setEntityId] = useState("");
  const [refMetadata, setRefMetadata] = useState({ customCount: [], defaultCount: [], setupRequired: [], reviewForUse: [] })
  const [customCount, setCustomCount] = useState([]);
  const [defaultCount, setDefaultCount] = useState([]);
  const [step1, setStep1] = useState(false);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [step4, setStep4] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedCombinations, setSelectedCombinations] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedServiceArea, setSelectedServiceArea] = useState([]);
  const [mdFile, setMdFile] = useState();
  const [mdValue, setMdValue] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchCount, setSearchCount] = useState(0);
  const [searchTermForTable, setSearchTermForTable] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [mdId, setMdId] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [mdTitle, setMdTitle] = useState('');
  const [selectedDepartmentSpecialities, setSelectedDepartmentSpecialities] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [calendarStart, setCalendarStart] = useState(false);
  const [selectedMdId, setSelectedMdId] = useState('');
  const [showAddNewMedicalDirectives, setShowAddNewMedicalDirectives] = useState(false);
  const selectedSite = sessionStorage.getItem('selectedSite') || ''
  useEffect(() => {
    console.log(selectedOption, 'option')
    if (selectedOptionValue !== undefined && selectedOptionValue !== null) {
      setSelectedOption(selectedOptionValue);
    }
  }, [selectedOptionValue]);

  useEffect(() => {
    // feedBackTileValues();
    // userTileValues();
    // getEntity();
    getDepartmentList();
    getStaffList();
    getGroupList();
  }, []);

  // useEffect(() => {
  //   if (entityId !== "" && entityId !== undefined) {
  //     getReferenceCustomDefault();
  //   }
  // }, [entityId]);

  useEffect(() => {
    if (selectedMdId) {
      getMDByID()
    }
  }, [selectedMdId])

  // useEffect(() => {
  //   if (!step1 || !step2 || !step3) {
  //     setMdValue();
  //     setSelectedMdId('');
  //   }
  // }, [step1, step2, step3])

  const togglePin = () => { };

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

  const advancedSearch = {
    siteDepartmentSpecialties: selectedCombinations?.map(item => `${selectedSite}#${item.replaceAll("|", "#")}`),
    mdID: mdId,
    title: mdTitle,
    groupIds: selectedGroups?.length !== 0 ? selectedGroups : [],
    authorIds: selectedAuthor !== "" ? [selectedAuthor] : [],
    fromDate: from,
    toDate: to,
    // "noOfDays": 0,
    searchText: searchTerm
  }

  const getSelectedOption = (value) => {
    setSelectedOption(value);
  };

  const feedBackTileValues = async () => {
    const { data: feedback } = await GET(
      `feedback-management-service/ticket/metadata`
    );
    setFeedBackTileData(feedback);
  };

  const userTileValues = async () => {
    const { data: user } = await GET(
      `user-management-service/user/registeredUserMetadata`
    );
    setUserMetadata(user);
  };

  const handleChange = (e) => {
    console.log(e.target.value)
    const selectedValues = Array.from(e.target.value);
    setSelectedCombinations(selectedValues);

    const departments = [];
    const serviceAreas = [];

    selectedValues.forEach(value => {
      const [departmentId, serviceAreaId] = value.split("|");
      if (departmentId) departments.push(departmentId);
      if (serviceAreaId) serviceAreas.push(serviceAreaId);
    });

    console.log("Selected Departments:", departments);
    console.log("Selected Service Areas:", serviceAreas);
    console.log(selectedValues)
  };

  const getDepartmentList = async () => {
    const { data: department } = await GET(
      `entity-service/department`
    );
    setDepartmentList(department);
  }

  const getGroupList = async () => {
    const response = await GET(
      `medical-directive-service/medicalDirectiveGroup`
    );
    console.log(response.data);
    setGroupList(response?.data)
  }

  const getMDByID = async () => {
    const response = await GET(
      `medical-directive-service/medicalDirectives/${selectedMdId}`
    );
    console.log(response.data, 'mdValue');
    setMdValue(response?.data)
  }

  const getStaffList = async () => {
    const response = await GET(
      `application-management-service/staff?status=ACTIVE&sortByField=STAFF_NAME&isPaginationRequired=${false}&limit=${9999}`
    );
    console.log(response.data);
    setStaffList(response?.data?.staffs)
  }


  const getEntity = async () => {
    const { data: entity } = await GET(`entity-service/entity`);
    setEntityId(entity?.[0]?.id);
  };

  const getReferenceCustomDefault = async () => {
    const { data: referenceListCustomDefaultCount } = await GET(
      `entity-service/referenceList/entity/${entityId}`
    );
    console.log(referenceListCustomDefaultCount);
    const mappedDataArray = [];
    for (const key in referenceListCustomDefaultCount) {
      const mappedData = {
        ...referenceListCustomDefaultCount[key],
      };
      mappedDataArray.push(mappedData);
    }

    let DefaultData = mappedDataArray?.filter((data) => {
      if (data.standardList === true) {
        return data;
      }
    });
    // setRefMetadata({ ...refMetadata, defaultCount: DefaultData });

    let CustomData = mappedDataArray?.filter((data) => {
      if (data.standardList === false) {
        return data;
      }
    });
    // setRefMetadata({ ...refMetadata, customCount: CustomData });

    let setupRequired = mappedDataArray?.filter((data) => {
      if (data.lastModified === null) {
        return data;
      }
    });
    setRefMetadata({ ...refMetadata, setupRequired: setupRequired, defaultCount: DefaultData, customCount: CustomData });
  };

  const tableHeaderValues = [
    "",
    "",
    "ALERT TYPE",
    "ALERT NAME",
    "ALERT DATE & TIME",
    "ACTION",
  ];
  const toDoTableHeaderValues = [
    "",
    "TASK ID",
    "TASK TYPE",
    "SUBJECT / REFERENCE",
    "ACTION REQUIRED",
    "DUE DATE",
    "ASSIGN TO",
    "LAST UPDATED",
    "LAST UPDATED BY",
  ];

  let pin = [];
  let alert = [];
  let alertType = [];
  let alertName = [];
  let alertDateAndTime = [];
  let action = [];

  const getActiveFilesValues = () => {
    pin = [];
    alert = [];
    alertType = [];
    alertName = [];
    alertDateAndTime = [];
    action = [];

    alertsData?.map((data) => {
      pin.push("pin");
      alert.push(data?.fileId);
      alertType.push(data?.processingStatus);
      alertName.push(data?.fileName);
      alertDateAndTime.push("-");
      action.push(true);
    });

    return [
      { type: "dot", value: pin },
      { type: "text", value: alert },
      { type: "text", value: alertType },
      { type: "text", value: alertName },
      { type: "text", value: alertDateAndTime },
      { type: "action", value: action },
    ];
  };

  let dot = [];
  let taskId = [];
  let taskType = [];
  let subjectOrReference = [];
  let actionRequired = [];
  let dueDate = [];
  let assignTo = [];
  let lastUpdated = [];
  let lastUpdatedBy = [];

  const getToDoValues = () => {
    dot = [];
    taskId = [];
    taskType = [];
    subjectOrReference = [];
    actionRequired = [];
    dueDate = [];
    assignTo = [];
    lastUpdated = [];
    lastUpdatedBy = [];

    alertsData?.map((data) => {
      pin.push("pin");
      alert.push(data?.fileId);
      alertType.push(data?.processingStatus);
      alertName.push(data?.fileName);
      alertDateAndTime.push("-");
      action.push(true);
    });

    return [
      { type: "dot", value: pin },
      { type: "text", value: alert },
      { type: "text", value: alertType },
      { type: "text", value: alertName },
      { type: "text", value: alertDateAndTime },
      { type: "action", value: action },
    ];
  };

  const actionsData = [{ data: "Unpin", onClick: togglePin }];

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const getMD = (value) => {
    setMdValue(value)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleShowForSearch = () => {
    console.log('search', searchTerm)
    setSearchTermForTable(searchTerm)
  }

  const handleGroupSelect = (id) => {
    console.log(id)
    setSelectedGroups(id)
  }

  console.log('ref', refMetadata);

  return step1 ? (
    <MDManagerStep1 setStep1={setStep1} setStep2={setStep2} mdFile={mdFile} getMD={getMD} mdValue={mdValue} setMdValue={setMdValue} setSelectedMdId={setSelectedMdId} />
  ) : step2 ? (
    <MDManagerStep2 setStep1={setStep1} setStep3={setStep3} setStep2={setStep2} mdValue={mdValue} getMD={getMD} setMdValue={setMdValue} setSelectedMdId={setSelectedMdId} />
  ) : step3 ? (
    <MDManagerStep3 setStep2={setStep2} setStep3={setStep3} setStep4={setStep4} mdValue={mdValue} setMdValue={setMdValue} getMD={getMD} setSelectedMdId={setSelectedMdId} />
  ) : step4 ? (
    <MDManagerStep4 setStep3={setStep3} setStep4={setStep4} mdValue={mdValue} setMdValue={setMdValue} setSelectedMdId={setSelectedMdId} />
  ) : (
    <Fragment>
      <Navbar />
      <div
        className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid} ${style.margin20
          }`}
      >
        <div>
          <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
            <div>
              <Tooltip title={"Add New MD"} arrow>
                <div
                  className={`${style.addStyle} ${style.displayInRow} ${style.applicationButton} ${style.marginTop10} ${style.alignCenter} ${style.cursorPointer}`}
                  onClick={() => { setShowAddNewMedicalDirectives(true) }}
                >
                  <div className={`${style.displayInRow} ${style.alignCenter}`}>
                    <AddCircleOutlineIcon
                      sx={{ fontSize: 20, color: "white" }}
                      onClick={() => { setShowAddNewMedicalDirectives(true) }}
                    />

                    <div
                      className={`${style.alignCenter} ${style.marginLeft10}`}
                    >
                      {'Add New MD'}
                    </div>

                  </div>
                </div>
              </Tooltip>
              <div className={style.searchFieldCard}>
                <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} isOnClickAvailable={false} onClickFunc={() => { }} placeholder={"Search"} />
                <div className={`${style.spaceBetween} ${style.marginTop10} ${style.cursorPointer}`} onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
                  <div className={`${style.advancedSearchText} ${style.verticalAlignCenter}`}>Advanced Search Criteria</div>
                  <div className={style.verticalAlignCenter}>
                    {showAdvancedSearch ? (
                      <KeyboardArrowDownIcon sx={{ fontSize: '24px', color: '#06617A' }} />
                    ) : (
                      <KeyboardArrowRightIcon sx={{ fontSize: '24px', color: '#06617A' }} />
                    )}
                  </div>
                </div>
                {showAdvancedSearch && (
                  <>
                    {/* <div className={style.marginTop10}>
                    <div className={style.labelStyle}>Medical Directive ID</div>
                    <CommonInputField
                      value={mdId}
                      onChange={(e) => setMdId(e.target.value)}
                      type="text"
                      placeholder="Enter MD ID"
                    />
                  </div>
                  <div className={style.marginTop10}>
                    <div className={style.labelStyle}>Medical Directive Title</div>
                    <CommonInputField
                      value={mdTitle}
                      onChange={(e) => setMdTitle(e.target.value)}
                      type="text"
                      placeholder="Contains"
                    />
                  </div> */}
                    <div className={style.marginTop10}>
                      <div className={style.labelStyle}>Department / Division</div>
                      <CommonMultiSelectField
                        value={selectedCombinations}
                        onChange={handleChange}
                        className={style.fullWidth}
                        widthValue='250px'
                        // firstOptionLabel={'All'}
                        // firstOptionValue={''}
                        valueList={transformedOptions?.map(option => option?.value)}
                        labelList={transformedOptions?.map(option => option?.label)}
                        disabledList={transformedOptions?.map(() => false)}
                        renderValue={(selected) =>
                          selected
                            ?.map(val => {
                              const option = transformedOptions.find(o => o.value === val);
                              if (option?.type === 'department') {
                                return option.label;
                              } else if (option?.type === 'serviceArea') {
                                const serviceAreaId = val.split('|')[1];
                                const department = departmentList.find(dept =>
                                  dept.serviceAreas?.some(sa => sa.id === serviceAreaId)
                                );
                                const serviceArea = department?.serviceAreas?.find(sa => sa.id === serviceAreaId);
                                return serviceArea?.name || '';
                              }
                              return '';
                            })
                            .join(', ')
                        }
                        required={true}
                        label={'Department / Division'}
                      />
                    </div>
                    <div className={style.marginTop10}>
                      <div className={style.labelStyle}>Attestation Groups</div>
                      <CommonMultiSelectField
                        value={selectedGroups}
                        onChange={(e) => handleGroupSelect(e.target.value)}
                        className={style.fullWidth}
                        widthValue='250px'
                        // firstOptionLabel={'All'}
                        // firstOptionValue={''}
                        valueList={groupList?.map(option => option?.id)}
                        labelList={groupList?.map(option => `${option?.name}`)}
                        disabledList={groupList?.map(() => false)}
                        required={false}
                        label={'Attestation Groups'}
                      />
                    </div>
                    <div className={style.marginTop10}>
                      <CommonSelectField
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        className={style.fullWidth}
                        // firstOptionLabel={'All'}
                        // firstOptionValue={''}
                        valueList={staffList?.map(option => option?.id)}
                        labelList={staffList?.map(option => `${option?.applicant?.name?.firstName} ${option?.applicant?.name?.lastName}`)}
                        disabledList={staffList?.map(() => false)}
                        required={false}
                        label={'Author / Owner Responsible'}
                      />
                    </div>
                    <div className={style.marginTop10}>
                      <div className={style.labelStyle}>Last Published</div>
                      <div className={style.twoCol}>
                        <CommonDateField
                          className={style.fullWidth}
                          open={calendarStart}
                          onOpen={() => setCalendarStart(true)}
                          onClose={() => setCalendarStart(false)}
                          // minDate={sub(new Date(), { years: 3 })}
                          // maxDate={add(new Date(), { months: 6 })}
                          value={from}
                          onChange={(newValue) =>
                            setFrom(format(new Date(newValue), "yyyy-MM-dd"))
                          }
                          // minDate={minDate}
                          // maxDate={maxDate}
                          InputProps={{
                            style: {
                              fontSize: 14,
                              height: 30,
                            },
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              inputProps={{
                                ...params.inputProps,
                                placeholder: 'From',
                                readOnly: true
                              }}
                              fullWidth
                            />
                          )}
                        />
                        <CommonDateField
                          className={style.fullWidth}
                          open={calendarStart}
                          onOpen={() => setCalendarStart(true)}
                          onClose={() => setCalendarStart(false)}
                          // minDate={sub(new Date(), { years: 3 })}
                          // maxDate={add(new Date(), { months: 6 })}
                          value={to}
                          onChange={(newValue) =>
                            setTo(format(new Date(newValue), "yyyy-MM-dd"))
                          }
                          // minDate={minDate}
                          // maxDate={maxDate}
                          InputProps={{
                            style: {
                              fontSize: 14,
                              height: 30,
                            },
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              inputProps={{
                                ...params.inputProps,
                                placeholder: 'To',
                                readOnly: true
                              }}
                              fullWidth
                            />
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </SideBar>
        </div>
        <div>
          {selectedOption === "MANAGE MEDICAL DIRECTIVES" ? (
            <ManageMedicalDirectives getSelectedOption={getSelectedOption} setStep1={setStep1} setStep2={setStep2} setStep3={setStep3} setStep4={setStep4} setMdFile={setMdFile} advancedSearch={advancedSearch} setSelectedMdId={setSelectedMdId} showAddNewMedicalDirectives={showAddNewMedicalDirectives} setShowAddNewMedicalDirectives={setShowAddNewMedicalDirectives} />
          ) : selectedOption === "OPEN FEEDBACK TICKETS" ? (
            <FeedbackTicket getSelectedOption={getSelectedOption} />
          ) : selectedOption === "DATA UPLOADS" ? (
            <DataUpload getSelectedOption={getSelectedOption} />
          ) : selectedOption === "REFERENCE LISTS" ? (
            navigate("/referenceList")
          ) : (
            <div>
              <div className={`${style.grid4}`}>
                <Tile
                  selectedContract={selectedOption}
                  getSelectedContract={getSelectedOption}
                  tileLabel="MANAGE MEDICAL DIRECTIVES"
                  bigNumber={userMetadata?.allRegisteredUsersCount}
                  bigText="APP USERS"
                  smallNum1={0}
                  smallNum2={userMetadata?.allBlockedUsers}
                  smallText1="ON HOLD"
                  smallText2="BLOCKED"
                  currentTile="MANAGE MEDICAL DIRECTIVES"
                  topText=""
                  smallNum1Color={style.yellowSmallNumber}
                  smallNum2Color={style.redSmallNumber}
                  smallNum1SelectedColor={style.yellowSmallNumberSelected}
                  smallNum2SelectedColor={style.redSmallNumberSelected}
                />
                <Tile
                  selectedContract={selectedOption}
                  getSelectedContract={getSelectedOption}
                  tileLabel="OPEN FEEDBACK TICKETS"
                  bigNumber={feedBackTileData?.allTickets}
                  bigText="TOTAL TICKETS"
                  smallNum1={feedBackTileData?.dueDateTickets}
                  smallNum2={feedBackTileData?.highImpactTickets}
                  smallText1="PAST DUE"
                  smallText2="HIGH IMPACT"
                  currentTile="OPEN FEEDBACK TICKETS"
                  topText=""
                  smallNum1Color={style.redSmallNumber}
                  smallNum2Color={style.redSmallNumber}
                  smallNum1SelectedColor={style.redSmallNumberSelected}
                  smallNum2SelectedColor={style.redSmallNumberSelected}
                />
                <Tile
                  selectedContract={selectedOption}
                  getSelectedContract={getSelectedOption}
                  tileLabel="REFERENCE LISTS"
                  bigNumber={refMetadata?.customCount?.length || 0}
                  bigText="CUSTOM"
                  bigNumber2={refMetadata?.defaultCount?.length || 0}
                  bigText2="DEFAULT IN USE"
                  smallNum1={0}
                  smallNum2={refMetadata?.setupRequired?.length || 0}
                  smallText1="REVIEW FOR USE"
                  smallText2="SETUP REQUIRED"
                  currentTile="REFERENCE LISTS"
                  topText=""
                  smallNum1Color={style.redSmallNumber}
                  smallNum2Color={style.redSmallNumber}
                  smallNum1SelectedColor={style.redSmallNumberSelected}
                  smallNum2SelectedColor={style.redSmallNumberSelected}
                />
                <Tile
                  selectedContract={selectedOption}
                  getSelectedContract={getSelectedOption}
                  tileLabel="DATA UPLOADS"
                  bigNumber={2}
                  bigText="DEFAULT IN USE"
                  smallNum1={2}
                  smallNum2={1}
                  smallText1="FAILED TO PROCESS"
                  smallText2="FAILED RECORDS"
                  currentTile="DATA UPLOADS"
                  topText=""
                  smallNum1Color={style.redSmallNumber}
                  smallNum2Color={style.redSmallNumber}
                  smallNum1SelectedColor={style.redSmallNumberSelected}
                  smallNum2SelectedColor={style.redSmallNumberSelected}
                />
              </div>
              <div
                className={`${style.bigCardStyleWithoutHeading} ${style.marginTop20}`}
              >
                {/* <div className={style.spaceBetween}> */}
                <div className={style.buttonGroupUsers}>
                  <button
                    className={viewAlerts && style.activeButton}
                    onClick={() => setViewAlerts(true)}
                  >
                    Alerts ( 0 )
                  </button>
                  <button
                    className={!viewAlerts && style.activeButton}
                    onClick={() => setViewAlerts(false)}
                  >
                    To Do Tasks ( 0 )
                  </button>
                </div>
                {/* <SearchBar /> */}
                {/* </div> */}
                <Table
                  tableHeaderValues={
                    viewAlerts ? tableHeaderValues : toDoTableHeaderValues
                  }
                  tableDataValues={
                    viewAlerts ? getActiveFilesValues() : getToDoValues()
                  }
                  tableData={viewAlerts ? alertsData : alertsData}
                  gridStyle={viewAlerts ? style.alertsGrid : style.toDoGrid}
                  actions={viewAlerts ? actionsData : []}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default MDManager;
