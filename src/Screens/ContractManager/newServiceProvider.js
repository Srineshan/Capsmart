import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, Classes, Icon, Intent, Tag, InputGroup, Button, RadioGroup, Radio, TagInput } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatalistInput from 'react-datalist-input';
import {GET, PUT, POST, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

import style from './index.module.scss';

const NewServiceProvider = ({getNewServiceProviderDialog, contractId, contractType}) => {
    const [selectedContract, setSelectedContract] = useState('Written Contract Extension For Fixed Term');
    const [startDate, setStartDate] = useState(new Date);
    const [user,setUsers] = useState([]);
    const [selectContractManager, setSelectContractManager] = useState('');
    const [userName, setUserName] = useState('');
    const [terminationTrigger, setTerminationTrigger] = useState('Contract Expiration');
    const [roles,setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [npin,setNpin] = useState({npin:'',missing:false,na:false});
    const [userDetails,setUserDetails] = useState({firstName:'',middleName:'',lastName:'',suffix:'',email:'',phone:''});
    const [providerType,setProviderType] = useState('');
    const [address,setAddress] = useState({city:'',state:'',zipcode:''});
    const [siteLevel,setSiteLevel] = useState(false);
    const [departmentLevel,setDepartmentLevel] = useState(false);
    const [siteList,setSiteList] = useState([]);
    const [sites,setSites] = useState([]);
    const [selectedSitesDept,setSelectedSitesDepartment] = useState([]);
    const [siteLevelTitle, setSiteLevelTitle] = useState('');
    const [departmentLevelDepartment, setDepartmentLevelDepartment] = useState('');
    const [departmentLevelTitle, setDepartmentLevelTitle] = useState('');
    const [siteLevelSite, setSiteLevelSite] = useState({id:'',name:''});
    const [departmentLevelSite, setDepartmentLevelSite] = useState({id:'',name:''});
    const [siteTitleValues, setSiteTitleValues] = useState([]);
    const [departmentTitleValues, setDepartmentTitleValues] = useState([]);
    const [contractName, setContractName] = useState('');
    const [contracts,setContracts] = useState([]);

    const titleList = ['Anesthesiologist', 'Cardiologist', 'Chief Medical Information Officer', 'Chief Medical Officer', 'Chief of Staff'];

    const leftElement = () => {
        return(
            <Button text="Upload" intent={Intent.PRIMARY} />
        )
    }

    const calendarIcon = () => {
        return(
            <Icon icon="calendar" intent={Intent.PRIMARY} className={style.calendarStyle} />
        )
    }

    useEffect(()=>{
      getRolesData();
      getUsersData();
      getContractDetail();
    },[])

    useEffect(()=>{
      getTitleData();
    }, [siteList])


    useEffect(()=>{
      if(siteList?.length === 0){
        getContractDetail();
      }
    },[siteLevel,departmentLevel])

    useEffect(()=>{
      let depts = sites?.filter(data=>data?.id === departmentLevelSite?.id)?.map(data=>data.department)[0];
      setSelectedSitesDepartment(depts);
    },[departmentLevelSite])

    const getTitleData = () => {
      let temp = [];
      let siteValue = siteTitleValues;
      let deptValue = departmentTitleValues;
      siteList?.map(data=>{
        let dept = [];
        data?.departmentList?.departments?.map(deptData=>{
          dept.push({id:deptData?.id,name:deptData?.departmentName?.name,title:deptData?.departmentResponsibility?.title || ''});
          if(deptData?.departmentResponsibility?.title !== '' && deptData?.departmentResponsibility?.title !== undefined){
            let valueString = `${data?.siteName?.siteName} - ${deptData?.departmentName?.name} - ${deptData?.departmentResponsibility?.title}`
            if(!deptValue.includes(valueString)){
              deptValue.push(valueString);
            }
          }
          })
        temp.push({id:data?.id,name:data?.siteName?.siteName,title:data?.siteResponsibility?.title || '',department:dept});
        if(data?.siteResponsibility?.title !== '' && data?.siteResponsibility?.title !== undefined){
          let valueString = `${data?.siteName?.siteName} - ${data?.siteResponsibility?.title}`;
          if(!siteValue.includes(valueString)){
            siteValue.push(valueString);
          }
      }})
    setSites(temp);
    setSiteTitleValues(siteValue);
    setDepartmentTitleValues(deptValue);
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
    ?.filter(data => roles.map(role => role).includes(data))
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

    const getRolesData = async() => {
      const {data: roles} = await GET(`user-management-service/roles`);
      if(roles){
        setRoles(roles);
      }
    }

    const getContractDetail = async() => {
      const {data: contractData} = await GET(`contract-managment-service/contracts/${contractId}/contractDetail`);
      if(contractData){
        setContractName(contractData?.contractName?.contractName);
        setSiteList(contractData?.contractDetail?.site?.sites);
      }
    }

    const handleUserData = (name,value) => {
      setUserDetails({...userDetails, [name]:value});
    }

    const handleAddress = (name,value) => {
      setAddress({...address, [name]:value});
    }

    const handleSave = async(type) => {
        let contractData = [];
        contractData.push({
          "id": contractId,
          "contractName": {
            "contractName": contractName
          },
          "roles":[],
          "sites":{
            "sites":getSiteData()
          },
          "departmentLevelResponsible":departmentLevel,
          "siteLevelResponsible":siteLevel,
        });

        const data = {
            "name": {
                "firstName": userDetails?.firstName,
                "lastName": userDetails?.lastName,
                "suffix": userDetails?.suffix
              },
              "userType": "ADMIN",
              "contracts": contractData,
              "title": {
                "title": ''
              },
              "email": {
                "officialEmail": userDetails?.email
              },
              "password": {
                "password": ''
              },
              "communication": {
                "personalEmail": userDetails?.email,
                "mobileNumber": userDetails?.phone,
                "landlineNumber": "string",
                "mobileNumberNotApplicable": true
              },
              "roles": selectedRoles,
              "address": {
                "city": address?.city,
                "state": address?.state,
                "zipcode": address?.zipcode
              },
              "tenant": {
                "tenantId": TenantID
              },
              "sites": {
                "sites": [],
              },
              "serviceProviderType": providerType,
              "activated": false,
              "blocked": false,
              "npin": {
                "missing": npin?.missing,
                "notApplicable": npin?.na,
                "npin": npin?.npin
              }
          }
          await POST(`user-management-service/user/register`, JSON.stringify(data))
          .then(response=>{
              SuccessToaster('User Added Successfully');
          })
          .catch(error=>{
              ErrorToaster('Unexpected Error');
          })
          setUserDetails({firstName:'',middleName:'',lastName:'',suffix:'',email:'',phone:''});
          setProviderType('');
          setAddress({city:'',state:'',zipcode:''});
          setSiteLevel(false);
          setDepartmentLevel(false);
          setSelectedRoles([]);
          setDepartmentTitleValues([]);
          setSiteTitleValues([]);
          setNpin({npin:'',missing:false,na:false});
          if(type !== 'Add More'){
            getNewServiceProviderDialog(false);
          }
    }
    const getUsersData = async() => {
      const {data: user} = await GET('user-management-service/user');
      if(user){
        setUsers(user);
      }
    }

    const onSelectDepartment = (deptId) => {
      let selectedSite = sites?.filter(data=>data?.id === departmentLevelSite?.id)?.map(data=>data)[0];
      let selectedDepartment = selectedSite?.department?.filter(data=>data?.id === deptId)?.map(data=>data?.name)[0];
      setDepartmentLevelDepartment({id:deptId,name:selectedDepartment});
    }

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


    const getSiteData  = () => {
      let siteData = [];
      sites?.map(data=>{
        let deptData = [];
        data?.department?.map(dept=>{
          deptData.push({
              "id": dept?.id,
              "departmentName": {
                "name": dept?.name
              },
              "departmentHead": {
                "id": ""
              },
              "departmentResponsibility": {
                "title": dept?.title
              }
          })
        })
        siteData.push({
        id: data?.id,
        "siteName": {
          "siteName": data?.name
        },
        "departmentList": {
          "departments": deptData
        },
        "siteResponsibility": {
          "title": data?.title
        }
      })
      })
      return siteData;
    }



    return(
        <Dialog isOpen={getNewServiceProviderDialog} onClose={() => getNewServiceProviderDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>New Service Provider</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getNewServiceProviderDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={`${style.serviceBoxStyle}`}>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Contractor Name*</div>
                  <div className={style.grid3}>
                  <InputGroup className={style.fullWidth} value={userDetails?.firstName} placeholder="First" onChange={(e)=>handleUserData('firstName',e.target.value)}/>
                  <InputGroup className={style.fullWidth} value={userDetails?.middleName} placeholder="Middle" onChange={(e)=>handleUserData('middleName',e.target.value)}/>
                  <InputGroup className={style.fullWidth} value={userDetails?.lastName} placeholder="Last" onChange={(e)=>handleUserData('lastName',e.target.value)}/>
                  </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Service Provider Type*</div>
                  <div className={style.grid3}>
                      <select
                          name="class"
                          id="Class"
                          value={providerType}
                          className={style.fullWidth}
                          onChange={(e)=>setProviderType(e.target.value)}>
                              <option value="Text" >
                              Text
                              </option>
                              <option value="Physician" >
                              Physician
                              </option>
                              <option value="Nurse" >
                              Nurse
                              </option>
                              <option value="Admin Staff" >
                              Admin Staff
                              </option>
                              <option value="Other" >
                              Other
                              </option>
                      </select>
                  </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>NPIN*</div>
                  <div className={style.grid3}>
                  <InputGroup className={style.fullWidth} value={npin?.npin} onChange={(e)=>setNpin({npin:e.target.value,na:false,missing:false})}/>
                  <RadioGroup
                      inline={true}
                      className={`${style.marginTop}`}
                      selectedValue={npin?.missing}
                      onChange={(e)=>setNpin({npin:'',missing:e.target.value,na:false})}
                  >
                      <Radio label="Missing" value="Missing" checked={npin?.missing} />
                  </RadioGroup>
                  <RadioGroup
                      inline={true}
                      className={`${style.marginTop} ${style.reduce30Left}`}
                      selectedValue={npin?.na}
                      onChange={(e)=>setNpin({npin:'',missing:false,na:e.target.value})}
                  >
                      <Radio label="Not Available" value="Not Available" checked={npin?.na}/>
                  </RadioGroup>
                  </div>
              </div>

                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Suffix*</div>
                    <div className={style.grid3}>
                        <select
                            name="class"
                            id="Class"
                            className={style.fullWidth}
                            onChange={(e)=>handleUserData('suffix',e.target.value)}>
                                <option value="Text" >
                                Text
                                </option>
                        </select>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Email Contractor id*</div>
                    <div className={style.displayInRow}>
                        <InputGroup placeholder="Enter entity specific email" value={userDetails?.email} className={`${style.entityFieldWidth}`} onChange={(e)=>handleUserData('email',e.target.value)}/>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Cell Phone*</div>
                    <div className={style.grid2}>
                    <InputGroup placeholder="Numeric" value={userDetails?.phone} className={style.fullWidth} onChange={(e)=>handleUserData('phone',e.target.value)}/>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Address*</div>
                    <div className={style.grid3}>
                    <InputGroup className={style.fullWidth} placeholder="City" value={address.city} onChange={(e)=>handleAddress('city',e.target.value)}/>
                    <InputGroup className={style.fullWidth} placeholder="State" value={address.state} onChange={(e)=>handleAddress('state',e.target.value)}/>
                    <InputGroup className={style.fullWidth} placeholder="Zipcode" value={address.zipcode} onChange={(e)=>handleAddress('zipcode',e.target.value)}/>
                    </div>
                </div>

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
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                         <div className={style.extentionLableStyle}>Assign Contractor With App User Role*</div>
                         <div className={style.displayInRow}>
                             <select
                                 name="class"
                                 id="Class"
                                 onChange={(e) => handleRoles(e.target.value)}
                                 className={`${style.fullWidth} ${style.marginLeft20} `}>
                                     <option value="0" >
                                     Select Role-multi select
                                     </option>
                                     {roles?.map((data, index) => (
                                     <option key={`${data}-${index}`} value={data?.roleName} >
                                         {data?.roleName}
                                     </option>
                                     ))}
                             </select>
                          </div>
                             <div className={`${style.marginTop20} ${style.marginLeft20}`}>
                             {rolesTags}
                             </div>
                     </div>
                </div>
            </div>



            <div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={`${style.buttonStyle}`} onClick={() => handleSave('Add More')}>ADD MORE</button>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={()=>handleSave('Save & Exit')}>SAVE & EXIT</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default NewServiceProvider;
