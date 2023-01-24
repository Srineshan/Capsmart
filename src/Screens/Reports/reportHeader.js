import React, { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz'
import Cookie from 'universal-cookie';
import { TenantID, GET } from './../../Screens/dataSaver';
import jwt from 'jwt-decode';

import style from './index.module.scss';

const ReportHeader = () => {
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const userDetail = jwt(userDetails);

    const [logo, setLogo] = useState({ logo: sessionStorage?.getItem('logo'), title: sessionStorage.getItem('title') });
    const [currentTime, setCurrentTime] = useState(formatInTimeZone(new Date(), 'America/New_York', 'MMM d yyyy, H:mm zzz'));

    useEffect(() => {
        getLogo();
    }, [])

    const getLogo = async () => {
        const { data: data } = await GET(`entity-service/entity/${TenantID}`);
        setLogo({ logo: data?.logo?.file?.fileURL, title: data?.entityName?.entityName });
    }

    return (
        <div className={style.headerBackground}>
            <div className={`${style.spaceBetween} ${style.alignCenter}`}>
                <div>
                    <div className={style.confidentialBoxStyle}>
                        <div className={style.confidentialTextStyle}>CONFIDENTIAL</div>
                        <div className={style.doNotDisturbTextStyle}>Do Not Distribute</div>
                    </div>
                </div>
                <div>
                    {logo.logo && (
                        <img src={logo.logo} alt="" className={`${style.headerLogo} ExcludeMeFromPdf`} />
                    )}
                    <div className={style.entityNameBolderStyle}>{logo.title}</div>
                </div>
                <div>
                    <div className={style.reportRunByTextStyle}>Report Run By : </div>
                    <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{userDetail?.userName} at {currentTime}</div>
                </div>
            </div>
            <div className={`${style.headerBorderStyle} ${style.marginTop40}`}></div>
        </div>
    )
}

export default ReportHeader;
