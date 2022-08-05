import React from 'react';
import { Icon } from '@blueprintjs/core';
import {Link} from 'react-router-dom';
import style from './index.module.scss';

const OTPPage = () => {

    const EyeOpenElement = (index) => {
        return (
          <div
            key={index}>
            <Icon
              icon={'eye-open'}
              size={25}
              color="#B3B8BD"
              className={`${style.eyePadding} ${style.cursor}`}
            />
          </div>
        );
      };

    return(
        <div className={style.setPasswordBackground}>
            <div className={style.otpCard}>
                <div className={style.otpHeading}>
                    PLEASE ENTER THE PASSCODE TO VERIFY YOUR IDENTITY
                </div>
                <div className={`${style.otpTextStyle} ${style.marginTop20}`}>
                    A passcode has been sent to xxxxx-892 / swati@timesmart.ai
                </div>
                <div className={`${style.otpTextStyle} ${style.marginTop10}`}>
                    Make sure to check your email inbox or spam folder.
                </div>
                <div className={`${style.displayInRow} ${style.marginTop20}`}>
                    <div className={`${style.otpBoxStyle} ${style.marginRight}`}></div>
                    <div className={`${style.otpBoxStyle} ${style.marginRight}`}></div>
                    <div className={`${style.otpBoxStyle} ${style.marginRight}`}></div>
                    <div className={`${style.otpBoxStyle} ${style.marginRight}`}></div>
                    <div className={`${style.otpBoxStyle} ${style.marginRight}`}></div>
                    <div className={style.otpBoxStyle}></div>
                </div>
                <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                    <button className={style.outlinedButton}>RESEND PASSCODE</button>
                    <Link to={'/welcomeToDashboard'}>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`}>CONTINUE</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default OTPPage;
