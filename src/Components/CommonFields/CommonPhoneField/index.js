import React from 'react';
import { InputGroup, Intent } from '@blueprintjs/core';

import style from './index.module.scss';

const CommonPhoneField = ({ onChange, placeholder, maxLength, value, error, label, required }) => {
    return (
        <div>
            <div className={`${style.lableStyle}`}>{label}{required && '*'}</div>
            <div className={`${style.phoneGrid} ${style.marginTop}`}>
                <div className={`${style.lableStyle}`}>+1</div>
                <InputGroup value={value} onChange={onChange}
                    placeholder={placeholder} maxLength={maxLength} type={'text'}
                    intent={error ? Intent.DANGER : Intent.NONE} />
            </div>
        </div>
    )
}

export default CommonPhoneField;