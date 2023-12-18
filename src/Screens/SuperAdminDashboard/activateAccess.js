import React, { useState, useEffect } from 'react';
import { InputGroup, Icon } from '@blueprintjs/core';
import style from './index.module.scss';
import axios from "axios";
import { GetEntityDetails } from './../../utils/auth';
import { GET } from './../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import Cookie from 'universal-cookie';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import RedWarning from './../../images/redWarning.png';
import CompletedIcon from './../../images/completedIcon.png';

const ActivateAccess = () => {
  const { randomId } = useParams();
  const [viewPassword, setViewPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmUsername, setConfirmUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [tenantId, settenantId] = useState();
  const [entityLogo, setEntityLogo] = useState('');
  const [entity, setEntity] = useState({});
  const [isSmallCharacterAvailable, setIsSmallCharacterAvailable] = useState(false);
  const [isCapitalCharacterAvailable, setIsCapitalCharacterAvailable] = useState(false);
  const [isNumberAvailable, setIsNumberAvailable] = useState(false);
  const [isSpecialCharacterAvailable, setIsSpecialCharacterAvailable] = useState(false);
  const [isMin8CharacterAvailable, setIsMin8CharacterAvailable] = useState(false);
  const [passwordStrengthLength, setPasswordStrengthLength] = useState(0);
  const [strengthText, setStrengthText] = useState('');
  const [strengthColor, setStrengthColor] = useState('');
  var cookie = new Cookie();
  const navigate = useNavigate();

  useEffect(() => {
    getEntityId();
  }, []);

  useEffect(() => {
    let length = [isCapitalCharacterAvailable, isSmallCharacterAvailable, isMin8CharacterAvailable, isNumberAvailable, isSpecialCharacterAvailable]?.filter(data => data === true)?.length;
    setPasswordStrengthLength(length);
    setStrengthColor(length === 1 ? style.activePasswordProgressLength1 : length === 2 ? style.activePasswordProgressLength2 : length === 3 ? style.activePasswordProgressLength3 : length === 4 ? style.activePasswordProgressLength4 : length === 5 ? style.activePasswordProgressLength4 : '');
  }, [password, isCapitalCharacterAvailable, isSmallCharacterAvailable, isMin8CharacterAvailable, isNumberAvailable, isSpecialCharacterAvailable]);

  useEffect(() => {
    setStrengthText(passwordStrengthLength === 0 ? '' :
      passwordStrengthLength === 1 ? 'Weak' :
        passwordStrengthLength === 2 ? 'Okay' :
          passwordStrengthLength === 3 ? 'Good' :
            passwordStrengthLength >= 4 ? 'Strong' : '')
  }, [passwordStrengthLength])

  useEffect(() => {
    handlePasswordStrengthCheck();
  }, [password]);

  useEffect(() => {
    getUser();
    getEntityLogo();
    getEntity();
  }, [tenantId])


  const handlePasswordStrengthCheck = () => {
    if (/^(?=.*[@$!%#?&^()*~`])/.test(password)) {
      setIsSpecialCharacterAvailable(true);
    } else {
      setIsSpecialCharacterAvailable(false);
    }
    if (/^(?=.*[A-Z])/.test(password)) {
      setIsCapitalCharacterAvailable(true);
    } else {
      setIsCapitalCharacterAvailable(false);
    }
    if (/^(?=.*[a-z])/.test(password)) {
      setIsSmallCharacterAvailable(true);
    } else {
      setIsSmallCharacterAvailable(false);
    }
    if (/^(?=.*\d)/.test(password)) {
      setIsNumberAvailable(true);
    } else {
      setIsNumberAvailable(false);
    }
    if (/^[A-Za-z\d@$!%*#?&^()*~`]{8,}/.test(password)) {
      setIsMin8CharacterAvailable(true);
    } else {
      setIsMin8CharacterAvailable(false);
    }
    setPasswordStrengthLength([isCapitalCharacterAvailable, isSmallCharacterAvailable, isMin8CharacterAvailable, isNumberAvailable, isSpecialCharacterAvailable]?.filter(data => data === true)?.length)
  }

  const getEntityId = async () => {
    await axios(`http://ec2-54-210-154-191.compute-1.amazonaws.com/entity-service/entityID`, {
      method: 'GET',
      // headers: { "X-subdomain": "smmc-trial" },
    }).then(response => {
      var cookie = new Cookie();
      cookie.set('entityId', response?.data?.id);
      settenantId(response?.data?.id);
    }).catch(error => {
      console.log('error', error);
    })
  }

  const getEntityLogo = async () => {
    const { data: data } = await GET(`entity-service/entity/logo?id=${tenantId}`);
    setEntityLogo(data);
  }

  const getEntity = async () => {
    const { data: data } = await GET(`entity-service/entity/${tenantId}`);
    setEntity(data);
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-tenantId': tenantId,
  }

  const getUser = async () => {
    await axios(`http://ec2-54-210-154-191.compute-1.amazonaws.com/user-management-service/user`, {
      method: 'GET',
      headers: headers,
    }).then(response => {
      setUsers(response?.data);
    }).catch(error => {
      console.log('error', error);
    })
  };

  const handleUsernameCheck = () => {
    if (password === '' || confirmPassword === '') {
      ErrorToaster('All Fields are Mandatory');
      return;
    }
    else if (password !== confirmPassword) {
      ErrorToaster('Both Password and Confirm Password should be same');
      return;
    } else if (!isMin8CharacterAvailable) {
      ErrorToaster('Minimum 8 characters required');
      return;
    } else if (passwordStrengthLength < 4) {
      ErrorToaster('Should Satisfy Minimum 4 Conditions');
      return;
    }
    // else {
    //     let data = {
    //         "uuid": randomId,
    //         "password": {
    //             "password": password,
    //         }
    //     }
    //     axios(`http://ec2-54-210-154-191.compute-1.amazonaws.com/user-management-service/user/updatepassword`, {
    //         method: 'POST',
    //         headers: headers,
    //         data: JSON.stringify(data),
    //     })
    //         .then(response => {
    //             navigate('/thankyou');
    //         })
    //         .catch(error => {
    //             console.log('Error', error);
    //             ErrorToaster(error?.response?.data);
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
    <div className={style.activateAccessBackground}>
      <div className={style.activateAccessCard}>
        <div className={style.activateHeaderText}><strong>Time</strong>Smart.AI</div>
        {entityLogo?.file?.fileURL && (
          <img src={entityLogo?.file?.fileURL} alt="" className={style.entityLogo} />
        )}
        <div className={style.loginToStyle}>{entity?.entityName?.entityName}</div>
        {/* <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Email(Registered Mail Id)</div>
        <InputGroup type="email" large={true} value={users?.filter(data => data?.id === randomId)?.map(data => data?.email?.officialEmail)[0]} className={style.marginTop10} /> */}
        <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30} `}>To Activate Your TimeSmartAI Access Using Single Sign-On, Provide Your OKTA Username</div>
        <InputGroup type={"text"} large={true} placeholder="Enter Username" className={`${style.marginTop10} ${(confirmUsername?.length > 0 && confirmUsername !== username) && style.redBorderField} ${(confirmUsername?.length > 0 && confirmUsername === username) && style.greenBorderField}`}
          value={username} onChange={(e) => setUsername(e.target.value)} />
        <p className={`${style.textAlignLeft} ${style.marginTop10} ${style.activateAccessHelpText}`}>Make sure the Username you have provided is what you use for accessing your Single Sign-On Portal </p>
        {/* <div className={`${style.passwordStrengthGrid} ${style.marginTop10}`}>
                    <div className={`${style.passwordProgress} ${passwordStrengthLength >= 1 && strengthColor}`}></div>
                    <div className={`${style.passwordProgress} ${passwordStrengthLength >= 2 && strengthColor}`}></div>
                    <div className={`${style.passwordProgress} ${passwordStrengthLength >= 3 && strengthColor}`}></div>
                    <div className={`${style.passwordProgress} ${passwordStrengthLength >= 4 && strengthColor}`}></div>
                </div>
                <div className={style.floatRight}>
                    <div className={style.loginToStyle}>{strengthText}</div>
                </div> */}
        {/* <div className={style.marginTop20}> */}
        {/* <CommonCheckBox checked={isMin8CharacterAvailable} label={'8 Characters Minimum'} />
          <CommonCheckBox checked={isSmallCharacterAvailable} label={'1 Lowercase Letter'} />
          <CommonCheckBox checked={isCapitalCharacterAvailable} label={'1 Uppercase Letter'} />
          <CommonCheckBox checked={isNumberAvailable} label={'1 Number(0 - 9)'} />
          <CommonCheckBox checked={isSpecialCharacterAvailable} label={'1 Special Character'} /> */}



        {/* <FormGroup>
                        <FormControlLabel control={<Checkbox checked={isMin8CharacterAvailable}
                            sx={{
                                '&.Mui-checked': {
                                    color: '#00C07F',
                                },
                            }} />} label={<Typography variant="body2" color="textSecondary">8 Characters Minimum</Typography>} />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={isSmallCharacterAvailable}
                            sx={{
                                '&.Mui-checked': {
                                    color: '#00C07F',
                                },
                            }} />} label={<Typography variant="body2" color="textSecondary">1 Lowercase Letter</Typography>} />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={isCapitalCharacterAvailable}
                            sx={{
                                '&.Mui-checked': {
                                    color: '#00C07F',
                                },
                            }} />} label={<Typography variant="body2" color="textSecondary">1 Uppercase Letter</Typography>} />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={isNumberAvailable}
                            sx={{
                                '&.Mui-checked': {
                                    color: '#00C07F',
                                },
                            }} />} label={<Typography variant="body2" color="textSecondary">1 Number(0 - 9)</Typography>} />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={isSpecialCharacterAvailable}
                            sx={{
                                '&.Mui-checked': {
                                    color: '#00C07F',
                                },
                            }} />} label={<Typography variant="body2" color="textSecondary">1 Special Character</Typography>} />
                    </FormGroup> */}
        {/* </div> */}
        <InputGroup
          type={"text"} large={true} placeholder="Confirm Username provided" className={`${style.marginTop20} ${(confirmUsername?.length > 0 && confirmUsername !== username) && style.redBorderField} ${(confirmUsername?.length > 0 && confirmUsername === username) && style.greenBorderField}`}
          value={confirmUsername} onChange={(e) => setConfirmUsername(e.target.value)} />
        {(confirmUsername?.length > 0 && confirmUsername !== username) && (
          <p className={`${style.marginTop10} ${style.activateAccessAlertText}`}>Username does not match, Check & re-enter</p>
        )}
        {
          // <div className={`${style.regHeading} ${style.blackText} ${style.marginTop30}`}>Cell Phone ( To Receive Verfication Passcode)</div>
          // <InputGroup type="text" large={true} placeholder="+1344231717" className={style.marginTop10} onChange={(e)=>setPhone(e.target.value)}/>
        }
        <button className={`${style.loginButton} ${style.marginTop30}`}
          onClick={() => { handleUsernameCheck() }}
        >ACTIVATE SSO ACCESS</button>

        {/* .
                .......
                ..........
                            DO NOT REMOVE THE BELOW CODE 
                ..........
                .......
                .....*/}

        {/* <img src={RedWarning} alt='' className={style.redWarningStyle} />
                <div className={`${style.regHeading} ${style.blackText} ${style.marginTop10} `}>Failure To Activate Your SSO Access For TimeSmartAI</div>
                <div className={`${style.failureCheckDesc} ${style.marginTop20}`}>Please Check The Username That You Have Entered & Make Sure That It Is Exactly What You Used For Signing Into Your Octa Single Sig-On Potal</div>
                <button className={`${style.loginButton} ${style.marginTop30}`}
                >RE-ENTER USERNAME</button>
                <button className={`${style.loginButton} ${style.marginTop10}`}
                >OPEN SUPPORT TICKET</button>
                <button className={`${style.loginButton} ${style.marginTop10}`}
                >CONTACT SUPPORT</button>

                <img src={CompletedIcon} alt='' className={style.redWarningStyle} />
                <div className={`${style.regHeading} ${style.blackText} ${style.marginTop10} `}>SSO Access Successfully Activated For TimeSmartAI</div>
                <div className={`${style.failureCheckDesc} ${style.marginTop20}`}>Your Are Now All Set Up And Ready To Use Your TimeSmartAI Application With Your Single Sign-On Credentials</div>
                <button className={`${style.loginButton} ${style.marginTop30}`}
                >GO TO TIMESMARTAI</button>
                <button className={`${style.loginButton} ${style.marginTop10}`}
                >EXIT</button> */}

        {/* .
                .......
                ..........
                            DO NOT REMOVE THE ABOVE CODE 
                ..........
                .......
                .....*/}
      </div>
    </div>
  )
}

export default ActivateAccess;