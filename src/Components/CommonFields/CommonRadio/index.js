import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';

const CommonRadio = ({ onChange, className, value, radioValue, radioLabel }) => {
    return (
        <FormControl>
            <RadioGroup
                row className={className}
                value={value}
                onChange={onChange}
                sx={{ color: '#52575D' }}
            >
                {radioValue?.map((data, index) => (
                    <FormControlLabel value={data}
                        control={<Radio sx={{ color: '#B3B8BD', '&.Mui-checked': { color: '#7165E3' } }} size='small' />}
                        label={radioLabel[index]} componentsProps={{ typography: { variant: 'subtitle2' } }} />
                ))}
            </RadioGroup>
        </FormControl>
    )
}

export default CommonRadio;