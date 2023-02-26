import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateInput } from '@blueprintjs/datetime';
import { jsDateFormatter } from './../../../utils/jsDateFormatter'

const CommonDateField = ({ onChange, value, InputProps, onOpen, onClose, open, renderInput, minDate, maxDate }) => {
    return (
        // <DateInput
        //     {...jsDateFormatter}
        //     onChange={onChange}
        //     value={value}
        // />
        // <DateInput
        //     {...jsDateFormatter}
        //     onChange={onChange}
        //     placeholder="M/D/YYYY"
        //     value={value}
        //     minDate={minDate}
        //     maxDate={maxDate}
        // />
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