import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { preventNegativeValues } from '../../../utils/formatting';
import style from './index.module.scss';

const CommonTextField = ({
  value,
  onChange,
  readOnly,
  className,
  type,
  maxLength,
  disabled,
  InputProps,
  key,
  defaultValue,
  min,
  placeholder,
  label,
  required,
  warning
}) => {
  const warningCheck =
    (type === "number"
      ? value === 0 || (isNaN(value) && value !== undefined) || value === ""
      : value === "" || value === null || value === undefined);

  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
  };

  const shouldShowWarning =
    (warning && warningCheck) || (touched && required && warningCheck);

  return (
    <div>
      <div className={`${style.lableStyle}`}>
        {label}
        {required && '*'}
      </div>
      <TextField
        size="small"
        type={type}
        maxLength={maxLength}
        min={min}
        InputProps={InputProps}
        onChange={onChange}
        value={value}
        inputProps={{
          style: {
            height: 15,
          },
        }}
        placeholder={placeholder}
        className={`${className} ${style.marginTop}`}
        readOnly={readOnly}
        key={key}
        defaultValue={defaultValue}
        onKeyDown={(type === 'number' || type === 'tel') ? preventNegativeValues : () => {}}
        color={shouldShowWarning ? 'error' : ''}
        focused={shouldShowWarning}
        onBlur={handleBlur}
      />
      
    </div>
  );
};

export default CommonTextField;