import React, { useState, useEffect } from 'react';
import ApplicationHeader from '../ApplicationHeader';
import UserLogo from "../../images/defaultUserLogo.jpg";
import { formatFirstNameLastName } from '../../utils/formatting';
import { GET, PUT } from '../../Screens/dataSaver';
import CryptoJS from "crypto-js";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ApplicationFieldCard from '../ApplicationFieldCard';
import CommonDivider from '../CommonFields/CommonDivider';
import CommonRadio from '../CommonFields/CommonRadio';
import CommonTextField from '../CommonFields/CommonTextField';
import ESignature from '../ESignature';
import { format } from 'date-fns';
import { Tooltip } from '@mui/material';
import { ErrorToaster2 } from '../../utils/toaster';
import style from './index.module.scss';


const ReferenceReview = ({ setIsReferenceReview, getActiveApplicationView }) => {
    const [applicationId, setApplicationId] = useState(sessionStorage.getItem("applicationId"));
    const [refId, setRefId] = useState(sessionStorage.getItem('refId'))
    const [reference, setReference] = useState();
    const [allReferenceSchemas, setAllReferenceSchemas] = useState();
    const [form, setForm] = useState();
    const [referenceForm, setReferenceForm] = useState();
    const [notes, setNotes] = useState('');
    const [referenceStatus, setReferenceStatus] = useState('NA');
    const [isSigned, setIsSigned] = useState(false);
    let user = sessionStorage.getItem("user") !== undefined
        ? JSON.parse(sessionStorage.getItem("user"))
        : {};
    const publicKey =
        "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [encryptedText, setEncryptedText] = useState(
        CryptoJS.AES.encrypt(
            `${user?.name?.firstName} ${user?.name?.lastName}` +
            new Date().toISOString(),
            publicKey
        ).toString()
    );
    useEffect(() => {
        if (applicationId)
            getPreApplication();
    }, [applicationId]);

    useEffect(() => {
        if (applicationId && refId) {
            getReferenceDetails();
            getAllReferenceSchemas();
        }
    }, [applicationId, refId])

    useEffect(() => {
        if (reference) {
            setNotes(reference?.reviewDetails?.note?.notes)
            setReferenceStatus(reference?.reviewDetails?.referenceStatus)
            setIsSigned(reference?.reviewDetails ? true : false)
            console.log(reference, 'reference')
        }
    }, [reference])

    const getPreApplication = async () => {
        try {
            const { data: basicForm } = await GET(`application-management-service/application/${applicationId}`);
            setForm(basicForm);
            setReference(basicForm?.references?.reference?.filter(data => data?.rowId === refId)?.length !== 0 ? basicForm?.references?.reference?.filter(data => data?.rowId === refId)?.[0] : basicForm?.privilegeReference?.reference?.filter(data => data?.rowId === refId)?.[0])
            console.log(basicForm?.references?.reference?.filter(data => data?.rowId === refId)?.length !== 0 ? basicForm?.references?.reference?.filter(data => data?.rowId === refId) : basicForm?.privilegeReference?.reference?.filter(data => data?.rowId === refId), 'reference')
        } catch (error) {
            console.error('Error fetching application:', error);
        }
    };

    const getAllReferenceSchemas = async () => {
        const { data: allReferenceSchemas } = await GET(
            `application-management-service/application/${applicationId}/references/${refId}/getSchemas`
        );
        setAllReferenceSchemas(allReferenceSchemas);
    }

    const getReferenceDetails = async () => {
        const { data: referenceData } = await GET(`application-management-service/application/${applicationId}/reference/${refId}`);
        setReferenceForm(referenceData)
    }

    const sendEmail = (email) => {
        if (email) {
            window.location.href = `mailto:${email}`;
        }
    };

    const handleSubmit = async () => {
        let temp = {
            "note": {
                "notes": notes
            },
            "referenceStatus": referenceStatus,
            "reviewedBy": {
                "id": user?.id,
                "name": user?.name,
                "email": user?.email,
                "suffix": user?.suffix,
                "title": user?.title
            },
            "esign": {
                "esign": encryptedText,
                "name": `${user?.name?.firstName} ${user?.name?.lastName}`,
                "signedDate": format(new Date(), 'MMM dd, yyyy')
            }
        }
        await PUT(`application-management-service/application/${applicationId}/reference/${refId}/review`, temp)
            .then(response => {
                setIsReferenceReview(false);
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster2('Something went wrong while saving your data. Please try again later.')
            });
    }


    const onClose = () => {
        setIsReferenceReview(false);
    }

    const renderFieldsBasedOnStep = (data, index) => {
        let formIndex = reference?.responses?.findIndex(formData => formData?.referenceSchemaCategory === data?.referenceSchemaCategory);
        switch (data?.referenceSchemaCategory) {
            case "BackgroundInformation":
                return (
                    <>
                        {allReferenceSchemas?.[index]?.formSchema?.schema !== undefined &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== null &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
                            "backgroundInformation" in allReferenceSchemas?.[index]?.formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={allReferenceSchemas?.[index]?.formSchema?.schema?.properties?.backgroundInformation}
                                    basicForm={referenceForm}
                                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                                    gridStyle={style.gridStyle}
                                    baseKey={"backgroundInformation"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                />
                            )}
                    </>
                );
            case "ClinicalAbilities":
                return (
                    <>
                        <div className={`${style.refRadioCard} ${style.headerGrid}`}>
                            <div className={style.headerText}>NATURE OF CLINICAL PROCEDURES OBSERVED</div>
                            <div className={style.headerText}>OUTSTANDING</div>
                            <div className={style.headerText}>SATISFACTORY</div>
                            <div className={style.headerText}>UNSATISFACTORY</div>
                            <div className={style.headerText}>UNABLE TO ASSESS</div>
                        </div>
                        {allReferenceSchemas?.[index]?.formSchema?.schema !== undefined &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== null &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
                            "natureOfProceduresObserved" in allReferenceSchemas?.[index]?.formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={allReferenceSchemas?.[index]?.formSchema?.schema?.properties?.natureOfProceduresObserved}
                                    basicForm={referenceForm}
                                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                                    gridStyle={style.gridStyle}
                                    refGridStyle={style.clinicalGridStyle}
                                    baseKey={"natureOfProceduresObserved"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                    hideBackground={true}
                                    customRadioStyle={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(4, 1fr)",
                                        gap: 1,
                                        justifyItems: "center",
                                        alignItems: "center"
                                    }}
                                />
                            )}
                        {allReferenceSchemas?.[index]?.formSchema?.schema !== undefined &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== null &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
                            "unsatisfactoryExplanation" in allReferenceSchemas?.[index]?.formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={allReferenceSchemas?.[index]?.formSchema?.schema?.properties?.unsatisfactoryExplanation}
                                    basicForm={referenceForm}
                                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                                    gridStyle={style.gridStyle}
                                    baseKey={"unsatisfactoryExplanation"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                />
                            )}
                    </>
                );
            case "AdministrativeAndEducationalAbilities":
                return (
                    <>
                        <div className={`${style.refRadioCard} ${style.headerGrid}`}>
                            <div className={style.headerText}>ADMINISTRATIVE AND EDUCATIONAL ABILITIES</div>
                            <div className={style.headerText}>OUTSTANDING</div>
                            <div className={style.headerText}>SATISFACTORY</div>
                            <div className={style.headerText}>UNSATISFACTORY</div>
                            <div className={style.headerText}>UNABLE TO ASSESS</div>
                        </div>
                        {allReferenceSchemas?.[index]?.formSchema?.schema !== undefined &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== null &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
                            "administrativeAndEducationalAbilities" in allReferenceSchemas?.[index]?.formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={allReferenceSchemas?.[index]?.formSchema?.schema?.properties?.administrativeAndEducationalAbilities}
                                    basicForm={referenceForm}
                                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                                    gridStyle={style.gridStyle}
                                    refGridStyle={style.clinicalGridStyle}
                                    baseKey={"administrativeAndEducationalAbilities"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                    hideBackground={true}
                                    customRadioStyle={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(4, 1fr)",
                                        gap: 1,
                                        justifyItems: "center",
                                        alignItems: "center"
                                    }}
                                />
                            )}
                        {allReferenceSchemas?.[index]?.formSchema?.schema !== undefined &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== null &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
                            "unsatisfactoryExplanation" in allReferenceSchemas?.[index]?.formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={allReferenceSchemas?.[index]?.formSchema?.schema?.properties?.unsatisfactoryExplanation}
                                    basicForm={referenceForm}
                                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                                    gridStyle={style.gridStyle}
                                    baseKey={"unsatisfactoryExplanation"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                />
                            )}
                    </>
                );
            case "ProfessionalConduct":
                return (
                    <>
                        <div className={`${style.refRadioCard} ${style.headerGrid2}`}>
                            <div className={style.headerText}>TO THE BEST OF YOUR KNOWLEDGE:</div>
                            <div className={style.headerText}>YES</div>
                            <div className={style.headerText}>NO</div>
                            <div className={style.headerText}>NO KNOWLEDGE</div>
                        </div>
                        {allReferenceSchemas?.[index]?.formSchema?.schema !== undefined &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== null &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
                            "bestOfYourKnowledge" in allReferenceSchemas?.[index]?.formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={allReferenceSchemas?.[index]?.formSchema?.schema?.properties?.bestOfYourKnowledge}
                                    basicForm={referenceForm}
                                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                                    gridStyle={style.gridStyle}
                                    refGridStyle={style.yesNoGridStyle}
                                    baseKey={"bestOfYourKnowledge"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                    hideBackground={true}
                                    customRadioStyle={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(4, 1fr)",
                                        gap: 1,
                                        justifyItems: "center",
                                        alignItems: "center"
                                    }}
                                />
                            )}
                        {allReferenceSchemas?.[index]?.formSchema?.schema !== undefined &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== null &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
                            "unsatisfactoryExplanation" in allReferenceSchemas?.[index]?.formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={allReferenceSchemas?.[index]?.formSchema?.schema?.properties?.unsatisfactoryExplanation}
                                    basicForm={referenceForm}
                                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                                    gridStyle={style.gridStyle}
                                    baseKey={"unsatisfactoryExplanation"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                />
                            )}
                    </>
                );
            case "ApplicantsConduct":
                return (
                    <>
                        <div className={`${style.refRadioCard} ${style.headerGrid2}`}>
                            <div className={style.headerText}>TO THE BEST OF YOUR KNOWLEDGE:</div>
                            <div className={style.headerText}>YES</div>
                            <div className={style.headerText}>NO</div>
                            <div className={style.headerText}>NO KNOWLEDGE</div>
                        </div>
                        {allReferenceSchemas?.[index]?.formSchema?.schema !== undefined &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== null &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
                            "bestOfYourKnowledge" in allReferenceSchemas?.[index]?.formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={allReferenceSchemas?.[index]?.formSchema?.schema?.properties?.bestOfYourKnowledge}
                                    basicForm={referenceForm}
                                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                                    gridStyle={style.gridStyle}
                                    refGridStyle={style.yesNoGridStyle}
                                    baseKey={"bestOfYourKnowledge"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                    hideBackground={true}
                                    customRadioStyle={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(4, 1fr)",
                                        gap: 1,
                                        justifyItems: "center",
                                        alignItems: "center"
                                    }}
                                />
                            )}
                        {allReferenceSchemas?.[index]?.formSchema?.schema !== undefined &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== null &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
                            "applicantsConductExplanation" in allReferenceSchemas?.[index]?.formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={allReferenceSchemas?.[index]?.formSchema?.schema?.properties?.applicantsConductExplanation}
                                    basicForm={referenceForm}
                                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                                    gridStyle={style.gridStyle}
                                    baseKey={"applicantsConductExplanation"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                />
                            )}
                    </>
                );
            case "HealthStatus":
                return (
                    <>
                        <div className={`${style.refRadioCard} ${style.headerGrid2}`}>
                            <div className={style.headerText}>TO THE BEST OF YOUR KNOWLEDGE:</div>
                            <div className={style.headerText}>YES</div>
                            <div className={style.headerText}>NO</div>
                            <div className={style.headerText}>NO KNOWLEDGE</div>
                        </div>
                        {allReferenceSchemas?.[index]?.formSchema?.schema !== undefined &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== null &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
                            "bestOfYourKnowledge" in allReferenceSchemas?.[index]?.formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={allReferenceSchemas?.[index]?.formSchema?.schema?.properties?.bestOfYourKnowledge}
                                    basicForm={referenceForm}
                                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                                    gridStyle={style.gridStyle}
                                    refGridStyle={style.yesNoGridStyle}
                                    baseKey={"bestOfYourKnowledge"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                    hideBackground={true}
                                    customRadioStyle={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(4, 1fr)",
                                        gap: 1,
                                        justifyItems: "center",
                                        alignItems: "center"
                                    }}
                                />
                            )}
                        {allReferenceSchemas?.[index]?.formSchema?.schema !== undefined &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== null &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
                            "healthStatusExplanation" in allReferenceSchemas?.[index]?.formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={allReferenceSchemas?.[index]?.formSchema?.schema?.properties?.healthStatusExplanation}
                                    basicForm={referenceForm}
                                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                                    gridStyle={style.gridStyle}
                                    baseKey={"healthStatusExplanation"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                />
                            )}
                    </>
                );
            case "VisionMissionAndValues":
                return (
                    <>
                        {allReferenceSchemas?.[index]?.formSchema?.schema !== undefined &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== null &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
                            "applicantEndorsementDetails" in allReferenceSchemas?.[index]?.formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={allReferenceSchemas?.[index]?.formSchema?.schema?.properties?.applicantEndorsementDetails}
                                    basicForm={referenceForm}
                                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                                    gridStyle={style.gridStyle}
                                    baseKey={"applicantEndorsementDetails"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                />
                            )}
                    </>
                );
            case "SummaryRecommendation":
                return (
                    <>
                        {allReferenceSchemas?.[index]?.formSchema?.schema !== undefined &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== null &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
                            "summaryRecommendation" in allReferenceSchemas?.[index]?.formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={allReferenceSchemas?.[index]?.formSchema?.schema?.properties?.summaryRecommendation}
                                    basicForm={referenceForm}
                                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                                    gridStyle={style.fieldGridStyle}
                                    baseKey={"summaryRecommendation"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                    referenceRadioShowLabel={true}
                                />
                            )}
                        {allReferenceSchemas?.[index]?.formSchema?.schema !== undefined &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== null &&
                            allReferenceSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
                            "referenceInformation" in allReferenceSchemas?.[index]?.formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={allReferenceSchemas?.[index]?.formSchema?.schema?.properties?.referenceInformation}
                                    basicForm={referenceForm}
                                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                                    gridStyle={style.fieldGridStyle2}
                                    baseKey={"referenceInformation"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                    referenceRadioShowLabel={true}
                                />
                            )}
                    </>
                );
            default:
                return <></>;
        }
    };
    return (
        <div style={{
            maxHeight: 'calc(100vh - 10px)',
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "gray transparent",
        }}>
            <ApplicationHeader
                title={`Reference Information & Feedback`}
                close={true}
                closeClick={onClose}
                isNotLogout={true}
            />
            <div className={`${style.marginLeftRight50} ${style.marginTop10}`}>
                <div className={style.referenceGrid}>
                    <div>
                        <div className={style.twoCol}>
                            <div className={`${style.cardLeftStyle}`}>
                                <div className={style.flex}>
                                    <div className={`${style.photoBorderStyle}`}>
                                        <img
                                            src={form?.basicDetails?.applicant?.profilePicture?.fileURL || UserLogo}
                                            alt="Profile Picture"
                                            className={style.profileImage}
                                        />
                                    </div>
                                    <div className={` ${style.textAlignLeft}`}>
                                        <div className={style.marginTop10}>
                                            <span className={`${style.cardTextBoldStyle}`}>
                                                {
                                                    form?.basicDetails?.applicant?.name?.firstName !== undefined &&
                                                        form?.basicDetails?.applicant?.name?.lastName !== undefined
                                                        ? formatFirstNameLastName(
                                                            form?.basicDetails?.applicant?.name?.firstName,
                                                            form?.basicDetails?.applicant?.name?.lastName
                                                        )
                                                        : "{First Name} {Last Name}"
                                                },{" "}
                                            </span>
                                            <span className={`${style.cardTextNormalStyle}`}>
                                                {form?.basicDetailReferences?.applicantType?.serviceProviderType || ""}
                                            </span>
                                        </div>
                                        <div className={`${style.cardTextNormalStyle}`}>
                                            {form?.basicDetailReferences?.department?.name ? `${form.basicDetailReferences.department.name}` : ""}
                                            {form?.basicDetailReferences?.specialty?.name
                                                ? `${form?.basicDetailReferences?.department?.name ? ", " : ""}${form.basicDetailReferences.specialty.name}`
                                                : ""}
                                        </div>

                                        <div className={`${style.displayInRow}`}>
                                            <div className={`${style.emailTextBoldStyle}`}>
                                                {form?.basicDetails?.applicant?.cellPhone ? `+1 ${form?.basicDetails?.applicant?.cellPhone}` : ""}
                                            </div>
                                            <div className={`${style.emailTextBoldStyle} ${style.marginLeft}`}>
                                                <span className={style.cursorPointer} onClick={() => sendEmail(form?.basicDetails?.applicant?.email?.officialEmail || "")}>{form?.basicDetails?.applicant?.email?.officialEmail || ""}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.cardLeftStyle}`}>
                                <div className={`${style.flex} ${style.marginLeft}`}>
                                    <div className={` ${style.textAlignLeft}`}>
                                        <div className={style.marginTop10}>
                                            <span className={`${style.cardTextBoldStyle}`}>
                                                REFERENCE CONTACT
                                            </span>
                                        </div>
                                        <div className={`${style.cardTextNormalStyle}`}>
                                            {reference ? `${reference?.firstName} ${reference?.lastName}` : ""}
                                        </div>

                                        <div className={`${style.displayInRow}`}>
                                            <div className={`${style.emailTextBoldStyle}`}>
                                                {reference?.contactNumber ? `+1 ${reference?.contactNumber}` : ""}
                                            </div>
                                            <div className={`${style.emailTextBoldStyle} ${style.marginLeft}`}>
                                                <span className={style.cursorPointer} onClick={() => sendEmail(reference?.emailAddress || "")}>{reference?.emailAddress || ""}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {reference?.responses?.map((data, index) => (
                            <div
                                className={` ${style.marginTop10} ${style.tableDataStyle}`}
                            >
                                <div
                                    className={` ${style.tableHeaderGridStyleFormReappointmentForStaff} ${style.marginTop10} ${style.backgroundColorStyle} ${style.paddingTopBottom10}`}
                                >
                                    <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                    >
                                        <>
                                            <div
                                                className={`${style.marginLeft10} ${style.greenDotStyle}`}
                                            ></div>
                                        </>
                                    </div>
                                    <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                    >
                                        <div className={`${style.tableDataFontStyleCredReappointment}`}>
                                            {data?.title}
                                        </div>
                                    </div>
                                </div>
                                <div className={`${style.marginTop10} ${style.screenPadding}`}>
                                    {renderFieldsBasedOnStep(data, index)}
                                </div>
                            </div>))}
                    </div>
                    <div>
                        <div className={`${style.cardLeftStyleWithPadding}`}>
                            <div className={`${style.cardTextBoldStyle}`}>
                                <strong>REFERENCE REVIEW</strong>
                            </div>
                            <CommonDivider />
                            <div className={`${style.cardTextBoldStyle} ${style.marginTop10}`}>
                                Notes / Comments
                            </div>
                            <div className={style.marginTop10}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={notes || ""}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        if (!reference?.reviewDetails?.esign?.esign)
                                            setNotes(data);
                                    }}
                                    onReady={(editor) => {
                                        editor.editing.view.change(
                                            (writer) => {
                                                writer.setStyle(
                                                    "height",
                                                    "150px",
                                                    editor.editing.view.document.getRoot()
                                                );
                                            }
                                        );
                                    }}
                                    config={{
                                        placeholder:
                                            "Enter notes here...",
                                        toolbar: {
                                            shouldNotGroupWhenFull: true,
                                            sticky: true,
                                            items: [
                                                'undo', 'redo',
                                                '|',
                                                'heading',
                                                '|',
                                                'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                                                '|',
                                                'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                                                '|',
                                                'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                                            ],
                                        },
                                        autoGrow: false,
                                    }}
                                />
                            </div>
                            <CommonRadio
                                row={false}
                                value={referenceStatus}
                                onChange={(e) => setReferenceStatus(e.target.value)}
                                radioValue={['REFERENCE_PROVIDED_NOT_FAVORABLE', 'REFERENCE_IS_SATISFACTORY', 'REFERENCE_IS_FAVORABLE']}
                                label={['Reference Provided Not Favorable', 'Reference Is Satisfactory', 'Reference Is Favorable']}
                                readOnly={reference?.reviewDetails?.esign?.esign}
                            />
                            <CommonDivider />
                            <div className={style.marginTop10}>
                                <CommonTextField
                                    value={reference?.reviewDetails?.name ? `${reference?.reviewDetails?.name?.firstName} ${reference?.reviewDetails?.name?.lastName}` : `${user?.name?.firstName} ${user?.name?.lastName}`}
                                    className={style.fullWidth}
                                    label={'Name'}
                                />
                                {/* <CommonTextField
                                value={`${user?.name?.firstName} ${user?.name?.lastName}`}
                                className={style.fullWidth}
                                label={'Title'}
                            /> */}
                                <div className={style.marginTop10}>
                                    <div onClick={reference?.reviewDetails?.esign?.esign ? () => { } : () => setIsSigned(!isSigned)}>
                                        <ESignature
                                            userName={reference?.reviewDetails?.name ? `${reference?.reviewDetails?.name?.firstName} ${reference?.reviewDetails?.name?.lastName}` : `${user?.name?.firstName} ${user?.name?.lastName}`}
                                            encData={reference?.reviewDetails?.esign?.esign ? reference?.reviewDetails?.esign?.esign : isSigned ? encryptedText : ''}
                                            showData={(isSigned || reference?.reviewDetails?.esign?.esign) ? true : false}
                                            showDatais={(isSigned || reference?.reviewDetails?.esign?.esign) ? true : false}
                                            alternateSignature={reference?.reviewDetails?.name ? `${reference?.reviewDetails?.name?.firstName} ${reference?.reviewDetails?.name?.lastName}` : `${user?.name?.firstName} ${user?.name?.lastName}`}
                                        />
                                    </div>
                                    <div className={style.verticalAlignCenter}>
                                        <div className={style.displayInRow}>
                                            <div className={style.dateTitle}>Date:</div>
                                            <div className={`${style.date} ${style.marginLeft}`}>
                                                {reference?.reviewDetails?.esign?.signedDate ? reference?.reviewDetails?.esign?.signedDate : isSigned ? format(new Date(), 'MMM dd, yyyy') : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {!reference?.reviewDetails?.esign?.esign && (
                                    <Tooltip title={"Click to submit"} arrow>
                                        <div className={` ${style.continue} ${style.marginTop}`} onClick={() => handleSubmit()}>SUBMIT</div>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReferenceReview;