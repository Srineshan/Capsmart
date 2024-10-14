import React from 'react';
import { InputGroup, Intent } from '@blueprintjs/core';
import InputAdornment from '@mui/material/InputAdornment';
import style from './index.module.scss';
import { TextField } from '@mui/material';

const CommonPhoneField = ({ onChange, placeholder, type, maxLength, value, error, label, required, warning }) => {
    const warningCheck = type === 'number' ? (value === 0 || value === '') : (value === '' || value === null || value === undefined);
    return (
        <div>
            <div className={`${style.lableStyle}`}>{label}{required && '*'}</div>
            <div className={`${style.marginTop}`}>
                {/* <div className={`${style.lableStyle}`}>+1</div> */}
                {/* <InputGroup value={value} onChange={onChange}
                    placeholder={placeholder} maxLength={maxLength} type={'text'}
                    intent={error ? Intent.DANGER : Intent.NONE} /> */}
                <TextField
                    size="small"
                    maxLength={maxLength}
                    onChange={onChange}
                    value={value}
                    inputProps={{
                        style: {
                            height: 15,
                        },
                    }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" className={style.fontColor}>+1</InputAdornment>,
                    }}
                    fullWidth
                    placeholder={placeholder}
                    // className={`${style.marginTop}`}
                    color={(warning && warningCheck) ? 'error' : ''}
                    // helperText={warningCheck ? (<div className={`${style.helperText} ${required ? style.errorColor : style.warningColor}`}>Could not find data</div>) : ''}
                    focused={(warning && warningCheck) ? true : false}
                />
            </div>
        </div>
    )
}

export default CommonPhoneField;