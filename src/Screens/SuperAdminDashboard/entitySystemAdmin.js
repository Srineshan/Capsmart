import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputGroup, Icon, Intent, Switch, TagInput, Checkbox } from '@blueprintjs/core';
import DatalistInput from 'react-datalist-input';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GET, TenantID, PUT, POST } from './../dataSaver';
import Step1 from './../../images/step12.png';
import Step2 from './../../images/step22.png';
import Step3 from './../../images/step34.png';
import Step4 from './../../images/step4.png';
import Step5 from './../../images/step55.png';
import UploadImg from './../../images/uploadImg.png';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { Auth } from './../../utils/auth';
import axios from 'axios';
import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';


const EntitySystemAdmin = ({ getActiveStep }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [billingAddress, setBillingAddress] = useState({ fname: '', lname: '', title: '', email: '', phone: 0 });
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userData, setUserData] = useState({ firstName: '', lastName: '', title: '', email: '', phone: '' });
  const [selectedRoles, setSelectedRoles] = useState(roles?.filter(data => data?.roleName === 'Entity Sys Admin')?.map(data => data));
  const [accountManager, setAccountManager] = useState('');
  const [entity, setEntity] = useState();
  const [partnerId, setPartnerId] = useState(sessionStorage.getItem('selectedPartner'));
  const handleBillingData = (name, value) => {
    setBillingAddress({ ...billingAddress, [name]: value });
  }

  useEffect(() => {
    getUserData();
    getRolesData();
    getEntityData();
  }, [])

  const getEntityData = async () => {
    const { data: entity } = await GET(`entity-service/entity/${id}`);
    setEntity(entity);
    if (entity?.accountManager?.id) {
      setAccountManager(entity?.accountManager?.id);
    }
  }

  const getUserData = async () => {
    // await axios(`https://rest.timesmart.io/user-management-service/user?partnerId=${partnerId}&userType=PARTNER_USER`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-tenantID': id,
    //     'Authorization': `Bearer ${Auth()}`
    //   },
    // }).then(response => {
    //   setUsers(response?.data);
    // }).catch(error => {
    //   console.log('error', error)
    // })

    const { data: users } = await GET(`user-management-service/user?partnerId=${partnerId}&userType=PARTNER_USER`);
    setUsers(users);
  };

  const getRolesData = async () => {
    const { data: rolesData } = await GET('user-management-service/roles');
    setRoles(rolesData);
    setSelectedRoles(rolesData?.filter(data => data?.roleName === 'Entity Sys Admin')?.map(data => data));
  }

  const addRole = (id) => {
    let temp = selectedRoles;
    temp.push(roles?.filter(data => data?.id === id)?.map(data => data)[0]);
    setSelectedRoles(temp);
  }

  const handleUserData = (name, value) => {
    setUserData({ ...userData, [name]: value });
  }

  const handleUpdate = async (buttonType) => {
    if (userData?.firsName === '' || userData?.lastName === '' || userData?.email === '') {
      ErrorToaster('All Fields are mandatory');
      return;
    }
    if (!userData?.email.includes('@') || !userData?.email.includes('.')) {
      ErrorToaster('Enter a valid Email');
      return;
    }
    let temp = entity;
    temp.accountManager = {
      "id": accountManager
    }

    let data = {
      "name": {
        "firstName": userData?.firstName,
        "lastName": userData?.lastName,
        "suffix": {}
      },
      "userType": "REGISTERED_USER",
      "contract": [],
      "title": {},
      "email": {
        "officialEmail": userData?.email,
      },
      "password": {
        "password": "string"
      },
      "communication": {
        "personalEmail": userData?.email,
        "mobileNumber": userData?.phone,
        "landlineNumber": "",
        "mobileNumberNotApplicable": false
      },
      "roles": roles?.filter(data => data?.roleName === 'Entity Sys Admin')?.map(data => data),
      "address": {
        "city": "",
        "state": "",
        "zipcode": ""
      },
      "tenant": {
        "tenantId": id
      },
      "sites": {
        "sites": []
      },
      "serviceProviderType": {},
      "activated": true,
      "siteLevelResponsible": true,
      "departmentLevelResponsible": true,
      "blocked": true,
      "npin": {
        "missing": true,
        "notApplicable": true,
        "npin": "string"
      }
    }
    await POST('user-management-service/user/register', data)
      .then(response => {
        SuccessToaster('System Admin created Successfully');
      })
      .catch(error => {
        ErrorToaster('Error creating system admin');
      })
    if (accountManager !== '') {
      await PUT('entity-service/entity', temp)
        .then((response) => {
          SuccessToaster('Account manager added Successfully');
        })
        .catch(error => {
          ErrorToaster('Error adding account manager');
        })
    }

    if (buttonType === 'Continue') {
      getActiveStep('siteUsers');
    }
  }

  return (
    <div className={style.entitySetupBackground}>
      <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} onClick={() => navigate('/activeCustomers')} />
      <div className={style.stepperMargin}>
        <div className={style.stepperGrid}>
          <div onClick={() => getActiveStep('appSubscription')}>
            <div className={style.justifyCenter}>
              <div className={`${style.stepperImgBackground} ${style.completedStepperStyle} `}>
                <img src={Step5} alt="Step1" className={style.stepperImgStyle} />
              </div>
            </div>
            <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>SUBSCRIPTION PLAN</p>
          </div>
          <div onClick={() => getActiveStep('contractAndBilling')}>
            <div className={style.justifyCenter}>
              <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                <img src={Step3} alt="Step2" className={style.stepperImgStyle} />
              </div>
            </div>
            <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>CONTRACT & BILLING</p>
          </div>
          <div onClick={() => getActiveStep('entitySetup')}>
            <div className={style.justifyCenter}>
              <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                <img src={Step3} alt="Step3" className={style.stepperImgStyle} />
              </div>
            </div>
            <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
          </div>
          <div onClick={() => getActiveStep('siteInformation')}>
            <div className={style.justifyCenter}>
              <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                <img src={Step3} alt="Step4" className={style.stepperImgStyle} />
              </div>
            </div>
            <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>SITES FOR APP USE</p>
          </div>
          <div onClick={() => getActiveStep('entitySystemAdmin')}>
            <div className={style.justifyCenter}>
              <div className={`${style.stepperImgBackground} ${style.activeStepperStyle}`}>
                <img src={Step2} alt="Step5" className={style.stepperImgStyle} />
              </div>
            </div>
            <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>ENTITY SYSTEM ADMIN</p>
          </div>
          {/*<div onClick={() => getActiveStep('siteUsers')}>
              <div className={style.justifyCenter}>
                <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                  <img src={Step4} alt="Step4" className={style.stepperImgStyle} />
                </div>
              </div>
              <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>APP USERS</p>
            </div>
             <div onClick={() => getActiveStep('appSubscription')}>
              <div className={style.justifyCenter}>
                <div className={`${style.stepperImgBackground} ${style.activeStepperStyle} `}>
                  <img src={Step5} alt="Step5" className={style.stepperImgStyle} />
                </div>
              </div>
              <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>APP SUBSCRIPTION</p>
            </div> */}
        </div>
        <div className={style.stepperDivider5}></div>
      </div>
      <div className={style.entitySetupCardStyle}>
        <p className={style.heading}>Entity System Admin</p>
        <div className={style.greyBorder}></div>
        <div className={style.entityDescription}>
          Help lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus
          quam nec tellus dictum, vitae ultrices urna porttitor. donec commodo tellus
          dapibus semper mattis. aenean ut massa vitae tortor consequat tristique. etiam
          eget condimentum sapien. morbi est ante, sagittis ac rhoncus eget, faucibus ut
          felis. pellentesque iaculis aliquam massa. lorem ipsum dolor sit amet, consectetur
          adipiscing elit. sed finibus quam nec tellus dictum.
        </div>
        <div>
          <div className={style.cloneBlockStyle}>
            <div className={`${style.newContractFromCloneBoxStyle}`}>
              <div className={style.textAlignLeft}>
                <Checkbox checked label="DESIGNATE CUSTOMER ACCOUNT MANAGER" />
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop30}`}>
                <div className={style.extentionLableStyle}>Available Account Manager*</div>
                <div className={`${style.leftAlign} `}>
                  <select
                    name="class"
                    id="Class"
                    value={accountManager}
                    className={style.fullWidth}
                    onChange={(e) => setAccountManager(e.target.value)}>
                    <option value="Select Account Manager" >
                      Select Account Manager
                    </option>
                    {
                      users?.map(data => (
                        <option value={data?.id} >
                          {data?.name?.firstName} {data?.name?.lastName}
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>
              {
                // <div className={`${style.extentionGrid} ${style.marginTop30}`}>
                //     <div className={style.extentionLableStyle}>App User Role*</div>
                //     <div className={`${style.leftAlign} `}>
                //         <select
                //             name="class"
                //             id="Class"
                //             className={style.fullWidth}
                //             // onChange={(e)=>addRole(e.target.value)}
                //             >
                //             {
                //               // <option value="" >
                //               // Select User Role
                //               // </option>
                //             }
                //
                //                 {
                //                   roles?.filter(data=>data?.roleName === 'Entity Sys User')?.map(data=>(
                //                     <option value={data.id} >
                //                     {data?.roleName}
                //                     </option>
                //                   ))
                //                 }
                //         </select>
                //     </div>
                // </div>
              }
              <div className={`${style.textAlignLeft} ${style.marginTop20}`}>
                <Checkbox checked label="CREATE ENTITY USER WITH SYS ADMIN PROFILE*" />
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>NAME*</div>
                <div className={style.displayInRow}>
                  <InputGroup className={style.textFieldWidth} placeholder="First Name" value={userData.firstName} onChange={(e) => handleUserData('firstName', e.target.value)} />
                  <InputGroup className={`${style.textFieldWidth} ${style.marginLeft20}`} value={userData.lastName} placeholder="Last Name" onChange={(e) => handleUserData('lastName', e.target.value)} />
                </div>
              </div>
              {
                // <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                //     <div className={style.extentionLableStyle}>Functional Title*</div>
                //     <div className={`${style.leftAlign} `}>
                //         <select
                //             name="class"
                //             id="Class"
                //             value={userData?.title}
                //             onChange={(e)=>handleUserData('title',e.target.value)}
                //             className={style.twoFieldWidth}>
                //             <option value="select title" >
                //             select title
                //             </option>
                //                 <option value="Anesthesiologist" >
                //                 Anesthesiologist
                //                 </option>
                //                 <option value="Cardiologist" >
                //                 Cardiologist
                //                 </option>
                //                 <option value="Chief Medical Information Officer" >
                //                 Chief Medical Information Officer
                //                 </option>
                //                 <option value="Chief Medical Officer" >
                //                 Chief Medical Officer
                //                 </option>
                //                 <option value="Chief of Staff" >
                //                 Chief of Staff
                //                 </option>
                //         </select>
                //     </div>
                // </div>
              }
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Email Address*</div>
                <InputGroup placeholder="Email@lorem.com" className={`${style.twoFieldWidth}`} value={userData?.email} onChange={(e) => handleUserData('email', e.target.value)} />
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Cell Phone</div>
                <InputGroup placeholder="9756315505" className={`${style.twoFieldWidth}`} value={userData?.phone} onChange={(e) => handleUserData('phone', e.target.value)} />
              </div>
            </div>
            <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
              <button className={style.outlinedButton} onClick={() => handleUpdate('saveInProgress')}>SAVE IN-PROGRESS</button>
              <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => handleUpdate('Continue')}>CONTINUE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EntitySystemAdmin;
