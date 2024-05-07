import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@mui/material';

import style from './index.module.scss';

const CommonSelectField = ({ value, onChange, className, firstOptionLabel, firstOptionValue, valueList, labelList, disabledList, disabledSelect, defaultValue, widthValue, menuColor, error }) => {
    const contractStatus = sessionStorage.getItem('Selected Contract Status');

    return (
        <FormControl size="small" className={!widthValue && style.fullWidth} sx={widthValue && { width: widthValue }}>
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
                    <MenuItem value={data} disabled={disabledList[index]} style={{ backgroundColor: menuColor ? menuColor[index] : '' }}>{labelList[index]}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default CommonSelectField;