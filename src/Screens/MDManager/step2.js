import React from 'react';
import style from './index.module.scss';

const MDManagerStep2 = ({ setStep2, setStep3 }) => {
    return (
        <div className={style.stepsBackground}>
            <div className={`${style.stepHeader} ${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={style.displayInRow}>
                    <div className={`${style.stepNumber} ${style.marginLeft10}`}>Step 2</div>
                    <div className={`${style.stepHeading} ${style.marginLeft20}`}>Review Medical Directive</div>
                </div>
                <div className={style.displayInRow}>
                    <div className={`${style.spaceBetween}`}>
                        <button className={`${style.outlinedButtonMd} ${style.marginRight} `} onClick={() => { setStep2(false) }} >SAVE IN PROGRESS</button>
                        <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { setStep2(false); setStep3(true) }} >CONTINUE</button>
                    </div>
                </div>
            </div>
            <div className={style.stepContentCard}>
                <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter}`}>
                    <div className={style.stepsTitleText}>Medical Directive Meta Data</div>
                </div>
            </div>
        </div>
    )
}

export default MDManagerStep2;