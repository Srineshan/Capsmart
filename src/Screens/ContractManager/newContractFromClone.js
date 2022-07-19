import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TextArea, InputGroup, RadioGroup, Radio, Icon, Intent, TagInput, EditableText, Dialog, Classes } from '@blueprintjs/core';
import DatalistInput from 'react-datalist-input';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DateInput } from "@blueprintjs/datetime";
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AddNewContractManager from './addNewContractManager';
import Alert from './alert';
import DeleteExecutedContractDialog from './deleteExecutedContractDialog';
import NewServiceProvider from './newServiceProvider';
import WritingFile from './../../images/writingFile.png';
import CompletedIcon from './../../images/completedIcon.png';
import RedWarning from './../../images/redWarning.png';
import FileImg from './../../images/fileImg.png';
import ServiceSpecification from './serviceSpecification';
import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';
import ToolBar from './toolbar';
import ContractIdTermLimitIndividual from './contractIdTermLimitIndividual';
import ContractedServicesProviderMultiple from './contractedServicesProviderMultiple';
import ContractedServicesProviderIndividual from './contractedServiceProviderIndividual';
import ContractorBusinessEntity from './contractorBusinessEntity';

const VALUES = ['Site 1', "Site 2"];
const VALUES2 = ['Department 1', "Department 2", "Department 3"];
const VALUES3 = ['Activity Reviewer'];
const VALUES4 = ['Activity 1', 'Activity 2', 'Activity 3'];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Activity Logger',
  'Reviewer',
  'Approver',
  'Accounts Payable',
  'Contracts manager',
  'Report viewer',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const NewContractFromClone = ({getNewContract, contractType}) => {
    const [selectedContract, setSelectedContract] = useState('Select...');
    const [selectedContractContinuationPolicy, setSelectedContractContinuationPolicy] = useState('Select Value');
    const [item, setItem] = useState();
    const [priorContractItem, setPriorContractItem] = useState();
    const [selectContractManager, setSelectContractManager] = useState('');
    const [selectPriorContractID, setSelectPriorContractID] = useState('');
    const [selectContractInfo, setSelectContractInfo] = useState(contractType);
    const [compensation, setCompensation] = useState('RVU Based');
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
    const [timeSheetCount, setTimeSheetCount] = useState('1');
    const [applyWorkflowToAll, setApplyWorkflowToAll] = useState(true);
    const [contractTermPeriodFrom, setContractTermPeriodFrom] = useState(new Date());
    const [contractTermPeriodTo, setContractTermPeriodTo] = useState(new Date());
    const [addOn, setAddOn] = useState(false);
    let completedSteps = [];
    const [tags, setTags] = useState(VALUES);
    const [tagSet2, setTagSet2] = useState(VALUES2);
    const [activityTags, setActivityTags] = useState(VALUES3);
    const [contractedActivityTags, setContractedActivityTags] = useState(VALUES4);
    const [viewPage1, setViewPage1] = useState(true);
    const [viewPage2, setViewPage2] = useState(false);
    const [viewPage3, setViewPage3] = useState(false);
    const [viewPage4, setViewPage4] = useState(false);
    const [viewPage5, setViewPage5] = useState(false);
    const [viewPage6, setViewPage6] = useState(false);
    const [viewPage7, setViewPage7] = useState(false);
    const [viewPage8, setViewPage8] = useState(false);
    const [viewWorkflowDialog, setViewWorkflowDialog] = useState(false);
    const [currentPage, setCurrentPage] = useState('Contract ID & Term Limit');
    const [isMultipleContract, setIsMultipleContract] = useState(false);
    const theme = useTheme();
    const [personName, setPersonName] = useState([]);

    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        setPersonName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
        );
    };

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
    }

    const getAddOn = (value) => {
        setAddOn(value);
    }

    const getViewPage1 = (value) => {
        setViewPage1(value);
    } 

    const getViewPage2 = (value) => {
        setViewPage2(value);
    } 

    const getViewPage3 = (value) => {
        setViewPage3(value);
    } 

    const getViewPage4 = (value) => {
        setViewPage4(value);
    } 

    const getViewPage5 = (value) => {
        setViewPage5(value);
    } 

    const getViewPage6 = (value) => {
        setViewPage6(value);
        setCurrentPage('Payment & Compensation');
    }

    const getViewPage7 = (value) => {
        setViewPage7(value);
    } 

    const getViewPage8 = (value) => {
        setViewPage8(value);
    } 

    const getCurrentPage = (value) => {
        setCurrentPage(value);
    } 

    useEffect(() => {
        setIsMultipleContract(selectContractInfo === "Multiple Contractor" ? true : false);
      }, [selectContractInfo]);

    const uploadRightElement = () => {
        return(
            <button className={style.uploadButtonStyle} >UPLOAD</button>
        )
    }

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

      const handleContractedActivityTagsAdd = values => {
        setContractedActivityTags([...activityTags, values]);
    };

    const handleContractedActivityTagsRemove = (tags, index) => {
        const updatedTags4 = [tags];
        updatedTags4.splice(index, 1);
        tags = updatedTags4;
        setContractedActivityTags(tags);
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
        <div className={`${style.welcomePadding} ${style.addContractBody}`}>
            <div className={style.spaceBetween}>
                <p className={style.welcomeStyle}>New Contract With No Prior Contract(s) With Entity - (From Clone)</p>
                <div className={style.displayInRow}>
                    <img src={WritingFile} alt="Writing File" className={`${style.smallIcons} ${style.reduceTop10}`} />
                    <InputGroup
                        value={selectContractInfo}
                        className={`${style.contractWidth} ${style.marginLeft20} ${style.reduceTop10} ${style.marginBottom}`} />
                    <Icon icon="cross" size={25} intent={Intent.DANGER} className={style.newContractCrossStyle} onClick={() => getNewContract(false)}  />
                </div>
            </div>
            <div className={style.welcomeBorder}></div>

            <div className={style.newContractFromCloneGrid}>
                <div className={style.cloneBlockStyle}>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${viewPage2 ? style.completedEntityCardStyle : viewPage1 ? style.selectedContractEntityStyle : ''}`}>
                        Contract ID & Term Limit
                        {viewPage2 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage3 ? style.completedEntityCardStyle : viewPage2 ? style.selectedContractEntityStyle : ''}`}>
                        Contracted Services Provider(s)
                        {viewPage3 && (
                            <img src={RedWarning} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage4 ? style.completedEntityCardStyle : viewPage3 ? style.selectedContractEntityStyle : ''}`}>
                        Contractor Business Entity
                        {viewPage4 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage5 ? style.completedEntityCardStyle : viewPage4 ? style.selectedContractEntityStyle : ''}`}>
                        Documentation Proof Required
                        {viewPage5 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${((viewPage5 && addOn) || viewPage6) ? style.completedEntityCardStyle : viewPage5 ? style.selectedContractEntityStyle : ''}`}>
                        Contracted Services Specification
                        {((viewPage5 && addOn) || viewPage6) && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage6 ? style.completedEntityCardStyle : addOn ? style.selectedContractEntityStyle : ''}`}>
                        Contracted Add on service specification
                        {viewPage6 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage7 ? style.completedEntityCardStyle : viewPage6 ? style.selectedContractEntityStyle : ''}`}>
                        Payment & Compensation
                        {viewPage7 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage8 ? style.completedEntityCardStyle : viewPage7 ? style.selectedContractEntityStyle : ''}`}>
                        Timesheet Submission Terms
                        {viewPage8 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage8 && style.selectedContractEntityStyle}`}>
                        Timesheet Processing Workflow
                    </div>
                </div>
                {viewPage8 ? (
                    <div className={style.cloneBlockStyle}>
                        <div className={`${style.floatLeft} ${style.reduce10Left}`}>
                            <button className={`${style.timesheetButtonStyle} ${style.selectedTimesheetButton}`}>Timesheet name 1</button>
                            <button className={style.timesheetButtonStyle}>Timesheet name 2</button>
                        </div>
                        <div className={`${style.timeSheetBoxStyle}`}>
                            <div className={`${style.extentionGrid}`}>
                                <div className={style.extentionLableStyle}>Select Timesheet To Define Process*</div>
                                <div className={style.displayInRow}>
                                    <InputGroup className={style.twoFieldWidth} placeholder="Timesheet name 1" />
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Workflow Template To Use*</div>
                                <div className={style.twoCol}>
                                    <div className={style.reduce10Left}>
                                        <select
                                            name="class"
                                            id="Class"
                                            className={`${style.fullWidth} ${style.marginLeft20} `}>
                                                <option value="default saves template select" >
                                                default saves template select
                                                </option>
                                        </select>
                                    </div>
                                    <RadioGroup
                                        inline={true}
                                        className={`${style.marginTop15} ${style.marginLeft20}`}
                                        selectedValue={"Custom Creation"}
                                    >
                                        <Radio label="Custom Creation" value="Custom Creation" checked />
                                    </RadioGroup>
                                </div>
                            </div>
                            {selectContractInfo === "Multiple Contractor" && (
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Apply Workflow To All Contractor*</div>
                                    <div className={style.displayInRow}>
                                        <FormControlLabel
                                            control={
                                                <Switch checked={applyWorkflowToAll} className={` ${style.textAlignLeft} ${style.fourFieldWidth}`} onChange={() => setApplyWorkflowToAll(!applyWorkflowToAll)}  />
                                            }
                                            className={`${style.switchFontStyle}`}
                                            label={applyWorkflowToAll ? 'YES' : "NO"}
                                        />
                                        {!applyWorkflowToAll && (
                                            <div className={`${style.displayInRow} ${style.fullWidth}`}>
                                                <div className={style.threeFieldWidth}>
                                                    <select
                                                        name="class"
                                                        id="Class"
                                                        className={`${style.fullWidth} `}>
                                                            <option value="2" >
                                                            2
                                                            </option>
                                                    </select>
                                                </div>
                                                <div className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.fullWidth} ${style.marginTop15}`}>Workflow Template To Use*</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {applyWorkflowToAll && (
                                <div className={style.fullWidth}>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Workflow Name</div>
                                        <div className={style.displayInRow}>
                                            <InputGroup className={style.twoFieldWidth} placeholder="Workflow name 1" />
                                        </div>
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Workflow Description</div>
                                        <TextArea className={style.fullWidth} placeholder="Workflow Description" />
                                    </div>
                                    {/* <div className={`${style.flowChartBoxStyle} ${style.marginTop20}`}>
                                        <ToolBar />
                                    </div> */}
                                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                                        <button className={style.newContractOutlinedButton} onClick={() => setViewWorkflowDialog(true)}>View / Create Workflow</button>
                                    </div>
                                </div>
                            )}
                            {!applyWorkflowToAll && (
                                <div className={style.marginTop20}>
                                    <div className={`${style.floatLeft} ${style.reduce10Left} ${style.displayInRow}`}>
                                        <div className={`${style.workFlowButtonStyle} ${style.selectedWorkFlowButton}`}>
                                            Workflow em
                                            <Icon icon="trash" size={10} color="#7165E3"/>
                                        </div>
                                        <div className={style.workFlowButtonStyle}>
                                            Workflow 2
                                            <Icon icon="trash" size={10} color="#52575D"/>
                                        </div>
                                    </div>
                                    <div className={`${style.workflowBoxStyle}`}>
                                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>Workflow Variant 1</div>
                                            <div className={style.displayInRow}>
                                                <InputGroup className={style.twoFieldWidth} placeholder="Workflow em" />
                                            </div>
                                        </div>
                                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>Workflow Description</div>
                                            <TextArea className={style.fullWidth} placeholder="Description" />
                                        </div>
                                        {/* <div className={`${style.flowChartBoxStyle} ${style.marginTop20}`}>
                                            <ToolBar />
                                        </div> */}
                                        <div className={`${style.floatRight} ${style.marginTop20}`}>
                                            <button className={style.newContractOutlinedButton} onClick={() => setViewWorkflowDialog(true)}>View / Create Workflow</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={`${style.floatRight} ${style.marginTop20}`}>
                            <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                            <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {setViewPage8(true);setCurrentPage('Timesheet Processing Workflow')}}>CONTINUE</button>
                        </div>
                    </div>
                ) : viewPage7 ? (
                    <div className={style.cloneBlockStyle}>
                        <div className={`${style.newContractFromCloneBoxStyle}`}>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Number of Timesheets to Submit for Services Performed</div>
                                <InputGroup className={style.fourFieldWidth} value={timeSheetCount} onChange={(e) => setTimeSheetCount(e.target.value)} />
                            </div>
                            {timeSheetCount === '2' && (
                            <div>
                                <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                    <div className={`${style.extentionGrid}`}>
                                        <div className={style.extentionLableStyle}>Timesheets lable 1 for processing</div>
                                        <InputGroup className={style.fullWidth} value="Timesheet Name 1" />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Site Specific Contract*</div>
                                        <TagInput
                                            placeholder="Contracted Activity to include for timesheet 1*"
                                            values={contractedActivityTags}
                                            onAdd={handleContractedActivityTagsAdd}
                                            onRemove={handleContractedActivityTagsRemove}
                                            separator={/[\s,]/}
                                            addOnBlur={true}
                                            addOnPaste={true}
                                            tagProps={getTagProps}
                                        />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Service log Period for timesheet submission*</div>
                                        <div className={style.displayInRow}>
                                            <select
                                                name="class"
                                                id="Class"
                                                // value={selectedContractContinuationPolicy || 'Select...'}
                                                // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                                className={`${style.fullWidth}`}>
                                                    <option value="End of the month" >
                                                    End of the month
                                                    </option>
                                            </select>
                                            <p className={style.threeFieldWidth}></p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                    <div className={`${style.extentionGrid}`}>
                                        <div className={style.extentionLableStyle}>Timesheets lable 2 for processing</div>
                                        <InputGroup className={style.fullWidth} value="Timesheet Name 2" />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Site Specific Contract*</div>
                                        <TagInput
                                            placeholder="Contracted Activity to include for timesheet 1*"
                                            values={contractedActivityTags}
                                            onAdd={handleContractedActivityTagsAdd}
                                            onRemove={handleContractedActivityTagsRemove}
                                            separator={/[\s,]/}
                                            addOnBlur={true}
                                            addOnPaste={true}
                                            tagProps={getTagProps}
                                        />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Service log Period for timesheet submission*</div>
                                        <div className={style.displayInRow}>
                                            <select
                                                name="class"
                                                id="Class"
                                                // value={selectedContractContinuationPolicy || 'Select...'}
                                                // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                                className={`${style.fullWidth}`}>
                                                    <option value="End of the month" >
                                                    End of the month
                                                    </option>
                                            </select>
                                            <p className={style.threeFieldWidth}></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )}
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Timesheets label one for processing</div>
                                <InputGroup className={style.fullWidth} value="Timesheet Name 1" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Service Period For Timesheet Submission*</div>
                                <div className={style.displayInRow}>
                                    <select
                                        name="class"
                                        id="Class"
                                        // value={selectedContractContinuationPolicy || 'Select...'}
                                        // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                        className={`${style.fullWidth}`}>
                                            <option value="Per Timesheet Period" >
                                            Per Timesheet Period
                                            </option>
                                    </select>
                                    <p className={style.threeFieldWidth}></p>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Contractor Business Contact Same As Contractor*</div>
                                <div className={`${style.displayInRow}  `}>
                                    <FormControlLabel
                                        control={
                                            <Switch checked={true} className={`${style.textAlignLeft}`} onChange={() => setSameAsContractor(!sameAsContractor)} />
                                        }
                                        className={`${style.switchFontStyle}`}
                                        label={'YES'}
                                    />
                                    {timeSheetCount === '1' && (
                                        <div className={style.displayInRow}>
                                            <InputGroup className={`${style.fourFieldWidth} ${style.marginLeft20} ${style.marginTop15}`} value="HH" />
                                            <select
                                                name="class"
                                                id="Class"
                                                className={`${style.threeFieldWidth} ${style.marginLeft20} ${style.marginTop} `}>
                                                    <option value="Week" >
                                                    Week
                                                    </option>
                                            </select>
                                        </div>
                                    )}
                                    {timeSheetCount === '2' && (
                                        <div className={style.displayInRow}>
                                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder}  ${style.marginLeft20} ${style.marginTop10}`}>
                                                <EditableText value="150" className={style.editableTextSpecifiedStyle} />
                                                <div className={style.textElementWithNurse}>Specified: 160</div>
                                            </div>
                                            <select
                                                name="class"
                                                id="Class"
                                                className={`${style.threeFieldWidth} ${style.marginLeft20} ${style.marginTop10} `}>
                                                    <option value="Per Week" >
                                                    Per Week
                                                    </option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Planned Absence Notification Days limit*</div>
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                                    <EditableText value="12" className={style.editableTextStyleDays} />
                                    <div className={style.textElementWithoutBackgroundDays}>Days</div>
                                </div>
                            </div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Maximum Unplanned Absence Days Allowed *</div>
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                                    <EditableText value="12" className={style.editableTextStyleDays} />
                                    <div className={style.textElementWithoutBackgroundDays}>Days</div>
                                </div>
                            </div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Invoice Processing Day Range Goal*</div>
                                <div className={style.displayInRow}>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                                        <EditableText value="12" className={style.editableTextStyleDays} />
                                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                                    </div>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder}  ${style.marginLeft20} `}>
                                        <div className={style.textElementWithNurse}>Threshold</div>
                                        <EditableText value="12" className={style.editableTextThresholdStyle} />
                                    </div>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder}`}>
                                        <div className={style.textElementWithNurse}>Goal</div>
                                        <EditableText value="6" className={style.editableTextThresholdStyle} />
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Day limit for submission of timesheet based on activity service date *</div>
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                                    <EditableText value="12" className={style.editableTextStyleDays} />
                                    <div className={style.textElementWithoutBackgroundDays}>Days</div>
                                </div>
                            </div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Day limit for submission of timesheet based on contract end date</div>
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                                    <EditableText value="12" className={style.editableTextStyleDays} />
                                    <div className={style.textElementWithoutBackgroundDays}>Days</div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.floatRight} ${style.marginTop20}`}>
                            <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                            <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {setViewPage8(true);setCurrentPage('Timesheet Processing Workflow')}}>CONTINUE</button>
                        </div>
                    </div>
                ) : viewPage6 ? (
                    <div className={style.cloneBlockStyle}>
                        <div className={`${style.newContractFromCloneBoxStyle}`}>
                            <div className={`${style.extentionGrid} ${selectContractInfo === "Individual Contractor" && style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Compensation Basis*</div>
                                <div>
                                    <RadioGroup
                                        inline={true}
                                        className={`${style.marginTop} ${style.leftAlign}`}
                                        selectedValue={compensation}
                                        onChange={(e) => setCompensation(e.target.value)}
                                    >
                                        <Radio label="RVU Based" value="RVU Based" />
                                        <Radio label="Dollar Based Rate" value="Dollar Based Rate"  />
                                    </RadioGroup>
                                </div>
                            </div>
                            {compensation === "RVU Based" && (
                                <div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>RVU Quantity*</div>
                                        <div className={style.displayInRow}>
                                            <InputGroup className={style.fourFieldWidth} value="" />
                                            <select
                                                name="class"
                                                id="Class"
                                                // value={selectedContractContinuationPolicy || 'Select...'}
                                                // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                                className={`${style.twoFieldWidth} ${style.marginLeft20} ${style.reduceTop}`}>
                                                    <option value="Per Week/Month" >
                                                    Per Week/Month
                                                    </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>FTE Equivalent</div>
                                        <InputGroup className={style.twoFieldWidth} />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>RVU Reference Used</div>
                                        <InputGroup className={style.fullWidth} />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>RVU Quantity Variance (+/-)</div>
                                        <InputGroup className={style.twoFieldWidth} />
                                    </div>
                                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>RVU Quantity Period</div>
                                        <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                                            <EditableText value="3" className={style.editableTextStyleDays} />
                                            <div className={style.textElementWithoutBackgroundDays}>Days</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Dollar Hourly Rate*</div>
                                <InputGroup className={style.fourFieldWidth} value="120" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Dollar Value per Timesheet Submission*</div>
                                <InputGroup className={style.fourFieldWidth} value="40" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Dollar Value for per Contracted Year/Period*</div>
                                <InputGroup className={style.fourFieldWidth} value="120" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Compensation Offset Criteria for Reduced Number of Agreed to Services*</div>
                                <select
                                    name="class"
                                    id="Class"
                                    // value={selectedContractContinuationPolicy || 'Select...'}
                                    // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                    className={`${style.fullWidth}`}>
                                        <option value="Per Timesheet Period" >
                                        Per Timesheet Period
                                        </option>
                                </select>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Compensation Offset Criteria for Providing Additional Services to the Agreed to Services*</div>
                                <select
                                    name="class"
                                    id="Class"
                                    // value={selectedContractContinuationPolicy || 'Select...'}
                                    // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                    className={`${style.fullWidth}`}>
                                        <option value="Per Contract Period" >
                                        Per Contract Period
                                        </option>
                                </select>
                            </div>
                        </div>
                        <div className={`${style.floatRight} ${style.marginTop20}`}>
                            <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                            <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {setViewPage7(true);setCurrentPage('Timesheet Submission Terms')}}>CONTINUE</button>
                        </div>
                    </div>
                ) : viewPage5 ?
                  <ServiceSpecification getViewPage6={getViewPage6} getAddon={getAddOn} />
                  :viewPage4 ? (
                    <div className={style.cloneBlockStyle}>
                    <div className={style.tableHeight}>
                        <div>
                            <InputGroup className={`${style.documentProofInputWidth} ${style.marginLeft20}`} placeholder="For this contract to be active, proof of documentation is required for items listed on the Right." />
                        </div>
                        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                            <div className={`${style.extentionLableStyle} ${style.marginTop20} ${style.marginLeft20}`}>Contracted Service Providers:<strogn className={`${style.blackText} ${style.bold} ${style.marginLeft20}`}>3</strogn></div>
                            <button className={`${style.addCotractorButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} ${style.marginRight20}`}
                             onClick={()=> getShowAlertDialog(true)} >ADD CONTRACTED PROVIDER</button>
                        </div>
                        <div className={`${style.documentPageHeader} ${style.marginTop10}`}>
                            <p className={style.documentProofTextWidth}></p>
                            <p className={style.documentProofTextWidth}>POD TYPE</p>
                            <p className={style.documentProofTextWidth}>SITE</p>
                            <p className={style.documentProofTextWidth}>CONTRACTOR</p>
                            <p className={style.documentProofTextWidth}>COPY ON FILE</p>
                            <p className={style.documentProofTextWidth}></p>
                        </div>
                        <div className={`${style.documentDataProof} ${style.displayInRow}`}>
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
                            <p className={style.documentProofDataTextWidth}>Medical license Certificate</p>
                            <p className={style.documentProofDataTextWidth}>business </p>
                            <p className={style.documentProofDataTextWidth}>name</p>
                            <div className={style.displayInRow}>
                                <img src={FileImg} alt="file" className={`${style.fileIcon} ${style.marginLeft20}`} />
                                <p className={style.documentProofDataTextWidth}>ss.png</p>
                            </div>
                            <Icon icon="trash" size={20} color="#52575D"/>
                        </div>
                        <div className={`${style.documentDataProof} ${style.displayInRow}`}>
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
                            <p className={style.documentProofDataTextWidth}>Medical license Certificate</p>
                            <p className={style.documentProofDataTextWidth}>entity </p>
                            <p className={style.documentProofDataTextWidth}>name</p>
                            <div className={style.displayInRow}>
                                <img src={FileImg} alt="file" className={`${style.fileIcon} ${style.marginLeft20}`} />
                                <p className={style.documentProofDataTextWidth}>Missing</p>
                            </div>
                            <Icon icon="trash" size={20} color="#52575D"/>
                        </div>
                        <div className={`${style.documentDataProof} ${style.displayInRow}`}>
                            <img src={RedWarning} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
                            <p className={style.documentProofDataTextWidth}>Medical license Certificate</p>
                            <p className={style.documentProofDataTextWidth}>sample </p>
                            <p className={style.documentProofDataTextWidth}>name</p>
                            <div className={style.displayInRow}>
                                <img src={FileImg} alt="file" className={`${style.fileIcon} ${style.marginLeft20}`} />
                                <p className={style.documentProofDataTextWidth}>ss.png</p>
                            </div>
                            <Icon icon="trash" size={20}  color="#52575D"/>
                        </div>
                    </div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.outlinedButton}>SAVE IN-PROGRESS</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={()=>{setViewPage5(true);setCurrentPage('Contracted Services Specification')}}>CONTINUE</button>
                    </div>
                </div>
                ) : viewPage3 ? (
                    <ContractorBusinessEntity 
                    getViewPage4={getViewPage4} 
                    getCurrentPage={getCurrentPage}
                    selectContractInfo={selectContractInfo} />
                )
                : selectContractInfo === "Individual Contractor" && viewPage2 ? (
                    <ContractedServicesProviderIndividual 
                    getViewPage3={getViewPage3} 
                    getCurrentPage={getCurrentPage} />
                ) : (selectContractInfo === "Individual Contractor" && viewPage1) ? (
                    <ContractIdTermLimitIndividual 
                    getViewPage1={getViewPage1} 
                    getViewPage2={getViewPage2} />
                ) : (selectContractInfo === "Multiple Contractor" && (viewPage1 || viewPage2)) ? (
                    <ContractedServicesProviderMultiple 
                    getNewServiceProviderDialog={getNewServiceProviderDialog} 
                    getViewPage1={getViewPage1} 
                    getViewPage2={getViewPage2} 
                    getViewPage3={getViewPage3} 
                    getCurrentPage={getCurrentPage} />
                ) : ''}
                <div className={style.cloneBlockStyle}>
                    <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Indentification Information</p>
                    <div className={style.welcomeBorder}></div>
                    <p className={style.descriptionStyle}>
                    {currentPage}
                    </p>
                    <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Activity Performed</p>
                    <div className={style.welcomeBorder}></div>
                    {viewPage1 && !viewPage2 && (
                        <div className={style.validationAlert}>
                            <div className={style.displayInRow}>
                                <div>
                                    <p className={`${style.blackText} ${style.leftAlign}`}><strong>Text to Alert User</strong></p>
                                    <p className={`${style.blackText} ${style.leftAlign}`}>This area will display specific alerts for the users</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Reference Contract Documents</p>
                    <div className={style.welcomeBorder}></div>
                    <div className={style.documentCard}>
                        <div>
                            <div>
                                <p className={`${style.blackText} ${style.leftAlign}`}><strong>executed Contract (Current)</strong></p>
                                <div className={style.spaceBetween}>
                                    <p className={`${style.blackText} ${style.leftAlign}`}>Contract name to appear here</p>
                                    <div>
                                        <Icon icon="trash" className={style.trashStyle} size={10} onClick={() => getDeleteExecutedContractDialog(true)}  />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.documentCard} ${style.marginTop10}`}>
                        <div>
                            <div>
                                <p className={`${style.blackText} ${style.leftAlign}`}><strong>Exhibit</strong></p>
                                <div className={style.spaceBetween}>
                                    <p className={`${style.blackText} ${style.leftAlign}`}>Exhibit A and B</p>
                                    <div>
                                        <Icon icon="trash" className={style.trashStyle} size={10} onClick={() => getDeleteExecutedContractDialog(true)}  />
                                    </div>
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
            <Dialog isOpen={viewWorkflowDialog} onClose={() => setViewWorkflowDialog(false)} className={`${style.toolbarDialogStyle} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                    <div className={style.spaceBetween}>
                    <div className={style.reduceTop10}>
                        <p className={style.extensionStyle}>View / Creat Workflow</p>
                        <p>Note: To Draw Arrow or Line, click on its element and draw on the screen.</p>
                        </div>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setViewWorkflowDialog(false)}  />
                    </div>
                    <div className={`${style.flowChartBoxStyle}`}>
                        <ToolBar />
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default NewContractFromClone;
