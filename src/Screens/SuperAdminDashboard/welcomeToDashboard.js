import React from 'react';
import { Icon, Intent } from '@blueprintjs/core';
import {Link} from 'react-router-dom';
import WelcomeImg from './../../images/welcomeNewAccountImg.png';
import style from './index.module.scss';

const WelcomeToDashboard = () => {

    return(
        <div className={style.welcomeBackground}>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} />
            <div className={style.welcomeToDashboardContentMargin}>
                <div className={style.completedHeading}>
                WELCOME TO TIMESMARTAI
                </div>
                <div className={style.accountTypeStyle}>Trial Account</div>
                <div className={style.alignCenter}>
                    <img src={WelcomeImg} alt="Welcome Img" className={style.welcomeDashboardImgStyle} />
                </div>
                <div className={`${style.welcomeDescription} ${style.marginTop20}`}>
                {`This setup wizard will guide you to quickly activate your account. Once your
                account is activated you will be able to invite other users from your organization.
                Experience the difference in better managing contractor activity logs and timesheet
                processing. Refer to the quick <Setup Guide> or <Setup Tutorial> to see how easy it
                is to activate a customer account.`}
                </div>
                <div className={`${style.welcomeDescription}`}>
                {`If you experience any problems or have questions,
                do not hesitate to reach out to our TimeSmartAI support team - <support@timesmart.ai>`}
                </div>
                <div className={style.alignCenter}>
                    <div className={style.trialPlanCard}>
                        <div className={`${style.trialGrid}`}>
                            <div className={style.extentionLableStyle}>Subscription Plan *</div>
                            <p>Trial Plan</p>
                        </div>
                        <div className={`${style.trialGrid}`}>
                            <div className={style.extentionLableStyle}>Trial Period *</div>
                            <p>7 Days</p>
                        </div>
                        <div className={`${style.trialGrid}`}>
                            <div className={style.extentionLableStyle}>Trial Start Date</div>
                            <p>02-16-2022 - 02-24-2022</p>
                        </div>
                        <div className={`${style.trialGrid}`}>
                            <div className={style.extentionLableStyle}>Trial Contact Name</div>
                            <p>Swati BHOSLE</p>
                        </div>
                        <div className={`${style.trialGrid}`}>
                            <div className={style.extentionLableStyle}>Email*</div>
                            <p>swati@timesmart.ai</p>
                        </div>
                        <div className={`${style.trialGrid}`}>
                            <div className={style.extentionLableStyle}>Cell Phone</div>
                            <p>+1 (342) 444-5505</p>
                        </div>
                    </div>
                </div>
                <div className={style.marginTop30}>
                    <button className={`${style.outlinedWelcomeButton} ${style.cursor}`}>CANCEL</button>
                    <Link to={'/entitySetup'}>
                        <button className={`${style.welcomeButton} ${style.marginLeft20} ${style.cursor}`}>CONTINUE</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default WelcomeToDashboard;
