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
    const [contractPayments, setContractPayments] = useState([]);
    const [contractPaymentFields, setContractPaymentFields] = useState([]);
    const [preImplementationDataId, setPreImplementationDataId] = useState('');

    useEffect(() => {
        getPreImplementationValue();
    }, [showPreImplementationDialog]);

    useEffect(() => {
        getObligatedActivities();
    }, [obligatedActivities])

    useEffect(() => {
        getContractPayments();
    }, [contractPayments])

    const getPreImplementationValue = async () => {
        const { data: preImplementationData } = await GET(`timesheet-management-service/timesheet/preImplementationData/${contractId}`);
        setObligatedActivities(preImplementationData?.obligatedActivities);
        setContractPayments(preImplementationData?.contractYearPayments);
        setAbsenseDays({ ...absenseDays, value: preImplementationData?.noOfDaysAbsent, na: preImplementationData?.absentDaysUpToDate })
        setTotalCompensation({ ...totalCompensation, value: preImplementationData?.totalCompensationPaid?.value, na: preImplementationData?.totalCompensationPaid?.upToDate })
        setActivitiesCompleted(preImplementationData?.activitiesUpToDate);
        setPreImplementationDataId(preImplementationData?.id);
        console.log('preimplementation data', preImplementationData);
    }

    console.log(selectedContractPreImplementationData, obligatedActivities, contractPayments)

    const addPreImplementationData = async (buttonType) => {
        // if (!clinicalCareServiceRendered?.na && clinicalCareServiceRendered?.value === 0) {
        //     ErrorToaster('For Clinical Care Services Rendered Is Mandatory If Not NA');
        //     return;
        // }
        // if (!administrativeResponsibilities?.na && administrativeResponsibilities?.value === 0) {
        //     ErrorToaster('Administrative Duties & Responsibilities Is Mandatory If Not NA');
        //     return;
        // }
        if (!activitiesCompleted && obligatedActivities?.map(data => data?.completed)?.includes(0)) {
            ErrorToaster('Obligated Activities Data Are Mandatory If Not NA');
            return;
        }
        if (contractPayments?.filter(data => data?.amount?.upToDate === false && (data?.amount?.value === '0' || data?.amount?.value === '' || data?.amount?.value === 0))?.length > 0) {
            ErrorToaster('Payments Made For Elapsed Contract Year Are Mandatory If Not NA');
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
            "id": preImplementationDataId,
            "dataPeriod": {
                "startDate": selectedContractPreImplementationData?.contractDetail?.contractTerm?.startDate,
                "endDate": selectedContractPreImplementationData?.contractDetail?.contractTerm?.endDate
            },
            "obligatedActivities": obligatedActivities,
            "activitiesUpToDate": activitiesCompleted,
            "noOfDaysAbsent": absenseDays?.value,
            "absentDaysUpToDate": absenseDays?.na,
            "contractYearPayments": contractPayments,
            "totalCompensationPaid": {
                "value": totalCompensation?.value,
                "upToDate": totalCompensation?.na
            }
        }

        console.log(data)

        await POST('timesheet-management-service/timesheet/preImplementationData', data)
            .then(response => {
                SuccessToaster('Pre Implementation Data Saved Successfully');
                getPreImplementationDialogBoolean(false);
            }).catch(error => {
                ErrorToaster('Unexpected Error Creating Pre Implementation Data');
            })
    }

    const handleObligatedActivities = (e, i) => {
        if (parseInt(e) <= 999) {
            let temp = obligatedActivities;
            temp[i].completed = parseInt(e);
            setObligatedActivities(temp);
            console.log(temp);
        }
    }

    const handleContractPayments = (e, i, na, src) => {
        let temp = contractPayments;
        if (src === 'input') {
            temp[i].amount.value = e.replace(/,/g, "");
        }
        temp[i].amount.upToDate = na;
        setContractPayments(temp);
        console.log(temp, contractPayments);
        getContractPayments();
    }

    console.log(contractPayments);


    const getObligatedActivities = () => {
        let temp = [];
        for (let i = 0; i < obligatedActivities?.length; i++) {
            console.log(obligatedActivities?.[i]?.completed);
            temp[i] = (
                <div className={`${style.marginTop20}`} key={i} >
                    <CommonLabel value={`${obligatedActivities?.[i]?.activityType?.activityType} ${obligatedActivities?.[i]?.activityTypeTemplate?.activityTypeTemplate !== 'Administrative / Miscellaneous Service' ? `(${obligatedActivities?.[i]?.performingActivity?.activity})` : ''}`} />
                    <CommonInputField className={style.fullWidth}
                        key={i}
                        type='number'
                        defaultValue={obligatedActivities?.[i]?.completed}
                        onChange={(e) => handleObligatedActivities(e.target.value, i)}
                    />
                </div >
            )
        }
        setObligatedFields(temp);
    }

    const getContractPayments = () => {
        let tempPayment = [];
        for (let i = 0; i < contractPayments?.length; i++) {
            console.log(Number(contractPayments?.[i]?.amount?.value)?.toLocaleString())
            tempPayment[i] = (
                <div className={`${style.marginTop20}`} key={i} >
                    <CommonLabel value={`${contractPayments?.[i]?.label?.label}`} />
                    <div className={style.displayInRow}>
                        <CommonTextField
                            className={style.fullWidth}
                            InputProps={{
                                startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                            }}
                            key={i}
                            value={contractPayments?.[i]?.amount?.value ? Number(contractPayments?.[i]?.amount?.value)?.toLocaleString() : null}
                            onChange={(e) => handleContractPayments((e.target.value.slice(0, 9)), i, false, 'input')}
                        />
                        <CommonCheckBox className={style.marginLeft20}
                            checked={contractPayments?.[i]?.amount?.upToDate} onChange={(e) => handleContractPayments(contractPayments?.[i]?.amount?.value, i, !contractPayments?.[i]?.amount?.upToDate, 'check')}
                            label='NA' key={"contractPayments" + contractPayments?.[i]?.amount?.upToDate} />
                    </div>
                </div >
            )
        }
        setContractPaymentFields(tempPayment);
    }

    return (
        <Dialog isOpen={showPreImplementationDialog} onClose={() => getPreImplementationDialogBoolean(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <div>
                        <p className={`${style.popUpPreImplementationHeading}`}>Obligated activities Completed & Payments in this contract year prior to <span className={style.purpleText}>April 1, 2023</span></p>
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
                        {/* <div className={`${style.marginTop20}`}>
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
                                    onChange={(e) => setAdministrativeResponsibilities({ ...administrativeResponsibilities, value: (e.target.value.slice(0, 9)).replace(/,/g, "") })}
                                    value={administrativeResponsibilities?.value ? Number(administrativeResponsibilities?.value)?.toLocaleString() : null}
                                // disabled={administrativeResponsibilities?.na}
                                />
                                <CommonCheckBox className={style.marginLeft20}
                                    checked={administrativeResponsibilities?.na} onChange={(e) => setAdministrativeResponsibilities({ ...administrativeResponsibilities, na: !administrativeResponsibilities?.na, value: 0 })} label="NA" />
                            </div>
                        </div> */}
                        {contractPaymentFields}
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
                                    onChange={(e) => setTotalCompensation({ ...totalCompensation, value: (e.target.value.slice(0, 9)).replace(/,/g, "") })}
                                    value={totalCompensation?.value ? Number(totalCompensation?.value)?.toLocaleString() : null}
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
                        <button className={`${style.buttonStyle} `} onClick={() => getPreImplementationDialogBoolean(false)}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => addPreImplementationData()}>SAVE AS DONE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default PreImplementationDataDialog;
