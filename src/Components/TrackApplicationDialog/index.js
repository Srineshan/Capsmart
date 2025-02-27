import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT, POST, TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import CommonCheckBox from "../CommonFields/CommonCheckBox";
import Checkbox from "@mui/material/Checkbox";
import StaffManagerLogo from "./../../images/StaffManagerUser.png";
import ApplicantLogo from "./../../images/ApplicationUser.png";
import HeadOfDepartmentLogo from "./../../images/HODUser.png";
import ChiefOfStaffLogo from "./../../images/COSUser.png";
import CredCommLogo from "./../../images/CCUser.png";
import MACLogo from "./../../images/MACUser.png";
import BODLogo from "./../../images/BODUser.png";
import LoadingScreen from "../LoadingScreen";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

const AddtaskDialog = ({ getIsOpen }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [expandedStepId, setExpandedStepId] = useState(false);
  const [steps, setSteps] = useState([
    {
      id: 1,
      title: 'Application',
      date: 'SUBMITTED ON: MAR 1, 2025',
      status: 'Past Due',
      icon: ApplicantLogo,
      completed: true,
      notes: '',
    },
    {
      id: 2,
      title: 'MSO Verification',
      date: 'DUE ON: MAR 31, 2025',
      status: 'Verified',
      icon: StaffManagerLogo,
      completed: true,
      notes: 'Notes by MSO admin ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna',
    },
    {
      id: 3,
      title: 'Department Head Recommendation',
      date: 'SUBMITTED ON: MAR 1, 2025',
      status: 'Recommended',
      icon: HeadOfDepartmentLogo,
      completed: true,
      notes: '',
    },
    {
      id: 4,
      title: 'Credentialing Committee Recommendation',
      date: 'SUBMITTED ON: MAR 1, 2025',
      status: 'Recommended with Notes',
      icon: CredCommLogo,
      completed: true,
      notes: 'Notes by MSO admin ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna',
    },
    {
      id: 5,
      title: 'Chief of Staff Recommendation',
      date: 'SUBMITTED ON: MAR 1, 2025',
      status: 'Not Recommended',
      icon: ChiefOfStaffLogo,
      completed: true,
      notes: '',
    },
    {
      id: 6,
      title: 'Chief of Staff Recommendation',
      date: 'SUBMITTED ON: MAR 1, 2025',
      status: 'Not Started Yet',
      icon: ChiefOfStaffLogo,
      completed: false,
      notes: '',
    },
    {
      id: 7,
      title: 'MAC Recommendation',
      date: 'SUBMITTED ON: MAR 1, 2025',
      status: 'Not Started Yet',
      icon: MACLogo,
      completed: false,
      notes: '',
    },
    {
      id: 8,
      title: 'BOD Recommendation',
      date: 'SUBMITTED ON: MAR 1, 2025',
      status: 'Not Started Yet',
      icon: BODLogo,
      completed: false,
      notes: '',
    }
  ]);

  const toggleExpand = (id) => {
    setExpandedStepId(prevId => (prevId === id ? null : id));
  };

  const getCheckboxColor = (status) => {
    if (status === "Not Started Yet") return "default";
    if (status === "Recommended with Notes" || status === "In Progress") return "warning";
    if (status === "Past Due" || status === "Not Recommended") return "error";
    if (status === "Recommended" || status === "Verified") return "success";
    return "default";
  };
  

  return (
    <>
    {isLoadingImage && (
        <div  className={style.loadingOverlay}>
          <LoadingScreen/>
        </div>
       )}
   
    {!isLoadingImage && (
        <div className={`${style.taskBoardShadow}`}>
    <Dialog
      isOpen={getIsOpen}
      onClose={() => getIsOpen(false)}
      className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
      <div>
        <div className={Classes.DIALOG_BODY}>
          <div className={`${style.spaceBetween} ${style.marginBottom10}`}>
            <div className={`${style.heading}`}>
            Track My Application
            </div>
            <div className={style.displayInRow}>
              <img
                src={CrossPink}
                alt="cross"
                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
                onClick={() => {
                  getIsOpen(false);
                }}
              />
            </div>
          </div>
          {/* <div className={`${style.flex} ${style.marginBottom10}`}>
          <div>
          <CommonCheckBox />
          </div>
          <div className={`${style.backgroundCardStyle}`}>
            <div className={`${style.threeColumnGrid} ${style.displayInRowCenter} `}>
            <img src={StaffManagerLogo} alt="StaffManagerLogo Logo" className={`${style.logo} ${style.marginLeft10}`} />
            <div className={`${style.HeadingFontStyle}`}> Application Not Yet Submitted</div>
            <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 22, color: "#06617A" }} />
            </div>
          </div>
          </div> */}
          <div className={style.taskList}>
            {steps?.map((step) => (
            <div key={step?.id} className={`${style.taskItem} ${style.marginBottom10}`}>
              <div  className={`${style.checkboxContainer} 
              ${step?.status === "Verified" || step?.status === "Recommended" 
                    ? style.checkBoxBackGroundGreen 
                    : step?.status === "Recommended with Notes" 
                    ? style.checkBoxBackGroundYellow 
                    : step?.status === "Past Due" || step?.status === "Not Recommended" 
                    ? style.checkBoxBackGroundRed 
                    : style.checkBoxBackGroundGrey}`}>
              <Checkbox checked={step?.completed} color={getCheckboxColor(step?.status)} />
              </div>

              <div
                className={`${style.cursorPointer} ${style.marginLeft10}
                  ${expandedStepId === step.id ? style.expanded : ''} 
                  ${step?.status === "Verified" || step?.status === "Recommended" 
                    ? style.backgroundBorderGreen 
                    : step?.status === "Recommended with Notes" 
                    ? style.backgroundBorderYellow 
                    : step?.status === "Past Due" || step?.status === "Not Recommended" 
                    ? style.backgroundBorderRed 
                    : style.backgroundCardStyle}`}
                onClick={() => toggleExpand(step.id)}
              >
                <div className={`${style.threeColumnGrid} ${style.displayInRowCenter}`}>
                  <img src={step?.icon} alt="Step Icon" className={`${style.logo} ${style.marginLeft10}`} />
                  <div className={`${(step?.status === "Verified" || step?.status === "Recommended") ? style.HeadingFontStyleGreen : style.HeadingFontStyle}`}>
                    {step?.title}: {step?.status}
                    {/* {expandedStepId === step?.id && (
                    <div className={style.notesSection}>
                      <div className={`${style.dateOfSubmissionTextStyle}`}>{step?.date}</div>
                      <div className={`${style.NotesTextStyle}`}>{step.notes}</div>
                    </div>
                    )} */}
                  </div>
                  {expandedStepId === step?.id ? (
                    <KeyboardArrowUpOutlinedIcon sx={{ fontSize: 22, color: "#171A1A" }} />
                  ) : (
                    <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 22, color: "#171A1A" }} />
                  )}
                </div>

                {expandedStepId === step?.id && (
                  <div className={`${style.threeColumnGrid} ${style.displayInRowCenter}`}>
                    <div></div>
                    <div className={style.notesSection}>
                      <div className={`${style.dateOfSubmissionTextStyle}`}>{step?.date}</div>
                      <div className={`${style.NotesTextStyle}`}>{step.notes}</div>
                    </div>
                    <div></div>
                  </div>
                )}
              </div>
            </div>
            ))}
          </div>
        </div>
        
      </div>
    </Dialog>
    </div>
    )}
</>
  );
};

export default AddtaskDialog;
