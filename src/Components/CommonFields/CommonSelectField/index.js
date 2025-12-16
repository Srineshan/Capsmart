import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import style from './index.module.scss';

const CommonSelectField = ({ value, onChange, className, firstOptionLabel, firstOptionValue, valueList, labelList, disabledList, disabledSelect, defaultValue, widthValue, menuColor, error, label, required, warning, multiple, maxSelect }) => {
    const contractStatus = sessionStorage.getItem('Selected Contract Status');
    const warningCheck = (value === '' || value === undefined || value === null) && value !== firstOptionValue;
    const [touched, setTouched] = useState(false);
    const handleBlur = () => {
        setTouched(true);
    };
    const alternateColors = ['#ffffff', '#f5f5f5']; // white and light gray
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
    console.log('warningCheck', warning, warningCheck, touched, label, required)
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
                        error={(warningCheck && warning) || (touched && warningCheck && required)}
                    >
                        <Select
                            labelId="demo-simple-select-error-label"
                            id="demo-simple-select-error"
                            displayEmpty
                            multiple={multiple}
                            defaultValue={defaultValue}
                            value={value}
                            onChange={onChange}
                            SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                            className={className}
                            error={error}
                            inputProps={{ style: { textAlign: "right" } }}
                            color={(warning && warningCheck) || (touched && warningCheck && required) ? 'error' : ''}
                            focused={(warning && warningCheck) || (touched && warningCheck && required) ? true : false}
                            onBlur={handleBlur}
                            // helperText={warningCheck ? (<div className={`${style.helperText} ${required ? style.errorColor : style.warningColor}`}>Could not find data</div>) : ''}

                            disabled={disabledSelect ? disabledSelect : false}
                        >
                            {firstOptionLabel !== '' && firstOptionLabel && (
                                <MenuItem className={style.fontStyle} value={firstOptionValue}>{firstOptionLabel}</MenuItem>
                            )}
                            {valueList?.map((data, index) => {
                                const isSelected = multiple && value?.includes(data);
                                const isDisabled = multiple && maxSelect && value?.length >= maxSelect && !isSelected;
                                const bgColor = alternateColors[index % 2];
                                return (
                                    <MenuItem
                                        key={index}
                                        value={data}
                                        disabled={disabledList[index] || isDisabled}
                                        style={{
                                            backgroundColor: menuColor ? menuColor[index] : "",
                                            opacity: disabledList[index] || isDisabled ? 0.4 : 1
                                        }}
                                        className={style.fontStyle}
                                    >
                                        {labelList[index]}
                                    </MenuItem>
                                );
                            })}
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