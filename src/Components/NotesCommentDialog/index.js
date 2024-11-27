import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";

const NotesCommentsDialog = ({ getIsOpen }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const user = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [selectedOption, setSelectedOption] = useState({});
  const [formDetails, setFormDetails] = useState([]);
  const [logDetails, setLogDetails] = useState([]);
  const id = sessionStorage.getItem("applicationId");
  const componentRef = useRef(null);
  const [applicationCreationType, setApplicationCreationType] = useState('NEW');
  const [applicationType, setApplicationType] = useState(() => 
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
    getLog();;
  }, [applicationType]);

  const getApplication = async () => {
    const { data: basicForm } = await GET(`application-management-service/application/${id}`);
    setFormDetails(basicForm);
  };

  const getLog = async () => {
    const { data: basicLog } = await GET(`application-management-service/application/${id}/logs`);
    setLogDetails(basicLog);
  };

  useEffect(() => {
    setUserDetails();
  }, [user?.id]);

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${user?.id}`);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUserRole(userData?.roles?.map((data) => data?.roleName));
  };

  const getApplicationCreationType = (value) => {
    setApplicationCreationType(value);
  }

  // if (!userRole?.includes('Credentialing Committee') && !userRole?.includes('Chief Of Staff')) {
  //   return null;
  // }

  return (
  
    
    <Dialog
      isOpen={getIsOpen}
      onClose={() => getIsOpen(false)}
      className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
      getApplicationCreationType={getApplicationCreationType}
    >
      <div>
        <div className={Classes.DIALOG_BODY}>
          <div className={style.spaceBetween}>
            <div className={`${style.heading}`}>
              {userRole} Review & Approval
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
          <div ref={componentRef} className={`${style.pagebreak}`}>
            <div className={`${style.spaceBetween}`}>
              <div className={`${style.fontstyle} ${style.marginTop10}`}>
              <span className={`${style.fontstyleassociate}`}>
                {applicationType === "NEW" 
                  ? `Review Staff for Appointment as ${formDetails?.providerType?.serviceProviderType}` 
                  : `Review Staff for ReAppointment as ${formDetails?.providerType?.serviceProviderType}`}
              </span>
              </div>
            </div>
            <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle}`}>
              <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
                <div className={style.displayInRow}>
                  <span className={style.rejectionHeadingTextStyle}> {formDetails?.basicDetails?.applicant?.name?.firstName
                  ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                    formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                  : ""}{", "}
                {formDetails?.basicDetails?.applicant?.name?.lastName?.toUpperCase()}{" "}</span>
                  <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{formDetails?.displayId}</span>
                </div>
              </div>
              <div className={`${style.rejectionTextStyle} ${style.marginLeft20} ${style.marginTop5}`}>{formDetails?.providerType?.serviceProviderType}</div>
              <div className={style.marginTop10}>
                <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Department:</span>
                    <span className={`${style.rejectionTextStyle}`}>{formDetails?.basicDetails?.departmentSpecialty?.department || "-"}</span>
                  </div>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Privilege Category:</span>
                    <span className={`${style.rejectionTextStyle}`}>{formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || "-"}</span>
                  </div>
                </div>
              </div>
              <div className={style.marginTop5}>
                <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Speciality:</span>
                    <span className={`${style.rejectionTextStyle}`}>{formDetails?.basicDetails?.departmentSpecialty?.specialty || "-"}</span>
                  </div>
                  {/* <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
                    <span className={`${style.rejectionTextStyle}`}>Only If Multisite</span>
                  </div> */}
                </div>
              </div>
            </div>
            {/* <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
            {logDetails?.logs?.[logDetails.logs.length - 1]?.role} Comments & Notes
            </div>
            <div className={`${style.notesBorderStyle}`}>
              <div className={`${style.commentsNotesFontStyle}`}>
              {logDetails?.logs?.[logDetails.logs.length - 1]?.notes}
              </div>
            </div> */}
            {logDetails?.logs?.filter(log => log.role && log.notes).map((log, index) => (
              <div key={index} className={style.marginTop}>
                <div className={style.commentsNotesHeadingFontStyle}>
                  {log.role} Comments & Notes
                </div>
                <div className={`${style.notesBorderStyle} ${style.marginTop10}`}>
                  <div className={style.commentsNotesFontStyle}>
                    {log.notes}
                  </div>
                </div>
              </div>
            ))}
            {/* <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
              Dept Head Comments & Notes
            </div>
            <div className={`${style.notesBorderStyle}`}>
              <div className={`${style.commentsNotesFontStyle}`}>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam minima facere vitae fugiat aspernatur amet ab sequi nam doloribus quaerat exercitationem ducimus nostrum illo consectetur vel possimus molestias explicabo iusto iste officia est repudiandae, eum autem aut! Odio quia accusantium eum dignissimos, molestias delectus consequatur voluptatibus cum, quod animi voluptatum vero nemo blanditiis consequuntur tempora. Ipsa nihil hic earum voluptates nostrum. Facilis aspernatur rerum at voluptatum deleniti nam culpa praesentium sunt architecto, ducimus debitis impedit neque ad sapiente fugiat veniam molestiae doloremque quae natus, sequi soluta! Porro sapiente ex inventore voluptatem ea recusandae rerum doloribus qui id possimus, iure odit?
              </div>
            </div> */}
            {/* <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
              Upcoming Credentials Committee Meeting Date: DD - MM - YYYY
            </div> */}
            <div className={`${style.marginTop} ${style.reviewButtonContainer}`} onClick={() => getIsOpen(false)}>
              <div className={style.reviewButton}>CONTINUE</div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
    
  );
};

export default NotesCommentsDialog;
