import React from 'react';
import UserLogo from './../../images/userLogo.jpg';
import ChevronRight from './../../images/chevronRight.png';
import PageFooterIcon from './../../images/pageFooterIcon.png';

import style from './index.module.scss';

const SideBar = () => {
    return(
        <div>
            <div className={style.chevronCardStyle}>
                <div className={`${style.alignCenter}`}>
                    <img src={ChevronRight} className={style.chevronRightStyle2}/>
                </div>
            </div>
            <div className={`${style.cardStyle} ${style.marginTop20}`}>
                <div className={`${style.displayInCol} ${style.alignCenter}`}>
                        <div className={`${style.userNameStyle} `}>
                        JOHN
                    </div>
                    <img src={UserLogo} className={style.userLogo} />
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