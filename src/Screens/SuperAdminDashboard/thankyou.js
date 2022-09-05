import React, {useState} from 'react';
import { Icon, Intent, Dialog, Classes } from '@blueprintjs/core';
import {Link, useNavigate} from 'react-router-dom';
import SetupCompleteImg from './../../images/setupCompleteImg.png';
import Alert from './../../images/alert.png';
import style from './index.module.scss';

const Thankyou = () => {
    const navigate = useNavigate();
    return(
        <div className={`${style.welcomeBackground}`}>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`}/>
            <div className={style.thankyouPageAlign}>
                <div>
                    <div className={style.completedHeading}>
                        Password Setup Successful
                    </div>
                    <div className={style.alignCenter}>
                        <img src={SetupCompleteImg} alt="Welcome Img" className={style.setupCompleteImgStyle} />
                    </div>
                    <div className={style.thanksTextStyle}>Thank you</div>

                    <div className={style.marginTop50}>
                        <button className={`${style.setupCompleteButton} ${style.cursor}`}
                        onClick={() =>
                        {navigate('/');
                        }}>LOGIN</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Thankyou;
