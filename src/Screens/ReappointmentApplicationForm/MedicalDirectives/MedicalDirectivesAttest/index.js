import React, { useEffect, useRef, useState } from 'react';

import style from './index.module.scss';
import ApplicationHeader from '../../../../Components/ApplicationHeader';
import { GET } from '../../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import PdfViewer from '../../pdfViewer';
import CryptoJS from 'crypto-js';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';
import { Tooltip } from '@mui/material';
import ESignature from '../../../../Components/ESignature';
import { format } from 'date-fns';

const MedicalDirectivesAttest = () => {
    const { applicationId, section, step, medicalDirectivesId } = useParams();
    const [medicalDirectives, setMedicalDirectives] = useState()
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

    useEffect(() => {
        getMedicalDirectives()
    }, [medicalDirectivesId])

    useEffect(() => {
        getApplication()
    }, [applicationId])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === step))
    }, [basicForm, step])

    useEffect(() => {
        setCurrentDate(format(new Date(), canadaData?.dateFormat || 'dd/MM/yyyy'))
    }, [canadaData?.dateFormat])

    useEffect(() => {
        if (medicalDirectivesAttestation) {
            setIsScrolledToBottom(true)
        }
    }, [medicalDirectivesAttestation])

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
            setMedicalDirectives(medicalDirectives)
            console.log(medicalDirectives, 'medicalDirectives')
        }
    }

    const getApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/${applicationId}`
        );
        setBasicForm(basicForm)
    }

    const handleClose = () => {
        navigate(`/reappointmentApplicationForm/${applicationId}/${section}/${step}`);
    }
    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={`${medicalDirectives?.title}`} close={true} closeClick={handleClose} />
            <div className={style.screenPadding}>
                <div>
                    <div className={style.breadcrumbStyle}>{`REAPPOINTMENT APPLICATION > MEDICAL DIRECTIVES STATUS >> ${medicalDirectives?.title}`}</div>
                </div>
                <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                    <div>
                        <div className={style.medicalDirectivesCard}>
                            <div className={style.title}>{`${medicalDirectives?.title}`} <span className={style.mdIDStyle}>{medicalDirectives?.mdID}</span></div>
                            <div className={`${style.marginTop10} ${style.description}`}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd.</div>
                        </div>
                        <div className={`${style.medicalDirectivesCard} ${style.marginTop}`}>
                            <PdfViewer pdfurl={medicalDirectives?.file?.fileURL} setIsScrolledToBottom={setIsScrolledToBottom} />

                            {/* <iframe src={`${medicalDirectives?.file?.fileURL}`} className={style.pdfDisplay} ref={iframeRef} /> */}
                        </div>
                    </div>
                    <div>
                        <div className={style.medicalDirectivesCard}>
                            <div className={style.title}>{`Attestation Required In {43} Days`} </div>
                            <div className={`${style.marginTop10} ${style.attestationRequiredText}`}>You need to scroll to the end of the document before you can certify the Directive</div>
                        </div>
                        <div className={`${style.medicalDirectivesCard} ${style.marginTop}`}>
                            <div className={style.title}><strong>{`Medical Directive Attestation`} </strong></div>
                            <div className={`${style.marginTop10} ${style.description}`}>You have to review and attest to this Medical Directive that has been assigned to you.</div>
                            {!isScrolledToBottom ? (
                                <Tooltip title="Scroll to the end of the document" arrow>
                                    <div className={` ${style.marginTop} ${style.leftAlign} ${style.disabled}`}>
                                        <CommonCheckBox checked={medicalDirectivesAttestation} label={'I certify that I have read the Medical Directive assigned to me and have a good understanding of them.'} onChange={() => { }} />
                                    </div>
                                    <div className={style.disabled}>
                                        <div onClick={() => { }}
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
                                    <div className={`${style.continue} ${style.marginTop} ${style.disabled}`} onClick={() => { }}>SUBMIT</div>
                                </Tooltip>
                            ) : (
                                <>
                                    <div className={` ${style.marginTop} ${style.leftAlign} ${isScrolledToBottom ? '' : style.disabled}`}>
                                        <CommonCheckBox checked={medicalDirectivesAttestation} label={'I certify that I have read the Medical Directive assigned to me and have a good understanding of them.'} onChange={(e) => { setMedicalDirectivesAttestation(e.target.checked) }} />
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
                                    <div className={`${style.continue} ${style.marginTop} ${isScrolledToBottom ? '' : style.disabled}`} onClick={isScrolledToBottom ? () => { } : () => { }}>SUBMIT</div>
                                </>
                            )}
                        </div>
                        <div className={`${style.medicalDirectivesCard} ${style.marginTop}`}>
                            <div className={style.title}><strong>{`My Attestation Log`} </strong></div>
                            <div className={`${style.marginTop10} ${style.description}`}>October 1, 2024</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MedicalDirectivesAttest;