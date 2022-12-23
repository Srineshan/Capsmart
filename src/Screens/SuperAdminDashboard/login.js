import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TenantID, GET } from './../dataSaver';
import { InputGroup, Icon } from '@blueprintjs/core';
import WelcomeImg from './../../images/welcomeImg.png';
import Cookie from 'universal-cookie';
import axios from "axios";
import style from './index.module.scss';
import jwt from 'jwt-decode';

const Login = (props) => {
  const [user, setUser] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [entityId, setEntityId] = useState('');
  const [viewPassword, setViewPassword] = useState(false);
  const [logo, setLogo] = useState({ logo: '', title: '' });
  var cookie = new Cookie();

  useEffect(() => {
    getEntityId();
    getLogo();
  }, [])

  const getEntityId = async() => {
    await axios(`https://rest.timesmart.live/entity-service/entityID`,{
        method: 'GET',
    }).then(response=>{
      cookie.set('entityId',response?.data?.id);
      setEntityId(response?.data?.id);
    }).catch(error => {
      console.log('error', error);
    })
  }

  const getLogo = async () => {
    const { data: data } = await GET(`entity-service/entity/${TenantID}`);
    setLogo({ logo: data?.logo?.file?.fileURL, title: data?.entityName?.entityName });
  }

  const login = () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-tenantID': entityId,
      },
      body: JSON.stringify(user)
    };
    fetch('https://rest.timesmart.live/user-management-service/auth/login', requestOptions)
      .then(response => response.json())
      .then(data => {
        cookie.set('user', data?.accessToken);
        let roles = jwt(data?.accessToken)?.roles?.split(',');
        let isAppUser = roles.includes('Approver') || roles.includes('Reviewer') || roles.includes('Activity Logger');
        let isContractManager = roles.includes('Contract Manager');
        let isEntityLevelAdmin = roles.includes('Super Sys Admin') || roles.includes('Entity Sys Admin') || roles.includes('Entity Sys User') || roles.includes('Distributor Admin');
        if (isAppUser) {
          window.location.href = '/';
        } else if (isContractManager) {
          navigate('/contracts');
          window.location.reload();
        } else if (isEntityLevelAdmin) {
          navigate('/user');
          window.location.reload();
        }
        else {
          navigate('/user');
          window.location.reload();
        }
      }
      )
    return true;
  }

  const EyeOpenElement = (index) => {
    return (
      <div
        key={index}>
        <Icon
          icon={viewPassword ? 'eye-off' : 'eye-open'}
          size={25}
          color="#B3B8BD"
          className={`${style.eyePadding} ${style.cursor}`}
          onClick={() => { setViewPassword(!viewPassword); }}
        />
      </div>
    );
  };

  return (
    <div className={`${style.loginGrid} ${style.loginBackground}`}>
      <div className={style.welcomeImgCardStyle}>
        <img src={WelcomeImg} alt="WelcomeImg" className={style.welcomeImgStyle} />
        <div className={`${style.headingStyle} ${style.marginTop50}`}>Automate Your Time Tracking</div>
        {
          // <div className={style.welcomeDescriptionStyle}>
          // Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          // incididunt ut labore et dolore magna aliqua
          // </div>
        }
        <div className={style.timeSmartStyle}>© TimeSmart.AI</div>
        <div className={style.termsStyle}>Term of use. Privacy policy</div>
      </div>
      <div className={style.padding100}>
        <div className={style.loginToStyle}>log in to</div>
        <div className={style.marginTop30}>
          <div><span className={style.timeTextStyle}>Time</span><span className={style.smartTextStyle}>Smart.AI</span></div>
        </div>
        <div>
          <img src={logo?.logo} alt="logo" className={style.logoLoginStyle} />
        </div>
        <div className={`${style.regHeading} ${style.blackText} ${style.marginTop50}`}>Your Registered Email (Username)</div>
        <InputGroup type="email" large={true} placeholder="Enter your registered email here" className={style.marginTop10} value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
        <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Password</div>
        <InputGroup type={viewPassword ? 'text' : "password"} large={true} placeholder="Enter password here" className={style.marginTop10} rightElement={EyeOpenElement(1)} value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
        {
          <button className={`${style.loginButton} ${style.marginTop30}`} onClick={login}>LOGIN</button>
        }
        {/* <Link to={'/welcome'}>
                    <button className={`${style.loginButton} ${style.marginTop30}`}>LOGIN</button>
                  </Link> */}
        {
          // <Link to={'/referenceList'}>
          //   <button className={`${style.loginButton} ${style.marginTop30}`}>LOGIN</button>
          // </Link>
        }
        <Link to={'/setPassword/:userId'}>
          <div className={`${style.setPasswordStyle} ${style.marginTop30}`}>I forgot my password</div>
        </Link>
      </div>
    </div>
  )
}

export default Login;
