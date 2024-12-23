import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import style from './index.module.scss'
import { POST } from '../../Screens/dataSaver';
import Pencil from "./../../images/pencil.png";
import { ErrorToaster, SuccessToaster } from '../../utils/toaster';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationSubmitDialog from '../../Components/ApplicationSubmitDialog';
import { useDescope } from '@descope/react-sdk';

const LocumJourneyDialog = ({ getIsOpen, title, basicForm, formIndex, img, continueClick }) => {
    const [isContinue, setIsContinue] = useState(false);
    const { applicationId, section, step } = useParams();
    const { logout } = useDescope();
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const entityName = sessionStorage.getItem('title')
    const navigate = useNavigate()
    const [disclosureList, setDisclosureList] = useState(['ProfessionalConduct', 'CriminalHistory', 'MedicalHistory', 'PATIENT_CONCERN_DISCLOSURE', 'PRIVILEGE_STATUS_AT_HOSPITAL'])
    const getIsShowSubmitDialog = (value) => {
        setShowSubmitDialog(value);
    }


    const handleSubmitApplication = async () => {
        await POST(`application-management-service/application/${applicationId}/submit`)
            .then(response => {
                console.log(response)
                setShowSubmitDialog(true)
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
                                        <>
                                            {data?.schemaCategory === 'ProfessionalConduct' && (
                                                <>
                                                    <div className={style.spaceBetween}>
                                                        <div className={`${style.completedItemsText}`}>Disclosures</div>
                                                        <div>{data?.acknowledged ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} /> : <WarningIcon style={{ fontSize: 20, color: `#FFAA00` }} />}</div>
                                                    </div>
                                                </>
                                            )}
                                            <div className={style.spaceBetween}>
                                                <div className={style.displayInRow}>
                                                    <div className={`${style.completedItemsText} ${disclosureList?.includes(data?.schemaCategory) ? style.marginLeft : ''}`}>{data?.title}</div>
                                                    <img src={Pencil} alt="" className={`${style.pencilImgStyle} ${style.justifyCenter} ${style.cursorPointer}`} onClick={() => { sessionStorage.setItem('fromSummary', true); navigate(`/reappointmentApplicationForm/${applicationId}/${data?.formCategory}/${btoa(data?.schemaCategory)}`); getIsOpen(false) }} />
                                                </div>
                                                <div>{data?.acknowledged ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} /> : <WarningIcon style={{ fontSize: 20, color: `#FFAA00` }} />}</div>
                                            </div>
                                            {data?.schemaCategory === 'MISCELLANEOUS_QUESTIONS' && (
                                                <>
                                                    {/* <div className={style.spaceBetween}>
                                                        <div className={`${style.completedItemsText} ${style.marginLeft}`}>LMS</div>
                                                        <div>{data?.acknowledged ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} /> : <WarningIcon style={{ fontSize: 20, color: `#FFAA00` }} />}</div>
                                                    </div> */}
                                                    <div className={style.spaceBetween}>
                                                        <div className={`${style.completedItemsText} ${style.marginLeft}`}>Prescribe Suboxone</div>
                                                        <div>{data?.acknowledged ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} /> : <WarningIcon style={{ fontSize: 20, color: `#FFAA00` }} />}</div>
                                                    </div>
                                                    {/* <div className={style.spaceBetween}>
                                                        <div className={`${style.completedItemsText} ${style.marginLeft}`}>MRP</div>
                                                        <div>{data?.acknowledged ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} /> : <WarningIcon style={{ fontSize: 20, color: `#FFAA00` }} />}</div>
                                                    </div> */}
                                                </>
                                            )}
                                        </>
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
                                            <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { continueClick(); handleSubmitApplication() }}>SUBMIT</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Dialog >

            {showSubmitDialog && (
                <ApplicationSubmitDialog getIsOpen={getIsShowSubmitDialog} title={`Mission Accomplished!You're A Champion`} description={`Please note that the entire application process for full board approval may take up to 3 months to complete. The completed file will be forwarded to the credentials committee and medical advisory committee for review before being forwarded to the board of ${entityName} for final consideration.`} />
            )}
        </>
    )
}

export default LocumJourneyDialog;