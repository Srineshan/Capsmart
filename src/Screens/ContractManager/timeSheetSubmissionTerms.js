import React, { useState } from 'react';
import { InputGroup, TagInput, EditableText } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import style from './index.module.scss';

const VALUES4 = ['Activity 1', 'Activity 2', 'Activity 3'];
const VALUES3 = ['Activity Reviewer'];

const TimeSheetSubmissionTerms = ({getViewPage8, getCurrentPage}) => {
    const [timeSheetCount, setTimeSheetCount] = useState('1');
    const [sameAsContractor, setSameAsContractor] = useState(false);
    const [activityTags, setActivityTags] = useState(VALUES3);
    const [contractedActivityTags, setContractedActivityTags] = useState(VALUES4);
    const [timeSheetLabelOne, setTimeSheetLabelOne] = useState('');
    const [servicePeriod, setServicePeriod] = useState('');
    const [sameAsContractorHour, setSameAsContractorHour] = useState('');
    const [sameAsContractorFrequency, setSameAsContractorFrequency] = useState('');
    const [plannedAbsence, setPlannedAbsence] = useState(0);
    const [maxUnplannedAbsence, setMaxUnplannedAbsence] = useState(0);
    const [invoiceProcessingDay, setInvoiceProcessingDay] = useState(0);
    const [invoiceProcessingDayThreshold, setInvoiceProcessingDayThreshold] = useState(0);
    const [invoiceProcessingDayGoal, setInvoiceProcessingDayGoal] = useState(0);
    const [dayLimitForSubmissionBasedOnActivityServiceDate, setDayLimitForSubmissionBasedOnActivityServiceDate] = useState(0);
    const [dayLimitForSubmissionBasedOnContractEndDate, setDayLimitForSubmissionBasedOnContractEndDate] = useState(0);

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
    return (
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
                {timeSheetCount === '1' && (
                    <div>
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
                    </div>
                )}
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
                        <EditableText value={plannedAbsence} onChange={(e) => setPlannedAbsence(e)} className={style.editableTextStyleDays} />
                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Maximum Unplanned Absence Days Allowed *</div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                        <EditableText value={maxUnplannedAbsence} onChange={(e) => setMaxUnplannedAbsence(e)} className={style.editableTextStyleDays} />
                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Invoice Processing Day Range Goal*</div>
                    <div className={style.displayInRow}>
                        <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                            <EditableText value={invoiceProcessingDay} onChange={(e) => setInvoiceProcessingDay(e)} className={style.editableTextStyleDays} />
                            <div className={style.textElementWithoutBackgroundDays}>Days</div>
                        </div>
                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder}  ${style.marginLeft20} `}>
                            <div className={style.textElementWithNurse}>Threshold</div>
                            <EditableText value={invoiceProcessingDayThreshold} onChange={(e) => setInvoiceProcessingDayThreshold(e)} className={style.editableTextThresholdStyle} />
                        </div>
                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder}`}>
                            <div className={style.textElementWithNurse}>Goal</div>
                            <EditableText value={invoiceProcessingDayGoal} onChange={(e) => setInvoiceProcessingDayGoal(e)} className={style.editableTextThresholdStyle} />
                        </div>
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Day limit for submission of timesheet based on activity service date *</div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                        <EditableText value={dayLimitForSubmissionBasedOnActivityServiceDate} onChange={(e) => setDayLimitForSubmissionBasedOnActivityServiceDate(e)} className={style.editableTextStyleDays} />
                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Day limit for submission of timesheet based on contract end date</div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                        <EditableText value={dayLimitForSubmissionBasedOnContractEndDate} onChange={(e) => setDayLimitForSubmissionBasedOnContractEndDate(e)} className={style.editableTextStyleDays} />
                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                    </div>
                </div>
            </div>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={() => { getViewPage8(true); getCurrentPage('Timesheet Processing Workflow') }}>CONTINUE</button>
            </div>
        </div>
    )
}

export default TimeSheetSubmissionTerms;