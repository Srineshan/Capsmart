import React from 'react';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';


const CommonCheckBox = ({ onChange, label, className, onFocus, value, disabled, checked, key, bigCheckbox, cursorDefault }) => {
    const contractStatus = sessionStorage.getItem('Selected Contract Status');
    return (
        <FormGroup className={className}>
            <FormControlLabel control={<Checkbox value={value} checked={checked ? true : false} onChange={onChange} disabled={contractStatus === "ACTIVE" ? true : disabled} key={key}
                sx={{
                    cursor: cursorDefault ? "default" : "pointer",
                    '&.Mui-checked': {
                        color: window.location.pathname.startsWith("/pnpManager") ? "#168E0D" : "#06617A",
                    },
                    '&.Mui-disabled': {
                        color: 'rgba(0, 0, 0, 0.26)',
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: bigCheckbox ? 48 : 26,  // Adjust the size here
                    },
                }} />} label={<Typography variant="body2" color="textSecondary" style={{ textAlign: 'left' }}>{label}</Typography>} />
        </FormGroup>
    )
}

export default CommonCheckBox;