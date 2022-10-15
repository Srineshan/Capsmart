import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, Tag } from '@blueprintjs/core';
import { POST, TenantID, GET } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import style from './index.module.scss';

const AddUser = ({ getAddUserDialog }) => {

  const [addUser, setAddUser] = useState({ firstName: "", lastName: "", email: "", roles: [{ id: "", roleName: "" }], title: "" });
  const [customerType, setCustomerType] = useState('HEALTHCARE');
  const [roles, setRoles] = useState([])
  const [department, setDepartment] = useState([])
  const [sites, setSites] = useState([])

  const [selectedRoles, setSelectedRoles] = useState([])
  const [selectedDepartments, setSelectedDepartments] = useState([])
  const [selectedSites, setSelectedSites] = useState([])

  const handleRoles = (value) => {
    if (value !== '0') {
      const selectedValue = roles.filter(data => data?.roleName === value).map(data => data)[0];

      if (!selectedRoles.map(data => data?.roleName).includes(value)) {
        setSelectedRoles([...selectedRoles, selectedValue]);
      }
    }
  }

  const handleDepartments = (value) => {
    if (value !== '0') {
      const tempSelectedDepartments = department.filter(data => data?.departmentName?.name === value).map(data => data)[0];

      if (!selectedDepartments.map(data => data?.id).includes(tempSelectedDepartments?.id)) {
        setSelectedDepartments([...selectedDepartments, tempSelectedDepartments]);
      }
      console.log(selectedDepartments, tempSelectedDepartments)
    }
  }

  const handleSites = (value) => {
    if (value !== '0') {
      const tempSelectedSites = sites.filter(data => data?.siteName?.siteName === value).map(data => data)[0];

      if (!selectedSites.map(data => data?.id).includes(tempSelectedSites?.id)) {
        setSelectedSites([...selectedSites, tempSelectedSites]);
      }
      console.log(selectedSites, tempSelectedSites)
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

  const departmentsTags = selectedDepartments
    .filter(data => department.map(dept => dept).includes(data))
    .map((tag, index) => {
      const onRemoveDepartment = () => {
        setSelectedDepartments(selectedDepartments.filter((t) => t?.departmentName?.name !== tag?.departmentName?.name));
      };
      return (
        <Tag key={index} onRemove={onRemoveDepartment} large={true} className={style.tagStyle}>
          {tag?.departmentName?.name}
        </Tag>
      );
    });

  const sitesTags = selectedSites
    .filter(data => sites.map(dept => dept).includes(data))
    .map((tag, index) => {
      const onRemoveSite = () => {
        setSelectedSites(selectedSites.filter((t) => t?.siteName?.siteName !== tag?.siteName?.siteName));
      };
      return (
        <Tag key={index} onRemove={onRemoveSite} large={true} className={style.tagStyle}>
          {tag?.siteName?.siteName}
        </Tag>
      );
    });

  const submitUserDetails = async () => {

    if (!addUser?.email.includes('@') || !addUser?.email.includes('.')) {
      ErrorToaster('Enter a valid mail-id');
      return;
    }
    if (addUser?.firstName === '' && addUser?.email === '' && selectedRoles?.length === 0 && selectedSites?.length === 0) {
      ErrorToaster('All Fields are Mandatory');
      return;
    }
    const user = {
      "name": {
        "firstName": addUser?.firstName,
        "lastName": addUser?.lastName,
        "suffix": ""
      },
      "userType": "ADMIN",
      "title": {
        "title": addUser?.title
      },
      "email": {
        "officialEmail": addUser?.email
      },
      "password": {
        "password": "string"
      },
      "roles": selectedRoles,

      "tenant": {
        "tenantId": TenantID
      },
      "sites": {
        "sites": selectedSites
      },
      "blocked": false
    }

    await POST('user-management-service/user/register', JSON.stringify(user))
      .then(response => {
        SuccessToaster('User Added Successfully');
      })
      .catch(error => {
        ErrorToaster('Unexpected Error');
      })
    getAddUserDialog(false)
  }

  const getRoles = async () => {
    const { data: roles } = await GET('user-management-service/roles');
    setRoles(roles);
  };

  const getDepartments = async () => {
    const { data: department } = await GET('entity-service/department');
    setDepartment(department);
  };

  const getSites = async () => {
    const { data: sites } = await GET('entity-service/sites');
    setSites(sites);
  };

  useEffect(() => {
    getRoles();
    getDepartments();
    getSites();
  }, [])

  console.log('sites', sites, roles, department);

  return (
    <Dialog isOpen={getAddUserDialog} onClose={() => getAddUserDialog(false)} className={`${style.addManagerDialogBackground} ${style.addProofDialog}`}>
      <div className={`${Classes.DIALOG_BODY} `}>
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>Add User</p>
          <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getAddUserDialog(false)} />
        </div>
        <div className={style.extensionBorder}></div>
        <div className={style.proofBorder}>
          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.extentionLableStyle}>Customer Type*</div>
            <div className={`${style.reduce10Left} ${style.marginRight}`}>
              <select
                name="class"
                id="Class"
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                className={`${style.fullWidth} ${style.marginLeft20} `}>
                <option value="HEALTHCARE" >
                  HEALTHCARE
                </option>
                <option value="FINANCE" disabled>
                  FINANCE
                </option>
                <option value="GOVERNMENT" disabled >
                  GOVERNMENT
                </option>
              </select>
            </div>
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20} ${style.displayInRow}`}>
            <div className={style.extentionLableStyle}>User Name*</div>
            <div className={style.displayInRow}>
              <InputGroup value={addUser?.firstName} className={style.fieldWidth2InARow} onChange={(e) => setAddUser({ ...addUser, firstName: e.target.value })} />
              <InputGroup value={addUser?.lastName} className={`${style.fieldWidth2InARow} ${style.marginLeft20}`} onChange={(e) => setAddUser({ ...addUser, lastName: e.target.value })} />
            </div>
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.extentionLableStyle}>Email Address*</div>
            <InputGroup value={addUser?.email} onChange={(e) => setAddUser({ ...addUser, email: e.target.value })} />
          </div>

          {/* <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Department*</div>
                <div className={`${style.reduce10Left} ${style.marginRight}`}>
                    <select
                        name="class"
                        id="Class"
                        onChange={(e) => handleDepartments(e.target.value)}
                        className={`${style.fullWidth} ${style.marginLeft20} `}>

                            <option value="Select Department" >
                              Select Department
                            </option>
                            {department?.map((data, index) => (
                              <option key={`${data}-${index}`} value={data?.departmentName?.name} >
                                {data?.departmentName?.name}
                              </option>
                            ))}
                    </select>
                    <div className={`${style.marginTop20} ${style.marginLeft20}`}>
                      {departmentsTags}
                    </div>
                  </div>
            </div> */}

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
          {
            // <div className={`${style.addManagerGrid}`}>
            //   <div className={style.extentionLableStyle}>Title*</div>
            //   <InputGroup value={addUser?.title} onChange={(e) => setAddUser({...addUser, title: e.target.value})} />
            // </div>
          }
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
