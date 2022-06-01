import React, { useState, useMemo, useCallback } from 'react';
import { InputGroup, Icon, Intent, Switch, TagInput, Checkbox } from '@blueprintjs/core';
import DatalistInput from 'react-datalist-input';
import {Link} from 'react-router-dom';
import Step1 from './../../images/step12.png';
import Step2 from './../../images/step22.png';
import Step3 from './../../images/step3.png';
import Step4 from './../../images/step4.png';
import Step5 from './../../images/step5.png';
import UploadImg from './../../images/uploadImg.png';
import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';

const VALUES = ['Department 1', "Department 2", "Department 3"];

const EntitySystemAdmin = () => {
    const [tags, setTags] = useState(VALUES);
    const [departmentSpecific, setDepartmentSpecific] = useState(true);
    const [selectDepartment, setSelectDepartment] = useState('');
    const [item, setItem] = useState();

    const options = [
        { name: 'Department 1' },
        { name: 'Department 2' },
        { name: 'Department 3' },
      ];

      const onSelect = useCallback((selectedItem) => {
        console.log('selectedItem', selectedItem);
        setItem(selectedItem);
        setSelectDepartment('');
      }, []);

    const handleTagsAdd = values => {
        setTags([...tags, values]);
    };

    const getTagProps = (_v, index) => ({
        minimal: true,
    });

    const handleTagsRemove = (tags, index) => {
        const updatedTags = [tags];
        updatedTags.splice(index, 1);
        tags = updatedTags;
        setTags(tags);
      };

      const items = useMemo(
        () =>
          options.map((option) => ({
            id: option.name,
            value: option.name,
            ...option,
          })),
        [item],
      );

    return(
        <div className={style.entitySetupBackground}>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} />
            <div className={style.stepperMargin}>
                <div className={style.stepperGrid}>
                    <div>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                            <img src={Step1} alt="Step1" className={style.stepperImgStyle} /> 
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
                    </div>
                    <div>
                        <div className={`${style.stepperImgBackground} ${style.activeStepperStyle} `}>
                            <img src={Step2} alt="Step2" className={style.stepperImgStyle} /> 
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>ENTITY SYSTEM ADMIN</p>
                    </div>
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
                        <p className={style.entityTextColor}>SITE USERS</p>
                    </div>
                    <div>
                        <div className={style.stepperImgBackground}>
                            <img src={Step5} alt="Step5" className={style.stepperImgStyle} /> 
                        </div>
                        <p className={style.entityTextColor}>APP SUBSCRIPTION</p>
                    </div>
                </div>
                <div className={style.stepperDivider2}></div>
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
                                    <InputGroup className={style.textFieldWidth} value="First Name" />
                                    <InputGroup className={`${style.textFieldWidth} ${style.marginLeft20}`} value="State" />
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Functional Title*</div>
                                <div className={`${style.leftAlign} `}>
                                    <select
                                        name="class"
                                        id="Class"
                                        className={style.twoFieldWidth}>
                                            <option value="title" >
                                            title
                                            </option>
                                    </select>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Email Address*</div>
                                <InputGroup value="Email@lorem.com" className={`${style.twoFieldWidth}`}/>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Cell Phone</div>
                                <InputGroup value="+1 (342) 444-5505" className={`${style.twoFieldWidth}`}/>
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