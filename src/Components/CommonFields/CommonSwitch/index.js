import React from 'react';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';

const switchTheme = createTheme({
    palette: {
        primary: {
            main: '#7165E3',
        },
    },
});

const CommonSwitch = ({ checked, onChange, label, className }) => {
    return (
        <ThemeProvider theme={switchTheme}>
            <FormControlLabel
                control={
                    <Switch className={className} onChange={onChange} checked={checked} />
                }
                color='primary'
                className={className}
                label={label}
            />
        </ThemeProvider>
    )
}

export default CommonSwitch;