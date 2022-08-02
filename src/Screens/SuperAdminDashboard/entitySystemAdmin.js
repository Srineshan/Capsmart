import React, { useState, useMemo, useCallback } from 'react';
import { InputGroup, Icon, Intent, Switch, TagInput, Checkbox } from '@blueprintjs/core';
import DatalistInput from 'react-datalist-input';
import {Link} from 'react-router-dom';
import Step1 from './../../images/step12.png';
import Step2 from './../../images/step22.png';
import Step3 from './../../images/step34.png';
import Step4 from './../../images/step4.png';
import Step5 from './../../images/step5.png';
import UploadImg from './../../images/uploadImg.png';
import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';


const EntitySystemAdmin = ({getActiveStep}) => {
  const [billingAddress,setBillingAddress] = useState({fname:'',lname:'',title:'',email:'',phone:0})
  const handleBillingData = (name,value) => {
    setBillingAddress({...billingAddress,[name]:value});
  }

    return(
        <div className={style.entitySetupBackground}>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} />
            <div className={style.stepperMargin}>
                <div className={style.stepperGrid}>
                    <div onClick={() => getActiveStep('entitySetup')}>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                            <img src={Step1} alt="Step1" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
                    </div>
                    <div onClick={() => getActiveStep('siteInformation')}>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle} `}>
                            <img src={Step3} alt="Step2" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>SITES FOR APP USE</p>
                    </div>
                    <div onClick={() => getActiveStep('entitySystemAdmin')}>
                        <div className={`${style.stepperImgBackground} ${style.activeStepperStyle}`}>
                            <img src={Step2} alt="Step3" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>ENTITY SYSTEM ADMIN</p>
                    </div>
                    <div onClick={() => getActiveStep('siteUsers')}>
                        <div className={style.stepperImgBackground}>
                            <img src={Step4} alt="Step4" className={style.stepperImgStyle} />
                        </div>
                        <p className={style.entityTextColor}>APP USERS</p>
                    </div>
                    <div onClick={() => getActiveStep('appSubscription')}>
                        <div className={style.stepperImgBackground}>
                            <img src={Step5} alt="Step5" className={style.stepperImgStyle} />
                        </div>
                        <p className={style.entityTextColor}>APP SUBSCRIPTION</p>
                    </div>
              </div>
                <div className={style.stepperDivider3}></div>
            </div>
            <div className={style.entitySetupCardStyle}>
                <p className={style.heading}>Entity System Admin</p>
                <div className={style.greyBorder}></div>
                <div className={style.entityDescription}>
                Help lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus
                quam nec tellus dictum, vitae ultrices urna porttitor. donec commodo tellus
                dapibus semper mattis. aenean ut massa vitae tortor consequat tristique. etiam
                eget condimentum sapien. morbi est ante, sagittis ac rhoncus eget, faucibus ut
                felis. pellentesque iaculis aliquam massa. lorem ipsum dolor sit amet, consectetur
                adipiscing elit. sed finibus quam nec tellus dictum.
                </div>
                <div>
                    <div className={style.cloneBlockStyle}>
                        <div className={`${style.newContractFromCloneBoxStyle}`}>
                            <div className={style.textAlignLeft}>
                                <Checkbox label="DESIGNATE CUSTOMER ACCOUNT MANAGER" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop30}`}>
                                <div className={style.extentionLableStyle}>Available Account Manager*</div>
                                <div className={`${style.leftAlign} `}>
                                    <select
                                        name="class"
                                        id="Class"
                                        className={style.fullWidth}>
                                            <option value="Select Account Manager" >
                                            Select Account Manager
                                            </option>
                                    </select>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop30}`}>
                                <div className={style.extentionLableStyle}>App User Role*</div>
                                <div className={`${style.leftAlign} `}>
                                    <select
                                        name="class"
                                        id="Class"
                                        className={style.fullWidth}>
                                            <option value="HealthCare" >
                                            Eg. Account manager/ super sys admin/ customer support staff
                                            </option>
                                    </select>
                                </div>
                            </div>
                            <div className={`${style.textAlignLeft} ${style.marginTop20}`}>
                                <Checkbox checked label="CREATE ENTITY USER WITH SYS ADMIN PROFILE*" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>NAME*</div>
                                <div className={style.displayInRow}>
                                    <InputGroup className={style.textFieldWidth} placeholder="First Name" value={billingAddress.fname} onChange={(e)=>handleBillingData('fname',e.target.value)}/>
                                    <InputGroup className={`${style.textFieldWidth} ${style.marginLeft20}`} value={billingAddress.lname} placeholder="Last Name" onChange={(e)=>handleBillingData('lname',e.target.value)} />
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Functional Title*</div>
                                <div className={`${style.leftAlign} `}>
                                    <select
                                        name="class"
                                        id="Class"
                                        value={billingAddress.title}
                                        onChange={(e)=>handleBillingData('title',e.target.value)}
                                        className={style.twoFieldWidth}>
                                        <option value="select title" >
                                        select title
                                        </option>
                                            <option value="title" >
                                            title
                                            </option>
                                    </select>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Email Address*</div>
                                <InputGroup placeholder="Email@lorem.com" className={`${style.twoFieldWidth}`} value={billingAddress.email} onChange={(e)=>handleBillingData('email',e.target.value)}/>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Cell Phone</div>
                                <InputGroup placeholder="9756315505" className={`${style.twoFieldWidth}`} value={billingAddress.phone} onChange={(e)=>handleBillingData('phone',e.target.value)}/>
                            </div>
                        </div>
                        <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                            <button className={style.outlinedButton}>SAVE IN-PROGRESS</button>
                            <Link to={'/siteInformation'}>
                                <button className={`${style.buttonStyle} ${style.marginLeft20}`}>CONTINUE</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EntitySystemAdmin;
