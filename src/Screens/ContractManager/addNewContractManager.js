import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, Checkbox } from '@blueprintjs/core';
import style from './index.module.scss';
import {GET,PUT,POST,role,TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

const AddNewContractManager = ({getAddNewManagerDialog, contractType, getUserData, contractId}) => {
    const [selectedRole, setSelectedRole] = useState('Contract Manager');
    const [selectedRoles,setSelectedRoles] = useState([]);
    const [userData,setUserData] = useState({firstName:'',lastName:'',email:'',phone:''});
    const [roles,setRoles] = useState();
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

    const addUserAsManager = async() => {
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
          "contractType": {
            "contractType": contractType
          },
          "contractID": {
            "contractID": id
          },
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
        ErrorToaster('Adding User Faield');
      })
      getAddNewManagerDialog(false);
      getUserData();
    }else{
      ErrorToaster('All Fields are Mandatory');
    }
  }


    console.log('roles',roles);

    return(
        <Dialog isOpen={getAddNewManagerDialog} onClose={() => getAddNewManagerDialog(false)} className={`${style.addManagerDialogStyle} ${style.addManagerDialogBackground}`}>
          <div className={`${Classes.DIALOG_BODY} `}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Add New User As Contract Manager</p>
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
                    <div className={style.extentionLableStyle}>Email*</div>
                    <InputGroup value={userData.email} placeholder="email@gmail.com" onChange={(e)=>setUserData({...userData, email:e.target.value})} />
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Cell</div>
                    <InputGroup value={userData.phone} placeholder="+14844608104" onChange={(e)=>setUserData({...userData, phone:e.target.value})} />
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Role*</div>
                    <div>
                    <div className={style.reduce10Left}>
                        <select
                            name="class"
                            id="Class"
                            value={selectedRole || 'Select...'}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className={`${style.fullWidth} ${style.marginLeft20} `}>
                                <option value="Contract Manager" >
                                Contract Manager
                                </option>
                                <option value="User" >
                                User
                                </option>
                        </select>
                    </div>
                    {selectedRole === "User" && (
                    <div className={`${style.roleBoxStyle} ${style.marginLeft20} ${style.floatRight}`}>
                    {
                      roles?.map(data=>(
                        <Checkbox label={data.roleName} onChange={(e)=>setSelectedRoles([...selectedRoles,data.roleName])} />
                      ))
                    }
                    </div>
                    )}
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={()=>addUserAsManager()}>SAVE</button>
                    </div>
                </div>
            </div>



        </Dialog>
    )
}

export default AddNewContractManager;
