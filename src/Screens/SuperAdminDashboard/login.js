import React from 'react';
import {Link} from 'react-router-dom';
import { InputGroup, Icon } from '@blueprintjs/core';
import WelcomeImg from './../../images/welcomeImg.png';
import style from './index.module.scss';

const Login = () => {

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
        <div className={style.loginGrid}>
            <div className={style.welcomeImgCardStyle}>
                <img src={WelcomeImg} alt="WelcomeImg" className={style.welcomeImgStyle} />
                <div className={`${style.headingStyle} ${style.marginTop50}`}>Lorem Ipsum Dolor</div>
                <div className={style.welcomeDescriptionStyle}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua
                </div>
                <div className={style.timeSmartStyle}>© TimeSmart.AI</div>
                <div className={style.termsStyle}>Term of use. Privacy policy</div>
            </div>
            <div className={style.padding150}>
                <div className={style.loginToStyle}>log in to</div>
                <div className={`${style.regHeading} ${style.blackText} ${style.marginTop50}`}>Your Registered Email (Username)</div>
                <InputGroup type="email" large={true} placeholder="Enter your registered email here" className={style.marginTop10} />
                <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Password</div>
                <InputGroup type="password" large={true} placeholder="Enter password here" className={style.marginTop10} rightElement={EyeOpenElement(1)} />
                <Link to={'/welcome'}>
                    <button className={`${style.loginButton} ${style.marginTop30}`}>LOGIN</button>
                </Link>
                <Link to={'/forgotPassword'}>
                    <div className={`${style.forgotPasswordStyle} ${style.marginTop30}`}>I forgot my password</div>
                </Link>
            </div>
        </div>
    )
}

export default Login;