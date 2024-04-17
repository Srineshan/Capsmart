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
import Popover from '@mui/material/Popover';
import GreenPage from './../../images/greenPage.png';
import TimeSmartLogo from './../../images/timeSmartAI-logo-withoutbg.png';
import ContractTiles from './contractTiles';
import SearchBar from './../../Components/SearchBar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { GET, PUT, POST, TenantID } from './../dataSaver';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CircularProgress from "@mui/material/CircularProgress";
import { SuccessToaster, ErrorToaster } from './../../utils/toaster';
import { currentUser } from './../../utils/auth';
import { format } from 'date-fns';
import UserCard from './userCard';
import Table from '../../Components/TableDesign';
import LeftStatsCard from '../../Components/LeftStatsCard';
import LoadingScreen from '../../Components/LoadingScreen';
import { toPDF } from '../../Components/ConvertToPdf';
import { useReactToPrint } from "react-to-print";

import { validateTimesheetSubmission } from './contractValidation';

import style from './index.module.scss';
import SideBar from '../../Components/Sidebar';
import PreImplementationDataDialog from './preImplementationDataDialog';
import ReviewAndApprovalStatusSummary from './reviewAndApprovalStatusSummary';

const ContractList = ({ isLoading, getSearchKey, searchKey, getDeleteDraftDialog, contracts, getSelectedContract, getContracts, getAddContract, getExtensionDialog, getTerminationDialog, getCloneDialog, activeContracts, getNewContract, getContractType, getSelectedContractType, getContractIdFromActive, selectedContract, users, getSelectedPage, totalCount, page, getActiveContractView }) => {
  const PDFRef = createRef();
  const componentRef = useRef(null);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);
  const [selectedContractId, setSelectedContractId] = useState();
  const activeHeaderValues = ["", "", "CONTRACT TYPE", "ID",
    "",
    "NAME", "CONTRACTORS",
    "EFFECTIVE DATE",
    // "POD STATUS",
    "LAST UPDATED",
    "ACTION"
  ];
  const draftHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "ACTIVATION STATUS", "LAST UPDATED", "REF DOCS", "LAST UPDATED BY", "MANAGER", "ACTION"];
  const activationPendingHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "REVIEWS", "APPROVALS", "REF DOCS", "GO LIVE DATE", "EFFECTIVE DATE", "MANAGER", "ACTION"];
  const upcomingHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "EXPIRATION DATE", "EXPIRING IN", "LAST UPDATE", "MANAGER", "ACTION"];
  const expiredHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "TERMINATION DATE", "NEW CONTRACT ID", "LAST UPDATE", "MANAGER", "ACTION"];
  const activeColSortValues = [false, false, false, false, true, true, false, false, false, false];
  const draftColSortValues = [false, false, true, true, false, false, false, false, false];
  const upcomingColSortValues = [false, false, true, true, false, false, false, false, false];
  const expiredColSortValues = [false, false, true, true, false, false, false, false];
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

  useEffect(() => {
    getContractsMetadata();
    getEntityData();
    sessionStorage.removeItem('Selected Contract Status')
  }, []);

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
    // if (selectedContract === 'activecontracts') {
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

  const getActiveContractsValues = () => {
    dot = [];
    dotTooltipValues = [];
    warningHoverText = [];
    notification = [];
    contractType = [];
    contractId = [];
    lock = [];
    lockHoverText = [];
    podHoverText = [];
    contractorHoverText = [];
    contractorsIcon = [];
    name = [];
    contractors = [];
    effectiveDate = [];
    podStatus = [];
    //  manager = [];
    lastUpdated = [];
    action = [];

    contracts?.map(data => {
      let contractorList = getContractors(data?.id);
      console.log('contractorList', contractorList);
      dot.push(data?.subStatus === 'EXPIRING_IN_30_DAYS' ? 'yellow' : 'green');
      dotTooltipValues.push(data?.subStatus === 'EXPIRING_IN_30_DAYS' ? 'Expiring in 30 days' : 'Auto Renewed');
      warningHoverText.push('Submitted Timesheets not in compliance with contract terms. contract requires specific terms to be modified');
      notification.push(<WarningAmberIcon style={{ color: '#FF6562' }} />);
      contractType.push(data?.contractType === 'MULTIPLE' ? 'MULTI - PROVIDER' : data?.contractType);
      contractId.push(data?.contractDetail?.contractId?.id || '-');
      lock.push(<LockOpenOutlinedIcon style={{ color: '#14B15A' }} />)
      lockHoverText.push('Contract available for other contract managers to access & work on');
      podHoverText.push(['Medical Lic Cer { Contrname}', 'Medical Lic Cer { Contrname}']);
      contractorHoverText.push(contractorList)
      notification.push(<WarningAmberIcon style={{ color: '#FF6562' }} />);
      name.push(data?.contractName?.contractName);
      contractors.push(contractorList?.length || '-');
      contractorsIcon.push(contractorList?.length > 1 ? <GroupOutlinedIcon style={{ fontSize: 20, color: '#857AEF' }} /> : contractorList?.length === 0 ? '' : <PersonOutlinedIcon style={{ fontSize: 20, color: '#857AEF' }} />);
      effectiveDate.push(data?.contractDetail?.contractTerm !== null ? format(new Date(data?.contractDetail?.contractTerm?.effectiveDate), 'MM-dd-yyyy') : '-');
      // podStatus.push("3");
      manager.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
      lastUpdated.push(format(new Date(data?.lastModifiedDate), 'MM-dd-yyyy'))
      action.push(true);
    })

    return [
      { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
      { "type": "icon", "icon": notification, "hoverText": warningHoverText, 'isShowHoverText': true },
      { "type": "text", "value": contractType, "onClickFunction": onClickFunction },
      { "type": "text", "value": contractId, "onClickFunction": onClickFunction },
      { "type": "icon", "icon": lock, "hoverText": lockHoverText, 'isShowHoverText': true },
      { "type": "text", "value": name, "onClickFunction": onClickFunction },
      { "type": "iconWithCount", "value": contractors, "hoverText": contractorHoverText, 'isShowHoverText': true, "icon": contractorsIcon },
      { "type": "text", "value": effectiveDate, "onClickFunction": onClickFunction },
      // { "type": "iconWithCount", "value": podStatus, "hoverText": podHoverText, 'isShowHoverText': true, "icon": <TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#14B15A' }} /> },
      // {"type": "text", "value": manager, "onClickFunction": onClickFunction},
      { "type": "text", "value": lastUpdated, "onClickFunction": onClickFunction },
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
      dot.push('yellow');
      contractType.push(data?.contractType === 'MULTIPLE' ? `MULTI - PROVIDER ${data?.newContract ? '(New)' : '(Existing)'}` : `${data?.contractType} ${data?.newContract ? '(New)' : '(Existing)'}`);
      dotTooltipValues.push('In-Progress');
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
      dot.push('yellow');
      dotTooltipValues.push('In-Progress');
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
      dot.push(true);
      dotTooltipValues.push('Selected');
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
      { "type": "checkbox", "value": dot, 'tooltipValue': dotTooltipValues },
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
    // {'data': 'Contract Extension', 'onClick': contractExtension, 'requiredValue': 'boolean'},
    { 'data': 'Terminate Contract', 'onClick': contractTermination, 'requiredValue': 'boolean' },
    //   {'data': 'Clone Contract', 'onClick': contractClone, 'requiredValue': 'boolean'},
    { 'data': 'Pre Implementation Data', 'onClick': getShowPreImplementationDialog, 'requiredValue': 'boolean' }
  ]

  const draftActionsData = [
    { 'data': 'Delete Contract', 'onClick': deleteDraft, 'requiredValue': 'boolean' },
    { 'data': 'Activate Contract', 'onClick': getUserData, 'requiredValue': 'id' },
    // {'data': 'Share', 'onClick': activateContracts, 'requiredValue': 'id'},
  ]

  const activationPendingActionsData = [
    { 'data': 'Status Summary', 'onClick': getReviewAndApprovalStatusSummaryDialog, 'requiredValue': 'boolean' },
    { 'data': 'Activate', 'onClick': activateContracts, 'requiredValue': 'id' },
    { 'data': 'Send Reminder', 'onClick': {}, 'requiredValue': 'boolean' },
  ]

  const upcomingActionsData = [
    // {'data': 'Renew Existing Contract', 'onClick': deleteDraft, 'requiredValue': 'boolean'},
    { 'data': 'Extend Contract', 'onClick': activateContracts, 'requiredValue': 'id' },
    // {'data': 'Terminate Contract', 'onClick': activateContracts, 'requiredValue': 'id'}
    { 'data': 'Renew Upcoming Contract', 'onClick': handleRenewalContracts, 'requiredValue': 'boolean' }
  ]

  const expiredActionsData = [
    { 'data': 'Renew Expired Contract', 'onClick': handleRenewalContracts, 'requiredValue': 'boolean' }
  ]

  const handleAddContract = () => {
    sessionStorage.setItem('Selected Contract Status', "DRAFT")
    getAddContract(true);
  }

  const getContractsMetadata = async () => {
    const { data: contractMetadata } = await GET(`contract-managment-service/contracts/metadata`);
    setMetadata(contractMetadata);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  }

  let tableHeaderValues = selectedContract === 'activecontracts' ? activeHeaderValues : selectedContract === 'draft' ? (isDraft ? draftHeaderValues : activationPendingHeaderValues) : selectedContract === 'upcomingrenewals' ? upcomingHeaderValues : expiredHeaderValues;
  let tableSortValues = selectedContract === 'activecontracts' ? activeColSortValues : selectedContract === 'draft' ? (isDraft ? draftColSortValues : activationPendingColSortValues) : selectedContract === 'upcomingrenewals' ? upcomingColSortValues : expiredColSortValues;
  let tableDataValues = selectedContract === 'activecontracts' ? getActiveContractsValues() : selectedContract === "draft" ? getDraftContractsValues() : selectedContract === 'upcomingrenewals' ? getUpcomingContractsValues() : getExpiredContractsValues();
  let actions = selectedContract === 'activecontracts' ? activeActionsData : selectedContract === 'draft' ? (isDraft ? draftActionsData : activationPendingActionsData) : selectedContract === "upcomingrenewals" ? upcomingActionsData : expiredActionsData;
  // let gridStyle = selectedContract === 'activecontracts' ? style.activeContractGridWithoutAction : selectedContract === "draft" ? (isDraft ? style.draftContractGrid : style.activationPendingContractGrid) : selectedContract === "upcomingrenewals" ? style.upcomingContractGrid : style.expiredContractGrid;
  let gridStyle = selectedContract === 'activecontracts' ? style.activeContractGrid : selectedContract === "draft" ? (isDraft ? style.draftContractGrid : style.activationPendingContractGrid) : selectedContract === "upcomingrenewals" ? style.upcomingContractGrid : style.expiredContractGrid;

  return (
    <div className={style.margin20}>
      <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
        <div>
          <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
            <LeftStatsCard metadata={metadata} />
          </SideBar>
        </div>
        <div>
          <ContractTiles getSelectedContract={getSelectedContract} selectedContract={selectedContract}
            metadata={metadata} />
          <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
            <div className={`${style.spaceBetween} ${style.marginLeftRight20}`}>
              <div className={`${style.displayInRow} ${style.marginTop10}`}>
                {selectedContract === 'activecontracts' ? (
                  <>
                    <button className={isMyContract ? style.myActiveContractsButton : style.otherContractsButton} onClick={() => setIsMyContract(true)}>My Active Contracts ( {metadata?.activeContract?.activeContractCount} )</button>
                    <button className={`${!isMyContract ? style.myActiveContractsButton : style.otherContractsButton} ${style.marginLeft20}`} onClick={() => setIsMyContract(false)}>Other Contracts ( 0 )</button>
                  </>
                ) : selectedContract === 'draft' ? (
                  <>
                    <button className={isDraft ? style.myActiveContractsButton : style.otherContractsButton} onClick={() => setIsDraft(true)}>Draft Contracts ( {metadata?.draft?.draftCount} )</button>
                    {/* <button className={`${!isDraft ? style.myActiveContractsButton : style.otherContractsButton} ${style.marginLeft20}`} onClick={() => setIsDraft(false)}>Activation Pending ( 2 )</button> */}
                  </>
                ) : selectedContract === 'upcomingrenewals' ? (
                  <>
                    <button className={style.myActiveContractsButton} >Upcoming Renewals ({metadata?.upcomingRenewalsContract?.upcomingRenewalsCount})</button>
                  </>
                ) : (
                  <>
                    <button className={style.myActiveContractsButton} >Expired / Terminated ({metadata?.expiredOrTerminatedContract?.expiredOrTerminatedContractCount})</button>
                  </>
                )}
              </div>
              <div className={`${style.displayInRow} ${style.marginTop10} ${style.marginLeft} ${style.verticalAlignCenter}`}>
                <div className={style.marginLeft}>
                  <SearchBar getSearchKey={getSearchKey} searchKey={searchKey} />
                </div>
                <div className={`${isDownloadClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft}`} onClick={() => { setIsDownloadClicked(!isDownloadClicked); handleDownloadClicked() }}>
                  <img src={contracts?.length !== 0 ? Download : DownloadLight} alt='' className={style.iconSize} />

                  {/* <DownloadIcon sx={{ fontSize: isDownloadClicked ? 20 : 25, color: isDownloadClicked ? '#fff' : '#857AEF' }} /> */}
                </div>
                <div className={`${isPrintClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft}`} onClick={() => { setIsPrintClicked(!isPrintClicked); handlePrint() }}>
                  <PrintOutlinedIcon sx={{ fontSize: isPrintClicked ? 20 : 25, color: isPrintClicked ? '#fff' : '#857AEF' }} onClick={(e) => handleClick(e)} aria-describedby={id} />
                  {/* <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <div className={style.actionsCard}>
                      <div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => { handleClose() }}>Contract Master List</div>
                      <div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => { handleClose() }}>One Time Contracts With Termination Date</div>
                      <div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => { handleClose() }}>Contracts With Written Continuation Policy</div>
                      <div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => { handleClose() }}>Contracts In Auto-Renewal Mode</div>
                    </div>
                  </Popover> */}
                </div>


                <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft}`} onClick={() => { handleAddContract() }}>
                  <AddCircleOutlineIcon sx={{ fontSize: 20, color: 'white' }} />
                </div>
              </div>
            </div>
            {isLoading ?
              <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
                <CircularProgress sx={{ color: "#7165E3" }} />
              </div> :
              <div ref={componentRef}>
                <div className={`${style.reduceMarginTop10} contractList`} ref={PDFRef}>
                  <Table
                    tableHeaderValues={tableHeaderValues}
                    tableDataValues={tableDataValues}
                    tableData={contracts}
                    getNewContract={getNewContract}
                    getContractType={getContractType}
                    getSelectedContractType={getSelectedContractType}
                    getContractIdFromActive={getContractIdFromActive}
                    gridStyle={gridStyle}
                    actions={actions}
                    getSelectedPage={getSelectedPage}
                    totalCount={totalCount}
                    page={page}
                    scrollStyle={style.contractScrollStyle}
                    tableSortValues={tableSortValues}
                    heading={'There are no contracts for you to manage'}
                    subHeading={'To add a new contract click on'}
                    onClickText={'Click To View A Short Tutorial On How To Add A Contract'}
                    buttonComponent={<div className={`${style.addStyle} ${style.alignCenter} ${style.marginLeft20}`}>
                      <AddCircleOutlineIcon sx={{ fontSize: 20, color: 'white' }} />
                    </div>}
                    onClickFunction={() => { }}
                  />
                </div>
              </div>
            }
            {
              //   <div className={`${style.noContractsBox} ${style.alignCenter}`}>
              //   <div>
              //     <div className={style.noContractsFontStyle}>There are no contracts for you to manage.</div>
              //     <div className={`${style.displayInRow} ${style.justifyCenter} ${style.marginTop20}`}>
              //       <div className={style.noContractsSmallFontStyle}>To add a new contract click on </div>
              //       <div className={`${style.addSmallStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft20}`} onClick={() => { handleAddContract() }}>
              //         <AddCircleOutlineIcon sx={{ fontSize: 15, color: 'white' }} />
              //       </div>
              //     </div>
              //     <a><div className={`${style.linkStyle} ${style.marginTop10}`}>Click To View A Short Tutorial On How To Add A Contract</div></a>
              //   </div>
              // </div>
            }

          </div>
        </div>
      </div>
      <div className={style.spaceBetween}>
        <div className={`${style.displayInRow}`}>
          <p className={`${style.poweredBy} ${style.marginTop10}`}>Powered by -</p>
          <img src={TimeSmartLogo} alt="footer" className={`${style.footerIconStyle} ${style.marginLeft10}`} />
        </div>
        <p className={style.poweredBy}>© {new Date().getFullYear()} TimeSmartAI.Inc</p>
      </div>
      <PreImplementationDataDialog showPreImplementationDialog={showPreImplementationDialog} getPreImplementationDialogBoolean={getPreImplementationDialogBoolean} contractId={selectedContractId} selectedContractPreImplementationData={selectedContractPreImplementationData} />
      <ReviewAndApprovalStatusSummary showReviewAndApprovalStatusSummaryDialog={showReviewAndApprovalStatusSummaryDialog} getReviewAndApprovalStatusSummaryDialogBoolean={getReviewAndApprovalStatusSummaryDialogBoolean} contractId={selectedContractId} />

    </div>
  )
}

export default ContractList;
