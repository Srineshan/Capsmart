import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, } from '@blueprintjs/core';
import {PUT} from './userDataSaver';
import style from './index.module.scss';

const EditUser = ({getEditUserDialog, selectedUsers}) => {

  const [userData, setUserData] = useState(selectedUsers);

  console.log(selectedUsers, userData)

  const submitUserDetails = async () => {

      const user = {
        "id": "string",
        "name": {
          "firstName": "string",
          "lastName": "string",
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
          "title": "string"
        },
        "email": {
          "officialEmail": "string"
        },
        "password": {
          "password": "string"
        },
        "communication": {
          "personalEmail": "string",
          "mobileNumber": "string",
          "landlineNumber": "string"
        },
        "roles": [
          {
            "id": "string",
            "roleName": "string",
            "roleDescription": "string",
            "tenant": {
              "tenantId": "string"
            }
          }
        ],
        "address": {
          "city": "string",
          "state": "string",
          "zipcode": "string"
        },
        "tenant": {
          "tenantId": "string"
        },
        "sites": {
          "sites": [
            {
              "id": "string",
              "siteName": {
                "siteName": "string"
              }
            }
          ]
        },
        "licenceDetails": {
          "medicalLicense": "string",
          "licenseExpiryDate": "2022-07-10",
          "deaNumber": "string",
          "deaExpiryDate": "2022-07-10",
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
        "blocked": true
      };

      await PUT('user', JSON.stringify(user));
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
              <div className={style.extentionLableStyle}>Customer Name*</div>
              <div className={style.displayInRow}>
              <InputGroup value={userData?.name?.firstName} className = {style.fieldWidth2InARow} />
              <InputGroup value={userData?.name?.lastName} className = {`${style.fieldWidth2InARow} ${style.marginLeft20}`} />
              </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
              <div className={style.extentionLableStyle}>Email Address*</div>
              <InputGroup value={userData?.email?.officialEmail} />
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
                        className={`${style.fullWidth} ${style.marginLeft20} `}>
                            <option value="Select Role-multi select" >
                              Select Role-multi select
                            </option>
                    </select>
                  </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
              <div className={style.extentionLableStyle}>Title*</div>
              <InputGroup value="Title" />
            </div>

        </div>

            <div className={` ${style.marginTop20}`}>
            <button className={`${style.outlinedButton} ${style.marginLeft20}`} >BLOCK</button>
            <button className={`${style.buttonStyle} ${style.marginLeft20}`} >DEACTIVATE</button>
            <button className={`${style.buttonStyle} ${style.marginLeft20} ${style.floatRight}`} >ADD</button>
            </div>
        </div>
        </Dialog>
    )
}

export default EditUser;
