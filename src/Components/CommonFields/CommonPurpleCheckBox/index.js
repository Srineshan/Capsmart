import React from "react";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import style from "./index.module.scss";

const CommonPurpleCheckBox = ({
  onChange,
  label,
  className,
  onFocus,
  value,
  disabled,
  checked,
  name,
}) => {
  return (
    <div className={style.CommonCheckBoxStyle}>
      <input
        className={`${style.CheckedBefore} ${style.marginBottom10}`}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
};

export default CommonPurpleCheckBox;
