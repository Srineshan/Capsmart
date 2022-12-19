import React from 'react';
import DoctorAnime from './../../images/doctorAnime.png';
import ChevronRight from './../../images/chevronRight.png';
import PageFooterIcon from './../../images/pageFooterIcon.png';
import { currentUser } from './../../utils/auth';

import style from './index.module.scss';

const SideBar = () => {
    const currentUserData = currentUser()
    return (
        <div>
            <div className={style.chevronCardStyle}>
                <div className={`${style.alignCenter}`}>
                    <img src={ChevronRight} className={style.chevronRightStyle2} />
                </div>
            </div>
            <div className={`${style.cardStyle} ${style.marginTop20}`}>
                <div className={`${style.displayInCol} ${style.alignCenter}`}>
                    <div className={`${style.userNameStyle} `}>
                        {currentUserData?.firstName}
                    </div>
                    <img src={DoctorAnime} className={style.userLogo} />
                </div>
            </div>
            <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
                <div className={style.openCardStyle}>
                    <img src={PageFooterIcon} alt="footer" className={style.footerIconStyle} />
                </div>
            </div>
        </div>
    )
}

export default SideBar;
