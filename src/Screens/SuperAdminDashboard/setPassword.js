import React, {useState} from 'react';
import { InputGroup, Icon } from '@blueprintjs/core';
import style from './index.module.scss';
import axios from "axios";
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';


const SetPassword = () => {
    const [viewPassword,setViewPassword] = useState(false);
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [phone,setPhone] = useState('');
    let tenantId = "6242845f95690b3822cb96a5"
    let userId = "628296f8a4212f141d57219f"
    const headers = {
       'Content-Type': 'application/json',
       'X-tenantID' : tenantId,
     }

    const handlePasswordCheck = () => {
      if(password === '' || confirmPassword === ''){
        ErrorToaster('Enter a valid password');
        return;
      }
      else if(password !== confirmPassword){
        ErrorToaster('Both Password and Confirm Password should be same');
        return;
      }else{
        let data = {
            "userId": userId,
            "password": {
              "password": password,
            }
          }
        axios('http://ec2-54-210-154-191.compute-1.amazonaws.com/user-management-service/user/setpassword',{
          method: 'POST',
          headers: headers,
          data: JSON.stringify(data),
        })
        .then(response=>{
          SuccessToaster('Password Set Successfully');
        })
        .catch(error=>{
          console.log('Error',error);
          ErrorToaster('Unexpected Error Occured');
        })
      }
    }

    const EyeOpenElement = (index) => {
        return (
          <div>
          {
            viewPassword ?
             <div
                key={index}>
                <Icon
                  icon={'eye-off'}
                  size={25}
                  color="#B3B8BD"
                  className={`${style.eyePadding} ${style.cursor}`}
                  onClick={()=>setViewPassword(!viewPassword)}
                />
              </div>:

          <div
            key={index}>
            <Icon
              icon={'eye-open'}
              size={25}
              color="#B3B8BD"
              className={`${style.eyePadding} ${style.cursor}`}
              onClick={()=>setViewPassword(!viewPassword)}
            />
          </div>
        }
          </div>
        );
      };

    return(
        <div className={style.setPasswordBackground}>
            <div className={style.setPasswordCard}>
                <div className={style.loginToStyle}>create login credential</div>
                <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Set Your Password</div>
                <InputGroup type={viewPassword?"text":"password"} large={true} placeholder="Password" className={style.marginTop10} rightElement={EyeOpenElement(1)} onChange={(e)=>setPassword(e.target.value)}/>
                <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Confirm Your Password</div>
                <InputGroup type={viewPassword?"text":"password"} large={true} placeholder="Password" className={style.marginTop10} rightElement={EyeOpenElement(1)} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Cell Phone ( To Receive Verfication Passcode)</div>
                <InputGroup type="text" large={true} placeholder="+1344231717" className={style.marginTop10} onChange={(e)=>setPhone(e.target.value)}/>
                <button className={`${style.loginButton} ${style.marginTop30}`} onClick={handlePasswordCheck}>CREATE PASSWORD</button>
            </div>
        </div>
    )
}

export default SetPassword;
