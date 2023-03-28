import React, { useState, useEffect } from 'react';
import { InputGroup, Icon } from '@blueprintjs/core';
import style from './index.module.scss';
import axios from "axios";
import { GetEntityDetails } from './../../utils/auth';
import { GET } from './../dataSaver';
import { useNavigate } from 'react-router-dom';
import Cookie from 'universal-cookie';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';


const SetPasswordWithoutPassword = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [tenantId, setTenantId] = useState();
  var cookie = new Cookie();
  const navigate = useNavigate();

  useEffect(() => {
    getEntityId();
  }, [])

  useEffect(() => {
    getUser();
  }, [tenantId])


  const getEntityId = async () => {
    await axios(`https://rest.mytimesmart.com/entity-service/entityID`, {
      method: 'GET',
      // headers: { 'X-subdomain': 'demo' }
    }).then(response => {
      var cookie = new Cookie();
      cookie.set('entityId', response?.data?.id);
      setTenantId(response?.data?.id);
    }).catch(error => {
      console.log('error', error);
    })
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-tenantID': tenantId,
  }

  const getUser = async () => {
    await axios('https://rest.mytimesmart.com/user-management-service/user', {
      method: 'GET',
      headers: headers,
    }).then(response => {
      setUsers(response?.data);
    }).catch(error => {
      console.log('error', error);
    })
  };

  const handlePasswordCheck = () => {
    if (!users?.map(data => data?.email?.officialEmail)?.includes(email)) {
      ErrorToaster('The email entered is not registered with us.');
      return;
    }
    if (email === '' || !email.includes('@') || !email.includes('.')) {
      ErrorToaster('Enter a valid E-mail');
      return;
    }
    if (password === '' || confirmPassword === '') {
      ErrorToaster('Enter a valid password');
      return;
    }
    else if (password !== confirmPassword) {
      ErrorToaster('Both Password and Confirm Password should be same');
      return;
    } else {
      let data = {
        "userId": users?.filter(data => data?.email?.officialEmail === email)?.map(data => data?.id)[0],
        "password": {
          "password": password,
        }
      }
      axios('https://rest.mytimesmart.com/user-management-service/user/setpassword', {
        method: 'POST',
        headers: headers,
        data: JSON.stringify(data),
      })
        .then(response => {
          navigate('/thankyou');
        })
        .catch(error => {
          console.log('Error', error);
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
                onClick={() => setViewPassword(!viewPassword)}
              />
            </div> :

            <div
              key={index}>
              <Icon
                icon={'eye-open'}
                size={25}
                color="#B3B8BD"
                className={`${style.eyePadding} ${style.cursor}`}
                onClick={() => setViewPassword(!viewPassword)}
              />
            </div>
        }
      </div>
    );
  };

  return (
    <div className={style.setPasswordBackground}>
      <div className={style.setPasswordCard}>
        <div className={style.loginToStyle}>create login credential</div>
        <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Email(Registered Mail Id)</div>
        <InputGroup type="email" large={true} placeholder="user@email.com" className={style.marginTop10} onChange={(e) => setEmail(e.target.value)} />
        <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Set Your Password</div>
        <InputGroup type={viewPassword ? "text" : "password"} large={true} placeholder="Password" className={style.marginTop10} rightElement={EyeOpenElement(1)} onChange={(e) => setPassword(e.target.value)} />
        <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Confirm Your Password</div>
        <InputGroup type={viewPassword ? "text" : "password"} large={true} placeholder="Password" className={style.marginTop10} rightElement={EyeOpenElement(1)} onChange={(e) => setConfirmPassword(e.target.value)} />
        {
          // <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Cell Phone ( To Receive Verfication Passcode)</div>
          // <InputGroup type="text" large={true} placeholder="+1344231717" className={style.marginTop10} onChange={(e)=>setPhone(e.target.value)}/>
        }
        <button className={`${style.loginButton} ${style.marginTop30}`}
          onClick={() => { handlePasswordCheck() }}
        >CREATE PASSWORD</button>

      </div>
    </div>
  )
}

export default SetPasswordWithoutPassword;
