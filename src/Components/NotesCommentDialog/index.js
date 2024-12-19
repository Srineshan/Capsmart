// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { GET , TenantID} from "../../Screens/dataSaver";
// import { Dialog, Classes } from "@blueprintjs/core";
// import CrossPink from "../../images/crossPink.png";
// import Cookie from 'universal-cookie';
// import jwt from 'jwt-decode';
// import style from "./index.module.scss";
// import { format } from 'date-fns';

// const NotesCommentsDialog = ({ getIsOpen }) => {
//   let cookie = new Cookie();
//   let userDetails = cookie.get('user');
//   const user = jwt(userDetails);
//   const [userRole, setUserRole] = useState('');
//   const [selectedOption, setSelectedOption] = useState({});
//   const [formDetails, setFormDetails] = useState([]);
//   const [logDetails, setLogDetails] = useState([]);
//   const id = sessionStorage.getItem("applicationId");
//   const componentRef = useRef(null);
//   const [applicationCreationType, setApplicationCreationType] = useState('NEW');
//   const [applicationType, setApplicationType] = useState(() => 
//     sessionStorage.getItem('applicationCreationType') || 'NEW'
//   );
//   const [entity, setEntity] = useState([]);

//   useEffect(() => {
//     sessionStorage.setItem("fromSummary", false);
//     getApplication();
//     getLog();
//   }, [applicationType]);

//   const getApplication = async () => {
//     const { data: basicForm } = await GET(`application-management-service/application/${id}`);
//     setFormDetails(basicForm);
//   };

//   const getLog = async () => {
//     const { data: basicLog } = await GET(`application-management-service/application/${id}/logs`);
//     setLogDetails(basicLog);
//   };

//     const getApplicationEntity = async () => {
//     const { data: basicFormEntity } = await GET(`entity-service/entity/${TenantID}`);
//     setEntity(basicFormEntity);
//   };

//   useEffect(() => {
//     setUserDetails();
//   }, [user?.id]);

//   const setUserDetails = async () => {
//     const { data: userData } = await GET(`user-management-service/user/${user?.id}`);
//     sessionStorage.setItem('user', JSON.stringify(userData));
//     setUserRole(userData?.roles?.map((data) => data?.roleName));
//   };

//   const getApplicationCreationType = (value) => {
//     setApplicationCreationType(value);
//   }

//     const lastModifiedDate = formDetails?.lastModifiedDate;
//   const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), "MMM dd, yyyy") : "-";
//   const CredUpcomingDate = formDetails?.upcomingCredCommitteeMeetingDate;
//   const upcomingCredCommitteeMeetingDate = CredUpcomingDate ? format(new Date(CredUpcomingDate), "MMM dd, yyyy") : "-";


//   // if (!userRole?.includes('Credentialing Committee') && !userRole?.includes('Chief Of Staff')) {
//   //   return null;
//   // }

//   return (
  
    
//     // <Dialog
//     //   isOpen={getIsOpen}
//     //   onClose={() => getIsOpen(false)}
//     //   className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
//     //   canOutsideClickClose={false}
//     //   canEscapeKeyClose={false}
//     //   getApplicationCreationType={getApplicationCreationType}
//     // >
//     //   <div>
//     //     <div className={Classes.DIALOG_BODY}>
//     //       <div className={style.spaceBetween}>
//     //         <div className={`${style.heading}`}>
//     //           {userRole} Review & Approval
//     //         </div>
//     //         <div className={style.displayInRow}>
//     //           <img
//     //             src={CrossPink}
//     //             alt="cross"
//     //             className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
//     //             onClick={() => {
//     //               getIsOpen(false);
//     //             }}
//     //           />
//     //         </div>
//     //       </div>
//     //       <div ref={componentRef} className={`${style.pagebreak}`}>
//     //         <div className={`${style.spaceBetween}`}>
//     //           <div className={`${style.fontstyle} ${style.marginTop10}`}>
//     //           <span className={`${style.fontstyleassociate}`}>
//     //             {applicationType === "NEW" 
//     //               ? `Review Staff for Appointment as ${formDetails?.providerType?.serviceProviderType}` 
//     //               : `Review Staff for ReAppointment as ${formDetails?.providerType?.serviceProviderType}`}
//     //           </span>
//     //           </div>
//     //         </div>
//     //         <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle}`}>
//     //           <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
//     //             <div className={style.displayInRow}>
//     //               <span className={style.rejectionHeadingTextStyle}> {formDetails?.basicDetails?.applicant?.name?.firstName
//     //               ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
//     //                 formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
//     //               : ""}{", "}
//     //             {formDetails?.basicDetails?.applicant?.name?.lastName?.toUpperCase()}{" "}</span>
//     //               <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{formDetails?.displayId}</span>
//     //             </div>
//     //           </div>
//     //           <div className={`${style.rejectionTextStyle} ${style.marginLeft20} ${style.marginTop5}`}>{formDetails?.providerType?.serviceProviderType}</div>
//     //           <div className={style.marginTop10}>
//     //             <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//     //               <div className={`${style.twoColumnGridInner}`}>
//     //                 <span className={`${style.rejectionTextStyle}`}>Department:</span>
//     //                 <span className={`${style.rejectionTextStyle}`}>{formDetails?.basicDetails?.departmentSpecialty?.department || "-"}</span>
//     //               </div>
//     //               <div className={`${style.twoColumnGridInner}`}>
//     //                 <span className={`${style.rejectionTextStyle}`}>Privilege Category:</span>
//     //                 <span className={`${style.rejectionTextStyle}`}>{formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || "-"}</span>
//     //               </div>
//     //             </div>
//     //           </div>
//     //           <div className={style.marginTop5}>
//     //             <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//     //               <div className={`${style.twoColumnGridInner}`}>
//     //                 <span className={`${style.rejectionTextStyle}`}>Speciality:</span>
//     //                 <span className={`${style.rejectionTextStyle}`}>{formDetails?.basicDetails?.departmentSpecialty?.specialty || "-"}</span>
//     //               </div>
//     //               {/* <div className={`${style.twoColumnGridInner}`}>
//     //                 <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
//     //                 <span className={`${style.rejectionTextStyle}`}>Only If Multisite</span>
//     //               </div> */}
//     //             </div>
//     //           </div>
//     //         </div>
//     //         {/* <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
//     //         {logDetails?.logs?.[logDetails.logs.length - 1]?.role} Comments & Notes
//     //         </div>
//     //         <div className={`${style.notesBorderStyle}`}>
//     //           <div className={`${style.commentsNotesFontStyle}`}>
//     //           {logDetails?.logs?.[logDetails.logs.length - 1]?.notes}
//     //           </div>
//     //         </div> */}
//     //         {logDetails?.logs?.filter(log => log.role && log.notes).map((log, index) => (
//     //           <div key={index} className={style.marginTop}>
//     //             <div className={style.commentsNotesHeadingFontStyle}>
//     //               {log.role} Comments & Notes
//     //             </div>
//     //             <div className={`${style.notesBorderStyle} ${style.marginTop10}`}>
//     //               <div className={style.commentsNotesFontStyle}>
//     //                 {log.notes}
//     //               </div>
//     //             </div>
//     //           </div>
//     //         ))}
//     //         {/* <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
//     //           Dept Head Comments & Notes
//     //         </div>
//     //         <div className={`${style.notesBorderStyle}`}>
//     //           <div className={`${style.commentsNotesFontStyle}`}>
//     //             Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam minima facere vitae fugiat aspernatur amet ab sequi nam doloribus quaerat exercitationem ducimus nostrum illo consectetur vel possimus molestias explicabo iusto iste officia est repudiandae, eum autem aut! Odio quia accusantium eum dignissimos, molestias delectus consequatur voluptatibus cum, quod animi voluptatum vero nemo blanditiis consequuntur tempora. Ipsa nihil hic earum voluptates nostrum. Facilis aspernatur rerum at voluptatum deleniti nam culpa praesentium sunt architecto, ducimus debitis impedit neque ad sapiente fugiat veniam molestiae doloremque quae natus, sequi soluta! Porro sapiente ex inventore voluptatem ea recusandae rerum doloribus qui id possimus, iure odit?
//     //           </div>
//     //         </div> */}
//     //         {/* <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
//     //           Upcoming Credentials Committee Meeting Date: DD - MM - YYYY
//     //         </div> */}
//     //         <div className={`${style.marginTop} ${style.reviewButtonContainer}`} onClick={() => getIsOpen(false)}>
//     //           <div className={style.reviewButton}>CONTINUE</div>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   </div>
//     // </Dialog>
//         <Dialog
//       isOpen={getIsOpen}
//       onClose={() => getIsOpen(false)}
//       className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
//       canOutsideClickClose={false}
//       canEscapeKeyClose={false}
//       getApplicationCreationType={getApplicationCreationType}
//     >
//       <div>
//         <div className={Classes.DIALOG_BODY}>
//           <div className={style.spaceBetween}>
//             <div className={`${style.heading}`}>
//               Staff Reappointment for Review & Approval
//             </div>
//             <div className={style.displayInRow}>
//               <img
//                 src={CrossPink}
//                 alt="cross"
//                 className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
//                 onClick={() => {
//                   getIsOpen(false);
//                 }}
//               />
//             </div>
//           </div>
//           <div ref={componentRef} className={`${style.pagebreak}`}>
//             {/* <div className={`${style.spaceBetween}`}>
//               <div className={`${style.fontstyle} ${style.marginTop10}`}>
//               <span className={`${style.fontstyleassociate}`}>
//                 {applicationType === "NEW" 
//                   ? `Review Staff for Appointment as ${formDetails?.providerType?.serviceProviderType}` 
//                   : `Review Staff for ReAppointment as ${formDetails?.providerType?.serviceProviderType}`}
//               </span>
//               </div>
//             </div> */}
//             <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
//               <div className={`${style.spaceBetween} ${style.marginLeftRight20}`}>
//                 <div className={`${style.displayInRow} ${style.displayInRowCenter}`}>
//                   <span className={style.rejectionHeadingTextStyle}>
//                   {formDetails?.basicDetails?.applicant?.name?.firstName
//                   ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
//                     formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
//                   : ""}{", "}
//                   {formDetails?.basicDetails?.applicant?.name?.lastName?.toUpperCase()}{", "}        
//                   {/* {formDetails?.basicDetails?.applicant?.name?.middleName?.toUpperCase()}{","} */}
//                   </span>
//                 <div className={`${style.rejectionTextStyle} ${style.marginLeft2}`}>{formDetails?.providerType?.serviceProviderType}</div>
//                   {/* <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{formDetails?.displayId}</span> */}
//                 </div>
//                 <div>
//                 <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || "-"}</span>
//                 </div>
//               </div>
//               {/* <div className={`${style.rejectionTextStyle} ${style.marginLeft20} ${style.marginTop5}`}>{formDetails?.providerType?.serviceProviderType}</div> */}
//               <div className={style.marginTop10}>
//                 <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Department:</span>
//                     <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetails?.departmentSpecialty?.department || "-"}</span>
//                   </div>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Application ID:</span>
//                     <span className={`${style.rejectionTextStyle1}`}>{formDetails?.displayId}</span>
//                   </div>
//                 {/* </div>
//               </div>
//               <div className={style.marginTop5}>
//                 <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}> */}
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Division / Speciality:</span>
//                     <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetails?.departmentSpecialty?.specialty || "-"}</span>
//                   </div>
//                   {/* <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
//                     <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetailReferences?.site || "-"}</span>
//                   </div> */}
//                     {
//                     entity?.multiSiteEntity && (
//                         <div className={`${style.twoColumnGridInner}`}>
//                         <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
//                         <span className={`${style.rejectionTextStyle1}`}>
//                             {entity?.multiSiteEntity?.[0]?.name || "-"}
//                         </span>
//                         </div>
//                     )
//                     }
//                 {/* </div>
//               </div>
//               <div className={style.marginTop5}>
//                 <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}> */}
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>OHIP Billing Number:</span>
//                     <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetailReferences?.specialtyBilling || "-"}</span>
//                   </div>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Last Updated by:</span>
//                     {/* <span className={`${style.rejectionTextStyle1}`}>{format(new Date(formDetails?.lastModifiedDate), "MMM dd, yyyy")}</span> */}
//                     <span className={`${style.rejectionTextStyle1}`}>{formattedDate}</span>
//                   </div>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Last Updated by:</span>
//                     <span className={`${style.rejectionTextStyle1}`}>
//                       {formDetails?.basicDetails?.applicant?.name?.firstName
//                       ? formDetails?.updatedBy?.name?.firstName.charAt(0).toUpperCase() +
//                       formDetails?.updatedBy?.name?.firstName.slice(1).toLowerCase()
//                       : ""}{formDetails?.updatedBy?.name?.lastName?.toUpperCase()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
//             {logDetails?.logs?.[logDetails.logs.length - 1]?.role} Comments & Notes
//             </div>
//             <div className={`${style.notesBorderStyle}`}>
//               <div className={`${style.commentsNotesFontStyle}`}>
//               {logDetails?.logs?.[logDetails.logs.length - 1]?.notes}
//               </div>
//             </div> */}
//             {logDetails?.logs?.filter(log => log.role && log.notes).map((log, index) => (
//               <>
//               <div className={style.marginTop}>
//                 <div className={style.commentsNotesHeadingFontStyle}>
//                   {log.title} Comments & Notes
//                   {/* Staff Manager Comments & Notes */}
//                 </div>
//                 <hr color="grey" size="2"></hr>
//                 <div>
//                   <div className={style.commentsNotesFontStyle}>
//                   {/* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy. */}
//                   <span dangerouslySetInnerHTML={{ __html:(log.notes) }} />
//                   </div>
//                 </div>
//               </div>
//               </>
//               ))}
//              {userRole?.includes("Department Head") &&
//              <>
//              <div className={`${style.marginTop} ${style.credDateTextStyle}`}>
//               Upcoming Credentials Committee Meeting Date: {upcomingCredCommitteeMeetingDate}
//               </div>
               
//               <div className={`${style.marginTop} ${style.credDateTextStyle}`}>
//               Assigned Credentials Committee: Name
//               </div>
//               </>
//               }
//             {/* <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
//               Dept Head Comments & Notes
//             </div>
//             <div className={`${style.notesBorderStyle}`}>
//               <div className={`${style.commentsNotesFontStyle}`}>
//                 Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam minima facere vitae fugiat aspernatur amet ab sequi nam doloribus quaerat exercitationem ducimus nostrum illo consectetur vel possimus molestias explicabo iusto iste officia est repudiandae, eum autem aut! Odio quia accusantium eum dignissimos, molestias delectus consequatur voluptatibus cum, quod animi voluptatum vero nemo blanditiis consequuntur tempora. Ipsa nihil hic earum voluptates nostrum. Facilis aspernatur rerum at voluptatum deleniti nam culpa praesentium sunt architecto, ducimus debitis impedit neque ad sapiente fugiat veniam molestiae doloremque quae natus, sequi soluta! Porro sapiente ex inventore voluptatem ea recusandae rerum doloribus qui id possimus, iure odit?
//               </div>
//             </div> */}
//             {/* <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
//               Upcoming Credentials Committee Meeting Date: DD - MM - YYYY
//             </div> */}
//             <div className={`${style.marginTop} ${style.reviewButtonContainer}`} onClick={() => getIsOpen(false)}>
//               {userRole?.includes("Department Head") ? <div className={style.reviewButton}>START REVIEW</div> : <div className={style.reviewButton}>CONTINUE</div>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Dialog>

    
//   );
// };

// export default NotesCommentsDialog;


// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { GET,TenantID } from "../../Screens/dataSaver";
// import { format } from "date-fns";
// import { Dialog, Classes } from "@blueprintjs/core";
// import CrossPink from "../../images/crossPink.png";
// import Cookie from 'universal-cookie';
// import jwt from 'jwt-decode';
// import style from "./index.module.scss";

// const NotesCommentsDialog = ({ getIsOpen,selectedTab }) => {
//   let cookie = new Cookie();
//   let userDetails = cookie.get('user');
//   const user = jwt(userDetails);
//   const [userRole, setUserRole] = useState('');
//   const [selectedOption, setSelectedOption] = useState({});
//   const [formDetails, setFormDetails] = useState([]);
//   const [entity, setEntity] = useState([]);
//   const [logDetails, setLogDetails] = useState([]);
//   const userId = sessionStorage.getItem("applicationId");
//   const componentRef = useRef(null);
//   const [applicationCreationType, setApplicationCreationType] = useState('NEW');
//   const [applicationType, setApplicationType] = useState(() => 
//     sessionStorage.getItem('applicationCreationType') || 'NEW'
//   );

//   useEffect(() => {
//     sessionStorage.setItem("fromSummary", false);
//     getApplication();
//     getLog();
//   }, [applicationType]);

//   // useEffect(() => {
//   //   getApplication();
//   // }, [id]);

// const getApplication = async () => {
//     try {
//       const { data: basicForm } = await GET(`application-management-service/application/${userId}`);
//       setFormDetails(basicForm);
//     } catch (error) {
//       console.error('Error fetching application:', error);
//     }
//   };

//   const getApplicationEntity = async () => {
//     const { data: basicFormEntity } = await GET(`entity-service/entity/${TenantID}`);
//     setEntity(basicFormEntity);
//   };


//   const getLog = async () => {
//     const { data: basicLog } = await GET(`application-management-service/application/${userId}/logs`);
//     setLogDetails(basicLog);
//     console.log("basicLog" +JSON.stringify(basicLog));
    
//   };

//   useEffect(() => {
//     setUserDetails();
//   }, [user?.id]);

//   const setUserDetails = async () => {
//       const { data: userData } = await GET(`user-management-service/user/${user?.id}`);
//       console.log("userdataaaa" + JSON.stringify(userData))
//       sessionStorage.setItem('user', JSON.stringify(userData))
//       setUserRole(userData?.roles?.map((data) => data?.roleName));
//     }

//   const getApplicationCreationType = (value) => {
//     setApplicationCreationType(value);
//   }

//   if (!userRole?.includes('Credentialing Committee') && !userRole?.includes('Department Head')) {
//     return null;
//   }
//   const lastModifiedDate = formDetails?.lastModifiedDate;
//   const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), "MMM dd, yyyy") : "-";
//   const CredUpcomingDate = formDetails?.upcomingCredCommitteeMeetingDate;
//   const upcomingCredCommitteeMeetingDate = CredUpcomingDate ? format(new Date(CredUpcomingDate), "MMM dd, yyyy") : "-";
  

//   // if ((applicationType === "NEW")) {
//   //   return null;
//   // }

//   if ((userRole?.includes('Department Head') && selectedTab === "level-3")) {
//     return null;
//   }

//   // if ((selectedTab === "level-1")) {
//   //   return null;
//   // }

//   // if (applicationType === "NEW") {
//   //   return null;
//   // } else if (userRole?.includes('Department Head') && selectedTab === "level-3") {
//   //   return null;
//   // } else if (selectedTab === "level-1") {
//   //   return null;
//   // }else if (!userRole?.includes('Credentialing Committee') && !userRole?.includes('Department Head')) {
//   //   return null;
//   // }

//   return (
  
    
//     <Dialog
//       isOpen={getIsOpen}
//       onClose={() => getIsOpen(false)}
//       className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
//       canOutsideClickClose={false}
//       canEscapeKeyClose={false}
//       getApplicationCreationType={getApplicationCreationType}
//     >
//       <div>
//         <div className={Classes.DIALOG_BODY}>
//           <div className={style.spaceBetween}>
//             <div className={`${style.heading}`}>
//               Staff Reappointment for Review & Approval
//             </div>
//             <div className={style.displayInRow}>
//               <img
//                 src={CrossPink}
//                 alt="cross"
//                 className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
//                 onClick={() => {
//                   getIsOpen(false);
//                 }}
//               />
//             </div>
//           </div>
//           <div ref={componentRef} className={`${style.pagebreak}`}>
//             {/* <div className={`${style.spaceBetween}`}>
//               <div className={`${style.fontstyle} ${style.marginTop10}`}>
//               <span className={`${style.fontstyleassociate}`}>
//                 {applicationType === "NEW" 
//                   ? `Review Staff for Appointment as ${formDetails?.providerType?.serviceProviderType}` 
//                   : `Review Staff for ReAppointment as ${formDetails?.providerType?.serviceProviderType}`}
//               </span>
//               </div>
//             </div> */}
//             <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
//               <div className={`${style.spaceBetween} ${style.marginLeftRight20}`}>
//                 <div className={`${style.displayInRow} ${style.displayInRowCenter}`}>
//                   <span className={style.rejectionHeadingTextStyle}>
//                   {formDetails?.basicDetails?.applicant?.name?.firstName
//                   ? formDetails?.basicDetails?.applicant?.name?.firstName.charAt(0).toUpperCase() +
//                     formDetails?.basicDetails?.applicant?.name?.firstName.slice(1).toLowerCase()
//                   : ""}{", "}
//                   {formDetails?.basicDetails?.applicant?.name?.lastName?.toUpperCase()}{", "}        
//                   {/* {formDetails?.basicDetails?.applicant?.name?.middleName?.toUpperCase()}{","} */}
//                   </span>
//                 <div className={`${style.rejectionTextStyle} ${style.marginLeft2}`}>{formDetails?.providerType?.serviceProviderType}</div>
//                   {/* <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{formDetails?.displayId}</span> */}
//                 </div>
//                 <div>
//                 <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || "-"}</span>
//                 </div>
//               </div>
//               {/* <div className={`${style.rejectionTextStyle} ${style.marginLeft20} ${style.marginTop5}`}>{formDetails?.providerType?.serviceProviderType}</div> */}
//               <div className={style.marginTop10}>
//                 <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Department:</span>
//                     <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetails?.departmentSpecialty?.department || "-"}</span>
//                   </div>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Application ID:</span>
//                     <span className={`${style.rejectionTextStyle1}`}>{formDetails?.displayId}</span>
//                   </div>
//                 {/* </div>
//               </div>
//               <div className={style.marginTop5}>
//                 <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}> */}
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Division / Speciality:</span>
//                     <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetails?.departmentSpecialty?.specialty || "-"}</span>
//                   </div>
//                   {/* <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
//                     <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetailReferences?.site || "-"}</span>
//                   </div> */}
//                     {
//                     entity?.multiSiteEntity && (
//                         <div className={`${style.twoColumnGridInner}`}>
//                         <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
//                         <span className={`${style.rejectionTextStyle1}`}>
//                             {entity?.multiSiteEntity?.[0]?.name || "-"}
//                         </span>
//                         </div>
//                     )
//                     }
//                 {/* </div>
//               </div>
//               <div className={style.marginTop5}>
//                 <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}> */}
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>OHIP Billing Number:</span>
//                     <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetailReferences?.specialtyBilling?.code || "-"}</span>
//                   </div>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Last Updated by:</span>
//                     {/* <span className={`${style.rejectionTextStyle1}`}>{format(new Date(formDetails?.lastModifiedDate), "MMM dd, yyyy")}</span> */}
//                     <span className={`${style.rejectionTextStyle1}`}>{formattedDate}</span>
//                   </div>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Last Updated by:</span>
//                     <span className={`${style.rejectionTextStyle1}`}>
//                       {formDetails?.basicDetails?.applicant?.name?.firstName
//                       ? formDetails?.updatedBy?.name?.firstName.charAt(0).toUpperCase() +
//                       formDetails?.updatedBy?.name?.firstName.slice(1).toLowerCase()
//                       : ""}{formDetails?.updatedBy?.name?.lastName?.toUpperCase()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
//             {logDetails?.logs?.[logDetails.logs.length - 1]?.role} Comments & Notes
//             </div>
//             <div className={`${style.notesBorderStyle}`}>
//               <div className={`${style.commentsNotesFontStyle}`}>
//               {logDetails?.logs?.[logDetails.logs.length - 1]?.notes}
//               </div>
//             </div> */}
//             {logDetails?.logs?.filter(log => log.role && log.notes).map((log, index) => (
//               <>
//               <div className={style.marginTop}>
//                 <div className={style.commentsNotesHeadingFontStyle}>
//                   {log.title} Comments & Notes
//                   {/* Staff Manager Comments & Notes */}
//                 </div>
//                 <hr color="grey" size="2"></hr>
//                 <div>
//                   <div className={style.commentsNotesFontStyle}>
//                   {/* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy. */}
//                   <span dangerouslySetInnerHTML={{ __html:(log.notes) }} />
//                   </div>
//                 </div>
//               </div>
//               </>
//               ))}
//              {userRole?.includes("Department Head") &&
//              <>
//              <div className={`${style.marginTop} ${style.credDateTextStyle}`}>
//               Upcoming Credentials Committee Meeting Date: {upcomingCredCommitteeMeetingDate}
//               </div>
               
//               <div className={`${style.marginTop} ${style.credDateTextStyle}`}>
//               Assigned Credentials Committee: Name
//               </div>
//               </>
//               }
//             {/* <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
//               Dept Head Comments & Notes
//             </div>
//             <div className={`${style.notesBorderStyle}`}>
//               <div className={`${style.commentsNotesFontStyle}`}>
//                 Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam minima facere vitae fugiat aspernatur amet ab sequi nam doloribus quaerat exercitationem ducimus nostrum illo consectetur vel possimus molestias explicabo iusto iste officia est repudiandae, eum autem aut! Odio quia accusantium eum dignissimos, molestias delectus consequatur voluptatibus cum, quod animi voluptatum vero nemo blanditiis consequuntur tempora. Ipsa nihil hic earum voluptates nostrum. Facilis aspernatur rerum at voluptatum deleniti nam culpa praesentium sunt architecto, ducimus debitis impedit neque ad sapiente fugiat veniam molestiae doloremque quae natus, sequi soluta! Porro sapiente ex inventore voluptatem ea recusandae rerum doloribus qui id possimus, iure odit?
//               </div>
//             </div> */}
//             {/* <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
//               Upcoming Credentials Committee Meeting Date: DD - MM - YYYY
//             </div> */}
//             <div className={`${style.marginTop} ${style.reviewButtonContainer}`} onClick={() => getIsOpen(false)}>
//               {userRole?.includes("Department Head") ? <div className={style.reviewButton}>START REVIEW</div> : <div className={style.reviewButton}>CONTINUE</div>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Dialog>
    
//   );
// };

// export default NotesCommentsDialog;

import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT , POST , TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import CryptoJS from 'crypto-js';
import { format } from 'date-fns';
import { SuccessToaster,ErrorToaster } from "../../utils/toaster";
import { fileLoadingURL, FormatPhoneNumber, FormatPostalCode } from "../../utils/formatting";

const ApprovalWithNotesDialog = ({ getIsOpen, dateFormat, getActiveApplicationView, selectedTab }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [logDetails, setLogDetails] = useState([]);
  const [userRoleComments, setUserRoleComments] = useState('');
  const [isChecked, setIsChecked] = useState({ isChecked1: false, isChecked2: false });
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const id = sessionStorage.getItem("applicationId");
  const componentRef = useRef(null);
  const [isSigned, setIsSigned] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [dateTime] = useState(new Date().toISOString());
  const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
  const [encryptedText, setEncryptedText] = useState('');
  const [isCheckedSign, setIsCheckedSign] = useState(false);
  const [name, setName] = useState('')
  const [applicationType, setApplicationType] = useState(() =>
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );
  const [entity, setEntity] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropzoneStyle = {
      width: "100%",
      height: "auto",
      borderWidth: 2,
      borderColor: "rgb(102, 102, 102)",
      borderStyle: "dashed",
      borderRadius: 5,
    };
    const [isLoadingImage, setIsLoadingImage] = useState(false);
  // useEffect(() => {
  //   if (dateFormat) {
  //     setCurrentDate(format(new Date(), dateFormat));
  //   }
  // }, [dateFormat]);

   useEffect(() => {
        getApplicationEntity();
        getLog();;
      }, [applicationType]);


  const onClicksignFunction = () => {
    setTodayDate();
    handleSignatureClick();
  };


  const setTodayDate = () => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    setCurrentDate(formattedDate);
  };

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
  }, [applicationType]);

  useEffect(() => {
    setIsCheckedSign(formDetails?.forms?.[19]?.acknowledged || true);
    setIsSigned(
      formDetails?.forms?.[19]?.esign?.esign !== undefined &&
      formDetails?.forms?.[19]?.acknowledged
    );
  }, [formDetails]);

  useEffect(() => {
    if (name && dateTime) {
      setEncryptedText(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());
    }
  }, [name, dateTime, publicKey]);

  useEffect(() => {
    checkApproveEnabled();
  }, [isChecked, userRoleComments, isSigned]);

  useEffect(() => {
    setUserDetails();
  }, [users?.id])

  const changeHandler = async (event) => {
      setIsLoading(true);
      const filesArray = Array.from(event);
      setFiles(filesArray);
      console.log(event, 'Test');
  
  
      const formData = new FormData();
      let fileNameArray = [];
      filesArray?.forEach(file => {
        fileNameArray.push({ "fileName": file?.name });
        formData.append('documents', file);
      });
  
  
  
  
      formData.append('files', new Blob([JSON.stringify(fileNameArray)], {
        type: "application/json"
      }));
  
      fileNameArray.forEach(file => {
        console.log("File name:", file.fileName);
      });
  
      console.log("file?.name" + JSON.stringify(fileNameArray));
      console.log(fileNameArray)
      console.log(event?.name);
  
      try {
        const response = await POST(`application-management-service/application/${id}/files/bulk?isLLMRequired=${false}`, formData);
        SuccessToaster('File Uploaded Successfully');
        console.log(response?.data?.fileName);
  
  
  
        setIsLoading(false);
        return response?.data;
      } catch (error) {
        ErrorToaster('File Upload Failed');
        console.error(error);
        setIsLoading(false);
        return null;
      }
    };

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    console.log("userdataaaa" + JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUserRole(userData?.roles?.map((data) => data?.roleName));
    setName(`${userData?.name?.firstName} ${userData?.name?.lastName}`);
  }

  const getApplicationEntity = async () => {
    const { data: basicFormEntity } = await GET(`entity-service/entity/${TenantID}`);
    setEntity(basicFormEntity);
  };

  const getLog = async () => {
        setIsLoadingImage(true);
        const { data: basicLog } = await GET(`application-management-service/application/${id}/logs`);
        setLogDetails(basicLog);
        console.log("basicLog" +JSON.stringify(basicLog));
        setIsLoadingImage(false)
      };

  const getApplication = async () => {
    try {
      setIsLoadingImage(true);
      const { data: basicForm } = await GET(`application-management-service/application/${id}`);
      setFormDetails(basicForm);
      setIsLoadingImage(false)
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };

  const checkRequirements = () => {
    return userRole.includes('Chief Of Staff')
      ? isChecked.isChecked1
      : (isChecked.isChecked2);
  };

  const handleSignatureClick = () => {
    {
      setIsSigned(!isSigned);
      setIsEdited(true);
    }
  };

  const checkApproveEnabled = () => {
    const hasValidComments = userRoleComments.trim() !== '';

    if (userRole.includes('Chief Of Staff')) {
      setIsApproveEnabled(isChecked.isChecked1 && hasValidComments && isSigned);
    } else {
      // setIsApproveEnabled(isChecked.isChecked2 && hasValidComments && isSigned);
      setIsApproveEnabled(hasValidComments);
    }
  };
  const onClose = () => {
    getActiveApplicationView(false);
    getIsOpen(false);
  };

  const onClickApproveMoveFunction = () => {
    handleApplicationApprove(true);
    getApplicationMoveToNext(true);
  }

  const handleApplicationApprove = async () => {
    let role;
    let title;
    let notesComments = userRoleComments;
    let isDelegate = true;

    // Determine role based on selectedTab and applicationType
    if (selectedTab === 'level-2') {
      if (userRole?.includes("Department Head")) {
          role = "Department Head";
          isDelegate = false;
          title = "Dept. Head / Chief Review"
      } else {
          role = "Department Head";
          title = "Dept. Head / Chief Review"
      }
     }else if (selectedTab === 'level-3') {
      if (userRole?.includes("Credentialing Committee")) {
        role = "Credentialing Committee";
        title = "Credentialing Committee Review";
        isDelegate = false;
      } else if (userRole?.includes("chief of staff")) {
        role = "Chief Of Staff";
        isDelegate = false;
        title = "Chief Of Staff Review";
      }
    } else if (selectedTab === 'level-4') {
      role = "Advisory Committee";
      title = "MAC Review";
    } else if (selectedTab === 'level-5') {
      role = "Board";
      title = "BOD Approval";
    } else if (selectedTab === 'level-1') {
      role = "Staff Manager";
      title = "Staff Manager Verification";
    }

    // Prepare the payload
    let temp = {
      role: isDelegate ? role : "",
      notes: {
        notes: notesComments
      },
      approvedDate: new Date().toISOString(),
      title: title
    };

    await PUT(`application-management-service/application/${id}/workflow/complete/APPROVED?isDelegate=${isDelegate}&approvalType=RECOMMENDED_WITH_NOTES`, temp)
      .then(response => {
        console.log('success');
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const handleApplicationApprove = async () => {
  //   let role;
  //   let notes = { userRoleComments }
  //   let isDelegate = true; // Default value for isDelegate
  //   // notes = { userRoleComments }

  //   if (selectedTab === 'level-2' && applicationType === "NEW") {
  //     role = "Department Head";
  //     // notes = { userRoleComments };
  //   } else if (selectedTab === 'level-2' && applicationType === "REAPPOINTMENT") {
  //     role = "Credentialing Committee";
  //     // notes = { userRoleComments };
  //   } else if (selectedTab === 'level-3' && applicationType === "NEW") {
  //     role = "Credentialing Committee";
  //     // notes = { userRoleComments };
  //   } else if (selectedTab === 'level-3' && applicationType === "REAPPOINTMENT") {
  //     role = "Advisory Committee";
  //     // notes = { userRoleComments };
  //   } else if (selectedTab === 'level-4' && applicationType === "NEW") {
  //     role = "Advisory Committee";
  //     // notes = { userRoleComments };
  //   } else if (selectedTab === 'level-4' && applicationType === "REAPPOINTMENT") {
  //     role = "Board";
  //     // notes = { userRoleComments };
  //   } else if (selectedTab === 'level-5' && applicationType === "NEW") {
  //     role = "Board";
  //     // notes = { userRoleComments };
  //   }

  //   if (selectedTab === 'level-2' && userRole?.includes("Credentialing Committee")) {
  //     isDelegate = false;
  //   }
  //   else if (selectedTab === 'level-1' && userRole?.includes("Staff Manager")) {
  //     isDelegate = false;
  //   }
  //   else if (selectedTab === 'level-3' && userRole?.includes("Credentialing Committee") && applicationType === "NEW") {
  //     isDelegate = false;
  //   } else {
  //     notes = { userRoleComments: '' }
  //   }

  //   let temp = {
  //     role: isDelegate ? role : "",
  //     notes: notes,
  //   };

  //   await PUT(`application-management-service/application/${id}/workflow/complete/APPROVED?isDelegate=${isDelegate}`, temp)
  //     .then(response => {
  //       console.log('success');
  //       onClose();
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const getApplicationMoveToNext = async () => {
    let role;
    let title;
    let notesComments = userRoleComments;
    let isDelegate = true;

    // Determine role based on selectedTab and applicationType
    if (selectedTab === 'level-2') {
      if (userRole?.includes("Department Head")) {
          role = "Department Head";
          isDelegate = false;
          title = "Dept. Head / Chief Review"
      } else {
          role = "Department Head";
          title = "Dept. Head / Chief Review"
      }
     }else if (selectedTab === 'level-3') {
      if (userRole?.includes("Credentialing Committee")) {
        role = "Credentialing Committee";
        title = "Credentialing Committee Review";
        isDelegate = false;
      } else if (userRole?.includes("chief of staff")) {
        role = "Chief Of Staff";
        isDelegate = false;
        title = "Chief Of Staff Review";
      }
    } else if (selectedTab === 'level-4') {
      role = "Advisory Committee";
      title = "MAC Review";
    } else if (selectedTab === 'level-5') {
      role = "Board";
      title = "BOD Approval";
    } else if (selectedTab === 'level-1') {
      role = "Staff Manager";
      title = "Staff Manager Verification";
    }

    // Prepare the payload
    let temp = {
      role: isDelegate ? role : "",
      notes: {
        notes: notesComments
      },
      approvedDate: new Date().toISOString(),
      title: title
    };


    await PUT(`application-management-service/application/${id}/workflow/move?isDelegate=${isDelegate}`, temp)
      .then(response => {
        console.log('successfull');
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
};


  // const getApplicationMoveToNext = async () => {

  //   let role;
  //   let notes;
  //   let isDelegate = true; // Default value for isDelegate

  //   // Determine role based on selectedTab and applicationType
  //   if (selectedTab === 'level-2' && applicationType === "NEW") {
  //     role = "Department Head";
  //     // notes = {userRoleComments};
  //   } else if (selectedTab === 'level-2' && applicationType === "REAPPOINTMENT") {
  //     role = "Credentialing Committee";
  //     // notes = {userRoleComments};
  //   } else if (selectedTab === 'level-3' && applicationType === "NEW") {
  //     role = "Credentialing Committee";
  //     // notes = {userRoleComments};
  //   } else if (selectedTab === 'level-3' && applicationType === "REAPPOINTMENT") {
  //     role = "Advisory Committee";
  //     // notes = {userRoleComments};
  //   } else if (selectedTab === 'level-4' && applicationType === "NEW") {
  //     role = "Advisory Committee";
  //     // notes = {userRoleComments};
  //   } else if (selectedTab === 'level-4' && applicationType === "REAPPOINTMENT") {
  //     role = "Board";
  //     // notes = {userRoleComments};
  //   } else if (selectedTab === 'level-5' && applicationType === "NEW") {
  //     role = "Board";
  //     // notes = {userRoleComments};
  //   }

  //   // Override isDelegate logic for specific conditions
  //   if (selectedTab === 'level-2' && userRole?.includes("Credentialing Committee")) {
  //     isDelegate = false;
  //   }
  //   if (selectedTab === 'level-1' && userRole?.includes("Staff Manager")) {
  //     isDelegate = false;
  //   }
  //   if (selectedTab === 'level-3' && userRole?.includes("Credentialing Committee") && applicationType === "NEW") {
  //     isDelegate = false;
  //   }

  //   let temp = {
  //     role: isDelegate ? role : " ",
  //     notes: notes,
  //   };

  //   await PUT(`application-management-service/application/${id}/workflow/move?isDelegate=${isDelegate}`, temp)
  //     .then(response => {
  //       console.log('successfull');
  //       onClose();
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const handleCheckboxChange = (checkboxName) => (event) => {
    const newIsChecked = {
      ...isChecked,
      [checkboxName]: event.target.checked,
    };
    setIsChecked(newIsChecked);
  };

  const dynamicValues = {
    ApplicantName: `${formDetails?.basicDetails?.applicant?.name?.firstName || ''} ${formDetails?.basicDetails?.applicant?.name?.lastName || ''}`,
    EntityName: "Cambridge memorial Hospital",
  };

  const formatLabel = (template, values) =>
    template.replace(/{(.*?)}/g, (_, key) => values[key] || '');

  const getUserRole = (selectedTab) => {
    switch (selectedTab) {
      case "level-1":
        return "Staff Manager";
      case "level-2":
        return "Department Head";
      case "level-3":
        if (userRole?.includes("Credentialing Committee")) {
          return "Credentialing Committee";
        }
        if (userRole?.includes("Chief Of Staff")) {
          return "Chief Of Staff";
        }
        return "Credentialing Committee";
      case "level-4":
        return "Advisory Committee";
      case "level-5":
        return "Board";
      default:
        return "";
    }
  };

  const userRoleTab = getUserRole(selectedTab);
  const lastModifiedDate = formDetails?.lastModifiedDate;
  const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), "MMM dd, yyyy") : "-";
  const lastSubmittedLog = logDetails?.logs?.find((log) => log.workflowStatus === "SUBMITTED");
  const lastSubmittedDate = lastSubmittedLog ? lastSubmittedLog.lastModifiedDate : null;
  const formattedSubmissionDate = lastSubmittedDate ? format(new Date(lastSubmittedDate), "MMM dd, yyyy") : "-";
  const CredUpcomingDate = formDetails?.upcomingCredCommitteeMeetingDate;
  const upcomingCredCommitteeMeetingDate = CredUpcomingDate ? format(new Date(CredUpcomingDate), "MMM dd, yyyy") : "-";

  if (!userRole?.includes('Credentialing Committee') && !userRole?.includes('Department Head')) {
    return null;
  }

  return (
<>
 {isLoadingImage && (
      <div
        className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
      >
        <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
      </div>
    )}

 {!isLoadingImage && (

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
              {/* {userRoleTab} Review & Approval */}
              Staff Reappointment for Review & Approval
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
            {/* <div className={`${style.cardStyle} ${style.marginTop10}`}>
              <div className={`${style.displayInRow}`}>
                <div className={`${style.namefontstyle} ${style.marginTop10}`}>
                  {formDetails?.basicDetails?.applicant?.name?.firstName
                    ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                    formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                    : ""}{", "}
                  {formDetails?.basicDetails?.applicant?.name?.lastName?.toUpperCase()}{", "}
                  <span className={`${style.applicantTypeFontStyle}`}>
                    {formDetails?.providerType?.category}
                  </span>
                </div>
                <div className={`${style.displayIdFontStyle} ${style.marginBoth}`}>({`${formDetails?.displayId}` || "-"})</div>
              </div>
                  <div className={`${style.marginBothText}`}>Department:<span className={`${style.rightSideFontStyle}`}>{formDetails?.basicDetails?.departmentSpecialty?.department || "-"}</span></div>
                  <div className={`${style.marginBothText}`}>Division Or Specialty:<span className={`${style.rightSideFontStyle}`}>{formDetails?.basicDetails?.departmentSpecialty?.specialty || "-"}</span></div>

                  <div className={`${style.marginBothText} ${style.marginBottom}`}>Privilege Category:<span className={`${style.rightSideFontStyle}`}>{formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || "-"}</span></div>

            </div> */}
             <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
              <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
                <div className={`${style.displayInRow} ${style.displayInRowCenter}`}>
                  <span className={style.rejectionHeadingTextStyle}>
                  {formDetails?.basicDetails?.applicant?.name?.firstName
                  ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                    formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                  : ""}{", "}
                  {formDetails?.basicDetails?.applicant?.name?.lastName?.toUpperCase()}{", "}
                  {/* {formDetails?.basicDetails?.applicant?.name?.middleName?.toUpperCase()}{","} */}
                  </span>
                <div className={`${style.rejectionTextStyle} ${style.marginLeft2}`}>{formDetails?.providerType?.serviceProviderType}</div>
                  {/* <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{formDetails?.displayId}</span> */}
                </div>
                <div>
                <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || "-"}</span>
                </div>
              </div>
              {/* <div className={`${style.rejectionTextStyle} ${style.marginLeft20} ${style.marginTop5}`}>{formDetails?.providerType?.serviceProviderType}</div> */}
              <div className={style.marginTop10}>
                <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Department:</span>
                    <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetails?.departmentSpecialty?.department || "-"}</span>
                  </div>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Application ID:</span>
                    <span className={`${style.rejectionTextStyle1}`}>{formDetails?.displayId || "-"}</span>
                  </div>
                {/* </div>
              </div>
              <div className={style.marginTop5}>
                <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}> */}
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Division / Speciality:</span>
                    <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetails?.departmentSpecialty?.specialty || "-"}</span>
                  </div>
                  {/* <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
                    <span className={`${style.rejectionTextStyle1}`}>Only If Multisite</span>
                  </div> */}
                  {
                    entity?.multiSiteEntity && (
                        <div className={`${style.twoColumnGridInner}`}>
                        <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
                        <span className={`${style.rejectionTextStyle1}`}>
                            {entity?.multiSiteEntity?.[0]?.name || "-"}
                        </span>
                        </div>
                    )
                    }
                {/* </div>
              </div>
              <div className={style.marginTop5}>
                <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}> */}
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Submission Date:</span>
                    <span className={`${style.rejectionTextStyle1}`}>{formattedSubmissionDate}</span>
                  </div>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Last Updated:</span>
                    <span className={`${style.rejectionTextStyle1}`}>{formattedDate}</span>
                  </div>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Last Updated by:</span>
                    <span className={`${style.rejectionTextStyle1}`}>
                      {formDetails?.basicDetails?.applicant?.name?.firstName
                      ? formDetails?.updatedBy?.name?.firstName.charAt(0).toUpperCase() +
                      formDetails?.updatedBy?.name?.firstName.slice(1).toLowerCase()
                      : ""}{formDetails?.updatedBy?.name?.lastName?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {logDetails?.logs?.filter(log => log.role && log.notes).map((log, index) => (
              <>
              <div className={style.marginTop}>
                 <div className={style.commentsNotesHeadingFontStyle}>
                   {log.title} Comments & Notes
                   {/* Staff Manager Comments & Notes */}
                 </div>
                 <hr color="grey" size="2"></hr>
                 <div>
                   <div className={style.commentsNotesFontStyle}>
                   {/* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy. */}
                   <div dangerouslySetInnerHTML={{ __html:(log.notes) }} />
                   </div>
                 </div>
               </div>
               </>
               ))}
              {userRole?.includes("Department Head") &&
              <>
              <div className={`${style.marginTop} ${style.credDateTextStyle}`}>
               Upcoming Credentials Committee Meeting Date: {upcomingCredCommitteeMeetingDate}
               </div>
               
               <div className={`${style.marginTop} ${style.credDateTextStyle}`}>
               Assigned Credentials Committee: Name
               </div>
               </>
               }
            <div className={`${style.marginTop} ${style.reviewButtonContainer}`} onClick={() => getIsOpen(false)}>
               {userRole?.includes("Department Head") ? <div className={style.reviewButton}>START REVIEW</div> : <div className={style.reviewButton}>CONTINUE</div>}
             </div>
          </div>
        </div>
      </div>
    </Dialog>
)}
</>
  );
};

export default ApprovalWithNotesDialog;


