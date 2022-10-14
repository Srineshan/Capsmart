import React from 'react';

const SelectField = ({dataList, valueList, displayList, value, selectLabel, onChangeFunc, className }) => {

  return(
    <select
        name="select"
        id="select-id"
        value={value}
        onChange={(e)=>onChangeFunc(e.target.value)}
        className={className?.join(' ')}
        >
        <option value="">
        {selectLabel}
        </option>
        {
          displayList?.map((data,index)=>(
            <option value={valueList?.[index]}>
            {displayList?.[index]}
            </option>
          ))
        }
    </select>
  )
}


export default SelectField;
