import React from 'react';
import TextField from '@mui/material/TextField';

const CommonTextField = ({ value, onChange, readOnly, className, type, maxLength, disabled, InputProps, key, defaultValue, min }) => {
    const contractStatus = sessionStorage.getItem('Selected Contract Status');

    return (
        <TextField
            size="small"
            type={type}
            maxLength={maxLength}
            min={min}
            disabled={contractStatus === "ACTIVE" ? true : disabled}
            InputProps={InputProps}
            onChange={onChange}
            value={value}
            inputProps={{
                style: {
                    height: 15,
                },
            }}
            className={className}
            readOnly={readOnly}
            key={key}
            defaultValue={defaultValue}
        />
    )
}

export default CommonTextField;