import React, { useState, useMemo, useCallback } from 'react';
import { InputGroup, Icon, Intent, Switch, TagInput, Dialog, Classes } from '@blueprintjs/core';
import DatalistInput from 'react-datalist-input';
import {Link} from 'react-router-dom';
import Step1 from './../../images/step12.png';
import Step2 from './../../images/step23.png';
import Step3 from './../../images/step34.png';
import Step4 from './../../images/step44.png';
import Step5 from './../../images/step5.png';
import CloudUpload from './../../images/cloudUpload.png';
import HourglassImg from './../../images/hourglassImg.png';
import UploadedImg from './../../images/uploadedImage.png';
import Download from './../../images/download.png';

import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';

const VALUES = ['Site 1', "Site 1", "Site", 'Site 1'];
const SiteUsers = () => {

    const [tags, setTags] = useState(VALUES);
    const [departmentSpecific, setDepartmentSpecific] = useState(true);
    const [showUserTable, setShowUserTable] = useState(false);
    const [selectDepartment, setSelectDepartment] = useState('');
    const [siteID, setSiteID] = useState('3578689');
    const [alertDialog, setAlertDialog] = useState(false);
    const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
    const [showUploading, setShowUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [item, setItem] = useState();

    const options = [
        { name: 'Site 1' },
        { name: 'Site 2' },
        { name: 'Site 3' },
        { name: 'Site 4' },
        { name: 'Site 5' },
        { name: 'Site 6' },
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
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle} `}>
                            <img src={Step2} alt="Step2" className={style.stepperImgStyle} /> 
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>ENTITY SYSTEM ADMIN</p>
                    </div>
                    <div>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle} `}>
                            <img src={Step3} alt="Step3" className={style.stepperImgStyle} /> 
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>SITES FOR APP USE</p>
                    </div>
                    <div>
                        <div className={`${style.stepperImgBackground} ${style.activeStepperStyle} `}>
                            <img src={Step4} alt="Step4" className={style.stepperImgStyle} /> 
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>SITE USERS</p>
                    </div>
                    <div>
                        <div className={style.stepperImgBackground}>
                            <img src={Step5} alt="Step5" className={style.stepperImgStyle} /> 
                        </div>
                        <p className={style.entityTextColor}>APP SUBSCRIPTION</p>
                    </div>
                </div>
                <div className={style.stepperDivider4}></div>
            </div>
            {!showUserTable ? (
                <div className={style.entitySetupCardStyle}>
                    <p className={style.heading}>Add Registered Users</p>
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
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Is App User A Contractor? *</div>
                                    <div className={style.displayInRow}>
                                        <Switch checked label={'YES'} className={`${style.marginTop} ${style.textAlignLeft} ${style.fourFieldWidth}`}  />
                                        <select
                                            name="class"
                                            id="Class"
                                            className={`${style.twoFieldWidth} ${style.marginLeft20}`}>
                                                <option value="Select Contractor" >
                                                Select Contractor
                                                </option>
                                        </select>
                                        <p className={`${style.fourFieldWidth}`}></p>
                                    </div>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Name*</div>
                                    <div className={`${style.displayInRow}`}>
                                        <InputGroup value="First Name" className={`${style.fourFieldWidth}`}/>
                                        <InputGroup value="LAST NAME" className={`${style.fourFieldWidth} ${style.marginLeft20}`}/>
                                        <InputGroup value="Suffix" className={`${style.fourFieldWidth} ${style.marginLeft20}`}/>
                                        <p className={`${style.fourFieldWidth}`}></p>
                                    </div>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Functional Title *</div>
                                    <select
                                        name="class"
                                        id="Class"
                                        className={style.fullWidth}>
                                            <option value="Select" >
                                            Select
                                            </option>
                                    </select>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Email Address*</div>
                                    <InputGroup value="Email" className={`${style.twoFieldWidth}`}/>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Cell Phone</div>
                                    <InputGroup value="+1 (342) 444-5505" className={`${style.twoFieldWidth}`}/>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Specific Site Access*</div>
                                    <div>
                                        <div className={style.displayInRow}>
                                            <Switch checked={departmentSpecific} label={departmentSpecific ? 'YES' : "NO"} className={`${style.marginTop} ${style.textAlignLeft}`} onChange={() => setDepartmentSpecific(!departmentSpecific)}  />
                                            {departmentSpecific && (
                                                <>
                                                    <DatalistInput items={items} placeholder="Select sites" onSelect={onSelect} onChange={(e) => {setSelectDepartment(e.target.value); setSiteID('XX689- 64768')} } className={`${style.fullWidth} ${style.marginLeft20} ${style.textAlignLeft}`} />
                                                    <div className={`${style.addSymbolStyle} ${style.marginLeft20}`}><span className={style.plusSymbolPosition}>+</span></div>
                                                </>
                                            )}
                                        </div>
                                        {selectDepartment.length !== 0 && (
                                            <div className={`${style.reqDeptCard} ${style.marginTop}`}>
                                                <div className={style.addBoxDescription}>
                                                The Department you are trying to add is not on the list. 
                                                To add a new department enter the exact name below and click
                                                on the "REQUEST & ADD" button.
                                                </div>
                                                <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                                    <InputGroup value="Department New" className={style.threeFieldWidth} />
                                                    <button className={`${style.reqButton} ${style.marginLeft20}`} onClick={() => {handleTagsAdd('Department New')}}>REQUEST & ADD</button>
                                                </div>
                                            </div>
                                        )}
                                        {departmentSpecific && (
                                            <TagInput
                                                placeholder="Enter tags/keywords relative to the post"
                                                values={tags}
                                                className={`${style.marginTop20} ${style.tagInputStyle}`    }
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
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Sys admin access*</div>
                                    <Switch checked label={'YES'} className={`${style.marginTop} ${style.textAlignLeft} ${style.fourFieldWidth}`}  />
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Other App Role*</div>
                                    <div className={`${style.leftAlign} `}>
                                        <select
                                            name="class"
                                            id="Class"
                                            className={style.fullWidth}>
                                                <option value="Select" >
                                                Select
                                                </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={style.spaceBetween}>
                                <div className={`${style.marginTop20} ${style.buttonPositionLeft}`}>
                                    <button className={style.outlinedButton}>BULK UPLOAD</button>
                                </div>
                                <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                                    <button className={style.outlinedButton}>SAVE IN-PROGRESS</button>
                                    <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => setShowUserTable(true)}>SAVE & ADD MORE</button>
                                    <Link to={'/appSubscription'}>
                                        <button className={`${style.buttonStyle} ${style.marginLeft20}`}>CONTINUE</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={style.entitySetupCardStyle}>
                    <p className={style.heading}>Registered App Users</p>
                    <div className={`${style.floatRight} ${style.siteButtonPosition}`}>
                        <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} >ADD USERS</button>
                        <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} onClick={() => setShowBulkUploadDialog(true)}>BULK UPLOAD</button>
                    </div>
                    <div className={style.greyBorder}></div>
                    <div className={style.tableHeight}>
                        <div className={`${style.tableHeader} ${style.marginTop20}`}>
                            <p className={style.tableHeaderFontStyle}>USER NAME</p>
                            <p className={style.tableHeaderFontStyle}>SUFFIX</p>
                            <p className={style.tableHeaderFontStyle}>TITLE</p>
                            <p className={style.tableHeaderFontStyle}>SITES</p>
                            <p className={style.tableHeaderFontStyle}>SYS ADMIN</p>
                            <p className={style.tableHeaderFontStyle}>OTHER ROLE</p>
                            <p className={style.tableHeaderFontStyle}>SOURCE</p>
                        </div>
                        <div className={`${style.tableData} ${style.displayInCol}`} >
                            <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                <p className={style.tableDataFontStyle}>RAJ</p>
                                <p className={style.tableDataFontStyle}>CO</p>
                                <p className={style.tableDataFontStyle}>HOD</p>
                                <p className={style.tableDataFontStyle}>3</p>
                                <p className={style.tableDataFontStyle}>YES</p>
                                <p className={style.tableDataFontStyle}>Approver</p>
                                <p className={style.tableDataFontStyle}>Upload</p>
                            </div>
                        </div>
                        <div className={`${style.tableData} ${style.displayInCol}`} >
                            <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                <p className={style.tableDataFontStyle}>RAJ</p>
                                <p className={style.tableDataFontStyle}>DC</p>
                                <p className={style.tableDataFontStyle}>MD</p>
                                <p className={style.tableDataFontStyle}>3</p>
                                <p className={style.tableDataFontStyle}>NO</p>
                                <p className={style.tableDataFontStyle}>Reviewer</p>
                                <p className={style.tableDataFontStyle}>Manual</p>
                            </div>
                        </div>
                        <div className={`${style.tableData} ${style.displayInCol}`} >
                            <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                <p className={style.tableDataFontStyle}>RAJ</p>
                                <p className={style.tableDataFontStyle}>AC</p>
                                <p className={style.tableDataFontStyle}>SURGEON</p>
                                <p className={style.tableDataFontStyle}>3</p>
                                <p className={style.tableDataFontStyle}>YES</p>
                                <p className={style.tableDataFontStyle}>Approver, Reviewer</p>
                                <p className={style.tableDataFontStyle}>Manual</p>
                            </div>
                        </div>
                    </div>
                    <div className={` ${style.floatRight} ${style.marginTop20} ${style.marginRightForPositionButton}`}>
                        <button className={style.outlinedButton}>SAVE IN-PROGRESS</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => setAlertDialog(true)}>CONTINUE</button>
                    </div>
                </div>
            )}
            <Dialog isOpen={alertDialog} onClose={() => setAlertDialog(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.cloneDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>SETUP ALERT</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.alertCrossStyle} onClick={() => setAlertDialog(false)}  />
                    </div>
                    <div className={style.extensionBorder}></div>
                    <p className={`${style.cloneContent} ${style.marginTop20}`}>Do you want to setup registered users for the different sites at this time?</p>
                    <div>
                        <div className={`${style.positionCenter} ${style.marginTop20}`}>
                            <button className={`${style.cloneOutlinedButton} ${style.cursorPointer} ${style.paddingTop5}`}>NO</button>
                            <Link to={'/entitySystemAdmin'}>
                                <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer} ${style.paddingTop5}`}>YES</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Dialog>
            <Dialog isOpen={showBulkUploadDialog} onClose={() => setShowBulkUploadDialog(false)} className={`${style.bulkUploadDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.bulkUploadDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>USERS BULK UPLOAD FOR CUSTOMER NAME</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.alertCrossStyle} onClick={() => setShowBulkUploadDialog(false)}  />
                    </div>
                    <div className={style.extensionBorder}></div>
                    <div className={`${style.dashborderStyle} ${style.marginTop20}`}>
                        <div className={style.alignCenter}>
                        {isUploaded ? (
                            <div onClick={() => setShowUploading(false)}>
                                <img src={UploadedImg} alt="done" className={style.uploadImgStyle} />
                                <p className={style.uploadTextStyle}>
                                20 RECORDS SUCCESSFULLY UPLOADED
                                </p>
                            </div>
                        ) : showUploading ? (
                            <div onClick={() => setIsUploaded(true)}>
                                <img src={HourglassImg} alt="hourGlass" className={style.uploadImgStyle} />
                                <p className={style.uploadTextStyle}>
                                5 OF 20 RECORD PROCESSING, 1 MIN LEFT...
                                </p>
                            </div>
                        ) : !showUploading ? (
                            <div onClick={() => setShowUploading(true)}>
                                <img src={CloudUpload} alt="cloud" className={style.uploadImgStyle} />
                                <p className={style.uploadTextStyle}>
                                DRAG AND DROP, OR CLICK TO UPLOAD THE EXCEL TEMPLATE
                                </p>
                            </div>
                        ) : ''}
                        </div>
                        {isUploaded && (
                            <div className={`${style.spaceBetween} ${style.reduceMarginTop}`}>
                                <div className={style.displayInRow}>
                                    <img src={Download} alt="download" className={style.downloadImageStyle} />
                                    <p className={style.failedTesxtColor}>5 RECORDS FAILED</p>
                                </div>
                                <p className={`${style.resetStyle} ${style.marginRight20}`}>RESET AND IMPORT AGAIN</p>
                            </div>
                        )}
                    </div>
                    <div className={`${style.uploadDescription} ${style.marginTop20}`}>
                        <p className={style.descriptionHeading}>INSTRUCTIONS FOR BULK UPLOAD</p>
                        <p className={style.uploadDescriptionText}>
                            Help lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            sed finibus quam nec tellus dictum, vitae ultrices urna porttitor. 
                            donec commodo tellus dapibus semper mattis. aenean ut massa vitae 
                            tortor consequat tristique. etiam eget condimentum sapien. morbi 
                            est ante, sagittis ac rhoncus eget, faucibus ut felis. pellentesque 
                            iaculis aliquam massa. lorem ipsum dolor sit amet, consectetur 
                            adipiscing elit. sed finibus quam nec tellus dictum.
                        </p>
                        <button className={style.downloadBulkButtonStyle}>
                        DOWNLOAD BULK USER UPLOAD EXCEL TEMPLATE FILE
                        </button>
                    </div>
                    <div>
                        <div className={`${style.floatRight} ${style.marginTop20}`}>
                            <button className={`${style.buttonStyle} ${style.marginLeft20}`}>{isUploaded ? 'SAVE & CONTINUE' : 'CANCEL UPLOAD'}</button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default SiteUsers;