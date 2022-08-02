import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {GET, PUT, POST, TenantID} from './../dataSaver';
import style from './index.module.scss';

const NewServiceProvider = ({getNewServiceProviderDialog}) => {
    const [selectedContract, setSelectedContract] = useState('Written Contract Extension For Fixed Term');
    const [startDate, setStartDate] = useState(new Date);
    const [terminationTrigger, setTerminationTrigger] = useState('Contract Expiration');
    const [roles,setRoles] = useState([]);
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

    const getRolesData = async() => {
      const {data: rolesData} = await GET(`user-management-service/roles`);
      if(rolesData){
        console.log('roles',rolesData);
        setRoles(rolesData);
      }
    }

    const handleUserData = (name,value) => {
      setUserDetails({...userDetails, [name]:value});
    }

    const handleAddress = (name,value) => {
      setAddress({...address, [name]:value});
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
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>NPIN*</div>
                    <div className={style.grid3}>
                    <InputGroup className={style.fullWidth} value={npin?.npin} onChange={(e)=>setNpin({npin:e.target.value,na:false,missing:false})}/>
                    <RadioGroup
                        inline={true}
                        className={`${style.marginTop}`}
                    >
                        <Radio label="Missing" value="Missing" checked onChange={(e)=>setNpin({npin:'',missing:e.target.checked,na:false})}/>
                    </RadioGroup>
                    <RadioGroup
                        inline={true}
                        className={`${style.marginTop} ${style.reduce30Left}`}
                    >
                        <Radio label="Not Available" value="Not Available" onChange={(e)=>setNpin({npin:'',missing:false,na:e.target.checked})}/>
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
                    <div className={style.extentionLableStyle}>Contractor Name*</div>
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
                    <select
                        name="class"
                        id="Class"
                        className={style.fullWidth}>
                            <option value="Select Role" >
                            Select Role...
                            </option>
                            {
                              roles?.map(data=>{
                                <option value={data?.roleName} >
                                {data?.roleName}
                                </option>
                              })
                            }
                    </select>
                </div>
            </div>
            <div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={`${style.buttonStyle}`}>ADD MORE</button>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE & EXIT</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default NewServiceProvider;
