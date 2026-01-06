import React from 'react';
import Cookie from 'universal-cookie';
import style from './index.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useDescope } from '@descope/react-sdk';
import { Tooltip } from '@mui/material';

const ApplicationSubmitted = () => {

    const { logout } = useDescope();
    const navigate = useNavigate()


    const handleLogout = () => {
        var cookies = new Cookie();
        cookies.remove("user", { path: "/" });
        cookies.remove("entityId", { path: "/" });
        cookies.remove("authorization", { path: "/", domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.split('.')?.slice(-2)?.join('.') : window.location.hostname });
        logout()
        navigate('/')
    }

    const handleRedirect = () => {
        navigate('/tenant/64246d491b70b07241d37aa1/medicalDirectives')
    }

    return (
        <div className={style.submittedCard}>
            <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
                <div>
                    <div className={style.heading}>Congratulations! You have successfully completed your application.</div><br />
                    <div className={style.heading}> To review & attest to any new or updated medical directives,</div><br />
                    <div className={style.heading}> please  <span className={style.linkLike} onClick={() => handleRedirect()}>click here.</span></div>
                    <div className={style.justifyCenter}>
                        <Tooltip title={"Click here to Review & Attest"} arrow>
                            <div className={`${style.continue} ${style.marginTop}`} onClick={() => { handleRedirect() }}>Attest To Medical Directives</div>
                        </Tooltip>
                    </div>
                    <div className={style.justifyCenter}>
                        <Tooltip title={"Click to Logout"} arrow>
                            <div className={`${style.continue} ${style.marginTop}`} onClick={() => { handleLogout() }}>LOGOUT</div>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApplicationSubmitted;