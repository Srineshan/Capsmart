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
import MenuItem from '@mui/material/MenuItem';
import {POST, GET, PUT, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import SuffixList from './../../Components/SuffixList';
import ProviderTypeList from './../../Components/ProviderTypeList';
import FunctionalTitleList from './../../Components/FunctionalTitleList';

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

  const VALUES = ['Site 1', "Site 2"];
const ContractedServicesProviderIndividual = ({getViewPage3, getCurrentPage, contractId, contractType}) => {
    const testContractId = contractId;
    const [user,setUsers] = useState([]);
    const [userName, setUserName] = useState('');
    const [selectContractManager, setSelectContractManager] = useState('');
    const [siteLevel, setSiteLevel] = useState(false);
    const [departmentLevel, setDepartmentLevel] = useState(false);
    const [selectedContract, setSelectedContract] = useState('Select...');
    const theme = useTheme();
    const [personName, setPersonName] = useState([]);
    const [serviceProviderType, setServiceProviderType] = useState({contractedServiceProviderType:'',id:''});
    const [npin, setNpin] = useState('');
    const [npinMissing, setNpinMissing] = useState(false);
    const [contractName,setContractName] = useState('');
    const [npinNotApplicable, setNpinNotApplicable] = useState(false);
    const [contractorFirstName, setContractorFirstName] = useState('');
    const [contractorMiddleName, setContractorMiddleName] = useState('');
    const [contractorLastName, setContractorLastName] = useState('');
    const [contractorNameSuffix, setContractorNameSuffix] = useState({id:'',suffix:''});
    const [contractorEmail, setContractorEmail] = useState('');
    const [contractorPhone, setContractorPhone] = useState(0);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [siteLevelTitle, setSiteLevelTitle] = useState({title:'',id:''});
    const [departmentLevelDepartment, setDepartmentLevelDepartment] = useState('');
    const [departmentLevelTitle, setDepartmentLevelTitle] = useState({title:'',id:''});
    const [siteLevelSite, setSiteLevelSite] = useState({id:'',name:''});
    const [departmentLevelSite, setDepartmentLevelSite] = useState({id:'',name:''});
    const [roles, setRoles] = useState([])
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [siteTitleValues, setSiteTitleValues] = useState([]);
    const [departmentTitleValues, setDepartmentTitleValues] = useState([]);
    const id = contractId;
    const [contractData, setContractData] = useState([])
    const [userProviderData, setUserProviderData] = useState({});
    const [isUserPresent,setIsUserPresent] = useState(false);
    const [siteList,setSiteList] = useState([]);
    const [sites,setSites] = useState([]);
    const [selectedSitesDept,setSelectedSitesDepartment] = useState([]);
    const [contracts,setContracts] = useState([]);

    useEffect(()=>{
        getRoles();
        getUserData();
        getUsersData();
        getContractName();
    },[])

    useEffect(()=>{
      let depts = sites?.filter(data=>data?.id === departmentLevelSite?.id)?.map(data=>data.department)[0];
      setSelectedSitesDepartment(depts);
    },[departmentLevelSite])


    useEffect(() =>{
      if(isUserPresent){
        setServiceProviderType(userProviderData?.serviceProviderType);
        setNpin(userProviderData?.npin?.npin);
        setNpinMissing(userProviderData?.npin?.missing);
        setNpinNotApplicable(userProviderData?.npin?.notApplicable);
        setContractorFirstName(userProviderData?.name?.firstName);
        setContractorLastName(userProviderData?.name?.lastName);
        setContractorNameSuffix(userProviderData?.name?.suffix);
        setContractorMiddleName('');
        setContractorPhone(userProviderData?.communication?.mobileNumber);
        setContractorEmail(userProviderData?.email?.officialEmail);
        setCity(userProviderData?.address?.city);
        setState(userProviderData?.address?.state);
        setZipCode(userProviderData?.address?.zipcode);
        setSelectedRoles(userProviderData?.roles || []);
        setContracts(userProviderData?.contracts);
        let contractData = userProviderData?.contracts?.filter(data=>data?.id === contractId)?.map(data=>data)[0];
        setSiteList(contractData?.sites?.sites ? contractData?.sites?.sites : [] );
        setSiteLevel(contractData?.siteLevelResponsible);
        setDepartmentLevel(contractData?.departmentLevelResponsible);
      }
    }, [contractId, userProviderData, isUserPresent])

    useEffect(()=>{
      getTitleData();
    }, [siteList])

    const getTitleData = () => {
      let temp = [];
      let siteValue = siteTitleValues;
      let deptValue = departmentTitleValues;
      siteList?.map(data=>{
        let dept = [];
        data?.departmentList?.departments?.map(deptData=>{
          dept.push({id:deptData?.id,name:deptData?.departmentName?.name,title:deptData?.departmentResponsibility?.title || '', title_id:deptData?.departmentResponsibility?.id || ''});
          if(deptData?.departmentResponsibility?.title !== '' && deptData?.departmentResponsibility?.title !== undefined){
            let valueString = `${data?.siteName?.siteName} - ${deptData?.departmentName?.name} - ${deptData?.departmentResponsibility?.title}`
            if(!deptValue.includes(valueString)){
              deptValue.push(valueString);
            }
          }
          })
        temp.push({id:data?.id,name:data?.siteName?.siteName,title:data?.siteResponsibility?.title || '',title_id:data?.siteResponsibility?.id, department:dept});
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


    const getContractName = async() => {
      const {data: contractData} = await GET(`contract-managment-service/contracts/${contractId}/contractDetail`);
      if(contractData){
        setContractName(contractData?.contractName?.contractName);
      }
    }

    const getUserData = async() => {
      if(contractId !== '' && contractId !== undefined){
        const {data: userData} = await GET(`user-management-service/user?contractID=${contractId}`);
        if(userData){
          if(userData?.length !== 0){
            setUserProviderData(userData[0]);
            setIsUserPresent(true);
            if(userData?.contracts?.filter(data=>data?.id === contractId && data?.sites !== null)?.map(data=>data)?.length !== 0)
            {
              getSites();
            }
          }
          setUsers(userData);
        }
      }
    }

    const getUsersData = async() => {
      const {data: user} = await GET('user-management-service/user');
      if(user){
        setUsers(user);
      }
    }

    const getSites = async () => {
      const {data: contractData} = await GET(`contract-managment-service/contracts/${contractId}/contractDetail`);
      let contractDetail = contractData?.contractDetail;
      let sites = contractDetail?.site?.sites;
      if(sites && siteList?.length === 0){
        setSiteList(sites);
        getTitleData();
      }
    }

    const getTagProps = (_v, index) => ({
      minimal: true,
  });

  const handleSiteLevelValues = () => {
    if(siteLevelSite?.name === '' ||  siteLevelTitle.title === ''){
      ErrorToaster('Selecting all the fields is mandatory');
      return;
    }
    setSiteTitleValues([...siteTitleValues, `${siteLevelSite?.name} - ${siteLevelTitle?.title}`]);
    let temp = sites;
    temp?.filter(data=>data?.id === siteLevelSite?.id)?.map(data=>{
      data.title = siteLevelTitle?.title;
      data.title_id = siteLevelTitle?.id;
    })
    setSites(temp);
    setSiteLevelSite({id:'',name:''});
    setSiteLevelTitle({id:'',title:''});
  }

  const handleDepartmentLevelValues = () => {
    if(departmentLevelSite?.name === '' || departmentLevelDepartment?.name === '' || departmentLevelTitle?.title === ''){
      ErrorToaster('Selecting all the fields is mandatory');
      return;
    }
    let valueString = `${departmentLevelSite?.name} - ${departmentLevelDepartment?.name} - ${departmentLevelTitle?.title}`
    setDepartmentTitleValues([...departmentTitleValues, valueString]);
    let temp = sites;
    let siteDepartment = sites?.filter(data=>data?.id === departmentLevelSite?.id)?.map(data=>data?.department)[0];
    siteDepartment?.filter(dept=>dept?.id === departmentLevelDepartment?.id)?.map(dept=>{
      dept.title = departmentLevelTitle?.title;
      dept.title_id = departmentLevelTitle?.id;
    })
    temp?.filter(data=>data?.id === departmentLevelSite?.id)?.map(data=>{
      data.department = siteDepartment;
    })
    setSites(temp);
    setDepartmentLevelSite({id:'',name:''});
    setDepartmentLevelDepartment({id:'',name:''});
    setDepartmentLevelTitle({id:'',title:''});
  }

  console.log('site',siteLevelTitle, departmentLevelTitle);

  const handleSelectedDepartmentSite = (id) => {
    setDepartmentLevelSite({id:id,name:sites?.filter(data => data?.id === id)?.map(data => data?.name)[0]});
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
              "title": dept?.title,
              "id": dept?.title_id
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
        "title": data?.title,
        "id":data?.title_id
      }
    })
    })
    return siteData;
  }

  const getContractsData = () => {
    let isContractpresent = contracts?.filter(data=>data?.id === testContractId)?.map(data=>data)?.length || 0;
    let value = [];
    if(isContractpresent === 0){
      let temp = contracts !== null ? contracts : [];
      temp.push({
        "id": testContractId,
        "contractName": {
          "contractName": contractName
        },
        "roles":[],
        "sites":{
          "sites":getSiteData()
        },
        "siteLevelResponsible":siteLevel,
        "departmentLevelResponsible":departmentLevel,
      });
      setContracts(temp);
      value = temp;
    }else{
      let temp = contracts;
      temp?.filter(data=>data?.id === testContractId)?.map(data=>{
        data.roles = selectedRoles;
        let siteValue = {
          sites: getSiteData()
        }
        data.sites = siteValue;
        data.siteLevelResponsible = siteLevel;
        data.departmentLevelResponsible = departmentLevel;
      })
      setContracts(temp);
      value = temp;
    }
    return value;
  }

    const handleSave = async() => {
        const data = {
            ...(isUserPresent && {'id': userProviderData?.id}),
            "name": {
                "firstName": contractorFirstName,
                "lastName": contractorLastName,
                "suffix": contractorNameSuffix
              },
              "userType": "ADMIN",
              "contracts": getContractsData(),
              "title": {},
              "email": {
                "officialEmail": contractorEmail
              },
              ...( !isUserPresent && {"password": {
                "password": "string"
              }}),
              "communication": {
                "personalEmail": contractorEmail,
                "mobileNumber": contractorPhone,
                "landlineNumber": "string",
                "mobileNumberNotApplicable": true
              },
              "roles": userProviderData?.roles,
              "address": {
                "city": city,
                "state": state,
                "zipcode": zipCode
              },
              "tenant": {
                "tenantId": TenantID
              },
              "sites":  userProviderData?.sites,
              "serviceProviderType": serviceProviderType,
              "licenceDetails": {
                "medicalLicense": "",
                "licenseExpiryDate": "",
                "deaNumber": "",
                "deaExpiryDate": "",
                "boardCertification": [
                  "string"
                ]
              },
              "userProxy": {
                "myProxy": {
                  "proxyIdList": [
                    {
                      "id": "",
                      "name": ""
                    }
                  ]
                },
                "proxyFor": {
                  "proxyIdList": [
                    {
                      "id": "",
                      "name": ""
                    }
                  ]
                }
              },
              "activated": true,
              "blocked": true,
              "npin": {
                "missing": npinMissing,
                "notApplicable": npinNotApplicable,
                "npin": npin
              }
          }
          if(!isUserPresent){
            await POST('user-management-service/user/register', JSON.stringify(data))
            .then(response=>{
              SuccessToaster('User Added Successfully');
            })
            .catch(error=>{
                ErrorToaster('Unexpected Error');
            })
          }
          else{
            await PUT('user-management-service/user', JSON.stringify(data))
            .then(response=>{
              SuccessToaster('User Updated Successfully');
            })
            .catch(error=>{
                ErrorToaster('Unexpected Error');
            });
          }
    }

    const handleRoles = (value) => {
        if (value !== '0') {
          const selectedValue = roles.filter(data => data?.roleName === value).map(data => data)[0];
          if (!selectedRoles?.map(data => data?.roleName).includes(value)) {
            setSelectedRoles([...selectedRoles, selectedValue]);
          }
        }
    }

    const rolesTags = selectedRoles
    ?.filter(data => roles.map(role => role?.id === data?.id))
    ?.map((tag, index) => {
      const onRemove = () => {
        setSelectedRoles(selectedRoles.filter((t) => t?.roleName !== tag?.roleName)?.map(data=>data));
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
        data.title_id = '';
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
        data.title_id = '';
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

    return(
        <div className={style.cloneBlockStyle}>
            <div className={`${style.newContractFromCloneBoxStyle}`}>
              <div>
                <div className={`${style.extentionGrid}`}>
                <div className={style.extentionLableStyle}>Service Provider Type*</div>
                    <div className={style.grid3}>
                      <ProviderTypeList value={serviceProviderType?.id} onChangeFunc={(id,value)=>setServiceProviderType({id:id,contractedServiceProviderType:value})} className={[style.fullWidth]}/>
                    </div>
                  </div>
                  <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>NPIN*</div>
                      <div className={style.grid3}>
                      <InputGroup className={style.fullWidth}
                      placeholder="NPIN"
                      value={npin}
                      onChange={(e) => setNpin(e.target.value)}/>
                      <FormGroup>
                          <FormControlLabel control={<Checkbox value="Missing" checked={npinMissing} onChange={(e) => setNpinMissing(e.target.checked)} />} label="Missing" />
                      </FormGroup>
                      <FormGroup>
                          <FormControlLabel control={<Checkbox value="NA" checked={npinNotApplicable} onChange={(e) => setNpinNotApplicable(e.target.checked)} />} label="NA" />
                      </FormGroup>
                      </div>
                  </div>
                  <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Contractor Name*</div>
                      <div className={style.grid3}>
                          <InputGroup className={style.fullWidth} placeholder="First"
                          value={contractorFirstName}
                          onChange={(e) => setContractorFirstName(e.target.value)} />
                          <InputGroup className={style.fullWidth} placeholder="Middle"
                          value={contractorMiddleName}
                          onChange={(e) => setContractorMiddleName(e.target.value)}/>
                          <InputGroup className={style.fullWidth} placeholder="Last"
                          value={contractorLastName}
                          onChange={(e) => setContractorLastName(e.target.value)}/>
                      </div>
                  </div>
                  <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Suffix*</div>
                      <div className={style.grid3}>
                          <SuffixList value={contractorNameSuffix?.id} onChangeFunc={(id,value)=>setContractorNameSuffix({...contractorNameSuffix, id:id,suffix:value})} className={[style.fullWidth]}/>
                      </div>
                  </div>

                  <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Email Contractor id*</div>
                      <div className={style.displayInRow}>
                          <InputGroup placeholder="Enter entity specific email" className={`${style.entityFieldWidth}`}
                          value={contractorEmail}
                          onChange={(e) => setContractorEmail(e.target.value)}/>
                      </div>
                  </div>
                  <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Cell Phone*</div>
                      <div className={style.grid2}>
                      <InputGroup placeholder="Numeric" className={style.fullWidth}
                      value={contractorPhone}
                      onChange={(e) => setContractorPhone(e.target.value)}/>
                      </div>
                  </div>
                  <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Address*</div>
                      <div className={style.grid3}>
                      <InputGroup className={style.fullWidth} placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}/>
                      <InputGroup className={style.fullWidth} placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}/>
                      <InputGroup className={style.fullWidth} placeholder="Zipcode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}/>
                      </div>
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
                                    <FunctionalTitleList value={siteLevelTitle?.id} onChangeFunc={(id,value)=>setSiteLevelTitle({id:id,title:value})} className={[style.marginLeft20,style.weekSelectStyle]} providerId={serviceProviderType?.id}/>
                                </div>
                                <div className={`${style.addButtonPosition} ${style.marginTop20}`}>
                                  <Button variant="outlined" onClick={() => handleSiteLevelValues()}>Add</Button>
                                </div>
                                <TagInput
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
                                        <FunctionalTitleList value={departmentLevelTitle?.id} onChangeFunc={(id,value)=>setDepartmentLevelTitle({id:id,title:value})} className={[style.marginLeft20,style.weekSelectStyle]} providerId={serviceProviderType?.id}/>
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
                </div>

              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                   <div className={style.extentionLableStyle}>Assign Contractor With App User Role*</div>
                   <div className={`${style.reduce10Left} ${style.marginRight}`}>
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
                       <div className={`${style.marginTop20} ${style.marginLeft20}`}>
                       {rolesTags}
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

        </div>
    )
}

export default ContractedServicesProviderIndividual;
