import React, { useCallback, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DateInput2 } from "@blueprintjs/datetime2";
import { FormControl } from '@mui/material';
import { isBefore, isAfter } from "date-fns";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import style from './index.module.scss'

const CommonDateField = ({ onChange, value, InputProps, onOpen, onClose, open, renderInput, minDate, maxDate, label, required, className }) => {
    const contractStatus = sessionStorage.getItem('Selected Contract Status');
    const dateFnsFormat = "MM/dd/yyyy";
    const warningCheck = (value === '');

    const getDefaultCalendarMonth = (minDate, maxDate) => {
        const today = new Date();

        if (minDate && isBefore(today, minDate)) {
            return minDate;
        }

        if (maxDate && isAfter(today, maxDate)) {
            return maxDate;
        }

        return today;
    };

    const theme = createTheme({
        palette: {
            error: {
                main: '#cc0000', // Customize your error color here
            },
            warning: {
                main: '#f57c00', // Customize your error color here
            },
        },
    });
    return (

        <div>
            <div className={`${style.lableStyle}`}>{label}{required && '*'}</div>
            <div className={`${className} ${style.marginTop}`}>
                <LocalizationProvider dateAdapter={AdapterDateFns} sx={className}>
                    <ThemeProvider theme={theme}>
                        <FormControl size="small" className={style.fullWidth}
                        // sx={`${{
                        //     '& .MuiFormControlLabel-root': {
                        //         color: warningCheck ? !required ? theme.palette.error.main : theme.palette.warning.main : '',
                        //     },
                        // }}`}
                        // error={warningCheck}
                        >
                            <DesktopDatePicker
                                inputFormat="MMM dd, yyyy"
                                // mask="___ __, ____"
                                value={value}
                                onChange={onChange}
                                InputProps={InputProps}
                                minDate={minDate}
                                maxDate={maxDate}
                                renderInput={renderInput}
                                reduceAnimations={true}
                                defaultCalendarMonth={getDefaultCalendarMonth(minDate, maxDate)}
                                readOnly={contractStatus === "ACTIVE" ? true : false}
                            />
                        </FormControl>
                    </ThemeProvider>
                    {/* <div>
                        {warningCheck ? (<div className={`${style.helperText} ${required ? style.errorColor : style.warningColor}`}>Could not find data</div>) : ''}
                    </div> */}
                </LocalizationProvider>
            </div>
        </div>
    )
}

export default CommonDateField;