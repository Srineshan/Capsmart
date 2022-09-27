import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, Checkbox, RadioGroup, Radio } from '@blueprintjs/core';
import AddNoteBlue from './../../images/addNoteBlue.png';
import AddNoteRed from './../../images/addNoteRed.png';
import AddEntity from './../../images/addEntity.png';
import PodPreview from './../../images/podPreview.png';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import style from './index.module.scss';

const NewPodTypeForHealthcare = ({getPodTypeForHealthcareDialog}) => {
    const [dropdownFieldValue, setDropdownFieldValue] = useState('LINK TO DATABASE');
    const fieldValues = [
        'Checkbox',
        'Date',
        'Datetime',
        'Dropdown',
        'Email',
        'File',
        'Number',
        'Password',
        'Radio',
        'Range',
        'Toggle',
        'Tel',
        'Text',
        'Time',
        'Url'
    ];
    const type = [
        'Text',
        'Varchar',
        'MM-DD-YY',
        'None'
    ]
    const [fieldType, setFieldType] = useState('Dropdown');
    const [dataType, setDataType] = useState('Text');
    const [textCase, setTextCase] = useState('');
    const [showNestedCard, setShowNestedCard] = useState(false);
    const [showNestedContent, setShowNestedContent] = useState(false);
    const [showNestedToggleCard, setShowNestedToggleCard] = useState(false);
    const [showNestedToggleContent, setShowNestedToggleContent] = useState(false);
    return(
        <Dialog isOpen={getPodTypeForHealthcareDialog} onClose={() => getPodTypeForHealthcareDialog(false)} className={`${style.healthCarePodDialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.dialogTitleStyle}>NEW POD TYPE FOR HEALTHCARE</p>
                <div className={style.displayInRow}>
                    <img src={PodPreview} alt="preview" className={`${style.podPreviewIconStyle}`} />
                    <img src={PodPreview} alt="preview" className={`${style.podPreviewIconStyle} ${style.marginLeft20}`} />
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.dialogCrossStyle} ${style.marginLeft20}`} onClick={() => getPodTypeForHealthcareDialog(false)}  />
                </div>
            </div>
            <div className={style.ReferenceListEntityBorder}></div>
            <div className={`${style.podGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>POD NAME*</div>
                <select
                    name="class"
                    id="Class"
                    className={`${style.fullWidth}`}>
                    <option value="Medical Staff Membership & Privileges" >
                    Medical Staff Membership & Privileges
                    </option>
                </select>
            </div>
            <div className={`${style.podGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>APLIESS TO*</div>
                <div>
                <select
                    name="class"
                    id="Class"
                    className={`${style.fullWidth}`}>
                    <option value="Multi select : All , Doctor , Dental, nurse" >
                    Multi select : All , Doctor , Dental, nurse
                    </option>
                </select>
                </div>
            </div>
            <div className={`${style.peachCard} ${style.peachDataStyle} ${style.marginTop20}`}>
            data elements authored will be displayed in the order below
            </div>
            <div className={`${style.podHealthCareBoxStyle} ${style.marginTop20}`}>
                <div className={`${style.podHeader} ${style.alignCenter}`}>
                    <div className={style.podHeaderTextStyle}>POD DATA ELEMENT</div>
                    <div className={style.podHeaderTextStyle}>DB NAME</div>
                    <div className={style.podHeaderTextStyle}>MANDATORY</div>
                    <div className={style.podHeaderTextStyle}>FIELD TYPE</div>
                    <div className={style.podHeaderTextStyle}>DATA TYPE</div>
                </div>
                <div>
                    <div className={`${style.podInnerBoxGrid} ${style.podInnerBoxHeader}`}>
                        <div className={`${style.displayInRow} ${style.alignCenter}`}>
                            <div className={style.podCountStyle}>1</div>
                            <InputGroup className={style.fullWidth} />
                        </div>
                        <div className={style.alignCenter}>
                            <InputGroup className={`${style.fullWidth}`} />
                        </div>
                        <div className={style.alignCenter}>
                            <Checkbox checked className={style.marginTop10} />
                        </div>
                        <div className={style.alignCenter}>
                            <select
                                name="class"
                                id="Class"
                                value={fieldType}
                                onChange={(e) => setFieldType(e.target.value)}
                                className={`${style.fullWidth}`}>
                                    {fieldValues?.map((data, index) => (
                                        <option value={data} key={index}>
                                        {data}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className={`${style.alignCenter} ${style.displayInRow}`}>
                            <select
                                name="class"
                                id="Class"
                                value={dataType}
                                onChange={(e) => setDataType(e.target.value)}
                                className={`${style.fullWidth}`}>
                                    {type?.map((data, index) => (
                                        <option value={data} key={index}>
                                        {data}
                                        </option>
                                    ))}
                            </select>
                            <MoreVertIcon className={style.cursorPointer} />
                        </div>
                    </div>
                    <div className={style.podInnerBoxBody}>
                        {fieldType === 'Dropdown' ? (
                        <>
                            <div className={`${style.displayInRow} ${dropdownFieldValue === "LINK TO DATABASE" && style.fieldBoxStyle} ${style.verticalAlignCenter}`}>
                                <div className={dropdownFieldValue === "LINK TO DATABASE" ? style.activeRadioStyle :  `${style.radioStyle} ${style.marginLeft10}`} onClick={() => setDropdownFieldValue('LINK TO DATABASE')}></div>
                                <div className={`${style.radioTextStyle} ${style.marginLeft10}`}>LINK TO DATABASE</div>
                                {dropdownFieldValue === "LINK TO DATABASE" && (
                                    <>
                                        <select
                                            name="class"
                                            className={`${style.podFieldWidth} ${style.marginLeft20}`}
                                            id="Class">
                                            <option value="Table Name" >
                                            Table Name
                                            </option>
                                        </select>
                                        <InputGroup placeholder='CONTRACT_Bs_ENTY' className={`${style.podFieldWidth} ${style.marginLeft20}`} />
                                    </>
                                )}
                            </div>
                            <div className={`${style.marginTop20} ${style.spaceBetween} ${dropdownFieldValue === "DROPDOWN VALUE" && style.fieldBoxStyle} ${style.verticalAlignCenter}`}>
                                <div className={`${style.displayInCol}`}>
                                    <div className={style.displayInRow}>
                                        <div className={dropdownFieldValue === "DROPDOWN VALUE" ? style.activeRadioStyle : `${style.radioStyle} ${style.marginLeft10}`} onClick={() => setDropdownFieldValue('DROPDOWN VALUE')}></div>
                                        <div className={`${style.radioTextStyle} ${style.marginLeft10}`}>DROPDOWN VALUE</div>
                                    </div>
                                    <div className={style.marginTop20}>
                                        {dropdownFieldValue === "DROPDOWN VALUE" && (
                                            <div>
                                                <div className={style.displayInRow}>
                                                    <InputGroup value='Contracting Business Entity' placeholder='CONTRACT_Bs_ENTY' className={`${style.podFieldWidth} ${style.marginLeft20}`} />
                                                    <InputGroup placeholder='CONTRACT_Bs_ENTY' className={`${style.podFieldWidth} ${style.marginLeft20}`} />
                                                </div>
                                                <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                                    <InputGroup value='Contracted Service Provider' placeholder='CONTRACT_Bs_ENTY' className={`${style.podFieldWidth} ${style.marginLeft20}`} />
                                                    <InputGroup placeholder='db value to save' className={`${style.podFieldWidth} ${style.marginLeft20}`} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {dropdownFieldValue === "DROPDOWN VALUE" && (
                                    <div className={style.displayInCol}>
                                        <img src={AddEntity} alt="add" className={style.podIconStyle} />
                                        <img src={AddNoteBlue} alt="add" className={`${style.podIconStyle} ${style.marginTop20}`} />
                                        <img src={AddNoteRed} alt="add" className={`${style.podIconStyle} ${style.marginTop20}`} onClick={() => setShowNestedCard(!showNestedCard)}/>
                                    </div>
                                )}
                            </div>
                            {showNestedCard && (
                                <div className={`${style.nestedDataCard} ${style.floatRight}`}>
                                    <p className={style.nestedDataTextStyle}>Checkbox</p>
                                    <p className={style.nestedDataTextStyle}> Dropdown</p>
                                    <p className={style.nestedDataTextStyle}>Email</p>
                                    <p className={style.nestedDataTextStyle}>File</p>
                                    <p className={style.nestedDataTextStyle}>Number</p>
                                    <p className={style.nestedDataTextStyle}>Password</p>
                                    <p className={style.nestedDataTextStyle}>Radio</p>
                                    <p className={style.nestedDataTextStyle}>Toggle</p>
                                    <p className={style.nestedDataTextStyle}>Tel</p>
                                    <p className={style.nestedDataTextStyle}>Text</p>
                                    <p className={style.nestedDataTextStyle} onClick={() => {setShowNestedContent(true);setShowNestedCard(!showNestedCard)}}>Nested Data</p>
                                </div>
                            )}
                            <Checkbox label='Allow multiple selection of dropdown values' className={style.marginTop20} />
                            {showNestedContent && (
                                <div className={`${style.podInnerBoxGrid} ${style.podInnerBoxHeader} ${style.nestedCardReducedPadding}`}>
                                    <div className={`${style.displayInRow} ${style.alignCenter}`}>
                                        <div className={style.podCountStyle}>1</div>
                                        <InputGroup className={style.fullWidth} />
                                    </div>
                                    <div className={style.alignCenter}>
                                        <InputGroup className={`${style.fullWidth}`} />
                                    </div>
                                    <div className={style.alignCenter}>
                                        <Checkbox checked className={style.marginTop10} />
                                    </div>
                                    <div className={style.alignCenter}>
                                        <select
                                            name="class"
                                            id="Class"
                                            value={fieldType}
                                            onChange={(e) => setFieldType(e.target.value)}
                                            className={`${style.fullWidth}`}>
                                                {fieldValues?.map((data, index) => (
                                                    <option value={data} key={index}>
                                                    {data}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className={`${style.alignCenter} ${style.displayInRow}`}>
                                        <select
                                            name="class"
                                            id="Class"
                                            value={dataType}
                                            onChange={(e) => setDataType(e.target.value)}
                                            className={`${style.fullWidth}`}>
                                                {type?.map((data, index) => (
                                                    <option value={data} key={index}>
                                                    {data}
                                                    </option>
                                                ))}
                                        </select>
                                        <MoreVertIcon className={style.cursorPointer} />
                                    </div>
                                </div>
                            )}
                        </>
                        ) : fieldType === 'Text' ? (
                            <>
                                <div className={`${style.fieldBoxStyle} ${style.displayInRow}`}>
                                    <div className={`${style.radioTextStyle} ${style.marginTop}`}>CHARACTER LIMIT</div>
                                    <InputGroup className={`${style.podFieldWidth} ${style.marginLeft20}`} />
                                    <Checkbox label='display help text' className={`${style.marginLeft20} ${style.marginTop}`} />
                                    <InputGroup placeholder='Help Text' className={`${style.podFieldWidth} ${style.marginLeft20}`} />
                                </div>
                                <div className={style.podTextGrid}>
                                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                        <div className={`${style.activeRadioStyle} ${style.marginTop}`}></div>
                                        <div className={`${style.radioTextStyle} ${style.marginLeft10} ${style.marginTop}`}>NUMBER</div>
                                    </div>
                                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                        <div className={`${style.radioTextStyle} ${style.marginTop} ${style.marginLeft20}`}>MIN VALUE</div>
                                        <InputGroup className={`${style.podFieldWidth} ${style.marginLeft20}`} />
                                        <div className={`${style.radioTextStyle} ${style.marginTop} ${style.marginLeft20}`}>MAX VALUE</div>
                                        <InputGroup className={`${style.podFieldWidth} ${style.marginLeft20}`} />
                                    </div>
                                </div> 
                                <div className={`${style.podTextGrid} ${style.marginTop20}`}>
                                    <div className={style.displayInRow}>
                                        <div className={`${style.activeRadioStyle} ${style.marginTop}`}></div>
                                        <div className={`${style.radioTextStyle} ${style.marginLeft10} ${style.marginTop}`}>TEXT</div>
                                    </div>
                                    <div className={style.displayInRow}>
                                        <div className={style.displayInRow}>
                                            <div className={textCase === "UPPERCASE" ? `${style.activeRadioStyle} ${style.marginLeft20} ${style.marginTop}` : `${style.radioStyle} ${style.marginLeft20} ${style.marginTop}`} onClick={() => setTextCase('UPPERCASE')}></div>
                                            <div className={`${style.radioTextStyle} ${style.marginLeft10} ${style.marginTop}`}>UPPERCASE</div>
                                        </div>
                                        <div className={style.displayInRow}>
                                            <div className={textCase === "LOWERCASE" ? `${style.activeRadioStyle} ${style.marginLeft20} ${style.marginTop}` : `${style.radioStyle} ${style.marginLeft20} ${style.marginTop}`} onClick={() => setTextCase('LOWERCASE')}></div>
                                            <div className={`${style.radioTextStyle} ${style.marginLeft10} ${style.marginTop}`}>LOWERCASE</div>
                                        </div>
                                        <div className={style.displayInRow}>
                                            <div className={textCase === "TITLE CASE" ? `${style.activeRadioStyle} ${style.marginLeft20} ${style.marginTop}` : `${style.radioStyle} ${style.marginLeft20} ${style.marginTop}`} onClick={() => setTextCase('TITLE CASE')}></div>
                                            <div className={`${style.radioTextStyle} ${style.marginLeft10} ${style.marginTop}`}>TITLE CASE</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : fieldType === 'Date' ? (
                            <>
                                <div className={`${style.fieldBoxStyle} ${style.displayInRow}`}>
                                    <select
                                        name="class"
                                        className={`${style.podFieldWidth}`}
                                        id="Class">
                                        <option value="0" >
                                        CHECKS TO APPLY
                                        </option>
                                        <option value="EQUAL TO" >
                                        EQUAL TO
                                        </option>
                                        <option value="LESS THAN" >
                                        LESS THAN
                                        </option>
                                        <option value="GREATER THAN" >
                                        GREATER THAN
                                        </option>
                                        <option value="GREATER THAN EQUAL TO" >
                                        GREATER THAN EQUAL TO
                                        </option>
                                        <option value="LESS THAN EQUAL TO" >
                                        LESS THAN EQUAL TO
                                        </option>
                                    </select>
                                    <select
                                        name="class"
                                        className={`${style.podFieldWidth} ${style.marginLeft20}`}
                                        id="Class">
                                        <option value="0" >
                                        CHECK DATA AGAINST
                                        </option>
                                        <option value="CURRENT CALENDAR DATE" >
                                        CURRENT CALENDAR DATE
                                        </option>
                                        <option value="CONTRACT START DATE" >
                                        CONTRACT START DATE
                                        </option>
                                        <option value="CONTRACT Expiration DATE" >
                                        CONTRACT Expiration DATE
                                        </option>
                                    </select>
                                    <Checkbox label='display help text' className={`${style.marginLeft50} ${style.marginTop}`} />
                                    <InputGroup placeholder='Help Text' className={`${style.podFieldWidth} ${style.marginLeft20}`} />
                                </div>
                            </>
                        ) : fieldType === 'Toggle' ? (
                            <>
                                <div className={`${style.fieldBoxStyle} ${style.podToggleGrid}`}>
                                    <div className={style.displayInRow}>
                                        <div className={`${style.radioTextStyle} ${style.marginTop} ${style.marginLeft20}`}>OFF VALUE</div>
                                        <InputGroup value='NO' className={`${style.podFieldWidth} ${style.marginLeft20}`} />
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div className={style.displayInRow}>
                                            <div className={`${style.activeRadioStyle} ${style.marginTop}`}></div>
                                            <div className={`${style.radioTextStyle} ${style.marginLeft10} ${style.marginTop}`}>set default</div>
                                        </div>
                                        <img src={AddNoteBlue} alt="add" className={`${style.podIconStyle} ${style.marginTop10}`} />
                                    </div>
                                </div>
                                <div className={`${style.fieldBoxStyle} ${style.podToggleGrid} ${style.marginTop20}`}>
                                    <div className={style.displayInRow}>
                                        <div className={`${style.radioTextStyle} ${style.marginTop} ${style.marginLeft20}`}>ON VALUE</div>
                                        <InputGroup value='YES' className={`${style.podFieldWidth} ${style.marginLeft20}`} />
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <div>
                                            <div className={style.displayInRow}>
                                                <div className={`${style.radioStyle} ${style.marginTop}`}></div>
                                                <div className={`${style.radioTextStyle} ${style.marginLeft10} ${style.marginTop}`}>set default</div>
                                            </div>
                                            {showNestedToggleContent && (
                                                <>
                                                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                                        <button className={`${style.chooseFileButton}`}>CHOOSE FILE</button>
                                                        <Checkbox label='Png' className={`${style.marginLeft20} ${style.marginTop}`} />
                                                        <Checkbox label='JPEG' className={`${style.marginLeft20} ${style.marginTop}`} />
                                                        <Checkbox label='Pdf' className={`${style.marginLeft20} ${style.marginTop}`} />
                                                    </div>
                                                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                                        <Checkbox label='File Name' className={`${style.marginTop}`} />
                                                        <InputGroup placeholder='Enter File Name' className={`${style.podFieldWidth} ${style.marginLeft20}`} />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div>
                                            <img src={showNestedToggleContent ? AddNoteRed : AddNoteBlue} onClick={() => setShowNestedToggleCard(!showNestedToggleCard)} alt="add" className={`${style.podIconStyle} ${style.marginTop10}`} />
                                            {showNestedToggleCard && (
                                                <div className={`${style.nestedDataCard} ${style.floatRight}`}>
                                                    <p className={style.nestedDataTextStyle}>Checkbox</p>
                                                    <p className={style.nestedDataTextStyle}> Dropdown</p>
                                                    <p className={style.nestedDataTextStyle}>Email</p>
                                                    <p className={style.nestedDataTextStyle} onClick={() => {setShowNestedToggleContent(true);setShowNestedToggleCard(!showNestedToggleCard)}}>File</p>
                                                    <p className={style.nestedDataTextStyle}>Number</p>
                                                    <p className={style.nestedDataTextStyle}>Password</p>
                                                    <p className={style.nestedDataTextStyle}>Radio</p>
                                                    <p className={style.nestedDataTextStyle}>Toggle</p>
                                                    <p className={style.nestedDataTextStyle}>Tel</p>
                                                    <p className={style.nestedDataTextStyle}>Text</p>
                                                    <p className={style.nestedDataTextStyle}>Nested Data</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )  : (
                            <>  
                                
                            </>
                        )}
                    </div>
                </div>
                <div className={`${style.fieldBoxStyle} ${style.marginTop20} ${style.margin10}`}>
                    <div className={style.addNewDataButton}>ADD NEW DATA</div>
                </div>
            </div>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button className={style.outlinedButton}>CANCEL</button>
                <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE</button>
            </div>
          </div>
        </Dialog>
    )
}

export default NewPodTypeForHealthcare;