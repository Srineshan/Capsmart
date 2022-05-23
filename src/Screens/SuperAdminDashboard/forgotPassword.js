import React from 'react';
import { InputGroup, Icon } from '@blueprintjs/core';
import style from './index.module.scss';

const ForgotPassword = () => {

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
        <div className={style.forgotPasswordBackground}>
            <div className={style.forgotPasswordCard}>
                <div className={style.loginToStyle}>create login credential</div>
                <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Set Your Password</div>
                <InputGroup type="password" large={true} placeholder="Swati$1" className={style.marginTop10} rightElement={EyeOpenElement(1)} />
                <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Confirm Your Password</div>
                <InputGroup type="password" large={true} placeholder="Swati$1" className={style.marginTop10} rightElement={EyeOpenElement(1)} />
                <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Cell Phone ( To Receive Verfication Passcode)</div>
                <InputGroup type="password" large={true} placeholder="Password" className={style.marginTop10} />
                <button className={`${style.loginButton} ${style.marginTop30}`}>CREATE PASSWORD</button>
            </div>
        </div>
    )
}

export default ForgotPassword;