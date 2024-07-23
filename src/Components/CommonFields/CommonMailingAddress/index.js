import React from 'react';
import { InputGroup, Intent } from '@blueprintjs/core';
import style from './index.module.scss'
const CommonMailingAddress = ({ onChangeAddressLine1, placeholderAddressLine1, maxLengthAddressLine1, valueAddressLine1, disabled, error,
    onChangeAddressLine2, placeholderAddressLine2, maxLengthAddressLine2, valueAddressLine2, onChangeCity, placeholderCity, maxLengthCity,
    valueCity, onChangeState, placeholderState, maxLengthState, valueState, onChangeZipcode, placeholderZipcode, maxLengthZipcode, valueZipcode, label }) => {
    return (
        <div>
            <div className={`${style.lableStyle}`}>{label}</div>
            <InputGroup value={valueAddressLine1} onChange={onChangeAddressLine1}
                placeholder={placeholderAddressLine1} maxLength={maxLengthAddressLine1} disabled={disabled} type='text'
                intent={error ? Intent.DANGER : Intent.NONE} className={`${style.fullWidth} ${style.marginTop}`} />
            <InputGroup value={valueAddressLine2} onChange={onChangeAddressLine2}
                placeholder={placeholderAddressLine2} maxLength={maxLengthAddressLine2} disabled={disabled} type='text'
                intent={error ? Intent.DANGER : Intent.NONE} className={`${style.fullWidth} ${style.marginTop}`} />
            <div className={`${style.grid3} ${style.marginTop}`}>
                <InputGroup value={valueCity} onChange={onChangeCity}
                    placeholder={placeholderCity} maxLength={maxLengthCity} disabled={disabled} type='text'
                    intent={error ? Intent.DANGER : Intent.NONE} className={style.fullWidth} />
                <InputGroup value={valueState} onChange={onChangeState}
                    placeholder={placeholderState} maxLength={maxLengthState} disabled={disabled} type='text'
                    intent={error ? Intent.DANGER : Intent.NONE} className={style.fullWidth} />
                <InputGroup value={valueZipcode} onChange={onChangeZipcode}
                    placeholder={placeholderZipcode} maxLength={maxLengthZipcode} disabled={disabled} type='text'
                    intent={error ? Intent.DANGER : Intent.NONE} className={style.fullWidth} />
            </div>
        </div>
    )
}

export default CommonMailingAddress;