import React, { useEffect, useState, useRef } from 'react';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import logo from "../../../images/cambridgeHospital.png";
import JourneyStep10 from './../../../images/journeyStep10.png';
import { GET, PUT, POST } from '../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import html2pdf from "html2pdf.js";
import CryptoJS from 'crypto-js';
import style from './index.module.scss';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import ESign from '../../../Components/ESign';
import { format } from 'date-fns';
import { SuccessToaster, ErrorToaster } from '../../../utils/toaster';
import ESignature from '../../../Components/ESignature';
import ReappointmentProgressCard from '../../../Components/ReappointmentProgressCard';
import ReappointmentJourneyDialog from '../../../Components/reappointmentJourneyDialog';
import ApplicationSubmitDialog from '../../../Components/ApplicationSubmitDialog';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import SaveInProgressDialog from '../../../Components/SaveInProgressDialog';
import { dataLoadingGIF } from '../../../utils/formatting';
import LocumProgressCard from '../../../Components/LocumProgressCard';
import { Tooltip } from '@mui/material';

const ScheduleA = ({ acknowledgementForm, dateFormat, name, basicForm, getPreApplication }) => {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate()
    const targetRef = useRef();
    const [isSigned, setIsSigned] = useState(false);
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());
    // const [decryptedText, setDecryptedText] = useState(CryptoJS.AES.decrypt(encryptedText, publicKey).toString(CryptoJS.enc.Utf8));
    const [currentDate, setCurrentDate] = useState(format(new Date(), dateFormat));
    const [isEdited, setIsEdited] = useState(false);
    const [formSchema, setFormSchema] = useState();
    const [formContent, setFormContent] = useState();
    const [signText, setSignText] = useState(name + " " + currentDate);
    const [formIndex, setFormIndex] = useState();
    const { applicationId, section, step } = useParams();
    const [showJourneyDialog, setShowJourneyDialog] = useState(false);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [navigateURL, setNavigateURL] = useState();
    const [navigateBackURL, setNavigateBackURL] = useState();
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        setIsChecked(basicForm?.forms?.[formIndex]?.acknowledged);
        // setEncryptedText(basicForm?.forms?.[formIndex]?.esign?.esign)
        setSignText(basicForm?.forms?.[formIndex]?.acknowledged ? basicForm?.forms?.[formIndex]?.esign?.esign : '');
        setIsSigned((basicForm?.forms?.[formIndex]?.esign?.esign !== undefined && basicForm?.forms?.[formIndex]?.acknowledged) ? true : false);
        // setDecryptedText(CryptoJS.AES.decrypt(basicForm?.forms?.[formIndex]?.esign?.esign, publicKey).toString(CryptoJS.enc.Utf8))
        setNavigateURL(`/locumApplicationForm/${applicationId}/${basicForm?.forms?.[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex + 1]?.schemaCategory)}`);
        setNavigateBackURL(`/locumApplicationForm/${applicationId}/${basicForm?.forms?.[formIndex - 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex - 1]?.schemaCategory)}`);
    }, [basicForm, formIndex])

    useEffect(() => {
        if (sessionStorage.getItem('fromSummary') === true || sessionStorage.getItem('fromSummary') === 'true') {
            setShowJourneyDialog(true);
        }
        sessionStorage.setItem('fromSummary', false);
    }, [])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    }, [basicForm, step])

    useEffect(() => {
        getRenderedContent()
    }, [formSchema])

    const getFormSchema = async () => {
        if (basicForm?.forms?.[formIndex]?.schemaId !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.forms?.[formIndex]?.schemaId}`
            );
            setFormSchema(form)
        }
    }

    const getRenderedContent = async () => {
        if (basicForm?.forms?.[formIndex]?.id !== undefined) {
            const { data: content } = await GET(
                `application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[formIndex]?.id}/render`
            );
            setFormContent(content)
        }
    }

    const getIsShowReappointmentJourneyDialog = (value) => {
        setShowJourneyDialog(value);
    }

    const getIsSaveInProgressOpen = (value) => {
        setIsSaveInProgressOpen(value);
    }

    const addNewDocument = async (file) => {
        console.log(file, file?.name, 'Test')
        let fileName = {
            "fileName": 'scheduleA.pdf'
        };
        const formData = new FormData();

        if (file !== null) {
            const blob = new Blob([file], { type: `application/pdf` });
            formData.append('files', new Blob([JSON.stringify(fileName)], {
                type: "application/json"
            }));
            formData.append('documents', blob, fileName?.fileName);

            let uploadedFile = {};
            try {
                const response = await POST(`application-management-service/application/${applicationId}/files`, formData);
                console.log(response?.data);
                uploadedFile = response?.data?.file;
            } catch (error) {
                console.error(error);
                return null;
            }

            try {
                const response = await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}/addFileToForm`, uploadedFile);
                console.log(response?.data);
                setIsLoading(false)
                return response?.data;
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    }

    const handleDownload = () => {
        const element = targetRef.current;
        const opt = {
            margin: 0.5,
            filename: "page.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: true,
            },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        };
        // const nestedElements = element.querySelectorAll('.applicationCardScrollStyle');
        // nestedElements.forEach((_element) => {
        //     _element.classList.remove('applicationCardScrollStyle');
        // });
        html2pdf().set(opt).from(element).outputPdf("blob").then((pdfBlob) => {
            addNewDocument(pdfBlob);
        });
    };

    const handleIsChecked = (value) => {
        setIsEdited(true)
        setIsChecked(value)
        if (!value) {
            setIsSigned(false)
        }
    }

    const getSkipClicked = (value) => {
        if (value) {
            handleSubmitApplicationReq("skipped")
        }
    }

    const handleBackClick = async () => {
        navigate(navigateBackURL)
    }

    const handleSubmitApplicationReq = async (data) => {
        setIsLoading(true)
        // if (isSigned) {
        let temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: data !== "skipped" ? (!isEdited ? basicForm?.forms?.[formIndex]?.data : { esignDate: isSigned ? `${name} ${currentDate}` : '' }) : {},
            acknowledged: true,
            unFilledFields: data === "skipped" ? ["skipped"] : ["continue"],
            esign: data !== "skipped" ? { esign: isSigned ? encryptedText : '', name: isSigned ? name : '', signedDate: isSigned ? currentDate : '' } : null
        }
        await PUT(`application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                getPreApplication()
                SuccessToaster("Application Updated Successfully");
                handleDownload();
                getFormSchema();
                if (sessionStorage.getItem('fromSummary') === 'true') {
                    navigate(-1);
                }
                else {
                    navigate(navigateURL)
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
        // }
        // else {
        //     setIsLoading(false)
        //     if (sessionStorage.getItem('fromSummary') === 'true') {
        //         navigate(-1);
        //     } else {
        //         navigate(navigateURL)
        //     }
        // }
    }
    return (
        <div>
            {isLoading && (
                <div
                    className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
                >
                    <img src={dataLoadingGIF} alt="" className={style.fileLoadingStyle} />
                </div>
            )}
            <div className={`${style.applicationScreenGrid}`}>
                <div>
                    <LocumProgressCard step={'STEP 1'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={32} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} basicForm={basicForm} />
                    <div className={`${style.applicationCardStyle} ${style.applicationCardScrollStyle} ${style.marginTop}`} ref={targetRef}>
                        <div className={`${style.marginTop} ${style.justifyCenter}`}>
                            <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
                        </div>
                        <CommonDivider />
                        <div className={`${style.cardTitle} ${style.marginTop}  ${style.justifyCenter}`}>{formSchema?.title}</div>
                        <CommonDivider />
                        {formSchema?.content?.title !== null && (
                            <div className={style.cardTitle}>{formSchema?.content?.title}</div>
                        )}
                        <div
                            className={`${style.leftAlign} ${style.marginTop} ${style.descriptionStyle}`}
                            dangerouslySetInnerHTML={{ __html: formContent?.content?.content }}
                        />
                        {formSchema?.disclaimer?.title !== null && (
                            <div className={style.cardTitle}>{formSchema?.disclaimer?.title}</div>
                        )}
                        <div className={`${style.checkGrid} ${style.marginTop}`}>
                            {formContent?.disclaimer?.content !== null && (
                                <CommonCheckBox checked={isChecked} onChange={(e) => handleIsChecked(e.target.checked)} bigCheckbox={true} />
                            )}
                            <div
                                className={`${style.leftAlign} ${style.marginTop10}`}
                                dangerouslySetInnerHTML={{ __html: formContent?.disclaimer?.content }}
                            />
                        </div>
                        {formSchema?.esignatureRequired && (
                            <div className={style.twoCol}>
                                <div onClick={isChecked ? () => { setIsSigned(!isSigned); setIsEdited(true) } : () => { }}
                                    className={!isChecked ? style.disabled : ''}
                                >
                                    <ESignature
                                        userName={isSigned ? name : ""}
                                        encData={isSigned ? encryptedText : ''}
                                        showData={isSigned}
                                        showDatais={true}
                                    />
                                </div>
                                <div className={style.verticalAlignCenter}>
                                    <div className={style.displayInRow}>
                                        <div className={style.dateTitle}>Date: </div>
                                        <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? (basicForm?.forms?.[formIndex]?.esign?.signedDate !== '' && basicForm?.forms?.[formIndex]?.esign?.signedDate !== undefined) ? basicForm?.forms?.[formIndex]?.esign?.signedDate : currentDate : ""}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={style.threeColForButton}>
                        {/* <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => handleSubmitApplicationReq("skipped")}>SKIP FOR NOW</div>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        <div className={`${style.continue} ${style.marginTop}`} onClick={() => handleBackClick()}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop} ${!isSigned ? style.disabledButton : ''}`} onClick={!isSigned ? () => { } : () => { handleSubmitApplicationReq("continue"); }}>CONTINUE</div> */}
                    </div>
                </div>
                <div>
                    <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
                    <div className={style.marginTop}>
                        <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    </div>
                    <div className={`${style.stickyContainer} ${isSaveInProgressOpen ? style.hiddenStickyContainer : ""}`}>
                        <Tooltip title={"Click to Skip This Step and Continue Later"} arrow>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => handleSubmitApplicationReq("skipped")}>SKIP FOR NOW</div>
                        </Tooltip>
                        <Tooltip title={"Click to Save your Progress and Continue later"} arrow>
                        <div className={`${style.saveInProgress} ${style.marginTop10}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        </Tooltip>
                        <div className={style.twoColForButton}>
                            <Tooltip title={"Click to Go Back to the Previous Step"} arrow>
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleBackClick()}>BACK</div>
                            </Tooltip>
                            <Tooltip title={isSigned ? "Click to Proceed to the Next Step" : "Sign to Proceed"} arrow>
                            <div className={`${style.continue} ${style.marginTop10} ${!isSigned ? style.disabledButton : ''}`} onClick={!isSigned ? () => { } : () => { handleSubmitApplicationReq("continue"); }} >CONTINUE</div>
                            </Tooltip>
                        </div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
                {isSaveInProgressOpen && (
                    <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
                )}
            </div>
        </div>
    )
}

export default ScheduleA;