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

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
    getLog();;
  }, []);

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

  if (!userRole?.includes('Credentialing Committee') && !userRole?.includes('Chief Of Staff')) {
    return null;
  }

  return (
  
    
    <Dialog
      isOpen={getIsOpen}
      onClose={() => getIsOpen(false)}
      className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
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
                  Review Applicant for Appointment as {" "}
                  {formDetails?.providerType?.serviceProviderType}
                </span>
              </div>
            </div>
            <div className={`${style.cardStyle}`}>
              <div className={`${style.namefontstyle} ${style.marginTop10}`}>
                {formDetails?.basicDetails?.applicant?.name?.firstName
                  ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                    formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                  : ""}{", "}
                {formDetails?.basicDetails?.applicant?.name?.lastName?.toUpperCase()}{" "}
                <span className={`${style.displayIdFontStyle}`}>{formDetails?.displayId}</span>
              </div>
              <div className={`${style.applicantTypeFontStyle}`}>
                {formDetails?.providerType?.category}
              </div>
              <div className={`${style.grid}`}>
                <div>
                  <div>Department:<span className={`${style.rightSideFontStyle}`}>{formDetails?.basicDetails?.departmentSpecialty?.department}</span></div>
                  <div>Speciality:<span className={`${style.rightSideFontStyle}`}>{formDetails?.basicDetails?.departmentSpecialty?.specialty}</span></div>
                </div>
                <div>
                  <div>Staff Manager:<span className={`${style.rightSideFontStyle}`}>{formDetails?.createdBy?.name?.firstName}{""}{formDetails?.createdBy?.name?.lastName}</span></div>
                  <div>Site Name:<span className={`${style.rightSideFontStyle}`}>Only If Multisite</span></div>
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
            <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
              Upcoming Credentials Committee Meeting Date: DD - MM - YYYY
            </div>
            <div className={`${style.marginTop} ${style.reviewButtonContainer}`} onClick={() => getIsOpen(false)}>
              <div className={style.reviewButton}>REVIEW & APPROVE</div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
    
  );
};

export default NotesCommentsDialog;
