import React from 'react';
import { InputGroup } from '@blueprintjs/core';

const CommonInputField = ({ onChange, readOnly, className, leftElement, placeholder, maxLength, onFocus, value, disabled, type, min, key, defaultValue }) => {
    const contractStatus = sessionStorage.getItem('Selected Contract Status');

    return (
        <InputGroup value={value} onChange={onChange} readOnly={contractStatus === "ACTIVE" ? true : readOnly} className={className} leftElement={leftElement}
            placeholder={placeholder} maxLength={maxLength} onFocus={onFocus} disabled={disabled} type={type} min={min} key={key} defaultValue={defaultValue} />
    )
}

export default CommonInputField;