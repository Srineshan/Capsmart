
import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import Popover from '@mui/material/Popover';
import style from './index.module.scss';
import TaskStatusDialog from "../../Components/TaskStatusDialog";
import { formatFirstNameLastName } from '../../utils/formatting';
import TableTwo from '../../Components/TableDesignTwo';
import { format } from "date-fns";

const ApplicationApprovedDecline = ({ getApplicationApprovedDeclineDialog, declineListData, declineCount ,rejectedCount,onClickView }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDeclineTaskDialog, setShowDeclineTaskDialog] = useState(false);
  const [popoverOpenId, setPopoverOpenId] = useState(null);

  const tableHeader = ['','Staff Rejected','Staff Id', 'Staff Type', 'Rejection Note', 'CRs','Rejected By', ''];

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


const departmentHeadActionsData = [
    {
      data: "View",
      requiredValue: "boolean",
      onClick: onClickView,
    },]

  const getTableDataValues = () => {
    let No = []
    let staffRejected = [];
    let staffId = [];
    let staffType = [];
    let RejectionNote = [];
    let crs = [];
    let rejectedBy = [];
    let action = [];

    declineListData?.map((data ,index)=> {
      const colors = "grey";
      No.push(colors)
       staffRejected.push(
              `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
            );

      staffId.push(data?.displayId !== null ? `${data.displayId}` : "-");
      staffType.push(`${data?.basicDetailReferences?.applicantType?.serviceProviderType}`);
      const lastNoteHtml = data?.notesDetails?.at(-1)?.notes?.notes;
      const lastNoteText = lastNoteHtml?.replace(/<[^>]+>/g, "").trim() || "";
      RejectionNote.push(lastNoteText);
      crs.push(`${data?.clarificationCount?.totalCount}/${data?.clarificationCount?.closedCount}`|| "0");
      rejectedBy.push(
              <>
                {data?.updatedBy?.name?.firstName}<br />
                {format(new Date(data?.lastModifiedDate), "MM/dd/yyyy")}
              </>
            );
      action.push(true)
    })
    return [
      { type: "dot", value: No },
      { type: "text", value: staffRejected },
      { type: "text", value: staffId },
      { type: "text", value: staffType },
      { type: "text", value: RejectionNote },
      { type: "text", value: crs },
      { type: "text", value: rejectedBy },
      {type: "action", value: action}
    ]
  }

  return (
    <>
      <Dialog isOpen={getApplicationApprovedDeclineDialog} onClose={() => getApplicationApprovedDeclineDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
        <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
          <div className={style.spaceBetween}>
            {/* <p className={style.extensionStyle1}>Applications Approved & Declined ({declineCount})</p> */}
            <p className={style.extensionStyle1}>Applications Rejected ({rejectedCount})</p>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getApplicationApprovedDeclineDialog(false)} />
          </div>

          <div>
          <TableTwo
                tableHeaderValues={tableHeader}
                tableDataValues={getTableDataValues()}
                tableData={declineListData}
                gridStyle={style.applicantGrid2}
                actions={departmentHeadActionsData}
                scrollStyle={style.contractScrollStyle}
                tableSortValues={[]}
                heading={'There are no record to display'}
                onClickFunction={() => { }}
              />

          </div>
        </div>
      </Dialog>
      {showDeclineTaskDialog && (
        <TaskStatusDialog getIsOpen={getIsShowDeclineDialog} />
      )}
    </>
  );
};

export default ApplicationApprovedDecline;
