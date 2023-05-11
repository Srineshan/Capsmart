import React, { useEffect, useState } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import style from './index.module.scss';
import { GET, PUT, POST, TenantID } from './../dataSaver';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import InputAdornment from '@mui/material/InputAdornment';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import CommonInputField from '../../Components/CommonFields/CommonInputField';

const PreImplementationDataDialog = ({ showPreImplementationDialog, getPreImplementationDialogBoolean, contractId }) => {
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

    useEffect(() => {
        getPreImplementationValue();
    }, [showPreImplementationDialog]);

    const getPreImplementationValue = async () => {
        const { data: preImplementationData } = await GET(`timesheet-management-service/timesheet/preImplementationData/${contractId}`);
        console.log('preimplementation data', preImplementationData);
    }

    return (
        <Dialog isOpen={showPreImplementationDialog} onClose={() => getPreImplementationDialogBoolean(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <div>
                        <p className={`${style.popUpPreImplementationHeading}`}>Obligated activities Completed & Payments in this contract year prior to <span className={style.purpleText}>{`{go live date: April 1, 2023 }`}</span></p>
                        <p className={`${style.popUpPreImplementationSubHeading}`}>For The Period - July 1, 2022 - March 31, 2023</p>
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
                            <div className={`${style.marginTop20}`}>
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
                            </div>
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
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE AS DONE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default PreImplementationDataDialog;
