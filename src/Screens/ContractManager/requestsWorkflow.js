import React, {useEffect, useState} from 'react';
import ReviewerApproverField from './reviewerApproverField';
import style from './index.module.scss';

const Requests = ({users}) => {
  return(
    <div>
      <div>
        <div className={style.purpleTitle}>
          ADD-ON ACTIVITY / SERVICE REQUESTS
        </div>
        <ReviewerApproverField data={users?.filter(data=>data?.roles?.map(role=>role?.roleName).includes('Reviewer'))?.map(data=>data)} label="Designate Request Reviewer*" selectLabel="Select Reviewer" />
        <ReviewerApproverField data={users?.filter(data=>data?.roles?.map(role=>role?.roleName).includes('Approver'))?.map(data=>data)} label="Designate Request Approver*" selectLabel="Select Approver" />
      </div>
      <div className={style.marginTop50}>
        <div className={style.purpleTitle}>
          PLANNED ABSENCE REQUESTS
        </div>
        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
        <div className={style.extentionLableStyle}>Planned Absence Notification Days Limit*</div>
        <div className={style.daysSelectorGrid}>
        <select
            name="class"
            id="Class"
            className={`${style.fullWidth} `}>
            <option value="14" >
                14
            </option>
        </select>
        <div className={`${style.twoFieldWidth} ${style.verticalAlignCenter}`}>Days</div>
        </div>
        </div>
        <ReviewerApproverField data={users?.filter(data=>data?.roles?.map(role=>role?.roleName).includes('Reviewer'))?.map(data=>data)} label="Designate Request Reviewer*" selectLabel="Select Reviewer" />
        <ReviewerApproverField data={users?.filter(data=>data?.roles?.map(role=>role?.roleName).includes('Approver'))?.map(data=>data)} label="Designate Request Approver*" selectLabel="Select Approver" />
      </div>
      <div className={style.marginTop50}>
        <div className={style.purpleTitle}>
          UNPLANNED ABSENCE NOTIFICATION
        </div>
        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
        <div className={style.extentionLableStyle}>Maximum Unplanned Absence Days Allowed*</div>
        <div className={style.daysSelectorGrid}>
        <select
            name="class"
            id="Class"
            className={`${style.fullWidth} `}>
            <option value="7" >
                7
            </option>
        </select>
        <div className={`${style.twoFieldWidth} ${style.verticalAlignCenter}`}>Days</div>
        </div>
        </div>
        <ReviewerApproverField data={users?.filter(data=>data?.roles?.map(role=>role?.roleName).includes('Reviewer'))?.map(data=>data)} label="Indicate Supervisor To Notify*" selectLabel="Select Supervisor" />
      </div>
    </div>

  )
}

export default Requests;
