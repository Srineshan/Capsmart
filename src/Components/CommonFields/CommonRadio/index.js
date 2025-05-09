import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import style from './index.module.scss';


const CommonRadio = ({ onChange, className, value, radioValue, label, required, readOnly }) => {
  const contractStatus = sessionStorage.getItem('Selected Contract Status');
  const warningCheck = (value === '');
  const theme = createTheme({
    palette: {
      error: {
        main: '#FF6562', // Customize your error color here
      },
      warning: {
        main: '#f57c00', // Customize your error color here
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <FormControl>
        <RadioGroup
          row
          className={className}
          value={value}
          onChange={onChange}
          sx={{ color: "#2C2C2C" }}
        >
          {radioValue?.map((data, index) => (
            <FormControlLabel
              value={data}
              control={
                <Radio
                  sx={{
                    color: "#B3B8BD",
                    "&.Mui-checked": { color: "#06617A" },
                  }}
                  size="small"
                  disabled={readOnly ? true : false}
                />
              }
              label={label[index]}
              componentsProps={{ typography: { variant: "subtitle2" } }}
            />
          ))}
        </RadioGroup>
        {/* <div>
                    {warningCheck ? (<div className={`${style.helperText} ${required ? style.errorColor : style.warningColor}`}>Could not find data</div>) : ''}
                </div> */}
      </FormControl>
    </ThemeProvider>
  );
}

export default CommonRadio;