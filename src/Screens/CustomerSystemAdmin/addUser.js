import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import { POST, TenantID, GET, PUT } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { FormatPhoneNumber } from '../../utils/formatting';

import style from './index.module.scss';

const AddUserInCustomerAdmin = ({getManageUserDialog, isEdit, userId}) => {
    const [selectedDepartments, setSelectedDepartments] = useState([])
    const [selectedSites, setSelectedSites] = useState([])
    const [addUser, setAddUser] = useState({firstName: "", lastName: "", email: "", phone: "", roles: [], sites: [], title: {title:"",id:""}});
    const [userDataById, setUserDataById] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRolesToShow, setSelectedRolesToShow] = useState([]);
    const [sites, setSites] = useState([]);
    const [functionalTitle, setFunctionalTitle] = useState([]);
    const defaultProviderId = "6335e77dbb13e2088b208bb0";
    const selectedProvider = defaultProviderId;

    useEffect(()=>{
        getSites();
        getFunctionalTitle();
        getRoles();
    },[]);

    useEffect(() => {
        if(isEdit){
            getUserById();
        }
    }, [isEdit]);

    useEffect(() => {
        if(selectedRolesToShow?.length !== 0){
            let temp = [];
            selectedRolesToShow?.map(data => {
                console.log(data)
                temp.push({id: data, roleName: roles?.filter(roleData => roleData?.id === data)?.map(roleData => roleData?.roleName)?.[0]})
            })
            setAddUser({...addUser, roles: temp});
        }
    }, [selectedRolesToShow]);

    useEffect(() => {
        if(!isEdit){
            let temp = [];
            selectedSites?.map(data => {
                temp.push(sites?.filter(siteData => siteData?.id === data)?.map(siteData => siteData)?.[0]);
            })
            setAddUser({...addUser, sites: {sites: temp}});
        }
    }, [selectedSites]);

    useEffect(() => {
        if(isEdit) {
            let tempDepartmentList = [];
            selectedSites?.map(data => {
                addUser?.sites?.sites?.filter(siteData => siteData?.id === data)?.map(siteData => siteData)?.[0]?.departmentList?.departments?.map(deptData => {
                    tempDepartmentList.push(`${deptData?.id}-${data}`);
                })
            })
            setSelectedDepartments(tempDepartmentList);
        }
    }, [selectedSites, sites, addUser]);

    const getFunctionalTitle  = async() => {
        await GET(`entity-service/functionalTitlesForCSPType?contractedServiceProviderTypeId=${selectedProvider}`)
        .then(response=>{
            setFunctionalTitle(response?.data);
        })
        .catch(error=>{
            console.log('error',error);
        })
    }
    
    const handleTitle = (value) => {
        setAddUser({...addUser, title:{id:value,title:functionalTitle?.filter(data => data?.id === value)?.map(data => data?.title)[0]}});
    }

    const handleSitesChange = (value) => {
        setSelectedSites(typeof value === 'string' ? value.split(',') : value,)
    }

    const handleDepartmentsChange = (value) => {
        setSelectedDepartments(typeof value === 'string' ? value.split(',') : value,)
    }

    const getSites = async() => {
        const {data: sites} = await GET('entity-service/sites');
        setSites(sites);
    };

    const getRoles = async() => {
        const {data: roles} = await GET('user-management-service/roles');
        setRoles(roles);
    };

    const getUserById = async() => {
        const {data: user} = await GET(`user-management-service/user/${userId}`);
        setUserDataById(user);
        if(user){
            setAddUser({...addUser, 
                firstName: user?.name?.firstName, 
                lastName: user?.name?.lastName, 
                email: user?.email?.officialEmail, 
                phone: user?.communication?.mobileNumber,
                roles: user?.roles, 
                sites: {sites: user?.sites?.sites}, 
                title: user?.title
            });
            let rolesToShow = [];
            user?.roles?.map(data => {
                rolesToShow.push(data?.id)
            })
            setSelectedRolesToShow(rolesToShow);
            let sitesToShow = [];
            user?.sites?.sites?.map(data => {
                sitesToShow.push(data?.id)
            })
            setSelectedSites(sitesToShow);
        }
    }

    const handleRolesChange = (value) => {
        setSelectedRolesToShow(typeof value === 'string' ? value.split(',') : value,)
    }

    const getFinalSiteValueWithDepartments = () => {
        addUser?.sites?.sites?.map(data => {
            let departments = [];
            data?.departmentList?.departments?.map(deptData => {
                if(selectedDepartments?.includes(`${deptData?.id}-${data?.id}`)) {
                    departments.push(deptData);
                }
            })
            data.departmentList.departments = departments;
        })
        console.log(addUser?.sites?.sites)
        return addUser?.sites?.sites;
    }

    // console.log(selectedRolesToShow, addUser, sites, selectedSites, selectedDepartments)
    const submitUserDetails = async () => {

        if(!addUser?.email.includes('@') || !addUser?.email.includes('.')) {
          ErrorToaster('Enter a valid mail-id');
          return;
        }
        if(addUser?.firstName === '' && addUser?.email === '' && addUser?.roles?.length === 0 && getFinalSiteValueWithDepartments()?.length === 0)
        {
          ErrorToaster('All Fields are Mandatory');
          return;
        }
        const user = {
            ...(isEdit && {'id': userId}),
              "name": {
                "firstName": addUser?.firstName,
                "lastName": addUser?.lastName,
                ...(isEdit ? {"suffix": userDataById?.name?.suffix} : {"suffix": {}}),
              },
              "userType": "REGISTERED_USER",
              ...(isEdit && {"contracts": userDataById?.contracts}),
              "title":addUser?.title,
              "email": {
                "officialEmail": addUser?.email
              },
              ...( !isEdit && {"password": {
                "password": "string"
              }}),
              "communication": {
                "personalEmail": addUser?.email,
                "mobileNumber": addUser?.phone,
                "landlineNumber": "string",
                "mobileNumberNotApplicable": true
              },
              "roles": addUser?.roles,
              ...(isEdit && {"address": userDataById?.address}),
              "tenant": {
                "tenantId": TenantID
              },
              "sites": {
                "sites": getFinalSiteValueWithDepartments()
              },
              ...(isEdit && {"activated": userDataById?.activated}),
              ...(isEdit && {"blocked": userDataById?.blocked}),
              ...(isEdit && {"serviceProviderType": userDataById?.serviceProviderType}),
              ...(isEdit && {"npin": userDataById?.npin}),
            }
        if(isEdit){
            await PUT('user-management-service/user', JSON.stringify(user))
            .then(response=>{
            SuccessToaster('User Modified Successfully');
            })
            .catch(error=>{
            ErrorToaster('Unexpected Error');
            })
        } else {
            await POST('user-management-service/user/register', JSON.stringify(user))
            .then(response=>{
            SuccessToaster('User Added Successfully');
            })
            .catch(error=>{
            ErrorToaster('Unexpected Error');
            })
        }
        getManageUserDialog(false);
    };

    return (
        <Dialog isOpen={getManageUserDialog} onClose={() => getManageUserDialog(false)} className={`${style.addManagerDialogBackground} ${style.addProofDialog}`}>
            <div className={`${Classes.DIALOG_BODY} `}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>{!isEdit ? 'ADD' : 'MODIFY'} USER</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getManageUserDialog(false)} />
                </div>
                <div className={style.extensionBorder}></div>
                <div className={style.proofBorder}>
                    <div className={`${style.twoCol}`}>
                        <div>
                            <div className={style.extentionLableStyle}>FIRST NAME*</div>
                            <TextField size="small" className={style.fullWidth} value={addUser?.firstName} onChange={(e) => setAddUser({ ...addUser, firstName: e.target.value })} />
                        </div>
                        <div>
                            <div className={style.extentionLableStyle}>LAST NAME*</div>
                            <TextField size="small" className={style.fullWidth} value={addUser?.lastName} onChange={(e) => setAddUser({ ...addUser, lastName: e.target.value })} />
                        </div>
                    </div>

                    <div className={`${style.marginTop20} ${style.twoCol}`}>
                        <div>
                            <div className={style.extentionLableStyle}>EMAIL (USERNAME)*</div>
                            <TextField size="small" className={style.fullWidth} value={addUser?.email} onChange={(e) => setAddUser({ ...addUser, email: e.target.value })} />
                        </div>
                        <div>
                            <div className={style.extentionLableStyle}>MOBILE PHONE / CELL</div>
                            <TextField
                                size="small"
                                className={style.fullWidth}
                                value={addUser?.phone}
                                onChange={(e) => setAddUser({ ...addUser, phone: FormatPhoneNumber(e.target.value) })}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>+1</InputAdornment>,
                                    style: {fontSize: 15}
                                }}
                            />
                        </div>
                    </div>
                    <div className={`${style.twoCol} ${style.marginTop20}`}>
                        <div>
                            <div className={style.extentionLableStyle}>ROLE*</div>
                            <FormControl sx={{maxWidth: '300px'}} className={style.fullWidth} size="small">
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={selectedRolesToShow}
                                    onChange={(e) => handleRolesChange(e.target.value)}
                                >
                                    {roles?.map((data, index)=> 
                                        <MenuItem value={data?.id} key={index}>{data?.roleName}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <div className={style.extentionLableStyle}>TITLE</div>
                            <FormControl className={style.fullWidth} size="small">
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={addUser?.title?.id}
                                    className={style.selectFontStyle}
                                    onChange={(e) => handleTitle(e.target.value)}
                                >
                                    {functionalTitle?.map((data, index)=> 
                                        <MenuItem value={data?.id} key={index}>{data?.title}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className={`${style.twoCol} ${style.marginTop20}`}>
                        <div>
                            <div className={style.extentionLableStyle}>SITES</div>
                            <FormControl sx={{maxWidth: '300px'}} className={style.fullWidth} size="small">
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={selectedSites}
                                    onChange={(e) => handleSitesChange(e.target.value)}
                                    className={style.selectFontStyle}
                                >
                                    {sites?.map((data, index)=> 
                                        <MenuItem value={data?.id} key={index}>{data?.siteName?.siteName}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <div className={style.extentionLableStyle}>DEPARTMENT</div>
                            <FormControl sx={{maxWidth: '300px'}} className={style.fullWidth} size="small">
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={selectedDepartments}
                                    onChange={(e) => handleDepartmentsChange(e.target.value)}
                                    className={style.selectFontStyle}
                                >
                                    {sites?.filter(data => selectedSites?.includes(data?.id))?.map((data, index)=> 
                                        data?.departmentList?.departments?.map((deptData, deptIndex) => (
                                            <MenuItem value={`${deptData?.id}-${data?.id}`} key={`${index}${deptIndex}`}>{`${deptData?.departmentName?.name} - ${data?.siteName?.siteName}`}</MenuItem>
                                    )))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div className={`${style.floatRight} ${style.marginTop10}`}>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => submitUserDetails()} >SAVE & EXIT</button>
                </div>
            </div>
        </Dialog>
    )
}

export default AddUserInCustomerAdmin;