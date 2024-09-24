import React from 'react';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
// import { InputGroup } from '@blueprintjs/core';
import { preventNegativeValues } from '../../../utils/formatting';

const CommonTextAreaAutoSize = ({ onChange, readOnly, className, leftElement, placeholder, maxLength, onFocus, value, disabled, type, min, key, defaultValue, onBlur }) => {
    const contractStatus = sessionStorage.getItem('Selected Contract Status');

    return (
        <Textarea
            maxRows={4}
            aria-label="maximum height"
            placeholder="Maximum 4 rows"
            defaultValue={value}        
        />
        // <InputGroup value={value} onChange={onChange} readOnly={contractStatus === "ACTIVE" ? true : readOnly} className={className} leftElement={leftElement}
        //     placeholder={placeholder} maxLength={maxLength} onFocus={onFocus} disabled={disabled} type={type} min={min} key={key} defaultValue={defaultValue}
        //      />
    )
}

export default CommonTextAreaAutoSize;