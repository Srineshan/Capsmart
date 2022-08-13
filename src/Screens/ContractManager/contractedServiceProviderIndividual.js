import React, {useState, useEffect, useMemo} from 'react';
import { InputGroup, RadioGroup, Radio, Tag, TagInput } from '@blueprintjs/core';
import DatalistInput from 'react-datalist-input';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import AddContractUser from './addContractUser';
import MenuItem from '@mui/material/MenuItem';
import {POST, GET, PUT, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

import style from './index.module.scss';

function getStyles(role, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(role) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const names = [
    'Activity Logger',
    'Reviewer',
    'Approver',
    'Accounts Payable',
    'Contracts manager',
    'Report viewer',
  ];

  const VALUES = ['Site 1', "Site 2"];
  // const VALUES2 = ['Site 1 - Department 1 - Title 1', "Site 2 - Department 2 - Title 2", "Site 3 - Department 3 - Title 3"];
  // let siteTitleValues = [];
  // let departmentTitleValues = [];
const ContractedServicesProviderIndividual = ({getViewPage3, getCurrentPage, contractId, contractType, contractName}) => {
    const testContractId = contractId;
    const [user,setUsers] = useState([]);
    const [userName, setUserName] = useState('');
    const [selectContractManager, setSelectContractManager] = useState('');
    const [addNewManagerDialog, setAddNewManagerDialog] = useState(false);
    const [siteLevel, setSiteLevel] = useState(false);
    const [departmentLevel, setDepartmentLevel] = useState(false);
    const [selectedContract, setSelectedContract] = useState('Select...');
    const theme = useTheme();
    const [personName, setPersonName] = useState([]);
    const [serviceProviderType, setServiceProviderType] = useState('');
    const [npin, setNpin] = useState('');
    const [npinMissing, setNpinMissing] = useState(false);
    const [npinNotApplicable, setNpinNotApplicable] = useState(false);
    const [contractorFirstName, setContractorFirstName] = useState('');
    const [contractorMiddleName, setContractorMiddleName] = useState('');
    const [contractorLastName, setContractorLastName] = useState('');
    const [contractorNameSuffix, setContractorNameSuffix] = useState('');
    const [contractorEmail, setContractorEmail] = useState('');
    const [contractorPhone, setContractorPhone] = useState(0);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [siteLevelTitle, setSiteLevelTitle] = useState('');
    const [departmentLevelDepartment, setDepartmentLevelDepartment] = useState('');
    const [departmentLevelTitle, setDepartmentLevelTitle] = useState('');
    const [siteLevelSite, setSiteLevelSite] = useState({id:'',name:''});
    const [departmentLevelSite, setDepartmentLevelSite] = useState({id:'',name:''});
    const [roles, setRoles] = useState([])
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [tags, setTags] = useState(VALUES);
    const [siteTitleValues, setSiteTitleValues] = useState([]);
    const [departmentTitleValues, setDepartmentTitleValues] = useState([]);
    const id = contractId;
    const [contractData, setContractData] = useState([])
    const [userProviderData, setUserProviderData] = useState({});
    const [isUserPresent,setIsUserPresent] = useState(false);
    const [siteList,setSiteList] = useState([]);
    const [sites,setSites] = useState([]);
    const [selectedSitesDept,setSelectedSitesDepartment] = useState([]);

    useEffect(()=>{
        getRoles();
        getUserData();
        getUsersData();
        getSites();
    },[])

    useEffect(()=>{
      let depts = sites?.filter(data=>data?.id === departmentLevelSite?.id)?.map(data=>data.department)[0];
      setSelectedSitesDepartment(depts);
    },[departmentLevelSite])


    // useEffect(() =>{
    //   if(isUserPresent) {
    //     setServiceProviderType(userProviderData?.serviceProviderType);
    //     setNpin(userProviderData?.npin?.npin);
    //     setNpinMissing(userProviderData?.npin?.missing);
    //     setNpinNotApplicable(userProviderData?.npin?.notApplicable);
    //     setContractorFirstName(userProviderData?.name?.firstName);
    //     setContractorLastName(userProviderData?.name?.lastName);
    //     setContractorNameSuffix(userProviderData?.name?.suffix);
    //     setContractorMiddleName('');
    //     setContractorPhone(userProviderData?.communication?.mobileNumber);
    //     setContractorEmail(userProviderData?.email?.officialEmail);
    //     setCity(userProviderData?.address?.city);
    //     setState(userProviderData?.address?.state);
    //     setZipCode(userProviderData?.address?.zipcode);
    //     setSiteLevel(userProviderData?.siteLevelResponsible);
    //     setDepartmentLevel(userProviderData?.departmentLevelResponsible);
    //     setSelectedRoles(userProviderData?.roles);
    //     // setSiteList(userProviderData?.sites?.sites);
    //     getTitleData();
    //   }
    // }, [contractId, userProviderData])

    useEffect(()=>{
      getTitleData();
    }, [siteList])

    const getTitleData = () => {
      let temp = [];
      siteList?.map(data=>{
        let dept = [];
        data?.departmentList?.departments?.map(deptData=>{
          dept.push({id:deptData?.id,name:deptData?.departmentName?.name,title:''})
        })
        temp.push({id:data?.id,name:data?.siteName?.siteName,title:'',department:dept});
      })
    setSites(temp);
    }

    const getSelectedUserData = async() => {
      const {data: userData} = await GET(`user-management-service/user/${selectContractManager}`);
      if(userData){
        setUserProviderData(userData);
        // setIsUserPresent(userData !== {} ? true : false);
      }
    }

    const getUserData = async() => {
      const {data: userData} = await GET(`user-management-service/user?contractID=${contractId}`);
      if(userData){
        setUsers(userData);
      }
    }

    const getUsersData = async() => {
      const {data: user} = await GET('user-management-service/user');
      if(user){
        setUsers(user);
      }
    }

    const getSites = async () => {
      const {data:sites} = await GET('entity-service/sites');
      if(sites){
        setSiteList(sites);
        getTitleData();
      }
    }


  const titleList = ['Anesthesiologist', 'Cardiologist', 'Chief Medical Information Officer', 'Chief Medical Officer', 'Chief of Staff'];

    const getTagProps = (_v, index) => ({
      minimal: true,
  });

  const handleSiteLevelValues = () => {
    if(siteLevelSite?.name === '' ||  siteLevelTitle === ''){
      ErrorToaster('Selecting all the fields is mandatory');
      return;
    }
    setSiteTitleValues([...siteTitleValues, `${siteLevelSite?.name} - ${siteLevelTitle}`]);
    let temp = sites;
    temp?.filter(data=>data?.id === siteLevelSite?.id)?.map(data=>{
      data.title = siteLevelTitle;
    })
    setSites(temp);
    setSiteLevelSite({id:'',name:''});
    setSiteLevelTitle('');
  }

  const handleDepartmentLevelValues = () => {
    if(departmentLevelSite?.name === '' || departmentLevelDepartment?.name === '' || departmentLevelTitle === ''){
      ErrorToaster('Selecting all the fields is mandatory');
      return;
    }
    let valueString = `${departmentLevelSite?.name} - ${departmentLevelDepartment?.name} - ${departmentLevelTitle}`
    setDepartmentTitleValues([...departmentTitleValues, valueString]);
    let temp = sites;
    let siteDepartment = sites?.filter(data=>data?.id === departmentLevelSite?.id)?.map(data=>data?.department)[0];
    siteDepartment?.filter(dept=>dept?.id === departmentLevelDepartment?.id)?.map(dept=>{
      dept.title = departmentLevelTitle;
    })
    temp?.filter(data=>data?.id === departmentLevelSite?.id)?.map(data=>{
      data.department = siteDepartment;
    })
    setSites(temp);
    setDepartmentLevelSite({id:'',name:''});
    setDepartmentLevelDepartment({id:'',name:''});
    setDepartmentLevelTitle('');
  }

  const handleSelectedDepartmentSite = (id) => {
    setDepartmentLevelSite({id:id,name:sites?.filter(data => data?.id === id)?.map(data => data?.name)[0]});
  }

  console.log('sites',sites);

    const handleSave = async() => {


        // const data = {
          //   ...( isUserPresent && {'id': userProviderData?.id}),
          //   "name": {
          //       "firstName": contractorFirstName,
          //       "lastName": contractorLastName,
          //       "suffix": contractorNameSuffix
          //     },
          //     "userType": "ADMIN",
          //     "contracts": [
          //       {
          //         "id": testContractId,
          //         "contractName": {
          //           "contractName": contractName
          //         }
          //       }
          //     ],
          //     "title": {
          //       "title": "string"
          //     },
          //     "email": {
          //       "officialEmail": contractorEmail
          //     },
          //     ...( !isUserPresent && {"password": {
          //       "password": "string"
          //     }}),
          //     "communication": {
          //       "personalEmail": contractorEmail,
          //       "mobileNumber": contractorPhone,
          //       "landlineNumber": "string",
          //       "mobileNumberNotApplicable": true
          //     },
          //     "roles": selectedRoles,
          //     "address": {
          //       "city": city,
          //       "state": state,
          //       "zipcode": zipCode
          //     },
          //     "tenant": {
          //       "tenantId": TenantID
          //     },
          //     "sites": {
          //       "sites": [],
          //       // [
          //       //   {
          //       //     "id": "string",
          //       //     "siteName": {
          //       //       "siteName": "string"
          //       //     },
          //       //     "departmentList": {
          //       //       "departments": [
          //       //         {
          //       //           "id": "string",
          //       //           "departmentName": {
          //       //             "name": "string"
          //       //           },
          //       //           "departmentHead": {
          //       //             "id": "string"
          //       //           },
          //       //           "departmentResponsibility": {
          //       //             "title": "string"
          //       //           }
          //       //         }
          //       //       ]
          //       //     },
          //       //     "siteResponsibility": {
          //       //       "title": "string"
          //       //     }
          //       //   }
          //       // ]
          //     },
          //     "serviceProviderType": serviceProviderType,
          //     "licenceDetails": {
          //       "medicalLicense": "",
          //       "licenseExpiryDate": "",
          //       "deaNumber": "",
          //       "deaExpiryDate": "",
          //       "boardCertification": [
          //         "string"
          //       ]
          //     },
          //     "userProxy": {
          //       "myProxy": {
          //         "proxyIdList": [
          //           {
          //             "id": "",
          //             "name": ""
          //           }
          //         ]
          //       },
          //       "proxyFor": {
          //         "proxyIdList": [
          //           {
          //             "id": "",
          //             "name": ""
          //           }
          //         ]
          //       }
          //     },
          //     "activated": true,
          //     "siteLevelResponsible": siteLevel,
          //     "departmentLevelResponsible": departmentLevel,
          //     "blocked": true,
          //     "npin": {
          //       "missing": npinMissing,
          //       "notApplicable": npinNotApplicable,
          //       "npin": npin
          //     }
          // }
          // if(isUserPresent){
          //   const response = await PUT('user-management-service/user', JSON.stringify(data));
          //   if(response){
          //       SuccessToaster('User Updated Successfully');
          //   }
          //   else {
          //       ErrorToaster('Unexpected Error');
          //   }
          // } else {
          //   const response = await POST('user-management-service/user/register', JSON.stringify(data));
          //   if(response){
          //     SuccessToaster('User Added Successfully');
          //   }
          //   else {
          //       ErrorToaster('Unexpected Error');
          //   }
          // }
    }

    const handleRoles = (value) => {
        if (value !== '0') {
          const selectedValue = roles.filter(data => data?.roleName === value).map(data => data)[0];

          if (!selectedRoles.map(data => data?.roleName).includes(value)) {
            setSelectedRoles([...selectedRoles, selectedValue]);
          }
        }
    }

    const rolesTags = selectedRoles
    ?.filter(data => roles.map(role => role?.id === data?.id))
    ?.map((tag, index) => {
      const onRemove = () => {
        setSelectedRoles(selectedRoles.filter((t) => t?.roleName !== tag?.roleName));
      };
      return (
        <Tag key={index} onRemove={onRemove} large={true} className={style.tagStyle}>
          {tag?.roleName}
        </Tag>
      );
    });

    const getRoles = async() => {
        const {data: roles} = await GET('user-management-service/roles');
        setRoles(roles);
    };

    const onSelectDepartment = (deptId) => {
      let selectedSite = sites?.filter(data=>data?.id === departmentLevelSite?.id)?.map(data=>data)[0];
      let selectedDepartment = selectedSite?.department?.filter(data=>data?.id === deptId)?.map(data=>data?.name)[0];
      setDepartmentLevelDepartment({id:deptId,name:selectedDepartment});
    }

    const handleDeptRemove = (values,index) => {
      let data = values?.split(' - ');
      let site = data?.[0];
      let dept = data?.[1];
      let title = data?.[2];
      let temp = sites;
      let siteDepartment = sites?.filter(data=>data?.name === site)?.map(data=>data?.department)[0];
      siteDepartment?.filter(data=>data?.name === dept && data?.title === title)?.map(data=>{
        data.title = '';
      });
      temp?.filter(data=>data?.name === site && data?.title)?.map(data=>{
        data.department = siteDepartment;
      });
      setSites(temp);
      setDepartmentTitleValues(departmentTitleValues?.filter((data,indexVal)=>index !== indexVal)?.map(data=>data));
    }

    const handleSiteRemove = (values, index) => {
      let data = values?.split(' - ');
      let site = data?.[0];
      let title = data?.[1];
      let temp = sites;
      temp?.filter(data=>data?.name === site && data?.title === title)?.map(data=>{
        data.title = '';
      })
      setSites(temp);
      setSiteTitleValues(siteTitleValues?.filter((data,indexVal)=>index!== indexVal)?.map(data=>data));
    }

    const resetSiteLevel = (value) => {
      if(!value){
        getTitleData();
      }
    }

    const resetDeptvalue = (value) => {
      if(!value){
        getTitleData();
      }
    }

    const items = useMemo(
        () =>
          user.map((option) => ({
            id: option?.id,
            value: `${option.name.firstName} ${option.name.lastName} ${option.name.suffix}`,
            ...option,
          })),
        [user],
      );

    const onSelect = (selectedItem) => {
      setSelectContractManager(selectedItem.id);
    }

    const getAddNewManagerDialog = (value) => {
      setAddNewManagerDialog(value);
  }


    return(
        <div className={style.cloneBlockStyle}>
            <div className={`${style.newContractFromCloneBoxStyle}`}>

            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Assigned Contract Manager*</div>
                <div className={style.displayInRow}>
                <div>
                    <DatalistInput items={items || []} onSelect={onSelect}  onChange={(e)=>setUserName(e.target.value)} className={style.selectFieldWidth} value={items?.filter(data=>data?.id === selectContractManager)?.map(data=>data?.value)[0]}/>
                    {!items?.map(data=>data.name?.firstName)?.includes(userName) && !userName === '' &&(
                        <div className={style.addBoxDescription}>
                        The Contract Manager you are trying to add is not a registered
                        user. to add a new contract manager click on the "ADD" button.
                        </div>
                    )}
                </div>
                <button className={`${style.disabledButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} onClick={() =>setAddNewManagerDialog(true)}>ADD</button>
                </div>
            </div>

            {
              // <div className={`${style.extentionGrid}`}>
              // <div className={style.extentionLableStyle}>Service Provider Type*</div>
              //     <div className={style.grid3}>
              //         <select
              //             name="class"
              //             id="Class"
              //             value={serviceProviderType}
              //             onChange={(e) => setServiceProviderType(e.target.value)}
              //             className={style.fullWidth}>
              //                 <option value="Text" >
              //                 Text
              //                 </option>
              //                 <option value="Physician" >
              //                 Physician
              //                 </option>
              //                 <option value="Nurse" >
              //                 Nurse
              //                 </option>
              //                 <option value="Admin Staff" >
              //                 Admin Staff
              //                 </option>
              //                 <option value="Other" >
              //                 Other
              //                 </option>
              //         </select>
              //     </div>
                // </div>
                // <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                //     <div className={style.extentionLableStyle}>NPIN*</div>
                //     <div className={style.grid3}>
                //     <InputGroup className={style.fullWidth}
                //     placeholder="NPIN"
                //     value={npin}
                //     onChange={(e) => setNpin(e.target.value)}/>
                //     <FormGroup>
                //         <FormControlLabel control={<Checkbox value="Missing" checked={npinMissing} onChange={(e) => setNpinMissing(e.target.checked)} />} label="Missing" />
                //     </FormGroup>
                //     <FormGroup>
                //         <FormControlLabel control={<Checkbox value="NA" checked={npinNotApplicable} onChange={(e) => setNpinNotApplicable(e.target.checked)} />} label="NA" />
                //     </FormGroup>
                //     </div>
                // </div>
                // <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                //     <div className={style.extentionLableStyle}>Contractor Name*</div>
                //     <div className={style.grid3}>
                //         <InputGroup className={style.fullWidth} placeholder="First"
                //         value={contractorFirstName}
                //         onChange={(e) => setContractorFirstName(e.target.value)} />
                //         <InputGroup className={style.fullWidth} placeholder="Middle"
                //         value={contractorMiddleName}
                //         onChange={(e) => setContractorMiddleName(e.target.value)}/>
                //         <InputGroup className={style.fullWidth} placeholder="Last"
                //         value={contractorLastName}
                //         onChange={(e) => setContractorLastName(e.target.value)}/>
                //     </div>
                // </div>
                // <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                //     <div className={style.extentionLableStyle}>Suffix*</div>
                //     <div className={style.grid3}>
                //         <select
                //             name="class"
                //             id="Class"
                //             value={contractorNameSuffix}
                //             onChange={(e) => setContractorNameSuffix(e.target.value)}
                //             className={style.fullWidth}>
                //                 <option value="Text" >
                //                 Text
                //                 </option>
                //         </select>
                //     </div>
                // </div>

                // <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                //     <div className={style.extentionLableStyle}>Email Contractor id*</div>
                //     <div className={style.displayInRow}>
                //         <InputGroup placeholder="Enter entity specific email" className={`${style.entityFieldWidth}`}
                //         value={contractorEmail}
                //         onChange={(e) => setContractorEmail(e.target.value)}/>
                //     </div>
                // </div>
                // <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                //     <div className={style.extentionLableStyle}>Cell Phone*</div>
                //     <div className={style.grid2}>
                //     <InputGroup placeholder="Numeric" className={style.fullWidth}
                //     value={contractorPhone}
                //     onChange={(e) => setContractorPhone(e.target.value)}/>
                //     </div>
                // </div>
                // <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                //     <div className={style.extentionLableStyle}>Address*</div>
                //     <div className={style.grid3}>
                //     <InputGroup className={style.fullWidth} placeholder="City"
                //     value={city}
                //     onChange={(e) => setCity(e.target.value)}/>
                //     <InputGroup className={style.fullWidth} placeholder="State"
                //     value={state}
                //     onChange={(e) => setState(e.target.value)}/>
                //     <InputGroup className={style.fullWidth} placeholder="Zipcode"
                //     value={zipCode}
                //     onChange={(e) => setZipCode(e.target.value)}/>
                //     </div>
                // </div>


                // ******This should come after site and dept Responsibility as per UX*****

            //     <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            //         <div className={style.extentionLableStyle}>Assign Contractor With App User Role*</div>
            //         {/* <div>
            //             <FormControl sx={{ width: '100%'}}>
            //                 <Select
            //                 labelId="demo-multiple-chip-label"
            //                 id="demo-multiple-chip"
            //                 multiple
            //                 value={personName}
            //                 onChange={(e) => handleRoles(e.target.value)}
            //                 renderValue={(selected) => (
            //                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }} className={style.selectMultipleCheckbox}>
            //                     {selected.map((value) => (
            //                         <Chip key={value} label={value} />
            //                     ))}
            //                     </Box>
            //                 )}
            //                 MenuProps={MenuProps}
            //                 >
            //                 {roles.map((role) => (
            //                     <MenuItem
            //                     key={role?.id}
            //                     value={role?.roleName}
            //                     style={getStyles(role, personName, theme)}
            //                     >
            //                         <Checkbox checked={personName.indexOf(role) > -1} />
            //                         <ListItemText primary={role?.roleName} />
            //                     </MenuItem>
            //                 ))}
            //                 </Select>
            //             </FormControl>
            //         </div> */}
            //         <div className={`${style.reduce10Left} ${style.marginRight}`}>
            //             <select
            //                 name="class"
            //                 id="Class"
            //                 onChange={(e) => handleRoles(e.target.value)}
            //                 className={`${style.fullWidth} ${style.marginLeft20} `}>
            //                     <option value="0" >
            //                     Select Role-multi select
            //                     </option>
            //                     {roles?.map((data, index) => (
            //                     <option key={`${data}-${index}`} value={data?.roleName} >
            //                         {data?.roleName}
            //                     </option>
            //                     ))}
            //             </select>
            //             <div className={`${style.marginTop20} ${style.marginLeft20}`}>
            //             {rolesTags}
            //             </div>
            //         </div>
            //     </div>
            //
            }




                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Site Level Responsibility*</div>
                    <div>
                        <div className={style.flexLeft}>
                            <FormControlLabel
                                control={
                                    <Switch checked={siteLevel} className={`${style.flexLeft}`} onChange={() => {setSiteLevel(!siteLevel);resetSiteLevel(!siteLevel);}}  />
                                }
                                className={`${style.switchFontStyle} ${style.marginTop}`}
                                label={siteLevel ? 'YES' : "NO"}
                            />
                        </div>
                        {siteLevel && (
                            <div className={`${style.siteLevelBoxStyle}`}>
                              {/* {selectedContract === "Multiple Contractor" && ( */}
                              <div className={`${style.siteLevelGrid}`}>
                                        <div className={style.marginTop}>Site*</div>
                                        <select
                                            name="class"
                                            id="Class"
                                            value={siteLevelSite?.id}
                                            onChange={(e) => setSiteLevelSite({id:e.target.value,name:sites?.filter(data=>data?.id === e.target.value)?.map(data=>data?.name)[0]})}
                                            className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                <option value="Select Site" >
                                                Select Site
                                                </option>
                                                {sites?.map((data, index) => (
                                                  <option key={index} value={data?.id} disabled={data?.title !== ''?true:false}>
                                                    {data?.name}
                                                  </option>
                                                ))}
                                        </select>
                                    </div>
                                {/* )} */}
                                <div className={`${style.siteLevelGrid} ${style.marginTop10}`}>
                                    <div className={style.marginTop}>Title*</div>
                                    <select
                                        name="class"
                                        id="Class"
                                        value={siteLevelTitle}
                                        onChange={(e) => setSiteLevelTitle(e.target.value)}
                                        className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                            <option value="Select Title" >
                                            Select Title
                                            </option>
                                            {titleList?.map((data, index) => (
                                              <option key={index} value={data}>
                                                {data}
                                              </option>
                                            ))}
                                    </select>
                                </div>
                                <div className={`${style.addButtonPosition} ${style.marginTop20}`}>
                                  <Button variant="outlined" onClick={() => handleSiteLevelValues()}>Add</Button>
                                </div>
                                <TagInput
                                    // placeholder="Enter tags/keywords relative to the post"
                                    values={siteTitleValues}
                                    className={`${style.marginTop20}`}
                                    onRemove={handleSiteRemove}
                                    separator={/[\s,]/}
                                    addOnBlur={true}
                                    addOnPaste={true}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Department Level Responsibility*</div>
                    <div>
                        <div className={style.flexLeft}>
                            <FormControlLabel
                                control={
                                    <Switch checked={departmentLevel} className={`${style.flexLeft}`} onChange={() => {setDepartmentLevel(!departmentLevel);resetDeptvalue(!departmentLevel)}}  />
                                }
                                className={`${style.switchFontStyle} ${style.marginTop}`}
                                label={departmentLevel ? 'YES' : "NO"}
                            />
                        </div>
                        <div>
                            {departmentLevel && (
                                <div className={`${style.departmentLevelBoxStyle}`}>
                                  {/* {selectedContract === "Multiple Contractor" && ( */}
                                    <div className={`${style.siteLevelGrid}`}>
                                        <div className={style.marginTop}>Site*</div>
                                        <select
                                            name="class"
                                            id="Class"
                                            value={departmentLevelSite?.id}
                                            onChange={(e) => handleSelectedDepartmentSite(e.target.value)}
                                            className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                <option value="Select Site" >
                                                Select Site
                                                </option>
                                                {sites?.map((data, index) => (
                                                  <option key={index} value={data?.id}>
                                                    {data?.name}
                                                  </option>
                                                ))}
                                        </select>
                                      </div>
                                    {/* )} */}
                                    <div className={`${style.siteLevelGrid} ${style.marginTop10}`}>
                                        <div className={style.marginTop}>Department*</div>
                                        <select
                                            name="class"
                                            id="Class"
                                            value={departmentLevelDepartment?.id}
                                            onChange={(e) => onSelectDepartment(e.target.value)}
                                            className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                <option value="Select Department" >
                                                Select Department
                                                </option>
                                                {selectedSitesDept?.map((data, index) =>
                                                    <option key={index} value={data?.id} disabled={data?.title !== ''?true:false}>
                                                      {data?.name}
                                                    </option>
                                                  )
                                                }
                                        </select>
                                    </div>
                                    <div className={`${style.siteLevelGrid} ${style.marginTop10}`}>
                                        <div className={style.marginTop}>Title*</div>
                                        <select
                                            name="class"
                                            id="Class"
                                            value={departmentLevelTitle}
                                            onChange={(e) => setDepartmentLevelTitle(e.target.value)}
                                            className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                <option value="Select Title" >
                                                Select Title
                                                </option>
                                                {titleList?.map((data, index) => (
                                                  <option key={index} value={data}>
                                                    {data}
                                                  </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className={`${style.addButtonPosition} ${style.marginTop20}`}>
                                      <Button variant="outlined" onClick={() => handleDepartmentLevelValues()}>Add</Button>
                                    </div>
                                    <TagInput
                                        // placeholder="Enter tags/keywords relative to the post"
                                        values={departmentTitleValues}
                                        className={`${style.marginTop20}`}
                                        onRemove={handleDeptRemove}
                                        separator={/[\s,]/}
                                        addOnBlur={true}
                                        addOnPaste={true}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
              </div>
            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
              <button className={`${style.newContractButtonStyle}`} onClick={()=> {getCurrentPage('Contract ID & Term Limit')}}>BACK</button>
              <div>
                <button className={style.newContractOutlinedButton} onClick={() => handleSave()}>SAVE IN-PROGRESS</button>
                <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {getViewPage3(true);getCurrentPage('Contractor Business Entity')}}>CONTINUE</button>
              </div>
            </div>

              {addNewManagerDialog && (
                  <AddContractUser getAddNewManagerDialog={getAddNewManagerDialog} contractType={contractType} getUserData={getUsersData} contractId={contractId} contractName={contractName}/>
              )}

        </div>
    )
}

export default ContractedServicesProviderIndividual;
