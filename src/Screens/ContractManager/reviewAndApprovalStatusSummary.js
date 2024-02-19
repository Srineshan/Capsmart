import React from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import style from './index.module.scss';

const ReviewAndApprovalStatusSummary = ({ showReviewAndApprovalStatusSummaryDialog, getReviewAndApprovalStatusSummaryDialogBoolean, contractId }) => {
    const activationPendingActionsData = [
        { 'data': 'Delete', 'onClick': {}, 'requiredValue': 'boolean' },
        { 'data': 'Re-Assign', 'onClick': {}, 'requiredValue': 'id' },
        { 'data': 'Send Reminder', 'onClick': {}, 'requiredValue': 'boolean' },
    ]
    return (
        <Dialog isOpen={showReviewAndApprovalStatusSummaryDialog} onClose={() => { getReviewAndApprovalStatusSummaryDialogBoolean(false); }} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <>
                    <div className={style.spaceBetween}>
                        <div>
                            <p className={`${style.popUpPreImplementationHeading}`}>Contract Review & Approval Status Summary</p>
                        </div>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => { getReviewAndApprovalStatusSummaryDialogBoolean(false); }} />
                    </div>
                    <div className={style.extensionBorder}></div>
                </>
            </div>
        </Dialog>
    )
}

export default ReviewAndApprovalStatusSummary;