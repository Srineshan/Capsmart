import React, { useState, useEffect, createRef, useCallback, useRef } from 'react';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import TimeSmartLogo from './../../images/timeSmartAI-logo-withoutbg.png';
import StaffApplicationTiles from './staffApplicationTiles';
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
import ApplicationRejection from './applicationRejectionDialog';
import { useNavigate } from 'react-router-dom';
import { GET, PUT, POST, TenantID } from '../dataSaver';
import ReactToPrint, { useReactToPrint } from 'react-to-print';


const StaffApplicationList = ({ isLoading, getSelectedTab, selectedTab, getActiveApplicationView }) => {
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

  const applicantHeaderValues = ["", "Applicant Name", "Applicant Type", "Department", "Docs", "Data", "Disclosures", "CRs", "Notes", "Last Updated", "Last Updated By", ""];
  const applicationHeaderValues = ["", "Applicant Name", "Applicant Type", "Department", "Commitee", "Board", "CEO", "Last Updated On", "Last Updated by", ""];
  const clarificationHeaderValues = ["", "Applicant Name", "Type", "Clarification Title", "Raised By", "Created On", "Last Updated On", ""];
  const approvedHeaderValues = ["", "Applicant Name", "Type", "Notes", "Last Updated On", ""];

  const applicantColSortValues = [false, false, false, false, false, false, false, false, false];
  const applicationColSortValues = [false, false, false, false, false, false, false, false, false];
  const clarificationColSortValues = [false, false, false, false, false, false, false, false, false];
  const approvedColSortValues = [false, false, false, false, false, false, false, false, false];

  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showApplicationRejectionDialog, setShowApplicationRejectionDialog] = useState(false);


  const getApplicationRejectionDialog = (value) => {
    setShowApplicationRejectionDialog(value);
    setRejectionTab("rejected")
  }

  const onClickViewAndVerifyFunction = (data) => {
    getActiveApplicationView(true);
  }

  useEffect(() => {
    getSentConfirmationCount();
    getRequestAppointmentCount();
    getRejectionCounts();
  }, []);

  useEffect(() => {
    getWorkflowUserData(selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    getRejectionData(rejectionTab);
  }, [rejectionTab, showApplicationRejectionDialog]);

  const handleIconClick = () => {
    setShowCardDetails(prev => !prev);
  };

  const getWorkflowUserData = async () => {
    try {
      const response = await GET(`application-management-service/application/workflowUser?tab=${selectedTab}`);
      console.log('Application data', response?.data.applications);
      setTableData(response?.data?.applications);
      return response?.data.applications || [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  };

  console.log("rejectionTab", rejectionTab)

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
        setSentCompletion(response?.data || null);
        console.log("sentCompletion", response?.data);
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


  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrintClick = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Staff Application",
    removeAfterPrint: true
  });

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

  const getApplicantValues = () => {
    dot = [];
    applicantName = [];
    applicantId = [];
    applicantType = [];
    department = [];
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
    lastUpdatedBy = [];
    capManager = [];
    action = [];

    tableData?.map(data => {
      dot.push(data?.status === 'REVIEW_INPROGRESS' ? 'yellow' : data?.status === 'COMPLETED' ? 'green' : 'grey');
      applicantName.push(`${data?.applicant?.name?.lastName},  ${data?.applicant?.name?.firstName}` || '');
      applicantId.push(data?.Id);
      applicantType.push(data?.providerType.serviceProviderType);
      department.push(data?.sites?.siteDepartments?.site?.department?.name || '-');
      docs.push(data?.docs || '2/8');
      docsHoverText.push(["Immunization History Verification From PCP pending"])
      docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `${data?.subStatus}` }} />);
      dataStatus.push(data?.dataStatus || 'yellow');
      disclosures.push(data?.disclosures || '7/9');
      crs.push(data?.crs || '0');
      crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"])
      notes.push(data?.notes || '1');
      notesIcon.push(<NoteAltOutlinedIcon style={{ fontSize: 20, color: `#52575D` }} />);
      notesHoverText.push(["June 13 00:00, Nina Grealy", "Lorem ipsum dolor sit amet, consetetur sadipscing."])
      lastUpdated.push(format(new Date(data?.lastModifiedDate), 'MMM dd, yyyy'))
      lastUpdatedBy.push('-')
      // const lastUpdatedDate = new Date(data?.lastModifiedDate);
      // lastUpdated.push(isNaN(lastUpdatedDate.getTime()) ? 'Invalid Date' : format(lastUpdatedDate, 'MM-dd-yyyy'));
      // capManager.push(data?.interviewDetails?.interviewedBy || '- ');
      action.push(true);
    })

    return [
      { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
      { "type": "text", "value": applicantName },
      { "type": "text", "value": applicantType },
      { "type": "text", "value": department },
      { "type": "iconWithCount", "value": docs, "hoverText": docsHoverText, 'isShowHoverText': true, "icon": docsIcon },
      { "type": "dot", "value": dataStatus },
      { "type": "iconWithCount", "value": disclosures, "hoverText": docsHoverText, 'isShowHoverText': true, "icon": docsIcon },
      { "type": "countWithHover", "value": crs, "hoverText": crsHoverText },
      { "type": "iconWithCount", "value": notes, "hoverText": notesHoverText, 'isShowHoverText': true, "icon": notesIcon },
      { "type": "text", "value": lastUpdated },
      { "type": "text", "value": lastUpdatedBy },
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

    tableData?.map(data => {
      dot.push("");
      applicantName.push(`${data?.applicant?.name?.lastName},  ${data?.applicant?.name?.firstName}` || '');
      applicantType.push(data?.providerType.serviceProviderType);
      department.push(data?.sites?.siteDepartments?.site?.department?.name || '-');
      commiteeStatus.push(data?.commiteeStatus || 'yellow');
      boardStatus.push(data?.boardStatus || 'green');
      ceoStatus.push(data?.ceoStatus || 'grey');
      lastUpdatedOn.push(format(new Date(data?.lastModifiedDate), 'MMM dd, yyyy'))
      lastUpdatedBy.push(data?.updatedBy || '-');
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

    tableData?.map(data => {
      dot.push(data?.subStatus || 'green');
      applicantName.push(`${data?.applicant?.name?.lastName},  ${data?.applicant?.name?.firstName}` || '');
      applicantType.push(data?.providerType.serviceProviderType);
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

  const applicantActionsData = [
    { 'data': 'View & Verify', 'requiredValue': 'boolean', "onClick": onClickViewAndVerifyFunction },
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

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  }

  let tableHeaderValues = selectedTab === 'applicantsToProcess' ? applicantHeaderValues : selectedTab === "applicationsUnderReview" ? applicationHeaderValues : selectedTab === "clarificationsRequired" ? clarificationHeaderValues : approvedHeaderValues;
  let tableSortValues = selectedTab === 'applicantsToProcess' ? applicantColSortValues : selectedTab === "applicationsUnderReview" ? applicationColSortValues : selectedTab === "clarificationsRequired" ? clarificationColSortValues : approvedColSortValues;
  let tableDataValues = selectedTab === 'applicantsToProcess' ? getApplicantValues() : selectedTab === "applicationsUnderReview" ? getApplicationValues() : selectedTab === "clarificationsRequired" ? getClarificationValues() : getApprovedValues();
  let actions = selectedTab === 'applicantsToProcess' ? applicantActionsData : selectedTab === "applicationsUnderReview" ? applicationActionsData : selectedTab === "clarificationsRequired" ? clarificationActionsData : approvedActionsData;
  let gridStyle = selectedTab === 'applicantsToProcess' ? style.applicantStaffGrid : selectedTab === "applicationsUnderReview" ? style.applicationStaffGrid : selectedTab === "clarificationsRequired" ? style.clarificationStaffGrid : style.approvedStaffGrid;

  return (
    <div className={style.margin20}>
      <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
        <div>
          <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
            <div className={`${style.addStyle}  ${style.applicationButton} ${style.spaceBetween} ${style.marginTop10} ${style.alignCenter} ${style.cursorPointer} ${style.cardStyle}`} >
              <div className={`${style.displayInRow} ${style.marginLeftRight10} `} onClick={() => navigate('/createStaffMemberApplication')}>
                CREATE NEW APPLICATION
              </div>
              <div className={`${style.displayInRow} ${style.marginLeft20} `} >
                <AddCircleOutlineIcon sx={{ fontSize: 20, color: 'white' }} />
              </div>
            </div>

            {/* <div className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
              <div className={`${style.spaceBetween}  ${style.marginLeftRight10}`}>
                <div className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}>
                  Requests For Appointment ({requestAppointment})
                </div>
                <div className={`${style.marginLeft10} `} >
                  {!showCardAppointment ? (
                    <AddIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setShowCardAppointment(!showCardAppointment)} />
                  ) : (
                    <RemoveIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setShowCardAppointment(!showCardAppointment)} />
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
                        <PermIdentityIcon sx={{ fontSize: 20, color: '#7165E3', marginRight: "5px" }} />
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
                        <PublicIcon sx={{ fontSize: 20, color: '#7165E3', marginRight: "5px" }} />
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
                        <PublicIcon sx={{ fontSize: 20, color: '#7165E3', marginRight: "5px" }} />
                      </span>
                    </div>
                  </div>
                </div>
              </>)}
            </div> */}

            <div className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
              <div className={`${style.spaceBetween}  ${style.marginLeftRight10}`}>
                <div className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}>
                  Applications Sent for Completion ({sentCompletion?.totalApplicationsSent || 0})
                </div>
                <div className={`${style.marginLeft10} `} >
                  {!showCardCompletion ? (
                    <AddIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setShowCardCompletion(!showCardCompletion)} />
                  ) : (
                    <RemoveIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setShowCardCompletion(!showCardCompletion)} />
                  )}
                </div>
              </div>

              {showCardCompletion && (
                <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '10px' }}>
                  {sentCompletion?.applicationsStatus?.map((status, index) => (
                    <div key={index} className={`${style.displayInCol} ${style.marginTop}`}>
                      <div className={`${style.warningTextAlign} ${style.staffTextStyle}`}>
                        <div className={style.progressbarStyle}>
                          <div className={style.spaceBetween}>
                            <div className={style.statisticsProgress}>
                              <div className={`${style.greyDotStyle}`}></div>
                              <div className={style.marginLeft10}>{`${status.basicDetail.applicant.name.firstName} ${status.basicDetail.applicant.name.lastName}`}</div>
                              <span className={style.textStyleProgress}> ({status.providerType.serviceProviderType}) </span>
                            </div>
                            <p className={style.progressTopText}>{status.dueDays} Days Due</p>
                          </div>
                          <ProgressBar completed={100 - status.remainingCompletionPercentage} isLabelVisible={false} height='5px' bgColor='#7165E3' baseBgColor="#E9E9F0" className={style.marginLeft20} />
                          <div className={style.progressBottomText}>{status.remainingCompletionPercentage}% remaining</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            <div className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
              <div className={`${style.displayInRow}  ${style.marginLeftRight10}`}>
                <div className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}>
                  Applications Rejected/Declined ({applicationRejected.totalRejections})
                </div>
                <div className={`${style.marginLeft10} `} >
                  {!showCardDetails ? (
                    <AddIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setShowCardDetails(!showCardDetails)} />
                  ) : (
                    <RemoveIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setShowCardDetails(!showCardDetails)} />
                  )}
                </div>
              </div>
              {
                showCardDetails && (<>
                  <div className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}>
                    Appointment Requests Denied ({applicationRejected.appointmentRequestsDenied})
                  </div>
                  <div className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`} onClick={() => { setShowApplicationRejectionDialog(true) }}>
                    Applications Rejected ({applicationRejected.applicationsRejected})
                  </div>
                  <div className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}>
                    Applications Approved But Declined ({applicationRejected.applicationsApprovedButDenied})
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
            <StaffApplicationTiles getSelectedTab={getSelectedTab} selectedTab={selectedTab} />

            <div className={`${style.spaceBetween} ${style.marginLeft} `}>
              <div className={`${isPrintClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginRight20}`} >
                <SearchOutlinedIcon sx={{ fontSize: isPrintClicked ? 20 : 25, color: isPrintClicked ? '#fff' : '#857AEF' }} />
              </div>
              <div className={`${isPrintClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginRight}`}
              >
                <PrintOutlinedIcon sx={{ fontSize: isPrintClicked ? 20 : 25, color: isPrintClicked ? '#fff' : '#857AEF' }} onClick={handlePrintClick} />
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
                    tableData={tableData}
                    gridStyle={gridStyle}
                    actions={actions}
                    scrollStyle={style.contractScrollStyle}
                    tableSortValues={tableSortValues}
                    heading={'There are no Record for you to manage'}
                    onClickFunction={() => { }}
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

      {
        showApplicationRejectionDialog && (
          <ApplicationRejection getApplicationRejectionDialog={getApplicationRejectionDialog} rejectionListData={rejectionListData} rejectedCount={applicationRejected.applicationsRejected} />
        )
      }
    </div >
  )
}

export default StaffApplicationList;
