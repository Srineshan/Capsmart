import React, {useState, useEffect} from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import style from './index.module.scss';

const ReviewerApproverField = ({data,label,onValueChange,selectLabel,value}) => {
  const [selectedValue,setSelectedValue] = useState(value);
  console.log('valueCheck', value, data)

  // useEffect(()=>{
  //   setSelectedValue(value);
  // },[value])

  return(
    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
     <div className={style.extentionLableStyle}>{label}</div>
        <FormControl size="small">
            <Select
                value={value}
                defaultvalue={value}
                onChange={e=>onValueChange(e.target.value)}
                labelId="demo-select-small"
                id="demo-select-small"
                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
            >
            <MenuItem value={''}>Select Add-On Approver</MenuItem>
            {data?.map(data=>(
              <MenuItem value={data?.userId}>{data?.title?.title}</MenuItem>
            ))
            }
            </Select>
        </FormControl>
    </div>
  )
}

export default ReviewerApproverField;
