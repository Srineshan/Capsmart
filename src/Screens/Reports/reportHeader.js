import React, {useState, useEffect} from 'react';
import {format} from 'date-fns';
import Cookie from 'universal-cookie';
import {TenantID, GET} from './../../Screens/dataSaver';
import jwt from 'jwt-decode';

import style from './index.module.scss';

const ReportHeader = () => {
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const userDetail = jwt(userDetails);
    const [logo,setLogo] = useState({logo:sessionStorage?.getItem('logo'),title:sessionStorage.getItem('title')});

    return(
        <div>
            <div className={style.spaceBetween}>
                <div>
                    <div className={style.confidentialBoxStyle}>
                        <div className={style.confidentialTextStyle}>CONFIDENTIAL</div>
                        <div className={style.doNotDisturbTextStyle}>Do Not Distribute</div>
                    </div>
                </div>
                <div>
                    <img src={logo.logo} alt="Hospital Logo" className={style.headerLogo} />
                    <div className={style.entityNameHeaderStyle}>{logo.title}</div>
                </div>
                <div>
                    <div className={style.reportRunByTextStyle}>Report run by : </div>
                    <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{userDetail?.userName} at</div>
                    <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{format(new Date(), 'MMM d yyyy, H:mm')}</div>
                </div>
            </div>
            <div className={`${style.headerBorderStyle} ${style.marginTop40}`}></div>
        </div>
    )
}

export default ReportHeader;
