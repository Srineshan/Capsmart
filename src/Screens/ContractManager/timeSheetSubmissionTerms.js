import React, { useState, useEffect, useRef } from "react";
import { EditableText } from "@blueprintjs/core";
import ArrowDown from "./../../images/arrowDown.png";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SiteDepartmentField from "../../Components/ReusableSmallComponents/siteDepartmentField";
import Typography from "@mui/material/Typography";
import { POST, GET, PUT, TenantID } from "./../dataSaver";
import ReviewerApproverField from "./reviewerApproverField";
import CommonSwitch from "../../Components/CommonFields/CommonSwitch";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import CommonInputField from "../../Components/CommonFields/CommonInputField";
import CommonCheckBox from "../../Components/CommonFields/CommonCheckBox";
import CommonLabel from "../../Components/CommonFields/CommonLabel";
import { valueCheck } from "./../../utils/valueCheck";

import style from "./index.module.scss";
import CommonSelectField from "../../Components/CommonFields/CommonSelectField";
import CommonTextField from "../../Components/CommonFields/CommonTextField";
import { InputAdornment } from "@mui/material";
import MissedMandatoryFieldAlert from "./missedMandatoryFieldAlert";

const TimeSheetSubmissionTerms = ({
  getViewPage7,
  getCurrentPage,
  contractId,
  isMultiSiteEntity,
  getShowAlert,
  isEditable,
  getTabDataStatus,
}) => {
  const [timeSheetCount, setTimeSheetCount] = useState(0);
  const [absence, setAbsence] = useState({
    id: "",
    reviewer: "",
    reviewerTitle: {},
    approver: "",
    approverTitle: {},
  });
  const [timesheetWorkFlow, setTimeSheetWorkFlow] = useState([]);
  const [showSelectBox, setShowSelectBox] = useState(false);
  const [selectBoxIndex, setSelectBoxIndex] = useState(-1);
  const [contractedTimeCommitment, setContractedTimeCommitment] =
    useState(false);
  const [contractedActivityTags, setContractedActivityTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [timeSheetLabelOne, setTimeSheetLabelOne] = useState("");
  const [servicePeriod, setServicePeriod] = useState("");
  const [contractedTimeCommitmentHour, setContractedTimeCommitmentHour] =
    useState("");
  const [
    contractedTimeCommitmentFrequency,
    setContractedTimeCommitmentFrequency,
  ] = useState("WEEK");
  const [plannedAbsence, setPlannedAbsence] = useState(0);
  const [maxUnplannedAbsence, setMaxUnplannedAbsence] = useState(0);
  const [invoiceProcessingDay, setInvoiceProcessingDay] = useState(0);
  const [invoiceProcessingDayThreshold, setInvoiceProcessingDayThreshold] =
    useState(0);
  const [invoiceProcessingDayGoal, setInvoiceProcessingDayGoal] = useState(0);
  const [
    dayLimitForSubmissionBasedOnActivityServiceDate,
    setDayLimitForSubmissionBasedOnActivityServiceDate,
  ] = useState(0);
  const [
    dayLimitForSubmissionBasedOnContractEndDate,
    setDayLimitForSubmissionBasedOnContractEndDate,
  ] = useState(0);
  const [timesheetSubmissionTerms, setTimesheetSubmissionTerms] = useState({});
  const [timesheetFields, setTimesheetFields] = useState([]);
  const [contractedServices, setContractedServices] = useState([]);
  const [maxPlannedAbsence, setMaxPlannedAbsence] = useState({
    days: 0,
    includingHoliday: false,
    notApplicable: false,
  });
  const [activityTypes, setActivityTypes] = useState([]);
  const [selectedItems, setSelectedItems] = useState();
  const limit = 3;
  const [timeSheetLabelData, setTimeSheetLabelData] = useState([]);
  const [timesheetValues, setTimesheetValues] = useState([]);
  const [timesheetActivity, setTimesheetActivity] = useState([
    {
      activityType: "",
      performingActivity: "",
    },
  ]);
  const [sites, setSites] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState();
  const [paymentSource, setPaymentSource] = useState(
    new Array(timeSheetCount || 0)
  );
  const [contractName, setContractName] = useState("");
  const [continueLoading, setContinueLoading] = useState(false);
  const [paymentSourceState, setPaymentSourceState] = useState([]);
  const [addApprover, setAddApprover] = useState(false);
  const [workFlowId, setWorkFlowId] = useState("");
  const [paymentAndCompensation, setPaymentAndCompensation] = useState();
  const [isNameEdited, setIsNameEdited] = useState(false);
  const [unassignedKeys, setUnassignedKeys] = useState([]);
  const [showSaveInProgress, setShowSaveInProgress] = useState(false);
  const contractStatus = sessionStorage.getItem("Selected Contract Status");

  const menuRef = useRef(null);
  useOptionsHide(menuRef);

  const getContractedServices = async () => {
    const { data: contractedServices } = await GET(
      `contract-managment-service/contracts/${contractId}/ContractedService`
    );
    setContractedServices(contractedServices?.contractedServices);
    setActivityTypes(
      Array.from(
        new Set(
          contractedServices?.contractedServices?.map(
            (data) => data?.activityType?.activityType
          )
        )
      )
    );
  };

  const getContractSites = async () => {
    const { data: contractData } = await GET(
      `contract-managment-service/contracts/${contractId}/contractDetail`
    );
    setSites(contractData?.contractDetail?.site?.sites);
    setContractName(contractData?.contractName?.contractName);
  };

  useEffect(() => {
    getContractedServices();
    getTimeSheetSubmissionTerms();
    getTimesheetFields();
    getContractSites();
    getTimeSheetWorkFlow();
    getAbsenceRequestWorkFlow();
    getPaymentAndCompensation();
    setPaymentSource(new Array(timeSheetCount || 0));
  }, []);

  useEffect(() => {
    getUserData();
  }, [sites]);

  useEffect(() => {
    getTimesheetFields();
    setContractedActivityTags([]);
    setTimeSheetLabelData([]);
    setPaymentSource(new Array(timeSheetCount || 0));
  }, [timeSheetCount]);

  useEffect(() => {
    formatActivities();
    getTimesheetFields();
  }, [
    contractedActivityTags?.length,
    timeSheetLabelData,
    contractedServices,
    showSelectBox,
    sites,
    timesheetSubmissionTerms,
  ]);

  useEffect(() => {
    getAbsenceRequestWorkFlow();
  }, [timesheetWorkFlow]);

  const getPaymentAndCompensation = async () => {
    const { data: paymentAndCompensation } = await GET(
      `contract-managment-service/contracts/${contractId}/paymentAndCompensation`
    );
    setPaymentAndCompensation(paymentAndCompensation);
  };

  const getTimeSheetWorkFlow = async () => {
    const { data: timesheetWorkFlow } = await GET(
      "timesheet-management-service/workflow"
    );
    if (timesheetWorkFlow) {
      setTimeSheetWorkFlow(timesheetWorkFlow);
    }
  };

  const getAbsenceRequestWorkFlow = async () => {
    try {
      const { data: absenceWorkFlow } = await GET(
        `contract-managment-service/contracts/${contractId}/absenceRequestWorkFlow`
      );
      if (absenceWorkFlow) {
        let workflowData =
          timesheetWorkFlow
            ?.filter((data) => data?.id === absenceWorkFlow?.workFlow?.id)
            ?.map((data) => data?.workFlowMap?.workflow)[0] || {};
        let workFlowValues = Object.values(workflowData);
        setAddApprover(absenceWorkFlow?.workFlowRequired);
        let reviewer = workFlowValues?.[0]?.workFlowUser?.id;
        let approver = workFlowValues?.[1]?.workFlowUser?.id;
        setAbsence({
          ...absence,
          id: absenceWorkFlow?.workFlow?.id,
          reviewer: reviewer,
          reviewerTitle: workFlowValues?.[0]?.workFlowUser?.title,
          approver: approver,
          approverTitle: workFlowValues?.[1]?.workFlowUser?.title,
        });
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const getUserData = async () => {
    let siteId = sites?.map((data) => data?.id);
    let deptId = [];
    sites?.map((data) =>
      data?.departmentList?.departments?.map((dept) => {
        deptId.push(`${data?.id}#${dept?.id}`);
      })
    );
    let encodedDept = encodeURIComponent(deptId);
    let uri = `user-management-service/user/workFlowUser?sites=${siteId}&sitedepartments=${encodedDept}&contractIdToIgnore=${contractId}`;
    const { data: userList } = await GET(uri);
    if (userList) {
      setUsers(userList);
    }
  };

  function useOptionsHide(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowSelectBox(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const handleContractedActivityTagsAdd = (type, values, i) => {
    if (values === "all" && type === "all") {
      let temp = [];
      contractedServices?.map((data) => {
        temp?.push({
          index: i,
          type: data?.activityType?.activityType,
          activity: data?.performingActivity?.activity,
        });
      });
      setContractedActivityTags(temp);
    } else if (values === "all") {
      let temp = contractedActivityTags
        ?.filter((data) => data?.type !== type)
        ?.map((data) => data);
      contractedServices
        ?.filter((data) => data?.activityType?.activityType === type)
        ?.map((data) => {
          temp?.push({
            index: i,
            type: type,
            activity: data?.performingActivity?.activity,
          });
        });
      setContractedActivityTags(temp);
    } else {
      let temp = contractedActivityTags;
      setSelectedItems(values);
      temp.push({ index: i, type: type, activity: values });
      setContractedActivityTags(temp);
    }
  };

  console.log("check check check", contractedActivityTags);

  const handleClick = (index) => {
    setSelectBoxIndex(index);
    setShowSelectBox(!showSelectBox);
  };

  const formatActivities = () => {
    let timeSheetValueData = [];
    for (let i = 0; i < timeSheetCount; i++) {
      timeSheetValueData[i] = {
        timesheetLabel: {
          label: "",
        },
        activities: [
          {
            activityType: {
              activityType: "",
            },
            performingActivity: {
              activity: "",
            },
          },
        ],
        paymentSource: {
          site: {},
        },
        servicePeriod: {
          value: "",
        },
      };
    }
    timeSheetValueData?.map((data, index) => {
      let temp = [];
      contractedActivityTags
        ?.filter((innerData) => innerData?.index === index)
        ?.map((activityData) => {
          temp.push({
            activityType: {
              activityType: activityData?.type,
            },
            performingActivity: {
              activity: activityData?.activity,
            },
          });
        });
      let tempFor1TimeSheet = [];
      contractedServices?.map((data) => {
        tempFor1TimeSheet.push({
          activityType: {
            activityType: data?.activityType?.activityType,
          },
          performingActivity: {
            activity: data?.performingActivity?.activity,
          },
        });
      });
      let value = Array.isArray(paymentSource?.[index])
        ? paymentSource?.[index]?.[0]
        : paymentSource?.[index];
      let site = value !== null ? { site: value } : undefined;
      if (timeSheetCount > 1) {
        data.activities = temp;
        data.paymentSource = site;
        data.timesheetLabel = timeSheetLabelData?.[index]?.label;
        data.servicePeriod = timeSheetLabelData?.[index]?.value;
      } else {
        data.activities = tempFor1TimeSheet;
        data.paymentSource = site;
        data.timesheetLabel = timeSheetLabelData?.[index]?.label;
        data.servicePeriod = timeSheetLabelData?.[index]?.value;
      }
    });
    setTimesheetValues(timeSheetValueData);
  };

  const handleTimesheetValue = (i, name, value) => {
    let temp = timeSheetLabelData;
    if (name === "label") {
      temp[i] = { label: value, value: temp[i]?.value };
    } else {
      temp[i] = { label: temp[i]?.label, value: value };
    }
    setTimeSheetLabelData(temp);
    formatActivities();
    getTimesheetFields();
  };

  const handleContractedActivityTagsRemove = (index, dataIndex) => {
    let temp = contractedActivityTags;
    let selectedIndexValues = temp
      ?.filter((data, indexValue) => dataIndex === data?.index)
      ?.map((data) => data);
    let afterRemoving = selectedIndexValues
      ?.filter((data, indexValue) => index !== indexValue)
      ?.map((data) => data);
    afterRemoving = afterRemoving.concat(
      contractedActivityTags
        ?.filter((data, indexValue) => dataIndex !== data?.index)
        ?.map((data) => data)
    );
    setContractedActivityTags(afterRemoving);
  };

  const isGroupChecked = (type) => {
    let originalArrayLength = contractedServices
      ?.filter((service) => service?.activityType?.activityType === type)
      ?.map((data) => data)?.length;
    let selectedArrayLength = contractedActivityTags
      ?.filter((data) => data?.type === type)
      ?.map((data) => data)?.length;
    if (originalArrayLength === selectedArrayLength) {
      return true;
    } else {
      return false;
    }
  };

  const onSelectSite = (value, index) => {
    let temp = paymentSource;
    temp[index] = value;
    setPaymentSource(temp);
    formatActivities();
    getTimesheetFields();
  };

  const getTimesheetFields = () => {
    let temp = [];
    for (let i = 0; i < timeSheetCount; i++) {
      temp[i] = (
        <div
          key={`${i}temp${timeSheetCount + 1}`}
          className={`${timeSheetCount > 1 && style.contractedBorderStyle} ${
            style.marginTop20
          }`}
        >
          <div className={`${style.extentionGrid}`}>
            <CommonLabel
              value={`Timesheets label ${i + 1} for processing`}
              className={
                dataCheck(timeSheetLabelData?.[i]?.label) ? style.redLable : ""
              }
            />
            <CommonInputField
              className={style.fullWidth}
              value={timeSheetLabelData?.[i]?.label}
              onChange={(e) => {
                handleTimesheetValue(i, "label", e.target.value);
                setIsNameEdited(true);
              }}
            />
          </div>
          {timeSheetCount > 1 && (
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              <CommonLabel
                value={`Contracted Activity to include for timesheet ${i + 1}*`}
              />
              <div>
                {
                  // <select
                  //     name="class"
                  //     id="Class"
                  //     onChange={(e) => {handleContractedActivityTagsAdd(e.target.value, i)}}
                  //     className={`${style.fullWidth} `}>
                  //     <option value="0" >
                  //         Select Contracted Services Provided
                  //     </option>
                  //     {contractedServices?.map((data, index) => (
                  //         <option value={data?.performingActivity?.activity} key={index}
                  //         disabled={contractedActivityTags?.map(data => data?.activity)?.includes(data?.performingActivity?.activity)} >
                  //             {`${data?.activityType?.activityType} - ${data?.performingActivity?.activity}`}
                  //         </option>
                  //     ))}
                  // </select>
                }
                <div
                  className={`${style.selectBoxStyle} ${style.fullWidth} ${style.verticalAlignCenter} ${style.spaceBetween}`}
                  onClick={() => handleClick(i)}
                >
                  <div></div>
                  <img
                    src={ArrowDown}
                    className={`${style.marginRight} ${style.arrowDownStyle}`}
                  />
                </div>
                {showSelectBox && i === selectBoxIndex && (
                  <div className={style.selectOptionsBox} ref={menuRef}>
                    {/* <div className={`${style.selectOptionsMenuStyle}`}>
                      <CommonCheckBox disabled={contractedServices?.length === contractedActivityTags?.length} checked={contractedServices?.length === contractedActivityTags?.length} onChange={() => handleContractedActivityTagsAdd('all', 'all', i)} label="All Activities" />
                    </div> */}
                    {activityTypes?.map((data) => (
                      <>
                        {!isGroupChecked(data) && (
                          <div>
                            <div
                              className={`${style.selectOptionsMenuStyle} ${style.selectedOptionstyle}`}
                            >
                              <CommonCheckBox
                                onChange={() =>
                                  handleContractedActivityTagsAdd(
                                    data,
                                    "all",
                                    i
                                  )
                                }
                                disabled={isGroupChecked(data)}
                                checked={isGroupChecked(data)}
                                label={data}
                              />
                            </div>
                            {contractedServices
                              ?.filter(
                                (service) =>
                                  service?.activityType?.activityType === data
                              )
                              ?.map((service) => (
                                <div
                                  className={`${style.selectOptionsMenuStyle} ${style.marginLeft30}`}
                                >
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          onChange={() =>
                                            handleContractedActivityTagsAdd(
                                              data,
                                              service?.performingActivity
                                                ?.activity,
                                              i
                                            )
                                          }
                                          disabled={contractedActivityTags
                                            ?.map((data) => data?.activity)
                                            ?.includes(
                                              service?.performingActivity
                                                ?.activity
                                            )}
                                          checked={contractedActivityTags
                                            ?.map((data) => data?.activity)
                                            ?.includes(
                                              service?.performingActivity
                                                ?.activity
                                            )}
                                        />
                                      }
                                      label={
                                        <Typography
                                          variant="body2"
                                          className={style.disabledView}
                                        >
                                          {
                                            service?.performingActivity
                                              ?.activity
                                          }
                                        </Typography>
                                      }
                                    />
                                  </FormGroup>
                                </div>
                              ))}
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                )}
                {contractedActivityTags
                  ?.filter((data, index) => data?.index === i)
                  ?.map((data) => data)?.length !== 0 && (
                  <div
                    className={`${style.siteDeptFieldCard} ${style.marginTop10}`}
                  >
                    {contractedActivityTags
                      ?.filter((data, index) => data?.index === i)
                      ?.map((data, index) => (
                        <div
                          className={`${style.deptCard} ${style.displayInRow} ${style.verticalAlignCenter} ${style.marginRight5}`}
                        >
                          <div
                            className={`${style.siteDeptTextStyle} ${style.marginLeft10}`}
                          >
                            {data?.type}-{data?.activity}
                          </div>
                          {contractStatus !== "ACTIVE" && (
                            <CloseIcon
                              fontSize="20px"
                              className={`${style.siteDeptCrossStyle} ${style.marginLeft10} ${style.cursorPointer}`}
                              onClick={() =>
                                handleContractedActivityTagsRemove(
                                  index,
                                  data?.index
                                )
                              }
                            />
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <div>
            <div
              className={`${style.extentionGrid} ${style.marginTop20}`}
              key={`sites${i}`}
            >
              <CommonLabel value="Payment Source*" />
              <SiteDepartmentField
                sites={sites}
                getSelectedSites={(value) => onSelectSite(value, i)}
                selectedSites={
                  Array.isArray(paymentSource?.[i])
                    ? paymentSource?.[i]
                    : paymentSource?.[i]
                    ? new Array(1).fill(paymentSource?.[i])
                    : []
                }
                isMultiSiteEntity={isMultiSiteEntity}
              />
            </div>
          </div>

          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value="Service log Period for timesheet submission*" />
            <CommonSelectField
              value={
                timeSheetLabelData?.[i]?.value
                  ? timeSheetLabelData?.[i]?.value
                  : ""
              }
              onChange={(e) => handleTimesheetValue(i, "value", e.target.value)}
              firstOptionLabel={""}
              firstOptionValue={""}
              valueList={[
                "ENDOFMONTH",
                "ENDOFEVERYWEEK",
                "EVERY2WEEKS",
                "EVERY4WEEKS",
                "ONDAYOFSERVICE",
              ]}
              labelList={[
                "End of the month",
                "End of Every Week",
                "Every 2 Weeks",
                "Every 4 Weeks",
                "On Day of Service",
              ]}
              disabledList={[false, false, false, false, false]}
            />
          </div>
        </div>
      );
    }
    setTimesheetFields(temp);
  };

  const getTimeSheetSubmissionTerms = async () => {
    const { data: timesheetSubmissionTerms } = await GET(
      `contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`
    );
    if (timesheetSubmissionTerms) {
      setTimesheetSubmissionTerms(timesheetSubmissionTerms);
      let labelTemp = [];
      let temp = [];
      let paymentSourceTemp = [];
      timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(
        (data, index) => {
          labelTemp.push({
            label: data?.timesheetLabel?.label,
            value: data?.servicePeriod?.value,
          });
          data?.activities?.map((activityData) => {
            temp.push({
              index: index,
              type: activityData?.activityType?.activityType,
              activity: activityData?.performingActivity?.activity,
            });
          });
          paymentSourceTemp?.push(data?.paymentSource?.site);
          setPaymentSourceState(paymentSourceTemp);
          console.log(data?.paymentSource?.site, "payment", paymentSourceTemp);
        }
      );
      setTimeSheetLabelData(labelTemp);
      setContractedActivityTags(temp);
      setPaymentSource(paymentSourceTemp);
    }
  };

  const getSelectedUserDetails = (id) => {
    let user = users?.filter((user) => user?.id === id)?.map((data) => data)[0];
    return user;
  };

  const handleTimeSheetWorkFlow = (name, reviewer, approver, activeTab) => {
    let data = {
      name: {
        name: name,
      },
      workFlowMap: {
        workflow: {
          1: {
            workFlowUser: {
              id: reviewer,
              title: {
                id: absence?.reviewerTitle?.id,
                title: absence?.reviewerTitle?.title,
              },
              name: {
                name: getSelectedUserDetails(reviewer)?.name?.firstName || "",
              },
              suffix: getSelectedUserDetails(reviewer)?.name?.suffix,
            },
            workFlowStatus: {
              status: "APPROVED",
            },
          },
        },
      },
    };
    return data;
  };

  const updateWorkflow = async (workflowId, workFlowName, type) => {
    let workFlowValue = {
      workFlow: {
        id: workflowId,
        workFlowName: {
          name: workFlowName,
        },
      },
      workFlowRequired: addApprover,
    };
    let workFlowNull = {
      workFlow: null,
      workFlowRequired: addApprover,
    };
    let workflow = addApprover ? workFlowValue : workFlowNull;
    let data = workflow;
    if (type === "AddOn") {
      await PUT(
        `contract-managment-service/contracts/${contractId}/addOnRequestWorkFlow`,
        data
      )
        .then((response) => {
          console.log("Workflow Updated Successfully");
        })
        .catch((error) => {
          ErrorToaster("Unexpected Error");
        });
    } else {
      await PUT(
        `contract-managment-service/contracts/${contractId}/absenceRequestWorkFlow`,
        data
      )
        .then((response) => {
          console.log("Workflow Updated Successfully");
        })
        .catch((error) => {
          ErrorToaster("Unexpected Error");
        });
    }
  };

  const refresh = () => {
    getTimeSheetWorkFlow();
  };

  console.log("timesheet", absence);

  const updateTimeSheetWorkflow = async (data, workFlowName, type) => {
    let id = absence?.id;
    if (addApprover) {
      if (id === "") {
        console.log("inside post id is empty");
        await POST(
          `timesheet-management-service/workflow`,
          JSON.stringify(data)
        )
          .then((response) => {
            updateWorkflow(response?.data, workFlowName, type);
          })
          .catch((error) => {
            ErrorToaster("Unexpected Error");
          });
      } else {
        console.log("inside put id has value");
        await PUT(`timesheet-management-service/workflow/${id}`, data)
          .then((response) => {
            updateWorkflow(absence.id, workFlowName, type);
            console.log("Success!");
          })
          .catch((error) => {
            ErrorToaster("Unexpected Error");
          });
      }
    } else {
      console.log("inside else");
      updateWorkflow(absence.id, workFlowName, type);
    }
    getTabDataStatus();
    refresh();
  };

  const mandatoryFieldCheck = (buttonType) => {
    if (buttonType === "SaveInProgress") {
      saveInProgresscheck();
    } else {
      handleContinue("Continue");
    }
  };

  const saveInProgresscheck = () => {
    var keys = [];

    if (valueCheck(invoiceProcessingDay)) {
      keys.push("Invoice Processing Day Range Goal");
    }

    if (valueCheck(plannedAbsence)) {
      keys.push("Planned Absence Notification Days Limit");
    }

    if (valueCheck(maxUnplannedAbsence)) {
      keys.push("Maximum Unplanned Absence Days Allowed");
    }

    if (
      !maxPlannedAbsence?.notApplicable &&
      valueCheck(maxPlannedAbsence?.days)
    ) {
      keys.push("Maximum Absence Period");
    }

    if (valueCheck(dayLimitForSubmissionBasedOnActivityServiceDate)) {
      keys.push(
        "Day Limit For Submission Of Timesheet Based On Activity Service Date"
      );
    }
    if (valueCheck(dayLimitForSubmissionBasedOnContractEndDate)) {
      keys.push(
        "Day Limit For Submission Of Timesheet Based On Contract End Date"
      );
    }

    setUnassignedKeys(keys);
    if (keys?.length !== 0) {
      setShowSaveInProgress(true);
    } else {
      handleContinue("SaveInProgress");
    }
  };

  const saveInProgressFunction = () => {
    handleContinue("SaveInProgress");
  };

  const getSaveInProgressAlert = (value) => {
    setShowSaveInProgress(value);
  };

  const handleContinue = async (buttonText) => {
    setContinueLoading(true);
    // if (absence?.reviewer === null || absence?.reviewer === '0') {
    //   ErrorToaster('Select Approver for Absence Request');
    //   return;
    // }
    let absenceData = handleTimeSheetWorkFlow(
      `Absence-${contractName}`,
      absence.reviewer,
      absence.approver,
      "requests"
    );
    await updateTimeSheetWorkflow(
      absenceData,
      `Absence-${contractName}`,
      "Absence"
    );

    let data = {
      timesheetSubmissionServicesCount: {
        count: timeSheetCount,
      },
      timesheetActivitiesPeriods: timesheetValues,
      contractorBusinessContact: {
        hours: contractedTimeCommitmentHour,
        frequency: contractedTimeCommitmentFrequency,
        contractedTimeCommitment: contractedTimeCommitment,
      },
      plannedAbsenceLimit: {
        days: plannedAbsence,
      },
      maximumAbsenceAllowed: {
        days: maxUnplannedAbsence,
      },
      maxPlannedAbsence: {
        days: maxPlannedAbsence?.days,
        holidaysIncluded: maxPlannedAbsence?.includingHoliday,
        notApplicable: maxPlannedAbsence?.notApplicable,
      },
      invoiceProcessing: {
        days: invoiceProcessingDay,
        threshold: invoiceProcessingDayThreshold,
        goal: invoiceProcessingDayGoal,
      },
      dayLimit: {
        activityServiceDate: {
          days: dayLimitForSubmissionBasedOnActivityServiceDate,
        },
        contractEndDate: {
          days: dayLimitForSubmissionBasedOnContractEndDate,
        },
      },
    };

    const response = await PUT(
      `contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`,
      JSON.stringify(data)
    );
    if (response) {
      SuccessToaster("Timesheet Submission Terms Updated Successfully");
    } else {
      ErrorToaster("Unexpected Error");
    }
    if (isNameEdited && paymentAndCompensation.timesheetPayments?.length) {
      let data = paymentAndCompensation;
      data.timesheetPayments?.map((payment, index) => {
        payment.timesheetLabel = timesheetValues?.[index].timesheetLabel;
      });

      console.log("payments data", data);

      const response = await PUT(
        `contract-managment-service/contracts/${contractId}/paymentAndCompensation`,
        JSON.stringify(data)
      );
      if (response) {
        console.log("Timesheet name updated");
      } else {
        console.log("Unexpected Error");
      }
    }
    setContinueLoading(false);
    if (buttonText !== "Continue") {
      getShowAlert(true);
    } else {
      getViewPage7(true);
      getCurrentPage("Payment & Compensation");
    }
    setUnassignedKeys([]);
  };

  useEffect(() => {
    setTimeSheetCount(
      timesheetSubmissionTerms?.timesheetSubmissionServicesCount?.count
    );
    setContractedTimeCommitment(
      timesheetSubmissionTerms?.contractorBusinessContact
        ?.contractedTimeCommitment
    );
    setContractedTimeCommitmentHour(
      timesheetSubmissionTerms?.contractorBusinessContact?.hours
    );
    setContractedTimeCommitmentFrequency(
      timesheetSubmissionTerms?.contractorBusinessContact?.frequency
    );
    setPlannedAbsence(timesheetSubmissionTerms?.plannedAbsenceLimit?.days);
    setMaxUnplannedAbsence(
      timesheetSubmissionTerms?.maximumAbsenceAllowed?.days
    );
    setMaxPlannedAbsence({
      days: timesheetSubmissionTerms?.maxPlannedAbsence?.days,
      includingHoliday:
        timesheetSubmissionTerms?.maxPlannedAbsence?.holidaysIncluded,
      notApplicable: timesheetSubmissionTerms?.maxPlannedAbsence?.notApplicable,
    });
    setInvoiceProcessingDay(timesheetSubmissionTerms?.invoiceProcessing?.days);
    setInvoiceProcessingDayThreshold(
      timesheetSubmissionTerms?.invoiceProcessing?.threshold
    );
    setInvoiceProcessingDayGoal(
      timesheetSubmissionTerms?.invoiceProcessing?.goal
    );
    setDayLimitForSubmissionBasedOnActivityServiceDate(
      timesheetSubmissionTerms?.dayLimit?.activityServiceDate?.days
    );
    setDayLimitForSubmissionBasedOnContractEndDate(
      timesheetSubmissionTerms?.dayLimit?.contractEndDate?.days
    );
    setTimesheetValues(timesheetSubmissionTerms?.timesheetActivitiesPeriods);
  }, [timesheetSubmissionTerms]);

  console.log("goal", invoiceProcessingDayGoal);

  const dataCheck = (value) => {
    if (timesheetSubmissionTerms) {
      return valueCheck(value);
    } else {
      return false;
    }
  };

  return (
    <div className={style.cloneBlockStyle}>
      <div className={`${style.newContractFromCloneBoxStyle}`}>
        <div className={`${style.extentionGrid}`}>
          <CommonLabel
            value="Number of Timesheets to Submit for Services Performed"
            className={dataCheck(timeSheetCount) ? style.redLable : ""}
          />
          <CommonInputField
            className={style.fourFieldWidth}
            type="number"
            min="0"
            value={timeSheetCount}
            onChange={(e) =>
              e.target.value <= 5 && setTimeSheetCount(parseInt(e.target.value))
            }
          />
        </div>
        <div>{timesheetFields}</div>
        {timeSheetCount <= 1 && (
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value="Contracted Activity to include for timesheet*" />
            <CommonInputField
              placeholder="All Activities"
              className={style.fullWidth}
              readOnly
            />
          </div>
        )}

        {/* <hr classname={`${style.marginTop20}`} /> */}

        <div
          className={`${style.extentionGrid} ${style.marginTop20} ${style.verticalAlignCenter}`}
        >
          <CommonLabel
            value="Invoice Processing Day Range Goal*"
            className={
              dataCheck(
                invoiceProcessingDay &&
                  invoiceProcessingDayThreshold &&
                  invoiceProcessingDayGoal
              )
                ? style.redLable
                : ""
            }
          />
          <div className={style.displayInRow}>
            {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth}`}>
              <EditableText value={invoiceProcessingDay} placeholder="0" type='number' onChange={(e) => setInvoiceProcessingDay(e.slice(0, limit))} className={style.editableTextStyleDays} />
              <div className={style.textElementWithoutBackgroundDays}>Days</div>
            </div> */}
            <div className={style.renewalWidth}>
              <CommonTextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ fontSize: 10 }}>
                      Days
                    </InputAdornment>
                  ),
                }}
                onChange={(e) =>
                  setInvoiceProcessingDay(e.target.value.slice(0, limit))
                }
                value={invoiceProcessingDay}
                type="number"
              />
            </div>
            <div
              className={`${style.displayInRow} ${style.editableTextOuterBorder}  ${style.marginLeft20} `}
            >
              <div className={style.textElementWithNurse}>Threshold</div>
              <EditableText
                value={invoiceProcessingDayThreshold}
                placeholder="0"
                type="number"
                onChange={(e) =>
                  setInvoiceProcessingDayThreshold(e.slice(0, limit))
                }
                className={style.editableTextThresholdStyle}
                disabled={contractStatus === "ACTIVE" ? true : false}
              />
            </div>
            <div
              className={`${style.displayInRow} ${style.editableTextOuterBorder}`}
            >
              <div className={style.textElementWithNurse}>Goal</div>
              <EditableText
                value={invoiceProcessingDayGoal}
                placeholder="0"
                type="number"
                onChange={(e) => setInvoiceProcessingDayGoal(e.slice(0, limit))}
                className={style.editableTextThresholdStyle}
                disabled={contractStatus === "ACTIVE" ? true : false}
              />
            </div>
          </div>
        </div>

        <hr classname={style.marginTop20} />

        <div>
          <div className={style.purpleTitle}>PLANNED ABSENCE REQUESTS</div>
          <div className={`${style.addManagerGrid}  ${style.marginTop20}`}>
            <CommonLabel
              value="Only Allow Upon Request / Notification Approval"
              className={
                addApprover && dataCheck(absence?.reviewer)
                  ? style.redLable
                  : ""
              }
            />
            <CommonSwitch
              onChange={() => {
                setAddApprover(!addApprover);
                setAbsence({
                  ...absence,
                  reviewer: "",
                  reviewerTitle: "",
                  id: "",
                });
              }}
              checked={addApprover}
            />
          </div>
          {addApprover && (
            <ReviewerApproverField
              data={users}
              label="Designate Request Approver*"
              selectLabel="Select Approver"
              onValueChange={(value, title) => {
                setAbsence({
                  ...absence,
                  reviewer: value,
                  reviewerTitle: title,
                });
              }}
              value={absence?.reviewer}
              approverReviewer="approver"
            />
          )}
        </div>

        {/* <div className={`${style.welcomeBorder} ${style.marginTop20}`}></div> */}

        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel value="Planned Absence Notification Days limit*" />
          {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth}`}>
            <EditableText value={plannedAbsence} placeholder="0" type='number' onChange={(e) => setPlannedAbsence(e.slice(0, limit))} className={style.editableTextStyleDays} />
            <div className={style.textElementWithoutBackgroundDays}>Days</div>
          </div> */}
          <div className={style.renewalWidth}>
            <CommonTextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontSize: 10 }}>
                    Days
                  </InputAdornment>
                ),
              }}
              onChange={(e) =>
                setPlannedAbsence(e.target.value.slice(0, limit))
              }
              value={plannedAbsence}
              type="number"
            />
          </div>
        </div>
        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel value="Maximum Unplanned Absence Days Allowed *" />
          {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth}`}>
            <EditableText value={maxUnplannedAbsence} placeholder="0" type='number' onChange={(e) => setMaxUnplannedAbsence(e.slice(0, limit))} className={style.editableTextStyleDays} />
            <div className={style.textElementWithoutBackgroundDays}>Days</div>
          </div> */}
          <div className={style.renewalWidth}>
            <CommonTextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontSize: 10 }}>
                    Days
                  </InputAdornment>
                ),
              }}
              onChange={(e) =>
                setMaxUnplannedAbsence(e.target.value.slice(0, limit))
              }
              value={maxUnplannedAbsence}
              type="number"
            />
          </div>
        </div>
        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel
            value="Maximum Absence Period*"
            className={
              !maxPlannedAbsence?.notApplicable &&
              dataCheck(maxPlannedAbsence?.days)
                ? style.redLable
                : ""
            }
          />
          <div className={style.displayInRow}>
            {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth}`}>
              <EditableText value={maxPlannedAbsence?.days} placeholder="0" type='number' onChange={(e) => setMaxPlannedAbsence({ ...maxPlannedAbsence, days: e.slice(0, limit) })} className={style.editableTextStyleDays} disabled={maxPlannedAbsence?.notApplicable} />
              <div className={style.textElementWithoutBackgroundDays}>Days</div>
            </div> */}
            <div className={style.renewalWidth}>
              <CommonTextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ fontSize: 10 }}>
                      Days
                    </InputAdornment>
                  ),
                }}
                onChange={(e) =>
                  setMaxPlannedAbsence({
                    ...maxPlannedAbsence,
                    days: e.target.value.slice(0, limit),
                  })
                }
                value={maxPlannedAbsence?.days}
                type="number"
              />
            </div>
            <div className={style.marginLeft20}>
              <CommonCheckBox
                value="NA"
                disabled={maxPlannedAbsence?.notApplicable}
                checked={maxPlannedAbsence?.includingHoliday}
                onChange={(e) =>
                  setMaxPlannedAbsence({
                    ...maxPlannedAbsence,
                    includingHoliday: e.target.checked,
                  })
                }
                label="Including Holidays"
              />
            </div>
            <div className={style.marginLeft20}>
              <CommonCheckBox
                value="NA"
                checked={maxPlannedAbsence?.notApplicable}
                onChange={(e) =>
                  setMaxPlannedAbsence({
                    ...maxPlannedAbsence,
                    notApplicable: e.target.checked,
                    includingHoliday: false,
                    days: 0,
                  })
                }
                label="NA"
              />
            </div>
          </div>
        </div>

        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel value="Day limit for submission of timesheet based on activity service date *" />
          {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth}`}>
            <EditableText value={dayLimitForSubmissionBasedOnActivityServiceDate} placeholder="0" type='number' min="0" onChange={(e) => setDayLimitForSubmissionBasedOnActivityServiceDate(e.slice(0, limit))} className={style.editableTextStyleDays} />
            <div className={style.textElementWithoutBackgroundDays}>Days</div>
          </div> */}
          <div className={style.renewalWidth}>
            <CommonTextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontSize: 10 }}>
                    Days
                  </InputAdornment>
                ),
              }}
              onChange={(e) =>
                setDayLimitForSubmissionBasedOnActivityServiceDate(
                  e.target.value.slice(0, limit)
                )
              }
              value={dayLimitForSubmissionBasedOnActivityServiceDate}
              type="number"
            />
          </div>
        </div>
        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel value="Day limit for submission of timesheet based on contract end date *" />
          {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth}`}>
            <EditableText value={dayLimitForSubmissionBasedOnContractEndDate} placeholder="0" type='number' min="0" onChange={(e) => setDayLimitForSubmissionBasedOnContractEndDate(e.slice(0, limit))} className={style.editableTextStyleDays} />
            <div className={style.textElementWithoutBackgroundDays}>Days</div>
          </div> */}
          <div className={style.renewalWidth}>
            <CommonTextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontSize: 10 }}>
                    Days
                  </InputAdornment>
                ),
              }}
              onChange={(e) =>
                setDayLimitForSubmissionBasedOnContractEndDate(
                  e.target.value.slice(0, limit)
                )
              }
              value={dayLimitForSubmissionBasedOnContractEndDate}
              type="number"
            />
          </div>
        </div>
      </div>
      {isEditable && (
        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
          <button
            className={`${style.newContractButtonStyle}  ${style.cursorPointer}`}
            onClick={() => {
              getCurrentPage("Contracted Services Specification");
            }}
          >
            BACK
          </button>
          <div>
            <button
              className={`${style.newContractOutlinedButton}  ${
                style.cursorPointer
              } ${continueLoading ? style.disabled : ""}`}
              onClick={
                !continueLoading
                  ? () => mandatoryFieldCheck("SaveInProgress")
                  : {}
              }
            >
              SAVE IN-PROGRESS
            </button>
            <button
              className={`${style.newContractButtonStyle}  ${
                style.cursorPointer
              } ${style.marginLeft20} ${continueLoading ? style.disabled : ""}`}
              onClick={
                !continueLoading
                  ? () => {
                      mandatoryFieldCheck("Continue");
                    }
                  : {}
              }
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
      <MissedMandatoryFieldAlert
        alert={showSaveInProgress}
        getSaveInProgressAlert={getSaveInProgressAlert}
        fieldData={unassignedKeys}
        saveInProgressFunction={saveInProgressFunction}
      />
    </div>
  );
};

export default TimeSheetSubmissionTerms;
