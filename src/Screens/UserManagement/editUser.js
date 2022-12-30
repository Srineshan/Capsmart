import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, Tag } from '@blueprintjs/core';
import {GET, PUT} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import style from './index.module.scss';

const EditUser = ({getEditUserDialog, selectedUsers}) => {

  const [userData, setUserData] = useState(selectedUsers);
  const [blockedData, setBlockedData] = useState(selectedUsers);

  const [roles, setRoles] = useState([])
  const [department, setDepartment] = useState([])
  const [sites, setSites] = useState([])

    const [selectedRoles, setSelectedRoles] = useState(userData?.roles)
    const [selectedDepartments, setSelectedDepartments] = useState(selectedUsers?.sites?.sites[0]?.departmentList?.departments)
    const [selectedSites, setSelectedSites] = useState(selectedUsers?.sites?.sites)

    const handleRoles = (value) => {
      if (value !== '0') {
        const selectedValue = roles.filter(data => data?.roleName === value).map(data => data)[0];

        if (!selectedRoles.map(data => data?.roleName).includes(value)) {
          setSelectedRoles([...selectedRoles, selectedValue]);
        }
        setUserData({...userData, roles: [...selectedRoles, selectedValue]})}
    }


    const handleSites = (value) => {
      if (value !== '0') {
        const tempSelectedSites = sites.filter(data => data?.siteName?.siteName === value).map(data => data)[0];

        if (!selectedSites.map(data => data?.id).includes(tempSelectedSites?.id)) {
          setSelectedSites([...selectedSites, tempSelectedSites]);
        }
        setUserData({...userData, sites: {
          "sites": [...selectedSites, tempSelectedSites]
        }})
        console.log(selectedSites, tempSelectedSites)
      }
    }

    const rolesTags = selectedRoles
    .filter(data => roles.map(role => role?.id === data?.id))
    .map((tag, index) => {
      const onRemove = () => {
        setSelectedRoles(selectedRoles.filter((t) => t?.roleName !== tag?.roleName));
        setUserData({...userData, roles: selectedRoles.filter((t) => t?.roleName !== tag?.roleName)})
      };
      return (
        <Tag key={index} onRemove={onRemove} large={true} className={style.tagStyle}>
          {tag?.roleName}
        </Tag>
      );
    });

      const departmentsTags = selectedDepartments
      ?.filter(data => department?.map(dept => dept?.id === data?.id))
      ?.map((tag, index) => {
        const onRemoveDepartment = () => {
          setSelectedDepartments(selectedDepartments.filter((t) => t?.departmentName?.name !== tag?.departmentName?.name));
          setUserData({...userData, sites: {
            "sites": [
              {
                "id": "string",
                "siteName": {
                  "siteName": "string"
                },
                "departmentList": {
                  "departments": selectedDepartments.filter((t) => t?.departmentName?.name !== tag?.departmentName?.name)
                }
              }
            ]
          }})
        };
        return (
          <Tag key={index} onRemove={onRemoveDepartment} large={true} className={style.tagStyle}>
            {tag?.departmentName?.name}
          </Tag>
        );
      });

      const sitesTags = selectedSites
    ?.filter(data => sites.map(site => site?.id === data?.id))
    ?.map((tag, index) => {
      const onRemoveSite = () => {
        setSelectedSites(selectedSites.filter((t) => t?.siteName?.siteName !== tag?.siteName?.siteName));
        setUserData({...userData, sites: {
          "sites": selectedSites.filter((t) => t?.siteName?.siteName !== tag?.siteName?.siteName)
        }})
      };
      return (
        <Tag key={index} onRemove={onRemoveSite} large={true} className={style.tagStyle}>
          {tag?.siteName?.siteName}
        </Tag>
      );
    });

    const getRoles = async() => {
      const {data: roles} = await GET('user-management-service/roles');
      setRoles(roles);
    };

    const getDepartments = async() => {
      const {data: department} = await GET('entity-service/department');
      setDepartment(department);
    };

    const getSites = async() => {
      const {data: sites} = await GET('entity-service/sites');
      setSites(sites);
    };

    useEffect(()=>{
      getRoles();
      getDepartments();
      getSites();
  },[])

  const submitUserDetails = async () => {
    const response = await PUT('user-management-service/user', JSON.stringify(userData));
    getEditUserDialog(false);
    if(response){
      SuccessToaster('User Updated Successfully');
    }
    else {
      ErrorToaster('Unexpected Error');
    }
  }

  const handleUserBlockDetails = async () => {
    const response = await PUT('user-management-service/user', JSON.stringify({...blockedData, blocked: true}));
    getEditUserDialog(false);
    if(response){
      SuccessToaster('User Blocked Successfully');
    }
    else {
      ErrorToaster('Unexpected Error');
    }
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
                          <option value="HEALTHCARE" >
                          HEALTHCARE
                          </option>
                          <option value="FINANCE" disabled>
                          FINANCE
                          </option>
                          <option value="GOVERNMENT" disabled>
                          GOVERNMENT
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
                <InputGroup value={userData?.email?.officialEmail} readOnly onChange={(e) => setUserData({...userData, email: {officialEmail: e.target.value}})} />
              </div>
              <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Sites*</div>
                <div className={`${style.reduce10Left} ${style.marginRight}`}>
                  <select
                      name="class"
                      id="Class"
                      onChange={(e) => handleSites(e.target.value)}
                      className={`${style.fullWidth} ${style.marginLeft20} `}>
                          <option value="0" >
                            Select Sites
                          </option>
                          {sites?.map((data, index) => (
                            <option key={`${data}-${index}`} value={data?.siteName?.siteName} >
                              {data?.siteName?.siteName}
                            </option>
                          ))}
                  </select>
                  <div className={`${style.marginTop20} ${style.marginLeft20}`}>
                    {sitesTags}
                  </div>
                </div>
              </div>
              <div className={`${style.addManagerGrid}`}>
                  <div className={style.extentionLableStyle}>Role*</div>
                  <div className={`${style.reduce10Left} ${style.marginRight}`}>
                      <select
                          name="class"
                          id="Class"
                          onChange={(e) => handleRoles(e.target.value)}
                          className={`${style.fullWidth} ${style.marginLeft20} `}>
                              <option value="Select Role-multi select" >
                                Select Role-multi select
                              </option>
                              {roles?.filter(data=>data?.roleName !== 'Activity Logger')?.map((data, index) => (
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
              {
                // <div className={`${style.addManagerGrid}`}>
                //   <div className={style.extentionLableStyle}>Title*</div>
                //   <InputGroup value={userData?.title?.title} onChange={(e) => setUserData({...userData, title: {title: e.target.value}})} />
                // </div>
              }
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
