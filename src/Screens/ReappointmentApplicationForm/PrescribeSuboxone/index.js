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
import { format } from 'date-fns';
import JourneyStep7 from './../../../images/journeyStep7.png';
import style from './index.module.scss';
import WelcomeCard from '../../../Components/WelcomeCard';
import ReappointmentProgressCard from '../../../Components/ReappointmentProgressCard';
import ReappointmentJourneyDialog from '../../../Components/reappointmentJourneyDialog';

const PrescribeSuboxone = ({ basicForm, setBasicForm, getPreApplication }) => {
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
    const [yesOrNo, setYesOrNo] = useState('');
    const [updatedDate, setUpdatedDate] = useState('');
    const [showJourneyDialog, setShowJourneyDialog] = useState(false);
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            setYesOrNo(basicForm?.forms?.[formIndex]?.data?.yesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.yesOrNo : '');
            setUpdatedDate(basicForm?.forms?.[formIndex]?.data?.updatedDate !== undefined ? basicForm?.forms?.[formIndex]?.data?.updatedDate : '');
            setNavigateURL((basicForm?.forms?.filter(data => data?.formCategory === 'Form')?.length === (formIndex + 1)) ? `/reappointmentApplicationForm/${applicationId}/Form/PODCheck` : `/reappointmentApplicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${basicForm?.forms[formIndex + 1]?.schemaCategory}`)
        }
    }, [basicForm, formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === step))
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

    const getIsSaveInProgressOpen = (value) => {
        setIsSaveInProgressOpen(value);
    }

    const getIsShowReappointmentJourneyDialog = (value) => {
        setShowJourneyDialog(value);
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
            handleSubmitApplicationReq("skipped")
        }
    }

    const getMissingFields = () => {
        // let missingKeys = [];
        // let keyValuePair = [];
        // metadata?.map((data, index) => {
        //     keyValuePair.push({ key: data, value: getValueByPath(basicForm, data), label: labels[index] })
        // })
        // keyValuePair?.map(data => {
        //     if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0) {
        //         missingKeys.push(data)
        //     }
        // })
        // if (missingKeys?.length !== 0) {
        //     setShowValidationDialog(true)
        // } else {
        handleSubmitApplicationReq()
        // }
        // setWarningFields(missingKeys)
        // console.log(keyValuePair, 'Metadata', missingKeys)
    }

    const handleSubmitApplicationReq = async (data) => {
        // if (isEdited) {
        let temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: { yesOrNo: yesOrNo, updatedDate: updatedDate },
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
                <ReappointmentProgressCard step={'STEP 11'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={22} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={`${style.applicationCardStyle}`}>
                        <div className={style.cardTitle}>
                            Do you prescribe Suboxone?
                        </div>
                        {yesOrNo === '' ? (
                            <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop}`}
                            >
                                <div
                                    className={`${style.reappointmentButtonOutlined}`}
                                    onClick={() => { setYesOrNo('Yes'); setUpdatedDate(format(new Date(), 'yyyy-MM-dd')) }}
                                >
                                    Yes
                                </div>
                                <div
                                    className={`${style.reappointmentButton} ${style.marginLeft}`}
                                    onClick={() => { setYesOrNo('No'); setUpdatedDate(format(new Date(), 'yyyy-MM-dd')) }}
                                >
                                    NO
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={`${style.markedAsText} ${style.marginTop}`}><strong>Marked as {yesOrNo}</strong> on {format(new Date(), "MMM dd, yyyy")}</div>
                                <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop}`}
                                >
                                    <div
                                        className={`${style.reappointmentButtonEdit}`}
                                        onClick={() => setYesOrNo('')}
                                    >
                                        Edit
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => setShowJourneyDialog(true)}>CONTINUE</div>
                    </div>
                    {/* <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div> */}
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
                <ReappointmentJourneyDialog getIsOpen={getIsShowReappointmentJourneyDialog} title={`You're So Close! Finish Strong`} img={JourneyStep7} formIndex={formIndex} basicForm={basicForm} continueClick={getMissingFields} />
            )}
        </div>
    )
}

export default PrescribeSuboxone;