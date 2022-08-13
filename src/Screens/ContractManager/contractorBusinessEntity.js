import React, { useState, useEffect } from 'react';
import { InputGroup, Checkbox, Tag } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {POST, GET, PUT, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

import style from './index.module.scss';

const ContractorBusinessEntity = ({getViewPage4, getCurrentPage, selectContractInfo, contractId}) => {

    const [sameAsContractor, setSameAsContractor] = useState(false);
    const [contractorNPIN, setContractorNPIN] = useState({
        notApplicable: true,
        npin: "",
        missing: true
    });
    const [contractorEntityTaxId, setContractorEntityTaxId] = useState({
        taxId: "",
        missing: true
    });
    const [businessEntity, setBusinessEntity] = useState({
        name: ''
    });
    const [businessEntityUser, setBusinessEntityUser] = useState({
        name: {
            firstName: "",
            lastName: "",
            suffix: ""
          },
          email: {
            officialEmail: ""
          },
          contactNumber: {
            number: 0,
            missing: true
          }
    });
    const [roles, setRoles] = useState([])
    const [selectedRoles, setSelectedRoles] = useState([])
    const [mailingAddress, setMailingAddress] = useState({
        addressLine: "",
        city: "",
        state: "",
        zipcode: ""
    });
    const [appRoleRequired, setAppRoleRequired] = useState(true);
    const [contractorBusinessEntity, setContractorBusinessEntity] = useState({});

    const handleContinue = async() => {
        const data = {
            contractorNPIN: contractorNPIN,
            contractorEntityTaxId: contractorEntityTaxId,
            businessEntity: businessEntity,
            businessEntityUser: businessEntityUser,
            roles: selectedRoles,
            mailingAddress: mailingAddress,
            contractorContact: sameAsContractor,
            appRoleRequired: appRoleRequired
          }
          const response = await PUT(`contract-managment-service/contracts/${contractId}/contractorBusinessEntity`, JSON.stringify(data));
            if(response){
                SuccessToaster('Business Entity Updated Successfully');
            }
            else {
                ErrorToaster('Unexpected Error');
            }

          console.log(data)
    }

    const handleRoles = (value) => {
        if (value !== '0') {
          const selectedValue = roles?.filter(data => data?.roleName === value)?.map(data => data)[0];

          if (!selectedRoles?.map(data => data?.roleName)?.includes(value)) {
            setSelectedRoles([...selectedRoles, selectedValue]);
          }
        }
      }

    const rolesTags = selectedRoles
    ?.filter(data => roles?.map(role => role.id === data?.id))
    .map((tag, index) => {
      const onRemove = () => {
        setSelectedRoles(selectedRoles.filter((t) => t?.roleName !== tag?.roleName)?.map(data=>data));
      };
      return (
        <Tag key={index} onRemove={onRemove} large={true} className={style.tagStyle}>
          {tag?.roleName}
        </Tag>
      );
    });

    const getRoles = async() => {
        const {data: roles} = await GET('user-management-service/roles');
        setRoles(roles);
    };

    const getContractorBusinessEntity = async() => {
        const {data: contractorBusinessEntity} = await GET(`contract-managment-service/contracts/${contractId}/contractorBusinessEntity`);
        setContractorBusinessEntity(contractorBusinessEntity);
    };

    useEffect(()=>{
        setSameAsContractor(contractorBusinessEntity?.contractorContact);
        setBusinessEntity(contractorBusinessEntity?.businessEntity);
        setContractorNPIN(contractorBusinessEntity?.contractorNPIN);
        setContractorEntityTaxId(contractorBusinessEntity?.contractorEntityTaxId);
        setBusinessEntityUser(contractorBusinessEntity?.businessEntityUser);
        setAppRoleRequired(contractorBusinessEntity?.appRoleRequired);
        setSelectedRoles(contractorBusinessEntity?.roles || []);
        setMailingAddress(contractorBusinessEntity?.mailingAddress);
    },[contractorBusinessEntity])

      useEffect(()=>{
        getRoles();
        getContractorBusinessEntity();
    },[])

    console.log('roles',selectedRoles);

    return (
        <div className={style.cloneBlockStyle}>
            <div className={`${style.newContractFromCloneBoxStyle}`}>
                {selectContractInfo === "INDIVIDUAL" && (
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.extentionLableStyle}>Contractor Business Contact Same As Contractor*</div>
                        <FormControlLabel
                            control={
                                <Switch checked={sameAsContractor} className={`${style.textAlignLeft}`} onChange={() => setSameAsContractor(!sameAsContractor)} />
                            }
                            className={`${style.switchFontStyle} ${style.marginTop}`}
                            label={sameAsContractor ? 'YES' : 'NO'}
                        />
                    </div>
                )}
                {!sameAsContractor && (
                    <>
                        <div className={`${style.extentionGrid} ${selectContractInfo === "INDIVIDUAL" && style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Business Entity Name*</div>
                            <InputGroup className={style.fullWidth}
                            value={businessEntity?.name}
                            placeholder="Enter Business Entity Name"
                            onChange={(e) => setBusinessEntity({...businessEntity, name: e.target.value})} />
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Contractor NPIN*</div>
                            <div className={style.twoCol}>
                                <InputGroup className={style.fullWidth} value={contractorNPIN?.npin} placeholder="Enter Contractor NPIN"
                                onChange={(e) => setContractorNPIN({...contractorNPIN, npin: e.target.value})}  />
                                <div className={`${style.displayInRow} ${style.marginTop10}`}>
                                    <Checkbox label="Missing" checked={contractorNPIN?.missing} value="Missing" onChange={(e) => setContractorNPIN({...contractorNPIN, missing: e.target.checked})} />
                                    <Checkbox label="NA" checked={contractorNPIN?.notApplicable} value="NA" className={style.marginLeft20}
                                    onChange={(e) => setContractorNPIN({...contractorNPIN, notApplicable: e.target.checked})}  />
                                </div>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Contractor Entity Tax ID*</div>
                            <div className={style.twoCol}>
                                <InputGroup className={style.fullWidth} value={contractorEntityTaxId?.taxId} placeholder="Enter Contractor Entity Tax ID"
                                onChange={(e) => setContractorEntityTaxId({...contractorEntityTaxId, taxId: e.target.value})} />
                                <Checkbox label="Missing" checked={contractorEntityTaxId?.missing} value="Missing" className={`${style.marginTop10}`}
                                onChange={(e) => setContractorEntityTaxId({...contractorEntityTaxId, missing: e.target.checked})}  />
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Contractor Business Contact*</div>
                            <div className={style.twoCol}>
                                <InputGroup className={style.fullWidth} value={businessEntityUser?.name?.firstName}  placeholder="Enter First Name"
                                onChange={(e) => setBusinessEntityUser({...businessEntityUser, name: {firstName: e.target.value, lastName: businessEntityUser?.name?.lastName, suffix: ''}})} />
                                <InputGroup className={style.fullWidth} value={businessEntityUser?.name?.lastName}  placeholder="Enter Last Name"
                                onChange={(e) => setBusinessEntityUser({...businessEntityUser, name: {lastName: e.target.value, firstName: businessEntityUser?.name?.firstName, suffix: ''}})} />
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Business Contact Email Address*</div>
                            <InputGroup className={style.fullWidth}  value={businessEntityUser?.email?.officialEmail} placeholder="Enter Email"
                                onChange={(e) => setBusinessEntityUser({...businessEntityUser, email: {officialEmail: e.target.value}})}
                            />
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Cell Phone*</div>
                            <div className={style.twoCol}>
                                <InputGroup className={style.fullWidth} value={businessEntityUser?.contactNumber?.number} placeholder="Enter Phone Number" type='number'
                                onChange={(e) => setBusinessEntityUser({...businessEntityUser, contactNumber: {number: e.target.value, missing: businessEntityUser?.contactNumber?.missing}})}
                                />
                                <Checkbox label="Missing" checked={businessEntityUser?.contactNumber?.missing} value="Missing" className={`${style.marginTop10}`}
                                onChange={(e) => setBusinessEntityUser({...businessEntityUser, contactNumber: {missing: e.target.checked, number: businessEntityUser?.contactNumber?.number}})}  />
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Register Business Contact With App User Role*</div>
                            <div>
                                <div className={style.displayInRow}>
                                    <FormControlLabel
                                        control={
                                            <Switch checked={appRoleRequired} className={`${style.textAlignLeft}`}
                                            onChange={() => setAppRoleRequired(!appRoleRequired)} />
                                        }
                                        className={`${style.switchFontStyle}`}
                                        label={appRoleRequired ? 'YES' : 'NO'}
                                    />
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
                                </div>
                                <div className={`${style.marginTop20} ${style.marginLeft20}`}>
                                    {rolesTags}
                                </div>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Mailing Address*</div>
                            <div>
                                <InputGroup className={style.fullWidth} value={mailingAddress?.addressLine} placeholder="Enter Address Line 1"
                                onChange={(e) => setMailingAddress({...mailingAddress, addressLine: e.target.value})} />
                                <div className={`${style.grid3} ${style.marginTop10}`}>
                                    <InputGroup className={style.fullWidth} value={mailingAddress?.city} placeholder="Enter City"
                                onChange={(e) => setMailingAddress({...mailingAddress, city: e.target.value})} />
                                    <InputGroup className={style.fullWidth}  value={mailingAddress?.state} placeholder="Enter State"
                                onChange={(e) => setMailingAddress({...mailingAddress, state: e.target.value})} />
                                    <InputGroup className={style.fullWidth}  value={mailingAddress?.zipcode} placeholder="Enter Zipcode"
                                onChange={(e) => setMailingAddress({...mailingAddress, zipcode: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <button className={`${style.newContractButtonStyle}`} onClick={()=> {getCurrentPage('Contracted Services Provider(s)')}}>BACK</button>
                <div>
                    <button className={style.newContractOutlinedButton} onClick={() => handleContinue()}>SAVE IN-PROGRESS</button>
                    <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`}
                    onClick={() => { getViewPage4(true); getCurrentPage('Documentation Proof Required') }}
                    >CONTINUE</button>
                </div>
            </div>
        </div>
    )
}

export default ContractorBusinessEntity;
