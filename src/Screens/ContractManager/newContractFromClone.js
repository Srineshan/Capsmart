import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TextArea, InputGroup, RadioGroup, Radio, Switch, Icon, Intent, TagInput } from '@blueprintjs/core';
import DatalistInput from 'react-datalist-input';
import AddNewContractManager from './addNewContractManager';
import Alert from './alert';
import DeleteExecutedContractDialog from './deleteExecutedContractDialog';
import NewServiceProvider from './newServiceProvider';
import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';

const VALUES = ['Site 1', "Site 2"];
const VALUES2 = ['Department 1', "Department 2", "Department 3"];
const VALUES3 = ['Activity Reviewer'];

const NewContractFromClone = ({getNewContract}) => {
    const [selectedContract, setSelectedContract] = useState('Select...');
    const [selectedContractContinuationPolicy, setSelectedContractContinuationPolicy] = useState('Select Value');
    const [item, setItem] = useState();
    const [selectContractManager, setSelectContractManager] = useState('');
    const [selectContractInfo, setSelectContractInfo] = useState('Individual Contractor');
    const [addNewManagerDialog, setAddNewManagerDialog] = useState(false);
    const [fullyExecutedContract, setFullyExecutedContract] = useState(false);
    const [sameAsContractor, setSameAsContractor] = useState(false);
    const [departmentSpecific, setDepartmentSpecific] = useState(false);
    const [deleteExecutedContractDialog, setDeleteExecutedContractDialog] = useState(false);
    const [newServiceProviderDialog, setNewServiceProviderDialog] = useState(false);
    const [siteSpecific, setSiteSpecific] = useState(false);
    const [showAlertDialog,setShowAlertDialog] = useState(false);
    const [siteLevel, setSiteLevel] = useState(false);
    const [departmentLevel, setDepartmentLevel] = useState(false);
    let completedSteps = [];
    const [tags, setTags] = useState(VALUES);
    const [tagSet2, setTagSet2] = useState(VALUES2);
    const [activityTags, setActivityTags] = useState(VALUES3);
    const [viewPage1, setViewPage1] = useState(true);
    const [viewPage2, setViewPage2] = useState(false);
    const [viewPage3, setViewPage3] = useState(false);
    const [viewPage4, setViewPage4] = useState(false);
    const [isMultipleContract, setIsMultipleContract] = useState(false);

    const getAddNewManagerDialog = (value) => {
        setAddNewManagerDialog(value);
    }

    const getNewServiceProviderDialog = (value) => {
        setNewServiceProviderDialog(value);
    }

    const getShowAlertDialog = (value) => {
        setShowAlertDialog(value);
    }

    const getDeleteExecutedContractDialog = (value) => {
        setDeleteExecutedContractDialog(value);
        console.log(value);
    }

    useEffect(() => {
        setIsMultipleContract(selectContractInfo === "Multiple Contractor" ? true : false);
      }, [selectContractInfo]);

      console.log(isMultipleContract, selectContractInfo)

    const leftElement = () => {
        return(
            <button className={style.uploadButtonStyle} >UPLOAD</button>
        )
    }

    const options = [
        { name: 'Salvie - Head of Dept (Ortho)' },
        { name: 'Sanya - MD (General Mediciene)' },
        { name: 'Saaz - Emergency (General Surgeon)' },
      ];

      const onSelect = useCallback((selectedItem) => {
        console.log('selectedItem', selectedItem);
        setItem(selectedItem);
        setSelectContractManager('');
      }, []);

      const handleTagsAdd = values => {
          setTags([...tags, values]);
      };

      const handleActivityTagsAdd = values => {
        setActivityTags([...activityTags, values]);
    };

    const handleActivityTagsRemove = (tags, index) => {
        const updatedTags = [tags];
        updatedTags.splice(index, 1);
        tags = updatedTags;
        setActivityTags(tags);
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

      const handleTagSet2Add = values => {
        setTagSet2([...tags, values]);
    };

    const handleTagSet2Remove = (tags, index) => {
      const updatedTags = [tags];
      updatedTags.splice(index, 1);
      tags = updatedTags;
      setTagSet2(tags);
    };

    const leftTextElement = () => {
        return(
            <button>Activity Logger</button>
        )
    }

    const rightIconElement = () => {
        return(
            <p>Activity Logger</p>
        )
    }

      const items = useMemo(
        () =>
          options.map((option) => ({
            id: option.name,
            value: option.name,
            ...option,
          })),
        [item],
      );

    console.log(selectContractManager, completedSteps);

    return(
        <div className={`${style.welcomePadding} ${style.addContractBody}`}>
            <div className={style.spaceBetween}>
                <p className={style.welcomeStyle}>New Contract With No Prior Contract(s) With Entity - (From Clone)</p>
                <select
                    name="class"
                    id="Class"
                    value={selectContractInfo}
                    onChange={(e) => setSelectContractInfo(e.target.value)}
                    className={`${style.contractWidth} ${style.marginLeft20} ${style.reduceTop10} ${style.marginBottom}`}>
                        <option value="Individual Contractor" >
                        Individual Contractor
                        </option>
                        <option value="Multiple Contractor" >
                        Multiple Contractor
                        </option>
                </select>
            </div>
            <div className={style.welcomeBorder}></div>

            <div className={style.newContractFromCloneGrid}>
                <div className={style.cloneBlockStyle}>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${viewPage2 ? style.completedEntityCardStyle : viewPage1 ? style.selectedContractEntityStyle : ''}`}>
                        Contract Identification & Term Limit
                        {viewPage2 && ( 
                            <Icon icon="tick-circle" intent={Intent.SUCCESS} size={20} className={style.marginTop20} />
                        )} 
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage3 ? style.completedEntityCardStyle : viewPage2 ? style.selectedContractEntityStyle : ''}`}>
                        Contracted Services Provider(s)
                        {viewPage3 && ( 
                            <Icon icon="tick-circle" intent={Intent.SUCCESS} size={20} className={style.marginTop20} />
                        )} 
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage4 ? style.completedEntityCardStyle : viewPage3 ? style.selectedContractEntityStyle : ''}`}>
                        Contractor Business Entity
                        {viewPage4 && ( 
                            <Icon icon="tick-circle" intent={Intent.SUCCESS} size={20} className={style.marginTop20} />
                        )} 
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage4 ? style.selectedContractEntityStyle : ''}`}>
                        Documentation Proof Required
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10}`}>
                        Contracted Services Specification
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10}`}>
                        Payment & Compensation
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10}`}>
                        Timesheet Submission Terms
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10}`}>
                        Timesheet Processing Workflow
                    </div>
                </div>
                {viewPage4 ? (
                    <div className={style.cloneBlockStyle}>
                    <div className={style.tableHeight}>
                        <div>
                            <InputGroup className={`${style.documentProofInputWidth} ${style.marginLeft20}`} placeholder="For this contract to be active, proof of documentation is required for items listed on the Right." />
                        </div>
                        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                            <div className={`${style.extentionLableStyle} ${style.marginTop20} ${style.marginLeft20}`}>Contracted Service Providers:<strogn className={`${style.blackText} ${style.bold} ${style.marginLeft20}`}>3</strogn></div>
                            <button className={`${style.addCotractorButton} ${style.selectedColor} ${style.cursorPointer} `}
                             onClick={()=> getShowAlertDialog(true)} >ADD CONTRACTED PROVIDER</button>
                        </div>
                        <div className={`${style.documentPageHeader} ${style.marginTop10}`}>
                            <p className={style.documentProofTextWidth}>POD TYPE</p>
                            <p className={style.documentProofTextWidth}>NO COL NAME</p>
                            <p className={style.documentProofTextWidth}>CONTRACTOR</p>
                            <p className={style.documentProofTextWidth}>COPY ON FILE</p>
                        </div>
                        <div className={`${style.documentDataProof} ${style.displayInRow}`}>
                            <div className={`${style.documentProofDataTextWidth}`}></div>
                            <p className={style.documentProofDataTextWidth}>Medical license Certificate</p>
                            <p className={style.documentProofDataTextWidth}>business </p>
                            <p className={style.documentProofDataTextWidth}>name</p>
                            <p className={style.documentProofDataTextWidth}>ss.png</p>
                        </div>
                        <div className={`${style.documentDataProof} ${style.displayInRow}`}>
                            <div className={`${style.documentProofDataTextWidth}`}></div>
                            <p className={style.documentProofDataTextWidth}>Medical license Certificate</p>
                            <p className={style.documentProofDataTextWidth}>entity </p>
                            <p className={style.documentProofDataTextWidth}>name</p>
                            <p className={style.documentProofDataTextWidth}>Missing</p>
                        </div>
                        <div className={`${style.documentDataProof} ${style.displayInRow}`}>
                            <div className={`${style.documentProofDataTextWidth}`}></div>
                            <p className={style.documentProofDataTextWidth}>Medical license Certificate</p>
                            <p className={style.documentProofDataTextWidth}>Lorem ipsum </p>
                            <p className={style.documentProofDataTextWidth}>Lorem ipsum</p>
                            <p className={style.documentProofDataTextWidth}>ss.png</p>
                        </div>
                    </div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                        <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`}>CONTINUE</button>
                    </div>
                </div>
                ) : viewPage3 ? (
                    <div className={style.cloneBlockStyle}>
                        <div className={`${style.newContractFromCloneBoxStyle}`}>
                            {selectContractInfo === "Individual Contractor" && (
                                <div className={`${style.extentionGrid}`}>
                                    <div className={style.extentionLableStyle}>Contractor Business Contact Same As Contractor*</div>
                                    <Switch checked={sameAsContractor} label={sameAsContractor ? 'YES' : 'NO'} className={`${style.marginTop20} ${style.textAlignLeft}`} onChange={() => setSameAsContractor(!sameAsContractor)} />
                                </div>
                            )}
                            <div className={`${style.extentionGrid} ${selectContractInfo === "Individual Contractor" && style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Contractor NPIN*</div>
                                <div className={style.twoCol}>
                                    <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "Alphanumeric" } />
                                    <RadioGroup
                                        inline={true}
                                        className={`${style.marginTop} ${style.leftAlign}`}
                                    >
                                        <Radio label="Missing" value="Missing"  />
                                        <Radio label="NA" value="NA"  />
                                    </RadioGroup>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Contractor Entity Tax ID*</div>
                                <div className={style.twoCol}>
                                    <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "Alphanumeric" } />
                                    <RadioGroup
                                        inline={true}
                                        className={`${style.marginTop} ${style.leftAlign}`}
                                    >
                                        <Radio label="Missing" value="Missing"  />
                                    </RadioGroup>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Business Entity Name*</div>
                                <InputGroup className={style.fullWidth} value="Text" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Contractor Business Contact*</div>
                                <div className={style.twoCol}>
                                    <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "First Name" } />
                                    <InputGroup className={style.fullWidth} value="Last Name" />
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Business Contact Email Address*</div>
                                <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "Text" } />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Cell Phone*</div>
                                <div className={style.twoCol}>
                                    <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "Numeric" } />
                                    <RadioGroup
                                        inline={true}
                                        className={`${style.marginTop} ${style.leftAlign}`}
                                    >
                                        <Radio label="Missing" value="Missing"  />
                                    </RadioGroup>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Register Business Contact With App User Role*</div>
                                <div className={style.displayInRow}>
                                    <Switch checked={true} label={'YES'} className={`${style.marginTop15} ${style.textAlignLeft}`} />
                                    <select
                                        name="class"
                                        id="Class"
                                        // value={selectedContractContinuationPolicy || 'Select...'}
                                        // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                        className={`${style.marginLeft20} ${style.fullWidth}`}>
                                            <option value="Select Role" >
                                            Select Role
                                            </option>
                                    </select>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Mailing adress*</div>
                                <div>
                                    <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "Text" } />
                                    <div className={`${style.grid3} ${style.marginTop10}`}>
                                    <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "City" } />
                                    <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "State" }/>
                                    <InputGroup className={style.fullWidth} value="Zipcode"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.floatRight} ${style.marginTop20}`}>
                            <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                            <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> setViewPage4(true)}>CONTINUE</button>
                        </div>
                    </div>
                ) : selectContractInfo === "Individual Contractor" && viewPage2 ? (
                <div className={style.cloneBlockStyle}>
                    <div className={`${style.newContractFromCloneBoxStyle}`}>
                        <div className={`${style.extentionGrid}`}>
                            <div className={style.extentionLableStyle}>NPIN*</div>
                            <div className={style.grid3}>
                            <InputGroup className={style.fullWidth}/>
                            <RadioGroup
                                inline={true}
                                className={`${style.marginTop}`}
                                selectedValue={"Missing"}
                            >
                                <Radio label="Missing" value="Missing" checked />
                            </RadioGroup>
                            <RadioGroup
                                inline={true}
                                className={`${style.marginTop} ${style.reduce30Left}`}
                            >
                                <Radio label="Not Available" value="Not Available" />
                            </RadioGroup>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Contractor Name*</div>
                            <div className={style.grid3}>
                            <InputGroup className={style.fullWidth} value="First" />
                            <InputGroup className={style.fullWidth} value="Middle"/>
                            <InputGroup className={style.fullWidth} value="Last"/>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Suffix*</div>
                            <div className={style.grid3}>
                                <select
                                    name="class"
                                    id="Class"
                                    className={style.fullWidth}>
                                        <option value="Text" >
                                        Text
                                        </option>
                                </select>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Service Provider Type*</div>
                            <div className={style.grid3}>
                                <select
                                    name="class"
                                    id="Class"
                                    className={style.fullWidth}>
                                        <option value="Text" >
                                        Text
                                        </option>
                                        <option value="Physician" >
                                        Physician
                                        </option>
                                        <option value="Nurse" >
                                        Nurse
                                        </option>
                                        <option value="Admin Staff" >
                                        Admin Staff
                                        </option>
                                        <option value="Other" >
                                        Other
                                        </option>
                                </select>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Email Contractor id*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="Enter entity specific email" className={`${style.entityFieldWidth} ${style.alertValidationInputStyle}`}/>
                                <RadioGroup
                                    inline={true}
                                    className={`${style.marginTop} ${style.marginLeft20}`}
                                >
                                    <Radio label="Not Available" value="Not Available" />
                                </RadioGroup>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Cell Phone*</div>
                            <div className={style.grid2}>
                            <InputGroup value="Numeric" className={style.fullWidth}/>
                            <RadioGroup
                                inline={true}
                                className={`${style.marginTop} ${style.leftAlign}`}
                                selectedValue={"Missing"}
                            >
                                <Radio label="Not Available" value="Not Available" />
                            </RadioGroup>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Contractor Name*</div>
                            <div className={style.grid3}>
                            <InputGroup className={style.fullWidth} value="City" />
                            <InputGroup className={style.fullWidth} value="State"/>
                            <InputGroup className={style.fullWidth} value="Zipcode"/>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Site Level Responsibility*</div>
                            <div>
                                <Switch checked={siteLevel} label={siteLevel ? 'YES' : "NO"} className={`${style.marginTop} ${style.textAlignLeft}`} onChange={() => setSiteLevel(!siteLevel)}  />
                                {siteLevel && (
                                    <div className={`${style.siteLevelBoxStyle}`}>
                                        <div className={`${style.siteLevelGrid}`}>
                                            <div className={style.marginTop}>Title*</div>
                                            <select
                                                name="class"
                                                id="Class"
                                                // value={selectedContractContinuationPolicy || 'Select...'}
                                                // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                                className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                    <option value="type or select" >
                                                    type or select
                                                    </option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Department Level Responsibility*</div>
                            <div>
                                <Switch checked={departmentLevel} label={departmentLevel ? 'YES' : "NO"} className={`${style.marginTop} ${style.textAlignLeft}`} onChange={() => setDepartmentLevel(!departmentLevel)}  />
                                {departmentLevel && (
                                    <div className={`${style.renewalBoxStyle}`}>
                                        <div className={`${style.siteLevelGrid}`}>
                                            <div className={style.marginTop}>Department*</div>
                                            <select
                                                name="class"
                                                id="Class"
                                                // value={selectedContractContinuationPolicy || 'Select...'}
                                                // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                                className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                    <option value="Department" >
                                                     Department
                                                    </option>
                                            </select>
                                        </div>
                                        <div className={`${style.siteLevelGrid} ${style.marginTop10}`}>
                                            <div className={style.marginTop}>Title*</div>
                                            <select
                                                name="class"
                                                id="Class"
                                                // value={selectedContractContinuationPolicy || 'Select...'}
                                                // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                                className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                    <option value="type or select" >
                                                    type or select
                                                    </option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Assign Contractor With App User Role*</div>
                            <div>
                                <TagInput
                                    values={activityTags}
                                    onAdd={handleActivityTagsAdd}
                                    onRemove={handleActivityTagsRemove}
                                    separator={/[\s,]/}
                                    addOnBlur={true}
                                    addOnPaste={true}
                                    tagProps={getTagProps}
                                    leftElement={leftElement}
                                    rightElement={rightIconElement}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                        <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {setViewPage3(true)}}>CONTINUE</button>
                    </div>
                </div>
                ) : (selectContractInfo === "Individual Contractor" && viewPage1) ? (
                    <div className={style.cloneBlockStyle}>
                    <div className={`${style.newContractFromCloneBoxStyle}`}>
                        <div className={`${style.extentionGrid}`}>
                            <div className={style.extentionLableStyle}>Contract / Agreement Name*</div>
                            <InputGroup className={style.fullWidth}/>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Contract ID*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="PAMF-1106" className={`${style.entityFieldWidth} ${style.alertValidationInputStyle}`}/>
                                <RadioGroup
                                    inline={true}
                                    className={`${style.marginTop} ${style.marginLeft20}`}
                                    selectedValue={"Missing"}
                                >
                                    <Radio label="Missing" value="Missing" checked />
                                </RadioGroup>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Prior Contract ID*</div>
                            <div className={style.displayInRow}>
                                <InputGroup className={style.entityFieldWidth} placeholder="Search by CID / Name" />
                                <RadioGroup
                                    inline={true}
                                    className={`${style.marginTop} ${style.marginLeft20}`}
                                >
                                    <Radio label="Not Available" value="Not Available" />
                                </RadioGroup>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Assigned Contract Manager*</div>
                            <div className={style.displayInRow}>
                            {/* <select
                                name="class"
                                id="Class"
                                value={selectedContract || 'Select...'}
                                onChange={(e) => setSelectedContract(e.target.value)}
                                className={`${style.entityFieldWidth} ${style.marginBottom} `}>
                                    <option value="" >

                                    </option>
                                    <option value="Salvie - Head of Dept (Ortho)">Salvie - Head of Dept (Ortho)</option>
                                    <option value="Sanya - MD (General Mediciene)">Sanya - MD (General Mediciene)</option>
                                    <option value="Saaz - Emergency (General Surgeon)">Saaz - Emergency (General Surgeon)</option>
                            </select> */}
                            <div>
                                <DatalistInput items={items} onSelect={onSelect} onChange={(e) => setSelectContractManager(e.target.value) } className={style.selectFieldWidth} />
                                {selectContractManager.length !== 0 && (
                                    <div className={style.addBoxDescription}>
                                    The Contract Manager you are trying to add is not a registered
                                    user. to add a new contract manager click on the "ADD" button.
                                    </div>
                                )}
                            </div>
                            <button className={`${style.disabledButton} ${style.marginLeft20} ${selectContractManager.length !== 0 ? `${style.selectedColor} ${style.cursorPointer}` : style.disabled}`} onClick={() => selectContractManager.length !== 0 && setAddNewManagerDialog(true)}>ADD</button>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Fully Executed Contract on File*</div>
                            <div>
                                <Switch checked={fullyExecutedContract} label={fullyExecutedContract ? 'YES' : "NO"} className={`${style.marginTop} ${style.textAlignLeft}`} onChange={() => setFullyExecutedContract(!fullyExecutedContract)}  />
                                {fullyExecutedContract && (
                                    <div>
                                        <div className={style.reduce10Left}>
                                            <select
                                                name="class"
                                                id="Class"
                                                value={selectedContract || 'Select...'}
                                                onChange={(e) => setSelectedContract(e.target.value)}
                                                className={`${style.fullWidth} ${style.marginLeft20} `}>
                                                    <option value="" >
                                                    Select Type of Document
                                                    </option>
                                            </select>
                                        </div>
                                        <InputGroup className={`${style.fullWidth} ${style.marginTop10}`} value="Document Name" />
                                        <TextArea rows={4} value="Document Description" className={`${style.fullWidth} ${style.marginTop10}`} />
                                        <div className={`${style.displayInRow} ${style.marginTop10}`}>
                                            <InputGroup  leftElement={leftElement()} className={style.marginLeft20} className={style.fullWidth} />
                                            <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} >ADD MORE</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Site Specific Contract*</div>
                            <div>
                                <div className={style.displayInRow}>
                                    <Switch checked={siteSpecific} label={siteSpecific ? 'YES' : "NO"} className={`${style.marginTop} ${style.textAlignLeft}`} onChange={() => setSiteSpecific(!siteSpecific)}  />
                                    {siteSpecific && (
                                        <div className={style.displayInRow}>
                                            <DatalistInput items={items} placeholder="Select Sites" onSelect={onSelect} onChange={(e) => setSelectContractManager(e.target.value) } className={`${style.selectFieldSwitchWidth} ${style.marginLeft20}`} />
                                            <div className={`${style.addSymbolStyle} ${style.marginLeft20}`}><span className={style.plusSymbolPosition}>+</span></div>
                                        </div>
                                    )}
                                </div>
                                {siteSpecific && (
                                    <TagInput
                                        placeholder="Enter tags/keywords relative to the post"
                                        values={tags}
                                        className={`${style.marginTop20}`}
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
                            <div className={style.extentionLableStyle}>Department Specific Contract*</div>
                            <div>
                                <div className={style.displayInRow}>
                                    <Switch checked={departmentSpecific} label={departmentSpecific ? 'YES' : "NO"} className={`${style.marginTop} ${style.textAlignLeft}`} onChange={() => setDepartmentSpecific(!departmentSpecific)}  />
                                    {departmentSpecific && (
                                        <div className={style.displayInRow}>
                                            <DatalistInput items={items} placeholder="Select Sites" onSelect={onSelect} onChange={(e) => setSelectContractManager(e.target.value) } className={`${style.selectFieldSwitchWidth} ${style.marginLeft20}`} />
                                            <div className={`${style.addSymbolStyle} ${style.marginLeft20}`}><span className={style.plusSymbolPosition}>+</span></div>
                                        </div>
                                    )}
                                </div>
                                {departmentSpecific && (
                                    <TagInput
                                        placeholder="Enter tags/keywords relative to the post"
                                        values={tagSet2}
                                        className={`${style.marginTop20}`}
                                        onAdd={handleTagSet2Add}
                                        onRemove={handleTagSet2Remove}
                                        separator={/[\s,]/}
                                        addOnBlur={true}
                                        addOnPaste={true}
                                        tagProps={getTagProps}
                                    />
                                )}
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Contract Term Period*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="MM-DD-YYYY" />
                            <p className={style.toStyle}>To</p>
                                <InputGroup value="MM-DD-YYYY" />
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Contracted Services Effective Date*</div>
                            <div className={`${style.leftAlign} `}>
                                <select
                                    name="class"
                                    id="Class"
                                    value={selectedContract || 'Select...'}
                                    onChange={(e) => setSelectedContract(e.target.value)}
                                    className={style.fieldWidth2InARow}>
                                        <option value="MM-DD-YYYY" >
                                        MM-DD-YYYY
                                        </option>
                                </select>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Contract Continuation Policy*</div>
                            <div>
                                <div className={style.reduce10Left}>
                                    <select
                                        name="class"
                                        id="Class"
                                        value={selectedContractContinuationPolicy || 'Select...'}
                                        onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                        className={`${style.fullWidth} ${style.marginLeft20} `}>
                                            <option value="Select Value" >
                                            Select Value
                                            </option>
                                            <option value="Auto Renewal" >
                                            Auto Renewal
                                            </option>
                                            <option value="Written Contract Extension For Fixed Term" >
                                            Written Contract Extension For Fixed Term
                                            </option>
                                            <option value="New Contract On Expiration" >
                                            New Contract On Expiration
                                            </option>
                                            <option value="One Time Contract - Terminate On Expiration" >
                                            One Time Contract - Terminate On Expiration
                                            </option>
                                    </select>
                                </div>
                                {selectedContractContinuationPolicy === "Auto Renewal" && (
                                    <div className={`${style.renewalBoxStyle}`}>
                                        <div className={`${style.renewalBoxGrid}`}>
                                            <div className={style.marginTop}>Auto Renewal Term*</div>
                                            <div className={style.inputRenewalStyle} >4</div>
                                            <select
                                                name="class"
                                                id="Class"
                                                // value={selectedContractContinuationPolicy || 'Select...'}
                                                // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                                className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                    <option value="Select Value" >
                                                    Select Value
                                                    </option>
                                                    <option value="Weeks" >
                                                    Weeks
                                                    </option>
                                                    <option value="Months" >
                                                    Months
                                                    </option>
                                            </select>
                                        </div>
                                        <div className={`${style.renewalBoxGrid}`}>
                                            <div className={style.marginTop10}>Allowable Auto Renewal Terms*</div>
                                            <div className={`${style.inputRenewalStyle} ${style.marginTop10}`} >2</div>
                                        </div>
                                    </div>
                                )}
                                {(selectedContractContinuationPolicy === "Written Contract Extension For Fixed Term"
                                 || selectedContractContinuationPolicy === "New Contract On Expiration"
                                 || selectedContractContinuationPolicy === "One Time Contract - Terminate On Expiration") && (
                                    <div className={`${style.renewalRemainderBoxStyle}`}>
                                        <div className={`${style.renewalRemainderBoxGrid}`}>
                                            <div className={style.marginTop}>Set Renewal Reminder*</div>
                                            <div className={style.inputRenewalRemainderStyle} >30 Days   </div>
                                            <Icon icon="cross" className={style.marginTop10} color="black" />
                                        </div>
                                        <div className={`${style.renewalBoxGrid}`}>
                                            <button className={`${style.addMoreButton} ${style.selectedColor} ${style.cursorPointer}`} >ADD MORE</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                        <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {setViewPage2(true);setViewPage1(false)}}>CONTINUE</button>
                    </div>
                </div>
                ) : (selectContractInfo === "Multiple Contractor" && (viewPage1 || viewPage2)) ? (
                    <div className={style.cloneBlockStyle}>
                        <div className={style.tableHeight}>
                            <div className={style.spaceBetween}>
                                <div className={`${style.extentionLableStyle} ${style.marginTop20} ${style.marginLeft20}`}>Contracted Service Providers:<strogn className={`${style.blackText} ${style.bold} ${style.marginLeft20}`}>3</strogn></div>
                                <button className={`${style.addCotractorButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} ${style.marginRight20}`}
                                onClick={() => getNewServiceProviderDialog(true)} >ADD CONTRACTED PROVIDER</button>
                            </div>
                            <div className={`${style.tableHeader} ${style.marginTop10}`}>
                                <p className={style.multipleContractorTextWidth}>DATA STATUS</p>
                                <p className={style.multipleContractorTextWidth}>CONTRACT NAME</p>
                                <p className={style.multipleContractorTextWidth}>CONTRACTOR TYPE</p>
                                <p className={style.multipleContractorTextWidth}>SITE LEVEL</p>
                                <p className={style.multipleContractorTextWidth}>DEPT LEVEL</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.multipleDataTextWidth}`}></div>
                                <p className={style.multipleDataTextWidth}>John, DOE - MD</p>
                                <p className={style.multipleDataTextWidth}>Physician </p>
                                <p className={style.multipleDataTextWidth}>Chief Medical Officer</p>
                                <p className={style.multipleDataTextWidth}>-</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.multipleDataTextWidth}`}></div>
                                <p className={style.multipleDataTextWidth}>Alex, JACK - Surgeon</p>
                                <p className={style.multipleDataTextWidth}>Nurse </p>
                                <p className={style.multipleDataTextWidth}>HOD</p>
                                <p className={style.multipleDataTextWidth}>-</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.multipleDataTextWidth}`}></div>
                                <p className={style.multipleDataTextWidth}>Mario, KAL - MD</p>
                                <p className={style.multipleDataTextWidth}>Physician </p>
                                <p className={style.multipleDataTextWidth}>Chief Medical Officer</p>
                                <p className={style.multipleDataTextWidth}>-</p>
                            </div>
                        </div>
                        <div className={`${style.floatRight} ${style.marginTop20}`}>
                            <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                            <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {setViewPage2(true);setViewPage1(false);completedSteps.push('1')}}>CONTINUE</button>
                        </div>
                    </div>
                ) : ''}
                <div className={style.cloneBlockStyle}>
                    <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Indentification Information</p>
                    <div className={style.welcomeBorder}></div>
                    <p className={style.descriptionStyle}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore,
                    <span className={`${style.blueColor} ${style.marginLeft20}`}>
                    quis nostrud xercitation ullamco laboris nisi
                    ut aliquip ex ea commodo consequat
                    </span>
                    </p>
                    <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Activity Performed</p>
                    <div className={style.welcomeBorder}></div>
                    {viewPage1 && !viewPage2 && (
                        <div className={style.validationAlert}>
                            <div className={style.displayInRow}>
                                <div>
                                    <p className={`${style.blackText} ${style.leftAlign}`}><strong>alert text validation</strong></p>
                                    <p className={`${style.blackText} ${style.leftAlign}`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <p className={style.descriptionStyle}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                    </p>
                    <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Reference Contract Documents</p>
                    <div className={style.welcomeBorder}></div>
                    <div className={style.documentCard}>
                        <div className={style.displayInRow}>
                            <div>
                                <p className={`${style.blackText} ${style.leftAlign}`}><strong>executed Contract (Current)</strong></p>
                                <div className={style.spaceBetween}>
                                    <p className={`${style.blackText} ${style.leftAlign}`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                                    <Icon icon="trash" className={style.trashStyle} size={10} onClick={() => getDeleteExecutedContractDialog(true)}  />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.documentCard} ${style.marginTop10}`}>
                        <div className={style.displayInRow}>
                            <div>
                                <p className={`${style.blackText} ${style.leftAlign}`}><strong>Exhibit</strong></p>
                                <div className={style.spaceBetween}>
                                    <p className={`${style.blackText} ${style.leftAlign}`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                                    <Icon icon="trash" className={style.trashStyle} size={10} onClick={() => getDeleteExecutedContractDialog(true)}  />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {addNewManagerDialog && (
                <AddNewContractManager getAddNewManagerDialog={getAddNewManagerDialog} />
            )}
            {deleteExecutedContractDialog && (
                <DeleteExecutedContractDialog getDeleteExecutedContractDialog={getDeleteExecutedContractDialog} />
            )}
            {newServiceProviderDialog && (
                <NewServiceProvider getNewServiceProviderDialog={getNewServiceProviderDialog} />
            )}
            {showAlertDialog && (
              <Alert getShowAlertDialog={getShowAlertDialog} isMultipleContract={isMultipleContract} />
            )}
        </div>
    )
}

export default NewContractFromClone;
