import React, {useState} from 'react';
import {Link, RouteComponentProps, useNavigate} from 'react-router-dom';
import { InputGroup, Icon } from '@blueprintjs/core';
import WelcomeImg from './../../images/welcomeImg.png';
import Cookie from 'universal-cookie';
import style from './index.module.scss';


const Login = (props) => {
  const [user,setUser] = useState({email:'',password:''});
  const navigate = useNavigate();
  const login = () => {
    const requestOptions = {
       method: 'POST',
       headers: { 'Content-Type': 'application/json',
                  'X-tenantID' : '6242845f95690b3822cb96a5',
                  'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpZCI6IjYyNDI4NTJlOTMzN2NkNTUzN2I4ODcxNSIsInVzZXJOYW1lIjoiSG9zcGl0YWwgMSIsInN1YiI6Imhvc3BpdGFsMUB0aW1lc21hcnRhaS5jb20iLCJpYXQiOjE2NTM3MzkzNTMsImV4cCI6MTY1MzgyNTc1M30.NfQJwvBPig-uJCp-pd7uH8mnRwfa5c-EyBm-atQN59sefOthWyaz74Pbucu2URDAVxXi5kEt-MTad-dJbyjsxw`},
       body: JSON.stringify(user)
   };
   fetch('http://ec2-44-202-85-195.compute-1.amazonaws.com:8000/user-management-service/auth/login', requestOptions)
       .then(response => response.json())
       .then(data => {
         navigate('/welcome');
         var cookie = new Cookie();
         cookie.set('user',data.accessToken)
         return true;
       }
      )
  }

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
                <InputGroup type="email" large={true} placeholder="Enter your registered email here" className={style.marginTop10} value={user.email} onChange={(e)=>setUser({...user,email:e.target.value})}/>
                <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Password</div>
                <InputGroup type="password" large={true} placeholder="Enter password here" className={style.marginTop10} rightElement={EyeOpenElement(1)} value={user.password} onChange={(e)=>setUser({...user, password:e.target.value})} />
                {/* <button className={`${style.loginButton} ${style.marginTop30}`} onClick={login}>LOGIN</button> */}
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
