import React from "react";
import { InputGroup, Intent } from "@blueprintjs/core";
import { preventNegativeValues } from "../../../utils/formatting";

import style from "./index.module.scss";

const CommonInputField = ({
  onChange,
  readOnly,
  className,
  leftElement,
  placeholder,
  maxLength,
  onFocus,
  value,
  disabled,
  type,
  min,
  key,
  defaultValue,
  onBlur,
  error,
  label,
  required,
}) => {
  const contractStatus = sessionStorage.getItem("Selected Contract Status");
  // console.log(error)
  return (
    <div>
      <div className={`${style.lableStyle} ${label ? style.marginBottom : ""}`}>{label}{required && '*'}</div>
      <InputGroup
        value={value}
        onChange={onChange}
        readOnly={contractStatus === "ACTIVE" ? true : readOnly}
        className={`${className}`}
        leftElement={leftElement}
        placeholder={placeholder}
        maxLength={maxLength}
        onFocus={onFocus}
        disabled={disabled}
        type={type}
        min={min}
        key={key}
        defaultValue={defaultValue}
        onKeyDown={
          type === "number" || type === "tel" ? preventNegativeValues : () => {}
        }
        onBlur={onBlur}
        intent={error ? Intent.DANGER : Intent.NONE}
      />
    </div>
  );
};

export default CommonInputField;
