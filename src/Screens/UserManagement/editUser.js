import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, Tag } from '@blueprintjs/core';
import {GET, PUT} from './userDataSaver';
import style from './index.module.scss';

const EditUser = ({getEditUserDialog, selectedUsers}) => {

  const [userData, setUserData] = useState(selectedUsers);
  const [blockedData, setBlockedData] = useState(selectedUsers);

  console.log(selectedUsers, userData)

  const [roles, setRoles] = useState([])
    const [selectedRoles, setSelectedRoles] = useState([])

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

    const getRoles = async() => {
      const {data: roles} = await GET('roles');
      setRoles(roles);
    };

    useEffect(()=>{
      getRoles();
  },[])

    console.log(roles, selectedRoles)

  const submitUserDetails = async () => {
    await PUT('user', JSON.stringify(userData));
    getEditUserDialog(false);
  }

  const handleUserBlockDetails = async () => {
    await PUT('user', JSON.stringify({...blockedData, blocked: true}));
    getEditUserDialog(false);
  }

    return(
        <Dialog isOpen={getEditUserDialog} onClose={() => getEditUserDialog(false)} className={`${style.addManagerDialogBackground} ${style.addProofDialog}`}>
          <div className={`${Classes.DIALOG_BODY} `}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Edit User</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getEditUserDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.proofBorder}>
            <div className={`${style.addManagerGrid}`}>
                <div className={style.extentionLableStyle}>Customer Type*</div>
                <div className={`${style.reduce10Left} ${style.marginRight}`}>
                    <select
                        name="class"
                        id="Class"
                        className={`${style.fullWidth} ${style.marginLeft20} `}>

                            <option value="Select Customer Type" >
                              Select Customer Type
                            </option>
                    </select>
                  </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20} ${style.displayInRow}`}>
              <div className={style.extentionLableStyle}>Customer Name*</div>
              <div className={style.displayInRow}>
              <InputGroup value={userData?.name?.firstName} className = {style.fieldWidth2InARow} onChange={(e) => setUserData({...userData, name: {firstName: e.target.value, lastName: userData?.name?.lastName, suffix: userData?.name?.suffix}})} />
              <InputGroup value={userData?.name?.lastName} className = {`${style.fieldWidth2InARow} ${style.marginLeft20}`} onChange={(e) => setUserData({...userData, name:{firstName: userData?.name?.firstName, lastName: e.target.value, suffix: userData?.name?.suffix}})} />
              </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
              <div className={style.extentionLableStyle}>Email Address*</div>
              <InputGroup value={userData?.email?.officialEmail} onChange={(e) => setUserData({...userData, email: {officialEmail: e.target.value}})} />
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Department*</div>
                <div className={`${style.reduce10Left} ${style.marginRight}`}>
                    <select
                        name="class"
                        id="Class"
                        className={`${style.fullWidth} ${style.marginLeft20} `}>

                            <option value="Select Department" >
                              Select Department
                            </option>
                    </select>
                  </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Role*</div>
                <div className={`${style.reduce10Left} ${style.marginRight}`}>
                    <select
                        name="class"
                        id="Class"
                        value={userData?.roles}
                        onChange={(e) => handleRoles(e.target.value)}
                        className={`${style.fullWidth} ${style.marginLeft20} `}>
                            <option value="Select Role-multi select" >
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

            <div className={`${style.addManagerGrid}`}>
              <div className={style.extentionLableStyle}>Title*</div>
              <InputGroup value={userData?.title?.title} onChange={(e) => setUserData({...userData, title: {title: e.target.value}})} />
            </div>

        </div>

            <div className={` ${style.marginTop20}`}>
            <button className={`${style.outlinedButton} ${style.marginLeft20}`} onClick={() => handleUserBlockDetails()}>BLOCK</button>
            <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => getEditUserDialog(false)} >DEACTIVATE</button>
            <button className={`${style.buttonStyle} ${style.marginLeft20} ${style.floatRight}`} onClick={() => submitUserDetails()}>UPDATE</button>
            </div>
        </div>
        </Dialog>
    )
}

export default EditUser;
