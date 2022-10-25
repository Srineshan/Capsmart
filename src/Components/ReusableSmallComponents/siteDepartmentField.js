import React, {useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import style from './index.module.scss';

const SiteDepartmentField = () => {
    const [departmentsSelected, setdepartmentsSelected] = useState([]);

    const handleDelete = () => {}

    const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setdepartmentsSelected(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };
    return(
        <div>
            <div className={style.siteDeptGrid}>
                <FormControl sx={{ minWidth: 120 }} size="small">
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        displayEmpty
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                    >
                        <MenuItem value="">
                        <em>Select Site</em>
                        </MenuItem>
                        <MenuItem value={10}>Site 1</MenuItem>
                        <MenuItem value={20}>Site 2</MenuItem>
                        <MenuItem value={30}>Site 3</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }} size="small">
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        multiple
                        value={departmentsSelected}
                        onChange={handleChange}
                        displayEmpty
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                    >
                        <MenuItem value="">
                        <em>Select Dept</em>
                        </MenuItem>
                        <MenuItem value={10}>Dept 1</MenuItem>
                        <MenuItem value={20}>Dept 2</MenuItem>
                        <MenuItem value={30}>Dept 3</MenuItem>
                    </Select>
                </FormControl>
                <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                <AddIcon sx={{ fontSize: 25, color: 'white' }} />
                </div>
            </div>
            <div className={`${style.siteDeptFieldCard} ${style.displayInRow} ${style.marginTop10}`}>
                <div className={`${style.siteCard} ${style.siteDeptTextStyle} ${style.verticalAlignCenter} ${style.marginRight10}`}>Site</div>
                <div className={`${style.deptCard} ${style.displayInRow} ${style.verticalAlignCenter} ${style.marginRight5}`}>
                    <div className={`${style.siteDeptTextStyle} ${style.marginLeft10}`}>Department</div>
                    <CloseIcon fontSize="20px" className={`${style.siteDeptCrossStyle} ${style.marginLeft10} ${style.cursorPointer}`} />
                </div>
                <div className={`${style.deptCard} ${style.displayInRow} ${style.verticalAlignCenter} ${style.marginRight5}`}>
                    <div className={`${style.siteDeptTextStyle} ${style.marginLeft10}`}>Deps tment</div>
                    <CloseIcon fontSize="20px" className={`${style.siteDeptCrossStyle} ${style.marginLeft10} ${style.cursorPointer}`} />
                </div>
                <div className={`${style.deptCard} ${style.displayInRow} ${style.verticalAlignCenter} ${style.marginRight5}`}>
                    <div className={`${style.siteDeptTextStyle} ${style.marginLeft10}`}>ftment</div>
                    <CloseIcon fontSize="20px" className={`${style.siteDeptCrossStyle} ${style.marginLeft10} ${style.cursorPointer}`} />
                </div>
            </div>
        </div>
    )
}

export default SiteDepartmentField;