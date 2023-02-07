import React from 'react';
import TextField from '@mui/material/TextField';

const CommonTextField = ({ value, onChange, readOnly, className, type, maxLength, disabled }) => {
    return (
        <TextField
            size="small"
            type={type}
            maxLength={maxLength}
            disabled={disabled}
            InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
            }}
            onChange={onChange}
            value={value}
            inputProps={{
                style: {
                    height: 15,
                },
            }}
            className={className}
        />
    )
}

export default CommonTextField;