import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@mui/material';

import style from './index.module.scss';

const CommonSelectField = ({ value, onChange, className, firstOptionLabel, firstOptionValue, valueList, labelList, disabledList, disabledSelect, defaultValue, widthValue, menuColor, error, label, required }) => {
    const contractStatus = sessionStorage.getItem('Selected Contract Status');

    return (
        <div>
            <div className={`${style.lableStyle}`}>{label}{required && '*'}</div>
            <div className={style.marginTop}>
                <FormControl size="small" className={`${!widthValue ? style.fullWidth : ''}`} sx={widthValue && { width: widthValue }}>
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        displayEmpty
                        defaultValue={defaultValue}
                        value={value}
                        onChange={onChange}
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                        className={className}
                        error={error}
                        disabled={(contractStatus === "ACTIVE" && !window.location.pathname.includes('moveToDraft')) ? true : disabledSelect || false}
                    >
                        {firstOptionLabel !== '' && (
                            <MenuItem value={firstOptionValue}>{firstOptionLabel}</MenuItem>
                        )}
                        {valueList?.map((data, index) => (
                            <MenuItem value={data} key={index} disabled={disabledList[index]} style={{ backgroundColor: menuColor ? menuColor[index] : '' }}>{labelList[index]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </div>
    )
}

export default CommonSelectField;