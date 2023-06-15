import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ErrorToaster } from './../../utils/toaster';

import style from './index.module.scss';

const SiteDepartmentField = ({ sites, getSelectedSites, selectedSites }) => {
  const [departmentsSelected, setDepartmentsSelected] = useState([]);
  const [selectedSite, setSelectedSite] = useState(undefined);
  const [siteData, setSiteData] = useState([]);
  const [departmentList, setDepartmentList] = useState();

  console.log('sites', sites, selectedSites)

  useEffect(() => {
    if (sites?.length === 1) {
      onSiteSelected(sites?.[0]?.id);
    }
  }, [sites])

  useEffect(() => {
    setSiteData(selectedSites);
  }, [selectedSites])

  useEffect(() => {
    let dept = sites?.filter(site => site?.id === selectedSite)?.map(site => site?.departmentList?.departments)?.[0];
    console.log('dept', dept);
    if (dept?.length > 1) {
      console.log('inside selected Site change dept length greater thatn 1');
      setDepartmentsSelected([]);
    } else {
      setDepartmentsSelected([dept?.[0]?.id]);
    }
  }, [selectedSite])

  useEffect(() => {
    if (selectedSite !== undefined && departmentsSelected?.length !== 0) {
      onAdd();
    }
  }, [departmentsSelected])

  const onDepartmentSelect = (e) => {
    const {
      target: { value },
    } = e;
    setDepartmentsSelected(
      typeof value === 'string' ? value.split(',') : value,
    );
  }


  const onSiteSelected = (value) => {
    let siteId = value;
    setSelectedSite(siteId);
    let depts = sites?.filter(site => siteId === site?.id)?.map(data =>
      data?.departmentList?.departments
    )[0];
    console.log('departments', depts);
    setDepartmentList(depts);
  }

  console.log('dept selected', departmentsSelected);

  const onAdd = () => {
    if (selectedSite === undefined) {
      ErrorToaster('Select Site to add');
      return;
    }
    if (departmentsSelected?.length === 0) {
      ErrorToaster('Select Departments to add');
      return;
    }
    let temp = siteData?.filter(site => site?.id !== selectedSite)?.map(data => data);
    let departments = departmentList?.filter(dept => departmentsSelected?.map(data => data).includes(dept?.id))?.map(data => data) || [];
    let site =
    {
      "id": selectedSite,
      "departmentList": {
        "departments": departments
      },
      "siteName": {
        "siteName": sites?.filter(site => site?.id === selectedSite)?.map(site => site?.siteName?.siteName)[0]
      }
    }
    temp.push(site);
    setSiteData(temp);
    getSelectedSites(temp);
  }

  console.log('deparmentList', departmentList);


  const onRemoveDept = (siteIndex, deptIndex, deptId) => {
    setDepartmentsSelected(departmentsSelected?.filter(dept => dept !== deptId)?.map(data => data));
    let temp = siteData?.filter((site, index) => index !== siteIndex)?.map(data => data);
    let currentSite = siteData?.filter((site, index) => index === siteIndex)?.map(data => data)[0];
    let departments = currentSite?.departmentList?.departments?.filter((dept, index) => index !== deptIndex)?.map(data => data);
    let site =
    {
      "id": currentSite?.id,
      "departmentList": {
        "departments": departments
      },
      "siteName": {
        "siteName": currentSite?.siteName?.siteName
      }
    }
    temp.push(site);
    setSiteData(temp);
    getSelectedSites(temp);
  }

  console.log(siteData, 'selected site')

  return (
    <div>
      <div className={style.siteDeptGrid}>
        {sites?.length > 1 ? <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small">Select Site</InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            input={<OutlinedInput label="Select Site" />}
            onChange={(e) => onSiteSelected(e?.target?.value)}
            SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
          >
            {sites?.map(data => (
              <MenuItem value={data?.id}>{data?.siteName?.siteName}</MenuItem>
            ))}
          </Select>
        </FormControl> :
          <FormControl sx={{ minWidth: 120 }} size="small">
            <TextField id="outlined-basic" value={sites?.[0]?.siteName?.siteName} variant="outlined" readOnly size='small'
              inputProps={{
                style: {
                  height: 15,
                },
              }}
            />
          </FormControl>
        }
        {departmentList?.length > 1 ? <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="demo-multiple-checkbox-label">Select Service Area / Dept</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-select-small"
            multiple
            value={departmentsSelected}
            onChange={(e) => { onDepartmentSelect(e) }}
            displayEmpty
            input={<OutlinedInput label="Select Service Area / Dept" />}
            SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
          >
            {
              departmentList?.map(dept => (
                <MenuItem value={dept?.id}>{dept?.departmentName?.name}</MenuItem>
              )
              )
            }
          </Select>
        </FormControl> :
          <FormControl sx={{ minWidth: 120 }} size="small">
            <TextField id="outlined-basic" value={departmentList?.[0]?.departmentName?.name} variant="outlined" readOnly size='small'
              inputProps={{
                style: {
                  height: 15,
                },
              }}
            />
          </FormControl>
        }
      </div>
      {
        siteData?.filter(site => site?.departmentList?.departments?.length !== 0)?.map((site, siteIndex) => (
          <div className={`${style.siteDeptFieldCard} ${style.marginTop10}`}>
            {

              site?.departmentList?.departments?.filter(dept => dept?.departmentName?.name !== undefined)?.map((dept, deptIndex) => (
                <div className={`${style.deptCard} ${style.displayInRow} ${style.verticalAlignCenter} ${style.marginRight5}`}>
                  <div className={`${style.siteDeptTextStyle} ${style.marginLeft10}`}>{dept?.departmentName?.name}-{site?.siteName?.siteName}</div>
                  {
                    (siteData?.length > 1 || site?.departmentList?.departments?.length > 1) &&
                    <CloseIcon fontSize="20px" className={`${style.siteDeptCrossStyle} ${style.marginLeft10} ${style.cursorPointer}`} onClick={() => { onRemoveDept(siteIndex, deptIndex, dept?.id) }} />

                  }
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

export default SiteDepartmentField;
