import React from 'react';
import logo from "./../../images/cambridgeHospital.png";
import CrossPink from "../../images/crossPink.png";
import { useDescope } from '@descope/react-sdk';
import style from './index.module.scss';

const ApplicationHeader = ({ title }) => {
    const { logout } = useDescope();
    const handleSignOut = () => {
        logout()
    }
    return (
        <div className={`${style.headerCard}`}>
            <div className={`${style.headerGrid}`}>
                <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
                <div className={`${style.titleText} ${style.verticalAlignCenter}`}>{title}</div>
                <div className={style.verticalAlignCenter}>
                    <img
                        src={CrossPink}
                        alt="cross"
                        className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft20}`}
                        onClick={() => { handleSignOut() }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ApplicationHeader;