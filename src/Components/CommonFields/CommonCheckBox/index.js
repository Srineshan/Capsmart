import React from 'react';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

const CommonCheckBox = ({ onChange, label, className, onFocus, value, disabled, checked }) => {
    return (
        <FormGroup className={className}>
            <FormControlLabel control={<Checkbox value={value} checked={checked ? true : false} defaultChecked={checked} onChange={onChange} disabled={disabled}
                sx={{
                    '&.Mui-checked': {
                        color: '#7165e3'
                    },
                    '&.Mui-disabled': {
                        color: 'rgba(0, 0, 0, 0.26)',
                    }
                }} />} label={<Typography variant="body2" color="textSecondary">{label}</Typography>} />
        </FormGroup>
    )
}

export default CommonCheckBox;