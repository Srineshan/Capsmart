// import React, { useState, useEffect } from 'react';
// import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
// import style from './index.module.scss';
// import Popover from '@mui/material/Popover';

// const ApplicationRejection = ({ getApplicationRejectionDialog, rejectionListData, rejectedCount,getActiveApplicationTask }) => {
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handlePopoverOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handlePopoverClose = () => {
//     setAnchorEl(null);
//   };

//   const handleViewClick = () => {
//     getActiveApplicationTask();
//   }

//   const open = Boolean(anchorEl);


//   return (
//     <Dialog isOpen={getApplicationRejectionDialog} onClose={() => getApplicationRejectionDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
//       <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
//         <div className={style.spaceBetween}>
//           <p className={style.extensionStyle1}>Applications Rejected ({rejectedCount})</p>
//           <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getApplicationRejectionDialog(false)} />
//         </div>

//         <div className={style.scrollBarStyle}>
//           {
//             rejectionListData?.map(data => {
//               return (
//                 <div className={`${style.rejectionBorderStyle} ${style.marginTop10}`}>
//                   <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
//                     <div className={style.displayInRow}>
//                       <span className={style.rejectionHeadingTextStyle}>{`${data?.applicant?.name?.firstName}, ${data?.applicant?.name?.lastName}`}</span>
//                       <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{"{Application ID}"}</span>
//                     </div>
//                     <div className={`${style.rejectionHeadingTextStyle} ${style.cursorPointer}`}
//                   aria-owns={open ? 'mouse-over-popover' : undefined}
//                   aria-haspopup="true"
//                   onMouseEnter={handlePopoverOpen}
//                   onMouseLeave={handlePopoverClose}
//                   >
//                   ...
//                   <Popover
//                     id={'mouse-over-popover'}
//                     sx={{ pointerEvents: 'none' }}
//                     open={open}
//                     anchorEl={anchorEl}
//                     anchorOrigin={{
//                       vertical: 'bottom',
//                       horizontal: 'center',
//                     }}
//                     transformOrigin={{
//                       vertical: 'top',
//                       horizontal: 'right',
//                     }}
//                     onClose={handlePopoverClose}
//                     PaperProps={{
//                       style: {
//                         backgroundColor: "transparent",
//                         boxShadow: "none",
//                         borderRadius: 0
//                       }
//                     }}
//                     disableRestoreFocus
//                   >
//                     <div className={style.multipleOptionsCard}>
//                       <div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={handleViewClick}>View</div>
//                       <div className={`${style.specificActionCard} ${style.cursorPointer}`}>Delete</div>
//                     </div>
//                   </Popover>
//                     </div>
//                   </div>
//                   <div className={style.marginTop10}>
//                     <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                       <span className={`${style.rejectionTextStyle}`}>{`${data?.providerType?.serviceProviderType}`}</span>
//                       <span className={`${style.rejectionTextStyle}`}>{"{Capmanager Name}"}</span>
//                     </div>
//                     <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                       <span className={`${style.rejectionTextStyle}`}>{"{Department} - {Speciality}"}</span>
//                       <span className={`${style.rejectionTextStyle}`}>Site Name Only If Multisite</span>
//                     </div>
//                     <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                       <span className={`${style.rejectionTextStyle}`}>{"{Application ID}"}</span>
//                       <span className={`${style.rejectionTextStyle}`}>{"Expiring In 10 Days ( 10-23-2024 )"}</span>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })
//           }
//           {/* <div className={`${style.rejectionBorderStyle} ${style.marginTop10}`}>
//             <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
//               <div className={style.displayInRow}>
//                 <span className={style.rejectionHeadingTextStyle}>{"{First, LAST}"}</span>
//                 <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{"{Application ID}"}</span>
//               </div>
//               <div className={`${style.rejectionHeadingTextStyle} ${style.cursorPointer}`} aria-owns={open ? 'mouse-over-popover' : undefined}
//                 aria-haspopup="true"
//                 onMouseEnter={handlePopoverOpen}
//                 onMouseLeave={handlePopoverClose}>...
//                 <Popover
//                   id={'mouse-over-popover'}
//                   sx={{
//                     pointerEvents: 'none',
//                   }}
//                   open={open}
//                   anchorEl={anchorEl}
//                   anchorOrigin={{
//                     vertical: 'bottom',
//                     horizontal: 'center',
//                   }}
//                   transformOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                   }}
//                   onClose={handlePopoverClose}
//                   PaperProps={{
//                     style: {
//                       backgroundColor: "transparent",
//                       boxShadow: "none",
//                       borderRadius: 0
//                     }
//                   }}
//                   disableRestoreFocus
//                 >
//                   <div className={style.multipleOptionsCard}>
//                     <div className={`${style.specificActionCard} ${style.cursorPointer}`}>View</div>
//                     <div className={`${style.specificActionCard} ${style.cursorPointer}`}>Delete</div>
//                   </div>
//                 </Popover>
//               </div>
//             </div>
//             <div className={style.marginTop10}>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Doctor}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Capmanager Name}"}</span>
//               </div>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Department} - {Speciality}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>Site Name Only If Multisite</span>
//               </div>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Application ID}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>{"Expiring In 10 Days ( 10-23-2024 )"}</span>
//               </div>
//             </div>
//           </div>
//           <div className={`${style.rejectionBorderStyle} ${style.marginTop10}`}>
//             <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
//               <div className={style.displayInRow}>
//                 <span className={style.rejectionHeadingTextStyle}>{"{First, LAST}"}</span>
//                 <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{"{Application ID}"}</span>
//               </div>
//               <div className={`${style.rejectionHeadingTextStyle} ${style.cursorPointer}`} aria-owns={open ? 'mouse-over-popover' : undefined}
//                 aria-haspopup="true"
//                 onMouseEnter={handlePopoverOpen}
//                 onMouseLeave={handlePopoverClose}>...
//                 <Popover
//                   id={'mouse-over-popover'}
//                   sx={{
//                     pointerEvents: 'none',
//                   }}
//                   open={open}
//                   anchorEl={anchorEl}
//                   anchorOrigin={{
//                     vertical: 'bottom',
//                     horizontal: 'center',
//                   }}
//                   transformOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                   }}
//                   onClose={handlePopoverClose}
//                   PaperProps={{
//                     style: {
//                       backgroundColor: "transparent",
//                       boxShadow: "none",
//                       borderRadius: 0
//                     }
//                   }}
//                   disableRestoreFocus
//                 >
//                   <div className={style.multipleOptionsCard}>
//                     <div className={`${style.specificActionCard} ${style.cursorPointer}`}>View</div>
//                     <div className={`${style.specificActionCard} ${style.cursorPointer}`}>Delete</div>
//                   </div>
//                 </Popover>
//               </div>
//             </div>
//             <div className={style.marginTop10}>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Doctor}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Capmanager Name}"}</span>
//               </div>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Department} - {Speciality}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>Site Name Only If Multisite</span>
//               </div>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Application ID}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>{"Expiring In 10 Days ( 10-23-2024 )"}</span>
//               </div>
//             </div>
//           </div>
//           <div className={`${style.rejectionBorderStyle} ${style.marginTop10}`}>
//             <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
//               <div className={style.displayInRow}>
//                 <span className={style.rejectionHeadingTextStyle}>{"{First, LAST}"}</span>
//                 <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{"{Application ID}"}</span>
//               </div>
//               <div className={`${style.rejectionHeadingTextStyle} ${style.cursorPointer}`} aria-owns={open ? 'mouse-over-popover' : undefined}
//                 aria-haspopup="true"
//                 onMouseEnter={handlePopoverOpen}
//                 onMouseLeave={handlePopoverClose}>...
//                 <Popover
//                   id={'mouse-over-popover'}
//                   sx={{
//                     pointerEvents: 'none',
//                   }}
//                   open={open}
//                   anchorEl={anchorEl}
//                   anchorOrigin={{
//                     vertical: 'bottom',
//                     horizontal: 'center',
//                   }}
//                   transformOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                   }}
//                   onClose={handlePopoverClose}
//                   PaperProps={{
//                     style: {
//                       backgroundColor: "transparent",
//                       boxShadow: "none",
//                       borderRadius: 0
//                     }
//                   }}
//                   disableRestoreFocus
//                 >
//                   <div className={style.multipleOptionsCard}>
//                     <div className={`${style.specificActionCard} ${style.cursorPointer}`}>View</div>
//                     <div className={`${style.specificActionCard} ${style.cursorPointer}`}>Delete</div>
//                   </div>
//                 </Popover>
//               </div>
//             </div>
//             <div className={style.marginTop10}>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Doctor}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Capmanager Name}"}</span>
//               </div>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Department} - {Speciality}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>Site Name Only If Multisite</span>
//               </div>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Application ID}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>{"Expiring In 10 Days ( 10-23-2024 )"}</span>
//               </div>
//             </div>
//           </div>
//           <div className={`${style.rejectionBorderStyle} ${style.marginTop10}`}>
//             <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
//               <div className={style.displayInRow}>
//                 <span className={style.rejectionHeadingTextStyle}>{"{First, LAST}"}</span>
//                 <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{"{Application ID}"}</span>
//               </div>
//               <div className={`${style.rejectionHeadingTextStyle} ${style.cursorPointer}`} aria-owns={open ? 'mouse-over-popover' : undefined}
//                 aria-haspopup="true"
//                 onMouseEnter={handlePopoverOpen}
//                 onMouseLeave={handlePopoverClose}>...
//                 <Popover
//                   id={'mouse-over-popover'}
//                   sx={{
//                     pointerEvents: 'none',
//                   }}
//                   open={open}
//                   anchorEl={anchorEl}
//                   anchorOrigin={{
//                     vertical: 'bottom',
//                     horizontal: 'center',
//                   }}
//                   transformOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                   }}
//                   onClose={handlePopoverClose}
//                   PaperProps={{
//                     style: {
//                       backgroundColor: "transparent",
//                       boxShadow: "none",
//                       borderRadius: 0
//                     }
//                   }}
//                   disableRestoreFocus
//                 >
//                   <div className={style.multipleOptionsCard}>
//                     <div className={`${style.specificActionCard} ${style.cursorPointer}`}>View</div>
//                     <div className={`${style.specificActionCard} ${style.cursorPointer}`}>Delete</div>
//                   </div>
//                 </Popover>
//               </div>
//             </div>
//             <div className={style.marginTop10}>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Doctor}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Capmanager Name}"}</span>
//               </div>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Department} - {Speciality}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>Site Name Only If Multisite</span>
//               </div>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Application ID}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>{"Expiring In 10 Days ( 10-23-2024 )"}</span>
//               </div>
//             </div>
//           </div>
//           <div className={`${style.rejectionBorderStyle} ${style.marginTop10}`}>
//             <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
//               <div className={style.displayInRow}>
//                 <span className={style.rejectionHeadingTextStyle}>{"{First, LAST}"}</span>
//                 <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{"{Application ID}"}</span>
//               </div>
//               <div className={`${style.rejectionHeadingTextStyle} ${style.cursorPointer}`} aria-owns={open ? 'mouse-over-popover' : undefined}
//                 aria-haspopup="true"
//                 onMouseEnter={handlePopoverOpen}
//                 onMouseLeave={handlePopoverClose}>...
//                 <Popover
//                   id={'mouse-over-popover'}
//                   sx={{
//                     pointerEvents: 'none',
//                   }}
//                   open={open}
//                   anchorEl={anchorEl}
//                   anchorOrigin={{
//                     vertical: 'bottom',
//                     horizontal: 'center',
//                   }}
//                   transformOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                   }}
//                   onClose={handlePopoverClose}
//                   PaperProps={{
//                     style: {
//                       backgroundColor: "transparent",
//                       boxShadow: "none",
//                       borderRadius: 0
//                     }
//                   }}
//                   disableRestoreFocus
//                 >
//                   <div className={style.multipleOptionsCard}>
//                     <div className={`${style.specificActionCard} ${style.cursorPointer}`}>View</div>
//                     <div className={`${style.specificActionCard} ${style.cursorPointer}`}>Delete</div>
//                   </div>
//                 </Popover>
//               </div>
//             </div>
//             <div className={style.marginTop10}>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Doctor}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Capmanager Name}"}</span>
//               </div>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Department} - {Speciality}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>Site Name Only If Multisite</span>
//               </div>
//               <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                 <span className={`${style.rejectionTextStyle}`}>{"{Application ID}"}</span>
//                 <span className={`${style.rejectionTextStyle}`}>{"Expiring In 10 Days ( 10-23-2024 )"}</span>
//               </div>
//             </div>
//           </div> */}
//         </div>
//       </div>
//     </Dialog>
//   )
// }

// export default ApplicationRejection;

import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import Popover from '@mui/material/Popover';
import style from './index.module.scss';
import TaskStatusDialog from "../../Components/TaskStatusDialog";

const ApplicationRejection = ({ getApplicationRejectionDialog, rejectionListData, rejectedCount,declineCount }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDeclineTaskDialog, setShowDeclineTaskDialog] = useState(false);
  const [popoverOpenId, setPopoverOpenId] = useState(null);

  const getIsShowDeclineDialog = (value) => {
    setShowDeclineTaskDialog(value);
  };

  const handlePopoverOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setPopoverOpenId(id);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverOpenId(null);
  };

  const handleViewClick = (id) => {
    setShowDeclineTaskDialog(true);
    sessionStorage.setItem("applicationId", id);
  };

  return (
    <>
      <Dialog isOpen={getApplicationRejectionDialog} onClose={() => getApplicationRejectionDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
        <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
          <div className={style.spaceBetween}>
            {/* <p className={style.extensionStyle1}>Applications Rejected ({rejectedCount})</p> */}
            <p className={style.extensionStyle1}>Applications Approved & Declined ({declineCount})</p>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getApplicationRejectionDialog(false)} />
          </div>

          <div className={style.scrollBarStyle}>
            {
              rejectionListData?.map(data => {
                const open = Boolean(anchorEl) && popoverOpenId === data?.id;

                return (
                  <div>
                  <div key={data?.id} className={`${style.rejectionBorderStyle} ${style.marginTop10}`}>
                    <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10} ${style.textAlign}`}>
                      <div className={style.displayInRowDecline}>
                        <span className={style.rejectionHeadingTextStyle}>{`${data?.applicant?.name?.firstName}, ${data?.applicant?.name?.lastName}`}</span>
                        <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{`${data?.displayId || '-'}`}</span>
                      </div>
                      <div
                        className={`${style.rejectionHeadingTextStyle} ${style.cursorPointer}`}
                        aria-owns={open ? 'popover' : undefined}
                        aria-haspopup="true"
                        onMouseEnter={(event) => handlePopoverOpen(event, data?.id)}
                      >
                        ...
                        <Popover
                          id="popover"
                          sx={{ pointerEvents: 'none' }}
                          open={open}
                          anchorEl={anchorEl}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          onClose={handlePopoverClose}
                          PaperProps={{
                            style: {
                              backgroundColor: "transparent",
                              boxShadow: "none",
                              borderRadius: 0,
                            },
                          }}
                          disableRestoreFocus
                        >
                           {/* <div className={`${style.multipleOptionsCard}`}>
                          <div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => handleViewClick(data?.id)}>View</div>
                          <div className={`${style.specificActionCard} ${style.cursorPointer}`}>Delete</div>
                        </div> */}
                            
                        </Popover>
                        <div className={`${style.multipleOptionsCard}`}>
                          <div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => handleViewClick(data?.id)}>View CheckList</div>
                          <div className={`${style.specificActionCard} ${style.cursorPointer}`}>Delete</div>
                        </div>
                      
                      </div>
                    </div>
                    <div>
                      <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                        <span className={`${style.rejectionTextStyle}`}>{`${data?.providerType?.serviceProviderType}`}</span>
                        <span className={`${style.rejectionTextStyle}`}>{`${data?.createdBy?.name?.firstName}`}</span>
                      </div>
                      <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                        <span className={`${style.rejectionTextStyle}`}>{`${data?.basicDetails?.departmentSpecialty?.department} - ${data?.basicDetails?.departmentSpecialty?.specialty}`}</span>
                        <span className={`${style.rejectionTextStyle}`}>Site Name Only If Multisite</span>
                      </div>
                      <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                        <span className={`${style.rejectionTextStyle}`}>{`${data?.displayId || '-'} `}</span>
                        <span className={`${style.rejectionTextStyle}`}>{`Expiring On ${data?.expiryDate}`}</span>
                      </div>
                    </div>
                  </div>
                           {/* <div
                        className={`${style.rejectionHeadingTextStyle} ${style.cursorPointer}`}
                        aria-owns={open ? 'mouse-over-popover' : undefined}
                        aria-haspopup="true"
                        onMouseEnter={(event) => handlePopoverOpen(event, data?.id)}
                      >
                        ...
                        <Popover
                          id="simple-popover"
                          sx={{ pointerEvents: 'none' }}
                          open={open}
                          anchorEl={anchorEl}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          onClose={handlePopoverClose}
                          PaperProps={{
                            style: {
                              backgroundColor: "transparent",
                              boxShadow: "none",
                              borderRadius: 0,
                            },
                          }}
                          disableRestoreFocus
                        >
                          
                        </Popover>
                        <div className={style.multipleOptionsCard}>
                          <div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => handleViewClick(data?.id)}>View</div>
                          <div className={`${style.specificActionCard} ${style.cursorPointer}`}>Delete</div>
                        </div>
                      
                      </div> */}
                  </div>
                );
              })
            }
          </div>
        </div>
      </Dialog>
      {showDeclineTaskDialog && (
        <TaskStatusDialog getIsOpen={getIsShowDeclineDialog} />
      )}
    </>
  );
};

export default ApplicationRejection;
