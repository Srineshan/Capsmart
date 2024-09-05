import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CancelIcon from '@mui/icons-material/Cancel';
import style from './index.module.scss';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';

const CheckListDialog = ({ getCheckListDialog, rejectionListData, rejectedCount }) => {
    let data = [
        { checkStatus: 'CHECKED', content: 'PACS request- Access Agreement Form and signed Confidentiality to Emily Kusz (PACS admin), include physician’s email in the body of the email' },
        { checkStatus: 'CHECKED', content: 'Physician Payment Order and Void Cheque to Carol Hodgson (Clerk) & Valerie Smith Sellars, include physician’s email in the body of the email' },
        { checkStatus: 'CHECKED', content: 'Immunization forms/records to Health Safety Wellness hsw@cmh.org include physician’s email in the body of the email' },
        { checkStatus: 'CHECKED', content: 'Pharmacy Signature Template to Jennifer Visocchi (Pharmacy Manager) with Meditech mnemonic' },
        { checkStatus: 'CHECKED', content: 'Email switchboard (SB) & cc HIM_clerks, HIM_Coding: physicians name, department/speciality, start date, cell # and if they are covering for another physician' },
        { checkStatus: 'UNCHECKED', content: 'Email any contracts with stipends to Valerie Smith sellers' },
        { checkStatus: 'UNCHECKED', content: 'Email welcome letter to physician' },
        { checkStatus: 'UNCHECKED', content: '*For any pathology staff: Send file to Donna Bartlett as they need to be registered with payroll' },
        { checkStatus: 'CHECKBOX', content: 'Locum Directory' },
        { checkStatus: 'CHECKBOX', content: 'OHIP Billing Numbers (Under LOCUM)' },
        { checkStatus: 'CHECKBOX', content: 'Contacts/Med & Professional Staff/Appropriate APG Group.' },
        { checkStatus: 'CHECKBOX', content: 'Credentials Committee Agenda for next month' },
        { checkStatus: 'CHECKBOX', content: 'One-time $50 locum processing fee payable via cheque to CMH' },
        { checkStatus: 'CHECKBOX', content: 'set-up with Human Resources' },
    ]

    return (
        <Dialog isOpen={getCheckListDialog} onClose={() => getCheckListDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle1}>Locum Checklist</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getCheckListDialog(false)} />
                </div>
                {data?.map((data, index) => (
                    <div className={`${style.tableData} ${index % 2 === 0 ? style.alternativeBackgroundColor : ''} ${style.checkListGrid}`}>
                        <div className={style.verticalAlignCenter}>
                            {data?.checkStatus === 'CHECKBOX' ? (
                                <CommonCheckBox />
                            ) : data?.checkStatus === 'CHECKED' ? (
                                <CheckBoxIcon sx={{ color: '#14B15A' }} />
                            ) : (
                                <CancelIcon sx={{ color: '#FF6562' }} />
                            )}
                        </div>
                        <div className={`${style.tableDataFontStyle1} ${style.verticalAlignCenter}`}>{data?.content}</div>
                    </div>
                ))}
                <button className={`${style.buttonStyle} ${style.sendNotificationsButtonWidth} ${style.marginLeft20} ${style.floatRight} ${style.cursorPointer} ${style.marginTop20} ${style.disabled}`}>CONTINUE</button>
            </div>
        </Dialog>
    )
}

export default CheckListDialog;
