import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TextArea, InputGroup, RadioGroup, Radio, Icon, Intent, TagInput, EditableText } from '@blueprintjs/core';
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

    const getViewPage6 = (value) => {
        setViewPage6(value);
        setCurrentPage('Payment & Compensation');
    }

    const getDeleteExecutedContractDialog = (value) => {
        setDeleteExecutedContractDialog(value);
        console.log(value);
    }

    const getAddOn = (value) => {
        setAddOn(value);
    }

    useEffect(() => {
        setIsMultipleContract(selectContractInfo === "Multiple Contractor" ? true : false);
      }, [selectContractInfo]);

      console.log(isMultipleContract, selectContractInfo)

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
        console.log('selectedItem', selectedItem);
        setItem(selectedItem);
        setSelectContractManager('');
      }, []);

      const onSelectContractId = useCallback((selectedItem) => {
        console.log('selectedItem', selectedItem);
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

    console.log(selectContractManager, completedSteps);

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
                                    <div className={`${style.flowChartBoxStyle} ${style.marginTop20}`}>
                                        <ToolBar />
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
                                        <div className={`${style.flowChartBoxStyle} ${style.marginTop20}`}>
                                            <ToolBar />
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
                    <div className={style.cloneBlockStyle}>
                        <div className={`${style.newContractFromCloneBoxStyle}`}>
                            {selectContractInfo === "Individual Contractor" && (
                                <div className={`${style.extentionGrid}`}>
                                    <div className={style.extentionLableStyle}>Contractor Business Contact Same As Contractor*</div>
                                    <FormControlLabel
                                        control={
                                            <Switch checked={sameAsContractor} className={`${style.textAlignLeft}`} onChange={() => setSameAsContractor(!sameAsContractor)} />
                                        }
                                        className={`${style.switchFontStyle} ${style.marginTop}`}
                                        label={sameAsContractor ? 'YES' : 'NO'}                      
                                    />
                                </div>
                            )}
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Business Entity Name*</div>
                                <InputGroup className={style.fullWidth} value="Text" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
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
                                    <FormControlLabel
                                        control={
                                            <Switch checked={true} className={`${style.textAlignLeft}`} />
                                        }
                                        className={`${style.switchFontStyle}`}
                                        label={'YES'}                      
                                    />
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
                            <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {setViewPage4(true);setCurrentPage('Documentation Proof Required')}}>CONTINUE</button>
                        </div>
                    </div>
                )
                : selectContractInfo === "Individual Contractor" && viewPage2 ? (
                <div className={style.cloneBlockStyle}>
                    <div className={`${style.newContractFromCloneBoxStyle}`}>
                    <div className={`${style.extentionGrid}`}>
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
                                <Radio label="NA" value="Not Available" />
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
                            <div className={style.extentionLableStyle}>Email Contractor id*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="Enter entity specific email" className={`${style.entityFieldWidth} ${style.alertValidationInputStyle}`}/>
                                <RadioGroup
                                    inline={true}
                                    className={`${style.marginTop} ${style.marginLeft20}`}
                                >
                                    <Radio label="NA" value="Not Available" />
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
                                <Radio label="NA" value="Not Available" />
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
                                <div className={style.flexLeft}>
                                    <FormControlLabel
                                        control={
                                            <Switch checked={siteLevel} className={`${style.flexLeft}`} onChange={() => setSiteLevel(!siteLevel)}  />
                                        }
                                        className={`${style.switchFontStyle} ${style.marginTop}`}
                                        label={siteLevel ? 'YES' : "NO"}                   
                                    />
                                </div>
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
                                        {selectedContract === "Multiple Contractor" && (
                                            <div className={`${style.siteLevelGrid} ${style.marginTop10}`}>
                                                <div className={style.marginTop}>Site*</div>
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
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Department Level Responsibility*</div>
                            <div>
                                <div className={style.flexLeft}>
                                    <FormControlLabel
                                        control={
                                            <Switch checked={departmentLevel} className={`${style.flexLeft}`} onChange={() => setDepartmentLevel(!departmentLevel)}  />
                                        }
                                        className={`${style.switchFontStyle} ${style.marginTop}`}
                                        label={departmentLevel ? 'YES' : "NO"}                 
                                    />
                                </div>
                                <div>
                                    {departmentLevel && (
                                        <div className={`${style.departmentLevelBoxStyle}`}>
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
                                            {selectedContract === "Multiple Contractor" && (
                                                <div className={`${style.siteLevelGrid} ${style.marginTop10}`}>
                                                    <div className={style.marginTop}>Site*</div>
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
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Assign Contractor With App User Role*</div>
                            <div>
                                {/* <TagInput
                                    values={activityTags}
                                    onAdd={handleActivityTagsAdd}
                                    onRemove={handleActivityTagsRemove}
                                    separator={/[\s,]/}
                                    addOnBlur={true}
                                    addOnPaste={true}
                                    tagProps={getTagProps}
                                    rightElement={rightIconElement}
                                /> */}
                                <FormControl sx={{ m: 1, width: '100%' }}>
                                    <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={personName}
                                    onChange={handleChange}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                    >
                                    {names.map((name) => (
                                        <MenuItem
                                        key={name}
                                        value={name}
                                        style={getStyles(name, personName, theme)}
                                        >
                                            <Checkbox checked={personName.indexOf(name) > -1} />
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                        <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {setViewPage3(true);setCurrentPage('Contractor Business Entity')}}>CONTINUE</button>
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
                        <div className={`${style.extentionGrid} ${style.marginTop20} ${contractType === "Individual Contractor" && style.disabledView} `}>
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
                        <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {setViewPage2(true);setViewPage1(false);setCurrentPage('Contracted Services Provider(s)')}}>CONTINUE</button>
                    </div>
                </div>
                ) : (selectContractInfo === "Multiple Contractor" && (viewPage1 || viewPage2)) ? (
                    <div className={style.cloneBlockStyle}>
                        <div className={style.tableHeight}>
                            <div className={style.spaceBetween}>
                                <div className={`${style.extentionLableStyle} ${style.marginTop20} ${style.marginLeft20}`}>Contracted Service Providers:<strogn className={`${style.blackText} ${style.bold} ${style.marginLeft20}`}>3</strogn></div>
                                <button className={`${style.addCotractorButton} ${style.selectedColor} ${style.cursorPointer} `}
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
                            <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {{viewPage2 ? setViewPage3(true) : setViewPage2(true)};setViewPage1(false);completedSteps.push('1');setCurrentPage('Contracted Services Provider(s)')}}>CONTINUE</button>
                        </div>
                    </div>
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
        </div>
    )
}

export default NewContractFromClone;
