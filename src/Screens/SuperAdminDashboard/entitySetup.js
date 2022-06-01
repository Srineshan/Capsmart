import React, { useState, useMemo, useCallback } from 'react';
import { InputGroup, Icon, Intent, Switch, TagInput } from '@blueprintjs/core';
import {Link} from 'react-router-dom';
import DatalistInput from 'react-datalist-input';
import Step1 from './../../images/step1.png';
import Step2 from './../../images/step2.png';
import Step3 from './../../images/step3.png';
import Step4 from './../../images/step4.png';
import Step5 from './../../images/step5.png';
import UploadImg from './../../images/uploadImg.png';
import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';

const VALUES = ['Department 1', "Department 2", "Department 3"];

const EntitySetup = () => {
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
                        <div className={`${style.stepperImgBackground} ${style.activeStepperStyle}`}>
                            <img src={Step1} alt="Step1" className={style.stepperImgStyle} /> 
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
                    </div>
                    <div>
                        <div className={style.stepperImgBackground}>
                            <img src={Step2} alt="Step2" className={style.stepperImgStyle} /> 
                        </div>
                        <p className={style.entityTextColor}>ENTITY SYSTEM ADMIN</p>
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
                <div className={style.stepperDivider}></div>
            </div>
            <div className={style.entitySetupCardStyle}>
                <p className={style.heading}>Entity Setup</p>
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
                            <div className={style.spaceBetween}>
                                <div className={style.displayInRow}>
                                    <img src={UploadImg} alt="Upload" className={style.companyLogoUpload} />
                                    <p className={style.uploadText}>Click To Upload Company Logo</p>
                                    <img src={UploadImg} alt="Upload" className={style.logoThumbnailUpload} />
                                    <p className={style.uploadText}>Click To Upload Logo Thumbnail</p>
                                </div>
                                <div>
                                    <button className={style.entityIDButton}><span>ENTITY ID:</span>3578689</button>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop30}`}>
                                <div className={style.extentionLableStyle}>Customer Type*</div>
                                <div className={`${style.leftAlign} `}>
                                    <select
                                        name="class"
                                        id="Class"
                                        className={style.twoFieldWidth}>
                                            <option value="HealthCare" >
                                            HealthCare
                                            </option>
                                    </select>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>NPIN*</div>
                                <InputGroup className={style.fourFieldWidth} value="Alphanumeric" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Entity Name*</div>
                                <InputGroup value="hospital" className={`${style.twoFieldWidth}`}/>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop30}`}>
                                <div className={style.extentionLableStyle}>Entity Type*</div>
                                <div className={`${style.leftAlign} `}>
                                    <select
                                        name="class"
                                        id="Class"
                                        className={style.twoFieldWidth}>
                                            <option value="Doctor Office" >
                                            Doctor Office
                                            </option>
                                    </select>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Mailing Address*</div>
                                <div>
                                    <InputGroup value="Street 8 Block 7" className={`${style.fullWidth}`}/>
                                    <div className={`${style.marginTop20} ${style.displayInRow}`}>
                                        <InputGroup value="Pincode Value" className={`${style.fourFieldWidth}`}/>
                                        <InputGroup value="City Value" className={`${style.fourFieldWidth} ${style.marginLeft20}`}/>
                                        <InputGroup value="State Value" className={`${style.fourFieldWidth} ${style.marginLeft20}`}/>
                                        <InputGroup value="Country Value" className={`${style.fourFieldWidth} ${style.marginLeft20}`}/>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Website URL*</div>
                                <InputGroup value="http://regington.net" className={`${style.fullWidth}`}/>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Multi-site Entity*</div>
                                <div>
                                    <div className={style.displayInRow}>
                                        <Switch checked={true} label={'YES'} className={`${style.marginTop} ${style.textAlignLeft}`}  />
                                        <div className={`${style.extentionLableStyle} ${style.marginLeft20}`}>Primary Site To Use App*</div>
                                        <Switch checked={true} label={'YES'} className={`${style.marginTop} ${style.textAlignLeft} ${style.marginLeft20}`}  />
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Setup Department*</div>
                                <div>
                                    <div className={style.displayInRow}>
                                        <Switch checked={departmentSpecific} label={departmentSpecific ? 'YES' : "NO"} className={`${style.marginTop} ${style.textAlignLeft}`} onChange={() => setDepartmentSpecific(!departmentSpecific)}  />
                                        {departmentSpecific && (
                                            <>
                                                <DatalistInput items={items} placeholder="Select Sites" onSelect={onSelect} onChange={(e) => setSelectDepartment(e.target.value) } className={`${style.fullWidth} ${style.marginLeft20}`} />
                                                <div className={`${style.addSymbolStyle} ${style.marginLeft20}`}><span className={style.plusSymbolPosition}>+</span></div>
                                            </>
                                        )}
                                    </div>
                                    {departmentSpecific && (
                                        <TagInput
                                            placeholder="Enter tags/keywords relative to the post"
                                            values={tags}
                                            className={`${style.marginTop20} ${style.tagInputStyle}`}
                                            onAdd={handleTagsAdd}
                                            onRemove={handleTagsRemove}
                                            separator={/[\s,]/}
                                            addOnBlur={true}
                                            addOnPaste={true}
                                            tagProps={getTagProps}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                            <button className={style.outlinedButton}>SAVE IN-PROGRESS</button>
                            <Link to={'/entitySystemAdmin'}>
                                <button className={`${style.buttonStyle} ${style.marginLeft20}`}>CONTINUE</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EntitySetup;