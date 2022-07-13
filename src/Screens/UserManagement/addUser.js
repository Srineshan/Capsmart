import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, Tag} from '@blueprintjs/core';
import {POST, GET, TenantID} from './userDataSaver';
import style from './index.module.scss';

const AddUser = ({getAddUserDialog}) => {

    const [addUser, setAddUser] = useState({firstName: "", lastName: "", email: "", roles: [{id: "", roleName: ""}], title: ""});
    console.log(addUser)
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

    console.log(roles, selectedRoles)

    const submitUserDetails = async () => {

      const user = {
        "name": {
          "firstName": addUser?.firstName,
          "lastName": addUser?.lastName,
          "suffix": "string"
        },
        "userType": "ADMIN",
        "contractType": {
          "contractType": "string"
        },
        "contractID": {
          "contractID": "string"
        },
        "title": {
          "title": addUser?.title
        },
        "email": {
          "officialEmail": addUser?.email
        },
        "password": {
          "password": "string"
        },
        "communication": {
          "personalEmail": "string",
          "mobileNumber": "string",
          "landlineNumber": "string"
        },
        "roles": selectedRoles,
        "address": {
          "city": "string",
          "state": "string",
          "zipcode": "string"
        },
        "tenant": {
          "tenantId": TenantID
        },
        "sites": {
          "sites": [{
            "id": "string",
            "siteName": {
              "siteName": "string"
            }
          }]
        },
        "licenceDetails": {
          "medicalLicense": "string",
          "licenseExpiryDate": "2022-05-29",
          "deaNumber": "string",
          "deaExpiryDate": "2022-05-29",
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
        "blocked": false
      };

      await POST('user/register', JSON.stringify(user));
      getAddUserDialog(false)
    }

    const getRoles = async() => {
      const {data: roles} = await GET('roles');
      setRoles(roles);
    };

    useEffect(()=>{
      getRoles();
  },[])

    return(
        <Dialog isOpen={getAddUserDialog} onClose={() => getAddUserDialog(false)} className={`${style.addManagerDialogBackground} ${style.addProofDialog}`}>
          <div className={`${Classes.DIALOG_BODY} `}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Add User</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getAddUserDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.proofBorder}>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
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
              <div className={style.extentionLableStyle}>User Name*</div>
              <div className={style.displayInRow}>
              <InputGroup value={addUser?.firstName} className = {style.fieldWidth2InARow} onChange={(e) => setAddUser({...addUser, firstName: e.target.value})} />
              <InputGroup value={addUser?.lastName} className = {`${style.fieldWidth2InARow} ${style.marginLeft20}`} onChange={(e) => setAddUser({...addUser, lastName: e.target.value})} />
              </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
              <div className={style.extentionLableStyle}>Email Address*</div>
              <InputGroup value={addUser?.email} onChange={(e) => setAddUser({...addUser, email: e.target.value})} />
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
              <div className={style.extentionLableStyle}>Title*</div>
              <InputGroup value={addUser?.title} onChange={(e) => setAddUser({...addUser, title: e.target.value})} />
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Role*</div>
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
            <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => submitUserDetails()} >ADD</button>
            </div>
        </div>
        </Dialog>
    )
}

export default AddUser;
