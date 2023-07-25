import React from 'react';
import { InputGroup } from '@blueprintjs/core';

const CommonInputField = ({ onChange, readOnly, className, leftElement, placeholder, maxLength, onFocus, value, disabled, type, min, key, defaultValue }) => {
    return (
        <InputGroup value={value} onChange={onChange} readOnly={readOnly} className={className} leftElement={leftElement}
            placeholder={placeholder} maxLength={maxLength} onFocus={onFocus} disabled={disabled} type={type} min={min} key={key} defaultValue={defaultValue} />
    )
}

export default CommonInputField;