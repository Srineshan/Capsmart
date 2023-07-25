import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import style from './index.module.scss';
const SelectField = ({ dataList, valueList, displayList, value, selectLabel, onChangeFunc, className }) => {

  return (
    // <select
    //     name="select"
    //     id="select-id"
    //     value={value}
    //     onChange={(e)=>onChangeFunc(e.target.value)}
    //     className={className?.join(' ')}
    //     >
    //     <option value="">
    //     {selectLabel}
    //     </option>
    //     {
    //       displayList?.map((data,index)=>(
    //         <option value={valueList?.[index]}>
    //         {displayList?.[index]}
    //         </option>
    //       ))
    //     }
    // </select>
    <FormControl size="small" className={style.fullWidth}>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={value}
        onChange={(e) => onChangeFunc(e.target.value)}
        className={className?.join(' ')}
        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
      >
        <MenuItem value="">{selectLabel}</MenuItem>
        {displayList?.map((data, index) => (
          <MenuItem key={index} value={valueList?.[index]}>{displayList?.[index]}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}


export default SelectField;
