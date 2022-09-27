import React,{useState} from 'react';
import {Icon, Intent} from '@blueprintjs/core';
import style from './index.module.scss';
import Step1 from './../../images/step1.png';
import Step2 from './../../images/step2.png';
import Step3 from './../../images/step3.png';
import Step4 from './../../images/step4.png';
import Step5 from './../../images/step5.png';
import EntitySetup from './entitySetup';
import SiteInformation from './siteInformation';
import SiteUser from './siteUsers';
import Billing from './appSubscription';

const EntityStepper = () => {
  const [stepCount,setstepCount] = useState('1');
  const onSaveInProgress = () => {

  };
  const saveToStorage = () => {

  };

  return(
    <div className={style.entitySetupBackground}>
      <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} />
      <div className={style.stepperMargin}>
          <div className={style.stepperGrid}>
              <div>
                  <div className={`${style.stepperImgBackground} ${style.activeStepperStyle}`}>
                      <img src={Step1} alt="Step1" className={style.stepperImgStyle} />
                  </div>
                  <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
              </div>
              {/* <div>
                  <div className={style.stepperImgBackground}>
                      <img src={Step2} alt="Step2" className={style.stepperImgStyle} />
                  </div>
                  <p className={style.entityTextColor}>ENTITY SYSTEM ADMIN</p>
              </div> */}
              <div>
                  <div className={style.stepperImgBackground}>
                      <img src={Step3} alt="Step3" className={style.stepperImgStyle} />
                  </div>
                  <p className={style.entityTextColor}>SITES FOR APP USE</p>
              </div>
              <div>
                  <div className={style.stepperImgBackground}>
                      <img src={Step4} alt="Step4" className={style.stepperImgStyle} />
                  </div>
                  <p className={style.entityTextColor}>APP USERS</p>
              </div>
              <div>
                  <div className={style.stepperImgBackground}>
                      <img src={Step5} alt="Step5" className={style.stepperImgStyle} />
                  </div>
                  <p className={style.entityTextColor}>APP SUBSCRIPTION</p>
              </div>
          </div>
          <div className={style.stepperDivider}></div>
      </div>
      <div>
        {
          stepCount === '1' ? <EntitySetup /> : stepCount === '2' ? <SiteInformation />: stepCount === '3' ? <SiteUser /> : <Billing />
        }
      </div>
      <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
          <button className={style.outlinedButton} onClick={onSaveInProgress}>SAVE IN-PROGRESS</button>
          <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={()=>{saveToStorage();setstepCount(stepCount+1);}}>CONTINUE</button>
      </div>
    </div>
  )
}

export default EntityStepper;
