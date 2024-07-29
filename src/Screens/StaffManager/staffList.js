import React, { useState, createRef, useRef } from 'react';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import TimeSmartLogo from './../../images/timeSmartAI-logo-withoutbg.png';
import StaffTiles from './staffTiles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CircularProgress from "@mui/material/CircularProgress";
import { format } from 'date-fns';
import TableTwo from '../../Components/TableDesignTwo';
import NotificationsIcon from "./../../images/notificationsIcon.png";
import style from './index.module.scss';
import SideBar from '../../Components/Sidebar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const StaffList = ({ isLoading, getSelectedApplicant, selectedApplicant, getActiveApplicantView }) => {
  const PDFRef = createRef();
  const componentRef = useRef(null);

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

  const activeHeaderValues = ["",
    "Work Item ",
    "Type",
    "Applicant / Staff Name",
    "Manager",
    "Created On",
    "Due Date",
    ""
  ];
  const activeColSortValues = [false, false, false, false, false, true, true, false, false];
  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDraft, setIsDraft] = useState(true);
  const [metadata, setMetadata] = useState();

  let dot = [];
  let dotTooltipValues = [];
  let effectiveDate = [];
  let manager = [];
  let lastUpdated = [];
  let action = [];
  let applicantStaffName = [];
  let type = [];
  let workItem = [];
  let workItemHoverText = [];

  const getActiveContractsValues = () => {
    dot = [];
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

  const activeActionsData = [
    { 'data': 'View', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Delete Incomplete', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send for Review', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Process Rejection', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Resend Link', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send RFD', 'requiredValue': 'boolean', "onClick": '' },
    { 'data': 'Send Reminder', 'requiredValue': 'boolean', "onClick": '' },
  ]

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  }

  let tableHeaderValues = activeHeaderValues;
  let tableSortValues = activeColSortValues;
  let tableDataValues = getActiveContractsValues();
  let actions = activeActionsData;
  let gridStyle = selectedApplicant === 'activestaffs' ? style.activeStaffGrid : selectedApplicant === "draft" ? (isDraft ? style.draftContractGrid : style.activationPendingContractGrid) : selectedApplicant === "upcomingrenewals" ? style.upcomingContractGrid : style.expiredContractGrid;

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
          <StaffTiles getSelectedApplicant={getSelectedApplicant} selectedApplicant={selectedApplicant}
            metadata={metadata} />
          <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
            <div className={`${style.spaceBetween} ${style.marginLeftRight20}`}>
              <div className={`${style.displayInRow} ${style.marginTop10}`}>
                {selectedApplicant === 'activestaffs' ? (
                  <>
                    <div className={`${style.headingForStaffs} ${style.bottomTextStyle}`}>TASKS TO ADDRESS</div>
                  </>
                ) : (
                  <>
                    <div className={`${style.headingForStaffs} ${style.bottomTextStyle}`} >{selectedApplicant}</div>
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
                    gridStyle={gridStyle}
                    actions={actions}
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
