import React, { useState, useEffect } from 'react'

import style from './index.module.scss'
import ApplicationHeader from '../../../../Components/ApplicationHeader';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import ApplicationReferenceDocuments from '../../../../Components/ApplicationReferenceDocuments';
import CommonMailingAddress from '../../../../Components/CommonFields/CommonMailingAddress';
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WelcomeCard from '../../../../Components/WelcomeCard';
import DaysToComplete from '../../../../Components/DaysToCompleteCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useDescope, useSession } from '@descope/react-sdk';
import LoginDialog from '../../../../Components/LoginDialog';
import RequiredDocumentCard from '../../../../Components/RequiredDocumentCard';
import { GET, PUT } from '../../../dataSaver';
import jwt from 'jwt-decode';
import { ErrorToaster, SuccessToaster } from '../../../../utils/toaster';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import Cookie from "universal-cookie";
import { differenceInDays, format } from 'date-fns';
import { dataLoadingGIF } from '../../../../utils/formatting';
// import { logout } from '../../../utils/auth';
import ReappointmentLandingDialog from '../../../../Components/ReappointmentLandingDialog';
import DoItLaterDialog from '../../../../Components/DoItLaterDialog';
import MenuIcon from "@mui/icons-material/Menu";
import Close from './../../../../images/close.png';
import HapiCare from "./../../../../images/PoweredHapiCare.png";
import { Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ReappointmentApplicationFormRequirement = () => {
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const user = jwt(userDetails);
    const { applicationId } = useParams();
    const { logout } = useDescope();
    const { isAuthenticated, isSessionLoading } = useSession();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [basicForm, setBasicForm] = useState({})
    const [applicantTypeForm, setApplicantTypeForm] = useState()
    const [isDoItLaterOpen, setIsDoItLaterOpen] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // const applicationId = '66d1cae19354e9022ad82027';
    sessionStorage.setItem('applicationId', applicationId)

    console.log(basicForm)

    useEffect(() => {
        // const hasReloaded = sessionStorage.getItem('hasReloaded');

        // if (!hasReloaded) {
        //     sessionStorage.setItem('hasReloaded', 'true');
        //     window.location.reload();
        // }
        if (cookie.get('entityId') !== "63ab2ec1bc9089d77c9232ad" && cookie.get('entityId') !== "undefined" && cookie.get('entityId') !== undefined) {
            handleGetEntityId()
            console.log(cookie.get('entityId'), 'refreshCheck')
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }

        if (sessionStorage.getItem('title') !== "HapiCare" && sessionStorage.getItem('title') !== "undefined" && sessionStorage.getItem('title') !== undefined) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [cookie.get('entityId')]);

    useEffect(() => {
        // getBasicForm();
        getPreApplication()
        sessionStorage.setItem('fromSummary', false);
        console.log('entered')
    }, [])

    useEffect(() => {
        getBasicForm();
    }, [cookie.get('entityId')])

    const getIsOpen = (value) => {
        setIsOpen(value);
    }

    useEffect(() => {
        setUserDetails();
    }, [user?.id])

    const handleGetEntityId = async () => {
        setIsLoading(true);
        const { data: response } = await GET(`entity-service/entity/${cookie.get('entityId')}`)
        sessionStorage.setItem('title', response?.entityName?.entityName)
        setIsLoading(false);
    }

    const setUserDetails = async () => {
        const { data: userDetails } = await GET(`user-management-service/user/${user?.id}`);
        console.log(userDetails)
        sessionStorage.setItem('user', JSON.stringify(userDetails))
    }

    const getPreApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/${applicationId}`
        );
        setBasicForm(basicForm)
    }

    const getBasicForm = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/basicForm`
        );
        if (basicForm) {
            const { data: form1 } = await GET(
                `application-management-service/formSchema/${basicForm?.generalSchemas?.[0]?.id}`
            );
            setApplicantTypeForm(form1?.schema)
        }
    }

    const getIsDoItLaterOpen = (value) => {
        setIsDoItLaterOpen(value);
    }

    const handleSubmitApplicationReq = async (data) => {
        if ((sessionStorage.getItem('taskId') !== undefined && sessionStorage.getItem('taskId') !== 'undefined') && (sessionStorage.getItem('taskStatus') !== undefined && sessionStorage.getItem('taskStatus') !== 'undefined' && sessionStorage.getItem('taskStatus') === "NOT_STARTED")) {
            await PUT(`task-management-service/task/${sessionStorage.getItem('taskId')}/updateStatus?status=ON_GOING`)
        }
        navigate(`/reappointmentApplicationForm/${applicationId}/${basicForm?.forms[0]?.formCategory}/${btoa(basicForm?.forms[0]?.schemaCategory)}`)
    }

    // const calculateRemainingDays = (createdDate, totalDays) => {
    //     const currentDate = new Date();
    //     const startDate = new Date(createdDate);
    //     const timeDiff = currentDate - startDate;
    //     const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    //     const remainingDays = totalDays - daysPassed;
    //     return remainingDays > 0 ? remainingDays : 0;
    // }

    const handleLogout = () => {
        cookie.remove("user", { path: "/" });
        cookie.remove("entityId", { path: "/" });
        cookie.remove("authorization", {
            path: "/",
            domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.split('.')?.slice(-2)?.join('.') : window.location.hostname
        });
        logout()
        navigate('/')
    }

    const uploadFormIndex = basicForm?.forms?.findIndex((f) => f?.schemaCategory === 'UploadYourDoc') ?? -1;
    const uploadTable = (uploadFormIndex >= 0 && basicForm?.forms?.[uploadFormIndex]?.data?.table) ? basicForm.forms[uploadFormIndex].data.table : [];

    const documentsToShow = (basicForm?.documentsRequired || []).filter((data) => {
        const matchingRows = (uploadTable || []).filter(
            (row) => row?.documentType === data?.document?.shortName
        );
        const hasValidVerified = matchingRows.some((row) => row?.verified && row?.valid);
        return !hasValidVerified;
    });

    const documentsValidAndVerified = (uploadTable || []).filter((row) => row?.valid && row?.verified);

    const getIsDocRequired = (data) => {
        if (!data?.departmentSpecific) {
            return data?.document?.shortName === "Profile Picture" ? "Optional" : data?.required ? 'Required' : 'Recommended';
        } else {
            if (data?.document?.shortName === "Profile Picture") {
                return "Optional";
            } else {
                let isDepartmentMatching = data?.departments?.map(deptData => deptData?.department?.id)?.includes(basicForm?.basicDetailReferences?.department?.id)
                if (isDepartmentMatching) {
                    if (data?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialitySpecific) {
                        let isSpecialtyMatching = data?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialities?.map(specialtyData => specialtyData?.specialty?.id)?.includes(basicForm?.basicDetailReferences?.specialty?.id);
                        if (isSpecialtyMatching) {
                            return data?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialities?.filter(specialtyData => specialtyData?.specialty?.id === basicForm?.basicDetailReferences?.specialty?.id)?.[0]?.required ? 'Required' : 'Recommended';
                        } else {
                            return data?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.required ? 'Required' : 'Recommended';
                        }
                    } else {
                        return data?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.required ? 'Required' : 'Recommended';
                    }
                } else {
                    return data?.required ? 'Required' : 'Recommended';
                }
            }
        }
    }

    console.log(basicForm, '75')

    return (
        <div>
            {isLoading && (
                <div
                    className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
                >
                    <img src={dataLoadingGIF} alt="" className={style.fileLoadingStyle} />
                </div>
            )}
            {isOpen ? (
                <ReappointmentLandingDialog getIsOpen={getIsOpen} days={differenceInDays(new Date(basicForm?.expiryDate), new Date(format(new Date(), 'yyyy-MM-dd')))} />
            ) : (
                <>
                    {showInfo && <div className={style.bgdrop} onClick={() => setShowInfo(false)}></div>}
                    <div className={`${style.screenBackground} ${showInfo ? "blurredBackground" : ""}`}>
                        <ApplicationHeader title={`Reappointment Application For ${basicForm?.basicDetails?.applicant?.name?.firstName !== undefined ? basicForm?.basicDetails?.applicant?.name?.firstName : '{First Name}'} ${basicForm?.basicDetails?.applicant?.name?.lastName !== undefined ? basicForm?.basicDetails?.applicant?.name?.lastName?.toLowerCase() : '{Last Name}'}, ${(basicForm?.basicDetails?.applicant?.applicantType !== null) ? basicForm?.basicDetails?.applicant?.applicantType : ''}`} close={true} closeClick={handleLogout} />
                        <div className={style.screenPadding}>
                            <div className={`${style.applicationScreenGrid}`}>
                                <div>
                                    {/* <WelcomeCard title={<strong>Before you get started having the documents listed below will expedite the completion of your reappointment application.</strong>} description={''} /> */}
                                    {documentsToShow?.length > 0 ? (
                                        <div className={`${style.applicationCardStyle}`}>
                                            <div className={style.titleTextStyle}>Your medical staff record indicates that the following documents are required for your reappointment.</div>
                                            <div className={`${style.tableHeader} ${style.tableGrid} ${style.marginTop}`}>
                                                <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Document Type</div>
                                                <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}> </div>
                                                <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}></div>
                                            </div>
                                            {documentsToShow?.map((data, index) => (
                                                <div key={data?.document?.id ?? index}>
                                                    <div className={`${style.requiredDocumentCard} ${style.tableGrid} ${index % 2 === 0 ? style.requiredDocumentCardAlternativeColor : ''}  ${style.marginTop5}`}>
                                                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                                            <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.document?.shortName}</div>
                                                        </div>
                                                        <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{getIsDocRequired(data)}</div>
                                                        <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.instruction}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : basicForm?.documentsRequired?.length > 0 ? (
                                        <div className={`${style.allDocumentsCurrentValidCard}`}>
                                            <div className={style.allDocumentsCurrentValidTitle}>All required documents for your reappointment are current and valid</div>
                                        </div>
                                    ) : null}
                                    {documentsValidAndVerified?.length > 0 && (
                                        <div className={`${style.applicationCardStyle} ${documentsToShow?.length > 0 ? style.marginTop : ''}`}>
                                            <div className={style.titleTextStyle}>Existing current and valid documents on file for your reappointment (2026–2027).</div>
                                            <div className={`${style.tableHeader} ${style.tableGridValid} ${style.marginTop}`}>
                                                <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Document Type</div>
                                                <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Requirement</div>
                                                <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Status</div>
                                                <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Expiration</div>
                                                <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}></div>
                                            </div>
                                            {documentsValidAndVerified.map((row, index) => {
                                                const expirationDate = basicForm?.documents?.documentDetails?.filter(data => data?.rowId === row?.rowId)?.[0]?.expiryDate;
                                                const expiryInPast = expirationDate && new Date(expirationDate) < new Date(format(new Date(), 'yyyy-MM-dd'));
                                                const expirationText = expirationDate ? format(new Date(expirationDate), 'MMM d, yyyy') : '-';
                                                const expirationDisplay = !expirationDate || expiryInPast ? '-' : `Will expire on ${expirationText}`;
                                                return (
                                                    <div key={row?.rowId ?? index}>
                                                        <div className={`${style.requiredDocumentCard} ${style.tableGridValid} ${index % 2 === 0 ? style.requiredDocumentCardAlternativeColor : ''} ${style.marginTop5}`}>
                                                            <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{row?.documentType}</div>
                                                            <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{row?.requirement ?? ''}</div>
                                                            <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>Current & Valid</div>
                                                            <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{expirationDisplay}</div>
                                                            <div className={`${style.verticalAlignCenter} ${style.validCheckIconWrap}`}>
                                                                <CheckCircleIcon className={style.validCheckIcon} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {/* <div className={style.marginTop}>
                            <WelcomeCard title={''} description={''} >
                                {applicantTypeForm !== undefined && 'immunizationHistory' in applicantTypeForm?.properties && (
                                    <ApplicationFieldCard object={applicantTypeForm?.properties?.immunizationHistory} gridStyle={style.twoCol} baseKey={'immunizationHistory'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                                )}
                            </WelcomeCard>
                        </div> */}
                                    {/* <div className={style.marginTop}>
                            <WelcomeCard title={''} description={''} >
                                {applicantTypeForm !== undefined && 'fitTest' in applicantTypeForm?.properties && (
                                    <ApplicationFieldCard object={applicantTypeForm?.properties?.fitTest} gridStyle={style.twoCol} baseKey={'fitTest'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                                )}
                            </WelcomeCard>
                        </div> */}
                                    <div className={style.threeColForButton}>
                                        <Tooltip title={"Click to Save and Do it Later"} arrow>
                                            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => setIsDoItLaterOpen(true)}>DO IT LATER</div></Tooltip>
                                        <Tooltip title={"Click to Begin Now"} arrow>
                                            <div className={`${style.continue} ${style.marginTop}`} onClick={() => handleSubmitApplicationReq()}>GET STARTED NOW</div></Tooltip>
                                    </div>
                                </div>
                                <div>
                                    {/* <ApplicationUserCard user={'Guest User'} applyingFor={'Contact'} /> */}
                                    {!showInfo && (
                                        <div>
                                            <div className={`${style.toggleButton} ${isDoItLaterOpen ? style.hidden : ""}`} onClick={() => setShowInfo(!showInfo)}>
                                                <MenuIcon className={style.toggleIcon} />
                                            </div>
                                            <div className={`${style.headerData} ${isDoItLaterOpen ? style.hidden : ""}`}>
                                                <span style={{ marginLeft: '20px' }}>Confirm Your Application Form Requirement</span>
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <div className={`${style.infoContainer} ${showInfo ? style.show : ""}`}>
                                            <img src={Close} alt="Close" className={style.closeIcon} onClick={() => setShowInfo(false)} />
                                            <div>
                                                <DaysToComplete days={differenceInDays(new Date(basicForm?.expiryDate), new Date(format(new Date(), 'yyyy-MM-dd')))} />
                                            </div>
                                            <div className={style.marginTop10}>
                                                <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${style.stickyContainer} ${isDoItLaterOpen ? style.hiddenStickyContainer : ""}`}>
                                        <Tooltip title={"Click to Open the Interactive Training Guide"} arrow>
                                            <div className={`${style.userGuideButton} ${style.marginTop}`} onClick={() => window.open('https://xd.adobe.com/view/3a6af754-2f94-4f66-a3df-cb9acb5be566-6f39/?fullscreen')}>Interactive Step-by-Step Training Guide</div></Tooltip>
                                        <Tooltip title={"Click to Download the PDF Training Guidee"} arrow>
                                            <div className={`${style.userGuideButton} ${style.marginTop10}`} onClick={() => window.open('https://capm-prod-entity-mgmt-service.s3.ca-central-1.amazonaws.com/Step-by-Step+User+Guide.pdf')}>PDF Step-by-Step Training Guide</div></Tooltip>
                                        <Tooltip title={"Click to Save and Do It Later"} arrow>
                                            <div className={`${style.saveInProgress} ${style.marginTop10}`} onClick={() => setIsDoItLaterOpen(true)}>DO IT LATER</div></Tooltip>
                                        <Tooltip title={"Click to Start the Application Now"} arrow>
                                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleSubmitApplicationReq()}>GET STARTED NOW</div></Tooltip>
                                    </div>
                                </div>
                            </div>
                            <div className={style.marginTop10}>
                                <div className={`${style.footerContainer}`}>
                                    <img
                                        src={HapiCare}
                                        alt="footer"
                                        className={style.footerIconStyle}
                                    />
                                    <p className={style.poweredBy}>
                                        © {new Date().getFullYear()} HapiCare, Inc
                                    </p>
                                </div>

                            </div>
                        </div>
                        {isDoItLaterOpen && (
                            <DoItLaterDialog getIsOpen={getIsDoItLaterOpen} />
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default ReappointmentApplicationFormRequirement;