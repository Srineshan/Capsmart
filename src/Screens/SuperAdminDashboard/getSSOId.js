import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { POST, GET } from './../dataSaver';
import TimeSmartLogo from './../../images/timeSmartAILogo.png';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

import style from './index.module.scss';

const GetSSOId = () => {
    const { ssoId } = useParams();
    const [ssoIdValue, setSsoIdValue] = useState('');

    const handleSubmit = async () => {
        console.log(ssoId, ssoIdValue);
        if (ssoIdValue === '') {
            ErrorToaster('SSO ID is Mandatory');
            return;
        }
        if (!ssoIdValue.includes('@') || !ssoIdValue.includes('.') || ssoIdValue === '') {
            ErrorToaster('Enter a valid mail-id');
            return;
        }

        // const user = {
        //     ...(isEdit && { 'id': userId }),
        //     "name": {
        //         "firstName": addUser?.firstName,
        //         "lastName": addUser?.lastName,
        //         "suffix": suffix,
        //     },
        //     "userType": isEdit ? addUser?.userType : "REGISTERED_USER",
        //     ...(isEdit && { "contracts": userDataById?.contracts }),
        //     "title": addUser?.title,
        //     "ssoId": addUser?.ssoId,
        //     "email": {
        //         "officialEmail": addUser?.email
        //     },
        //     ...(!isEdit && {
        //         "password": {
        //             "password": "string"
        //         }
        //     }),
        //     "communication": {
        //         "personalEmail": addUser?.email,
        //         "mobileNumber": addUser?.phone,
        //         "landlineNumber": "string",
        //         "mobileNumberNotApplicable": true
        //     },
        //     "roles": addUser?.roles,
        //     ...(isEdit && { "address": userDataById?.address }),
        //     "tenant": {
        //         "tenantId": TenantID
        //     },
        //     "sites": {
        //         "sites": getFinalSiteValueWithDepartments()
        //     },
        //     ...(isEdit && { "activated": userDataById?.activated }),
        //     ...(isEdit && { "blocked": userDataById?.blocked }),
        //     ...(isEdit && { "serviceProviderType": userDataById?.serviceProviderType }),
        //     ...(isEdit && { "npin": userDataById?.npin }),
        // }

        // await POST('user-management-service/user/register', JSON.stringify(user))
        //     .then(response => {
        //         SuccessToaster('SSO ID Added Successfully');
        //     })
        //     .catch(error => {
        //         ErrorToaster(error);
        //     })
    };

    return (
        <div className={style.fullHeight}>
            <div className={`${style.justifyCenter} ${style.verticalAlignCenter}`}>
                <div>
                    <div className={style.spaceBetween}>
                        <img src={TimeSmartLogo} alt="" className={style.getSSOPageLogo} />
                        <img src={TimeSmartLogo} alt="" className={style.getSSOPageLogo} />
                    </div>
                    <div className={`${style.getSSOIdHeaderBox} ${style.marginTop} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
                        <div className={style.getSSOIdHeading}>Enter SSO ID</div>
                    </div>
                    <div className={style.getSSOIdBox}>
                        <div className={`${style.addManagerGrid} ${style.padding20}`}>
                            <CommonLabel value='Enter SSO ID*' />
                            <div className={style.displayInRow}>
                                <CommonInputField className={style.fullWidth}
                                    value={ssoIdValue} onChange={(e) => setSsoIdValue(e.target.value)} />
                            </div>
                        </div>
                        <div className={style.padding20}>
                            <button className={`${style.newContractButtonStyle}  ${style.cursorPointer} ${style.floatRight}`}
                                onClick={() => handleSubmit()}
                            >Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GetSSOId;