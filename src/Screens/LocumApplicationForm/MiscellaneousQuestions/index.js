import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { GET, PUT } from '../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import SaveInProgressDialog from '../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../Components/validationDialog';
import JourneyStep6 from './../../../images/journeyStep6.png';
import style from './index.module.scss';
import WelcomeCard from '../../../Components/WelcomeCard';
import ReappointmentProgressCard from '../../../Components/ReappointmentProgressCard';
import { format } from 'date-fns';
import ReappointmentJourneyDialog from '../../../Components/reappointmentJourneyDialog';

const MiscellaneousQuestions = ({ basicForm, setBasicForm, getPreApplication }) => {
    const [formSchema, setFormSchema] = useState();
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [warningFields, setWarningFields] = useState([]);
    const navigate = useNavigate()
    const [isEdited, setIsEdited] = useState(false);
    const [formIndex, setFormIndex] = useState();
    const { applicationId, section, step } = useParams();
    const [navigateURL, setNavigateURL] = useState();
    const [yesOrNoLMS, setYesOrNoLMS] = useState('');
    const [updatedDateLMS, setUpdatedDateLMS] = useState('');
    const [yesOrNoSuboxone, setYesOrNoSuboxone] = useState('');
    const [updatedDateSuboxone, setUpdatedDateSuboxone] = useState('');
    const [yesOrNoMRP, setYesOrNoMRP] = useState('');
    const [updatedDateMRP, setUpdatedDateMRP] = useState('');
    const [showJourneyDialog, setShowJourneyDialog] = useState(false);
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            setYesOrNoLMS(basicForm?.forms?.[formIndex]?.data?.lms?.yesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.lms?.yesOrNo : '');
            setUpdatedDateLMS(basicForm?.forms?.[formIndex]?.data?.lms?.updatedDate !== undefined ? basicForm?.forms?.[formIndex]?.data?.lms?.updatedDate : '');
            setYesOrNoSuboxone(basicForm?.forms?.[formIndex]?.data?.suboxone?.yesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.suboxone?.yesOrNo : '');
            setUpdatedDateSuboxone(basicForm?.forms?.[formIndex]?.data?.suboxone?.updatedDate !== undefined ? basicForm?.forms?.[formIndex]?.data?.suboxone?.updatedDate : '');
            setYesOrNoMRP(basicForm?.forms?.[formIndex]?.data?.mrp?.yesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.mrp?.yesOrNo : '');
            setUpdatedDateMRP(basicForm?.forms?.[formIndex]?.data?.mrp?.updatedDate !== undefined ? basicForm?.forms?.[formIndex]?.data?.mrp?.updatedDate : '');
            setNavigateURL(`/locumApplicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms[formIndex + 1]?.schemaCategory)}`)
        }
    }, [basicForm, formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    }, [basicForm, step])


    const getIsValidationDialogOpen = (value) => {
        setShowValidationDialog(value);
    }

    const getAllPath = (data) => {
        let temp = metadata;
        if (!temp?.includes(data)) {
            console.log(temp, data, 'Metadata')
            temp.push(data);
        }
        setMetadata(temp);
    }

    const getAllLabels = (data) => {
        let tempLabels = labels;
        if (!tempLabels?.includes(data)) {
            console.log(tempLabels, data, 'Metadata')
            tempLabels.push(data);
        }
        setLabels(tempLabels);
    }

    const getIsShowReappointmentJourneyDialog = (value) => {
        setShowJourneyDialog(value);
    }

    const getIsSaveInProgressOpen = (value) => {
        setIsSaveInProgressOpen(value);
    }

    const getFormSchema = async () => {
        if (basicForm?.formSchemas?.[formIndex]?.id !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.formSchemas?.[formIndex]?.id}`
            );
            setFormSchema(form?.schema)
            setFormSchemaWholeObject(form)
        }
    }

    const getSkipClicked = (value) => {
        if (value) {
            // handleSubmitApplicationReq("skipped")
            navigate(navigateURL);
        }
    }

    const getMissingFields = () => {
        let missingKeys = [];
        // if (yesOrNoLMS === '') {
        //     missingKeys.push({ label: 'Have you completed all of the CMH assigned LMS Modules for your reappointment?' })
        // }
        if (yesOrNoSuboxone === '') {
            missingKeys.push({ label: 'Do you prescribe Suboxone?' })
        }
        // if (yesOrNoMRP === '' && (basicForm?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && basicForm?.basicDetails?.departmentSpecialty?.specialty === 'Pediatrics')) {
        //     missingKeys.push({ label: 'Do you wish to be MRP for your patients in the Nursery?' })
        // }
        if (missingKeys?.length !== 0) {
            setShowValidationDialog(true)
        } else {
            handleSubmitApplicationReq()
        }
        setWarningFields(missingKeys)
        console.log('Metadata', missingKeys)
    }

    const handleSubmitApplicationReq = async (data) => {
        // if (isEdited) {
        let temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: {
                lms: { yesOrNo: yesOrNoLMS, updatedDate: updatedDateLMS },
                suboxone: { yesOrNo: yesOrNoSuboxone, updatedDate: updatedDateSuboxone },
                mrp: { yesOrNo: yesOrNoMRP, updatedDate: updatedDateMRP }
            },
            unFilledFields: warningFields?.map(data => data?.label),
            acknowledged: data === "skipped" ? false : true
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                setBasicForm(response?.data)
                SuccessToaster("Application Updated Successfully");
                getPreApplication();
                if (sessionStorage.getItem('fromSummary') === "true") {
                    navigate(-1);
                }
                else {
                    navigate(navigateURL)

                }
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
        // } else {
        //     if (sessionStorage.getItem('fromSummary') === "true") {
        //         navigate(-1);
        //     }
        //     else {
        //         navigate(navigateURL)

        //     }
        // }
    }

    const getValueByPath = (obj, path) => {
        const keys = path.split(/[\.\[\]]+/).filter(Boolean);
        console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
        return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
    };

    const getIsEdited = (value) => {
        setIsEdited(value)
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ReappointmentProgressCard step={'STEP 11'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={22} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} basicForm={basicForm} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    {/* <div className={`${style.applicationCardStyle}`}>
                        <div className={style.cardTitle}>
                            {formSchema?.properties?.isModulesForReAppointmentCompleted?.label}
                        </div>
                        {yesOrNoLMS === '' ? (
                            <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop}`}
                            >
                                <div
                                    className={`${style.reappointmentButtonOutlined}`}
                                    onClick={() => { setYesOrNoLMS('Yes'); setUpdatedDateLMS(format(new Date(), 'yyyy-MM-dd')) }}
                                >
                                    YES
                                </div>
                                <div
                                    className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                                    onClick={() => { setYesOrNoLMS('No'); setUpdatedDateLMS(format(new Date(), 'yyyy-MM-dd')) }}
                                >
                                    NO
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={`${style.markedAsText} ${style.marginTop}`}><strong>Marked as <span className={yesOrNoLMS === 'Yes' ? style.yesText : style.noText}>{yesOrNoLMS}</span></strong> on {format(new Date(updatedDateLMS), "MMM dd, yyyy")}</div>
                                <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop}`}
                                >
                                    <div
                                        className={`${style.reappointmentButtonEdit}`}
                                        onClick={() => setYesOrNoLMS('')}
                                    >
                                        EDIT
                                    </div>
                                </div>
                            </>
                        )}
                    </div> */}
                    <div className={`${style.applicationCardStyle}`}>
                        <div className={style.cardTitle}>
                            {formSchema?.properties?.doYouPrescribeSuboxone?.label}
                        </div>
                        {yesOrNoSuboxone === '' ? (
                            <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop}`}
                            >
                                <div
                                    className={`${style.reappointmentButtonOutlined}`}
                                    onClick={() => { setYesOrNoSuboxone('Yes'); setUpdatedDateSuboxone(format(new Date(), 'yyyy-MM-dd')) }}
                                >
                                    YES
                                </div>
                                <div
                                    className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                                    onClick={() => { setYesOrNoSuboxone('No'); setUpdatedDateSuboxone(format(new Date(), 'yyyy-MM-dd')) }}
                                >
                                    NO
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={`${style.markedAsText} ${style.marginTop}`}><strong>Marked as <span className={yesOrNoSuboxone === 'Yes' ? style.yesText : style.noText}>{yesOrNoSuboxone}</span></strong> on {format(new Date(updatedDateSuboxone), "MMM dd, yyyy")}</div>
                                <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop}`}
                                >
                                    <div
                                        className={`${style.reappointmentButtonEdit}`}
                                        onClick={() => setYesOrNoSuboxone('')}
                                    >
                                        EDIT
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    {/* {(basicForm?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && basicForm?.basicDetails?.departmentSpecialty?.specialty === 'Pediatrics') && (
                        <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
                            <div className={style.cardTitle}>
                                {formSchema?.properties?.wishToBeMRP?.label}
                            </div>
                            {yesOrNoMRP === '' ? (
                                <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop}`}
                                >
                                    <div
                                        className={`${style.reappointmentButtonOutlined}`}
                                        onClick={() => { setYesOrNoMRP('Yes'); setUpdatedDateMRP(format(new Date(), 'yyyy-MM-dd')) }}
                                    >
                                        YES
                                    </div>
                                    <div
                                        className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                                        onClick={() => { setYesOrNoMRP('No'); setUpdatedDateMRP(format(new Date(), 'yyyy-MM-dd')) }}
                                    >
                                        NO
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className={`${style.markedAsText} ${style.marginTop}`}><strong>Marked as <span className={yesOrNoMRP === 'Yes' ? style.yesText : style.noText}>{yesOrNoMRP}</span></strong> on {format(new Date(updatedDateMRP), "MMM dd, yyyy")}</div>
                                    <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop}`}
                                    >
                                        <div
                                            className={`${style.reappointmentButtonEdit}`}
                                            onClick={() => setYesOrNoMRP('')}
                                        >
                                            EDIT
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )} */}
                    <div className={style.threeColForButton}>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getSkipClicked(true)}>SKIP FOR NOW</div>
                        {/* <div className={`${style.continue} ${style.marginTop}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        <div className={`${style.continue} ${style.marginTop} ${((basicForm?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && basicForm?.basicDetails?.departmentSpecialty?.specialty === 'Pediatrics') ? (yesOrNoLMS !== '' && yesOrNoSuboxone !== '' && yesOrNoMRP !== '') : (yesOrNoLMS !== '' && yesOrNoSuboxone !== '')) ? '' : style.disabledButton}`} onClick={((basicForm?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && basicForm?.basicDetails?.departmentSpecialty?.specialty === 'Pediatrics') ? (yesOrNoLMS !== '' && yesOrNoSuboxone !== '' && yesOrNoMRP !== '') : (yesOrNoLMS !== '' && yesOrNoSuboxone !== '')) ? () => getMissingFields() : () => { }}>CONTINUE</div> */}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.stickyContainer} ${isSaveInProgressOpen || showValidationDialog || showJourneyDialog ? style.hiddenStickyContainer : ""}`}>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        <div className={style.twoColForButton}>
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                            {/* <div className={`${style.continue} ${style.marginTop10}`} onClick={() => setShowJourneyDialog(true)}>CONTINUE</div> */}
                            <div className={`${style.continue} ${style.marginTop10} ${(yesOrNoSuboxone !== '') ? '' : style.disabledButton}`} onClick={yesOrNoSuboxone !== '' ? () => getMissingFields() : () => { }}>CONTINUE</div>
                        </div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
            {
                isSaveInProgressOpen && (
                    <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
                )
            }
            {showValidationDialog && (
                <ValidationDialog getIsOpen={getIsValidationDialogOpen} labelList={warningFields} getSkipClicked={getSkipClicked} />
            )}
            {showJourneyDialog && (
                <ReappointmentJourneyDialog getIsOpen={getIsShowReappointmentJourneyDialog} title={`Almost There! Don't Give Up Now`} img={JourneyStep6} formIndex={formIndex} basicForm={basicForm} continueClick={getMissingFields} />
            )}
        </div>
    )
}

export default MiscellaneousQuestions;