import React from 'react';
import DoctorAnime from './../../images/doctorAnime.png';
import ChevronRight from './../../images/chevronRight.png';
import PageFooterIcon from './../../images/pageFooterIcon.png';
import { currentUser } from './../../utils/auth';

import style from './index.module.scss';
import UserCard from '../../Screens/ContractManager/userCard';

const SideBar = ({ children, isExpanded, getIsExpanded }) => {
    const currentUserData = currentUser()
    return (
        !isExpanded ? (
            <div>
                <div className={style.chevronCardStyle}>
                    <div className={`${style.alignCenter}`}>
                        <img src={ChevronRight} className={style.chevronRightStyle2} onClick={() => getIsExpanded(true)} />
                    </div>
                </div>
                <div className={`${style.cardStyle} ${style.marginTop20}`}>
                    <div className={`${style.displayInCol} ${style.alignCenter}`}>
                        <div className={`${style.userNameStyle} `}>
                            {currentUserData?.fullName}
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
        ) : (
            <>
                <UserCard getIsExpanded={getIsExpanded} />
                <div className={style.marginTop20}>{children}</div>
            </>
        )
    )
}

export default SideBar;
