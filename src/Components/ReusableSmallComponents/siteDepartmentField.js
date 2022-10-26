import React, {useState, useEffect} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import OutlinedInput from '@mui/material/OutlinedInput';
import AddIcon from '@mui/icons-material/Add';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {ErrorToaster} from './../../utils/toaster';

import style from './index.module.scss';

const SiteDepartmentField = ({sites, getSelectedSites}) => {
    const [departmentsSelected, setDepartmentsSelected] = useState([]);
    const [selectedSite, setSelectedSite] = useState(undefined);
    const [siteData, setSiteData] = useState([]);
    const [departmentList, setDepartmentList] = useState(sites?.filter(site=>selectedSite === site?.id)?.map(data=>
       data?.departmentList?.departments
     )[0]);

    useEffect(()=>{
      getSelectedSites(siteData);
    },[siteData])

    const onDepartmentSelect = (e) => {
        const {
          target: { value },
        } = e;
      setDepartmentsSelected(
        typeof value === 'string' ? value.split(',') : value,
      );
    }


    const onSiteSelected = (e) => {
      let siteId = e.target.value;
      setSelectedSite(siteId);
      setDepartmentList(sites?.filter(site=> siteId === site?.id)?.map(data =>
         data?.departmentList?.departments
       )[0]);
      setDepartmentsSelected([]);
    }

    const onAdd = () => {
      console.log('inside Onclick')
      if(selectedSite === undefined){
        ErrorToaster('Select Site to add');
        return;
      }
      if(departmentsSelected?.length === 0){
        ErrorToaster('Select Departments to add');
        return;
      }
      let temp = siteData?.filter(site=>site?.id !== selectedSite)?.map(data=>data);
      let departments = departmentList?.filter(dept=>departmentsSelected?.map(data=>data).includes(dept?.id))?.map(data=>data) || [];
      let site =
        {
          "id": selectedSite,
          "departmentList": {
            "departments": departments
          },
          "siteName": {
            "siteName": sites?.filter(site=>site?.id === selectedSite)?.map(site=>site?.siteName?.siteName)[0]
          }
        }
      temp.push(site);
      setSiteData(temp);
    }

    const onRemoveDept = (siteIndex, deptIndex, deptId) => {
      setDepartmentsSelected(departmentsSelected?.filter(dept=>dept !== deptId)?.map(data=>data));
      let temp = siteData?.filter(site=>site?.id !== selectedSite)?.map(data=>data);
      let currentSite = siteData?.filter(site=> site?.id === selectedSite)?.map(data=>data)[0];
      let departments = currentSite?.departmentList?.departments?.filter((dept,index)=>index !== deptIndex)?.map(data=>data);
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
    }


    return(
        <div>
            <div className={style.siteDeptGrid}>
                <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small">Select Site</InputLabel>
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        displayEmpty
                        input={<OutlinedInput label="Select Site" />}
                        onChange={(e)=>onSiteSelected(e)}
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                    >
                        {sites?.map(data=>(
                            <MenuItem value={data?.id}>{data?.siteName?.siteName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="demo-multiple-checkbox-label">Select Dept</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-select-small"
                        multiple
                        value={departmentsSelected}
                        onChange={(e)=>{onDepartmentSelect(e)}}
                        displayEmpty
                        input={<OutlinedInput label="Select Dept" />}
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                    >
                        {
                          departmentList?.map(dept=>(
                            <MenuItem value={dept?.id}>{dept?.departmentName?.name}</MenuItem>
                          )
                          )
                        }
                    </Select>
                </FormControl>
                <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={onAdd}/>
                </div>
            </div>
            {
              siteData?.map((site, siteIndex)=>(
                <div className={`${style.siteDeptFieldCard} ${style.displayInRow} ${style.marginTop10}`}>
                    <div className={`${style.siteCard} ${style.siteDeptTextStyle} ${style.verticalAlignCenter} ${style.marginRight10}`}>{site?.siteName?.siteName}</div>
                    {
                      site?.departmentList?.departments?.map((dept, deptIndex)=>(
                        <div className={`${style.deptCard} ${style.displayInRow} ${style.verticalAlignCenter} ${style.marginRight5}`}>
                            <div className={`${style.siteDeptTextStyle} ${style.marginLeft10}`}>{dept?.departmentName?.name}</div>
                            <CloseIcon fontSize="20px" className={`${style.siteDeptCrossStyle} ${style.marginLeft10} ${style.cursorPointer}`} onClick={()=>{onRemoveDept(siteIndex, deptIndex, dept?.id)}}/>
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
