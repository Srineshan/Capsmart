import React, { useState, useEffect, createRef, useCallback, useRef } from 'react';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import CapSmartTransparent from './../../images/capSmartTransparent.png';
import ActionStaffTiles from './activeStaffTiles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from "@mui/material/CircularProgress";
import { format } from 'date-fns';
import TableTwo from '../../Components/TableDesignTwo';
import PublicIcon from '@mui/icons-material/Public';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import style from './index.module.scss';
import SideBar from '../../Components/Sidebar';
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from 'react-router-dom';
import { GET, PUT, POST, TenantID } from '../dataSaver';
import CircleIcon from '@mui/icons-material/Circle';
import { SuccessToaster } from '../../utils/toaster';
import { ErrorToaster } from '../../utils/toaster';

const ActiveStaffList = ({ isLoading, getSelectedTab, selectedTab, getTitleCounts }) => {
  const PDFRef = createRef();
  const navigate = useNavigate();
  const componentRef = useRef(null);

  const [rejectionTab, setRejectionTab] = useState("rejected");
  const [requestAppointment, setRequestAppointment] = useState(null);
  const [sentCompletion, setSentCompletion] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showCardAppointment, setShowCardAppointment] = useState(false);
  const [showCardCompletion, setShowCardCompletion] = useState(false);

  const [applicationRejected, setApplicationRejected] = useState({
    totalRejections: 0,
    appointmentRequestsDenied: 0,
    applicationsRejected: 0,
    applicationsApprovedButDenied: 0
  });

  const [tableData, setTableData] = useState([]);
  const [rejectionListData, setRejectionListData] = useState([]);
  const [sortField, setSortField] = useState('DEFAULT');
  const [sortValue, setSortValue] = useState('ASCENDING');

  const permanentHeaderValues = ["", "Applicant Name", "Applicant ID", "Applicant Type", "Docs", "Notes", "Last Updated", "Action"];
  const locumHeaderValues = ["", "Applicant Name", "Applicant ID", "Applicant Type", "CR", "COS", "CC", "CC Date", "Last Updated", "Action"];
  const temporaryStaffHeaderValues = ["Applicant Name", "Applicant ID", "Applicant Type", "CC Approval", "COS Approval", "Last Updated"];
  const approvedHeaderValues = ["", "Applicant Name", "Type", "Notes", "Last Updated On", ""];


  const permanentColSortValues = [false, false, false, false, false, , false, false, false];
  const locumColSortValues = [false, false, false, false, false, false, false, false, false, false];
  const temporaryStaffColSortValues = [false, false, false, false, false, false];
  const approvedColSortValues = [false, false, false, false, false, false, false, false, false];


  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showApplicationRejectionDialog, setShowApplicationRejectionDialog] = useState(false);
  const [reFetchMetaData, setReFetchMetaData] = useState(false)

  const getApplicationRejectionDialog = (value) => {
    setShowApplicationRejectionDialog(value);
    setRejectionTab("rejected")
  }

  // const onClickViewAndVerifyFunction = (data) => {
  //   getActiveApplicationView(true);
  // }

  const onClickReappointmentFunction = (data) => {
    reappointmentApplication(data?.id)
    sessionStorage.setItem("applicationId", data?.id);
  };

  useEffect(() => {
    getSentConfirmationCount();
    getRequestAppointmentCount();
    getRejectionCounts();
  }, []);

  useEffect(() => {
    getActiveUserData(selectedTab);
  }, [selectedTab]);

  const getReFetchMetaData = (value) => {
    setReFetchMetaData(value);
  }

  const reappointmentApplication = async (id) => {
    await POST(`application-management-service/staff/${id}/reappoint`)
      .then(response => {
        SuccessToaster('Reappoint Application Send as Email Successfully');
        console.log(response?.data);
        getActiveUserData();
        setReFetchMetaData(true);
        getTitleCounts();
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getActiveUserData = async () => {
    try {
      const response = await GET(
        // `application-management-service/application/workflowUser?tab=${selectedTab}`
        //  `application-management-service/application/workflowUser?tab=${selectedTab}&sortBy=${sortValue}&sortByField=${sortField}&applicationCreationType=REAPPOINTMENT`
        `application-management-service/staff?type=${selectedTab}&status=ACTIVE`
      );
      console.log("Application data", response?.data);
      setTableData(response?.data);
      return response?.data || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getHandleSort = (value, sortBy) => {
    if (sortBy === 'ASCENDING') {
      setSortField(value)
      setSortValue('DESCENDING')
    } else if (sortBy === 'DESCENDING') {
      setSortField('DEFAULT')
      setSortValue('ASCENDING')
    } else if (sortBy === 'NONE') {
      setSortField(value)
      setSortValue('ASCENDING')
    }
  }


  const getRejectionData = async () => {
    try {
      const response = await GET(`application-management-service/application/workflowUser?tab=${rejectionTab}`);
      console.log('Rejection data', response?.data?.applications);
      setRejectionListData(response?.data?.applications);
      return response?.data.applications || [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  };

  const getSentConfirmationCount = async () => {
    await GET('application-management-service/application/sentToApplicant/status')
      .then(response => {
        setSentCompletion(response?.data.totalApplicationsSent || 0);
      })
      .catch(error => {
        console.error('Error fetching request appointment count:', error);

      });
  };

  const getRequestAppointmentCount = async () => {
    await GET('application-management-service/preApplication')
      .then(response => {
        setRequestAppointment(response?.data.numberOfElements || 0);
      })
      .catch(error => {
        console.error('Error fetching request appointment count:', error);

      });
  };

  const getRejectionCounts = async () => {
    await GET('application-management-service/application/rejected/meta')
      .then(response => {
        setApplicationRejected(response?.data);
      })
      .catch(error => {
        console.error('Error fetching rejection counts:', error);
      });
  };

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
  let taskListStatus = [];
  let taskListDotColor = [];
  let cr = [];
  let cos = [];
  let cc = [];
  let ccdate = [];
  let ccapproval = [];
  let cosapproval = [];

  // const getApplicantValues = () => {
  //   dot = [];
  //   applicantName = [];
  //   applicantId = [];
  //   applicantType = [];
  //   department = [];
  //   docs = [];
  //   docsHoverText = [];
  //   docsIcon = [];
  //   dataStatus = [];
  //   disclosures = [];
  //   crs = [];
  //   crsHoverText = [];
  //   notes = [];
  //   notesHoverText = [];
  //   notesIcon = [];
  //   lastUpdated = [];
  //   lastUpdatedBy = [];
  //   capManager = [];
  //   action = [];

  //   tableData?.map(data => {
  //     dot.push(data?.subStatus === 'REVIEW_INPROGRESS' ? 'yellow' : data?.subStatus === 'COMPLETED ' ? 'green' : 'grey');
  //     applicantName.push(`${data?.applicant?.name?.lastName},  ${data?.applicant?.name?.firstName}` || '');
  //     applicantId.push(data?.Id);
  //     applicantType.push(data?.providerType.serviceProviderType);
  //     department.push(data?.department);
  //     docs.push(data?.docs || '2/8');
  //     docsHoverText.push(["Immunization History Verification From PCP pending"])
  //     docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `${data?.subStatus}` }} />);
  //     dataStatus.push(data?.dataStatus || 'yellow');
  //     disclosures.push(data?.disclosures || '7/9');
  //     crs.push(data?.crs || '0');
  //     crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"])
  //     notes.push(data?.notes || '1');
  //     notesIcon.push(<NoteAltOutlinedIcon style={{ fontSize: 20, color: `#52575D` }} />);
  //     notesHoverText.push(["June 13 00:00, Nina Grealy", "Lorem ipsum dolor sit amet, consetetur sadipscing."])
  //     lastUpdated.push(format(new Date(data?.lastModifiedDate), 'MMM dd, yyyy'))
  //     lastUpdatedBy.push('-')
  //     // const lastUpdatedDate = new Date(data?.lastModifiedDate);
  //     // lastUpdated.push(isNaN(lastUpdatedDate.getTime()) ? 'Invalid Date' : format(lastUpdatedDate, 'MM-dd-yyyy'));
  //     capManager.push(data?.capManager || 'keerthana ');
  //     action.push(true);
  //   })

  //   return [
  //     { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
  //     { "type": "text", "value": applicantName },
  //     { "type": "text", "value": applicantType },
  //     { "type": "text", "value": department },
  //     { "type": "iconWithCount", "value": docs, "hoverText": docsHoverText, 'isShowHoverText': true, "icon": docsIcon },
  //     { "type": "dot", "value": dataStatus },
  //     { "type": "iconWithCount", "value": disclosures, "hoverText": docsHoverText, 'isShowHoverText': true, "icon": docsIcon },
  //     { "type": "countWithHover", "value": crs, "hoverText": crsHoverText },
  //     { "type": "iconWithCount", "value": notes, "hoverText": notesHoverText, 'isShowHoverText': true, "icon": notesIcon },
  //     { "type": "text", "value": lastUpdated },
  //     { "type": "text", "value": lastUpdatedBy },
  //     { "type": "text", "value": capManager },
  //     { "type": "action", "value": action },
  //   ];
  // }

  const getPermanentValues = () => {
    dot = [];
    applicantName = [];
    applicantId = [];
    applicantType = [];
    department = [];
    docs = [];
    docsHoverText = [];
    docsIcon = [];
    dataStatus = [];
    // disclosures = [];
    crs = [];
    crsHoverText = [];
    notes = [];
    notesHoverText = [];
    notesIcon = [];
    lastUpdated = [];
    lastUpdatedBy = [];
    capManager = [];
    taskListStatus = [];
    taskListDotColor = [];
    action = [];

    tableData?.map((data) => {
      dot.push(
        data?.status === "SUBMITTED"
          ? "yellow"
          : data?.status === "APPROVED"
            ? "green"
            : "grey"
      );
      applicantName.push(
        `${data?.applicant?.name?.firstName.charAt(0).toUpperCase() + data?.applicant?.name?.firstName.slice(1).toLowerCase()},  ${data?.applicant?.name?.lastName.toUpperCase()}` ||
        " "
      );
      // applicantId.push(data?.displayId || "123");
      applicantId.push("123");
      // applicantType.push(data?.providerType?.serviceProviderType || "Doctor");
      applicantType.push("Doctor");
      // department.push(
      //   data?.basicDetails?.departmentSpecialty?.department || "-"
      // );
      // docs.push(data?.documents?.verifiedCount + "/" + data?.documents?.uploadedCount  || "1/2");
      docs.push("1/2");
      // docsHoverText.push([
      //   "Immunization History Verification From PCP pending",
      // ]);
      // const documentDetails = data?.documents?.documentDetails || [];
      // const docHoverTextArray = documentDetails.length > 0 ? documentDetails.map(doc => doc.documentType) : ["-"];
      // docsHoverText.push(docHoverTextArray);
      // docsIcon.push(
      //   <TextSnippetOutlinedIcon
      //     style={{ fontSize: 20, color: `#52575D` }}
      //   />
      // );

      // if (data?.documents?.verifiedCount === data?.documents?.uploadedCount) {
      //   docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#00C07F` }}/>);
      // } else if (data?.documents?.verifiedCount === 0) {
      //   docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#94979A` }}/>);
      // } else {
      //   docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#FEC106` }}/>);
      // }
      docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#FEC106` }} />);
      // dataStatus.push(data?.dataStatus || "green");
      // dataStatus.push(data?.dataStatus === "REVIEW_INPROGRESS"
      //   ? "yellow"
      //   : data?.status === "APPROVED"
      //   ? "green"
      //   : "grey");
      // disclosures.push(data?.disclosures || '7/9');
      // crs.push(data?.clarificationRequiredFor || "-");
      // crs.push("-");
      crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"]);
      // notes.push(data?.notes.length || "0");
      notes.push("0");
      notesIcon.push(
        <NoteAltOutlinedIcon style={{ fontSize: 20, color: `#52575D` }} />
      );
      // const notesDetails = data?.notes || [];
      // const notesHoverTextArray = notesDetails.length > 0 ? notesDetails.map(note => note.notes) : ["-"];
      notesHoverText.push([
        "June 13 00:00, Nina Grealy",
        "Lorem ipsum dolor sit amet, consetetur sadipscing.",
      ]);
      // notesHoverText.push(notesHoverTextArray);

      // if (data?.tasks?.completedCount === data?.tasks?.totalCount) {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#00C07F` }}/>);
      // } else if (data?.tasks?.completedCount === 0) {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#94979A` }}/>);
      // } else {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#FEC106` }}/>);
      // }

      // taskListStatus.push(data?.tasks.completedCount + "/" + data?.tasks.totalCount);
      lastUpdated.push(
        format(new Date(data?.lastModifiedDate), "MMM dd, yyyy")
      );
      lastUpdatedBy.push(["-"]);
      // const lastUpdatedDate = new Date(data?.lastModifiedDate);
      // lastUpdated.push(isNaN(lastUpdatedDate.getTime()) ? 'Invalid Date' : format(lastUpdatedDate, 'MM-dd-yyyy'));
      // capManager.push(data?.interviewDetails?.interviewedBy || '- ');
      action.push(true);

      console.log("tabledata" + tableData);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: applicantName },
      { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      // { type: "text", value: department },
      {
        type: "iconWithCount",
        value: docs,
        // hoverText: docsHoverText,
        // isShowHoverText: true,
        icon: docsIcon,
      },
      // { type: "dot", value: dataStatus },
      // { "type": "iconWithCount", "value": disclosures, "hoverText": docsHoverText, 'isShowHoverText': true, "icon": docsIcon },
      // {
      //   type: "countWithHover",
      //   value: crs,
      //   hoverText: crsHoverText,
      //   isShowHoverText: true,
      // },
      {
        type: "iconWithCount",
        value: notes,
        hoverText: notesHoverText,
        isShowHoverText: true,
        icon: notesIcon,
      },
      // { type: "iconWithCount",
      //    value: taskListStatus ,
      //    icon: taskListDotColor },
      // { type: "dot", value: taskListDotColor, tooltipValue: dotTooltipValues },
      {
        type: "iconWithCount",
        value: lastUpdated,
        hoverText: lastUpdatedBy,
        isShowHoverText: true,
      },
      { type: "action", value: action },
    ];
  };

  const getLocumValues = () => {
    dot = [];
    applicantName = [];
    applicantType = [];
    applicantId = [];
    // department = [];
    // commiteeStatus = [];
    // boardStatus = [];
    // ceoStatus = [];
    cr = [];
    cos = [];
    cc = [];
    ccdate = [];
    lastUpdatedOn = [];

    action = [];

    tableData?.map((data) => {
      dot.push(
        data?.status === "REVIEW_INPROGRESS"
          ? "yellow"
          : data?.status === "APPROVED"
            ? "green"
            : "grey"
      );
      applicantName.push(
        `${data?.applicant?.name?.firstName.charAt(0).toUpperCase() + data?.applicant?.name?.firstName.slice(1).toLowerCase()},  ${data?.applicant?.name?.lastName.toUpperCase()}` ||
        " "
      );
      // applicantType.push(data?.providerType.serviceProviderType);
      applicantType.push("Doctor");
      // applicantId.push(data?.displayId);
      applicantId.push("345");
      // department.push(
      //   data?.basicDetails?.departmentSpecialty?.department || "-"
      // );
      // commiteeStatus.push(data?.commiteeStatus || "yellow");
      // boardStatus.push(data?.boardStatus || "green");
      // ceoStatus.push(data?.ceoStatus || "grey");
      // cr.push(data?.clarificationRequiredFor || "-");
      cr.push("-");
      // cr.push(data?.logs[data.logs.length - 1]?.role)
      // cos.push(data?.boardStatus || "green");
      // cos.push(data?.logs[data.logs.length - 1].workflowAction === "SUBMITTED"
      //   ? "yellow"
      //   : data?.logs[data.logs.length - 1].workflowAction === "APPROVED"
      //   ? "green"
      //   : "grey");
      // if (data?.logs[data.logs.length - 1]?.role === "Chief Of Staff") {
      //   if (data.logs[data.logs.length - 1].workflowAction === "SUBMITTED") {
      //     cos.push("yellow");
      //   } else if (data.logs[data.logs.length - 1].workflowAction === "APPROVED") {
      //     cos.push("green");
      //   }
      // }
      // else {
      //   cos.push("grey"); // If the role is not "Chief of Staff"
      // }
      cos.push("grey");
      cc.push("grey");
      // if (data?.logs[data.logs.length - 2]?.role === "Credentialing Committee") {
      //   if (data.logs[data.logs.length - 2].workflowAction === "SUBMITTED") {
      //     cc.push("yellow");
      //   } else if (data.logs[data.logs.length - 2].workflowAction === "APPROVED") {
      //     cc.push("green");
      //   }
      // }
      // else {
      //   cc.push("grey"); // If the role is not "Chief of Staff"
      // }
      // if (data?.logs[data.logs.length - 2]?.role === "Credentialing Committee") {
      //   ccdate.push(
      //     format(new Date(data?.logs[data.logs.length - 2].createdDate), "MMM dd, yyyy")
      //   )
      // } else { ccdate.push("-") }
      ccdate.push("-")
      lastUpdatedOn.push(
        format(new Date(data?.lastModifiedDate), "MMM dd, yyyy")
      );
      // lastUpdatedBy.push([data?.updatedBy || "-"]);
      action.push(true);
    });

    return [
      { type: "dot", value: dot },
      { type: "text", value: applicantName },
      { type: "text", value: applicantId },
      { type: "text", value: applicantType },

      // { type: "text", value: department },
      // { type: "dot", value: commiteeStatus },
      // { type: "dot", value: boardStatus },
      // { type: "dot", value: ceoStatus },

      { type: "text", value: cr },
      { type: "dot", value: cos },
      { type: "dot", value: cc },
      {
        type: "iconWithCount",
        value: ccdate,
        // hoverText: lastUpdatedBy,
        // isShowHoverText: true,
      },
      {
        type: "iconWithCount",
        value: lastUpdatedOn,
        // hoverText: lastUpdatedBy,
        // isShowHoverText: true,
      },
      { type: "action", value: action },
    ];
  };

  const getTemporaryStaffValues = () => {
    applicantName = [];
    applicantId = [];
    applicantType = [];
    ccapproval = [];
    cosapproval = [];
    taskListStatus = [];
    lastUpdated = [];
    action = [];

    tableData?.map((data) => {
      applicantName.push(
        `${data?.applicant?.name?.firstName.charAt(0).toUpperCase() + data?.applicant?.name?.firstName.slice(1).toLowerCase()},  ${data?.applicant?.name?.lastName.toUpperCase()}` ||
        " "
      );
      applicantId.push(data?.displayId || "123");
      applicantType.push(data?.providerType?.serviceProviderType || "Dentist");
      ccapproval.push(data?.ccapproval || "05/05/2024");
      // ccapproval.push(
      //   format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      // );
      // if (data?.logs[data.logs.length - 1]?.role === "Credentialing Committee") {
      //   ccapproval.push(
      //     format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      //   )
      // } else { ccapproval.push("-") }
      cosapproval.push(data?.cosapproval || "05/05/2024");
      // cosapproval.push(
      //   format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      // );
      // if (data?.logs[data.logs.length - 2]?.role === "Chief Of Staff") {
      //   cosapproval.push(
      //     format(new Date(data?.logs[data.logs.length - 2].createdDate), "MMM dd, yyyy")
      //   )
      // } else { cosapproval.push("-") }
      // taskListStatus.push("2/3");
      lastUpdated.push(
        format(new Date(data?.lastModifiedDate), "MMM dd, yyyy")
      );
      // lastUpdatedBy.push(["-"]);
      // const lastUpdatedDate = new Date(data?.lastModifiedDate);
      // lastUpdated.push(isNaN(lastUpdatedDate.getTime()) ? 'Invalid Date' : format(lastUpdatedDate, 'MM-dd-yyyy'));
      // capManager.push(data?.interviewDetails?.interviewedBy || '- ');
      action.push(true);

      console.log("tabledata" + tableData);
    });

    return [
      { type: "text", value: applicantName },
      { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      { type: "text", value: ccapproval },
      { type: "text", value: cosapproval },
      // { type: "text", value: taskListStatus },
      {
        type: "iconWithCount",
        value: lastUpdated,
        hoverText: lastUpdatedBy,
        isShowHoverText: true,
      },
      // { type: "action", value: action },
    ];
  };


  const getApprovedValues = () => {
    dot = [];
    applicantName = [];
    applicantType = [];
    approvedNotes = [];
    lastUpdatedOn = [];
    action = [];

    tableData?.map(data => {
      dot.push(data?.subStatus);
      applicantName.push(`${data?.applicant?.name?.lastName},  ${data?.applicant?.name?.firstName}` || '');
      applicantType.push(data?.providerType.serviceProviderType);
      approvedNotes.push(data?.approvedNotes);
      lastUpdatedOn.push(format(new Date(data?.lastModifiedDate), 'MMM dd, yyyy'));
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

  const permanentActionsData = [
    { 'data': 'Create Reappointment Application', 'requiredValue': 'boolean', onClick: onClickReappointmentFunction },
    // { 'data': 'Send for Committee Review', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'Send Reminder for Required Documents', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'Request for Clarification', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'From Applicant', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'From Internal Approver', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'From Institution', 'requiredValue': 'boolean', "onClick": '' },
  ]

  const approvedActionsData = [
    { 'data': 'Add as active staff', 'requiredValue': 'boolean', onClick: onClickReappointmentFunction },
    { 'data': 'Send follow up disclosures', 'requiredValue': 'boolean', "onClick": '' },
  ]

  const locumActionsData = [
    { 'data': 'Create Reappointment Application', 'requiredValue': 'boolean', onClick: onClickReappointmentFunction },
    // { 'data': 'Send for Committee Review', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'Send Reminder for Required Documents', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'Request for Clarification', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'From Applicant', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'From Internal Approver', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'From Institution', 'requiredValue': 'boolean', "onClick": '' },
  ]
  const getIsExpanded = (value) => {
    setIsExpanded(value);
  }

  let tableHeaderValues = selectedTab === 'PERMANENT' ? permanentHeaderValues : selectedTab === 'LOCUM' ? locumHeaderValues : selectedTab === 'PROVISIONAL' ? temporaryStaffHeaderValues : approvedHeaderValues;
  let tableSortValues = selectedTab === 'PERMANENT' ? permanentColSortValues : selectedTab === 'LOCUM' ? locumColSortValues : selectedTab === 'PROVISIONAL' ? temporaryStaffColSortValues : approvedColSortValues;
  // let tableDataValues = selectedTab !== 'applicantsToProcess' ? getApplicantValues() : selectedTab === 'level-1' ? getApplicationValues() : selectedTab === 'level-1' ? getApplicationValues() : getApplicationValues();
  let tableDataValues =
    selectedTab === "PERMANENT"
      ? getPermanentValues()
      : selectedTab === "LOCUM"
        ? getLocumValues()
        : selectedTab === "PROVISIONAL"
          ? getTemporaryStaffValues()
          // :[];

          // : getApprovedValues();
          : getPermanentValues();
  let actions = selectedTab === 'PERMANENT' ? permanentActionsData : selectedTab === 'LOCUM' ? locumActionsData : selectedTab === 'PROVISIONAL' ? locumActionsData : approvedActionsData;
  let gridStyle = selectedTab === 'PERMANENT' ? style.permanentStaffGrid : selectedTab === 'LOCUM' ? style.locumStaffGrid : selectedTab === 'PROVISIONAL' ? style.temporaryStaffGrid : style.approvedStaffGrid;

  return (
    <div className={style.margin20}>
      <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
        <div>
          <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
            {/* <div className={`${style.addStyle}  ${style.applicationButton} ${style.spaceBetween} ${style.marginTop10} ${style.alignCenter} ${style.cursorPointer} ${style.cardStyle}`} >
              <div className={`${style.displayInRow} ${style.marginLeftRight10} `} onClick={() => navigate('/createStaffMemberApplication')}>
                CREATE NEW APPLICATION
              </div>
              <div className={`${style.displayInRow} ${style.marginLeft20} `} >
                <AddCircleOutlineIcon sx={{ fontSize: 20, color: 'white' }} />
              </div>
            </div> */}

            {/* <div className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
              <div className={`${style.spaceBetween}  ${style.marginLeftRight10}`}>
                <div className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}>
                  Requests For Appointment ({requestAppointment})
                </div>
                <div className={`${style.marginLeft10} `} >
                  {!showCardAppointment ? (
                    <AddIcon sx={{ fontSize: 20, color: '#0e5197


', cursor: 'pointer' }} onClick={() => setShowCardAppointment(!showCardAppointment)} />
                  ) : (
                    <RemoveIcon sx={{ fontSize: 20, color: '#0e5197


', cursor: 'pointer' }} onClick={() => setShowCardAppointment(!showCardAppointment)} />
                  )}
                </div>
              </div>
              {showCardAppointment && (<>
                <div>
                  <div className={`${style.displayInCol} ${style.marginTop}`}>
                    <div className={`${style.warningTextAlign} ${style.staffTextStyle} ${style.marginRight10}`}>
                      <p className={style.staffPragraphStyle}>Dave FILIP <span style={{
                        color: "#52575D",
                        font: "normal normal bold 16px/24px proxima-nova"
                      }}> (Doctor) </span> <span className={style.dayTextStyle}
                        style={{
                          border: "0.4px solid #14B15A",
                          color: "#14B15A"
                        }}> +1 Day</span> </p> <span>
                        <PermIdentityIcon sx={{ fontSize: 20, color: '#0e5197


', marginRight: "5px" }} />
                      </span>
                    </div>
                  </div>
                  <div className={`${style.displayInCol} ${style.marginTop}`}>
                    <div className={`${style.warningTextAlign} ${style.staffTextStyle} ${style.marginRight10}`}>
                      <p className={style.staffPragraphStyle}>Dave FILIP <span style={{
                        color: "#52575D",
                        font: "normal normal bold 16px/24px proxima-nova"
                      }}> (Doctor) </span> <span className={style.dayTextStyle}
                        style={{
                          border: "0.4px solid #FEC106",
                          color: "#FEC106"
                        }}> +1 Day</span> </p> <span>
                        <PublicIcon sx={{ fontSize: 20, color: '#0e5197


', marginRight: "5px" }} />
                      </span>
                    </div>
                  </div>
                  <div className={`${style.displayInCol} ${style.marginTop}`}>
                    <div className={`${style.warningTextAlign} ${style.staffTextStyle} ${style.marginRight10}`}>
                      <p className={style.staffPragraphStyle}>Anna KARIN <span style={{
                        color: "#52575D",
                        font: "normal normal bold 16px/24px proxima-nova"
                      }}> (Doctor) </span> <span className={style.dayTextStyle}
                        style={{
                          border: "0.4px solid #F94848",
                          color: "#F94848"
                        }}> +1 Day</span> </p> <span>
                        <PublicIcon sx={{ fontSize: 20, color: '#0e5197


', marginRight: "5px" }} />
                      </span>
                    </div>
                  </div>
                </div>
              </>)}
            </div> */}

            {/* <div className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
              <div className={`${style.spaceBetween}  ${style.marginLeftRight10}`}>
                <div className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}>
                  Sent for Completion ({sentCompletion})
                </div>
                <div className={`${style.marginLeft10} `} >
                  {!showCardCompletion ? (
                    <AddIcon sx={{ fontSize: 20, color: '#0e5197


', cursor: 'pointer' }} onClick={() => setShowCardCompletion(!showCardCompletion)} />
                  ) : (
                    <RemoveIcon sx={{ fontSize: 20, color: '#0e5197


', cursor: 'pointer' }} onClick={() => setShowCardCompletion(!showCardCompletion)} />
                  )}
                </div>
              </div>
              {showCardCompletion && (<>
                <div className={`${style.displayInCol} ${style.marginTop}`}>
                  <div className={`${style.warningTextAlign} ${style.staffTextStyle}`}>
                    <div className={style.progressbarStyle}>
                      <div className={style.spaceBetween}>
                        <div className={style.statisticsProgress}>
                          <div className={`${style.greyDotStyle} `}></div>
                          <div className={style.marginLeft10}>Jane DOE</div> <span className={style.textStyleProgress}> (Nurse) </span></div>
                        <p className={style.progressTopText}>Due in 15 Days</p>
                      </div>
                      <ProgressBar completed={6} isLabelVisible={false} height='5px' bgColor='#0e5197


' baseBgColor="#E9E9F0" className={style.marginLeft20} />
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
                      <ProgressBar completed={100} isLabelVisible={false} height='5px' bgColor='#0e5197


' baseBgColor="#E9E9F0" className={style.marginLeft20} />
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
                      <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#0e5197


' baseBgColor="#E9E9F0" className={style.marginLeft20} />
                      <div className={style.progressBottomText}>40% remaining</div>
                    </div>
                  </div>
                </div>
              </>)}
            </div> */}

            {/* <div className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
              <div className={`${style.displayInRow}  ${style.marginLeftRight10}`}>
                <div className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}>
                  Rejected/Declined ({applicationRejected.totalRejections})
                </div>
                <div className={`${style.marginLeft10} `} >
                  {!showCardDetails ? (
                    <AddIcon sx={{ fontSize: 20, color: '#0e5197


', cursor: 'pointer' }} onClick={() => setShowCardDetails(!showCardDetails)} />
                  ) : (
                    <RemoveIcon sx={{ fontSize: 20, color: '#0e5197


', cursor: 'pointer' }} onClick={() => setShowCardDetails(!showCardDetails)} />
                  )}
                </div>
              </div>
              {
                showCardDetails && (<>
                  <div className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}>
                    Appointment Requests Denied ({applicationRejected.appointmentRequestsDenied})
                  </div>
                  <div className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}>
                    Applications Rejected ({applicationRejected.applicationsRejected})
                  </div>
                  <div className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}>
                    Applications Approved But Declined ({applicationRejected.applicationsApprovedButDenied})
                  </div>
                </>)
              }
            </div> */}


          </SideBar>
        </div>
        <div>
          <div className={`${style.displayInRow} ${style.spaceBetween} ${style.headingForStaffs} ${style.bottomTextStyle}`}>
            {`STAFF MANAGER > ACTIVE STAFF`}
          </div>

          <div className={`${style.spaceBetween} ${style.marginTop20} ${style.marginLeft30} `}>
            <ActionStaffTiles getSelectedTab={getSelectedTab} selectedTab={selectedTab} reFetchMetaData={reFetchMetaData} getReFetchMetadata={getReFetchMetaData} />

            <div className={`${style.spaceBetween} ${style.marginLeft} `}>
              <div className={`${isPrintClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginRight20}`} >
                <SearchOutlinedIcon sx={{ fontSize: isPrintClicked ? 20 : 25, color: isPrintClicked ? '#fff' : '#0e5197' }} />
              </div>
              <div className={`${isPrintClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginRight}`} >
                <PrintOutlinedIcon sx={{ fontSize: isPrintClicked ? 20 : 25, color: isPrintClicked ? '#fff' : '#0e5197' }} />
              </div>

            </div>
          </div>

          <div className={`${style.bigCardStyle}`}>
            {isLoading ?
              <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
                <CircularProgress sx={{ color: "#0e5197" }} />
              </div> :
              <div ref={componentRef}>
                <div className={`${style.reduceMarginTop10} ${style.margin20} staffApplicationList`} ref={PDFRef}>
                  <TableTwo
                    tableHeaderValues={tableHeaderValues}
                    tableDataValues={tableDataValues}
                    tableData={tableData}
                    gridStyle={gridStyle}
                    actions={actions}
                    scrollStyle={style.contractScrollStyle}
                    tableSortValues={tableSortValues}
                    heading={'There are no Record for you to manage'}
                    onClickFunction={() => { }}
                    getHandleSort={getHandleSort}
                    sortValue={{ sortBy: sortValue, sortByField: sortField }}
                  />
                </div>
              </div>
            }
          </div>
        </div>
      </div >
      <div className={style.spaceBetween}>
        <div className={`${style.displayInRow}`}>
          <p className={`${style.poweredBy} ${style.marginTop10}`}>Powered by</p>
          <img src={CapSmartTransparent} alt="footer" className={`${style.footerIconStyle} ${style.marginLeft10}`} />
        </div>
        <p className={style.poweredBy}>© {new Date().getFullYear()} Hapicare</p>
      </div>

    </div >
  )
}

export default ActiveStaffList;
