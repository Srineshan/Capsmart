// import React, { useState } from 'react';
// import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
// import style from './index.module.scss';
// import DeclineMailTemplate from './declineMailTemplate';

// const ApplicationDecline = ({ getApplicationDeclineDialog }) => {
//   const [showDeclineMailDialog, setShowDeclineMailDialog] = useState(false);

//   const getDeclineMailDialog = (value) => {
//     setShowDeclineMailDialog(value);
//     getApplicationDeclineDialog(false)
//   }

//   return (
//     <div>
//       <Dialog isOpen={getApplicationDeclineDialog} onClose={() => getApplicationDeclineDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
//         <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
//           <div className={style.spaceBetween}>
//             <p className={style.extensionStyle1}>{"Decline Application For {Name} {Doctor}"}</p>
//             <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getApplicationDeclineDialog(false)} />
//           </div>
//           <div>
//             <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle}`}>
//               <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
//                 <div className={style.displayInRow}>
//                   <span className={style.rejectionHeadingTextStyle}>LAST, First MI</span>
//                   <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>7837428</span>
//                 </div>
//               </div>
//               <div className={`${style.rejectionTextStyle} ${style.marginLeft20} ${style.marginTop5}`}>{"{Doctor}"}</div>
//               <div className={style.marginTop10}>
//                 <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Department:</span>
//                     <span className={`${style.rejectionTextStyle}`}>{"{Department}"}</span>
//                   </div>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Staff Manager:</span>
//                     <span className={`${style.rejectionTextStyle}`}>{"{Staff Manager Name}"}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className={style.marginTop5}>
//                 <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Speciality:</span>
//                     <span className={`${style.rejectionTextStyle}`}>{"{Speciality}"}</span>
//                   </div>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
//                     <span className={`${style.rejectionTextStyle}`}>{"Only If Multisite"}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className={`${style.marginTop20} ${style.rejectionTextStyle}`}>Reasons For Declining Applicant*
//               <div className={`${style.rejectionBorderStyle} ${style.marginTop10}`}>
//                 <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
//                   <div className={style.displayInRow} style={{ height: "90px" }}>
//                     <div className={`${style.rejectionTextStyle}`}>Text</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className={`${style.displayInRow} ${style.alignCenter} ${style.marginTop10}`}>
//               <button className={`${style.buttonStyle} ${style.sendNotificationsButtonWidth} ${style.marginLeft20} ${style.floatRight} ${style.cursorPointer}`} onClick={() => setShowDeclineMailDialog(true)}>DECLINE APPLICATION</button>
//             </div>
//           </div>
//         </div>
//       </Dialog>
//       {
//         showDeclineMailDialog && (
//           <DeclineMailTemplate getDeclineMailDialog={getDeclineMailDialog} />
//         )
//       }
//     </div>
//   )
// }

// export default ApplicationDecline;


import React, { useState,useEffect } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import style from './index.module.scss';
import DeclineMailTemplate from './declineMailTemplate';
import { GET, PUT } from "../../Screens/dataSaver";

const ApplicationDecline = ({ getIsOpen,getApplicationDeclineDialog ,getActiveApplicationView }) => {
  const [showDeclineMailDialog, setShowDeclineMailDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const id = sessionStorage.getItem("applicationId");

  const getDeclineMailDialog = (value) => {
    setShowDeclineMailDialog(value);
    getApplicationDeclineDialog(false);
  }

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
  }, []);

  const onClose = () => {
    getActiveApplicationView(false);
  };

  const getApplication = async () => {
    try {
      const { data: basicForm } = await GET(`application-management-service/application/${id}`);
      setFormDetails(basicForm);
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };

  const handleApplicationReject = async () => {
    try {
      const payload = {
        notes: notes,
      };

      await PUT(
        `application-management-service/application/${id}/workflow/complete/REJECTED?isDelegate=false`,
        payload
      );
      
      await getApplication();
      onClose();
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  return (
    <div>
      <Dialog isOpen={getApplicationDeclineDialog} onClose={() => getApplicationDeclineDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
        <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
          <div className={style.spaceBetween}>
            <p className={style.extensionStyle1}>Not Recommended For <span>{formDetails?.basicDetails?.applicant?.name?.firstName
                  ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                    formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                  : ""}{", "}
                {formDetails?.basicDetails?.applicant?.name?.lastName?.toUpperCase()}{" "}</span> As <span>{formDetails?.providerType?.serviceProviderType}</span></p>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getApplicationDeclineDialog(false)} />
          </div>
          <div>
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
                    <span className={`${style.rejectionTextStyle}`}>{formDetails?.basicDetails?.departmentSpecialty?.department}</span>
                  </div>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Privilege Category:</span>
                    <span className={`${style.rejectionTextStyle}`}>{formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory}</span>
                  </div>
                </div>
              </div>
              <div className={style.marginTop5}>
                <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Speciality:</span>
                    <span className={`${style.rejectionTextStyle}`}>{formDetails?.basicDetails?.departmentSpecialty?.specialty}</span>
                  </div>
                  {/* <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
                    <span className={`${style.rejectionTextStyle}`}>Only If Multisite</span>
                  </div> */}
                </div>
              </div>
            </div>
            <div className={`${style.marginTop20} ${style.rejectionTextStyle}`}>Reasons For Rejecting Applicant*
              <div className={`${style.rejectionBorderStyle} ${style.marginTop10}`}>
                <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
                  <textarea
                    className={`${style.rejectionTextStyle} ${style.textAreaStyle}`}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ width: '100%', height: '90px' }}
                  />
                </div>
              </div>
            </div>
            <div className={`${style.displayInRow} ${style.alignCenter} ${style.marginTop10}`}>
              <button
                className={`${style.buttonStyle} ${style.sendNotificationsButtonWidth} ${style.marginLeft20} ${style.floatRight} ${style.cursorPointer}`}
                onClick={handleApplicationReject}
                disabled={!notes}
                style={{
                  opacity: notes ? 1 : 0.5,
                  pointerEvents: notes ? 'auto' : 'none',
                }}
              >
                NOT RECOMMENDED
              </button>
            </div>
          </div>
        </div>
      </Dialog>
      {
        showDeclineMailDialog && (
          <DeclineMailTemplate getDeclineMailDialog={getDeclineMailDialog} />
        )
      }
    </div>
  );
}

export default ApplicationDecline;
