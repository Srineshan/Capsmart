import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';

const CommonDateField = ({ onChange, value, onClick, onOpen, onClose, open, onFocus, onBlur, minDate, maxDate, placeholder }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                open={open}
                onOpen={onOpen}
                onClose={onClose}
                value={value}
                onChange={onChange}
                InputProps={{
                    style: {
                        fontSize: 14,
                        height: 30,
                    },
                    onFocus: e => {
                        onFocus;
                    },
                    onBlur: e => {
                        onBlur;
                    }
                }}
                minDate={minDate}
                maxDate={maxDate}
                renderInput={(params) => <TextField  {...params}
                    onClick={onClick}
                    inputProps={{
                        ...params.inputProps,
                        placeholder: placeholder
                    }} />}
            />
        </LocalizationProvider>
    )
}

export default CommonDateField;