import React from 'react';
import Cookie from 'universal-cookie';
import style from './index.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useDescope } from '@descope/react-sdk';

const ApplicationSubmitted = () => {

    const { logout } = useDescope();
    const navigate = useNavigate()


    const handleLogout = () => {
        var cookies = new Cookie();
        cookies.remove("user", { path: "/" });
        cookies.remove("entityId", { path: "/" });
        cookies.remove("authorization", { path: "/" });
        logout()
        navigate('/')
    }

    return (
        <div className={style.submittedCard}>
            <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
                <div>
                    <div className={style.heading}>Your Credentialing & Privileging Application is Submitted!</div>
                    <div className={style.justifyCenter}>
                        <div className={`${style.continue} ${style.marginTop}`} onClick={() => { handleLogout() }}>LOGOUT</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApplicationSubmitted;