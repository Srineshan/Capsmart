import React, {useState, useEffect} from 'react';
import style from './index.module.scss';

const ReviewerApproverField = ({data,label,onValueChange,selectLabel,value}) => {
  const [selectedValue,setSelectedValue] = useState(value);
  console.log('valueCheck', value, data)

  // useEffect(()=>{
  //   setSelectedValue(value);
  // },[value])

  return(
    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
     <div className={style.extentionLableStyle}>{label}</div>
      <div className={style.fullWidth}>
        <select
            name="class"
            id={selectedValue}
            className={`${style.fullWidth} `}
            value={value}
            defaultvalue={value}
            onChange={e=>onValueChange(e.target.value)}>
            <option value="0">
                {selectLabel}
            </option>
            {data?.map(data=>(
              <option value={data?.userId}>
                {data?.title?.title}
              </option>
            ))
            }
        </select>
      </div>
    </div>
  )
}

export default ReviewerApproverField;
