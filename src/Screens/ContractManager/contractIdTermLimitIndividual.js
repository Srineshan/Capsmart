import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TextArea, InputGroup, RadioGroup, Radio, Icon, TagInput } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DateInput } from "@blueprintjs/datetime";
import DatalistInput from 'react-datalist-input';

import style from './index.module.scss';

const VALUES = ['Site 1', "Site 2"];
const VALUES2 = ['Department 1', "Department 2", "Department 3"];
const ContractIdTermLimitIndividual = ({getViewPage1, getViewPage2, getCurrentPage}) => {
    const [selectContractManager, setSelectContractManager] = useState('');
    const [selectPriorContractID, setSelectPriorContractID] = useState('');
    const [siteSpecific, setSiteSpecific] = useState(false);
    const [selectedContract, setSelectedContract] = useState('Select...');
    const [selectedContractContinuationPolicy, setSelectedContractContinuationPolicy] = useState('Select Value');
    const [item, setItem] = useState();
    const [priorContractItem, setPriorContractItem] = useState();
    const [addNewManagerDialog, setAddNewManagerDialog] = useState(false);
    const [fullyExecutedContract, setFullyExecutedContract] = useState(false);
    const [departmentSpecific, setDepartmentSpecific] = useState(false);
    const [tags, setTags] = useState(VALUES);
    const [tagSet2, setTagSet2] = useState(VALUES2);
    const [contractTermPeriodFrom, setContractTermPeriodFrom] = useState(new Date());
    const [contractTermPeriodTo, setContractTermPeriodTo] = useState(new Date());

    const [contractDetail, setContractDetail] = useState({
        contractName: {
            contractName: ""
          },
          contractType: "INDIVIDUAL",
          contractStatus: "ACTIVE",
          contractDetail: {
            contractId: {
              id: ""
            },
            priorContract: {
              id: "",
              notApplicable: true
            },
            contractManager: {
              userID: ""
            },
            contractFiles: [
              {
                id: "",
                filePath: "",
                fileName: "",
                documentType: "",
                documentDescription: "",
                documentName: ""
              }
            ],
            site: {
              sites: [
                {
                  id: "",
                  departmentList: {
                    departments: [
                      {
                        id: "",
                        departmentName: {
                          departmentName: ""
                        }
                      }
                    ]
                  },
                  siteName: {
                    siteName: ""
                  }
                }
              ]
            },
            departmentList: {
              departments: [
                {
                  id: "",
                  departmentName: {
                    departmentName: ""
                  }
                }
              ]
            },
            contractTerm: {
              startDate: "2022-07-20",
              endDate: "2022-07-20",
              effectiveDate: "2022-07-20"
            },
            continuationPolicy: {
              contractPolicyType: "AUTORENEWAL",
              autoRenewalPeriod: {
                autoRenewalTerm: {
                  term: 0
                },
                allowableAutoRenewalTerm: {
                  term: 0
                },
                autoRenewalCalender: "WEEKS"
              },
              reminderList: {
                renewalReminderList: [
                  {
                    days: 0
                  }
                ]
              }
            },
            contractIdMissing: true,
            fullyExecutedContract: true,
            siteSpecificContract: true,
            departmentSpecificContract: true
          },
          newContract: true
    })

    const options = [
        { name: 'Salvie - Head of Dept (Ortho)' },
        { name: 'Sanya - MD (General Mediciene)' },
        { name: 'Saaz - Emergency (General Surgeon)' },
      ];

      const priorContractId = [
        { name: 'Contract 1' },
        { name: 'Contract 2' },
        { name: 'Contract 3' },
      ];

      const onSelect = useCallback((selectedItem) => {
        setItem(selectedItem);
        setSelectContractManager('');
      }, []);

      const onSelectContractId = useCallback((selectedItem) => {
        setPriorContractItem(selectedItem);
        setSelectPriorContractID('');
      }, []);

      const uploadRightElement = () => {
        return(
            <button className={style.uploadButtonStyle} >UPLOAD</button>
        )
    }

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

    const handleTagSet2Add = values => {
        setTagSet2([...tags, values]);
    };

    const handleTagSet2Remove = (tags, index) => {
      const updatedTags = [tags];
      updatedTags.splice(index, 1);
      tags = updatedTags;
      setTagSet2(tags);
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

      const priorContractItems = useMemo(
        () =>
          priorContractId.map((option) => ({
            id: option.name,
            value: option.name,
            ...option,
          })),
        [priorContractItem],
      );
    return(
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
                <div className={`${style.extentionGrid} ${style.marginTop20} ${style.disabledView} `}>
                    <div className={style.extentionLableStyle}>Prior Contract ID*</div>
                    <div className={style.displayInRow}>
                        <DatalistInput items={priorContractItems} onSelect={onSelectContractId} onChange={(e) => setSelectPriorContractID(e.target.value) } className={style.selectFieldWidth} placeholder="Search by CID / Name" />
                        {/* <InputGroup className={style.entityFieldWidth} placeholder="Search by CID / Name" /> */}
                        <RadioGroup
                            inline={true}
                            className={`${style.marginTop} ${style.marginLeft20}`}
                        >
                            <Radio label="NA" value="Not Available" />
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
                        <div className={`${style.spaceBetween}`}>
                            <FormControlLabel
                                control={
                                    <Switch checked={fullyExecutedContract} className={`${style.floatLeft}`} onChange={() => setFullyExecutedContract(!fullyExecutedContract)}  />
                                }
                                className={`${style.switchFontStyle} ${style.marginTop} ${style.flexLeft}`}
                                label={fullyExecutedContract ? 'YES' : "NO"}
                            />
                            {fullyExecutedContract && (
                                <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} >ADD MORE</button>
                            )}
                        </div>
                        {fullyExecutedContract && (
                            <div>
                                <div className={style.reduce10Left}>
                                    <select
                                        name="class"
                                        id="Class"
                                        value={selectedContract || 'Select...'}
                                        onChange={(e) => setSelectedContract(e.target.value)}
                                        className={`${style.fullWidth} ${style.marginLeft20} `}>
                                            <option value="Agreement Draft" >
                                            Agreement Draft
                                            </option>
                                            <option value="Executed Agreement" >
                                            Executed Agreement
                                            </option>
                                            <option value="Appendix Addendum" >
                                            Appendix Addendum
                                            </option>
                                            <option value="Schedule" >
                                            Schedule
                                            </option>
                                            <option value="Attachment " >
                                            Attachment
                                            </option>
                                    </select>
                                </div>
                                <InputGroup className={`${style.fullWidth} ${style.marginTop10}`} value="Document Name" />
                                <TextArea rows={4} value="Document Description" className={`${style.fullWidth} ${style.marginTop10}`} />
                                <div className={`${style.floatRight} ${style.displayInRow} ${style.marginTop10}`}>
                                    <div></div>
                                    <InputGroup  rightElement={uploadRightElement()} className={style.marginLeft20} className={style.fullWidth} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Site Specific Contract*</div>
                    <div>
                        <div className={style.displayInRow}>
                            <FormControlLabel
                                control={
                                    <Switch checked={siteSpecific} className={`${style.textAlignLeft}`} onChange={() => setSiteSpecific(!siteSpecific)}  />
                                }
                                className={`${style.switchFontStyle}`}
                                label={siteSpecific ? 'YES' : "NO"}
                            />
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
                            <FormControlLabel
                                control={
                                    <Switch checked={departmentSpecific} className={` ${style.textAlignLeft}`} onChange={() => setDepartmentSpecific(!departmentSpecific)}  />
                                }
                                className={`${style.switchFontStyle}`}
                                label={departmentSpecific ? 'YES' : "NO"}
                            />
                            {departmentSpecific && (
                                <div className={style.displayInRow}>
                                    <DatalistInput items={items} placeholder="Select Departments" onSelect={onSelect} onChange={(e) => setSelectContractManager(e.target.value) } className={`${style.selectFieldSwitchWidth} ${style.marginLeft20}`} />
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
                        <DateInput
                            formatDate={date => date.toLocaleDateString()}
                            parseDate={str => new Date(str)}
                            placeholder={"MM-DD-YYYY"}
                            value={contractTermPeriodFrom}
                            onChange={(e)=> setContractTermPeriodFrom(e) }
                            minDate={new Date()}
                            maxDate={contractTermPeriodTo}
                        />
                    <p className={style.toStyle}>To</p>
                        <DateInput
                            formatDate={date => date.toLocaleDateString()}
                            parseDate={str => new Date(str)}
                            placeholder={"MM-DD-YYYY"}
                            value={contractTermPeriodTo}
                            onChange={(e)=> setContractTermPeriodTo(e) }
                            minDate={contractTermPeriodFrom}
                        />
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
                                            <option value="Days" >
                                            Days
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
                <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {getViewPage2(true);getViewPage1(false);getCurrentPage('Contracted Services Provider(s)')}}>CONTINUE</button>
            </div>
        </div>
    )
}

export default ContractIdTermLimitIndividual;