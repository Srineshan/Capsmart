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
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Popover from '@mui/material/Popover';
import GreenPage from './../../images/greenPage.png';
import TimeSmartLogo from './../../images/timeSmartAI-logo-withoutbg.png';
import StaffApplicationTiles from './staffApplicationTiles';
import SearchBar from '../../Components/SearchBar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
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
import PublicIcon from '@mui/icons-material/Public';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import style from './index.module.scss';
import SideBar from '../../Components/Sidebar';
import ProgressBar from "@ramonak/react-progress-bar";

const StaffApplicationList = ({ isLoading, getSearchKey, searchKey, getDeleteDraftDialog, contracts, getSelectedContract, getContracts, getAddContract, getExtensionDialog, getTerminationDialog, getCloneDialog, activeContracts, getNewContract, getContractType, getSelectedContractType, getContractIdFromActive, selectedContract, users, getSelectedPage, totalCount, page, getActiveContractView, getFilterValues, getHandleSort, sortValue, getTabFilter }) => {
  const PDFRef = createRef();
  const componentRef = useRef(null);
  const filterRef = useRef();
  const [requestAppointment, setRequestAppointment] = useState(true);
  const [sentCompletion, setSentCompletion] = useState(true);
  const [applicationRejected, setApplicationRejected] = useState(true);

  const ApplicantsProcessData = [{
    subStatus: "yellow",
    applicantName: "LAST,First MI ",
    applicantId: "7837428",
    applicantType: "Doctor",
    docs: "2/8",
    dataStatus: "yellow",
    disclosures: "7/9",
    crs: "1",
    notes: "1",
    lastUpdated: "June 01 2024",
    capManager: "lorem ipsum"
  }, {
    subStatus: "green",
    applicantName: "LAST,First MI ",
    applicantId: "7837428",
    applicantType: "Doctor",
    docs: "2/8",
    dataStatus: "green",
    disclosures: "7/9",
    crs: "0",
    notes: "1",
    lastUpdated: "June 01 2024",
    capManager: "lorem ipsum"
  },
  {
    subStatus: "grey",
    applicantName: "LAST,First MI ",
    applicantId: "7837428",
    applicantType: "Doctor",
    docs: "2/8",
    dataStatus: "yellow",
    disclosures: "7/9",
    crs: "2",
    notes: "1",
    lastUpdated: "June 01 2024",
    capManager: "lorem ipsum"
  },
  ]

  const ApplicationData = [{
    applicantName: "LAST,First MI ",
    applicantType: "Doctor",
    department: "Department",
    commiteeStatus: "yellow",
    boardStatus: "grey",
    ceoStatus: "grey",
    lastUpdatedOn: "June 19, 2024",
    lastUpdatedBy: "lorem ipsum",
  },
  {
    applicantName: "LAST,First MI ",
    applicantType: "Doctor",
    department: "Department",
    commiteeStatus: "green",
    boardStatus: "yellow",
    ceoStatus: "grey",
    lastUpdatedOn: "June 19, 2024",
    lastUpdatedBy: "lorem ipsum",
  },
  ]

  const ClarificationData = [
    {
      subStatus: "green",
      applicantName: "LAST,First MI 89327439",
      applicantType: "Doctor",
      clarificationTitle: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim cum, quos possimus nostrum debitis autem!",
      raisedBy: "Committee Member",
      createdOn: "June 19, 2024",
      lastUpdatedOn: "June 19, 2024",
    },
    {
      subStatus: "green",
      applicantName: "LAST,First MI 89327439",
      applicantType: "Doctor",
      clarificationTitle: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim cum, quos possimus nostrum debitis autem!",
      raisedBy: "Committee Member",
      createdOn: "June 19, 2024",
      lastUpdatedOn: "June 19, 2024",
    }
  ]
  const ApprovedData = [
    {
      subStatus: "yellow",
      applicantName: "LAST,First MI 89327439",
      applicantType: "Doctor",
      approvedNotes: "Lorem ipsum dolor",
      lastUpdatedOn: "June 19, 2024",
    }
  ]

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);
  const [selectedContractId, setSelectedContractId] = useState();

  const applicantHeaderValues = ["", "Applicant Name & ID", "Applicant Type", "Docs", "Data", "Disclosures", "CRs", "Notes", "Last Updated", "Cap Manager", ""];
  const applicationHeaderValues = ["", "Applicant Name", "Applicant Type", "Department", "Commitee", "Board", "CEO", "Last Updated On", "Last Updated by", ""];
  const clarificationHeaderValues = ["", "Applicant Name", "Type", "Clarification Title", "Raised By", "Created On", "Last Updated On", ""];
  const approvedHeaderValues = ["", "Applicant Name", "Type", "Notes", "Last Updated On", ""];

  const applicantColSortValues = [false, false, false, false, false, false, false, false, false];
  const applicationColSortValues = [false, false, false, false, false, false, false, false, false];
  const clarificationColSortValues = [false, false, false, false, false, false, false, false, false];
  const approvedColSortValues = [false, false, false, false, false, false, false, false, false];

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
  let lastUpdated = [];
  let action = [];
  let applicantName = [];
  let applicantId = [];
  let applicantType = [];
  let docs = [];
  let docsHoverText = [];
  let docsIcon = [];
  let dataStatus = [];
  let disclosures = [];
  let crs = [];
  let crsHoverText = [];
  let notes = [];
  let notesHoverText = [];
  let notesIcon = [];
  let capManager = [];
  let department = [];
  let commiteeStatus = [];
  let boardStatus = [];
  let ceoStatus = [];
  let lastUpdatedOn = [];
  let lastUpdatedBy = [];
  let clarificationTitle = [];
  let raisedBy = [];
  let createdOn = [];
  let approvedNotes = [];

  const getApplicantValues = () => {
    dot = [];
    applicantName = [];
    applicantId = [];
    applicantType = [];
    docs = [];
    docsHoverText = [];
    docsIcon = [];
    dataStatus = [];
    disclosures = [];
    crs = [];
    crsHoverText = [];
    notes = [];
    notesHoverText = [];
    notesIcon = [];
    lastUpdated = [];
    capManager = [];
    action = [];

    ApplicantsProcessData?.map(data => {
      dot.push(data?.subStatus);
      applicantName.push(data?.applicantName);
      applicantId.push(data?.applicantId);
      applicantType.push(data?.applicantType);
      docs.push(data?.docs);
      docsHoverText.push(["Immunization History Verification From PCP pending"])
      docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `${data?.subStatus}` }} />);
      dataStatus.push(data?.dataStatus);
      disclosures.push(data?.disclosures);
      crs.push(data?.crs);
      crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"])
      notes.push(data?.notes);
      notesIcon.push(<NoteAltOutlinedIcon style={{ fontSize: 20, color: `#52575D` }} />);
      notesHoverText.push(["June 13 00:00, Nina Grealy", "Lorem ipsum dolor sit amet, consetetur sadipscing."])
      lastUpdated.push(format(new Date(data?.lastUpdated), 'MM-dd-yyyy'))
      capManager.push(data?.capManager);
      action.push(true);
    })

    return [
      { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
      { "type": "text", "value": applicantName },
      { "type": "text", "value": applicantType },
      { "type": "iconWithCount", "value": docs, "hoverText": docsHoverText, 'isShowHoverText': true, "icon": docsIcon },
      { "type": "dot", "value": dataStatus },
      { "type": "iconWithCount", "value": disclosures, "hoverText": docsHoverText, 'isShowHoverText': true, "icon": docsIcon },
      { "type": "countWithHover", "value": crs, "hoverText": crsHoverText },
      { "type": "iconWithCount", "value": notes, "hoverText": notesHoverText, 'isShowHoverText': true, "icon": notesIcon },
      { "type": "text", "value": lastUpdated },
      { "type": "text", "value": capManager },
      { "type": "action", "value": action },
    ];
  }

  const getApplicationValues = () => {
    applicantName = [];
    applicantType = [];
    department = [];
    commiteeStatus = [];
    boardStatus = [];
    ceoStatus = [];
    lastUpdatedOn = [];
    lastUpdatedBy = [];
    action = [];

    ApplicationData?.map(data => {
      dot.push("");
      applicantName.push(data?.applicantName);
      applicantType.push(data?.applicantType);
      department.push(data?.department);
      commiteeStatus.push(data?.commiteeStatus);
      boardStatus.push(data?.boardStatus);
      ceoStatus.push(data?.ceoStatus);
      lastUpdatedOn.push(data?.lastUpdatedOn)
      lastUpdatedBy.push(data?.lastUpdatedBy);
      action.push(true);
    })

    return [
      { "type": "dot", "value": dot },
      { "type": "text", "value": applicantName },
      { "type": "text", "value": applicantType },
      { "type": "text", "value": department },
      { "type": "dot", "value": commiteeStatus },
      { "type": "dot", "value": boardStatus },
      { "type": "dot", "value": ceoStatus },
      { "type": "text", "value": lastUpdatedOn },
      { "type": "text", "value": lastUpdatedBy },
      { "type": "action", "value": action },
    ];
  }

  const getClarificationValues = () => {
    dot = [];
    applicantName = [];
    applicantType = [];
    clarificationTitle = [];
    raisedBy = [];
    createdOn = [];
    lastUpdatedOn = [];
    action = [];

    ClarificationData?.map(data => {
      dot.push(data?.subStatus);
      applicantName.push(data?.applicantName);
      applicantType.push(data?.applicantType);
      clarificationTitle.push(data?.clarificationTitle);
      raisedBy.push(data?.raisedBy);
      createdOn.push(data?.createdOn);
      lastUpdatedOn.push(data?.lastUpdatedOn);
      action.push(true);
    })

    return [
      { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
      { "type": "text", "value": applicantName },
      { "type": "text", "value": applicantType },
      { "type": "text", "value": clarificationTitle },
      { "type": "text", "value": raisedBy },
      { "type": "text", "value": createdOn },
      { "type": "text", "value": lastUpdatedOn },
      { "type": "action", "value": action },
    ];
  }

  const getApprovedValues = () => {
    dot = [];
    applicantName = [];
    applicantType = [];
    approvedNotes = [];
    lastUpdatedOn = [];
    action = [];

    ApprovedData?.map(data => {
      dot.push(data?.subStatus);
      applicantName.push(data?.applicantName);
      applicantType.push(data?.applicantType);
      approvedNotes.push(data?.approvedNotes);
      lastUpdatedOn.push(data?.lastUpdatedOn);
      action.push(true);
    })

    return [
      { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
      { "type": "text", "value": applicantName },
      { "type": "text", "value": applicantType },
      { "type": "text", "value": approvedNotes },
      { "type": "text", "value": lastUpdatedOn },
      { "type": "action", "value": action },
    ];
  }

  const applicantActionsData = [
    { 'data': 'View & Verify', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send for Committee Review', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send Reminder for Required Documents', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Request for Clarification', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'From Applicant', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'From Internal Approver', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'From Institution', 'requiredValue': 'boolean', "onClick": '' },
  ]

  const applicationActionsData = [
    { 'data': 'View & Verify', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send for Committee Review', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send Reminder for Required Documents', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Request for Clarification', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'From Applicant', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'From Internal Approver', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'From Institution', 'requiredValue': 'boolean', "onClick": '' },
  ]

  const clarificationActionsData = [
    { 'data': 'View & Verify', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send for Committee Review', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send Reminder for Required Documents', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Request for Clarification', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'From Applicant', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'From Internal Approver', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'From Institution', 'requiredValue': 'boolean', "onClick": '' },
  ]

  const approvedActionsData = [
    { 'data': 'Add as active staff', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send follow up disclosures', 'requiredValue': 'boolean', "onClick": '' },
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

  let tableHeaderValues = selectedContract === 'Applicants' ? applicantHeaderValues : selectedContract === "Applications" ? applicationHeaderValues : selectedContract === "Clarifications" ? clarificationHeaderValues : approvedHeaderValues;
  let tableSortValues = selectedContract === 'Applicants' ? applicantColSortValues : selectedContract === "Applications" ? applicationColSortValues : selectedContract === "Clarifications" ? clarificationColSortValues : approvedColSortValues;
  let tableDataValues = selectedContract === 'Applicants' ? getApplicantValues() : selectedContract === "Applications" ? getApplicationValues() : selectedContract === "Clarifications" ? getClarificationValues() : getApprovedValues();
  let actions = selectedContract === 'Applicants' ? applicantActionsData : selectedContract === "Applications" ? applicationActionsData : selectedContract === "Clarifications" ? clarificationActionsData : approvedActionsData;
  let gridStyle = selectedContract === 'Applicants' ? style.applicantStaffGrid : selectedContract === "Applications" ? style.applicationStaffGrid : selectedContract === "Clarifications" ? style.clarificationStaffGrid : style.approvedStaffGrid;

  return (
    <div className={style.margin20}>
      <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
        <div>
          <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
            <div className={`${style.addStyle}  ${style.applicationButton} ${style.spaceBetween} ${style.marginTop10} ${style.alignCenter} ${style.cursorPointer} ${style.cardStyle}`} >
              <div className={`${style.displayInRow} ${style.marginLeftRight10} `} >
                CREATE NEW APPLICATION
              </div>
              <div className={`${style.displayInRow} ${style.marginLeft20} `} >
                <AddCircleOutlineIcon sx={{ fontSize: 20, color: 'white' }} />
              </div>
            </div>

            <div className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
              <div className={`${style.spaceBetween}  ${style.marginLeftRight10}`}>
                <div className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}>
                  Request For Appointment (3)
                </div>
                <div className={`${style.marginLeft10} `} >
                  {!requestAppointment ? (
                    <AddIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setRequestAppointment(!requestAppointment)} />
                  ) : (
                    <RemoveIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setRequestAppointment(!requestAppointment)} />
                  )}
                </div>
              </div>
              {requestAppointment && (<>
                <div>
                  <div className={`${style.displayInCol} ${style.marginTop}`}>
                    <div className={`${style.warningTextAlign} ${style.staffTextStyle} ${style.marginRight10}`}>
                      <p className={style.staffPragraphStyle}>Dave FILIP <span style={{
                        color: "#52575D",
                        font: "normal normal bold 16px/24px Proxima Nova"
                      }}> (Doctor) </span> <span className={style.dayTextStyle}
                        style={{
                          border: "0.4px solid #14B15A",
                          color: "#14B15A"
                        }}> +1 Day</span> </p> <span>
                        <PermIdentityIcon sx={{ fontSize: 20, color: '#7165E3', marginRight: "5px" }} />
                      </span>
                    </div>
                  </div>
                  <div className={`${style.displayInCol} ${style.marginTop}`}>
                    <div className={`${style.warningTextAlign} ${style.staffTextStyle} ${style.marginRight10}`}>
                      <p className={style.staffPragraphStyle}>Dave FILIP <span style={{
                        color: "#52575D",
                        font: "normal normal bold 16px/24px Proxima Nova"
                      }}> (Doctor) </span> <span className={style.dayTextStyle}
                        style={{
                          border: "0.4px solid #FEC106",
                          color: "#FEC106"
                        }}> +1 Day</span> </p> <span>
                        <PublicIcon sx={{ fontSize: 20, color: '#7165E3', marginRight: "5px" }} />
                      </span>
                    </div>
                  </div>
                  <div className={`${style.displayInCol} ${style.marginTop}`}>
                    <div className={`${style.warningTextAlign} ${style.staffTextStyle} ${style.marginRight10}`}>
                      <p className={style.staffPragraphStyle}>Anna KARIN <span style={{
                        color: "#52575D",
                        font: "normal normal bold 16px/24px Proxima Nova"
                      }}> (Doctor) </span> <span className={style.dayTextStyle}
                        style={{
                          border: "0.4px solid #F94848",
                          color: "#F94848"
                        }}> +1 Day</span> </p> <span>
                        <PublicIcon sx={{ fontSize: 20, color: '#7165E3', marginRight: "5px" }} />
                      </span>
                    </div>
                  </div>
                </div>
              </>)}
            </div>

            <div className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
              <div className={`${style.spaceBetween}  ${style.marginLeftRight10}`}>
                <div className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}>
                  Applications Sent for Completion (4)
                </div>
                <div className={`${style.marginLeft10} `} >
                  {!sentCompletion ? (
                    <AddIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setSentCompletion(!sentCompletion)} />
                  ) : (
                    <RemoveIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setSentCompletion(!sentCompletion)} />
                  )}
                </div>
              </div>
              {sentCompletion && (<>
                <div className={`${style.displayInCol} ${style.marginTop}`}>
                  <div className={`${style.warningTextAlign} ${style.staffTextStyle}`}>
                    <div className={style.progressbarStyle}>
                      <div className={style.spaceBetween}>
                        <div className={style.statisticsProgress}>
                          <div className={`${style.greyDotStyle} `}></div>
                          <div className={style.marginLeft10}>Jane DOE</div> <span className={style.textStyleProgress}> (Nurse) </span></div>
                        <p className={style.progressTopText}>Due in 15 Days</p>
                      </div>
                      <ProgressBar completed={6} isLabelVisible={false} height='5px' bgColor='#7165E3' baseBgColor="#E9E9F0" className={style.marginLeft20} />
                      <div className={style.progressBottomText}>95% remaining</div>
                    </div>
                  </div>
                </div>
                <div className={`${style.displayInCol} ${style.marginTop}`}>
                  <div className={`${style.warningTextAlign} ${style.staffTextStyle}`}>
                    <div className={style.progressbarStyle}>
                      <div className={style.spaceBetween}>
                        <div className={style.statisticsProgress}>
                          <div className={`${style.greenDotStyle} `}></div>
                          <div className={style.marginLeft10}>Jane DOE</div> <span className={style.textStyleProgress}> (Nurse) </span></div>
                        <p className={style.progressTopText}>Due in 2 Days</p>
                      </div>
                      <ProgressBar completed={100} isLabelVisible={false} height='5px' bgColor='#7165E3' baseBgColor="#E9E9F0" className={style.marginLeft20} />
                      <div className={style.progressBottomText}>0% remaining</div>
                    </div>
                  </div>
                </div>
                <div className={`${style.displayInCol} ${style.marginTop}`}>
                  <div className={`${style.warningTextAlign} ${style.staffTextStyle}`}>
                    <div className={style.progressbarStyle}>
                      <div className={style.spaceBetween}>
                        <div className={style.statisticsProgress}>
                          <div className={`${style.yellowDotStyle} `}></div>
                          <div className={style.marginLeft10}>Kate SLATE</div> <span className={style.textStyleProgress}> (Doctor) </span></div>
                        <p className={style.progressTopText}>Due in 7 Days</p>
                      </div>
                      <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#7165E3' baseBgColor="#E9E9F0" className={style.marginLeft20} />
                      <div className={style.progressBottomText}>40% remaining</div>
                    </div>
                  </div>
                </div>
              </>)}
            </div>

            <div className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
              <div className={`${style.displayInRow}  ${style.marginLeftRight10}`}>
                <div className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}>
                  Applications Rejected/Declined (8)
                </div>
                <div className={`${style.marginLeft10} `} >
                  {!applicationRejected ? (
                    <AddIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setApplicationRejected(!applicationRejected)} />
                  ) : (
                    <RemoveIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setApplicationRejected(!applicationRejected)} />
                  )}                </div>
              </div>
              {
                applicationRejected && (<>
                  <div className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}>
                    Appointment Requests Denied (5)
                  </div>
                  <div className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}>
                    Applications Rejected (3)
                  </div>
                  <div className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}>
                    Applications Approved But Declined (1)
                  </div>
                </>)
              }
            </div>


          </SideBar>
        </div>
        <div>
          <div className={`${style.displayInRow} ${style.spaceBetween} ${style.headingForStaffs} ${style.bottomTextStyle}`}>
            CAP MANAGER > APPLICATIONS
          </div>

          <div className={`${style.spaceBetween} ${style.marginTop20} ${style.marginLeft30} `}>
            <StaffApplicationTiles getSelectedContract={getSelectedContract} selectedContract={selectedContract}
              metadata={metadata} getTabFilter={getTabFilter} />
            <div className={`${style.spaceBetween} ${style.marginLeft} `}>

              <div className={`${isPrintClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginRight20}`} >
                <SearchOutlinedIcon sx={{ fontSize: isPrintClicked ? 20 : 25, color: isPrintClicked ? '#fff' : '#857AEF' }} />
              </div>
              <div className={`${isPrintClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginRight}`} >
                <PrintOutlinedIcon sx={{ fontSize: isPrintClicked ? 20 : 25, color: isPrintClicked ? '#fff' : '#857AEF' }} />
              </div>

            </div>
          </div>

          <div className={`${style.bigCardStyle}`}>
            {isLoading ?
              <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
                <CircularProgress sx={{ color: "#7165E3" }} />
              </div> :
              <div ref={componentRef}>
                <div className={`${style.reduceMarginTop10} staffApplicationList`} ref={PDFRef}>
                  <TableTwo
                    tableHeaderValues={tableHeaderValues}
                    tableDataValues={tableDataValues}
                    tableData={selectedContract === 'Applicants' ? ApplicantsProcessData : selectedContract === "Applications" ? ApplicationData : selectedContract === "Clarifications" ? ClarificationData : ApprovedData}
                    getNewContract={getNewContract}
                    getContractType={getContractType}
                    getSelectedContractType={getSelectedContractType}
                    getContractIdFromActive={getContractIdFromActive}
                    gridStyle={gridStyle}
                    actions={actions}
                    getSelectedPage={getSelectedPage}
                    scrollStyle={style.contractScrollStyle}
                    tableSortValues={tableSortValues}
                    heading={'There are no Record for you to manage'}
                    // subHeading={'To add a new contract click on'}
                    // onClickText={'Click To View A Short Tutorial On How To Add A Contract'}
                    // buttonComponent={<div className={`${style.addStyle} ${style.alignCenter} ${style.marginLeft20}`}>
                    //   <AddCircleOutlineIcon sx={{ fontSize: 20, color: 'white' }} />
                    // </div>}
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

export default StaffApplicationList;
