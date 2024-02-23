import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import { POST, TenantID, GET, PUT, DELETE } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { FormatPhoneNumber } from '../../utils/formatting';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import SuffixList from './../../Components/SuffixList';
import CommonSwitch from "../../Components/CommonFields/CommonSwitch";

import style from './index.module.scss';

const AddUserInCustomerAdmin = ({ getManageUserDialog, isEdit, userId }) => {
    const [selectedDepartments, setSelectedDepartments] = useState([])
    const [selectedSites, setSelectedSites] = useState([])
    const [addUser, setAddUser] = useState({ firstName: "", lastName: "", email: "", phone: "", roles: [], sites: [], title: { title: "", id: "" }, ssoId: { id: '' } });
    const [userDataById, setUserDataById] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRolesToShow, setSelectedRolesToShow] = useState([]);
    const [selectedAccessLevelToShow, setSelectedAccessLevelToShow] = useState("");
    const [sites, setSites] = useState([]);
    const [siteTitle, setSiteTitle] = useState();
    const [deptTitle, setDeptTitle] = useState();
    const [suffix, setSuffix] = useState();
    const [functionalTitle, setFunctionalTitle] = useState([]);
    const [accessLevelNeeded, setAccessLevelNeeded] = useState(false);
    const [workFlowUser, setWorkFlowUser] = useState([]);
    const accessLevel = [{ label: 'User Level', value: 'USER' }, { label: 'Entity Level', value: 'ENTITY' }, { label: 'Site Level', value: 'SITE' }, { label: 'Department Level', value: 'DEPARTMENT' }]
    const defaultProviderId = "6335e77dbb13e2088b208bb0";
    const selectedProvider = defaultProviderId;

    useEffect(() => {
        // getUserById();
        getSites();
        getFunctionalTitle();
        getRoles();
        getContractWorkFlowUser();
    }, []);

    useEffect(() => {
        if (isEdit) {
            getUserById();
        }
    }, [isEdit]);

    useEffect(() => {
        if (selectedRolesToShow?.length !== 0) {
            let temp = [];
            selectedRolesToShow?.map(data => {
                temp.push(roles?.filter(roleData => roleData?.id === data)?.map(roleData => roleData)?.[0])
            })
            setAddUser({ ...addUser, roles: temp });
        }
    }, [selectedRolesToShow]);

    useEffect(() => {
        if (!isEdit) {
            let temp = [];
            selectedSites?.map(data => {
                temp.push(sites?.filter(siteData => siteData?.id === data)?.map(siteData => siteData)?.[0]);
            })
            setAddUser({ ...addUser, sites: { sites: temp } });
        }
    }, [selectedSites]);


    useEffect(() => {
        if (isEdit) {
            let tempDepartmentList = [];
            // let siteTemp = addUser?.sites?.sites || [];

            selectedSites?.map(data => {
                //     console.log('inside initial map', data);
                addUser?.sites?.sites?.filter(siteData => siteData?.id === data)?.map(siteData => siteData)?.[0]?.departmentList?.departments?.map(deptData => {
                    tempDepartmentList.push(`${deptData?.id}-${data}`);
                })
                //     siteTemp.push(sites?.filter(data => data?.id === data)?.map(data => data)[0]);
                //     sites?.filter(data => data?.id === data)?.map(data => data)?.[0]?.departmentList?.departments?.map(deptData => {
                //         tempDepartmentList.push(`${deptData?.id}-${data?.id}`);
                //     })
                //     // tempDepartmentList = selectedDepartments?.filter(deptData => data?.departmentList?.departments?.map(dept => dept?.id)?.includes(deptData?.split('-')?.[-1]))?.map(data => data);
                //     siteTemp.filter(site => site?.id === data)?.map(site => {
                //         site = {
                //             departmentList: {
                //                 departments: tempDepartmentList,
                //             }
                //         };
                //     })

            })
            // setAddUser({ ...addUser, sites: { sites: siteTemp } });
            setSelectedDepartments(tempDepartmentList);
        }
    }, [sites, addUser, selectedSites]);

    const getContractWorkFlowUser = async () => {
        const { data: contractWorkflow } = await GET(`contract-managment-service/contracts/workFlowUser`);
        if (contractWorkflow) {
            setWorkFlowUser(contractWorkflow);
        }
    }

    const getFunctionalTitle = async () => {
        await GET(`entity-service/functionalTitlesForCSPType`)
            .then(response => {
                setFunctionalTitle(response?.data);
            })
            .catch(error => {
                console.log('error', error);
            })
    }

    const handleSiteTitle = (value) => {
        setSiteTitle(functionalTitle?.filter(data => data?.id === value)?.map(data => data)[0]);
        // setAddUser({ ...addUser, title: { id: value, title: functionalTitle?.filter(data => data?.id === value)?.map(data => data?.title)[0] } });
    }

    const handleDeptTitle = (value) => {
        setDeptTitle(functionalTitle?.filter(data => data?.id === value)?.map(data => data)[0]);
    }

    const handleSitesChange = (value) => {
        setSelectedSites(typeof value === 'string' ? value.split(',') : value,)
    }

    const handleDepartmentsChange = (value) => {
        setSelectedDepartments(typeof value === 'string' ? value.split(',') : value,)
    }

    const getSites = async () => {
        const { data: sites } = await GET('entity-service/sites');
        setSites(sites);
    };

    const getRoles = async () => {
        const { data: roles } = await GET('user-management-service/roles?roleType=APP_SYSTEM&roleType=SYSTEM');
        setRoles(roles?.filter(data => data?.roleName !== 'Activity Logger')?.map(data => data));
    };

    const getUserById = async () => {
        const { data: user } = await GET(`user-management-service/user/${userId}`);
        setUserDataById(user);
        if (user) {
            setAddUser({
                ...addUser,
                firstName: user?.name?.firstName,
                lastName: user?.name?.lastName,
                email: user?.email?.officialEmail,
                phone: user?.communication?.mobileNumber,
                roles: user?.roles,
                sites: { sites: user?.sites?.sites },
                title: user?.title,
                userType: user?.userType,
                ssoId: user?.ssoId
            });
            setAccessLevelNeeded(user?.executiveAccessLevelNeeded);
            setSelectedAccessLevelToShow(user?.accessLevel);
            setSiteTitle(user?.sites?.sites?.[0]?.siteResponsibility);
            setDeptTitle(user?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.departmentResponsibility)
            setSuffix(user?.name?.suffix);
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

    console.log('site title', siteTitle, deptTitle, addUser);

    const handleAccessLevelChange = (value) => {
        setSelectedAccessLevelToShow(value)
    }

    const handleRolesChange = (value) => {
        setSelectedRolesToShow(typeof value === 'string' ? value.split(',') : value,)
    }

    const getFinalSiteValueWithDepartments = () => {
        console.log('edit inside function', addUser, addUser);
        console.log('selectedSites', selectedSites);
        console.log('selectedDepartments', selectedDepartments);
        let siteData = [];
        sites?.filter(site => selectedSites?.includes(site?.id))?.map(site => {
            let deptData = [];
            site?.departmentList?.departments?.filter(dept => selectedDepartments?.map(dept => dept?.split('-')[0])?.includes(dept?.id))?.map(dept => {
                dept.departmentResponsibility = deptTitle;
                deptData.push(dept);
            });
            site.departmentList.departments = deptData;
            site.siteResponsibility = siteTitle;
            siteData.push(site);
        })
        // let siteValue = { sites: siteData }
        // setAddUser({ ...addUser, sites: siteValue })
        // addUser?.sites?.sites?.map(data => {
        //     let departments = [];
        //     data.siteResponsibility = siteTitle;
        //     data?.departmentList?.departments?.map(deptData => {
        //         deptData.departmentResponsibility = deptTitle;
        //         if (selectedDepartments?.includes(`${deptData?.id}-${data?.id}`)) {
        //             departments.push(deptData);
        //         }
        //     })
        //     data.departmentList.departments = departments;
        // })
        console.log(siteData)
        return siteData;
    }


    const submitUserDetails = async () => {
        console.log('roles', addUser?.roles);
        if (addUser?.firstName === '') {
            ErrorToaster('First Name is Mandatory');
            return;
        }
        if (!addUser?.email.includes('@') || !addUser?.email.includes('.') || addUser?.email === '') {
            ErrorToaster('Enter a valid mail-id');
            return;
        }
        if (addUser?.roles?.length === 0 && getFinalSiteValueWithDepartments()?.length === 0) {
            ErrorToaster('All Fields are Mandatory');
            return;
        }
        const user = {
            ...(isEdit && { 'id': userId }),
            "name": {
                "firstName": addUser?.firstName,
                "lastName": addUser?.lastName,
                "suffix": suffix,
            },
            "userType": isEdit ? addUser?.userType : "REGISTERED_USER",
            ...(isEdit && { "contracts": userDataById?.contracts }),
            "title": addUser?.title,
            "ssoId": addUser?.ssoId,
            "email": {
                "officialEmail": addUser?.email
            },
            ...(!isEdit && {
                "password": {
                    "password": "string"
                }
            }),
            "communication": {
                "personalEmail": addUser?.email,
                "mobileNumber": addUser?.phone,
                "landlineNumber": "string",
                "mobileNumberNotApplicable": true
            },
            "accessLevel": selectedAccessLevelToShow,
            "executiveAccessLevelNeeded": accessLevelNeeded,
            "roles": addUser?.roles,
            ...(isEdit && { "address": userDataById?.address }),
            "tenant": {
                "tenantId": TenantID
            },
            "sites": {
                "sites": getFinalSiteValueWithDepartments()
            },
            ...(isEdit && { "activated": userDataById?.activated }),
            ...(isEdit && { "blocked": userDataById?.blocked }),
            ...(isEdit && { "serviceProviderType": userDataById?.serviceProviderType }),
            ...(isEdit && { "npin": userDataById?.npin }),
        }
        if (isEdit) {
            await PUT('user-management-service/user', JSON.stringify(user))
                .then(response => {
                    SuccessToaster('User Modified Successfully');
                })
                .catch(error => {
                    ErrorToaster('Unexpected Error');
                })
        } else {
            await POST('user-management-service/user/register', JSON.stringify(user))
                .then(response => {
                    SuccessToaster('User Added Successfully');
                })
                .catch(error => {
                    ErrorToaster('Unexpected Error');
                })
        }

        // if (roles?.map(data => ['APPROVER', 'REVIEWER']?.includes(data?.roleName))) {
        //     if (!workFlowUser?.map(data => data?.userId)?.includes(userId)) {
        //         let workFlowUserData = user;
        //         workFlowUserData.tenant = user?.tenant?.tenantId;
        //         workFlowUserData.userId = userId;
        //         await POST('contract-managment-service/contracts/workFlowUser', JSON.stringify(user))
        //             .then(response => {
        //                 // SuccessToaster('Workflow User Updated Successfully');
        //             })
        //             .catch(error => {
        //                 console.log('Error!');
        //                 // ErrorToaster('Unexpected Error');
        //             })
        //     }
        // } else {
        //     if (workFlowUser?.map(data => data?.userId)?.includes(userId)) {
        //         let workFlowId = workFlowUser?.filter(data => data?.userId === userId)?.map(data => data?.id)?.[0];
        //         await DELETE(`contract-managment-service/contracts/workFlowUser/${workFlowId}`)
        //             .then(response => {
        //                 console.log('Success!');
        //             })
        //             .then(error => {
        //                 console.log('Error!');
        //             })
        //     }
        // }

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
                                    style: { fontSize: 15 }
                                }}
                            />
                        </div>
                    </div>

                    <div className={`${style.marginTop20} ${style.twoCol}`}>
                        <div>
                            <div className={style.extentionLableStyle}>IS EXECUTIVE ACCESS LEVEL NEEDED*</div>
                            <CommonSwitch label={accessLevelNeeded ? 'YES' : 'NO'} className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`} checked={accessLevelNeeded}
                                onChange={(e) => setAccessLevelNeeded(e.target.checked)} />
                        </div>
                        <div>
                            <div className={style.extentionLableStyle}>TYPE OF ACCESS*</div>
                            <FormControl sx={{ maxWidth: '300px' }} className={style.fullWidth} size="small">
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    value={selectedAccessLevelToShow}
                                    disabled={!accessLevelNeeded}
                                    onChange={(e) => handleAccessLevelChange(e.target.value)}
                                    SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                >
                                    {accessLevel?.map((data, index) =>
                                        <MenuItem value={data?.value} key={index}>{data?.label}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                    </div>



                    <div className={`${style.twoCol} ${style.marginTop20}`}>
                        <div>
                            <div className={style.extentionLableStyle}>ROLE*</div>
                            <FormControl sx={{ maxWidth: '300px' }} className={style.fullWidth} size="small">
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={selectedRolesToShow}
                                    onChange={(e) => handleRolesChange(e.target.value)}
                                    SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                >
                                    {roles?.map((data, index) =>
                                        <MenuItem value={data?.id} key={index}>{data?.roleName}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                        <div >
                            <CommonLabel value='SUFFIX*' />
                            <div className={style.grid3}>
                                <SuffixList value={suffix?.id || ''} onChangeFunc={(id, value) => { setSuffix({ id: id, suffix: value }) }} className={[style.fullWidth]} />
                            </div>
                        </div>

                    </div>
                    <div className={`${style.twoCol} ${style.marginTop20}`}>
                        <div>
                            <div className={style.extentionLableStyle}>SITES</div>
                            <FormControl sx={{ maxWidth: '300px' }} className={style.fullWidth} size="small">
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={selectedSites}
                                    onChange={(e) => handleSitesChange(e.target.value)}
                                    className={style.selectFontStyle}
                                    SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                >
                                    {sites?.map((data, index) =>
                                        <MenuItem value={data?.id} key={index}>{data?.siteName?.siteName}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <div className={style.extentionLableStyle}>SITE LEVEL TITLE</div>
                            <FormControl className={style.fullWidth} size="small">
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={siteTitle?.id || ''}
                                    className={style.selectFontStyle}
                                    onChange={(e) => handleSiteTitle(e.target.value)}
                                    SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                >
                                    {selectedSites?.length !== 0 && functionalTitle?.map((data, index) =>
                                        <MenuItem value={data?.id} key={index}>{data?.title}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className={`${style.twoCol} ${style.marginTop20}`}>
                        <div>
                            <div className={style.extentionLableStyle}>DEPARTMENT</div>
                            <FormControl sx={{ maxWidth: '300px' }} className={style.fullWidth} size="small">
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={selectedDepartments}
                                    onChange={(e) => handleDepartmentsChange(e.target.value)}
                                    className={style.selectFontStyle}
                                    SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                >
                                    {sites?.filter(data => selectedSites?.includes(data?.id))?.map((data, index) =>
                                        data?.departmentList?.departments?.map((deptData, deptIndex) => (
                                            <MenuItem value={`${deptData?.id}-${data?.id}`} key={`${index}${deptIndex}`}>{`${deptData?.departmentName?.name} - ${data?.siteName?.siteName}`}</MenuItem>
                                        )))}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <div className={style.extentionLableStyle}>DEPARTMENT LEVEL TITLE</div>
                            <FormControl className={style.fullWidth} size="small">
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={deptTitle?.id || ''}
                                    className={style.selectFontStyle}
                                    onChange={(e) => handleDeptTitle(e.target.value)}
                                    selected={deptTitle?.id}
                                    SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                >
                                    {selectedDepartments?.length !== 0 && functionalTitle?.map((data, index) =>
                                        <MenuItem value={data?.id} key={index}>{data?.title}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol}`}>
                        <div>
                            <div className={style.extentionLableStyle}>SSO ID*</div>
                            <TextField size="small" className={style.fullWidth} value={addUser?.ssoId?.id} onChange={(e) => setAddUser({ ...addUser, ssoId: { id: e.target.value } })} />
                        </div>
                    </div>
                </div>
                <div className={`${style.floatRight} ${style.marginTop10}`}>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => submitUserDetails()} >SAVE & EXIT</button>
                </div>
            </div>
        </Dialog >
    )
}

export default AddUserInCustomerAdmin;
