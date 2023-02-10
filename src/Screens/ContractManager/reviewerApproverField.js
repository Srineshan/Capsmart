import React, { useState, useEffect } from 'react';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

import style from './index.module.scss';

const ReviewerApproverField = ({ data, label, onValueChange, selectLabel, value }) => {
  const [selectedValue, setSelectedValue] = useState(value);

  return (
    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
      <CommonLabel value={label} />
      <div className={style.fullWidth}>
        <select
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

        </select>
        {/* <CommonSelectField className={`${style.fullWidth} `}
          value={value || '0'}
          onChange={e => onValueChange(e.target.value)}
          firstOptionLabel={selectLabel} firstOptionValue={'0'}
          valueList={label?.includes('Aggregator') ? data?.map(data => data?.id) : data?.map(data => data?.userId)}
          labelList={label?.includes('Aggregator') ? data?.map(data => `${data?.name?.firstName} ${data?.name?.lastName}`) : data?.map(data => data?.title?.title)}
          disabledList={data?.map(data => false)} /> */}
      </div>
    </div>
  )
}

export default ReviewerApproverField;
