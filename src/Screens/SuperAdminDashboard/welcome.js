import React, { useEffect, useState } from 'react';
import { Icon, Intent } from '@blueprintjs/core';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TenantID, GET, PUT } from './../dataSaver';
import WelcomeImg from './../../images/welcomeNewAccountImg.png';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import style from './index.module.scss';

const Welcome = ({ getIsContinue }) => {
    let { id } = useParams();
    const [entityData, setEntityData] = useState();
    const [accountManager, setAccountManager] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        getEntityData();
        getManagerDetails();
    }, []);

    useEffect(() => {
        getManagerDetails();
    }, [entityData]);

    const getEntityData = async () => {
        const { data: data } = await GET(`entity-service/entity/${id}`);
        setEntityData(data);
        console.log(entityData, data)
    }

    const getManagerDetails = async () => {
        const { data: user } = await GET(`user-management-service/user/${entityData?.accountManager?.id}`);
        setAccountManager(user);
    }

    const updateEntity = async () => {
        let data = entityData;
        data.hideWelcomeScreen = true;
        const formData = new FormData();
        formData.append('entity', new Blob([JSON.stringify(data)], {
            type: "application/json"
        }));
        if (id !== 'new') {
            await PUT('entity-service/entity', formData)
                .then(response => {
                    SuccessToaster('Entity Updated Successfully');
                    navigate(`/entitySetup/${TenantID}`);
                }).catch(error => {
                    ErrorToaster('Unexpected Error Updating Entity');
                });
        }
    }

    return (
        <div className={style.welcomeBackground}>
            {/* <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} onClick={()=>navigate('/user')}/> */}
            <div className={style.welcomeContentMargin}>
                <div className={style.welcomeHeading}>
                    WELCOME TO TIMESMARTAI
                </div>
                <div className={style.accountTypeStyle}>Contract Account</div>
                <div className={style.alignCenter}>
                    <img src={WelcomeImg} alt="Welcome Img" className={style.welcomeAccountImgStyle} />
                </div>
                <div className={`${style.welcomeDescription} ${style.marginTop30}`}>
                    {`This setup wizard will guide you to quickly activate your account. Once your
                account is activated you will be able to invite other users from your organization.
                Experience the difference in better managing contractor activity logs and timesheet
                processing. Refer to the quick <Setup Guide> or <Setup Tutorial> to see how easy it
                is to activate a customer account.`}
                </div>
                <div className={`${style.welcomeDescription} ${style.marginTop20}`}>
                    {`If you experience any problems or have questions,
                do not hesitate to reach out to our TimeSmartAI support team - <support@timesmart.ai>`}
                </div>
                <div className={`${style.spaceBetween} ${style.welcomeDescription} ${style.marginTop20}`}>
                    Your customer acc manager details:
                    <div className={`${style.managerDetails} ${style.marginLeft20}`}>
                        <div className={style.managerFieldGrid}>
                            <div className={style.managerLabelStyle}>MANAGER NAME:</div>
                            <div className={style.managerFieldValueStyle}>{accountManager?.name ? `${accountManager?.name?.firstName} ${accountManager?.name?.lastName}` : '-'}</div>
                        </div>
                        <div className={style.managerFieldGrid}>
                            <div className={style.managerLabelStyle}>EMAIL ADDRESS:</div>
                            <div className={style.managerFieldValueStyle}>{accountManager?.email?.officialEmail ? accountManager?.email?.officialEmail : '-'}</div>
                        </div>
                        <div className={style.managerFieldGrid}>
                            <div className={style.managerLabelStyle}>PHONE NO:</div>
                            <div className={style.managerFieldValueStyle}>{accountManager?.communication ? accountManager?.communication?.mobileNumber : '-'}</div>
                        </div>
                    </div>
                </div>
                <div className={style.marginTop50}>
                    {/* <button className={`${style.outlinedWelcomeButton} ${style.cursor}`}>CANCEL</button> */}
                    {/* <Link to={`/entitySetup/${TenantID}`}> */}
                    <button className={`${style.welcomeButton} ${style.marginLeft20} ${style.cursor}`} onClick={() => { updateEntity(); getIsContinue(true) }}>CONTINUE</button>
                    {/* </Link> */}
                </div>
            </div>
        </div>
    )
}

export default Welcome;
