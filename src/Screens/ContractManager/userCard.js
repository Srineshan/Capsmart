import React from 'react';
import DoctorAnime from './../../images/doctorAnime.png';
import ChevronRight from './../../images/chevronRight.png';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';

import style from './index.module.scss';

const UserCard = () => {
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const user = jwt(userDetails);
    return(
        <div className={`${style.cardStyle} ${style.bigCalendarLeftCardWidth}`}>
            <div className={`${style.displayInRow} ${style.alignCenter}`}>
                <label for="file-upload">
                    <img src={DoctorAnime} className={`${style.userLogo} ${style.cursorPointer}`} />
                </label>
                <input id="file-upload" type="file"/>
                <div className={style.marginLeft20}>
                    <div className={style.userNameStyle}>
                     Hi, {user?.userName}
                    </div>
                    <div className={style.loginStatus}>
                        last login SEP 7,21 11:48 am
                    </div>
                </div>
                <img src={ChevronRight} className={style.chevronRightStyle}/>
            </div>
        </div>
    )
}

export default UserCard;
