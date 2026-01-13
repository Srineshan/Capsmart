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

const ReferenceQuestionnaire = () => {
    const navigate = useNavigate()
    const { logout } = useDescope();
    const { applicationId, referenceId, formId, step } = useParams();
    const [referenceForm, setReferenceForm] = useState();
    const [formSchema, setFormSchema] = useState();
    const [formIndex, setFormIndex] = useState();
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [deptHead, setDeptHead] = useState('');
    const [isOpen, setIsOpen] = useState(false);
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

    const index = referenceForm?.referenceDetails?.responses?.findIndex(data => data?.schemaId === formId)

    const stepperClass = index >= 0 ? style[`progressStyleBackground${index}`] : '';

    const StepDisplay = () => {
        console.log(atob(step), 'btoastring', step)
        switch (atob(step)) {
            case 'BackgroundInformation':
                return <BackgroundInformation referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} />;
            case 'ClinicalAbilities':
                return <ClinicalAbilities referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} />;
            case 'AdministrativeAndEducationalAbilities':
                return <AdministrativeAndEducationalAbilities referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} />;
            case 'ProfessionalConduct':
                return <ProfessionalConduct referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} />;
            case 'ApplicantsConduct':
                return <ApplicantsConduct referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} />;
            case 'HealthStatus':
                return <HealthStatus referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} />;
            case 'VisionMissionAndValues':
                return <VisionMissionAndValues referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} />;
            case 'SummaryRecommendation':
                return <SummaryRecommendation referenceForm={referenceForm} setReferenceForm={setReferenceForm} applicationId={applicationId} getReferenceDetails={getReferenceDetails} formSchema={formSchema} formIndex={formIndex} formSchemaWholeObject={formSchemaWholeObject} />;
            default:
                return <div>Step not found</div>;
        }
    };

    const handleContinue = async () => {
        await PUT(`application-management-service/application/${applicationId}/reference/${referenceId}/form/${referenceForm?.referenceDetails?.responses?.[formIndex]?.id}/response`, { data: referenceForm?.referenceDetails?.responses?.[formIndex]?.data })
            .then(response => {
                console.log(response)
                getReferenceDetails();
                navigate(`/applications/${applicationId}/references/${referenceId}/${referenceForm?.referenceDetails?.responses?.[formIndex + 1]?.schemaId}/${btoa(referenceForm?.referenceDetails?.responses?.[formIndex + 1]?.referenceSchemaCategory)}`)
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster2('Something went wrong while saving your data. Please try again later.')
            });
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
                (<ReferenceQuestionnaireLanding applicantName={`${referenceForm?.basicDetails?.applicant?.name?.firstName} ${referenceForm?.basicDetails?.applicant?.name?.lastName}`} formId={referenceForm?.referenceDetails?.responses?.[0]?.schemaId} referenceSchemaCategory={referenceForm?.referenceDetails?.responses?.[0]?.referenceSchemaCategory} />) :
                (
                    <div className={style.screenBackground}>
                        <ApplicationHeader title={`Professional Reference Questionnaire For ${referenceForm?.basicDetails?.applicant?.name?.firstName !== undefined ? referenceForm?.basicDetails?.applicant?.name?.firstName : ''} ${referenceForm?.basicDetails?.applicant?.name?.lastName !== undefined ? `${referenceForm?.basicDetails?.applicant?.name?.lastName?.toLowerCase()}` : ''}`} close={true} closeClick={handleLogout} />
                        <div className={style.screenPadding}>
                            <div className={style.applicationScreenGrid}>
                                <div className={style.marginTop}>
                                    <div className={`${style.applicantInfoCard}`}>
                                        <div className={style.applicantInformation}>APPLICANT INFORMATION</div>
                                        <div className={style.applicantName}>{`${referenceForm?.basicDetails?.applicant?.name?.firstName} ${referenceForm?.basicDetails?.applicant?.name?.lastName}`}</div>
                                        <div className={style.description}>{`${referenceForm?.basicDetails?.applicant?.applicantType} Applying for a staff position as ${referenceForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory}`}</div>
                                        <div className={`${style.twoCol} ${style.marginTop10}`}>
                                            <div className={style.applicantInfoGrid}>
                                                <div className={style.descriptionMild}>Department:</div>
                                                <div className={style.descriptionMild}>{referenceForm?.basicDetails?.departmentSpecialty?.department}</div>
                                            </div>
                                            <div className={style.applicantInfoGrid}>
                                                <div className={style.descriptionMild}>Department Head:</div>
                                                <div>
                                                    <div className={style.descriptionMild}>{`${deptHead?.name?.firstName || ''} ${deptHead?.name?.lastName || ''}`}</div>
                                                    <div className={style.descriptionMild}>{`${`${deptHead?.email?.officialEmail || ''} `} ${deptHead?.email?.officialEmail ? `|` : ''} ${`${deptHead?.communication?.countryCode || ''} ${deptHead?.communication?.mobileNumber || ''}`}`}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${style.twoCol} ${style.marginTop10}`}>
                                            <div className={style.applicantInfoGrid}>
                                                <div className={style.descriptionMild}>Speciality:</div>
                                                <div className={style.descriptionMild}>{referenceForm?.basicDetailReferences?.specialty?.name}</div>
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
                    </div >
                )}
        </>
    )
}
export default ReferenceQuestionnaire;