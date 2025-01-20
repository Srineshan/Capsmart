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
import AddUserStep2 from '../../images/addUserStep2.png';
import AddUserStep3 from '../../images/addUserStep3.png';
import AddUserStep1Selected from '../../images/addUserStep1Selected.png';
import AddUserStep2Selected from '../../images/addUserStep2Selected.png';
import AddUserStep3Selected from '../../images/addUserStep3Selected.png';
import AddUserStep1Completed from '../../images/addUserStep1Completed.png';
import AddUserStep2Completed from '../../images/addUserStep2Completed.png';
import CancelIcon from '@mui/icons-material/Cancel';
import style from './index.module.scss';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import CommonPhoneField from '../../Components/CommonFields/CommonPhoneField';
import UserCreatedSuccessfullyDialog from '../../Components/UserCreatedSuccessfullyDialog';

const AddUserInCustomerAdmin = ({ getManageUserDialog, isEdit, userId }) => {
    const [selectedDepartments, setSelectedDepartments] = useState([])
    const [selectedSpecialtys, setSelectedSpecialtys] = useState([])
    const [selectedSites, setSelectedSites] = useState([])
    const [addUser, setAddUser] = useState({ firstName: "", lastName: "", email: "", phone: "", roles: [], sites: [], title: { title: "", id: "" }, ssoId: { id: '' } });
    const [userDataById, setUserDataById] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRolesToShow, setSelectedRolesToShow] = useState([]);
    const [selectedApplicantsToShow, setSelectedApplicantsToShow] = useState([]);
    const [selectedDepartmentsToShow, setSelectedDepartmentsToShow] = useState([]);
    const [selectedAccessLevelToShow, setSelectedAccessLevelToShow] = useState("USER");
    const [sites, setSites] = useState([]);
    const [siteTitle, setSiteTitle] = useState();
    const [deptTitle, setDeptTitle] = useState();
    const [suffix, setSuffix] = useState();
    const [functionalTitle, setFunctionalTitle] = useState([]);
    const [accessLevelNeeded, setAccessLevelNeeded] = useState(false);
    const [manageRecordTypeByApplicantType, setManageRecordTypeByApplicantType] = useState(false);
    const [specificDeptRecordsToAccess, setSpecificDeptRecordsToAccess] = useState(false);
    const [showUserCreatedDialog, setShowUserCreatedDialog] = useState(false);
    const [departmentList, setDepartmentList] = useState([]);
    const [applicantTypeList, setApplicantTypeList] = useState([]);
    const [workFlowUser, setWorkFlowUser] = useState([]);
    const accessLevel = [{ label: 'User Level', value: 'USER' }, { label: 'Entity Level', value: 'ENTITY' }, { label: 'Site Level', value: 'SITE' }, { label: 'Department Level', value: 'DEPARTMENT' }]
    const defaultProviderId = "6335e77dbb13e2088b208bb0";
    const selectedProvider = defaultProviderId;
    const [currentPage, setCurrentPage] = useState('step1');
    const [createdUserDetails, setCreatedUserDetails] = useState();
    useEffect(() => {
        // getUserById();
        getSites();
        getDepartmentList()
        getApplicantTypeList()
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
        setSelectedSpecialtys([])
    }, [selectedDepartments])


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

    const handleSpecialtyChange = (value) => {
        setSelectedSpecialtys(typeof value === 'string' ? value.split(',') : value,)
    }

    const getSites = async () => {
        const { data: sites } = await GET('entity-service/sites');
        setSites(sites);
    };

    const getDepartmentList = async () => {
        const { data: department } = await GET(`entity-service/department`);
        setDepartmentList(department);
    };

    const getApplicantTypeList = async () => {
        const { data: applicantType } = await GET(`entity-service/applicantType`);
        setApplicantTypeList(applicantType);
    }

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
            user?.sites?.sites?.map((data, index) => {
                if (data?.departmentList?.departments?.length !== 0) {
                    setDeptTitle(user?.sites?.sites?.[index]?.departmentList?.departments?.[0]?.departmentResponsibility)
                }
            })
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

    const getUserCreatedDialog = async (value, sendInvite) => {
        setShowUserCreatedDialog(value)
        if (sendInvite === 'OKAY' && createdUserDetails !== undefined) {
            if (createdUserDetails !== undefined) {
                await POST(`user-management-service/user/${createdUserDetails?.id}/sendInviteEmail`)
            }
        }
    }

    const handleAccessLevelChange = (value) => {
        setSelectedAccessLevelToShow(value)
    }

    const handleRolesChange = (value) => {
        setSelectedRolesToShow(typeof value === 'string' ? value.split(',') : value,)
    }

    const handleApplicantChange = (value) => {
        setSelectedApplicantsToShow(typeof value === 'string' ? value.split(',') : value,)
    }

    const handleDepartmentChange = (value) => {
        setSelectedDepartmentsToShow(typeof value === 'string' ? value.split(',') : value,)
    }


    const getFinalSiteValueWithDepartments = () => {
        console.log('edit inside function', addUser, addUser);
        console.log('selectedSites', selectedSites);
        console.log('selectedDepartments', selectedDepartments);
        let siteData = [];
        sites?.map(site => {
            let deptData = [];
            site?.departmentList?.departments?.filter(dept => selectedDepartments?.includes(dept?.id))?.map(dept => {
                dept.departmentResponsibility = deptTitle;
                dept.serviceAreas = dept?.serviceAreas?.filter(item1 => selectedSpecialtys?.some(item2 => item1?.id === item2))
                deptData.push(dept);
            });
            site.departmentList.departments = deptData;
            site.siteResponsibility = siteTitle;
            siteData.push(site);
        })
        console.log(siteData)
        return siteData;
    }

    console.log('site title', siteTitle, deptTitle, addUser, sites, selectedDepartments, selectedSpecialtys);

    console.log(accessLevelNeeded, selectedAccessLevelToShow)
    const submitUserDetails = async () => {
        // console.log('roles', addUser?.roles);
        // if (addUser?.firstName === '') {
        //     ErrorToaster('First Name is Mandatory');
        //     return;
        // }
        // if (!addUser?.email.includes('@') || !addUser?.email.includes('.') || addUser?.email === '') {
        //     ErrorToaster('Enter a valid mail-id');
        //     return;
        // }
        // if (addUser?.roles?.filter(data => data !== undefined)?.map(data => data)?.length === 0 || getFinalSiteValueWithDepartments()?.length === 0) {
        //     ErrorToaster('All Fields are Mandatory');
        //     return;
        // }
        // if (accessLevelNeeded === true && (selectedAccessLevelToShow === null || selectedAccessLevelToShow === "")) {
        //     ErrorToaster('Access Level is Mandatory');
        //     return;
        // }

        const user = {
            ...(isEdit && { 'id': userId }),
            "name": {
                "firstName": addUser?.firstName,
                "lastName": addUser?.lastName,
                "suffix": suffix,
            },
            "userType": isEdit ? addUser?.userType : "REGISTERED_USER",
            ...(isEdit && { "contracts": userDataById?.contracts }),
            "title": siteTitle,
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
            "accessLevel": (selectedAccessLevelToShow === null || selectedAccessLevelToShow === "") ? "USER" : selectedAccessLevelToShow,
            "executiveAccessLevelNeeded": accessLevelNeeded,
            "roles": addUser?.roles,
            ...(isEdit && { "address": userDataById?.address }),
            "tenant": {
                "tenantId": TenantID
            },
            "sites": {
                "sites": getFinalSiteValueWithDepartments()
            },
            "secondaryTitle": deptTitle,
            "recordAccessDepartments": departmentList?.filter(data => selectedDepartmentsToShow?.includes(data?.id)),
            "recordAccessApplicantTypes": applicantTypeList?.filter(data => selectedApplicantsToShow?.includes(data.id)),
            "departmentSpecificRecordAccess": specificDeptRecordsToAccess,
            "applicantTypeSpecificRecordAccess": manageRecordTypeByApplicantType,
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
                    setCreatedUserDetails(response?.data)
                    handleAddStep3()
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

        // getManageUserDialog(false);
    };

    const handleAddStep1 = () => {
        setCurrentPage('step2')
    }

    const handleAddStep2 = () => {
        setCurrentPage('step3')
    }

    const handleAddStep3 = () => {
        setShowUserCreatedDialog(true);
    }


    return (
        <>
            <Dialog isOpen={getManageUserDialog} onClose={() => getManageUserDialog(false)} className={`${style.addManagerDialogBackground} ${style.addProofDialog}`}>
                <div className={style.bodyContainer}>
                    <div className={`${style.stepperGrid}`}>
                        <div></div>
                        <div className={style.verticalAlignCenter}>
                            <img src={currentPage === 'step1' ? AddUserStep1Selected : AddUserStep1Completed} className={style.stepImg} alt="" />
                        </div>
                        <div className={style.marginTop30}>
                            <div className={`${currentPage === 'step1' ? style.stepperDividerDisabled : style.stepperDivider}`}></div>
                        </div>
                        <div className={style.verticalAlignCenter}>
                            <img src={currentPage === 'step2' ? AddUserStep2Selected : currentPage === 'step1' ? AddUserStep2 : AddUserStep2Completed} className={style.stepImg} alt="" />
                        </div>
                        <div className={style.marginTop30}>
                            <div className={`${currentPage === 'step3' ? style.stepperDivider : style.stepperDividerDisabled}`}></div>
                        </div>
                        <div className={style.verticalAlignCenter}>
                            <img src={currentPage === 'step3' ? AddUserStep3Selected : AddUserStep3} className={style.stepImg} alt="" />
                        </div>
                        <div></div>
                    </div>
                    <div className={`${Classes.DIALOG_BODY} ${style.formContainer}`}>
                        {currentPage === 'step1' ? (
                            <div className={style.verticalSpaceBetween} >
                                <div>
                                    <div className={style.spaceBetween}>
                                        <p className={style.extensionStyle}>User Access Credentials</p>
                                        {/* <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getManageUserDialog(false)} /> */}
                                    </div>
                                    {/* <div className={style.extensionBorder}></div> */}
                                    <div>
                                        <div className={`${style.threeCol}`}>
                                            <div>
                                                <CommonTextField size="small" placeholder='First Name' label={'First Name*'} className={style.fullWidth} value={addUser?.firstName} onChange={(e) => setAddUser({ ...addUser, firstName: e.target.value })} />
                                            </div>
                                            <div>
                                                {/* <div className={`${style.extentionLableStyle} ${style.marginTop20}`}></div> */}
                                                <CommonTextField size="small" placeholder='Last Name' label={'Last Name'} className={style.fullWidth} value={addUser?.lastName} onChange={(e) => setAddUser({ ...addUser, lastName: e.target.value })} />
                                            </div>
                                            <div>
                                                <div className={style.extentionLableStyle}>Suffix</div>
                                                <div className={style.marginTop10}>
                                                    <SuffixList value={suffix?.id || ''} onChangeFunc={(id, value) => { setSuffix({ id: id, suffix: value }) }} className={[style.fullWidth]} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${style.threeCol} ${style.marginTop10}`}>
                                            <div>
                                                <div className={style.extentionLableStyle}>Primary Functional Title</div>
                                                <div className={style.marginTop10}>
                                                    <FormControl className={`${style.fullWidth}`} size="small">
                                                        <Select
                                                            labelId="demo-select-small"
                                                            id="demo-select-small"
                                                            value={siteTitle?.id || ''}
                                                            className={style.selectFontStyle}
                                                            onChange={(e) => handleSiteTitle(e.target.value)}
                                                            SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                                        >
                                                            {functionalTitle?.map((data, index) =>
                                                                <MenuItem value={data?.id} key={index}>{data?.title}</MenuItem>
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div>
                                                <div className={style.extentionLableStyle}>Secondary Title</div>
                                                <div className={style.marginTop10}>
                                                    <FormControl className={`${style.fullWidth}`} size="small">
                                                        <Select
                                                            labelId="demo-select-small"
                                                            id="demo-select-small"
                                                            value={deptTitle?.id || ''}
                                                            className={style.selectFontStyle}
                                                            onChange={(e) => handleDeptTitle(e.target.value)}
                                                            selected={deptTitle?.id}
                                                            SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                                        >
                                                            {functionalTitle?.map((data, index) =>
                                                                <MenuItem value={data?.id} key={index}>{data?.title}</MenuItem>
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`${style.marginTop10} ${style.threeCol}`}>
                                            <div>
                                                <div className={style.extentionLableStyle}>Email Address*</div>
                                                <CommonTextField className={style.fullWidth} value={addUser?.email} onChange={(e) => setAddUser({ ...addUser, email: e.target.value })} />
                                            </div>
                                            <div>
                                                <div className={style.extentionLableStyle}>Cell Phone (For 2FA)</div>
                                                <CommonPhoneField
                                                    className={style.fullWidth}
                                                    value={addUser?.phone}
                                                    onChange={(e) => setAddUser({ ...addUser, phone: FormatPhoneNumber(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                        <div className={`${style.marginTop10} ${style.threeCol}`}>
                                            <div>
                                                <div className={style.extentionLableStyle}>Role*</div>
                                                <div className={style.marginTop10}>
                                                    <FormControl sx={{ maxWidth: '29vw' }} className={style.fullWidth} size="small">
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
                                            </div>
                                            {selectedRolesToShow?.includes(roles?.filter(data => data?.roleName === "Department Head")?.[0]?.id) && (
                                                <>
                                                    <div>
                                                        <div className={style.extentionLableStyle}>Specify Department*</div>
                                                        <div className={style.marginTop10}>
                                                            <FormControl sx={{ maxWidth: '29vw' }} className={style.fullWidth} size="small">
                                                                <Select
                                                                    labelId="demo-multiple-checkbox-label"
                                                                    id="demo-multiple-checkbox"
                                                                    multiple
                                                                    value={selectedDepartments}
                                                                    onChange={(e) => handleDepartmentsChange(e.target.value)}
                                                                    className={style.selectFontStyle}
                                                                    SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                                                >
                                                                    {sites?.[0]?.departmentList?.departments?.map((deptData, deptIndex) => (
                                                                        <MenuItem value={deptData?.id} key={deptIndex}>{deptData?.departmentName?.name}</MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className={style.extentionLableStyle}>Specify Division or Speciality</div>
                                                        <div className={style.marginTop10}>
                                                            <FormControl sx={{ maxWidth: '29vw' }} className={style.fullWidth} size="small">
                                                                <Select
                                                                    labelId="demo-multiple-checkbox-label"
                                                                    id="demo-multiple-checkbox"
                                                                    multiple
                                                                    value={selectedSpecialtys}
                                                                    onChange={(e) => handleSpecialtyChange(e.target.value)}
                                                                    SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                                                >
                                                                    {sites?.[0]?.departmentList?.departments?.filter(data => selectedDepartments?.includes(data?.id))?.map((deptData, deptIndex) =>
                                                                        deptData?.serviceAreas?.map((data, index) => (
                                                                            <MenuItem value={data?.id} key={index}>{data?.name}</MenuItem>
                                                                        )))}
                                                                </Select>
                                                            </FormControl>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* <div className={`${style.marginTop20} ${style.twoCol}`}>
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
                        </div> */}
                                <div>
                                    <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                                        <button className={`${style.outlinedButton} `} onClick={() => getManageUserDialog(false)} >CANCEL</button>
                                        <button className={`${style.buttonStyle} `} onClick={() => handleAddStep1()} >ADD</button>
                                    </div>
                                </div>
                            </div>
                        ) : currentPage === 'step2' ? (
                            <div className={style.verticalSpaceBetween}>
                                <div>
                                    <p className={style.extensionStyle}>Select Department(s) For Records That This Registered User Can Access</p>
                                    <div className={style.fourCol}>
                                        <div>
                                            <div className={style.extentionLableStyle}>Name</div>
                                            <div className={style.extentionLableStyle}>{`${addUser?.firstName}, ${addUser?.lastName}`}</div>
                                        </div>
                                        <div>
                                            <div className={style.extentionLableStyle}>Functional Title</div>
                                            <div className={style.extentionLableStyle}>{siteTitle?.title}</div>
                                        </div>
                                        <div>
                                            <div className={style.extentionLableStyle}>Staff Manager Role Access</div>
                                            <div className={style.extentionLableStyle}>{selectedRolesToShow?.includes(roles?.filter(data => data?.roleName === "Staff Manager")?.[0]?.id) ? 'Yes' : 'No'}</div>
                                        </div>
                                        <div>
                                            <div className={style.extentionLableStyle}>System Admin Role Access</div>
                                            <div className={style.extentionLableStyle}>{selectedRolesToShow?.includes(roles?.filter(data => data?.roleName === "Entity Sys Admin")?.[0]?.id) ? 'Yes' : 'No'}</div>
                                        </div>
                                    </div>
                                    <div className={`${style.displayInRow} ${style.marginTop30}`}>
                                        <div className={style.extentionLableStyle}>Specific Departments Records To Access*</div>
                                        <CommonSwitch label={specificDeptRecordsToAccess ? 'YES' : 'NO'} className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`} checked={specificDeptRecordsToAccess}
                                            onChange={(e) => setSpecificDeptRecordsToAccess(e.target.checked)} />
                                    </div>
                                    {specificDeptRecordsToAccess && (
                                        <>
                                            <div className={`${style.threeCol} ${style.marginTop20}`}>
                                                <div>
                                                    <div className={style.extentionLableStyle}>Departments</div>
                                                    <div className={style.marginTop10}>
                                                        <FormControl sx={{ maxWidth: '90vw' }} className={`${style.fullWidth}`} size="small">
                                                            <Select
                                                                labelId="demo-multiple-checkbox-label"
                                                                id="demo-multiple-checkbox"
                                                                multiple
                                                                value={selectedDepartmentsToShow}
                                                                onChange={(e) => handleDepartmentChange(e.target.value)}
                                                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                                            >
                                                                {departmentList?.map((data, index) =>
                                                                    <MenuItem value={data?.id} key={index}>{data?.departmentName?.name}</MenuItem>
                                                                )}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className={`${style.chipsContainer} ${style.marginTop10}`}>
                                                    {selectedDepartmentsToShow?.map(data => {
                                                        return (
                                                            <div className={`${style.chips} ${style.displayInRow}`}>
                                                                <div>{departmentList?.filter(optionData => optionData?.id === data)?.[0]?.departmentName?.name}</div> <div className={`${style.verticalAlignCenter} ${style.marginLeft} ${style.cursorPointer}`}
                                                                    onClick={() => setSelectedDepartmentsToShow(selectedDepartmentsToShow?.filter(innerData => innerData !== data))}
                                                                ><CancelIcon sx={{ color: '#06617A', fontSize: 20 }} /></div></div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div>
                                    <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                                        <button className={`${style.outlinedButton} `} onClick={() => getManageUserDialog(false)} >CANCEL</button>
                                        <button className={`${style.buttonStyle} `} onClick={() => handleAddStep2()} >ADD</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={style.verticalSpaceBetween}>
                                <div>
                                    <p className={style.extensionStyle}>Specific Staff Record Type To Mange By Applicant Type</p>
                                    <div className={style.fourCol}>
                                        <div>
                                            <div className={style.extentionLableStyle}>Name</div>
                                            <div className={style.extentionLableStyle}>{`${addUser?.firstName}, ${addUser?.lastName}`}</div>
                                        </div>
                                        <div>
                                            <div className={style.extentionLableStyle}>Functional Title</div>
                                            <div className={style.extentionLableStyle}>{siteTitle?.title}</div>
                                        </div>
                                        <div>
                                            <div className={style.extentionLableStyle}>Staff Manager Role Access</div>
                                            <div className={style.extentionLableStyle}>{selectedRolesToShow?.includes(roles?.filter(data => data?.roleName === "Staff Manager")?.[0]?.id) ? 'Yes' : 'No'}</div>
                                        </div>
                                        <div>
                                            <div className={style.extentionLableStyle}>System Admin Role Access</div>
                                            <div className={style.extentionLableStyle}>{selectedRolesToShow?.includes(roles?.filter(data => data?.roleName === "Entity Sys Admin")?.[0]?.id) ? 'Yes' : 'No'}</div>
                                        </div>
                                    </div>
                                    <div className={`${style.displayInRow} ${style.marginTop30}`}>
                                        <div className={style.extentionLableStyle}>Manage Record Types By Applicant Type*</div>
                                        <CommonSwitch label={manageRecordTypeByApplicantType ? 'YES' : 'NO'} className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`} checked={manageRecordTypeByApplicantType}
                                            onChange={(e) => setManageRecordTypeByApplicantType(e.target.checked)} />
                                    </div>
                                    {manageRecordTypeByApplicantType && (
                                        <>
                                            <div className={`${style.threeCol} ${style.marginTop20}`}>
                                                <div>
                                                    <div className={style.extentionLableStyle}>Applicant Types</div>
                                                    <div className={style.marginTop10}>
                                                        <FormControl sx={{ maxWidth: '90vw' }} className={`${style.fullWidth}`} size="small">
                                                            <Select
                                                                labelId="demo-multiple-checkbox-label"
                                                                id="demo-multiple-checkbox"
                                                                multiple
                                                                value={selectedApplicantsToShow}
                                                                onChange={(e) => handleApplicantChange(e.target.value)}
                                                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                                            >
                                                                {applicantTypeList?.map((data, index) =>
                                                                    <MenuItem value={data?.id} key={index}>{data?.applicantType}</MenuItem>
                                                                )}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className={`${style.chipsContainer} ${style.marginTop10}`}>
                                                    {selectedApplicantsToShow?.map(data => {
                                                        return (
                                                            <div className={`${style.chips} ${style.displayInRow}`}>
                                                                <div>{applicantTypeList?.filter(optionData => optionData?.id === data)?.[0]?.applicantType}</div> <div className={`${style.verticalAlignCenter} ${style.marginLeft} ${style.cursorPointer}`}
                                                                    onClick={() => setSelectedApplicantsToShow(selectedApplicantsToShow?.filter(innerData => innerData !== data))}
                                                                ><CancelIcon sx={{ color: '#06617A', fontSize: 20 }} /></div></div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div>
                                    <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                                        <button className={`${style.outlinedButton} `} onClick={() => getManageUserDialog(false)} >CANCEL</button>
                                        <button className={`${style.buttonStyle} `} onClick={() => submitUserDetails()} >SAVE</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog >
            {showUserCreatedDialog && (
                <UserCreatedSuccessfullyDialog getIsOpen={getUserCreatedDialog} isOpen={showUserCreatedDialog} user={createdUserDetails} />
            )
            }
        </>
    )
}

export default AddUserInCustomerAdmin;
