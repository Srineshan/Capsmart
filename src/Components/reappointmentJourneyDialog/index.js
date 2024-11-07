import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import style from './index.module.scss'
import { logout } from '../../utils/auth';
import { POST } from '../../Screens/dataSaver';
import { ErrorToaster, SuccessToaster } from '../../utils/toaster';
import { useParams } from 'react-router-dom';
import ApplicationSubmitDialog from '../../Components/ApplicationSubmitDialog';

const ReappointmentJourneyDialog = ({ getIsOpen, title, basicForm, formIndex, img, continueClick }) => {
    const [isContinue, setIsContinue] = useState(false);
    const { applicationId, section, step } = useParams();
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);


    const getIsShowSubmitDialog = (value) => {
        setShowSubmitDialog(value);
    }


    const handleSubmitApplication = async () => {
        await POST(`application-management-service/application/${applicationId}/submit`)
            .then(response => {
                console.log(response)
                // SuccessToaster("Application Submitted Successfully");
            })
            .catch((error) => {
                console.log(error)
                // ErrorToaster("Unexpected Error Submitting Application");
            });
    }
    return (
        <>
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.heading}>{title}</div>
                    <div className={`${style.twoCol} ${style.marginTop}`}>
                        <div className={style.verticalAlignCenter}>
                            <img src={img} alt="step" className={style.journeyImg} />
                        </div>
                        <div className={style.verticalSpaceBetween}>
                            <div>
                                {basicForm?.forms?.map((data, index) => (formIndex >= index) && (
                                    <div className={style.spaceBetween}>
                                        <div className={style.completedItemsText}>{data?.title}</div>
                                        <div><CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} /></div>
                                    </div>
                                ))}
                            </div>
                            <div className={style.marginTop}>
                                {(formIndex < basicForm?.forms?.length - 1) ? (
                                    <>
                                        <div className={style.completedItemsText}>NEXT</div>
                                        <div className={style.nextItemText}>{basicForm?.forms[formIndex + 1]?.title}</div>
                                        <div className={` ${style.displayInRow} ${style.marginTop}`}>
                                            <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>SAVE IN PROGRESS</div>
                                            <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); continueClick() }}>CONTINUE</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className={` ${style.displayInRow} ${style.marginTop}`}>
                                        <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); logout() }}>LOGOUT</div>
                                        {/* <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { continueClick(); handleSubmitApplication() }}>SUBMIT</div> */}
                                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => setShowSubmitDialog(true)}>SUBMIT</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Dialog >

        {showSubmitDialog && (
                    <ApplicationSubmitDialog getIsOpen={getIsShowSubmitDialog} title={`Reappointment Application Submitted`} description={`Please note that the entire application process for full board approval may take up to 3 months to complete. The completed file will be forwarded to the credentials committee and medical advisory committee for review before being forwarded to the board of Cambridge Memorial Hospital for final consideration.`} />
                )}
        </>
    )
}

export default ReappointmentJourneyDialog;