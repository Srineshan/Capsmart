import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const CommonDateField = ({ onChange, value, InputProps, onOpen, onClose, open, renderInput, minDate, maxDate }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                open={open}
                onOpen={onOpen}
                onClose={onClose}
                value={value}
                onChange={onChange}
                InputProps={InputProps}
                minDate={minDate}
                maxDate={maxDate}
                renderInput={renderInput}
            />
        </LocalizationProvider>
    )
}

export default CommonDateField;