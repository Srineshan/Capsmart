import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, Checkbox } from '@blueprintjs/core';
import style from './index.module.scss';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import {GET,PUT,POST,role,TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

const AddContractUser = ({getAddNewManagerDialog, contractType, getUserData, contractId, contractName}) => {
    const [selectedRole, setSelectedRole] = useState('Contract Manager');
    const [selectedRoles,setSelectedRoles] = useState([]);
    const [userData,setUserData] = useState({firstName:'',lastName:'',email:'',phone:''});
    const [serviceProviderType, setServiceProviderType] = useState('');
    const [roles,setRoles] = useState();
    const [npin, setNpin] = useState('');
    const [npinMissing, setNpinMissing] = useState(false);
    const [npinNotApplicable, setNpinNotApplicable] = useState(false);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const id = contractId;

    console.log('contract type',contractType);

    useEffect(()=>{
      getRolesData();
    },[])

    const getRolesData = async() => {
      const {data: roles} = await GET('user-management-service/roles');
      if(roles){
        setRoles(roles);
      }
    }

    const addUserAsContractor = async() => {
      let rolesData = [];
      if(selectedRole === 'Contract Manager'){
        rolesData = roles?.filter(data=>data.roleName === 'Contract Manager')?.map(data=>data);
      }else{
        rolesData = roles?.filter(data=>selectedRoles.includes(data.roleName))?.map(data=>data);
      }

      if(userData?.firstName !== '' && userData?.lastName !== '' && userData?.email !== '' && userData?.phone !== '' && rolesData?.length !== 0){
        await POST('user-management-service/user/register',JSON.stringify({
          "name": {
            "firstName": userData.firstName,
            "lastName": userData.lastName,
            "suffix": ""
          },
          "contracts": [],
            "title": {
              "title": ""
            },
            "address": {
                  "city": city,
                  "state": state,
                  "zipcode": zipCode
            },
          // "contractType": {
          //   "contractType": contractType
          // },
          // "contractID": {
          //   "contractID": id
          // },
          "email": {
            "officialEmail": userData.email
          },
          "password": {
            "password": "admin123"
          },
          "communication": {
            "personalEmail": userData.email,
            "mobileNumber": userData.phone,
            "landlineNumber": ""
          },
          "serviceProviderType": serviceProviderType,
          "npin": {
                "missing": npinMissing,
                "notApplicable": npinNotApplicable,
                "npin": npin
              },
          "roles": rolesData,
          "tenant": {
            "tenantId": TenantID
          },
      }
      ))
      .then(response=>{
        SuccessToaster('User Added Successfully');
      })
      .catch(error=>{
        ErrorToaster('Adding User Failed');
      })
      getAddNewManagerDialog(false);
      getUserData();
    }else{
      ErrorToaster('All Fields are Mandatory');
    }
  }

    return(
        <Dialog isOpen={getAddNewManagerDialog} onClose={() => getAddNewManagerDialog(false)} className={`${style.addManagerDialogStyle} ${style.addManagerDialogBackground}`}>
          <div className={`${Classes.DIALOG_BODY} `}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Add New User As Contractor</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getAddNewManagerDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Name*</div>
                    <div className={style.displayInRow}>
                        <InputGroup value={userData.firstName} placeholder="First Name" onChange={(e)=>setUserData({...userData, firstName:e.target.value})}/>
                        <InputGroup value={userData.lastName} placeholder="Last Name" onChange={(e)=>setUserData({...userData, lastName:e.target.value})} className={style.marginLeft20} />
                    </div>
                </div>
              <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Service Provider Type*</div>
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

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Email*</div>
                    <InputGroup value={userData.email} placeholder="email@gmail.com" onChange={(e)=>setUserData({...userData, email:e.target.value})} />
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Cell</div>
                    <InputGroup value={userData.phone} placeholder="+14844608104" onChange={(e)=>setUserData({...userData, phone:e.target.value})} />
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                   <div className={style.extentionLableStyle}>NPIN*</div>
                   <div className={style.grid3}>
                   <InputGroup className={style.fullWidth}
                   placeholder="NPIN"
                   value={npin}
                   onChange={(e) => setNpin(e.target.value)}/>
                   <Checkbox value="Missing" checked={npinMissing} onChange={(e) => setNpinMissing(e.target.checked)} className={style.marginTop} label="Missing" />
                   <Checkbox value="NA" checked={npinNotApplicable} onChange={(e) => setNpinNotApplicable(e.target.checked)} className={style.marginTop}  label="NA" />
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
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Role*</div>
                    <div>
                    {
                      // <div className={style.reduce10Left}>
                      //     <select
                      //         name="class"
                      //         id="Class"
                      //         value={selectedRole || 'Select...'}
                      //         onChange={(e) => setSelectedRole(e.target.value)}
                      //         className={`${style.fullWidth} ${style.marginLeft20} `}>
                      //             <option value="Contract Manager" >
                      //             Contract Manager
                      //             </option>
                      //             <option value="User" >
                      //             User
                      //             </option>
                      //     </select>
                      // </div>

                      // {selectedRole === "User" && (
                      // <div className={`${style.roleBoxStyle} ${style.marginLeft20} ${style.floatRight}`}>
                      // {
                      //   roles?.map(data=>(
                      //     <Checkbox label={data.roleName} onChange={(e)=>setSelectedRoles([...selectedRoles,data.roleName])} />
                      //   ))
                      // }
                      // </div>
                      // )}
                    }
                    <div className={`${style.roleBoxStyle} ${style.marginLeft20} ${style.floatRight}`}>
                    {
                      roles?.map(data=>(
                        <Checkbox label={data.roleName} onChange={(e)=>setSelectedRoles([...selectedRoles,data.roleName])} />
                      ))
                    }
                    </div>

                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={()=>addUserAsContractor()}>SAVE</button>
                    </div>
                </div>
            </div>



        </Dialog>
    )
}

export default AddContractUser;
