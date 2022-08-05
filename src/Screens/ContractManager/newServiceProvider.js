import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, Tag, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {GET, PUT, POST, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

import style from './index.module.scss';

const NewServiceProvider = ({getNewServiceProviderDialog}) => {
    const contractId = window.location.hash.substr(1);
    const [selectedContract, setSelectedContract] = useState('Written Contract Extension For Fixed Term');
    const [startDate, setStartDate] = useState(new Date);
    const [terminationTrigger, setTerminationTrigger] = useState('Contract Expiration');
    const [roles,setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [npin,setNpin] = useState({npin:'',missing:false,na:false});
    const [userDetails,setUserDetails] = useState({firstName:'',middleName:'',lastName:'',suffix:'',email:'',phone:''});
    const [providerType,setProviderType] = useState('');
    const [address,setAddress] = useState({city:'',state:'',zipcode:''});
    const [siteLevel,setSiteLevel] = useState(false);
    const [deptLevel,setDeptLevel] = useState(false);

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
    },[])

    const handleRoles = (value) => {
        if (value !== '0') {
          const selectedValue = roles.filter(data => data?.roleName === value).map(data => data)[0];

          if (!selectedRoles.map(data => data?.roleName).includes(value)) {
            setSelectedRoles([...selectedRoles, selectedValue]);
          }
        }
    }

    const rolesTags = selectedRoles
    .filter(data => roles.map(role => role).includes(data))
    .map((tag, index) => {
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
        console.log('roles',roles);
        setRoles(roles);
      }
    }

    const handleUserData = (name,value) => {
      setUserDetails({...userDetails, [name]:value});
    }

    const handleAddress = (name,value) => {
      setAddress({...address, [name]:value});
    }

    const handleSave = async() => {
        const data = {
            "name": {
                "firstName": userDetails?.firstName,
                "lastName": userDetails?.lastName,
                "suffix": userDetails?.suffix
              },
              "userType": "ADMIN",
              "contracts": [
                {
                  "id": contractId,
                  "contractName": {
                    "contractName": "Sample Contract 2"
                  }
                }
              ],
              "title": {
                "title": "string"
              },
              "email": {
                "officialEmail": userDetails?.email
              },
              "password": {
                "password": "string"
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
              "serviceProviderType": providerType,
              "licenceDetails": {
                "medicalLicense": "string",
                "licenseExpiryDate": "2022-07-26",
                "deaNumber": "string",
                "deaExpiryDate": "2022-07-26",
                "boardCertification": [
                  "string"
                ]
              },
              "userProxy": {
                "myProxy": {
                  "proxyIdList": [
                    {
                      "id": "string",
                      "name": "string"
                    }
                  ]
                },
                "proxyFor": {
                  "proxyIdList": [
                    {
                      "id": "string",
                      "name": "string"
                    }
                  ]
                }
              },
              "activated": true,
              "siteLevelResponsible": siteLevel,
              "departmentLevelResponsible": deptLevel,
              "blocked": false,
              "npin": {
                "missing": npin?.missing,
                "notApplicable": npin.na,
                "npin": npin?.npin
              }
          }
          const response = await POST('user-management-service/user/register', JSON.stringify(data));
            if(response){
                SuccessToaster('User Added Successfully');
            }
            else {
                ErrorToaster('Unexpected Error');
            }

          console.log(data)
    }

    console.log(roles)

    return(
        <Dialog isOpen={getNewServiceProviderDialog} onClose={() => getNewServiceProviderDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>New Service Provider</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getNewServiceProviderDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={`${style.serviceBoxStyle}`}>
                <div className={`${style.extentionGrid}`}>
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
                    <div className={style.extentionLableStyle}>Contractor Name*</div>
                    <div className={style.grid3}>
                    <InputGroup className={style.fullWidth} value={userDetails?.firstName} placeholder="First" onChange={(e)=>handleUserData('firstName',e.target.value)}/>
                    <InputGroup className={style.fullWidth} value={userDetails?.middleName} placeholder="Middle" onChange={(e)=>handleUserData('middleName',e.target.value)}/>
                    <InputGroup className={style.fullWidth} value={userDetails?.lastName} placeholder="Last" onChange={(e)=>handleUserData('lastName',e.target.value)}/>
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
                    <div className={style.extentionLableStyle}>Email Contractor id*</div>
                    <div className={style.displayInRow}>
                        <InputGroup placeholder="Enter entity specific email" value={userDetails?.email} className={`${style.entityFieldWidth}`} onChange={(e)=>handleUserData('email',e.target.value)}/>
                        {
                          // <RadioGroup
                          //     inline={true}
                          //     className={`${style.marginTop} ${style.marginLeft20}`}
                          // >
                          //     <Radio label="Not Available" value="Not Available" />
                          // </RadioGroup>
                        }
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Cell Phone*</div>
                    <div className={style.grid2}>
                    <InputGroup placeholder="Numeric" value={userDetails?.phone} className={style.fullWidth} onChange={(e)=>handleUserData('phone',e.target.value)}/>
                    {
                      // <RadioGroup
                      //     inline={true}
                      //     className={`${style.marginTop} ${style.leftAlign}`}
                      //     selectedValue={"Missing"}
                      // >
                      //     <Radio label="Not Available" value="Not Available" />
                      // </RadioGroup>
                    }
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
                        <FormControlLabel
                            control={
                                <Switch className={` ${style.textAlignLeft}`} />
                            }
                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                            label={siteLevel?"YES":"NO"}
                            onChange={()=>setSiteLevel(!siteLevel)}
                        />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Department Level Responsibility*</div>
                    <div>
                        <FormControlLabel
                            control={
                                <Switch className={` ${style.textAlignLeft}`}  />
                            }
                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                            label={deptLevel?"YES":"NO"}
                            onChange={()=>setDeptLevel(!deptLevel)}
                        />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Assign Contractor With App User Role*</div>
                    <div>
                    <select
                        name="class"
                        id="Class"
                        onChange={(e) => handleRoles(e.target.value)}
                        className={style.fullWidth}>
                            <option value="Select Role" >
                            Select Role...
                            </option>
                            {
                              roles?.map((data, index)=>(
                                <option key={index} value={data?.roleName} >
                                {data?.roleName}
                                </option>
                              ))
                            }
                    </select>
                    <div className={`${style.marginTop20} ${style.marginLeft20}`}>{rolesTags}</div>
                    </div>
                </div>
            </div>
            <div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={`${style.buttonStyle}`} onClick={() => handleSave()}>ADD MORE</button>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE & EXIT</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default NewServiceProvider;
