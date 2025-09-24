import React, { useEffect, useRef, useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import style from './index.module.scss';
import ApplicationHeader from '../../../../Components/ApplicationHeaders';
import { GET, POST } from '../../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';
import { Tooltip } from '@mui/material';
import ESignature from '../../../../Components/ESignature';
import { format } from 'date-fns';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import CloseIcon from '@mui/icons-material/Close';
import CommonPdfViewer from '../../../../Components/CommonPdfViewer';
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';

const PNPAttestStatus = () => {
    const { entityId, medicalDirectivesId } = useParams();
    const [medicalDirectives, setMedicalDirectives] = useState()
    const [medicalDirectivesSummary, setMedicalDirectivesSummary] = useState()
    const [medicalDirectivesAttestationLog, setMedicalDirectivesAttestationLog] = useState()
    const iframeRef = useRef(null);
    const navigate = useNavigate()
    const [numPages, setNumPages] = useState(0);
    const pdfContainerRef = useRef(null);
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [basicForm, setBasicForm] = useState({})
    // const [decryptedText, setDecryptedText] = useState(CryptoJS.AES.decrypt(encryptedText, publicKey).toString(CryptoJS.enc.Utf8));
    const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
    const [currentDate, setCurrentDate] = useState(format(new Date(), canadaData?.dateFormat || 'dd/MM/yyyy'));
    const [isSigned, setIsSigned] = useState(false);
    const [showGroupSignDialog, setShowGroupSignDialog] = useState(false);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [medicalDirectivesAttestation, setMedicalDirectivesAttestation] = useState(false);
    const [formIndex, setFormIndex] = useState();
    const [userData, setUserData] = useState();
    const [selectedGroup, setSelectedGroup] = useState();
    const [showAll, setShowAll] = useState(false);
    const [mdLog, setMDLog] = useState();
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const users = jwt(userDetails);
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(users?.userName + dateTime, publicKey).toString());

    useEffect(() => {
        getMedicalDirectives()
    }, [medicalDirectivesId])

    useEffect(() => {
        getAttestationLog()
    }, [])

    useEffect(() => {
        getMDLogs()
    }, [medicalDirectives])


    // useEffect(() => {
    //     setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    // }, [basicForm, step])

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
            const { data: medicalDirectivesSummary } = await GET(
                `medical-directive-service/medicalDirectives/${medicalDirectivesId}/attestationSummaryByGroup`
            );
            setMedicalDirectivesSummary(medicalDirectivesSummary);
            console.log(medicalDirectives, 'medicalDirectives', medicalDirectivesSummary)
        }
    }

    const getMDLogs = async () => {
        if (medicalDirectivesId !== undefined) {
            const { data: medicalDirectivesLog } = await GET(
                `medical-directive-service/medicalDirectives/${medicalDirectivesId}/logs?workflowAction=${medicalDirectives?.status === "INACTIVE" ? 'RETIRED' : 'REVISED'}`
            );
            setMDLog(medicalDirectivesLog)
        }
    }

    const getAttestationLog = async () => {
        if (medicalDirectivesId !== undefined) {
            const { data: medicalDirectivesAttestationLog } = await GET(
                `medical-directive-service/attestationLog?medicalDirectiveId=${medicalDirectivesId}&userId=${users?.id}`
            );
            setMedicalDirectivesAttestationLog(medicalDirectivesAttestationLog)
            console.log(medicalDirectivesAttestationLog, 'medicalDirectivesAttestationLog')
            if ((medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.esign !== '' && medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.esign !== undefined)) {
                setMedicalDirectivesAttestation((medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.esign !== '' && medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.esign !== undefined) ? true : false);
                setEncryptedText(medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.esign)
                setCurrentDate(medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.signedDate);
                setIsSigned((medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.esign !== '' && medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.esign !== undefined) ? true : false);
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
            esign: {
                esign: isSigned ? encryptedText : '',
                name: isSigned ? users?.userName : '',
                signedDate: isSigned ? format(new Date(), canadaData?.dateFormat || 'dd/MM/yyyy') : ''
            }
        }
        await POST(`medical-directive-service/medicalDirectives/${medicalDirectivesId}/attest`, temp)
            .then(response => {
                navigate(`/tenant/${entityId}/medicalDirectives`);
                getAttestationLog();
                console.log(response, response?.response?.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleClose = () => {
        if (medicalDirectives?.status !== "INACTIVE") {
            navigate(`/mdManager`);
        } else {
            navigate(`/mdManager/retired`);
        }
    }
    return (
        <div className={style.screenBackground}>
            <div className={style.welcomeText}>
                <ApplicationHeader title={`${medicalDirectives?.title ? `${medicalDirectives?.mdID} : ${medicalDirectives?.title}` : ''}`} close={true} closeClick={handleClose} />
            </div>
            <div className={style.headerData}>
                <span style={{ marginLeft: '20px' }}>Ordering Of Laboratory Investigations - IPAC</span>
                <span className={style.verticalAlignCenter}>
                    <CloseIcon sx={{ fontSize: 30, color: '#FFFFFF', cursor: 'pointer', marginLeft: '270px' }} onClick={handleClose} />
                </span>
            </div>
            <div className={style.screenPadding}>
                {/* <div>
                    <div className={style.breadcrumbStyle}>{`REAPPOINTMENT APPLICATION > MEDICAL DIRECTIVES STATUS >> ${medicalDirectives?.title}`}</div>
                </div> */}
                <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                    <div>
                        {medicalDirectives?.description && (
                            <div className={style.medicalDirectivesCard}>
                                <div className={style.title}>{`${medicalDirectives?.description}`}</div>
                            </div>
                        )}
                        <div className={`${style.medicalDirectivesCard} ${medicalDirectives?.description ? style.marginTop : ''}`}>
                            <CommonPdfViewer pdfurl={medicalDirectives?.file?.fileURL} />

                            {/* <iframe src={`${medicalDirectives?.file?.fileURL}`} className={style.pdfDisplay} ref={iframeRef} /> */}
                        </div>
                    </div>
                    <div>
                        {/* {!isScrolledToBottom && (
                            <div className={style.medicalDirectivesCard}>
                                <div className={style.title}>{`Attestation Due In ${medicalDirectives?.noOfDaysToAttest} Days`} </div>
                            </div>
                        )}
                        <div className={`${style.medicalDirectivesCard} ${style.marginTop10} ${style.stickyContainer}`}>
                            <div className={style.title}><strong>{`Policy & Procedure Attestation`} </strong></div>
                            <div className={`${style.marginTop10} ${style.description}`}>You have to review and attest to this Policy & Procedure that has been assigned to you.</div>
                            {(!isScrolledToBottom) ? (
                                <Tooltip title="Scroll to the end of the document" arrow>
                                    <div>
                                        <div className={` ${style.marginTop10} ${style.leftAlign} ${style.disabled}`}>
                                            <CommonCheckBox checked={medicalDirectivesAttestation} label={'I hereby confirm that by signing, I agree to the delegation and implementation of the Policies & Procedures and Delegated Acts used within the Cambridge Memorial Hospital.'} />
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
                                                    alternateSignature={users?.userName}
                                                />
                                            </div>
                                            <div className={style.verticalAlignCenter}>
                                                <div className={style.displayInRow}>
                                                    <div className={`${style.dateTitle}`}>Date: </div>
                                                    <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? (basicForm?.forms?.[formIndex]?.esign?.signedDate !== '' && basicForm?.forms?.[formIndex]?.esign?.signedDate !== undefined) ? basicForm?.forms?.[formIndex]?.esign?.signedDate : currentDate : ""}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <Tooltip arrow title={"Click to Submit"}>
                                            <div className={`${style.continue} ${style.marginTop} ${style.disabled}`}>SUBMIT</div></Tooltip>
                                    </div>
                                </Tooltip>
                            ) : (
                                <>
                                    <div className={` ${style.marginTop10} ${style.leftAlign} ${isScrolledToBottom ? '' : style.disabled}`}>
                                        <CommonCheckBox checked={medicalDirectivesAttestation} label={'I hereby confirm that by signing, I agree to the delegation and implementation of the Policies & Procedures and Delegated Acts used within the Cambridge Memorial Hospital.'} onChange={(e) => { setMedicalDirectivesAttestation(e.target.checked) }} />
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
                                                alternateSignature={users?.userName}
                                            />
                                        </div>
                                        <div className={style.verticalAlignCenter}>
                                            <div className={style.displayInRow}>
                                                <div className={`${style.dateTitle}`}>Date: </div>
                                                <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? (basicForm?.forms?.[formIndex]?.esign?.signedDate !== '' && basicForm?.forms?.[formIndex]?.esign?.signedDate !== undefined) ? basicForm?.forms?.[formIndex]?.esign?.signedDate : currentDate : ""}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${style.continue} ${style.marginTop10} ${(isScrolledToBottom && isSigned) ? '' : style.disabled}`} onClick={(isScrolledToBottom && isSigned) ? () => { handleSubmitAttest() } : () => { }}>SUBMIT</div>
                                </>
                            )}
                        </div> */}
                        {medicalDirectives?.status !== "INACTIVE" ? (
                            <>
                                <div className={`${style.medicalDirectivesCard}`}>
                                    <div className={style.title}><strong>{`Attestations Status`} </strong></div>
                                    {medicalDirectivesSummary?.groups?.map(data => (
                                        <div className={style.attestationGrid}>
                                            <div className={`${style.marginTop10} ${style.title}`}>{data?.groupName}</div>
                                            <Tooltip title="Click here to see Attestation details">
                                                <div className={`${style.marginTop10} ${style.groupAttestationDescription} ${style.cursorPointer}`} onClick={() => { setSelectedGroup(data); setShowGroupSignDialog(true) }}>{`- ${data?.attestedCount} / ${data?.members?.length}`}</div>
                                            </Tooltip>
                                        </div>
                                    ))}
                                </div>
                                <div className={`${style.medicalDirectivesCard} ${!isScrolledToBottom ? style.marginTop : ''}`}>
                                    <div className={style.spaceBetween}>
                                        <div className={style.title}><strong>{`Update History`} </strong></div>
                                        {mdLog?.length > 3 && (
                                            <div className={`${style.showAll} ${style.cursorPointer}`} onClick={() => setShowAll(!showAll)}>{showAll ? 'Show Less' : 'Show All'}</div>
                                        )}
                                    </div>
                                    <div>
                                        {(showAll ? mdLog : mdLog?.slice(0, 3))?.map(data =>
                                            <div className={`${style.marginTop10} ${style.description}`}>{`${data?.createdDate ? format(new Date(data?.createdDate), 'MMM dd, yyyy') : ''}, ${data?.workflowUser?.name?.firstName}`}</div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={`${style.medicalDirectivesCard}`}>
                                <div className={style.spaceBetween}>
                                    <div className={style.title}><strong>{`Retired on`} </strong></div>
                                    {mdLog?.length > 3 && (
                                        <div className={`${style.showAll} ${style.cursorPointer}`} onClick={() => setShowAll(!showAll)}>{showAll ? 'Show Less' : 'Show All'}</div>
                                    )}
                                </div>
                                <div>
                                    {(showAll ? mdLog : mdLog?.slice(0, 3))?.map(data =>
                                        <>
                                            <div className={`${style.marginTop10} ${style.description}`}>{`${data?.createdDate ? format(new Date(data?.createdDate), 'MMM dd, yyyy') : ''}, ${data?.workflowUser?.name?.firstName}`}</div>
                                            <div className={`${style.marginTop10} ${style.description}`} dangerouslySetInnerHTML={{ __html: data?.notes?.notes || "" }} />
                                            {/* <CommonDivider /> */}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Dialog isOpen={showGroupSignDialog} onClose={() => setShowGroupSignDialog(false)} className={`${style.groupAttestDialogBackground} ${style.groupAttestDialog}`}>
                <div className={style.spaceBetween}>
                    <div className={style.dialogTitle}>{`Atteastations Status For ${selectedGroup?.groupName}`}</div>
                    <span className={style.verticalAlignCenter}>
                        <CloseIcon sx={{ fontSize: 30, color: '#06617A', cursor: 'pointer', marginLeft: '270px' }} onClick={() => setShowGroupSignDialog(false)} />
                    </span>
                </div>
                {/* <div className={`${style.dialogDesc} ${style.marginTop}`}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et</div> */}
                <div className={`${style.dialogTableGrid} ${style.marginTop}`}>
                    <div></div>
                    <div className={style.dialogDesc}><strong>Name</strong></div>
                    <div className={style.dialogDesc}><strong>Title</strong></div>
                    <div className={style.dialogDesc}><strong>Department / Divison</strong></div>
                    <div className={style.dialogDesc}><strong>Due Date</strong></div>
                    <div className={style.dialogDesc}><strong>Status</strong></div>
                    <div className={style.dialogDesc}><strong>Attested on</strong></div>
                </div>
                <CommonDivider />
                {selectedGroup?.members?.map((data, index) => (
                    <div className={`${style.dialogTableGrid} ${style.marginTop} ${style.verticalAlignCenter}`}>
                        <div className={data?.attestationDetail?.status === "COMPLETED" ? style.darkGreenDotStyle : style.redDotStyle}></div>
                        <div>{data?.attestationDetail?.attestationLog?.user?.name?.firstName}</div>
                        <div>{data?.user?.title ? data?.user?.title?.title : '-'}</div>
                        <div>{data?.user?.departments?.map(data => data?.name)?.join(', ')}</div>
                        <div>{data?.attestationDetail?.dueDate ? format(new Date(data?.attestationDetail?.dueDate), 'MMM dd, yyyy') : '-'}</div>
                        <div>{data?.attestationDetail?.status === "COMPLETED" ? 'Attested' : 'Not Attested'}</div>
                        <div>{data?.attestationDetail?.attestationLog?.createdDate ? format(new Date(data?.attestationDetail?.attestationLog?.createdDate), 'MMM dd, yyyy') : '-'}</div>
                    </div>
                ))}
            </Dialog >
        </div>
    )
}

export default PNPAttestStatus;