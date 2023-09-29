import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { POST, GET } from './../dataSaver';
import TimeSmartLogo from './../../images/timeSmartAILogo.png';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

import style from './index.module.scss';

const GetSSOId = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [ssoId, setSsoId] = useState('');
    const [tenantId, setTenantId] = useState();
    const [entityLogo, setEntityLogo] = useState('');

    useEffect(() => {
        getEntityId();
    }, [])

    useEffect(() => {
        getEntityLogo();
    }, [tenantId])

    const getEntityId = async () => {
        await axios(`http://ec2-34-230-167-131.compute-1.amazonaws.com:8010/entity-service/entityID`, {
            method: 'GET',
        }).then(response => {
            setTenantId(response?.data?.id);
        }).catch(error => {
            console.log('error', error);
        })
    }

    const getEntityLogo = async () => {
        const { data: data } = await GET(`entity-service/entity/logo?id=${tenantId}`);
        setEntityLogo(data);
    }

    const handleSubmit = async () => {
        console.log(userId, ssoId);
        if (ssoId === '') {
            ErrorToaster('SSO ID is Mandatory');
            return;
        }
        if (!ssoId.includes('@') || !ssoId.includes('.') || ssoId === '') {
            ErrorToaster('Enter a valid mail-id');
            return;
        }

        const user = {
            "uuid": userId,
            "ssoId": { "id": ssoId },
        }

        await POST('user-management-service/user/ssoid', JSON.stringify(user))
            .then(response => {
                SuccessToaster('SSO ID Added Successfully');
                window.location.href = `https://${window.location.hostname}`
            })
            .catch(error => {
                ErrorToaster(error);
            })
    };

    console.log(window.location.href)

    return (
        <div className={style.fullHeight}>
            <div className={`${style.justifyCenter} ${style.verticalAlignCenter}`}>
                <div>
                    <div className={style.spaceBetween}>
                        <img src={entityLogo} alt="" className={style.getSSOPageLogo} />
                        <img src={TimeSmartLogo} alt="" className={style.getSSOPageLogo} />
                    </div>
                    <div className={`${style.getSSOIdHeaderBox} ${style.marginTop} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
                        <div className={style.getSSOIdHeading}>Enter Okta(SSO) ID</div>
                    </div>
                    <div className={style.getSSOIdBox}>
                        <div className={`${style.addManagerGrid} ${style.padding20}`}>
                            <CommonLabel value='Enter Okta(SSO) ID*' />
                            <div className={style.displayInRow}>
                                <CommonInputField className={style.fullWidth}
                                    value={ssoId} onChange={(e) => setSsoId(e.target.value)} placeholder="Enter Okta(SSO) ID" />
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