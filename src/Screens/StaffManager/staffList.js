import React, { useState, useEffect, createRef, useCallback, useRef } from 'react';
import DownloadLight from './../../images/downloadLightColor.png';
import Download from '../../images/download.png'
import PrintIcon from './../../images/printIcon.png';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Popover from '@mui/material/Popover';
import GreenPage from './../../images/greenPage.png';
import TimeSmartLogo from './../../images/timeSmartAI-logo-withoutbg.png';
import StaffTiles from './staffTiles';
import SearchBar from '../../Components/SearchBar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import { GET, PUT, POST, TenantID } from '../dataSaver';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CircularProgress from "@mui/material/CircularProgress";
import { SuccessToaster, ErrorToaster } from '../../utils/toaster';
import { currentUser } from '../../utils/auth';
import { format } from 'date-fns';
import TableTwo from '../../Components/TableDesignTwo';
import LeftStatsCard from '../../Components/LeftStatsCard';
import LoadingScreen from '../../Components/LoadingScreen';
import { toPDF } from '../../Components/ConvertToPdf';
import { useReactToPrint } from "react-to-print";
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from "./../../images/notificationsIcon.png";
import NotificationCount from "./../../images/notificationCount.png";
import style from './index.module.scss';
import SideBar from '../../Components/Sidebar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const StaffList = ({ isLoading, getSearchKey, searchKey, getDeleteDraftDialog, contracts, getSelectedContract, getContracts, getAddContract, getExtensionDialog, getTerminationDialog, getCloneDialog, activeContracts, getNewContract, getContractType, getSelectedContractType, getContractIdFromActive, selectedContract, users, getSelectedPage, totalCount, page, getActiveContractView, getFilterValues, getHandleSort, sortValue, getTabFilter }) => {
  const PDFRef = createRef();
  const componentRef = useRef(null);
  const filterRef = useRef();

  const staffData = [{
    subStatus: "grey",
    workItem: "Application submitted for review",
    workItemHoverText: ["Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas libero, repudiandae id."],
    type: "credentialing Application",
    applicantStaffName: "Karen K.",
    manager: "Nina G.",
    createdOn: "June 01 2024",
    dueDate: "June 01 2024"
  },
  {
    subStatus: "yellow",
    workItem: "n95 certificate expiring",
    workItemHoverText: ["Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas libero, repudiandae id."],
    type: "Active Staff",
    applicantStaffName: "Jason M.",
    manager: "Nina G.",
    createdOn: "June 01 2024",
    dueDate: "June 01 2024"
  },
  {
    subStatus: "red",
    workItem: "upcoming staff Reappointment",
    workItemHoverText: ["Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas libero, repudiandae id."],
    type: "Active Staff",
    applicantStaffName: "Hannanh Y.",
    manager: "Nina G.",
    createdOn: "June 01 2024",
    dueDate: "June 01 2024"
  }
  ]

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);
  const [selectedContractId, setSelectedContractId] = useState();
  const activeHeaderValues = ["",
    "Work Item ",
    "Type",
    "Applicant / Staff Name",
    "Manager",
    "Created On",
    "Due Date",
    ""
  ];
  const draftHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "ACTIVATION STATUS", "LAST UPDATED", "CONTRACT DOCS", "LAST UPDATED BY", "MANAGER", "ACTION"];
  const activationPendingHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "REVIEWS", "APPROVALS", "CONTRACT DOCS", "GO LIVE DATE", "EFFECTIVE DATE", "MANAGER", "ACTION"];
  const upcomingHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "EXPIRATION DATE", "EXPIRING IN", "LAST UPDATE", "MANAGER", "ACTION"];
  const expiredHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "TERMINATION DATE", "NEW CONTRACT ID", "LAST UPDATE", "MANAGER", "ACTION"];
  const activeColSortValues = [false, false, false, false, false, true, true, false, false];
  const draftColSortValues = [false, false, true, true, true, true, false, false, false];
  const upcomingColSortValues = [false, false, true, true, true, false, true, false, false];
  const expiredColSortValues = [false, false, true, true, false, false, true, false];
  const activationPendingColSortValues = [false, false, true, true, false, false, false, false, false, false, false];
  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isDownloadClicked, setIsDownloadClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMyContract, setIsMyContract] = useState(true);
  const [isDraft, setIsDraft] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPreImplementationDialog, setShowPreImplementationDialog] = useState(false);
  const [showReviewAndApprovalStatusSummaryDialog, setShowReviewAndApprovalStatusSummaryDialog] = useState(false);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const currentUserData = currentUser();
  const [selectedContractPreImplementationData, setSelectedContractPreImplementationData] = useState();
  const [metadata, setMetadata] = useState();
  const [CSPSubDomain, setCSPSubDomain] = useState("");
  let contractFiltersFromSession = sessionStorage.getItem('contractFilters')
  const [contractFilterValues, setContractFilterValues] = useState(contractFiltersFromSession);
  console.log(contractFilterValues, 'filter')
  let bottomTextNumber = sessionStorage.getItem('bottomFilter')
  const compensationPolicyAvailableValues = {
    ACTIVITY_BASED: 'Activity Based',
    FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITH_OFFSET: 'Fixed Amount For Timesheet Period With Offset',
    SHIFT_OR_PER_DAY_BASED: 'Shift Or Per Day Based',
    FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET: 'Fixed Amount For Timesheet Period Without Offset'
  }

  const contractPolicyTypeAvailableValues = {
    NEWCONTRACTONEXPIRATION: 'New Contract Expiration',
    ONETIMECONTRACTTERMINATEONEXPIRATION: 'One Time Contract Termination Expiration',
    WRITTENCONTRACTEXTENSIONFORFIXEDTERM: 'Written Contract Extension For Fixed Term',
    AUTORENEWAL: 'Auto Renewal'
  }
  console.log(contractFilterValues)
  useEffect(() => {
    getContractsMetadata();
    getEntityData();
    sessionStorage.removeItem('Selected Contract Status')
  }, []);

  useEffect(() => {
    getContractsMetadata();
  }, [bottomTextNumber]);

  useEffect(() => {
    console.log(JSON.parse(contractFiltersFromSession), 'contractFilter')
    setContractFilterValues(JSON.parse(contractFiltersFromSession))
  }, [contractFiltersFromSession])

  const activateContracts = async (data, userData) => {
    setSelectedContractId(data?.id);
    let status = userData?.filter(data => !data?.ssoId?.id?.includes(`@${CSPSubDomain}`))?.length === 0 ? 'ACTIVE' : 'ACTIVATION_READY';
    let activationData = {
      "contractActivation": {
        "activationNotes": {
          "notes": ""
        },
        "activatedBy": {
          "id": currentUserData?.id,
          "name": {
            "firstName": currentUserData?.firstName,
            "lastName": currentUserData?.lastName
          },
          "email": {
            "officialEmail": currentUserData?.email
          }
        }
      }
    }
    await PUT(`contract-managment-service/contracts/${data?.id}/contractStatus/${status}`, activationData)
      .then(response => {
        SuccessToaster('Contract Activated Successfully');
        getContracts();
        getContractsMetadata();
      })
      .catch(error => { ErrorToaster('Contract Activation Failed'); })
  };

  const getUserData = async (data) => {
    if (data?.id !== "" && data?.id !== undefined) {
      const { data: userData } = await GET(
        `user-management-service/user?contractID=${data?.id}`
      );
      if (userData) {
        if (userData?.length !== 0) {
          activateContracts(data, userData);
        }
      }
    }
  };

  const contractExtension = (data) => {
    getExtensionDialog(true);
    getContractIdFromActive(data?.id);
  }

  const contractTermination = (data) => {
    getTerminationDialog(true);
    getContractIdFromActive(data?.id);
  }

  const contractClone = (data) => {
    getCloneDialog(true);
    getContractIdFromActive(data?.id);
  }

  const deleteDraft = (data) => {
    getDeleteDraftDialog(true);
    getContractIdFromActive(data?.id);
  }

  const getShowPreImplementationDialog = (data) => {
    setShowPreImplementationDialog(true);
    setSelectedContractId(data?.id);
    setSelectedContractPreImplementationData(data);
  }

  const getPreImplementationDialogBoolean = (value) => {
    setShowPreImplementationDialog(value);
  }

  const getReviewAndApprovalStatusSummaryDialog = (data) => {
    setShowReviewAndApprovalStatusSummaryDialog(true);
  }

  const getReviewAndApprovalStatusSummaryDialogBoolean = (value) => {
    setShowReviewAndApprovalStatusSummaryDialog(value);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setIsPrintClicked(false);
    setAnchorEl(null);
  };

  const getEntityData = async () => {
    const { data: entityData } = await GET(`entity-service/entity/${TenantID}`);
    // console.log("entity", entityData.subdomain);
    setCSPSubDomain(entityData?.officialEmailDomain?.officialEmail);
  };

  const getContractors = (id) => {
    let contractedUsers = [];
    users?.filter(user => user?.contracts?.map(contract => contract?.roles?.map(role => role?.roleName)?.includes('Activity Logger') && contract?.id)?.includes(id))?.map(data => {
      console.log('suffix check', data)
      let name = `${data?.name?.firstName}, ${data?.name?.lastName?.toUpperCase() || ''} ${data?.name?.suffix?.suffix || ''}`
      contractedUsers.push(name);
    });
    return contractedUsers;
  }

  const onClickFunction = (data) => {
    // if (selectedContract === 'activestaffs') {
    //   getActiveContractView(true);
    // } else {
    getNewContract(true);
    getContractType(data?.contractTypeId?.id, data?.contractType);
    getSelectedContractType(data?.newContract ? 'New Contract' : 'Existing Contract');
    // }
    getContractIdFromActive(data?.id);
    console.log(data, 'contract data')
    sessionStorage.setItem('Selected Contract Status', data?.contractStatus)
  }

  const handleRenewalContracts = async (data) => {
    // getNewContract(true);
    // getContractType(data?.contractTypeId?.id, data?.contractType);
    // getSelectedContractType('Existing Contract');
    // console.log(data, 'contract data')
    // sessionStorage.setItem('Selected Contract Status', "DRAFT")
    // sessionStorage.setItem('contractType', data?.contractType)
    // sessionStorage.setItem('existingContractId', data?.id)
    // sessionStorage.setItem('priorContractId', data?.contractDetail?.contractId?.id)
    // sessionStorage.setItem('method', 'POST')
    if (!data?.contractDetail?.contractRenewed) {
      const { data: userData } = await GET(
        `contract-managment-service/contracts/${data?.id}/renewContract`
      )

      if (userData) {
        SuccessToaster('Contract Renewed Successfully');
        getContracts();
        getContractsMetadata();
      } else { ErrorToaster('Contract Renewal Failed'); };
    } else {
      ErrorToaster('Contract Already Renewed');
    }
  }

  const handleDownloadClicked = () => {
    toPDF(".contractList", `ContractsList_${format(new Date(), 'MM_dd_yy')}`);
  }

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: `ContractsList_${format(new Date(), 'MM_dd_yy')}`,
    // onBeforeGetContent: handleOnBeforeGetContent,
    // onBeforePrint: handleBeforePrint,
    // onAfterPrint: handleAfterPrint,
    removeAfterPrint: true
  });

  let dot = [];
  let dotTooltipValues = [];
  let warningHoverText = [];
  let notification = [];
  let contractType = [];
  let contractId = [];
  let lock = [];
  let lockHoverText = [];
  let icon = [];
  let iconHoverText = [];
  let podHoverText = [];
  let name = [];
  let reviews = [];
  let approvals = [];
  let goLiveDate = [];
  let contractors = [];
  let effectiveDate = [];
  let expirationDate = [];
  let expiringIn = [];
  let podStatus = [];
  let manager = [];
  let lastUpdated = [];
  let action = [];
  let activationStatus = [];
  let lastUpdatedBy = [];
  let contractorHoverText = [];
  let contractorsIcon = [];
  let newContractId = [];
  let applicantStaffName = [];
  let type = [];
  let workItem = [];
  let workItemHoverText = [];

  const getActiveContractsValues = () => {
    dot = [];
    name = [];
    warningHoverText = [];
    contractType = [];
    contractId = [];
    lock = [];
    lockHoverText = [];
    podHoverText = [];
    contractorHoverText = [];
    contractorsIcon = [];
    contractors = [];
    effectiveDate = [];
    podStatus = [];
    applicantStaffName = [];
    manager = [];
    lastUpdated = [];
    action = [];
    type = [];
    workItem = [];
    workItemHoverText = [];

    staffData?.map(data => {
      dot.push(data?.subStatus);
      workItem.push(data?.workItem);
      workItemHoverText.push(data?.workItemHoverText || '-');
      type.push(data?.type);
      applicantStaffName.push(data?.applicantStaffName);
      manager.push(data?.manager);
      effectiveDate.push(format(new Date(data?.createdOn), 'MM-dd-yyyy'))
      lastUpdated.push(format(new Date(data?.dueDate), 'MM-dd-yyyy'))
      action.push(true);
    })

    return [
      { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
      { "type": "textWithHover", "value": workItem, "hoverText": workItemHoverText },
      { "type": "text", "value": type },
      { "type": "text", "value": applicantStaffName },
      { "type": "text", "value": manager },
      { "type": "text", "value": effectiveDate },
      { "type": "text", "value": lastUpdated },
      { "type": "action", "value": action },
    ];
  }

  const getDraftContractsValues = () => {
    dot = [];
    dotTooltipValues = [];
    icon = [];
    iconHoverText = [];
    contractType = [];
    contractId = [];
    name = [];
    activationStatus = [];
    effectiveDate = [];
    manager = [];
    lastUpdated = [];
    lastUpdatedBy = [];
    action = [];

    contracts?.map(data => {
      dot.push((data?.contractStatus === 'ACTIVATION_READY' && data?.subStatus === 'ACTIVATION_IN_PROGRESS') ? 'yellow' : (data?.contractStatus === 'DRAFT' && data?.subStatus === 'ACTIVATION_IN_PROGRESS') ? 'grey' : data?.subStatus === 'ACTIVATION_PAST_DUE' ? 'red' : 'grey');
      contractType.push(data?.contractType === 'MULTIPLE' ? `MULTI - PROVIDER ${data?.newContract ? '(New)' : '(Existing)'}` : `${data?.contractType} ${data?.newContract ? '(New)' : '(Existing)'}`);
      dotTooltipValues.push((data?.contractStatus === 'ACTIVATION_READY' && data?.subStatus === 'ACTIVATION_IN_PROGRESS') ? 'Activation Ready' : (data?.contractStatus === 'DRAFT' && data?.subStatus === 'ACTIVATION_IN_PROGRESS') ? 'Activation In Progress' : data?.subStatus === 'ACTIVATION_PAST_DUE' ? 'Activation Past Due' : 'Draft Contract');
      contractId.push(data?.contractDetail?.contractId?.id);
      lock.push(<LockOpenOutlinedIcon style={{ color: '#14B15A' }} />)
      lockHoverText.push('Contract available for other contract managers to access & work on');
      name.push(data?.contractName?.contractName);
      reviews.push('1/1');
      approvals.push('3/3');
      goLiveDate.push('07/19/2019');
      activationStatus.push(data?.contractStatus === 'ACTIVATION_READY' ? 'Activation pending' : 'Not Activated');
      icon.push(<TextSnippetOutlinedIcon style={{ color: (data?.contractDetail?.contractFiles?.length === 0 || data?.contractDetail?.contractFiles === null) ? '#F94848' : '#14B15A' }} />);
      iconHoverText.push((data?.contractDetail?.contractFiles?.length === 0 || data?.contractDetail?.contractFiles === null) ? 'No Document Uploaded' : 'Document Uploaded');
      effectiveDate.push(data?.contractDetail?.contractTerm !== null ? format(new Date(data?.contractDetail?.contractTerm?.effectiveDate), 'MM-dd-yyyy') : '-');
      manager.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
      lastUpdated.push(format(new Date(data?.lastModifiedDate), 'MM-dd-yyyy'))
      lastUpdatedBy.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
      action.push(true)
    })

    return isDraft ? [
      { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
      { "type": "text", "value": contractType, "onClickFunction": onClickFunction },
      { "type": "text", "value": contractId, "onClickFunction": onClickFunction },
      // { "type": "icon", "icon": lock, "hoverText": lockHoverText, 'isShowHoverText': true },
      { "type": "text", "value": name, "onClickFunction": onClickFunction },
      { "type": "text", "value": activationStatus, "onClickFunction": onClickFunction },
      { "type": "text", "value": lastUpdated, "onClickFunction": onClickFunction },
      { "type": "icon", "icon": icon, "hoverText": iconHoverText, 'isShowHoverText': true },
      { "type": "text", "value": lastUpdatedBy, "onClickFunction": onClickFunction },
      { "type": "text", "value": manager, "onClickFunction": onClickFunction },
      { "type": "action", "value": action },
    ] : [
      { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
      { "type": "text", "value": contractType, "onClickFunction": onClickFunction },
      { "type": "text", "value": contractId, "onClickFunction": onClickFunction },
      { "type": "text", "value": name, "onClickFunction": onClickFunction },
      { "type": "text", "value": reviews, "onClickFunction": onClickFunction },
      { "type": "text", "value": approvals, "onClickFunction": onClickFunction },
      { "type": "icon", "icon": icon, "hoverText": iconHoverText, 'isShowHoverText': true },
      { "type": "text", "value": goLiveDate, "onClickFunction": onClickFunction },
      { "type": "text", "value": effectiveDate, "onClickFunction": onClickFunction },
      { "type": "text", "value": manager, "onClickFunction": onClickFunction },
      { "type": "action", "value": action },
    ];
  }

  const getUpcomingContractsValues = () => {
    dot = [];
    dotTooltipValues = [];
    contractType = [];
    contractId = [];
    name = [];
    expirationDate = [];
    expiringIn = [];
    manager = [];
    lastUpdated = [];
    action = [];

    contracts?.map(data => {
      dot.push(data?.subStatus === 'EXTENSION_REQUIRED' ? 'yellow' : 'red');
      dotTooltipValues.push(data?.subStatus === 'EXTENSION_REQUIRED' ? 'Extension Required' : 'New Contract Required');
      contractType.push(data?.contractType === 'MULTIPLE' ? 'MULTI - PROVIDER' : data?.contractType);
      contractId.push(data?.contractDetail?.contractId?.id);
      name.push(data?.contractName?.contractName);
      expirationDate.push('07/19/2019');
      expiringIn.push('15 days');
      manager.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
      lastUpdated.push(format(new Date(data?.lastModifiedDate), 'MM-dd-yyyy'))
      action.push(true)
    })

    return [
      { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
      { "type": "text", "value": contractType, "onClickFunction": onClickFunction },
      { "type": "text", "value": contractId, "onClickFunction": onClickFunction },
      { "type": "text", "value": name, "onClickFunction": onClickFunction },
      { "type": "text", "value": expirationDate, "onClickFunction": onClickFunction },
      { "type": "text", "value": expiringIn, "onClickFunction": onClickFunction },
      { "type": "text", "value": lastUpdated, "onClickFunction": onClickFunction },
      { "type": "text", "value": manager, "onClickFunction": onClickFunction },
      { "type": "action", "value": action },
    ];
  }

  const getExpiredContractsValues = () => {
    dot = [];
    dotTooltipValues = [];
    contractType = [];
    contractId = [];
    name = [];
    expirationDate = [];
    newContractId = [];
    manager = [];
    lastUpdated = [];
    action = [];

    contracts?.map(data => {
      dot.push('red');
      dotTooltipValues.push(data?.subStatus === 'EXPIRED' ? 'Expired' : 'Terminated');
      contractType.push(data?.contractType === 'MULTIPLE' ? 'MULTI - PROVIDER' : data?.contractType);
      contractId.push(data?.contractDetail?.contractId?.id);
      name.push(data?.contractName?.contractName);
      expirationDate.push(data?.contractDetail?.contractExpiryDate !== null ? format(new Date(data?.contractDetail?.contractExpiryDate), 'MM-dd-yyyy') : '-');
      newContractId.push(data?.contractDetail?.renewedContractId !== null ? data?.contractDetail?.renewedContractId?.id : '-');
      manager.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
      lastUpdated.push(format(new Date(data?.lastModifiedDate), 'MM-dd-yyyy'))
      action.push(true)
    })

    return [
      { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
      { "type": "text", "value": contractType, "onClickFunction": onClickFunction },
      { "type": "text", "value": contractId, "onClickFunction": onClickFunction },
      { "type": "text", "value": name, "onClickFunction": onClickFunction },
      { "type": "text", "value": expirationDate, "onClickFunction": onClickFunction },
      { "type": "text", "value": newContractId, "onClickFunction": onClickFunction },
      { "type": "text", "value": lastUpdated, "onClickFunction": onClickFunction },
      { "type": "text", "value": manager, "onClickFunction": onClickFunction },
      { "type": "action", "value": action },
    ];
  }

  const activeActionsData = [
    { 'data': 'View', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Delete Incomplete', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send for Review', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Process Rejection', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Resend Link', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send RFD', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send Reminder', 'requiredValue': 'boolean', "onClick": '' },
  ]

  const expiredActionsData = [
    { 'data': 'Renew Expired Contract', 'onClick': handleRenewalContracts, 'requiredValue': 'boolean', 'conditionToShow': `!data?.contractDetail?.contractRenewed && data?.contractDetail?.continuationPolicy?.contractPolicyType !== 'ONETIMECONTRACTTERMINATEONEXPIRATION' && data?.contractStatus !== 'TERMINATED'` }
  ]

  const handleAddContract = () => {
    sessionStorage.setItem('Selected Contract Status', "DRAFT")
    getAddContract(true);
  }

  const getContractsMetadata = async () => {
    console.log(bottomTextNumber, 'test')
    let apiUrl = `contract-managment-service/contracts/metadata`;
    if (bottomTextNumber !== 'undefined' && bottomTextNumber !== undefined && bottomTextNumber !== null) {
      if (selectedContract === 'upcomingrenewals') {
        apiUrl += `?UpcomingTabNoOfDays=${bottomTextNumber}`
      }
      if (selectedContract === 'expired/terminated') {
        apiUrl += `?ExpiredTabNoOfDays=${bottomTextNumber}`
      }
    }
    const { data: contractMetadata } = await GET(apiUrl);
    setMetadata(contractMetadata);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  }

  const getContractFilterValues = (value) => {
    console.log(value, 'contractFilters')
    // setContractFilterValues(value);
    sessionStorage.setItem('contractFilters', JSON.stringify(value))
  }

  const updateFilter = (data, value) => {
    filterRef.current.updateFilter(data, value);
  }

  let tableHeaderValues = activeHeaderValues;
  let tableSortValues = activeColSortValues;
  let tableDataValues = getActiveContractsValues();
  let actions = activeActionsData;
  // let gridStyle = selectedContract === 'activestaffs' ? style.activeContractGridWithoutAction : selectedContract === "draft" ? (isDraft ? style.draftContractGrid : style.activationPendingContractGrid) : selectedContract === "upcomingrenewals" ? style.upcomingContractGrid : style.expiredContractGrid;
  let gridStyle = selectedContract === 'activestaffs' ? style.activeStaffGrid : selectedContract === "draft" ? (isDraft ? style.draftContractGrid : style.activationPendingContractGrid) : selectedContract === "upcomingrenewals" ? style.upcomingContractGrid : style.expiredContractGrid;

  return (
    <div className={style.margin20}>
      <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
        <div>
          <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>

            <div className={`${style.cardStyle} ${style.bigCalendarLeftCardWidth}`}>
              <div>
                <div className={`${style.headingNameStyle} ${style.marginRight10}`}>
                  FIND STAFF / APPLICANT
                </div>
                <div className={`${style.marginTop20}`}  >
                  <div className={`${style.displayInRow} ${style.padding}`}>
                    <TextField
                      type="text"
                      size="small"
                      placeholder="Placeholder"
                      id="outlined-basic"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">Enter Name to Start</InputAdornment>,
                        endAdornment: <InputAdornment position="end" >type ahead of all staff/apps</InputAdornment>,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`${style.bigCardStyle} ${style.padding20} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
              <div className={`${style.displayInRow} `}>
                <span className={style.notificationHeading}>
                  <img className={style.notificationIcon} src={NotificationsIcon} alt="" />
                  <div className={style.notificationCount}>2</div>
                </span>
                <div className={`${style.headingNameStyle} ${style.marginTop10} ${style.marginLeft10}`}>
                  <span>ALERTS</span>
                </div>
              </div>
              <div className={`${style.displayInCol}`}>
                <div className={`${style.spaceBetween} ${style.marginTop}`}>
                  <div className={`${style.userNameStyle}${style.alignCenter}`}>New Alert Title
                  </div>
                  <span className={style.topRightTextStyle}>5 mins ago</span>
                </div>
                <p className={style.paragraphNameStyle}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, repudiandae!</p>
              </div>

              <div className={`${style.dividerStyle} ${style.marginTop20} ${style.marginBottom20}`}></div>
              <div className={`${style.displayInCol}`}>
                <div className={`${style.spaceBetween} ${style.marginTop}`}>
                  <div className={`${style.userNameStyle}${style.alignCenter}`}>New Alert Title
                  </div>
                  <span className={style.topRightTextStyle}>5 mins ago</span>
                </div>
                <p className={style.paragraphNameStyle}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, repudiandae!</p>
              </div>
            </div>
          </SideBar>
        </div>
        <div>
          <StaffTiles getSelectedContract={getSelectedContract} selectedContract={selectedContract}
            metadata={metadata} getTabFilter={getTabFilter} />
          <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
            <div className={`${style.spaceBetween} ${style.marginLeftRight20}`}>
              <div className={`${style.displayInRow} ${style.marginTop10}`}>
                {selectedContract === 'activestaffs' ? (
                  <>
                    <div className={`${style.headingForStaffs} ${style.bottomTextStyle}`}>TASKS TO ADDRESS</div>
                  </>
                ) : (
                  <>
                    <div className={`${style.headingForStaffs} ${style.bottomTextStyle}`} >{selectedContract}</div>
                  </>
                )}
              </div>
              <div className={`${style.displayInRow} ${style.marginTop10} ${style.marginLeft} ${style.verticalAlignCenter}`}>
                <div className={`${isPrintClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft}`} >
                  <SearchOutlinedIcon sx={{ fontSize: isPrintClicked ? 20 : 25, color: isPrintClicked ? '#fff' : '#857AEF' }} />
                </div>
                <div className={`${isPrintClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft}`} >
                  <PrintOutlinedIcon sx={{ fontSize: isPrintClicked ? 20 : 25, color: isPrintClicked ? '#fff' : '#857AEF' }} />
                </div>
                <div className={`${isPrintClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft}`} >
                  <FilterAltOutlinedIcon sx={{ fontSize: isPrintClicked ? 20 : 25, color: isPrintClicked ? '#fff' : '#857AEF' }} />
                </div>

              </div>
            </div>

            {isLoading ?
              <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
                <CircularProgress sx={{ color: "#7165E3" }} />
              </div> :
              <div ref={componentRef}>
                <div className={`${style.reduceMarginTop10} staffList`} ref={PDFRef}>
                  <TableTwo
                    tableHeaderValues={tableHeaderValues}
                    tableDataValues={tableDataValues}
                    tableData={staffData}
                    getNewContract={getNewContract}
                    getContractType={getContractType}
                    getSelectedContractType={getSelectedContractType}
                    getContractIdFromActive={getContractIdFromActive}
                    gridStyle={gridStyle}
                    actions={actions}
                    getSelectedPage={getSelectedPage}
                    // totalCount={totalCount}
                    // page={page}
                    scrollStyle={style.contractScrollStyle}
                    tableSortValues={tableSortValues}
                    heading={'There are no contracts for you to manage'}
                    subHeading={'To add a new contract click on'}
                    onClickText={'Click To View A Short Tutorial On How To Add A Contract'}
                    buttonComponent={<div className={`${style.addStyle} ${style.alignCenter} ${style.marginLeft20}`}>
                      <AddCircleOutlineIcon sx={{ fontSize: 20, color: 'white' }} />
                    </div>}
                    onClickFunction={() => { }}
                    getHandleSort={getHandleSort}
                    sortValue={sortValue}
                  />
                </div>
              </div>
            }
          </div>
        </div>
      </div >
      <div className={style.spaceBetween}>
        <div className={`${style.displayInRow}`}>
          <p className={`${style.poweredBy} ${style.marginTop10}`}>Powered by -</p>
          <img src={TimeSmartLogo} alt="footer" className={`${style.footerIconStyle} ${style.marginLeft10}`} />
        </div>
        <p className={style.poweredBy}>© {new Date().getFullYear()} TimeSmartAI.Inc</p>
      </div>

    </div >
  )
}

export default StaffList;
