import React, { useCallback, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DateInput2 } from "@blueprintjs/datetime2";
import { format, parse, parseISO } from "date-fns";
import { jsDateFormatter } from './../../../utils/jsDateFormatter'

import style from './index.module.scss'

const CommonDateField = ({ onChange, value, InputProps, onOpen, onClose, open, renderInput, minDate, maxDate, label, required, className }) => {
    const contractStatus = sessionStorage.getItem('Selected Contract Status');
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
        <div>
            <div className={`${style.lableStyle}`}>{label}{required && '*'}</div>
            <div className={`${className} ${style.marginTop}`}>
                <LocalizationProvider dateAdapter={AdapterDateFns} sx={className}>
                    <DesktopDatePicker
                        // open={open}
                        // onOpen={onOpen}
                        // onClose={onClose}
                        value={value}
                        onChange={onChange}
                        InputProps={InputProps}
                        minDate={minDate}
                        maxDate={maxDate}
                        renderInput={renderInput}
                        reduceAnimations={true}
                        readOnly={contractStatus === "ACTIVE" ? true : false}
                    />
                </LocalizationProvider>
            </div>
        </div>
    )
}

export default CommonDateField;