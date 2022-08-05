import React, {useState, useEffect} from 'react';
import { InputGroup, RadioGroup, Radio, Tag, TagInput } from '@blueprintjs/core';
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
  const VALUES2 = ['Site 1 - Department 1 - Title 1', "Site 2 - Department 2 - Title 2", "Site 3 - Department 3 - Title 3"];
  let siteTitleValues = [];
  let departmentTitleValues = [];
const ContractedServicesProviderIndividual = ({getViewPage3, getCurrentPage, contractId}) => {
    const testContractId = contractId;
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
    const [siteLevelSite, setSiteLevelSite] = useState('');
    const [departmentLevelSite, setDepartmentLevelSite] = useState('');
    const [roles, setRoles] = useState([])
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [tags, setTags] = useState(VALUES);
    const [tagSet2, setTagSet2] = useState(siteTitleValues);
    const [tagSet3, setTagSet3] = useState(departmentTitleValues);
    const id = contractId;
    const [contractData, setContractData] = useState([])
    const [userProviderData, setUserProviderData] = useState({});
    const [isUserPresent,setIsUserPresent] = useState(false);

    useEffect(()=>{
        getRoles();
        getUserData();
    },[])

    useEffect(() => {
      setTagSet2(siteTitleValues);
    }, [siteTitleValues])

    useEffect(() =>{
      console.log('above if');
      if(isUserPresent) {
        console.log('in if');
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
        setSiteLevel(userProviderData?.siteLevelResponsible);
        setDepartmentLevel(userProviderData?.departmentLevelResponsible);
        setSelectedRoles(userProviderData?.roles);
      }
    }, [contractId, userProviderData])

    useEffect(()=>{
      setIsUserPresent(userProviderData?.length !== 0? true:false);
    })

    const getUserData = async() => {
      const {data: userData} = await GET(`user-management-service/user?contractID=${testContractId}`);
      if(userData){
        setUserProviderData(userData[0]);
        setIsUserPresent(userData?.length !== 0 ? true : false);
      }
    }
    const [siteList, setSiteList] = useState([
      {
        "id": "1",
        "departmentList": {
          "departments": [
            {
              "id": "string",
              "departmentName": {
                "departmentName": "departmet 11"
              }
            }
          ]
        },
        "siteName": {
          "siteName": "Site 1"
        }
      },
      {
        "id": "2",
        "departmentList": {
          "departments": [
            {
              "id": "string",
              "departmentName": {
                "departmentName": "departmet 21"
              }
            }
          ]
        },
        "siteName": {
          "siteName": "Site 2"
        }
      },
      {
        "id": "3",
        "departmentList": {
          "departments": [
            {
              "id": "string",
              "departmentName": {
                "departmentName": "departmet 31"
              }
            }
          ]
        },
        "siteName": {
          "siteName": "Site 3"
        }
      }
  ])
  const [possibleDepartments, setPossibleDepartments] = useState([])
  const [selectedDepartmentSpecificSite, setSelectedDepartmentSpecificSite] = useState([]);

  const titleList = ['Title 1', 'Title 2', 'Title 3'];
    const getContractDetail = async() => {
      const {data: contractData} = await GET(`contract-managment-service/contracts/${id}/contractDetail`);
      setContractData(contractData);
    }
    console.log(contractData)

    const getTagProps = (_v, index) => ({
      minimal: true,
  });

  const handleTagSet2Add = values => {
      setTagSet2([...tags, values]);
  };

  const handleTagSet3Add = values => {
    setTagSet3([...tagSet3, values]);
};

  const handleTagSet2Remove = (tags, index) => {
    const updatedTags = [tags];
    updatedTags.splice(index, 1);
    tags = updatedTags;
    setTagSet2(tags);
  };

  const handleTagSet3Remove = (tags, index) => {
    const updatedTags = [tags];
    updatedTags.splice(index, 1);
    tags = updatedTags;
    setTagSet3(tags);
  };

  const handleSiteLevelValues = () => {
    siteTitleValues?.push(`${siteLevelSite} - ${siteLevelTitle}`);
    setSiteLevelSite('');
    setSiteLevelTitle('');
  }

  const handleDepartmentLevelValues = () => {
    departmentTitleValues?.push(`${departmentLevelSite} - ${departmentLevelDepartment} - ${departmentLevelTitle}`);
    setDepartmentLevelSite('');
    setDepartmentLevelDepartment('');
    setDepartmentLevelTitle('');
    console.log(departmentTitleValues)
  }

  const handleSelectedDepartmentSite = (id) => {
    setSelectedDepartmentSpecificSite(siteList?.filter(data => data?.id === id)?.map(data => data));
    setDepartmentLevelSite(siteList?.filter(data => data?.id === id)?.map(data => data?.id));
    setPossibleDepartments(siteList?.filter(data => data?.id === id)?.map(data => data?.departmentList?.departments)?.[0])
    console.log(selectedDepartmentSpecificSite, departmentLevelSite, possibleDepartments)
  }

  console.log('userProviderData',userProviderData);

    const handleSave = async() => {
        const data = {
            ...( isUserPresent && {'id': userProviderData?.id}),
            "name": {
                "firstName": contractorFirstName,
                "lastName": contractorLastName,
                "suffix": contractorNameSuffix
              },
              "userType": "ADMIN",
              "contracts": [
                {
                  "id": testContractId,
                  "contractName": {
                    "contractName": "Sample Contract 2"
                  }
                }
              ],
              "title": {
                "title": "string"
              },
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
              "roles": selectedRoles,
              "address": {
                "city": city,
                "state": state,
                "zipcode": zipCode
              },
              "tenant": {
                "tenantId": TenantID
              },
              "sites": {
                "sites": [
                  {
                    "id": "string",
                    "siteName": {
                      "siteName": "string"
                    },
                    "departmentList": {
                      "departments": [
                        {
                          "id": "string",
                          "departmentName": {
                            "name": "string"
                          },
                          "departmentHead": {
                            "id": "string"
                          },
                          "departmentResponsibility": {
                            "title": "string"
                          }
                        }
                      ]
                    },
                    "siteResponsibility": {
                      "title": "string"
                    }
                  }
                ]
              },
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
              "siteLevelResponsible": siteLevel,
              "departmentLevelResponsible": departmentLevel,
              "blocked": true,
              "npin": {
                "missing": npinMissing,
                "notApplicable": npinNotApplicable,
                "npin": npin
              }
          }
          if(isUserPresent){
            const response = await PUT('user-management-service/user', JSON.stringify(data));
            if(response){
                SuccessToaster('User Updated Successfully');
            }
            else {
                ErrorToaster('Unexpected Error');
            }
          } else {
            const response = await POST('user-management-service/user/register', JSON.stringify(data));
            if(response){
              SuccessToaster('User Added Successfully');
            }
            else {
                ErrorToaster('Unexpected Error');
            }
          }

          console.log(data)
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

    console.log(roles)


    console.log(siteTitleValues, tagSet2, siteLevelSite, siteLevelTitle)



    return(
        <div className={style.cloneBlockStyle}>
            <div className={`${style.newContractFromCloneBoxStyle}`}>
            <div className={`${style.extentionGrid}`}>
                <div className={style.extentionLableStyle}>Service Provider Type*</div>
                    <div className={style.grid3}>
                        <select
                            name="class"
                            id="Class"
                            value={serviceProviderType}
                            onChange={(e) => setServiceProviderType(e.target.value)}
                            className={style.fullWidth}>
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
                        <select
                            name="class"
                            id="Class"
                            value={contractorNameSuffix}
                            onChange={(e) => setContractorNameSuffix(e.target.value)}
                            className={style.fullWidth}>
                                <option value="Text" >
                                Text
                                </option>
                        </select>
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
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Site Level Responsibility*</div>
                    <div>
                        <div className={style.flexLeft}>
                            <FormControlLabel
                                control={
                                    <Switch checked={siteLevel} className={`${style.flexLeft}`} onChange={() => setSiteLevel(!siteLevel)}  />
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
                                            value={siteLevelSite}
                                            onChange={(e) => setSiteLevelSite(e.target.value)}
                                            className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                <option value="Select Site" >
                                                Select Site
                                                </option>
                                                {siteList?.map((data, index) => (
                                                  <option key={index} value={data?.siteName?.siteName}>
                                                    {data?.siteName?.siteName}
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
                                    values={tagSet2}
                                    className={`${style.marginTop20}`}
                                    // onAdd={handleTagSet2Add}
                                    onRemove={handleTagSet2Remove}
                                    separator={/[\s,]/}
                                    addOnBlur={true}
                                    addOnPaste={true}
                                    tagProps={getTagProps}
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
                                    <Switch checked={departmentLevel} className={`${style.flexLeft}`} onChange={() => setDepartmentLevel(!departmentLevel)}  />
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
                                            value={departmentLevelSite}
                                            onChange={(e) => handleSelectedDepartmentSite(e.target.value)}
                                            className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                <option value="Select Site" >
                                                Select Site
                                                </option>
                                                {siteList?.map((data, index) => (
                                                  <option key={index} value={data?.id}>
                                                    {data?.siteName?.siteName}
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
                                            value={departmentLevelDepartment}
                                            onChange={(e) => setDepartmentLevelDepartment(e.target.value)}
                                            className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                <option value="Select Department" >
                                                Select Department
                                                </option>
                                                {possibleDepartments?.map((data, index) => (
                                                  <option key={index} value={data?.id}>
                                                    {data?.departmentName?.departmentName}
                                                  </option>
                                                ))}
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
                                        values={tagSet3}
                                        className={`${style.marginTop20}`}
                                        // onAdd={handleTagSet3Add}
                                        onRemove={handleTagSet3Remove}
                                        separator={/[\s,]/}
                                        addOnBlur={true}
                                        addOnPaste={true}
                                        tagProps={getTagProps}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Assign Contractor With App User Role*</div>
                    {/* <div>
                        <FormControl sx={{ width: '100%'}}>
                            <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={personName}
                            onChange={(e) => handleRoles(e.target.value)}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }} className={style.selectMultipleCheckbox}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                            >
                            {roles.map((role) => (
                                <MenuItem
                                key={role?.id}
                                value={role?.roleName}
                                style={getStyles(role, personName, theme)}
                                >
                                    <Checkbox checked={personName.indexOf(role) > -1} />
                                    <ListItemText primary={role?.roleName} />
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </div> */}
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
