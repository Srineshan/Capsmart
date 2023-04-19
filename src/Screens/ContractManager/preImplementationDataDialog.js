import React from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, RadioGroup, Radio } from '@blueprintjs/core';
import style from './index.module.scss';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import InputAdornment from '@mui/material/InputAdornment';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import CommonInputField from '../../Components/CommonFields/CommonInputField';

const PreImplementationDataDialog = ({ showPreImplementationDialog, getPreImplementationDialogBoolean }) => {
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
                                    // checked={metadata?.onCallCoverageFor?.includes('InPatient')} onChange={(e) => handleOnCallCoverageFor('InPatient', e)} 
                                    label="NA" />
                            </div>
                            <div className={`${style.marginTop20}`}>
                                <CommonLabel value='Clinic Block Completed ( Fracture Clinic, orthopedics Clinic )' />
                                <CommonInputField className={style.fullWidth}
                                //  value={rvuQuantity?.quantity} placeholder="0"
                                // type='number'
                                // min="0"
                                // onChange={(e) => e.target.value >= 0 && setRvuQuantity({
                                //     ...rvuQuantity, quantity: e.target.value.slice(0, limit5)
                                // })} 
                                />
                            </div>
                            <div className={`${style.marginTop20}`}>
                                <CommonLabel value='Surgery Blocks Completed' />
                                <CommonInputField className={style.fullWidth}
                                //  value={rvuQuantity?.quantity} placeholder="0"
                                // type='number'
                                // min="0"
                                // onChange={(e) => e.target.value >= 0 && setRvuQuantity({
                                //     ...rvuQuantity, quantity: e.target.value.slice(0, limit5)
                                // })} 
                                />
                            </div>
                            <div className={`${style.marginTop20}`}>
                                <CommonLabel value='Procedure reading / Implant block completed' />
                                <CommonInputField className={style.fullWidth}
                                //  value={rvuQuantity?.quantity} placeholder="0"
                                // type='number'
                                // min="0"
                                // onChange={(e) => e.target.value >= 0 && setRvuQuantity({
                                //     ...rvuQuantity, quantity: e.target.value.slice(0, limit5)
                                // })} 
                                />
                            </div>
                            <div className={`${style.marginTop20}`}>
                                <CommonLabel value='On Call Coverage Duty Days Completed' />
                                <CommonInputField className={style.fullWidth}
                                //  value={rvuQuantity?.quantity} placeholder="0"
                                // type='number'
                                // min="0"
                                // onChange={(e) => e.target.value >= 0 && setRvuQuantity({
                                //     ...rvuQuantity, quantity: e.target.value.slice(0, limit5)
                                // })} 
                                />
                            </div>
                            <div className={`${style.marginTop20}`}>
                                <CommonLabel value='Suppliemetal Service Hours Used' />
                                <CommonInputField className={style.fullWidth}
                                //  value={rvuQuantity?.quantity} placeholder="0"
                                // type='number'
                                // min="0"
                                // onChange={(e) => e.target.value >= 0 && setRvuQuantity({
                                //     ...rvuQuantity, quantity: e.target.value.slice(0, limit5)
                                // })} 
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
                                    // type="number"
                                    min="0"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                    }}
                                // onChange={(e) => fixedCompensationValue(e.target.value.slice(0, limit9).replace(/,/g, ""), 'maxPaymentPerTimesheetSubmission', i)}
                                // value={Number(timesheetPayments?.[i]?.maxPaymentPerTimesheetSubmission)?.toLocaleString()}
                                />
                                <CommonCheckBox className={style.marginLeft20}
                                    // checked={metadata?.onCallCoverageFor?.includes('InPatient')} onChange={(e) => handleOnCallCoverageFor('InPatient', e)} 
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
                                // onChange={(e) => fixedCompensationValue(e.target.value.slice(0, limit9).replace(/,/g, ""), 'maxPaymentPerTimesheetSubmission', i)}
                                // value={Number(timesheetPayments?.[i]?.maxPaymentPerTimesheetSubmission)?.toLocaleString()}
                                />
                                <CommonCheckBox className={style.marginLeft20}
                                    // checked={metadata?.onCallCoverageFor?.includes('InPatient')} onChange={(e) => handleOnCallCoverageFor('InPatient', e)} 
                                    label="NA" />
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
                                // onChange={(e) => fixedCompensationValue(e.target.value.slice(0, limit9).replace(/,/g, ""), 'maxPaymentPerTimesheetSubmission', i)}
                                // value={Number(timesheetPayments?.[i]?.maxPaymentPerTimesheetSubmission)?.toLocaleString()}
                                />
                                <CommonCheckBox className={style.marginLeft20}
                                    // checked={metadata?.onCallCoverageFor?.includes('InPatient')} onChange={(e) => handleOnCallCoverageFor('InPatient', e)} 
                                    label="NA" />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.leftBorder} ${style.preImplementationPadding}`}>
                        <div className={style.popUpPreImplementationTitle}>Absence Days Taken During Elapsed Contract Year</div>
                        <div className={`${style.marginTop20}`}>
                            <CommonLabel value='Days' />
                            <div className={style.displayInRow}>
                                <CommonInputField className={style.fullWidth}
                                //  value={rvuQuantity?.quantity} placeholder="0"
                                // type='number'
                                // min="0"
                                // onChange={(e) => e.target.value >= 0 && setRvuQuantity({
                                //     ...rvuQuantity, quantity: e.target.value.slice(0, limit5)
                                // })} 
                                />
                                <CommonCheckBox className={style.marginLeft20}
                                    // checked={metadata?.onCallCoverageFor?.includes('InPatient')} onChange={(e) => handleOnCallCoverageFor('InPatient', e)} 
                                    label="NA" />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.outlinedButton}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE AS DONE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default PreImplementationDataDialog;
