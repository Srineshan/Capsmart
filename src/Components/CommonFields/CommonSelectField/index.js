import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import style from './index.module.scss';

const CommonSelectField = ({ value, onChange, className, firstOptionLabel, firstOptionValue, valueList, labelList, disabledList, disabledSelect, defaultValue, widthValue, menuColor, error, label, required, warning }) => {
    const contractStatus = sessionStorage.getItem('Selected Contract Status');
    const warningCheck = (value === '' || value === undefined || value === null) && value !== firstOptionValue;
    const [touched, setTouched] = useState(false);
    const handleBlur = () => {
        setTouched(true);
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
        components: {
            MuiSelect: {
                styleOverrides: {
                    select: {
                        textAlign: "left", // Ensure left alignment globally
                    },
                },
            },
        },
    });
    return (
        <div>
            <div className={`${style.lableStyle}`}>{label}{required && '*'}</div>
            <div className={style.marginTop}>
                <ThemeProvider theme={theme}>
                    <FormControl size="small" className={`${!widthValue ? style.fullWidth : ''}`} sx={`${widthValue && { width: widthValue }} ${{
                        '& .MuiFormControlLabel-root': {
                            color: warningCheck ? !required ? theme.palette.error.main : theme.palette.warning.main : '',
                        },
                    }}`}
                        error={(warningCheck && warning) || (touched && warningCheck)}
                    >
                        <Select
                            labelId="demo-simple-select-error-label"
                            id="demo-simple-select-error"
                            displayEmpty
                            defaultValue={defaultValue}
                            value={value}
                            onChange={onChange}
                            SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                            className={className}
                            error={error}
                            inputProps={{ style: { textAlign: "right" } }}
                            color={(warning && warningCheck) || (touched && warningCheck) ? 'error' : ''}
                            focused={(warning && warningCheck) || (touched && warningCheck) ? true : false}
                            onBlur={handleBlur}
                        // helperText={warningCheck ? (<div className={`${style.helperText} ${required ? style.errorColor : style.warningColor}`}>Could not find data</div>) : ''}

                        // disabled={(contractStatus === "ACTIVE" && !window.location.pathname.includes('moveToDraft')) ? true : disabledSelect || false}
                        >
                            {firstOptionLabel !== '' && firstOptionLabel && (
                                <MenuItem value={firstOptionValue}>{firstOptionLabel}</MenuItem>
                            )}
                            {valueList?.map((data, index) => (
                                <MenuItem value={data} key={index} disabled={disabledList[index]} style={{ backgroundColor: menuColor ? menuColor[index] : "", opacity: disabledList[index] ? 0.7 : 1 }}>{labelList[index]}</MenuItem>
                            ))}
                        </Select>
                        {/* <div>
                            {warningCheck ? (<div className={`${style.helperText} ${required ? style.errorColor : style.warningColor}`}>Could not find data</div>) : ''}
                        </div> */}
                    </FormControl>
                </ThemeProvider>
            </div>
        </div>
    )
}

export default CommonSelectField;