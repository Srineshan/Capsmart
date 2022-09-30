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
    const [logo,setLogo] = useState({logo:'',title:''});
    const [currentTime] = useState(format(new Date(), 'MMM d yyyy, H:mm'));

    useEffect(()=>{
      getLogo();
    })

    const getLogo = async() => {
      const {data: data} = await GET(`entity-service/entity/${TenantID}`);
      setLogo({logo:data?.logo?.file?.fileURL, title:data?.entityName?.entityName});
    }

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
                    <div className={style.reportRunByTextStyle}>Report Run By : </div>
                    <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{userDetail?.userName} at</div>
                    <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{currentTime}</div>
                </div>
            </div>
            <div className={`${style.headerBorderStyle} ${style.marginTop40}`}></div>
        </div>
    )
}

export default ReportHeader;
