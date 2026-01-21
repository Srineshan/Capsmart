import React, { useEffect, useState } from 'react';
import Cookie from 'universal-cookie';
import style from './index.module.scss';
import PoweredHapiCare from './../../../images/PoweredHapiCare.png';
import CAPManagerApplication from './../../../images/CAPManagerApplication.png';
import { useNavigate, useParams } from 'react-router-dom';
import ReferenceQuestionnaireLanding from '../../../Components/ReferenceQuestionnaireLanding';
import { GET, PUT } from '../../dataSaver';
import ApplicationHeader from '../../../Components/ApplicationHeader';
import { useDescope } from '@descope/react-sdk';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import BackgroundInformation from './BackgroundInformation';
import AdministrativeAndEducationalAbilities from './AdministrativeAndEducationalAbilities';
import { Tooltip } from '@mui/material';
import ClinicalAbilities from './ClinicalAbilities';
import ProfessionalConduct from './ProfessionalConduct';
import ApplicantsConduct from './ApplicantsConduct';
import HealthStatus from './HealthStatus';
import VisionMissionAndValues from './VisionMissionAndValues';
import SummaryRecommendation from './SummaryRecommendation';
import { ErrorToaster2 } from '../../../utils/toaster';
import ApplicationSubmitDialog from '../../../Components/ApplicationSubmitDialog';
import { format } from 'date-fns';
import ValidationDialog from '../../../Components/validationDialog';
import { getValueByPath } from '../../../utils/formatting';

const ReferenceQuestionnaire = () => {
    const navigate = useNavigate()
    const { logout } = useDescope();
    const { entityId, applicationId, referenceId, formId, step } = useParams();
    const [referenceForm, setReferenceForm] = useState();
    const [formSchema, setFormSchema] = useState();
    const [formIndex, setFormIndex] = useState();
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [deptHead, setDeptHead] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [warningFields, setWarningFields] = useState()
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    useEffect(() => {
        getReferenceDetails()
    }, [])

    useEffect(() => {
        if (referenceForm) {
            console.log(referenceForm, 'referenceForm')
            setFormIndex(referenceForm?.referenceDetails?.responses?.findIndex(data => data?.schemaId === formId));
        }
    }, [referenceForm, step]);

    useEffect(() => {
        if (referenceForm && deptHead === '')
            getDepartmentHead()
    }, [referenceForm])

    useEffect(() => {
        if (formId)
            getFormSchema()
    }, [formId])

    useEffect(() => {
        var cookies = new Cookie();
        cookies.set("entityId", entityId, {
            path: "/",
        });
    }, [])

    const getAllPath = (data) => {
        let temp = metadata;
        if (!temp?.includes(data)) {
            console.log(temp, data, 'Metadata')
            temp.push(data);
        }
        setMetadata(temp);
    }

    const getAllLabels = (data) => {
        setLabels(prev => {
            const exists = prev.some(item => JSON.stringify(item) === JSON.stringify(data));
            return exists ? prev : [...prev, data];
        });
        console.log(labels, 'labels', data)
    };

    const getReferenceDetails = async () => {
        const { data: referenceData } = await GET(`application-management-service/application/${applicationId}/reference/${referenceId}`);
        setReferenceForm(referenceData)
    }

    const getFormSchema = async () => {
        if (formId !== undefined) {
            const { data: formSchema } = await GET(
                `application-management-service/formSchema/${formId}`
            );
            setFormSchema(formSchema?.schema)
            setFormSchemaWholeObject(formSchema)
        }
    }

    const getDepartmentHead = async () => {
        const { data: deptHead } = await GET(
            // `user-management-service/user/role?role=Department Head`
            `user-management-service/user/role?role=Department Head&departmentSpecialties=${referenceForm?.basicDetailReferences?.specialty?.id ? `${referenceForm?.basicDetailReferences?.department?.id}#${referenceForm?.basicDetailReferences?.specialty?.id}` : referenceForm?.basicDetailReferences?.department?.id}`
        );
        setDeptHead(deptHead?.[0])
    }

    const handleLogout = () => {
        var cookies = new Cookie();
        cookies.remove("user", { path: "/" });
        cookies.remove("entityId", { path: "/" });
        cookies.remove("authorization", { path: "/", domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.split('.')?.slice(-2)?.join('.') : window.location.hostname });
        logout()
        navigate('/')
    }

    const getMissingFields = () => {
        let missingKeys = [];
        let keyValuePair = [];
        metadata?.map((data, index) => {
            if (labels[index]?.mandatory)
                keyValuePair.push({ key: data, value: getValueByPath(referenceForm, data), label: labels[index]?.label })
        })

        keyValuePair?.map(data => {
            if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0) {
                missingKeys.push(data)
            }
        })

        const validPaths = missingKeys?.filter(
            (path) => path?.key?.includes(`[${formIndex}]`)
        );

        if (validPaths?.length !== 0) {
            setShowValidationDialog(true)
        } else {
            handleContinue('')
        }
        setWarningFields(validPaths)
        // paths.filter(
        //     (path) => !path.includes('[undefined]')
        //   )
        console.log(keyValuePair, 'Metadata', missingKeys, labels, validPaths, `[${formIndex}]`)
    }

    const index = referenceForm?.referenceDetails?.responses?.findIndex(data => data?.schemaId === formId)

    const stepperClass = index >= 0 ? style[`progressStyleBackground${index}`] : '';

    const StepDisplay = () => {
        console.log(atob(step), 'btoastring', step)
        switch (atob(step)) {
            case 'BackgroundInformation':
                return <BackgroundInformation referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} getAllPath={getAllPath} getAllLabels={getAllLabels} />;
            case 'ClinicalAbilities':
                return <ClinicalAbilities referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} getAllPath={getAllPath} getAllLabels={getAllLabels} />;
            case 'AdministrativeAndEducationalAbilities':
                return <AdministrativeAndEducationalAbilities referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} getAllPath={getAllPath} getAllLabels={getAllLabels} />;
            case 'ProfessionalConduct':
                return <ProfessionalConduct referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} getAllPath={getAllPath} getAllLabels={getAllLabels} />;
            case 'ApplicantsConduct':
                return <ApplicantsConduct referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} getAllPath={getAllPath} getAllLabels={getAllLabels} />;
            case 'HealthStatus':
                return <HealthStatus referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} getAllPath={getAllPath} getAllLabels={getAllLabels} />;
            case 'VisionMissionAndValues':
                return <VisionMissionAndValues referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} getAllPath={getAllPath} getAllLabels={getAllLabels} />;
            case 'SummaryRecommendation':
                return <SummaryRecommendation referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} getAllPath={getAllPath} getAllLabels={getAllLabels} />;
            default:
                return <div>Step not found</div>;
        }
    };

    const handleContinue = async () => {
        await PUT(`application-management-service/application/${applicationId}/reference/${referenceId}/form/${referenceForm?.referenceDetails?.responses?.[formIndex]?.id}/response`, { data: referenceForm?.referenceDetails?.responses?.[formIndex]?.data })
            .then(response => {
                console.log(response)
                setWarningFields([]);
                setMetadata([]);
                setLabels([]);
                getReferenceDetails();
                navigate(`/tenant/${entityId}/applications/${applicationId}/references/${referenceId}/${referenceForm?.referenceDetails?.responses?.[formIndex + 1]?.schemaId}/${btoa(referenceForm?.referenceDetails?.responses?.[formIndex + 1]?.referenceSchemaCategory)}`)
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster2('Something went wrong while saving your data. Please try again later.')
            });
    }

    const getIsValidationDialogOpen = (value) => {
        setShowValidationDialog(value);
    }

    const getSkipClicked = (value) => {
        if (value) {
            setWarningFields([]);
            setMetadata([]);
            setLabels([]);
            handleContinue("skipped")
        }
    }

    const handleBack = async () => {
        setWarningFields([]);
        setMetadata([]);
        setLabels([]);
        navigate(`/tenant/${entityId}/applications/${applicationId}/references/${referenceId}/${referenceForm?.referenceDetails?.responses?.[formIndex - 1]?.schemaId}/${btoa(referenceForm?.referenceDetails?.responses?.[formIndex - 1]?.referenceSchemaCategory)}`)
    }

    const handleSubmit = async () => {
        await PUT(`application-management-service/application/${applicationId}/reference/${referenceId}/form/${referenceForm?.referenceDetails?.responses?.[formIndex]?.id}/response`, { data: referenceForm?.referenceDetails?.responses?.[formIndex]?.data })
            .then(response => {
                console.log(response)
                getReferenceDetails();
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster2('Something went wrong while saving your data. Please try again later.')
            });
        await PUT(`application-management-service/application/${applicationId}/reference/${referenceId}/submitReferenceForm`)
            .then(response => {
                setIsOpen(true);
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster2('Something went wrong while saving your data. Please try again later.')
            });
    }

    const getIsOpen = (value) => {
        setIsOpen(value);
    }

    return (
        <>
            {!formId ?
                (<ReferenceQuestionnaireLanding applicantName={`${referenceForm?.basicDetails?.applicant?.name?.firstName} ${referenceForm?.basicDetails?.applicant?.name?.lastName}`} formId={referenceForm?.referenceDetails?.responses?.[0]?.schemaId} referenceSchemaCategory={referenceForm?.referenceDetails?.responses?.[0]?.referenceSchemaCategory} referenceForm={referenceForm} />) :
                (
                    <div className={style.screenBackground}>
                        <ApplicationHeader title={`Professional Reference Questionnaire For ${referenceForm?.basicDetails?.applicant?.name?.firstName !== undefined ? referenceForm?.basicDetails?.applicant?.name?.firstName : ''} ${referenceForm?.basicDetails?.applicant?.name?.lastName !== undefined ? `${referenceForm?.basicDetails?.applicant?.name?.lastName?.toLowerCase()}` : ''}`} close={true} closeClick={handleLogout} />
                        <div className={style.screenPadding}>
                            <div className={style.applicationScreenGrid}>
                                <div className={style.marginTop}>
                                    <div className={`${style.applicantInfoCard}`}>
                                        <div className={style.applicantInformation}>NEW STAFF APPLICANT</div>
                                        <div className={style.applicantName}>{`${referenceForm?.basicDetails?.applicant?.name?.firstName} ${referenceForm?.basicDetails?.applicant?.name?.lastName}`}</div>
                                        <div className={style.description}>{`${referenceForm?.basicDetails?.applicant?.applicantType} Applying for a staff position`}</div>
                                        <div className={`${style.twoCol} ${style.marginTop10}`}>
                                            <div className={style.applicantInfoGrid}>
                                                <div className={style.descriptionMild}>Department / Speciality:</div>
                                                <div className={style.descriptionMild}>{`${referenceForm?.basicDetails?.departmentSpecialty?.department} ${referenceForm?.basicDetailReferences?.specialty?.name ? '/' : ''} ${referenceForm?.basicDetailReferences?.specialty?.name || ''}`}</div>
                                            </div>
                                            <div className={style.applicantInfoGrid}>
                                                <div className={style.descriptionMild}>Department Head:</div>
                                                <div>
                                                    <div className={style.descriptionMild}>{`${deptHead?.name?.firstName || ''} ${deptHead?.name?.lastName || ''}`}</div>
                                                    <div className={style.descriptionMild}>{`${`${deptHead?.email?.officialEmail || ''} `} ${deptHead?.email?.officialEmail ? `|` : ''} ${`${deptHead?.communication?.countryCode || ''} ${deptHead?.communication?.mobileNumber || ''}`}`}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${style.marginTop} ${style.applicantInfoCard}`}>
                                        <div className={style.displayInRow}>
                                            <div className={style.stepperHeading}>{formSchema?.description}</div>
                                            <div className={`${style.stepperHeading} ${style.marginLeft}`}>{formSchema?.title}</div>
                                        </div>
                                        <div className={`${style.progressStyle} ${stepperClass} ${style.marginTop10}`} ></div>
                                        <div className={style.sectionSplitGrid}>
                                            <div className={style.sectionSplit}></div>
                                            <div className={style.sectionSplit}></div>
                                            <div className={style.sectionSplit}></div>
                                        </div>
                                    </div>
                                    <div className={style.marginTop10}>
                                        {StepDisplay()}
                                    </div>
                                </div>
                                <div className={style.marginTop}>
                                    <ApplicationAssistanceCard
                                        user={"Neena Greenly"}
                                        designation={"{Designation}"}
                                        contactNumber={"{Contact Number}"}
                                        email={"{Email}"}
                                    />
                                    <div className={`${style.stickyContainer}`}>
                                        {/* <Tooltip title={"Click to save your progress and continue later"} arrow>
                                            <div
                                                className={`${style.saveInProgress} ${style.marginTop} `}
                                                onClick={() => { }}
                                            >
                                                SAVE IN PROGRESS
                                            </div>
                                        </Tooltip> */}
                                        {formIndex !== 0 && (
                                            <Tooltip title={"Click to go to the previous step"} arrow>
                                                <div className={` ${style.saveInProgress} ${style.marginTop10}`} onClick={() => handleBack()}>BACK</div>
                                            </Tooltip>
                                        )}
                                        {referenceForm?.referenceDetails?.responses?.length === (formIndex + 1) ? (
                                            <Tooltip title={"Click to submit your application"} arrow>
                                                <div className={` ${style.continue} ${style.marginTop10}`} onClick={() => handleSubmit()}>SUBMIT</div>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title={"Click to proceed to the next step"} arrow>
                                                <div className={` ${style.continue} ${style.marginTop10}`} onClick={() => handleContinue()}>CONTINUE</div>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div >
                        <div className={style.header}>
                            <img src={CAPManagerApplication} alt="Hospital Logo" className={`${style.logo}`} />
                            <div className={style.centerText}>
                                © {format(new Date(), 'yyyy')} HapiCare, Inc. - All Rights Reserved
                            </div>
                            <img src={PoweredHapiCare} alt="Hospital Logo" className={`${style.logo}`} />
                        </div>
                        {isOpen && (
                            <ApplicationSubmitDialog getIsOpen={getIsOpen} title={`Mission Accomplished! You're A Champion`} description={`Thank You for completing this Professional reference check on behalf of ${referenceForm?.basicDetails?.applicant?.name?.firstName !== undefined ? referenceForm?.basicDetails?.applicant?.name?.firstName : ''} ${referenceForm?.basicDetails?.applicant?.name?.lastName !== undefined ? `${referenceForm?.basicDetails?.applicant?.name?.lastName?.toLowerCase()}` : ''}`} />
                        )}
                        {
                            showValidationDialog && (
                                <ValidationDialog getIsOpen={getIsValidationDialogOpen} labelList={warningFields} getSkipClicked={getSkipClicked} />
                            )
                        }
                    </div >
                )}
        </>
    )
}
export default ReferenceQuestionnaire;