import React, { useEffect, useRef, useState } from 'react';

import style from './index.module.scss';
import ApplicationHeader from '../../../../../Components/ApplicationHeaders';
import { GET, POST } from '../../../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import PdfViewer from '../../pdfViewer';
import CryptoJS from 'crypto-js';
import CommonCheckBox from '../../../../../Components/CommonFields/CommonCheckBox';
import { Tooltip } from '@mui/material';
import ESignature from '../../../../../Components/ESignature';
import { format } from 'date-fns';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import CloseIcon from '@mui/icons-material/Close';

const MedicalDirectivesAttest = () => {
    const { applicationId, section, step, medicalDirectivesId } = useParams();
    const [medicalDirectives, setMedicalDirectives] = useState()
    const [medicalDirectivesAttestationLog, setMedicalDirectivesAttestationLog] = useState()
    const iframeRef = useRef(null);
    const navigate = useNavigate()
    const [numPages, setNumPages] = useState(0);
    const pdfContainerRef = useRef(null);
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [basicForm, setBasicForm] = useState({})
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} ` + dateTime, publicKey).toString());
    // const [decryptedText, setDecryptedText] = useState(CryptoJS.AES.decrypt(encryptedText, publicKey).toString(CryptoJS.enc.Utf8));
    const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
    const [currentDate, setCurrentDate] = useState(format(new Date(), canadaData?.dateFormat || 'dd/MM/yyyy'));
    const [isSigned, setIsSigned] = useState(false);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [medicalDirectivesAttestation, setMedicalDirectivesAttestation] = useState(false);
    const [formIndex, setFormIndex] = useState();
    const [userData, setUserData] = useState();
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const title = sessionStorage.getItem('title')
    const users = jwt(userDetails);
    useEffect(() => {
        getMedicalDirectives()
    }, [medicalDirectivesId])

    useEffect(() => {
        getApplication()
    }, [applicationId])

    useEffect(() => {
        getAttestationLog()
    }, [applicationId])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    }, [basicForm, step])

    useEffect(() => {
        setCurrentDate(format(new Date(), canadaData?.dateFormat || 'dd/MM/yyyy'))
    }, [canadaData?.dateFormat])

    useEffect(() => {
        if (medicalDirectivesAttestation) {
            setIsScrolledToBottom(true)
        }
    }, [medicalDirectivesAttestation])

    useEffect(() => {
        setUserDetails();
    }, [users?.id])

    const setUserDetails = async () => {
        const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
        setUserData(userData)
    }

    // useEffect(() => {
    //     const iframe = iframeRef.current;

    //     const setIframeHeight = () => {
    //         if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
    //             const contentHeight = iframe.contentWindow.document.body.scrollHeight;
    //             iframe.style.height = `${contentHeight}px`;
    //         }
    //     };

    //     const onLoad = () => {
    //         if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
    //             setIframeHeight();
    //             iframe.contentWindow.addEventListener('resize', setIframeHeight);
    //         }
    //     };

    //     if (iframe) {
    //         iframe.addEventListener('load', onLoad);
    //     }

    //     // Cleanup function
    //     return () => {
    //         if (iframe) {
    //             iframe.removeEventListener('load', onLoad);
    //             if (iframe.contentWindow) {
    //                 iframe.contentWindow.removeEventListener('resize', setIframeHeight);
    //             }
    //         }
    //     };
    // }, []);

    console.log(isScrolledToBottom, 'scroll')

    const getMedicalDirectives = async () => {
        if (medicalDirectivesId !== undefined) {
            const { data: medicalDirectives } = await GET(
                `medical-directive-service/medicalDirectives/${medicalDirectivesId}`
            );
            setMedicalDirectives(medicalDirectives);
            console.log(medicalDirectives, 'medicalDirectives')
        }
    }

    const getAttestationLog = async () => {
        if (medicalDirectivesId !== undefined && applicationId !== undefined) {
            const { data: medicalDirectivesAttestationLog } = await GET(
                `medical-directive-service/attestationLog?applicationId=${applicationId}&medicalDirectiveId=${medicalDirectivesId}`
            );
            setMedicalDirectivesAttestationLog(medicalDirectivesAttestationLog)
            console.log(medicalDirectivesAttestationLog, 'medicalDirectivesAttestationLog')
            if ((medicalDirectivesAttestationLog?.[0]?.esign?.esign !== '' && medicalDirectivesAttestationLog?.[0]?.esign?.esign !== undefined)) {
                setMedicalDirectivesAttestation((medicalDirectivesAttestationLog?.[0]?.esign?.esign !== '' && medicalDirectivesAttestationLog?.[0]?.esign?.esign !== undefined) ? true : false);
                setEncryptedText(medicalDirectivesAttestationLog?.[0]?.esign?.esign)
                setCurrentDate(medicalDirectivesAttestationLog?.[0]?.esign?.signedDate);
                setIsSigned((medicalDirectivesAttestationLog?.[0]?.esign?.esign !== '' && medicalDirectivesAttestationLog?.[0]?.esign?.esign !== undefined) ? true : false);
            }
        }
    }

    const handleSubmitAttest = async () => {
        let temp = {
            user: {
                id: userData?.id,
                name: userData?.name,
                email: userData?.email
            },
            application: {
                id: applicationId
            },
            esign: {
                esign: isSigned ? encryptedText : '',
                name: isSigned ? `${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} ` : '',
                signedDate: isSigned ? currentDate : ''
            }
        }
        await POST(`medical-directive-service/medicalDirectives/${medicalDirectivesId}/attest`, temp)
            .then(response => {
                navigate(`/locumApplicationForm/${applicationId}/${basicForm?.forms[formIndex]?.formCategory}/${btoa(basicForm?.forms[formIndex]?.schemaCategory)}`)
                getAttestationLog();
                console.log(response, response?.response?.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const getApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/${applicationId}`
        );
        setBasicForm(basicForm)
    }

    const handleClose = () => {
        navigate(`/locumApplicationForm/${applicationId}/${section}/${step}`);
    }
    return (
        <div className={style.screenBackground}>
            <div className={style.welcomeText}>
                <ApplicationHeader title={`${medicalDirectives?.title}`} close={true} closeClick={handleClose} />
            </div>
            <div className={style.headerData}>
                <span style={{ marginLeft: '20px' }}>Ordering Of Laboratory Investigations - IPAC</span>
                <span className={style.verticalAlignCenter}>
                    <CloseIcon sx={{ fontSize: 30, color: '#FFFFFF', cursor: 'pointer', marginLeft: '270px' }} onClick={handleClose} />
                </span>
            </div>
            <div className={style.screenPadding}>
                <div>
                    <div className={style.breadcrumbStyle}>{`REAPPOINTMENT APPLICATION > MEDICAL DIRECTIVES STATUS >> ${medicalDirectives?.title}`}</div>
                </div>
                <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                    <div>
                        <div className={style.medicalDirectivesCard}>
                            <div className={style.title}>{`${medicalDirectives?.title}`} <span className={style.mdIDStyle}>{medicalDirectives?.mdID}</span></div>
                            {/* <div className={`${style.marginTop10} ${style.description}`}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd.</div> */}
                        </div>
                        <div className={`${style.medicalDirectivesCard} ${style.marginTop}`}>
                            <PdfViewer pdfurl={medicalDirectives?.file?.fileURL} setIsScrolledToBottom={setIsScrolledToBottom} />

                            {/* <iframe src={`${medicalDirectives?.file?.fileURL}`} className={style.pdfDisplay} ref={iframeRef} /> */}
                        </div>
                    </div>
                    <div>
                        {!isScrolledToBottom && (
                            <div className={style.medicalDirectivesCard}>
                                <div className={style.title}>{`Attestation Due In ${medicalDirectives?.noOfDaysToAttest} Days`} </div>
                            </div>
                        )}
                        <div className={`${style.medicalDirectivesCard} ${style.marginTop10} ${style.stickyContainer}`}>
                            <div className={style.title}><strong>{`Medical Directive Attestation`} </strong></div>
                            <div className={`${style.marginTop10} ${style.description}`}>You have to review and attest to this Medical Directive that has been assigned to you.</div>
                            {(!isScrolledToBottom) ? (
                                <Tooltip title="Scroll to the end of the document" arrow>
                                    <div>
                                        <div className={` ${style.marginTop10} ${style.leftAlign} ${style.disabled}`}>
                                            <CommonCheckBox checked={medicalDirectivesAttestation} label={`I hereby confirm that by signing, I agree to the delegation and implementation of the Medical Directives and Delegated Acts used within the ${title}.`} />
                                        </div>
                                        <div className={style.disabled}>
                                            <div
                                            >
                                                <ESignature
                                                    userName={isSigned ? `${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} ` : ""}
                                                    encData={isSigned ? encryptedText : ''}
                                                    showData={isSigned}
                                                    showDatais={true}
                                                    removePadding={true}
                                                />
                                            </div>
                                            <div className={style.verticalAlignCenter}>
                                                <div className={style.displayInRow}>
                                                    <div className={`${style.dateTitle}`}>Date: </div>
                                                    <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? (basicForm?.forms?.[formIndex]?.esign?.signedDate !== '' && basicForm?.forms?.[formIndex]?.esign?.signedDate !== undefined) ? basicForm?.forms?.[formIndex]?.esign?.signedDate : currentDate : ""}</div>
                                                </div>
                                            </div>
                                        </div>
                                        {(!isScrolledToBottom) && (
                                            <div className={`${style.marginTop10} ${style.attestationRequiredText}`}>You need to scroll to the end of the document before you can certify the Directive</div>
                                        )}
                                        <div className={`${style.continue} ${style.marginTop} ${style.disabled}`}>SUBMIT</div>
                                    </div>
                                </Tooltip>
                            ) : (
                                <>
                                    <div className={` ${style.marginTop10} ${style.leftAlign} ${isScrolledToBottom ? '' : style.disabled}`}>
                                        <CommonCheckBox checked={medicalDirectivesAttestation} label={`I hereby confirm that by signing, I agree to the delegation and implementation of the Medical Directives and Delegated Acts used within the ${title}.`} onChange={(e) => { setMedicalDirectivesAttestation(e.target.checked) }} />
                                    </div>
                                    <div>
                                        <div onClick={medicalDirectivesAttestation ? () => { setIsSigned(!isSigned); } : () => { }}
                                        >
                                            <ESignature
                                                userName={isSigned ? `${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} ` : ""}
                                                encData={isSigned ? encryptedText : ''}
                                                showData={isSigned}
                                                showDatais={true}
                                                removePadding={true}
                                            />
                                        </div>
                                        <div className={style.verticalAlignCenter}>
                                            <div className={style.displayInRow}>
                                                <div className={`${style.dateTitle}`}>Date: </div>
                                                <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? (basicForm?.forms?.[formIndex]?.esign?.signedDate !== '' && basicForm?.forms?.[formIndex]?.esign?.signedDate !== undefined) ? basicForm?.forms?.[formIndex]?.esign?.signedDate : currentDate : ""}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {(!isScrolledToBottom) && (
                                        <div className={`${style.marginTop10} ${style.attestationRequiredText}`}>You need to scroll to the end of the document before you can certify the Directive</div>
                                    )}
                                    <Tooltip arrow title={"Click to Submit"}>
                                        <div className={`${style.continue} ${style.marginTop} ${(isScrolledToBottom && isSigned) ? '' : style.disabled}`} onClick={(isScrolledToBottom && isSigned) ? () => { handleSubmitAttest() } : () => { }}>SUBMIT</div>
                                    </Tooltip>
                                </>
                            )}
                        </div>
                        <div className={`${style.medicalDirectivesCard} ${!isScrolledToBottom ? style.marginTop : ''}`}>
                            <div className={style.title}><strong>{`My Attestation Log`} </strong></div>
                            {medicalDirectivesAttestationLog?.map(data => (
                                <div className={`${style.marginTop10} ${style.description}`}>{format(new Date(data?.createdDate), 'MMM dd, yyyy HH:mm')}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MedicalDirectivesAttest;