import React, { useEffect, useState } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import style from './index.module.scss';
import { GET, PUT, POST, TenantID } from './../dataSaver';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import InputAdornment from '@mui/material/InputAdornment';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { format } from 'date-fns';

const PreImplementationDataDialog = ({ showPreImplementationDialog, getPreImplementationDialogBoolean, contractId, selectedContractPreImplementationData }) => {
    const [clinicBlockCompleted, setClinicBlockCompleted] = useState('');
    const [surgeryBlockCompleted, setSurgeryBlockCompleted] = useState('');
    const [procedureBlockCompleted, setProcedureBlockCompleted] = useState('');
    const [onCallCompleted, setOnCallCompleted] = useState('');
    const [supplementalCompleted, setSupplementalCompleted] = useState('');
    const [clinicalCareServiceRendered, setClinicalCareServiceRendered] = useState({ value: 0, na: false });
    const [administrativeResponsibilities, setAdministrativeResponsibilities] = useState({ value: 0, na: false });
    const [totalCompensation, setTotalCompensation] = useState({ value: 0, na: false });
    const [absenseDays, setAbsenseDays] = useState({ value: 0, na: false });
    const [activitiesCompleted, setActivitiesCompleted] = useState(false);
    const [obligatedActivities, setObligatedActivities] = useState([]);
    const [obligatedFields, setObligatedFields] = useState([]);

    useEffect(() => {
        getPreImplementationValue();
    }, [showPreImplementationDialog]);

    useEffect(() => {
        getObligatedActivities();
    }, [obligatedActivities])

    const getPreImplementationValue = async () => {
        const { data: preImplementationData } = await GET(`timesheet-management-service/timesheet/preImplementationData/${contractId}`);
        setObligatedActivities(preImplementationData?.obligatedActivities);
        setAbsenseDays({ ...absenseDays, value: preImplementationData?.noOfDaysAbsent, na: preImplementationData?.absentDaysUpToDate })
        setTotalCompensation({ ...totalCompensation, value: preImplementationData?.totalCompensationPaid?.value, na: preImplementationData?.totalCompensationPaid?.upToDate })
        setActivitiesCompleted(preImplementationData?.activitiesUpToDate);

        console.log('preimplementation data', preImplementationData);
    }

    console.log(selectedContractPreImplementationData, obligatedActivities)

    const addPreImplementationData = async (buttonType) => {
        if (!clinicalCareServiceRendered?.na && clinicalCareServiceRendered?.value === 0) {
            ErrorToaster('For Clinical Care Services Rendered Is Mandatory If Not NA');
            return;
        }
        if (!administrativeResponsibilities?.na && administrativeResponsibilities?.value === 0) {
            ErrorToaster('Administrative Duties & Responsibilities Is Mandatory If Not NA');
            return;
        }
        if (!totalCompensation?.na && totalCompensation?.value === 0) {
            ErrorToaster('Total Compensation Paid For Elapsed Contract Year Is Mandatory If Not NA');
            return;
        }
        if (!absenseDays?.na && absenseDays?.value === 0) {
            ErrorToaster('Absence Days Taken During Elapsed Contract Year Is Mandatory If Not NA');
            return;
        }
        let data = {
            "dataPeriod": {
                "startDate": selectedContractPreImplementationData?.contractDetail?.contractTerm?.startDate,
                "endDate": selectedContractPreImplementationData?.contractDetail?.contractTerm?.endDate
            },
            "obligatedActivities": [
                {
                    "activityType": {
                        "activityType": "string"
                    },
                    "activityTypeTemplate": {
                        "activityTypeTemplate": "string"
                    },
                    "performingActivity": {
                        "activity": "string"
                    },
                    "completed": 0
                }
            ],
            "activitiesUpToDate": activitiesCompleted,
            "noOfDaysAbsent": absenseDays?.value,
            "absentDaysUpToDate": absenseDays?.na,
            "contractPeriodPayments": [
                {
                    "label": {
                        "label": "string"
                    },
                    "amount": {
                        "value": 0,
                        "upToDate": true
                    }
                }
            ],
            "contractYearPayments": [
                {
                    "label": {
                        "label": "string"
                    },
                    "amount": {
                        "value": 0,
                        "upToDate": true
                    }
                }
            ],
            "totalCompensationPaid": {
                "value": totalCompensation?.value,
                "upToDate": totalCompensation?.na
            }
        }

        console.log(data)

        // await POST('timesheet-management-service/timesheet/preImplementationData', data)
        //     .then(response => {
        //         SuccessToaster('Pre Implementation Data Saved Successfully');
        //     }).catch(error => {
        //         ErrorToaster('Unexpected Error Creating Pre Implementation Data');
        //     })
    }

    const handleObligatedActivities = (e, i) => {
        if (parseInt(e) <= 999) {
            console.log('value of e ', e, typeof parseInt(e), parseInt(e) <= 999);
            let temp = obligatedActivities;
            temp[i].completed = parseInt(e);
            setObligatedActivities(temp);
        }
    }

    const getObligatedActivities = () => {
        let temp = [];
        for (let i = 0; i < obligatedActivities?.length; i++) {
            temp[i] = (
                <div className={`${style.marginTop20}`} key={`obligatedActivities${i}-${obligatedActivities?.[i]?.activityType?.activityType}`} >
                    <CommonLabel value={obligatedActivities?.[i]?.activityType?.activityType} />
                    <CommonInputField className={style.fullWidth}
                        key={`completed${i}${obligatedActivities?.[i]?.completed}`}
                        defaultValue={obligatedActivities?.[i]?.completed}
                        type='number'
                        onChange={(e) => e.target.value >= 0 && handleObligatedActivities(e.target.value, i)}
                    />
                </div >
            )
        }
        setObligatedFields(temp);
    }

    return (
        <Dialog isOpen={showPreImplementationDialog} onClose={() => getPreImplementationDialogBoolean(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <div>
                        <p className={`${style.popUpPreImplementationHeading}`}>Obligated activities Completed & Payments in this contract year prior to <span className={style.purpleText}>{`{go live date: April 1, 2023 }`}</span></p>
                        <p className={`${style.popUpPreImplementationSubHeading}`}>For The Period - {format(new Date(selectedContractPreImplementationData?.contractDetail?.contractTerm?.startDate || new Date()), 'MMM d, yyyy')} - {format(new Date(selectedContractPreImplementationData?.contractDetail?.contractTerm?.endDate || new Date()), 'MMM d, yyyy')}</p>
                    </div>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getPreImplementationDialogBoolean(false)} />
                </div>
                <div className={style.extensionBorder}></div>
                <div className={`${style.preImplementationGrid} ${style.marginTop20}`}>
                    <div className={style.preImplementationPadding}>
                        <div>
                            <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
                                <div className={style.popUpPreImplementationTitle}>Obligated Activities Completed</div>
                                <CommonCheckBox
                                    checked={activitiesCompleted} onChange={(e) => setActivitiesCompleted(!activitiesCompleted)}
                                    label="NA" />
                            </div>
                            {/* <div className={`${style.marginTop20}`}>
                                <CommonLabel value='Clinic Block Completed ( Fracture Clinic, orthopedics Clinic )' />
                                <CommonInputField className={style.fullWidth}
                                    value={clinicBlockCompleted}
                                    type='number'
                                    onChange={(e) => e.target.value >= 0 && setClinicBlockCompleted(e.target.value)}
                                />
                            </div>
                            <div className={`${style.marginTop20}`}>
                                <CommonLabel value='Surgery Blocks Completed' />
                                <CommonInputField className={style.fullWidth}
                                    value={surgeryBlockCompleted}
                                    type='number'
                                    onChange={(e) => e.target.value >= 0 && setSurgeryBlockCompleted(e.target.value)}
                                />
                            </div>
                            <div className={`${style.marginTop20}`}>
                                <CommonLabel value='Procedure reading / Implant block completed' />
                                <CommonInputField className={style.fullWidth}
                                    value={procedureBlockCompleted}
                                    type='number'
                                    onChange={(e) => e.target.value >= 0 && setProcedureBlockCompleted(e.target.value)}
                                />
                            </div>
                            <div className={`${style.marginTop20}`}>
                                <CommonLabel value='On Call Coverage Duty Days Completed' />
                                <CommonInputField className={style.fullWidth}
                                    value={onCallCompleted}
                                    type='number'
                                    onChange={(e) => e.target.value >= 0 && setOnCallCompleted(e.target.value)}
                                />
                            </div>
                            <div className={`${style.marginTop20}`}>
                                <CommonLabel value='Suppliemetal Service Hours Used' />
                                <CommonInputField className={style.fullWidth}
                                    value={supplementalCompleted}
                                    type='number'
                                    onChange={(e) => e.target.value >= 0 && setSupplementalCompleted(e.target.value)}
                                />
                            </div> */}
                            {obligatedFields}
                        </div>
                    </div>
                    <div className={`${style.leftBorder} ${style.preImplementationPadding}`}>
                        <div className={style.popUpPreImplementationTitle}>Payments Made For Elapsed Contract Year</div>
                        <div className={`${style.marginTop20}`}>
                            <CommonLabel value='For Clinical Care Services Rendered' />
                            <div className={style.displayInRow}>
                                <CommonTextField
                                    className={style.fullWidth}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                    }}
                                    onChange={(e) => e.target.value >= 0 && setClinicalCareServiceRendered({ ...clinicalCareServiceRendered, value: e.target.value.slice(0, 9).replace(/,/g, "") })}
                                    value={Number(clinicalCareServiceRendered?.value)?.toLocaleString()}
                                // disabled={clinicalCareServiceRendered?.na}
                                />
                                <CommonCheckBox className={style.marginLeft20}
                                    checked={clinicalCareServiceRendered?.na} onChange={(e) => setClinicalCareServiceRendered({ ...clinicalCareServiceRendered, na: !clinicalCareServiceRendered?.na, value: 0 })}
                                    label="NA" />
                            </div>
                        </div>
                        <div className={`${style.marginTop20}`}>
                            <CommonLabel value='Administrative Duties & Responsibilities' />
                            <div className={style.displayInRow}>
                                <CommonTextField
                                    className={style.fullWidth}
                                    // type="number"
                                    min="0"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                    }}
                                    onChange={(e) => e.target.value >= 0 && setAdministrativeResponsibilities({ ...administrativeResponsibilities, value: e.target.value.slice(0, 9).replace(/,/g, "") })}
                                    value={Number(administrativeResponsibilities?.value)?.toLocaleString()}
                                // disabled={administrativeResponsibilities?.na}
                                />
                                <CommonCheckBox className={style.marginLeft20}
                                    checked={administrativeResponsibilities?.na} onChange={(e) => setAdministrativeResponsibilities({ ...administrativeResponsibilities, na: !administrativeResponsibilities?.na, value: 0 })} label="NA" />
                            </div>
                        </div>
                        <div className={`${style.marginTop20}`}>
                            <CommonLabel value='Total Compensation Paid for Elapsed Contract Year' />
                            <div className={style.displayInRow}>
                                <CommonTextField
                                    className={style.fullWidth}
                                    // type="number"
                                    min="0"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                    }}
                                    onChange={(e) => e.target.value >= 0 && setTotalCompensation({ ...totalCompensation, value: e.target.value.slice(0, 9).replace(/,/g, "") })}
                                    value={Number(totalCompensation?.value)?.toLocaleString()}
                                // disabled={totalCompensation?.na}
                                />
                                <CommonCheckBox className={style.marginLeft20}
                                    checked={totalCompensation?.na} onChange={(e) => setTotalCompensation({ ...totalCompensation, na: !totalCompensation?.na, value: 0 })} label="NA" />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.leftBorder} ${style.preImplementationPadding}`}>
                        <div className={style.popUpPreImplementationTitle}>Absence Days Taken During Elapsed Contract Year</div>
                        <div className={`${style.marginTop20}`}>
                            <CommonLabel value='Days' />
                            <div className={style.displayInRow}>
                                <CommonInputField className={style.fullWidth}
                                    value={absenseDays?.value}
                                    type='number'
                                    // min="0"
                                    // disabled={absenseDays?.na}
                                    onChange={(e) => e.target.value >= 0 && setAbsenseDays({ ...absenseDays, value: e.target.value })}
                                />
                                <CommonCheckBox className={style.marginLeft20}
                                    checked={absenseDays?.na} onChange={(e) => setAbsenseDays({ ...absenseDays, na: !absenseDays?.na, value: 0 })}
                                    label="NA" />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={`${style.buttonStyle} `}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => addPreImplementationData()}>SAVE AS DONE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default PreImplementationDataDialog;
