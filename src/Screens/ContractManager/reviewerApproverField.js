import React, { useState, useEffect } from 'react';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

import style from './index.module.scss';

const ReviewerApproverField = ({ data, label, onValueChange, selectLabel, value, approverReviewer }) => {
  const [selectedValue, setSelectedValue] = useState(value);
  let title = [];
  data?.map(data => data?.sites?.sites?.map(site => {
    if (data?.name?.firstName && site?.siteName?.siteName && site?.siteResponsibility?.title) {
      if (site?.siteResponsibility?.title !== "" && site?.siteResponsibility?.title !== undefined && site?.siteResponsibility?.title !== null) {
        title.push({ fname: data?.name?.firstName, lname: data?.name?.lastName, suffix: data?.name?.suffix?.suffix || '', site: site?.siteName?.siteName, title: site?.siteResponsibility?.title, id: data?.id, approver: data?.roles?.filter(role => role?.roleName === 'Approver')?.map(data => data)?.length !== 0 ? true : false, reviewer: data?.roles?.filter(role => role?.roleName === 'Reviewer')?.map(data => data)?.length !== 0 ? true : false });
      }

      site?.departmentList?.departments?.map(dept => {
        if (dept?.departmentResponsibility?.title !== "" && dept?.departmentResponsibility?.title !== undefined && dept?.departmentResponsibility?.title !== null) {
          title.push({ fname: data?.name?.firstName, lname: data?.name?.lastName, suffix: data?.name?.suffix?.suffix || '', site: dept?.departmentName?.name, title: dept?.departmentResponsibility?.title, titleId: dept?.departmentResponsibility?.id, id: data?.id, approver: data?.roles?.filter(role => role?.roleName === 'Approver')?.map(data => data)?.length !== 0 ? true : false, reviewer: data?.roles?.filter(role => role?.roleName === 'Reviewer')?.map(data => data)?.length !== 0 ? true : false });
        }
      })
    }
  }))

  console.log('object', title);

  return (
    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
      <CommonLabel value={label} />
      <div className={style.fullWidth}>
        {/* <select
          name="class"
          id={selectedValue}
          className={`${style.fullWidth} `}
          value={value}
          defaultvalue={value}
          onChange={e => onValueChange(e.target.value)}>
          <option value="0">
            {selectLabel}
          </option>
          {label?.includes('Aggregator') ? data?.map(data => (
            <option value={data?.id}>
              {data?.name?.firstName} {data?.name?.lastName}
            </option>
          )) :
            data?.map(data => (
              <option value={data?.userId}>
                {data?.title?.title}
              </option>
            ))
          }

        </select> */}
        <CommonSelectField className={`${style.fullWidth} `}
          defaultValue={value}
          value={value ? value : '0'}
          onChange={e => { onValueChange(e.target.value, title?.filter(titleData => titleData?.id === e.target.value && titleData[approverReviewer] === true)?.map(titleData => titleData)[0]) }}
          firstOptionLabel={selectLabel} firstOptionValue={'0'}
          valueList={label?.includes('Aggregator') ? data?.map(data => data?.id) : title?.filter(titleData => titleData[approverReviewer] === true)?.map(titleData => titleData?.id)}
          labelList={label?.includes('Aggregator') ? data?.map(data => `${data?.name?.firstName} ${data?.name?.lastName}`) : title?.filter(titleData => titleData[approverReviewer] === true)?.map(titleData => `${titleData?.fname} ${titleData?.lname}, ${titleData?.suffix}, ${titleData?.title} - ${titleData?.site}`)}
          disabledList={data?.map(data => false)}
          widthValue={390} />
      </div>
    </div>
  )
}

export default ReviewerApproverField;
