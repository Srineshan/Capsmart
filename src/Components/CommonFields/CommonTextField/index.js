import React from 'react';
import TextField from '@mui/material/TextField';
import { preventNegativeValues } from '../../../utils/formatting';
import style from './index.module.scss';

const CommonTextField = ({ value, onChange, readOnly, className, type, maxLength, disabled, InputProps, key, defaultValue, min, placeholder, label, required }) => {
    const contractStatus = sessionStorage.getItem('Selected Contract Status');
    const warningCheck = type === 'number' ? (value === undefined || value === null || value === 0 || (isNaN(value) && value !== undefined) || value === '') : (value === undefined || value === null || value === '');
    console.log(value, isNaN(value), warningCheck, type)

    return (
        <div>
            <div className={`${style.lableStyle}`}>{label}{required && '*'}</div>
            <TextField
                size="small"
                type={type}
                maxLength={maxLength}
                min={min}
                // disabled={contractStatus === "ACTIVE" ? true : disabled}
                InputProps={InputProps}
                onChange={onChange}
                value={value}
                inputProps={{
                    style: {
                        height: 15,
                    },
                }}
                placeholder={placeholder}
                className={`${className}  ${style.marginTop}`}
                readOnly={readOnly}
                key={key}
                defaultValue={defaultValue}
                onKeyDown={(type === 'number' || type === 'tel') ? preventNegativeValues : () => { }}
                color={warningCheck ? required ? 'error' : 'warning' : ''}
                helperText={warningCheck ? (<div className={`${style.helperText} ${required ? style.errorColor : style.warningColor}`}>Could not find data</div>) : ''}
                focused={warningCheck ? true : false}
            />
        </div>
    )
}

export default CommonTextField;