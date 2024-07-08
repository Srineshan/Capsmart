import React from 'react';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';

const switchTheme = createTheme({
    palette: {
        primary: {
            main: '#25BF6A',
        },
    },
});

const CommonSwitch = ({ checked, onChange, label, className, disabled }) => {
    const contractStatus = sessionStorage.getItem('Selected Contract Status');

    return (
        <ThemeProvider theme={switchTheme}>
            <FormControlLabel
                control={
                    <Switch className={className} onChange={onChange} checked={checked} disabled={contractStatus === "ACTIVE" ? true : disabled || false} size="small" />
                }
                color='primary'
                className={className}
                label={label}

            />
        </ThemeProvider>
    )
}

export default CommonSwitch;