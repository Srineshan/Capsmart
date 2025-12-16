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
import DoItLaterDialog from '../../../../Components/DoItLaterDialog';
import { Tooltip } from '@material-ui/core';
// import { Logout } from '../../../utils/auth';

const ApplicationFormRequirement = () => {
    let cookie = new Cookie();
    const { logout } = useDescope();
    let userDetails = cookie.get('user');
    const user = jwt(userDetails);
    const { applicationId } = useParams();
    const { isAuthenticated, isSessionLoading } = useSession();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [basicForm, setBasicForm] = useState({})
    const [applicantTypeForm, setApplicantTypeForm] = useState()
    const [isDoItLaterOpen, setIsDoItLaterOpen] = useState(false);
    // const applicationId = '66d1cae19354e9022ad82027';
    sessionStorage.setItem('applicationId', applicationId)

    console.log(basicForm)

    useEffect(() => {
        // getBasicForm();
        getPreApplication()
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

    // const Logout = async () => {
    //     logout()
    //         .then(() => {
    //             console.log("User logged out successfully");
    //             window.location.href = "/login"; // Redirect to login or home page
    //         })
    //         .catch((error) => {
    //             console.error("Failed to logout:", error);
    //         });
    // };

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

    const getIsDoItLaterOpen = (value) => {
        setIsDoItLaterOpen(value);
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

    const handleSubmitApplicationReq = async (data) => {
        await PUT(`application-management-service/application/${applicationId}`, basicForm)
            .then(response => {
                console.log(response)
                navigate(`/applicationForm/${applicationId}/Form/${btoa('BasicInformation')}`)
                SuccessToaster("Application Updated Successfully");
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
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
        var cookies = new Cookie();
        cookies.remove("user", { path: "/" });
        cookies.remove("entityId", { path: "/" });
        cookies.remove("authorization", { path: "/" });
        logout()
        navigate('/')
    }

    console.log(basicForm, '75')

    return (
        isOpen ? (
            <LoginDialog getIsOpen={getIsOpen} days={differenceInDays(new Date(basicForm?.expiryDate), new Date(format(new Date(), 'yyyy-MM-dd')))} />
        ) : (
            <>
                <div className={style.screenBackground}>
                    <ApplicationHeader title={`New Medical Professional Staff Application For ${basicForm?.basicDetails?.applicant?.name?.firstName !== undefined ? basicForm?.basicDetails?.applicant?.name?.firstName : ''} ${basicForm?.basicDetails?.applicant?.name?.lastName !== undefined ? basicForm?.basicDetails?.applicant?.name?.lastName : ''}, ${(basicForm?.basicDetails?.applicant?.applicantType !== null) ? basicForm?.basicDetails?.applicant?.applicantType : ''}`} close={true} closeClick={handleLogout} />
                    <div className={style.screenPadding}>
                        <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                            <div>
                                <WelcomeCard title={''} description={''} >
                                    {applicantTypeForm !== undefined && 'applicant' in applicantTypeForm?.properties && (
                                        <ApplicationFieldCard object={applicantTypeForm?.properties?.applicant} gridStyle={style.twoCol} baseKey={'applicant'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                                    )}
                                </WelcomeCard>
                                <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
                                    <div className={style.titleTextStyle}>Recommended & Required List of Documents to have Readily Available for this Application</div>
                                    {/* <div className={style.marginTop}>
                                <RequiredDocumentCard array={basicForm?.documentsRequired?.map(data => ({ title: data?.document?.name }))} />
                            </div> */}
                                    <div className={`${style.tableHeader} ${style.tableGrid} ${style.marginTop}`}>
                                        <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Document Type</div>
                                        <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Requirements</div>
                                        <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}></div>
                                    </div>
                                    {basicForm?.documentsRequired?.map((data, index) => (
                                        <div>
                                            <div className={`${style.requiredDocumentCard} ${style.tableGrid} ${index % 2 === 0 ? style.requiredDocumentCardAlternativeColor : ''}  ${style.marginTop5}`}>
                                                <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.document?.shortName}</div>
                                                    {data?.instruction ? (
                                                        <Tooltip title={data?.instruction} arrow>
                                                            <InfoOutlinedIcon sx={{ fontSize: 14, marginLeft: '10px' }} className={style.info} />
                                                        </Tooltip>
                                                    ) : (
                                                        <div></div>
                                                    )}
                                                </div>
                                                <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.required ? 'Required' : 'Recommended'}</div>
                                                <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.instruction}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                            </div>
                            <div>
                                {/* <ApplicationUserCard user={'Guest User'} applyingFor={'Contact'} /> */}
                                <div>
                                    <DaysToComplete days={differenceInDays(new Date(basicForm?.expiryDate), new Date(format(new Date(), 'yyyy-MM-dd')))} />
                                </div>
                                <div className={style.marginTop10}>
                                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                                </div>
                                <div className={style.stickyContainer}>
                                    <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => setIsDoItLaterOpen(true)}>NOT READY TO START</div>
                                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleSubmitApplicationReq()}>READY TO START MY APPLICATION</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isDoItLaterOpen && (
                        <DoItLaterDialog getIsOpen={getIsDoItLaterOpen} />
                    )}
                </div>
            </>
        )
    )
}

export default ApplicationFormRequirement;