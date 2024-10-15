import React, { useState, useEffect, createRef, useCallback, useRef } from 'react';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import TimeSmartLogo from './../../images/timeSmartAI-logo-withoutbg.png';
import StaffApplicationTiles from './activeStaffTiles';
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

const ActiveStaffList = ({ isLoading, getSelectedTab, selectedTab, getActiveApplicationView }) => {
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

  const applicantHeaderValues = ["", "Applicant Name", "Applicant Type", "Department", "Docs", "Data & Disclosures", "Last Updated", "Reappointment Date", ""];
  const approvedHeaderValues = ["", "Applicant Name", "Type", "Notes", "Last Updated On", ""];
  const locumHeaderValues = ["", "Applicant Name", "Applicant Type", "Department", "Docs", "Data & Disclosures", "Last Updated", "Reappointment Date", ""];

  const applicantColSortValues = [false, false, false, false, false, false];
  const approvedColSortValues = [false, false, false, false, false, false, false, false, false];
  const locumColSortValues = [false, false, false, false, false, false];

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
      dot.push(data?.subStatus === 'REVIEW_INPROGRESS' ? 'yellow' : data?.subStatus === 'COMPLETED ' ? 'green' : 'grey');
      applicantName.push(`${data?.applicant?.name?.lastName},  ${data?.applicant?.name?.firstName}` || '');
      applicantId.push(data?.Id);
      applicantType.push(data?.providerType.serviceProviderType);
      department.push(data?.department);
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
      capManager.push(data?.capManager || 'keerthana ');
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
      { "type": "text", "value": capManager },
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

  const approvedActionsData = [
    { 'data': 'Add as active staff', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send follow up disclosures', 'requiredValue': 'boolean', "onClick": '' },
  ]

  const locumActionsData = [
    { 'data': 'View & Verify', 'requiredValue': 'boolean', "onClick": onClickViewAndVerifyFunction },
    { 'data': 'Send for Committee Review', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send Reminder for Required Documents', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Request for Clarification', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'From Applicant', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'From Internal Approver', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'From Institution', 'requiredValue': 'boolean', "onClick": '' },
  ]
  const getIsExpanded = (value) => {
    setIsExpanded(value);
  }

  let tableHeaderValues = selectedTab === 'permanentStaff' ? applicantHeaderValues : selectedTab === 'locumStaff' ? locumHeaderValues : approvedHeaderValues;
  let tableSortValues = selectedTab === 'permanentStaff' ? applicantColSortValues : selectedTab === 'locumStaff' ? locumColSortValues : approvedColSortValues;
  let tableDataValues = selectedTab !== 'permanentStaff' ? getApprovedValues() : getApplicantValues();
  let actions = selectedTab === 'permanentStaff' ? applicantActionsData : selectedTab === 'locumStaff' ? locumActionsData : approvedActionsData;
  let gridStyle = selectedTab === 'permanentStaff' ? style.applicantStaffGrid : selectedTab === 'locumStaff' ? style.locumStaffGrid : style.approvedStaffGrid;

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
            {`STAFF MANAGER > APPLICATIONS`}
          </div>

          <div className={`${style.spaceBetween} ${style.marginTop20} ${style.marginLeft30} `}>
            <StaffApplicationTiles getSelectedTab={getSelectedTab} selectedTab={selectedTab} />

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
                  />
                </div>
              </div>
            }
          </div>
        </div>
      </div >
      <div className={style.spaceBetween}>
        <div className={`${style.displayInRow}`}>
          <p className={`${style.poweredBy} ${style.marginTop10}`}>Powered by - CAPSmart</p>
          {/* <img src={TimeSmartLogo} alt="footer" className={`${style.footerIconStyle} ${style.marginLeft10}`} /> */}
        </div>
        <p className={style.poweredBy}>© {new Date().getFullYear()} CAPSmart</p>
      </div>

    </div >
  )
}

export default ActiveStaffList;
