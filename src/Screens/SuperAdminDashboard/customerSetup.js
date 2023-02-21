import React, { useState, useEffect } from 'react';
import { Icon, Intent } from '@blueprintjs/core';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from 'react-router-dom';
import WelcomeImg from './../../images/welcomeNewAccountImg.png';
import style from './index.module.scss';
import { ErrorToaster } from './../../utils/toaster';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import { GET } from '../dataSaver';

const CustomerSetup = () => {
    const [selectedContractType, setSelectedContractType] = useState({ contract: false, trial: false });
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState('');
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        getPartners();
    }, []);

    const getPartners = async (industryId) => {
        const { data: partners } = await GET(`entity-service/partners`);
        setPartners(partners);
    };

    const navigate = useNavigate();
    const handleContractType = (value, type) => {
        if (value && type === 'contract') {
            sessionStorage.setItem('type', 'contract');
            setSelectedContractType({ contract: true, trial: false });
        } if (value && type === 'trial') {
            sessionStorage.setItem('type', 'trial');
            setSelectedContractType({ contract: false, trial: true });
        }
    }

    const handlePartnerSelection = (value) => {
        if (value) {
            sessionStorage.setItem('selectedPartner', value);
            setSelectedPartner(value);
        }
    }

    const handleContinue = () => {
        if (!selectedContractType?.contract && !selectedContractType?.trial) {
            ErrorToaster('Select a Subscription Plan to proceed');
            return;
        } else {
            navigate('/entitySetup/new');
        }
    }

    return (
        <>
            {!showWelcomeScreen ? (
                <div className={`${style.welcomePadding} ${style.addContractBody}`}>
                    <div className={style.spaceBetween}>
                        <p className={style.welcomeStyle}>Welcome to the Customer Setup Wizard</p>
                        <Icon icon="cross" size={25} intent={Intent.DANGER} className={style.crossStyleWelcomePage} onClick={() => window.history.back()} />
                    </div>
                    <div className={style.welcomeBorder}></div>
                    <div className={style.welcomeMessage}>
                        This wizard will guide you step by step for adding a new customer. Follow the prompts and make the necessary selection in order to proceed to the next steps.
                    </div>
                    <div className={`${style.contractOptions} ${style.alignCenter}`}>
                        <div className={style.displayInRow}>
                            <p className={style.selectLable}>Select the Partner to add</p>
                            <CommonSelectField value={selectedPartner || ''}
                                onChange={(e) => handlePartnerSelection(e.target.value)}
                                className={`${style.addContractTextFieldWidth} ${style.marginLeft20}`}
                                firstOptionLabel={'Select Partner'} firstOptionValue={''}
                                valueList={partners?.map(data => data?.partnerId?.id)}
                                labelList={partners?.map(data => data?.partnerName)}
                                disabledList={partners?.map(data => false)}
                            />
                        </div>
                    </div>
                    <div className={`${style.nextButtonPosition} ${style.marginTop20}`}>
                        <button className={(selectedPartner !== '') ? style.nextButton : style.nextButtonDisabled} disabled={(selectedPartner === '') ? true : false} onClick={() => { setShowWelcomeScreen(true) }}>NEXT</button>
                    </div>
                </div>
            ) : (
                <div className={style.welcomeBackground}>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} onClick={() => setShowWelcomeScreen(false)} />
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
                                        <FormControlLabel checked={selectedContractType?.contract} control={<Checkbox value="Contract Account" color="default" onChange={(e) => handleContractType(e.target.checked, 'contract')} />} label="Contract Account"
                                            sx={{
                                                color: 'white'
                                            }} />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormControlLabel checked={selectedContractType?.trial} control={<Checkbox value="Trial account" color="default" onChange={(e) => handleContractType(e.target.checked, 'trial')} />} label="Trial account"
                                            sx={{
                                                color: 'white',
                                            }} />
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                        <div className={style.marginTop50}>
                            <Link to={'/activeCustomers'}>
                                <button className={`${style.outlinedWelcomeButton} ${style.cursor}`}>CANCEL</button>
                            </Link>
                            <button className={`${style.welcomeButton} ${style.marginLeft20} ${style.cursor}`} onClick={handleContinue}>CONTINUE</button>

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CustomerSetup;
