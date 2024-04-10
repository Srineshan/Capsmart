import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  TextArea,
  Icon,
  TagInput,
  FileInput,
  EditableText,
  Divider,
  Dialog,
  Classes,
  Intent,
  ProgressBar
} from "@blueprintjs/core";
import cloneDeep from "lodash.clonedeep";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import DatalistInput, { useComboboxControls } from "react-datalist-input";
import { GET, PUT, POST, role, TenantID } from "./../dataSaver";
import SiteDepartmentField from "../../Components/ReusableSmallComponents/siteDepartmentField";
import AddNewContractManager from "./addNewContractManager";
import {
  format,
  sub,
  add,
  getMonth,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  parseISO,
} from "date-fns";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import Tooltip from "@mui/material/Tooltip";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CommonInputField from "../../Components/CommonFields/CommonInputField";
import CommonCheckBox from "../../Components/CommonFields/CommonCheckBox";
import CommonSwitch from "../../Components/CommonFields/CommonSwitch";
import CommonDateField from "../../Components/CommonFields/CommonDateField";
import CommonTextField from "../../Components/CommonFields/CommonTextField";
import CommonLabel from "../../Components/CommonFields/CommonLabel";
import CommonSelectField from "../../Components/CommonFields/CommonSelectField";
import { checkSiteAndDepartment } from "./checkDependentData";
import ConflictPopUp from "./conflictPopUp";
import style from "./index.module.scss";
import { validateContractIDTermLimit } from "./contractValidation";
import { valueCheck } from "./../../utils/valueCheck";
import SaveInProgressAlert from "../SuperAdminDashboard/saveInProgressAlert";
import MissedMandatoryFieldAlert from "./missedMandatoryFieldAlert";

const TEXTFIELDLEN = 100;
const DESCLEN = 250;

const ContractIdTermLimitIndividual = ({
  contracts,
  getViewPage1,
  getViewPage2,
  getCurrentPage,
  contractType,
  selectedContractType,
  getContractId,
  setName,
  setFileFields,
  fileData,
  contractIdFromActive,
  method,
  isMultiSiteEntity,
  checkFieldAndPopAlert,
  getShowAlert,
  isEditable,
  getTabDataStatus,
  getPriorContractId
}) => {
  const [calendarStart, setCalendarStart] = useState(false);
  const [calendarEnd, setCalendarEnd] = useState(false);
  const [calendarEffective, setCalendarEffective] = useState(false);
  const [selectContractManager, setSelectContractManager] = useState();
  const [siteSpecific, setSiteSpecific] = useState(false);
  const [
    selectedContractContinuationPolicy,
    setSelectedContractContinuationPolicy,
  ] = useState("");
  const [item, setItem] = useState();
  const [contractData, setContractData] = useState();
  const [addNewManagerDialog, setAddNewManagerDialog] = useState(false);
  const [fullyExecutedContract, setFullyExecutedContract] = useState(false);
  const [fullyExecutedContractData, setFullyExecutedContractData] = useState(fileData);
  const [fileFieldData, setFileFieldData] = useState({ id: '', documentType: '', documentName: '', documentDescription: '', fileName: '', file: null, filePath: '' });
  const [files, setFiles] = useState([]);
  const [departmentSpecific, setDepartmentSpecific] = useState(false);
  const [contractTermPeriodFrom, setContractTermPeriodFrom] = useState(null);
  const [contractTermPeriodTo, setContractTermPeriodTo] = useState(null);
  const [contractEffectiveDate, setContractEffectiveDate] = useState(null);
  const [contractName, setContractName] = useState("");
  const [contractId, setContractId] = useState({ id: "", missing: false });
  const [contractPriorId, setContractPriorId] = useState({ id: "", na: false });
  const [user, setUsers] = useState([]);
  const [sites, setSites] = useState();
  const [selectedSites, setSelectedSites] = useState([]);
  const [methodFinal, setMethodFinal] = useState(method);
  const [autoRenewal, setAutoRenewal] = useState({
    renewalTerm: "0",
    allowableRenewalTerm: "0",
    calendar: "WEEKS",
  });
  const [renewalReminder, setRenewalreminder] = useState([{ days: 0 }]);
  const [reminderFields, setReminderFields] = useState([]);
  const [documentFields, setDocumentFields] = useState([]);
  const [userName, setUserName] = useState("");
  const [selectedDepartmentSites, setSelectedDepartmentSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [createdContractId, setCreatedContractId] =
    useState(contractIdFromActive);
  const [contractedTimeCommitment, setContractTimeCommitment] = useState({
    value: 0,
    frequency: "NA",
  });
  const [continueLoading, setContinueLoading] = useState(false);
  const [contractedServices, setContractedServices] = useState([]);
  const [isDateUpdated, setIsDateUpdated] = useState(false);
  const { setValue, value } = useComboboxControls({ initialValue: "" });
  const [compensationPolicy, setCompensationPolicy] = useState(
    "FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITH_OFFSET"
  );
  const [conflict, setConflict] = useState({ isPresent: false, data: [] });
  const [isSiteDeptUpdated, setIsSiteDeptUpdated] = useState(false);
  const [contractUsers, setContractUsers] = useState([]);
  const [isShowUploadDialog, setIsShowUploadDialog] = useState(false);
  const [validationData, setValidationData] = useState([]);
  const [unassignedKeys, setUnassignedKeys] = useState([]);
  const [showSaveInProgress, setShowSaveInProgress] = useState(false);
  const [fileItems, setFileItems] = useState([]);
  const [isAggregationNeeded, setIsAggregationNeeded] = useState(true);
  const contractStatus = sessionStorage.getItem("Selected Contract Status");
  const [buttonName, setButtonName] = useState("");
  const [existingContractId, setExistingContractId] = useState('');
  const priorContractId = sessionStorage.getItem('priorContractId')
  const methodFromSession = sessionStorage.getItem('method')
  const existingContractIdFromSession = sessionStorage.getItem('existingContractId')

  console.log(existingContractId, method, methodFinal, existingContractIdFromSession)
  useEffect(() => {
    if (methodFinal === "PUT" && createdContractId !== "") {
      getContractDetail();
      // getContractUser();
    }
    getUserData();
    getSites();
    getContractUser();
    getFileData();
  }, []);

  useEffect(() => {
    if (methodFinal === "POST" && (existingContractId !== "" && existingContractId !== null && createdContractId === "")) {
      getContractDetailFirstTime(existingContractId);
      // getContractUser();
    }
  }, [existingContractId])

  useEffect(() => {
    if (methodFromSession !== null && methodFromSession !== '' && methodFromSession !== undefined) {
      setMethodFinal(methodFromSession)
    } else {
      setMethodFinal(method)
    }
  }, [methodFromSession])

  useEffect(() => {
    setExistingContractId(existingContractIdFromSession)
  }, [existingContractIdFromSession])

  useEffect(() => {
    console.log("in useeffect above if", selectedSites, sites);
    if (
      (selectedSites === undefined || selectedSites?.length === 0) &&
      sites?.length !== 0
    ) {
      if (isMultiSiteEntity) {
        setSelectedSites([]);
        setSelectedSite("");
      } else {
        console.log("inside selectedSites", sites);
        setSelectedSites(
          sites?.filter((data, index) => index === 0)?.map((data) => data)
        );
        setSelectedSite(sites?.[0]?.id);
      }
    }
  }, [isMultiSiteEntity, sites?.length, sites]);

  useEffect(() => {
    getReminder();
  }, [renewalReminder]);

  useEffect(() => {
    getContractDetail();
    getContractId(createdContractId);
  }, [createdContractId]);

  useEffect(() => {
    setFullyExecutedContractData(fileData);
  }, [fileData]);

  useEffect(() => {
    setFileFields(fullyExecutedContractData);
    getFileData();
  }, [fullyExecutedContractData]);

  useEffect(() => {
    setSelectContractManager(
      user
        ?.filter((data) => data?.id === contractData?.contractManager?.userID)
        ?.map((data) => data)[0] || undefined
    );
  }, [user, contractData]);

  useEffect(() => {
    if (departmentSpecific) {
      let temp = [];
      const siteList = siteSpecific
        ? cloneDeep(selectedSites)
        : cloneDeep(sites);
      siteList?.map((data) => {
        data.departmentList.departments = [];
        temp.push(data);
      });
      setSelectedDepartmentSites(temp);
    } else {
      setSelectedDepartmentSites([]);
    }
  }, [selectedSites?.length, departmentSpecific, siteSpecific]);

  const getContractUser = async () => {
    console.log("Inside Contract User get");
    if (contractId !== "" && contractId !== undefined) {
      const { data: contractUserData } = await GET(
        `user-management-service/user?contractID=${contractIdFromActive}`
      );
      let contractUserId = [];
      contractUserData?.map((data) =>
        data?.contracts?.map((contract) =>
          contract?.roles?.map((role) => {
            if (role.roleName === "Activity Logger") {
              console.log("contract role is filtered");
              contractUserId.push(data?.id);
            }
          })
        )
      );
      console.log("contract User Id", contractUserId);
      if (contractUserId?.length !== 0) {
        setContractUsers(
          contractUserData
            ?.filter((data) => contractUserId?.includes(data?.id))
            ?.map((data) => data)
        );
      }
    }
  };

  console.log("contract Users", contractUsers);

  const getContractDetail = async () => {
    const { data: contractData } = await GET(
      `contract-managment-service/contracts/${createdContractId}/contractDetail`
    );
    if (contractData) {
      console.log('contractData', contractData)
      let validateTab = validateContractIDTermLimit(contractData);
      setValidationData(validateTab);
      console.log("validation Data", validationData);
      let contractDetail = contractData?.contractDetail;
      setContractData(contractData?.contractDetail);
      setName(contractData?.contractName?.contractName || "");
      setContractName(contractData?.contractName?.contractName);
      setContractId({
        id: contractDetail?.contractId?.id,
        missing: contractDetail?.contractIdMissing,
      });
      setDepartmentSpecific(contractDetail?.departmentSpecificContract);
      setSiteSpecific(contractDetail?.siteSpecificContract);
      setContractTimeCommitment(contractDetail?.timeCommitment || {});
      setFullyExecutedContract(contractDetail?.fullyExecutedContract);
      setContractPriorId({
        id: contractDetail?.priorContract?.id,
        na: contractDetail?.priorContract?.notApplicable,
      });
      setContractTermPeriodFrom(
        contractDetail?.contractTerm?.startDate !== null
          ? new Date(contractDetail?.contractTerm?.startDate?.replace("-", "/"))
          : null
      );
      setContractTermPeriodTo(
        contractDetail?.contractTerm?.endDate !== null
          ? new Date(contractDetail?.contractTerm?.endDate?.replace("-", "/"))
          : null
      );
      setContractEffectiveDate(
        contractDetail?.contractTerm?.effectiveDate !== null
          ? new Date(
            contractDetail?.contractTerm?.effectiveDate?.replace("-", "/")
          )
          : null
      );
      setSelectedContractContinuationPolicy(
        contractDetail?.continuationPolicy?.contractPolicyType
      );
      let continuation = contractDetail?.continuationPolicy?.autoRenewalPeriod;
      setAutoRenewal({
        renewalTerm: continuation?.autoRenewalTerm?.term.toString(),
        allowableRenewalTerm:
          continuation?.allowableAutoRenewalTerm?.term.toString(),
        calendar: continuation?.autoRenewalCalender,
      });
      setRenewalreminder(
        contractDetail?.continuationPolicy?.reminderList
          ?.renewalReminderList || [{ days: 0 }]
      );
      setCompensationPolicy(contractDetail?.compensationPolicy);
      // let fileData = [];
      // contractDetail?.contractFiles?.map(data => {
      //   fileData.push({ id: data?.id, documentType: data?.documentType, documentName: data?.documentName, documentDescription: data?.documentDescription, fileName: data?.fileName, file: null, filePath: data?.fileURL })
      // })
      setFullyExecutedContractData(contractDetail?.contractFiles);
      setFileFields(contractDetail?.contractFiles);
      setSelectedSites(contractDetail?.site?.sites || []);
      setIsAggregationNeeded(contractDetail?.aggregationNeeded);
      setSelectedDepartmentSites(contractDetail?.site?.sites || []);
      if (contractDetail?.priorContractRefId !== null) {
        setExistingContractId(contractDetail?.priorContractRefId?.id)
        getPriorContractId(contractDetail?.priorContractRefId?.id)
      }
      if (contractDetail?.site?.sites?.length === 0) {
        getSites();
      }
    }
  };

  const getContractDetailFirstTime = async (id) => {
    console.log('entered', existingContractId)
    const { data: contractData } = await GET(
      `contract-managment-service/contracts/${id}/contractDetail`
    );
    if (contractData) {
      let contractDetail = contractData?.contractDetail;
      setContractData(contractData?.contractDetail);
      setName(contractData?.contractName?.contractName || "");
      setContractName(contractData?.contractName?.contractName);
      if (existingContractId === null) {
        setContractId({
          id: contractDetail?.contractId?.id,
          missing: contractDetail?.contractIdMissing,
        });
        setContractTermPeriodFrom(
          contractDetail?.contractTerm?.startDate !== null
            ? new Date(contractDetail?.contractTerm?.startDate?.replace("-", "/"))
            : null
        );
        setContractTermPeriodTo(
          contractDetail?.contractTerm?.endDate !== null
            ? new Date(contractDetail?.contractTerm?.endDate?.replace("-", "/"))
            : null
        );
        setContractEffectiveDate(
          contractDetail?.contractTerm?.effectiveDate !== null
            ? new Date(
              contractDetail?.contractTerm?.effectiveDate?.replace("-", "/")
            )
            : null
        );
        setFullyExecutedContract(contractDetail?.fullyExecutedContract);
        setFullyExecutedContractData(contractDetail?.contractFiles);
        setFileFields(contractDetail?.contractFiles);
      }
      setDepartmentSpecific(contractDetail?.departmentSpecificContract);
      setSiteSpecific(contractDetail?.siteSpecificContract);
      setContractTimeCommitment(contractDetail?.timeCommitment || {});
      setContractPriorId({
        id: (priorContractId !== null || priorContractId !== '') ? priorContractId : contractDetail?.priorContract?.id,
        na: (priorContractId !== null || priorContractId !== '') ? false : contractDetail?.priorContract?.notApplicable,
      });
      setCompensationPolicy(contractDetail?.compensationPolicy);
      setSelectedContractContinuationPolicy(
        contractDetail?.continuationPolicy?.contractPolicyType
      );
      let continuation = contractDetail?.continuationPolicy?.autoRenewalPeriod;
      setAutoRenewal({ renewalTerm: continuation?.autoRenewalTerm?.term.toString(), allowableRenewalTerm: continuation?.allowableAutoRenewalTerm?.term.toString(), calendar: continuation?.autoRenewalCalender })
      setRenewalreminder(contractDetail?.continuationPolicy?.reminderList?.renewalReminderList || [{ days: 0 }]);
      // let fileData = [];
      // contractDetail?.contractFiles?.map(data => {
      //   fileData.push({ id: data?.id, documentType: data?.documentType, documentName: data?.documentName, documentDescription: data?.documentDescription, fileName: data?.fileName, file: null, filePath: data?.fileURL })
      // })
      setSiteSpecific(contractDetail?.siteSpecificContract);
      setDepartmentSpecific(contractDetail?.departmentSpecificContract);
      setSelectedSites(contractDetail?.site?.sites || []);
      setSelectedDepartmentSites(contractDetail?.site?.sites || []);
      setIsAggregationNeeded(contractDetail?.aggregationNeeded);
      if (contractDetail?.site?.sites?.length === 0) {
        getSites();
      }
    }
  };

  const getUserData = async () => {
    const { data: user } = await GET(
      "user-management-service/user/role?role=Contract Manager"
    );
    if (user) {
      setUsers(user);
    }
  };

  const getSites = async () => {
    const { data: sitesList } = await GET("entity-service/sites");
    setSites(sitesList);
  };
  const getAddNewManagerDialog = (value) => {
    setAddNewManagerDialog(value);
  };

  const handleFileUpload = (e) => {
    console.log('file data', e.target.files);
    if (fileData?.filter(data => data?.fileName === e.target.files?.[0]?.name || e.target.files?.[0]?.name === '')?.length !== 0) {
      setIsShowUploadDialog(false);
      ErrorToaster('File already exist from previous upload in this contract');
      return;
    } else {
      if (e.target.files?.[0]?.name) {
        setIsShowUploadDialog(true);
        setFileFieldData({ ...fileFieldData, file: e.target.files[0], fileName: e.target.files?.[0]?.name });
      }
    }
  }

  console.log("sites", sites, selectedSites, selectedDepartmentSites);

  const getSiteData = () => {
    let siteData = [];
    if (!siteSpecific && !departmentSpecific) {
      siteData = sites;
    } else if (siteSpecific && !departmentSpecific) {
      siteData = selectedSites;
    } else {
      siteData =
        selectedDepartmentSites?.length !== 0
          ? selectedDepartmentSites
          : selectedSites;
    }
    return siteData;
  };

  const checkAndUpdateDate = async (buttonType) => {
    setContinueLoading(true);
    if (isDateUpdated) {
      let temp = contractedServices;
      if (contractedServices?.length !== 0 && contractedServices) {
        temp
          ?.filter((data) => data?.contractedSchedules?.length === 1)
          ?.map((data) => {
            data.contractedSchedules[0].startDate = format(
              contractEffectiveDate,
              "yyyy-MM-dd"
            ).toString();
            data.contractedSchedules[0].endDate = format(
              contractTermPeriodTo,
              "yyyy-MM-dd"
            ).toString();
            data.scheduledPatientsTargets[0].startDate = format(
              contractEffectiveDate,
              "yyyy-MM-dd"
            ).toString();
            data.scheduledPatientsTargets[0].endDate = format(
              contractTermPeriodTo,
              "yyyy-MM-dd"
            ).toString();
            data.patientsSeenTargets[0].startDate = format(
              contractEffectiveDate,
              "yyyy-MM-dd"
            ).toString();
            data.patientsSeenTargets[0].endDate = format(
              contractTermPeriodTo,
              "yyyy-MM-dd"
            ).toString();
          });
        let data = {
          contractedServices: temp,
        };
        const response = await PUT(
          `contract-managment-service/contracts/${contractIdFromActive}/ContractedService`,
          JSON.stringify(data)
        );
        if (response) {
          SuccessToaster("Contracted Service Updated Successfully");
        } else {
          ErrorToaster("Unexpected Error");
        }
      }
    }

    if (buttonType === "SaveInProgress" || buttonType === "Continue") {
      saveInProgresscheck(buttonType);
      setButtonName(buttonType)
    }
  };

  console.log(contractTermPeriodFrom)

  const saveInProgresscheck = (buttonType) => {
    var keys = [];

    if (contractId?.id === "" && contractId.missing === false) {
      keys.push("Enter Contract ID / Resolution No");
    }
    if (contractData?.contractManager?.name?.firstName === "") {
      keys.push("Assigned Contract Manager");
    }
    if (contractTermPeriodFrom === null || contractTermPeriodTo === null) {
      keys.push("Contract Term Period");
    }
    if (contractedTimeCommitment?.value === "") {
      keys.push("Contract Time Commitment");
    }
    if (contractedTimeCommitment?.frequency === "NA" || contractedTimeCommitment?.frequency === "Select...") {
      keys.push("Contract Time Frequency");
    }
    if (valueCheck(selectedContractContinuationPolicy)) {
      keys.push("Contract Continuation Policy");
    }
    if (valueCheck(compensationPolicy)) {
      keys.push("Compensation Policy To Apply");
    }
    if (fullyExecutedContract === true && fullyExecutedContractData?.length === 0) {
      keys.push("Contract Documents On File");
    }
    if (departmentSpecific === true && selectedDepartmentSites?.[0]?.departmentList.departments?.length === 0) {
      keys.push("Department Specific Contract");
    }

    setUnassignedKeys(keys);
    if (keys?.length !== 0) {
      setShowSaveInProgress(true);
      setContinueLoading(true)
    } else {
      addContract(buttonType);
    }
  };

  const saveInProgressFunction = (type) => {
    addContract(type);
    setShowSaveInProgress(false)
  };

  const getSaveInProgressAlert = (value) => {
    setShowSaveInProgress(value);
    setContinueLoading(value)
  };

  console.log('selectedContractType', selectedContractType)

  const addContract = async (buttonText) => {
    let sites = getSiteData();
    // let conflictedData = checkSiteAndDepartment(contracts, sites, contractIdFromActive);
    // if (conflictedData?.length !== 0) {
    //   setConflict({ isPresent: true, conflict: conflictedData });
    // }
    // if (conflictedData?.length === 0) {
    setContinueLoading(true);
    if (contractName === "") {
      ErrorToaster("Enter Contract Name to proceed");
      setContinueLoading(false);
      return;
    }
    if (contractId?.id === "" && contractId.missing === false) {
      ErrorToaster("Enter Contract ID / Resolution No");
      setContinueLoading(false);
      return;
    }
    if (compensationPolicy === "") {
      ErrorToaster("Select a Compensation Policy to proceed");
      setContinueLoading(false);
      return;
    }
    if (
      departmentSpecific &&
      sites?.some((data) => data?.departmentList?.departments?.length === 0)
    ) {
      ErrorToaster("Select Departments for all the selected Sites");
      setContinueLoading(false);
      return;
    }
    if (selectContractManager === null || selectContractManager === undefined) {
      ErrorToaster("Select Contract Manager");
      setContinueLoading(false);
      return;
    }
    if (fullyExecutedContract && fullyExecutedContractData?.filter(data => data?.file !== null)?.map(data => data)?.length === 0) {
      ErrorToaster("Upload Contract File");
      setContinueLoading(false);
      return;
    }
    if (contractedTimeCommitment?.value === 0 && contractedTimeCommitment?.frequency !== "NA") {
      ErrorToaster("Enter Contract Time Commitment");
      setContinueLoading(false);
      return;
    }
    // let contractFiles = [];
    // fullyExecutedContract && fullyExecutedContractData?.filter(data => data?.file !== null)?.map(data => {
    //   contractFiles?.push({
    //     fileName: data.fileName,
    //     documentType: data.documentType,
    //     documentDescription: data.documentDescription,
    //     documentName: data.documentName,
    //   })
    // })

    let data = {
      ...(createdContractId !== "" &&
        methodFinal !== "POST" && { id: createdContractId }),
      contractName: {
        contractName: contractName,
      },
      contractType: contractType?.value,
      contractTypeId: contractType?.id,
      contractStatus: "DRAFT",
      contractDetail: {
        contractId: {
          id: contractId?.id,
        },
        priorContract: {
          id: contractPriorId?.id,
          notApplicable: contractPriorId?.na,
        },
        priorContractRefId: existingContractId !== null ? {
          id: existingContractId
        } : null,
        contractManager: {
          userID: selectContractManager?.id,
          name: {
            firstName: selectContractManager?.name?.firstName,
            lastName: selectContractManager?.name?.lastName,
          },
          email: {
            officialEmail: selectContractManager?.email?.officialEmail,
          },
        },
        "contractFiles": fullyExecutedContractData,
        "site": {
          "sites": sites
        },
        contractTerm: {
          startDate:
            contractTermPeriodFrom === null
              ? null
              : format(contractTermPeriodFrom, "yyyy-MM-dd").toString(),
          endDate:
            contractTermPeriodTo === null
              ? null
              : format(contractTermPeriodTo, "yyyy-MM-dd").toString(),
          effectiveDate:
            contractEffectiveDate === null
              ? null
              : format(contractEffectiveDate, "yyyy-MM-dd").toString(),
        },
        compensationPolicy: compensationPolicy,
        ...(selectedContractContinuationPolicy !== "" && {
          continuationPolicy: {
            contractPolicyType: selectedContractContinuationPolicy,
            autoRenewalPeriod: {
              ...(parseInt(autoRenewal.renewalTerm) && {
                autoRenewalTerm: {
                  term:
                    selectedContractContinuationPolicy === "AUTORENEWAL"
                      ? parseInt(autoRenewal.renewalTerm)
                      : 0,
                },
              }),
              ...(parseInt(autoRenewal.allowableRenewalTerm) && {
                allowableAutoRenewalTerm: {
                  term:
                    selectedContractContinuationPolicy === "AUTORENEWAL"
                      ? parseInt(autoRenewal.allowableRenewalTerm)
                      : 0,
                },
              }),
              ...(autoRenewal.calendar !== "" && {
                autoRenewalCalender:
                  selectedContractContinuationPolicy === "AUTORENEWAL"
                    ? autoRenewal.calendar
                    : "WEEKS",
              }),
            },
            reminderList: {
              renewalReminderList: renewalReminder,
            },
          },
        }),
        timeCommitment: {
          value: parseInt(contractedTimeCommitment?.value),
          frequency: contractedTimeCommitment?.frequency,
        },
        contractIdMissing: contractId?.missing,
        fullyExecutedContract: fullyExecutedContract,
        siteSpecificContract: siteSpecific,
        departmentSpecificContract: departmentSpecific,
        aggregationNeeded: isAggregationNeeded,
      },
      newContract: selectedContractType === "New Contract" ? true : false,
    };

    if (methodFinal === 'POST' && contractIdFromActive === '') {
      await POST('contract-managment-service/contracts/contractDetail', data)
        .then(response => {
          sessionStorage.removeItem('existingContractId')
          sessionStorage.removeItem('priorContractId')
          getPriorContractId(data?.contractDetail?.priorContractRefId !== null ? data?.contractDetail?.priorContractRefId?.id : null)
          getContractId(response?.data);
          getContractDetailFirstTime(response?.data);
          SuccessToaster("Contract Draft Saved Successfully");
        })
        .catch((error) => {
          ErrorToaster("Unexpected Error Creating Contract");
        });
    } else {
      await PUT(`contract-managment-service/contracts/${contractIdFromActive}/contractDetail`, data)
        .then(response => {
          getContractDetail();
          SuccessToaster("Contract Updated Successfully");
        })
        .catch((error) => {
          ErrorToaster("Unexpected Error Updating Contract");
        });
    }
    setContinueLoading(false);

    if (buttonText === "Continue") {
      getViewPage2(true);
      getViewPage1(false);
      getCurrentPage("Contracted Services Provider(s)");
    } else {
      getShowAlert(true);
    }
    setUnassignedKeys([]);

    if (isSiteDeptUpdated) {
      let modifiedContractUser = contractUsers;
      modifiedContractUser?.map((data) => {
        data?.contracts?.map((contract) => {
          if (contract?.id === contractIdFromActive) {
            contract.sites = { sites: sites };
          }
        });
        data.sites = { sites: sites };
        console.log('modified sites', sites)
      })
      console.log('modifiedContractUser', modifiedContractUser);
      await PUT('user-management-service/user/bulk', JSON.stringify(modifiedContractUser))
        .then(response => {
          SuccessToaster('User Updated Successfully');
        })
        .catch((error) => {
          ErrorToaster("Unexpected Error");
        });
    }
    getTabDataStatus();
    // }
  };

  const onSelect = (selectedItem) => {
    setSelectContractManager(selectedItem);
  };

  const onSelectSite = (selectedItem) => {
    console.log(selectedSites, selectedItem, "site");
    setItem(selectedItem);
    let temp = selectedSites || [];
    if (
      selectedSites
        ?.filter((data) => data?.id === selectedItem?.id)
        ?.map((data) => data)?.length === 0
    ) {
      temp.push(selectedItem);
    }
    setSelectedSites(temp);
    setDepartmentSpecific(false);
    siteFieldCheck(siteSpecific);
    setIsSiteDeptUpdated(true);
    setValue("");
  };

  const onSelectContractId = (selectedItem) => {
    setContractPriorId({
      ...contractPriorId,
      id: selectedItem?.contractDetails?.contractId?.id,
      na: false,
    });
  };

  const handleTagsRemove = (tags, index) => {
    let siteId = selectedSites
      ?.filter((data, indexVal) => index === indexVal)
      ?.map((data) => data?.id)[0];
    setSelectedSites(
      selectedSites
        ?.filter((data, indexValue) => index !== indexValue)
        ?.map((data) => data)
    );
    setDepartmentSpecific(false);
    setIsSiteDeptUpdated(true);
  };

  const items = useMemo(
    () =>
      user.map((option) => ({
        userId: option?.id,
        value: `${option.name.firstName} ${option.name.lastName}`,
        ...option,
      })),
    [user]
  );

  const siteItems = useMemo(
    () =>
      sites?.map((option) => ({
        id: option?.id,
        value: option?.siteName?.siteName,
        ...option,
      })),
    [sites]
  );

  const priorContractItems = useMemo(
    () =>
      contracts
        ?.filter((data) => data?.contractDetail?.contractId !== null)
        ?.map((option) => ({
          id: option?.contractDetail?.contractId?.id,
          value: option?.contractDetail?.contractId?.id,
          ...option,
        })),
    [contracts]
  );

  const addReminder = () => {
    let temp = renewalReminder;
    temp.push({ days: 0 });
    setRenewalreminder(temp);
    getReminder();
  };

  const removeReminder = (index) => {
    setRenewalreminder(
      renewalReminder
        ?.filter((data, indexValue) => index !== indexValue)
        ?.map((data) => data)
    );
  };

  const handleReminder = (e, i) => {
    console.log("value of e ", e, typeof parseInt(e), parseInt(e) <= 999);
    let temp = renewalReminder;
    temp[i] = { days: parseInt(e) };
    setRenewalreminder(temp);
    getReminder();
  };

  const handleFileChange = (e, name) => {
    setFileFieldData({ ...fileFieldData, [name]: e.target.value });
  };

  const getReminder = () => {
    let temp = [];
    for (let i = 0; i < renewalReminder?.length; i++) {
      temp[i] = (
        <div
          className={`${style.renewalRemainderBoxGrid} ${style.marginBottom}`}
          key={i}
        >
          <div className={style.verticalAlignCenter}>Set Renewal Reminder*</div>
          {/* <div className={style.displayInRow}>
            <EditableText className={style.inputRenewalRemainderStyle} defaultValue={renewalReminder?.[i]?.days} placeholder="" onChange={(e) => handleReminder(e, i)} key={`days${i}${renewalReminder?.[i]?.days}`} />
            <div className={`${style.marginTop10} ${style.marginLeft20}`}>Days</div>
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
              onChange={(e) => {
                handleReminder(e.target.value.slice(0, 3), i);
              }}
              key={i}
              value={
                renewalReminder?.[i]?.days ? renewalReminder?.[i]?.days : 0
              }
            // maxLength={2}
            // type="number"
            />
          </div>
          <div className={style.verticalAlignCenter}>
            {renewalReminder?.length !== 1 && contractStatus !== "ACTIVE" && (
              <Icon
                icon="cross"
                color="#a0a5ab"
                onClick={() => removeReminder(i)}
              />
            )}
          </div>
        </div>
      );
    }
    setReminderFields(temp);
  };

  const getFileData = () => {
    let temp = [];
    console.log("entered", fullyExecutedContractData);
    for (let i = 0; i < fullyExecutedContractData?.length || 0; i++) {
      temp[i] = (
        <div className={`${style.documentCard} ${style.marginTop10}`} key={i}>
          <div className={`${style.documentGrid}`}>
            <a href={fullyExecutedContractData?.[i]?.fileURL} target="_blank">
              <Tooltip title={'Preview'} arrow>
                <ArticleOutlinedIcon sx={{ color: '#b0a9ef', fontSize: 35 }} />
              </Tooltip>
            </a>
            <div className={style.marginTop}>
              <p className={`${style.documentTextActive} ${style.leftAlign} ${style.removeUnderline}`} ><strong>{fullyExecutedContractData?.[i]?.documentType}</strong></p>
              <p className={`${style.documentTextActive} ${style.leftAlign}`}><strong>{fullyExecutedContractData?.[i]?.fileName}</strong></p>
            </div>
          </div>
        </div>
      );
    }
    setFileItems(temp);
  };

  const addNewDocumentField = async () => {
    console.log(fileFieldData, fileFieldData?.file?.type)
    setContinueLoading(true);
    changeContractFile(true);
    let temp = fullyExecutedContractData;
    temp.push(fileFieldData);
    let contractFiles = [];
    temp?.filter(data => data?.file !== null)?.map(data => {
      contractFiles?.push(data)
    })
    const formData = new FormData();
    let file = temp?.map(data => data.file);
    console.log(contractFiles)
    formData.append('contractFiles', new Blob([JSON.stringify(contractFiles)], {
      type: "application/json"
    }));
    formData.append('documents', fileFieldData?.file, { filename: fileFieldData?.file?.name, type: 'inline' });
    await POST(`contract-managment-service/contracts/contractFile`, formData)
      .then(response => {
        SuccessToaster('File Uploaded Successfully');
        setFullyExecutedContractData(response?.data);
        console.log(response?.data)
        setFileFieldData({ id: '', documentType: '', documentName: '', documentDescription: '', fileName: '', file: null, filePath: '' });
      })
      .catch(error => {
        ErrorToaster('File Upload Failed');
        setContinueLoading(false);
      })
    setContinueLoading(false);
    setIsShowUploadDialog(false)
  }

  const onSelectDepartment = (data) => {
    setSelectedDepartmentSites(data);
    setIsSiteDeptUpdated(true);
  };

  const leftElement = () => {
    return (
      <div>
        <label for="file-upload" className={style.customFileUpload}>
          Choose File
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*, .pdf"
          onChange={(e) => handleFileUpload(e)}
        />
      </div>
    );
  };

  const disableFileAddButton = () => {
    if (fileFieldData?.documentType !== '' && fileFieldData?.documentName !== '' && fileFieldData?.file !== null) {
      return false;
    } else {
      return true;
    }
  };

  const handleDepartmentSpecific = () => {
    setDepartmentSpecific(!departmentSpecific);
  };

  const siteFieldCheck = (value) => {
    checkFieldAndPopAlert(
      value ? selectedSites?.length : true,
      "Site Specific Contract"
    );
  };

  const deptFieldCheck = (value) => {
    checkFieldAndPopAlert(
      value
        ? sites
          ?.filter((data) => data?.departmentList?.departments?.length !== 0)
          ?.map((data) => data)?.length
        : true,
      "Department Specific Contract"
    );
  };

  const changeContractFile = (value) => {
    if (fullyExecutedContractData?.length === 0 || value) {
      setFullyExecutedContract(value);
    }
  };

  const getContractedServices = async () => {
    const { data: contractedServices } = await GET(
      `contract-managment-service/contracts/${contractIdFromActive}/ContractedService`
    );
    setContractedServices(contractedServices?.contractedServices);
  };

  function getMonthDifference(startDate, endDate) {
    return (
      endDate?.getMonth() -
      startDate?.getMonth() +
      12 * (endDate?.getFullYear() - startDate?.getFullYear())
    );
  }

  const dataCheck = (value) => {
    console.log("method", method, methodFinal);
    if (createdContractId !== "") {
      return valueCheck(value);
    } else {
      return false;
    }
  };

  const updateConflict = (value) => {
    setConflict({ ...conflict, isPresent: value, data: [] });
  };

  console.log("Conflict", conflict);
  console.log(selectedSites)

  return (
    <div className={style.cloneBlockStyle}>
      <div className={`${style.newContractFromCloneBoxStyle}`}>
        <div className={`${style.extentionGrid}`}>
          <CommonLabel
            value="Contract / Agreement Name*"
            className={dataCheck(contractName) ? style.redLable : ""}
          />
          <CommonInputField
            placeholder="Contract Name"
            className={`${style.fullWidth}`}
            value={contractName}
            maxLength={TEXTFIELDLEN}
            onChange={(e) => {
              setContractName(e.target.value);
              setName(e.target.value);
            }}
            onFocus={() => {
              checkFieldAndPopAlert(contractName, "Contract / Agreement Name");
            }}
          />
        </div>
        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel
            value="Contract ID / Resolution No*"
            className={dataCheck(contractId?.id) && contractId.missing === false ? style.redLable : ""}
          />
          <div className={style.displayInRow}>
            <CommonInputField
              placeholder="Contract ID / Resolution No"
              value={contractId.id}
              disabled={contractId.missing}
              maxLength={TEXTFIELDLEN}
              onFocus={() => {
                checkFieldAndPopAlert(contractId?.id, "Contract ID");
              }}
              className={`${style.entityFieldWidth}`}
              onChange={(e) =>
                setContractId({
                  ...contractId,
                  id: e.target.value,
                  missing: false,
                })
              }
            />
            <CommonCheckBox
              label="Missing"
              checked={contractId.missing}
              onChange={(e) => {
                setContractId({
                  ...contractId,
                  missing: e.target.checked,
                  id: "",
                });
              }}
              className={` ${style.marginLeft20}`}
            />
          </div>
        </div>
        {selectedContractType !== "New Contract" && (
          <div
            className={
              contracts?.length !== 0
                ? `${style.extentionGrid} ${style.marginTop20}`
                : `${style.extentionGrid} ${style.marginTop20} ${style.disabledView} `
            }
          >
            <CommonLabel value="Prior Contract ID*" />
            <div className={style.displayInRow}>
              <DatalistInput
                items={priorContractItems || []}
                onSelect={onSelectContractId}
                className={style.selectFieldWidth}
                maxLength={TEXTFIELDLEN}
                inputProps={{
                  disabled: contractStatus === "ACTIVE" ? true : false,
                }}
                onChange={(e) =>
                  setContractPriorId({ ...contractPriorId, id: e.target.value })
                }
                placeholder="Search by CID / Name"
                value={contractPriorId?.id}
              />
              <CommonCheckBox
                label="NA"
                checked={contractPriorId.na}
                onChange={(e) =>
                  setContractPriorId({
                    ...contractPriorId,
                    id: "",
                    na: e.target.checked,
                  })
                }
                className={` ${style.marginLeft20}`}
                disabled={contractStatus === "DRAFT" ? false : true}
              />
            </div>
          </div>
        )}
        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel value="Assigned Contract Manager*" />
          <div className={style.displayInRow}>
            <div className={style.fullWidth}>
              <DatalistInput
                items={items || []}
                onSelect={onSelect}
                onChange={(e) => setUserName(e.target.value)}
                className={style.selectAssignedContractFieldWidth}
                maxLength={TEXTFIELDLEN}
                inputProps={{
                  disabled: contractStatus === "ACTIVE" ? true : false,
                }}
                value={`${contractData?.contractManager?.name?.firstName || ""
                  } ${contractData?.contractManager?.name?.lastName || ""}`}
                onFocus={() => {
                  checkFieldAndPopAlert(
                    selectContractManager,
                    "Assigned Contract Manager"
                  );
                }}
              />
              {!items
                ?.map((data) => data?.name?.firstName)
                ?.includes(userName) &&
                userName !== "" && (
                  <div
                    className={`${style.addBoxDescription} ${style.marginTop}`}
                  >
                    The Contract Manager you are trying to add is not a
                    registered user. To add a new contract manager click on the
                    "ADD" button.
                  </div>
                )}
            </div>
            <button
              className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor
                } ${style.cursorPointer} ${(items
                  ?.map((data) => data?.name?.firstName)
                  ?.includes(userName) ||
                  userName === "") &&
                style.disabledUploadButton
                }`}
              disabled={
                items
                  ?.map((data) => data?.name?.firstName)
                  ?.includes(userName) || userName === ""
              }
              onClick={() => setAddNewManagerDialog(true)}
            >
              ADD
            </button>
          </div>
        </div>

        {
          //// Contract Access Previlege Field DO NOT DELETE THIS ////
          // <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          //   <div className={style.extentionLableStyle}>Contract Access Privilege To Other Contract Manager</div>
          //   <div className={style.verticalAlignCenter}>
          //     <ThemeProvider theme={switchTheme}>
          //   <FormControlLabel
          //     control={
          //       <Switch checked={contractAccessPrivilege} className={`${style.floatLeft}`} onChange={() => { setContractAccessPrivilege(!contractAccessPrivilege) }} />
          //     }
          //     color='primary'
          //     className={`${style.switchFontStyle} ${style.marginTop} ${style.flexLeft}`}
          //     label={contractAccessPrivilege ? 'YES' : "NO"}
          //   />
          // </ThemeProvider>
          //     {contractAccessPrivilege ? (
          //       <LockOpenOutlinedIcon className={style.lockStyle} style={{ color: '#14B15A' }} />
          //     ) : (
          //       <LockOutlinedIcon className={style.lockStyle} style={{ color: '#F94848' }} />
          //     )}
          //   </div>
          // </div>
        }

        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel value="Contract Documents On File*"
            className={dataCheck(fullyExecutedContractData?.length) && fullyExecutedContract === true ? style.redLable : ""}
          />
          {contractStatus === "ACTIVE" && fileItems?.length !== 0 ?
            <div> {fileItems}</div>
            : (
              <div
                onFocus={() => {
                  checkFieldAndPopAlert(
                    fullyExecutedContractData?.length,
                    "Fully Executed Contract on File"
                  );
                }}
              >
                <div className={`${style.spaceBetween}`}>
                  <CommonSwitch
                    checked={fullyExecutedContract}
                    className={`${style.switchFontStyle} ${style.flexLeft}`}
                    label={fullyExecutedContract ? "YES" : "NO"}
                    onChange={() => changeContractFile(!fullyExecutedContract)}
                  />
                  <div>
                    <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} ${(!fullyExecutedContract) && style.disabledUploadButton}`} disabled={!fullyExecutedContract}>
                      <label for="file-upload" className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}  ${contractStatus === "ACTIVE" || !fullyExecutedContract ? style.disabledUploadButton : ''}  ${continueLoading ? style.disabledUploadButton : ''}`}>
                        Upload File
                      </label>
                    </button>
                    <input id="file-upload" type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx" onChange={(e) => { handleFileUpload(e); }} disabled={(contractStatus === "ACTIVE" || !fullyExecutedContract) ? true : false} />
                  </div>
                </div>
              </div>
            )}
        </div>
        {isMultiSiteEntity && (
          <div
            className={`${style.extentionGrid} ${style.marginTop20}`}
            onFocus={() => siteFieldCheck(siteSpecific)}
          >
            <CommonLabel value="Site Specific Contract*" />
            <div>
              <div className={style.displayInRow}>
                <CommonSwitch
                  checked={siteSpecific}
                  className={`${style.textAlignLeft} ${style.switchFontStyle}`}
                  label={siteSpecific ? "YES" : "NO"}
                  onChange={() => {
                    setSiteSpecific(!siteSpecific);
                    siteFieldCheck(!siteSpecific);
                    setIsSiteDeptUpdated(true);
                  }}
                />
                {siteSpecific && (
                  <div className={style.displayInRow}>
                    <DatalistInput
                      value={value}
                      setValue={setValue}
                      items={siteItems || []}
                      placeholder="Select Sites"
                      onSelect={onSelectSite}
                      className={`${style.selectFieldSwitchWidth} ${style.marginLeft20}`}
                      inputProps={{
                        disabled: contractStatus === "ACTIVE" ? true : false,
                      }}
                    />
                    {
                      // <div className={`${style.addSymbolStyle} ${style.marginLeft20}`} onClick={()=>{setSelectedSites([...selectedSites,])}}><span className={style.plusSymbolPosition}>+</span></div>
                    }
                  </div>
                )}
              </div>
              {siteSpecific && (
                <TagInput
                  placeholder="Selected Sites"
                  values={
                    selectedSites?.map((data) => data?.siteName?.siteName) || []
                  }
                  className={`${style.marginTop20}`}
                  onRemove={handleTagsRemove}
                  separator={/[\s,]/}
                  addOnBlur={true}
                  addOnPaste={true}
                />
              )}
            </div>
          </div>
        )}

        <div
          className={`${style.extentionGrid} ${style.marginTop20}`}
          onFocus={() => {
            deptFieldCheck(departmentSpecific);
          }}
        >
          <CommonLabel value="Department Specific Contract*"
            className={departmentSpecific === true && selectedDepartmentSites?.[0]?.departmentList.departments?.length === 0
              ? style.redLable : ""}
          />
          <CommonSwitch
            checked={departmentSpecific}
            className={` ${style.textAlignLeft} ${style.switchFontStyle}`}
            label={departmentSpecific ? "YES" : "NO"}
            onChange={() => {
              handleDepartmentSpecific();
              deptFieldCheck(!departmentSpecific);
              setIsSiteDeptUpdated(true);
            }}
          />
        </div>

        {departmentSpecific && (
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div></div>
            <SiteDepartmentField
              sites={sites}
              getSelectedSites={onSelectDepartment}
              selectedSites={selectedSites}
              isMultiSiteEntity={isMultiSiteEntity}
            />
          </div>
        )}

        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel
            value="Contract Term Period*"
            className={
              dataCheck(contractTermPeriodFrom && contractTermPeriodTo)
                ? style.redLable
                : ""
            }
          />
          <div className={style.termPeriodGrid}>
            <div
              onFocus={() => {
                checkFieldAndPopAlert(
                  contractTermPeriodFrom,
                  "Contract Term Period Start Date"
                );
              }}
              className={style.leftAlign}
            >
              <CommonDateField
                open={calendarStart}
                onOpen={() => setCalendarStart(true)}
                onClose={() => setCalendarStart(false)}
                minDate={sub(new Date(), { years: 3 })}
                maxDate={add(new Date(), { months: 6 })}
                value={contractTermPeriodFrom}
                onChange={(newValue) => {
                  // setCalendarStart(true);
                  setIsDateUpdated(true);
                  getContractedServices();
                  setContractTermPeriodFrom(newValue);
                  setContractEffectiveDate(newValue);
                }}
                InputProps={{
                  style: {
                    fontSize: 14,
                    height: 30,
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // onClick={() => setCalendarStart(true)}
                    inputProps={{
                      ...params.inputProps,
                      placeholder: "Start Date",
                    }}
                  />
                )}
              />
            </div>
            <p className={`${style.toStyle} ${style.alignCenter}`}>To</p>
            <div
              onFocus={() => {
                checkFieldAndPopAlert(
                  contractTermPeriodTo,
                  "Contract Term Period End Date"
                );
              }}
              className={style.rightAlign}
            >
              <CommonDateField
                open={calendarEnd}
                onOpen={() => setCalendarEnd(true)}
                onClose={() => setCalendarEnd(false)}
                value={contractTermPeriodTo}
                onChange={(newValue) => {
                  setIsDateUpdated(true);
                  setContractTermPeriodTo(newValue);
                  getContractedServices();
                }}
                InputProps={{
                  style: {
                    fontSize: 14,
                    height: 30,
                  },
                }}
                minDate={contractTermPeriodFrom}
                maxDate={add(new Date(), { years: 5 })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    //  onClick={() => setCalendarEnd(true)}
                    inputProps={{
                      ...params.inputProps,
                      placeholder: "End Date",
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel value="Contracted Services Effective Date*" />
          <div
            className={`${style.leftAlign} ${style.effectiveDateWidth}`}
            onFocus={() => {
              checkFieldAndPopAlert(
                contractEffectiveDate,
                "Contracted Services Effective Date"
              );
            }}
          >
            <CommonDateField
              open={calendarEffective}
              onOpen={() => setCalendarEffective(true)}
              onClose={() => setCalendarEffective(false)}
              value={contractEffectiveDate}
              onChange={(newValue) => {
                const offsetDate = new Date(
                  newValue.getTime() - newValue.getTimezoneOffset() * 60000
                );
                setIsDateUpdated(true);
                setContractEffectiveDate(offsetDate);
                getContractedServices();
              }}
              InputProps={{
                style: {
                  fontSize: 14,
                  height: 30,
                },
              }}
              minDate={contractTermPeriodFrom}
              maxDate={contractTermPeriodTo}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // onClick={() => setCalendarEffective(true)}
                  inputProps={{
                    ...params.inputProps,
                    placeholder: "Effective Date",
                  }}
                />
              )}
            />
          </div>
        </div>
        {contractType?.value === 'MULTIPLE' &&
          <div
            className={`${style.extentionGrid} ${style.marginTop20}`}
            onFocus={() => {
              deptFieldCheck(departmentSpecific);
            }}
          >
            <CommonLabel value="Are Individual Timesheets Needed*" />
            <CommonSwitch
              checked={isAggregationNeeded}
              className={` ${style.textAlignLeft} ${style.switchFontStyle}`}
              label={isAggregationNeeded ? "YES" : "NO"}
              onChange={() => {
                setIsAggregationNeeded(!isAggregationNeeded);
              }}
            />
          </div>
        }

        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel
            value="Contract Time Commitment*"
            className={
              dataCheck(contractedTimeCommitment?.value) || contractedTimeCommitment?.frequency === "NA" || contractedTimeCommitment?.frequency === "Select..." ? style.redLable : ""
            }
          />
          <div className={style.contractedTime}>
            <CommonInputField
              type="tel"
              value={
                contractedTimeCommitment?.value === 0 ||
                  contractedTimeCommitment?.value === "0"
                  ? ""
                  : contractedTimeCommitment?.value
              }
              onChange={(e) =>
                e.target.value >= 0 &&
                e.target.value <=
                differenceInCalendarWeeks(
                  new Date(contractTermPeriodTo),
                  new Date(contractTermPeriodFrom)
                ) &&
                setContractTimeCommitment({
                  ...contractedTimeCommitment,
                  value: e.target.value,
                  frequency: "NA",
                })
              }
            />
            <CommonSelectField
              value={contractedTimeCommitment?.frequency || "Select..."}
              onChange={(e) =>
                setContractTimeCommitment({
                  ...contractedTimeCommitment,
                  frequency: e.target.value,
                })
              }
              className={`${style.timeCommitment}`}
              firstOptionLabel={"Select..."}
              firstOptionValue={"Select..."}
              valueList={["WEEK", "MONTH"]}
              labelList={[
                "Weeks Per Contract Year",
                "Months Per Contract Year",
              ]}
              disabledList={
                parseInt(contractedTimeCommitment?.value) <=
                  differenceInCalendarMonths(
                    new Date(contractTermPeriodTo),
                    new Date(contractTermPeriodFrom)
                  )
                  ? [false, false]
                  : parseInt(contractedTimeCommitment?.value) <=
                    differenceInCalendarWeeks(
                      new Date(contractTermPeriodTo),
                      new Date(contractTermPeriodFrom)
                    )
                    ? [false, true]
                    : [true, true]
              }
            />
          </div>
        </div>

        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel
            value="Compensation policy to Apply*"
            className={dataCheck(compensationPolicy) ? style.redLable : ""}
          />
          <div>
            <div>
              <CommonSelectField
                value={compensationPolicy || ""}
                onChange={(e) => setCompensationPolicy(e.target.value)}
                className={`${style.fullWidth}`}
                firstOptionLabel={"Choose Your Compensation Policy"}
                firstOptionValue={""}
                valueList={[
                  "ACTIVITY_BASED",
                  "FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITH_OFFSET",
                  "FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET",
                  "SHIFT_OR_PER_DAY_BASED",
                ]}
                labelList={[
                  "Activity Based",
                  "Fixed Amount for Timesheet Period WITH Offset Applied",
                  "Fixed Amount for Timesheet Period WITHOUT Offset Applied",
                  "Shift OR Per diem Based",
                ]}
                disabledList={[false, false]}
                widthValue={contractStatus === "ACTIVE" ? "100%" : 370}
              />
            </div>
          </div>
        </div>

        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel
            value="Contract Continuation Policy*"
            className={
              dataCheck(selectedContractContinuationPolicy)
                ? style.redLable
                : ""
            }
          />
          <div>
            <div
              onFocus={() => {
                checkFieldAndPopAlert(
                  selectedContractContinuationPolicy,
                  "Contract Continuation Policy"
                );
              }}
            >
              <CommonSelectField
                value={selectedContractContinuationPolicy || ""}
                onChange={(e) =>
                  setSelectedContractContinuationPolicy(e.target.value)
                }
                className={`${style.fullWidth}`}
                firstOptionLabel={"Choose Your Contract Continuation Policy"}
                firstOptionValue={""}
                valueList={[
                  "AUTORENEWAL",
                  "NEWCONTRACTONEXPIRATION",
                  "ONETIMECONTRACTTERMINATEONEXPIRATION",
                  "WRITTENCONTRACTEXTENSIONFORFIXEDTERM",
                ]}
                labelList={[
                  "Auto Renewal",
                  "New Contract On Expiration",
                  "One Time Contract - Terminate On Expiration",
                  "Extension By Mutual Written Signed Agreement.",
                ]}
                disabledList={[false, false]}
              />
            </div>
            {selectedContractContinuationPolicy === "AUTORENEWAL" && (
              <div className={`${style.renewalBoxStyle}`}>
                <div
                  className={`${style.renewalBoxGrid}`}
                  onFocus={() => {
                    checkFieldAndPopAlert(
                      autoRenewal.renewalTerm,
                      "Auto Renewal - Auto Renewal Term"
                    );
                  }}
                >
                  <div className={style.marginTop}>Auto Renewal Term*</div>
                  <EditableText
                    className={`${style.inputRenewalStyle}`}
                    placeholder=""
                    value={autoRenewal.renewalTerm}
                    onChange={(e) =>
                      e <= 52 &&
                      setAutoRenewal({
                        ...autoRenewal,
                        renewalTerm: e,
                        calendar: "",
                      })
                    }
                    type="tel"
                    disabled={contractStatus === "ACTIVE" ? true : false}
                  />
                  <CommonSelectField
                    value={autoRenewal.calendar}
                    onChange={(e) =>
                      setAutoRenewal({
                        ...autoRenewal,
                        calendar: e.target.value,
                      })
                    }
                    className={`${style.marginLeft20} ${style.weekSelectStyle}`}
                    firstOptionLabel={"Select Frequency"}
                    firstOptionValue={""}
                    valueList={["WEEKS", "MONTHS"]}
                    labelList={["Weeks", "Months"]}
                    disabledList={[false, autoRenewal?.renewalTerm > 12]}
                  />
                </div>
                <div
                  className={`${style.renewalBoxGrid}`}
                  onFocus={() => {
                    checkFieldAndPopAlert(
                      autoRenewal.allowableRenewalTerm,
                      "Auto Renewal - Allowable Auto Renewal Terms"
                    );
                  }}
                >
                  <div className={style.marginTop10}>
                    Allowable Auto Renewal Terms*
                  </div>
                  <EditableText
                    className={`${style.inputRenewalStyle} ${style.marginTop10}`}
                    placeholder=""
                    value={autoRenewal.allowableRenewalTerm}
                    onChange={(e) =>
                      e <= 12 &&
                      setAutoRenewal({
                        ...autoRenewal,
                        allowableRenewalTerm: e,
                      })
                    }
                    type="tel"
                    disabled={contractStatus === "ACTIVE" ? true : false}
                  />
                </div>
              </div>
            )}
            {(selectedContractContinuationPolicy ===
              "WRITTENCONTRACTEXTENSIONFORFIXEDTERM" ||
              selectedContractContinuationPolicy ===
              "NEWCONTRACTONEXPIRATION" ||
              selectedContractContinuationPolicy ===
              "ONETIMECONTRACTTERMINATEONEXPIRATION") && (
                <div
                  className={`${style.renewalRemainderBoxStyle}`}
                  onFocus={() => {
                    checkFieldAndPopAlert(
                      renewalReminder?.[0]?.days || 0,
                      selectedContractContinuationPolicy ===
                        "WRITTENCONTRACTEXTENSIONFORFIXEDTERM"
                        ? "Written Contract Extension - Set Renewal Reminder"
                        : selectedContractContinuationPolicy ===
                          "NEWCONTRACTONEXPIRATION"
                          ? "New Contract on Expiration - Set Renewal Reminder"
                          : "One Time Contract - Set Renewal Reminder"
                    );
                  }}
                >
                  {reminderFields}
                  <div className={`${style.renewalBoxGrid}`}>
                    {renewalReminder?.length <= 2 && (
                      <button
                        className={`${style.addMoreButton} ${style.selectedColor} ${style.cursorPointer}`}
                        onClick={addReminder}
                      >
                        ADD MORE
                      </button>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
      {contractStatus === "DRAFT" &&
        (<div className={`${style.floatRight} ${style.marginTop20}`}>
          <button className={`${style.newContractOutlinedButton} ${style.cursorPointer} ${continueLoading ? style.continueDisabled : ''}`} onClick={!continueLoading ? () => checkAndUpdateDate('SaveInProgress') : () => { }}>SAVE IN-PROGRESS</button>
          <button className={`${style.newContractButtonStyle}  ${style.cursorPointer} ${style.marginLeft20} ${continueLoading ? style.continueDisabled : ''}`} onClick={!continueLoading ? () => checkAndUpdateDate('Continue') : () => { }}>CONTINUE</button>
        </div>)
      }

      {addNewManagerDialog && (
        <AddNewContractManager
          getAddNewManagerDialog={getAddNewManagerDialog}
          getUserData={getUserData}
          contractId={contractIdFromActive}
        />
      )}

      {conflict?.isPresent && (
        <ConflictPopUp conflict={conflict} updateConflict={updateConflict} />
      )}

      <Dialog isOpen={isShowUploadDialog} onClose={() => { setIsShowUploadDialog(false); setFileFieldData({ id: '', documentType: '', documentName: '', documentDescription: '', fileName: '', file: null, filePath: '' }); }} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`} canOutsideClickClose={false}>
        <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
          <div className={style.spaceBetween}>
            <p className={style.extensionStyle}>ADD FILE DETAILS</p>
            <Icon
              icon="cross"
              size={20}
              intent={Intent.DANGER}
              className={style.crossStyle}
              onClick={() => setIsShowUploadDialog(false)}
            />
          </div>
          <div className={style.extensionBorder}></div>

          <div>
            <p className={`${style.fileNameTextStyle} ${style.marginTop10}`}>
              {fileFieldData?.fileName}
            </p>
            <div>
              <CommonSelectField value={fileFieldData?.documentType || 'Select...'} onChange={(e) => handleFileChange(e, 'documentType')}
                className={`${style.fullWidth}`} firstOptionLabel={'Select...'} firstOptionValue={'Select...'}
                valueList={['Agreement Draft', 'Executed Agreement', 'Contract Amendment', 'Exhibit', 'Appendix Addendum', 'Schedule', 'Attachment']}
                labelList={['Agreement Draft', 'Executed Agreement', 'Contract Amendment', 'Exhibit', 'Appendix Addendum', 'Schedule', 'Attachment']}
                disabledList={[false, false]} />
            </div>
            <CommonInputField className={`${style.fullWidth} ${style.marginTop10}`} placeholder="Document Name *"
              value={fileFieldData?.documentName}
              maxLength={TEXTFIELDLEN}
              onChange={(e) => handleFileChange(e, 'documentName')} />
            <TextArea rows={4} placeholder="Document Description *" value={fileFieldData?.documentDescription}
              maxLength={DESCLEN} className={`${style.fullWidth} ${style.marginTop10}`} onChange={(e) => handleFileChange(e, 'documentDescription')} />

          </div>
          <div className={`${style.spaceBetween} ${style.marginTop}`}>
            <p className={`${style.marginTop10} ${style.fileFormatStyle}`}>Accepted File Formats : PDF, DOC, PNG, Excel, JPEG, GIF, DOCX.</p>
          </div>
          {
            continueLoading && <div className={`${style.spaceBetween} ${style.marginTop}`}>
              <ProgressBar value={50} intent={Intent.PRIMARY} />
            </div>
          }

          <div className={`${style.spaceBetween} ${style.marginTop}`}>
            <div></div>
            {(
              (fileFieldData?.documentType === '' || fileFieldData?.documentName === '' || fileFieldData?.file === null || fileFieldData?.documentDescription === '') ?
                <Tooltip title={'Enter All Values To Enable Upload'} arrow>
                  <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} ${style.disabledUploadButton}`} >UPLOAD</button>
                </Tooltip> :
                <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} `} disabled={false} onClick={() => { addNewDocumentField() }}>UPLOAD</button>
            )}
          </div>
        </div>
      </Dialog >

      <MissedMandatoryFieldAlert
        alert={showSaveInProgress}
        getSaveInProgressAlert={getSaveInProgressAlert}
        fieldData={unassignedKeys}
        saveInProgressFunction={saveInProgressFunction}
        setContinueLoading={setContinueLoading}
        buttonName={buttonName}
      />
    </div >
  );
};

export default ContractIdTermLimitIndividual;
