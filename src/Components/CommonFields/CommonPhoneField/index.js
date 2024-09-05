import React from 'react';
import { InputGroup, Intent } from '@blueprintjs/core';

import style from './index.module.scss';
import { TextField } from '@mui/material';

const CommonPhoneField = ({ onChange, placeholder, maxLength, value, error, label, required }) => {
    const warningCheck = (value === '');
    return (
        <div>
            <div className={`${style.lableStyle}`}>{label}{required && '*'}</div>
            <div className={`${style.phoneGrid} ${style.marginTop}`}>
                <div className={`${style.lableStyle}`}>+1</div>
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
                    placeholder={placeholder}
                    className={`${style.marginTop}`}
                    color={warningCheck ? required ? 'error' : 'warning' : ''}
                    // helperText={warningCheck ? (<div className={`${style.helperText} ${required ? style.errorColor : style.warningColor}`}>Could not find data</div>) : ''}
                    focused={warningCheck ? true : false}
                />
            </div>
        </div>
    )
}

export default CommonPhoneField;