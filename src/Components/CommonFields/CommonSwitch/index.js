import React from 'react';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import style from './index.module.scss';

const switchTheme = createTheme({
  palette: {
    primary: {
      main: "#06617A", // keep your primary theme
    },
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: {
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#25BF6A", // green thumb when checked
          },
          "& .MuiSwitch-switchBase": {
            color: "#FF6562", // red thumb when unchecked
          },
        },
      },
    },
  },
});

const CommonSwitch = ({ checked, onChange, label, className, disabled, required, labelName }) => {
  const contractStatus = sessionStorage.getItem('Selected Contract Status');

  return (
    <div className={style.displayInRow}>
      <div className={`${style.lableStyle}`}>{labelName}{required && '*'}</div>
      <ThemeProvider theme={switchTheme}>
        <FormControlLabel
          control={
            <Switch className={className} onChange={onChange} checked={checked} disabled={contractStatus === "ACTIVE" ? true : disabled || false} size="small" />
          }
          color='primary'
          className={`${className} ${style.marginLeft}`}
          label={label}

        />
      </ThemeProvider>
    </div>
  )
}

export default CommonSwitch;