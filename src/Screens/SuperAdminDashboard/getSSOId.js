import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TimeSmartLogo from './../../images/timeSmartAILogo.png';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import CommonLabel from '../../Components/CommonFields/CommonLabel';

import style from './index.module.scss';

const GetSSOId = () => {
    const { ssoId } = useParams();
    const [ssoIdValue, setSsoIdValue] = useState('');

    const handleSubmit = () => {

    }

    return (
        <div className={style.fullHeight}>
            <div className={`${style.justifyCenter} ${style.verticalAlignCenter}`}>
                <div>
                    <div className={style.spaceBetween}>
                        <img src={TimeSmartLogo} alt="" className={style.getSSOPageLogo} />
                        <img src={TimeSmartLogo} alt="" className={style.getSSOPageLogo} />
                    </div>
                    <div className={`${style.getSSOIdHeaderBox} ${style.marginTop} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
                        <div className={style.getSSOIdHeading}>Enter SSO ID</div>
                    </div>
                    <div className={style.getSSOIdBox}>
                        <div className={`${style.addManagerGrid} ${style.padding20}`}>
                            <CommonLabel value='Enter SSO ID*' />
                            <div className={style.displayInRow}>
                                <CommonInputField className={style.fullWidth}
                                    value={ssoIdValue} onChange={(e) => setSsoIdValue(e.target.value)} />
                            </div>
                        </div>
                        <div className={style.padding20}>
                            <button className={`${style.newContractButtonStyle}  ${style.cursorPointer} ${style.floatRight}`}
                                onClick={() => handleSubmit()}
                            >Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GetSSOId;