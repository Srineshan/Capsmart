import React, { Fragment } from "react";
import style from './index.module.scss';
import CrossPink from './../../images/crossPink.png';

const SubNavbar = () => {
    return (
        <Fragment>
            <div>
                <div className={`${style.displayInRow} ${style.marginTop10}`}>
                    <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                        ABSENCE REASONS BY INDUSTRIES
                    </div>
                    <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                        UPDATED ON FEB 16, 2022 16:45 EST
                    </div>
                    <div className={style.crossStyle}>
                        <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} />
                        {/* <Icon icon="cross" size={25}  className={`${style.marginLeft20} ${style.marginBottom5} ${style.crossColor}`} /> */}
                        {/* intent={Intent.DANGER} */}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SubNavbar;