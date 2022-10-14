import React from 'react';
import style from './index.module.scss';

const ReviewerApproverField = ({data,label,onValueChange,selectLabel,value}) => {
  return(
    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
     <div className={style.extentionLableStyle}>{label}</div>
      <div className={style.fullWidth}>
        <select
            name="class"
            id="Class"
            className={`${style.fullWidth} `}
            value={value}
            onChange={e=>onValueChange(e.target.value)}>
            <option value="0" >
                {selectLabel}
            </option>
            {data?.map(data=>(
              <option value={data?.id}>
                {data?.name?.firstName}
              </option>
            ))
            }
        </select>
      </div>
    </div>
  )
}

export default ReviewerApproverField;
