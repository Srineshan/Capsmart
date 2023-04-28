import React, { useCallback, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DateInput2 } from "@blueprintjs/datetime2";
import { format, parse, parseISO } from "date-fns";
import { jsDateFormatter } from './../../../utils/jsDateFormatter'

const CommonDateField = ({ onChange, value, InputProps, onOpen, onClose, open, renderInput, minDate, maxDate }) => {

    const dateFnsFormat = "MM/dd/yyyy";
    const formatDate = useCallback((date) => format(date, dateFnsFormat), []);
    const parseDate = useCallback((date) => parse(date, dateFnsFormat), []);

    return (
        // <DateInput2
        //     formatDate={formatDate}
        //     onChange={onChange}
        //     placeholder={dateFnsFormat}
        //     value={format(new Date(value), dateFnsFormat)}
        // />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
                open={open}
                onOpen={onOpen}
                onClose={onClose}
                value={value}
                onChange={onChange}
                InputProps={InputProps}
                minDate={minDate}
                maxDate={maxDate}
                renderInput={renderInput}
                reduceAnimations={true}
            />
        </LocalizationProvider>
    )
}

export default CommonDateField;