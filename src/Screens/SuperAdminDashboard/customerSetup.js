import React from 'react';
import { Icon, Intent } from '@blueprintjs/core';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import {Link} from 'react-router-dom';
import WelcomeImg from './../../images/welcomeNewAccountImg.png';
import style from './index.module.scss';

const CustomerSetup = () => {

    return(
        <div className={style.welcomeBackground}>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} />
            <div className={style.welcomeContentMargin}>
                <div className={style.welcomeHeading}>
                WELCOME TO TIMESMARTAI
                </div>
                <div className={style.customerSetupText}>CUSTOMER SETUP WIZARD</div> 
                <div className={style.alignCenter}>
                    <img src={WelcomeImg} alt="Welcome Img" className={style.welcomeAccountImgStyle} />
                </div>
                <div className={`${style.welcomeDescription} ${style.marginTop30}`}>
                {`This setup wizard will guide you to quickly activate your account. Once your 
                account is activated you will be able to invite other users from your organization. 
                Experience the difference in better managing contractor activity logs and timesheet 
                processing. Refer to the quick <Setup Guide> or <Setup Tutorial> to see how easy it 
                is to activate a customer account.`}
                </div>
                <div className={`${style.welcomeDescription} ${style.marginTop20}`}>
                {`If you experience any problems or have questions,
                do not hesitate to reach out to our TimeSmartAI support team - <support@timesmart.ai>`}
                </div>
                {/* <div className={`${style.spaceBetween} ${style.welcomeDescription} ${style.marginTop20}`}>
                    Your customer acc manager details:
                    <div className={`${style.managerDetails} ${style.marginLeft20}`}>
                        <div className={style.managerFieldGrid}>
                            <div className={style.managerLabelStyle}>MANAGER NAME:</div>
                            <div className={style.managerFieldValueStyle}>Velroy</div>
                        </div>
                        <div className={style.managerFieldGrid}>
                            <div className={style.managerLabelStyle}>EMAIL ADDRESS:</div>
                            <div className={style.managerFieldValueStyle}>velroy@sure-shield.com</div>
                        </div>
                        <div className={style.managerFieldGrid}>
                            <div className={style.managerLabelStyle}>PHONE NO:</div>
                            <div className={style.managerFieldValueStyle}>387646982</div>
                        </div>
                    </div>
                </div> */}
                <div>
                    <div className={style.welcomeHeading}>
                    SELECT SUBSCRIPTION PLAN
                    </div>
                    <div className={style.justifyCenter}>
                        <div className={`${style.textAlignLeft} ${style.marginTop20}`}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox value="Contract Account" color="default" />} label="Contract Account"
                                    sx={{
                                        color: 'white'
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox value="Trial account" color="default" />} label="Trial account"
                                    sx={{
                                        color: 'white',
                                    }} />
                            </FormGroup>
                        </div>
                    </div>
                </div>
                <div className={style.marginTop50}>
                    <button className={`${style.outlinedWelcomeButton} ${style.cursor}`}>CANCEL</button>
                    <Link to={'/entitySetup'}>
                        <button className={`${style.welcomeButton} ${style.marginLeft20} ${style.cursor}`}>CONTINUE</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CustomerSetup;