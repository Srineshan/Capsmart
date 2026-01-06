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
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ESignature from '../ESignature';
import { format } from 'date-fns';
import { Tooltip } from '@mui/material';
import { ErrorToaster2 } from '../../utils/toaster';
import style from './index.module.scss';
import TableTwo from '../TableDesignTwo';


const ImmunizationReview = ({ setIsReferenceReview, getActiveApplicationView }) => {
    const [applicationId, setApplicationId] = useState(sessionStorage.getItem("applicationId"));
    const [refId, setRefId] = useState(sessionStorage.getItem('refId'))
    const [reference, setReference] = useState();
    const [immunization, setImmunization] = useState();
    const [allReferenceSchemas, setAllReferenceSchemas] = useState();
    const [form, setForm] = useState();
    const [formSchema, setFormSchema] = useState();
    const [referenceForm, setReferenceForm] = useState();
    const [notes, setNotes] = useState('');
    const [immunizationStatus, setImmunizationStatus] = useState('');
    const [isSigned, setIsSigned] = useState(false);
    const [deptHead, setDeptHead] = useState('');
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


    const immunizationCategoryValues = {
        "Tuberculosis": 'TUBERCULIN', "Measles, Mumps & Rubella (MMR)": 'MEASLES_MUMPS_RUBELLA', "Hepatitis B Vaccination": 'HEPATITIS_B', "Varicella": 'VARICELLA', "Tetnues/Diptheriea/Pertussis(Tdap) and Tetatnus/Diphtheria(Td)": 'TETANUS_DIPHTHERIA_PERTUSSIS_OR_TETANUS_DIPHTHERIA', "Influenza": 'INFLUENZA', "Covid": 'COVID'
    }

    const immunizationValues = {
        "2 Step Test ": 'TWO_STEP_TEST', "1 Step Test": 'ONE_STEP_TEST', "Chest X Ray": 'CHEST_X_RAY', 'MMR 1': 'MMR1', 'MMR 2': 'MMR2', "Laboratory Evidence Of Immunity": 'LABORATORY_EVIDENCE_OF_IMMUNITY', "HEP B 3": 'HEP_B_3', "HEP B 2": 'HEP_B_2', "HEP B 1": 'HEP_B_1', "Varicella 1": 'VARICELLA_1', "Varicella 2": 'VARICELLA_2', "Laboratory Confirmation Of Disease": 'LABORATORY_CONFIRMATION_OF_DISEASE', "Influenza Vaccine": 'INFLUENZA_VACCINE', "Covid Vaccine": 'COVID_VACCINE', "Booster": 'BOOSTER', "TD Immunization": 'TD_IMMUNIZATION', "TDAP Immunization": 'TDAP_IMMUNIZATION', "HEP B Booster": 'HEP_B_BOOSTER', "Pertusis Asult Dose": 'PERTUSIS_ADULT_DOSE'
    }

    const resultValues = {
        "Positive": 'POSITIVE', "Negative": 'NEGATIVE'
    }

    const immunizationCategoryLabels = Object.fromEntries(
        Object.entries(immunizationCategoryValues).map(([label, value]) => [value, label])
    );

    const immunizationLabels = Object.fromEntries(
        Object.entries(immunizationValues).map(([label, value]) => [value, label])
    );

    const resultLabels = Object.fromEntries(
        Object.entries(resultValues).map(([label, value]) => [value, label])
    );

    const immunizationKeys = [
        "2 Step Test ",
        "1 Step Test",
        "Chest X Ray",
        "MMR 1",
        "MMR 2",
        "Laboratory Evidence Of Immunity",
        "HEP B 3",
        "HEP B 2",
        "HEP B 1",
        "Varicella 1",
        "Varicella 2",
        "Laboratory Confirmation Of Disease",
        "Influenza Vaccine",
        "Covid Vaccine",
        "Booster",
        "TD Immunization",
        "TDAP Immunization",
        "HEP B Booster",
        "Pertusis Asult Dose"
    ];

    const tableHeader = ['Test / Immunization', 'Result', 'Last Test Date', 'Valid', '']

    useEffect(() => {
        if (applicationId) {
            getPreApplication();
            getApplicationImmunization();
        }
    }, [applicationId]);

    useEffect(() => {
        if (form) {
            getFormSchema()
            getDepartmentHead()
        }
    }, [form])

    useEffect(() => {
        if (immunization) {
            setNotes(immunization?.approvalDetails?.notes?.notes)
            setImmunizationStatus(immunization?.approvalDetails?.workflowAction)
            setIsSigned(immunization?.approvalDetails?.esignature?.esign ? true : false)
        }
    }, [immunization])

    let test = [];
    let pos = [];
    let lastTestDate = [];
    let valid = [];
    let deleteIcon = [];

    const getTableValues = (data, category) => {
        test = [];
        pos = [];
        lastTestDate = [];
        valid = [];
        deleteIcon = [];
        data?.map(innerData => {
            test.push(immunizationLabels[innerData?.immunization])
            pos.push(resultLabels[innerData?.result] !== "Neg" ? 'Positive' : 'Negative')
            lastTestDate.push(innerData?.testDate ? format(new Date(innerData?.testDate), 'MMM dd, yyyy') : '')
            valid.push(innerData?.files?.[0]?.valid ? <CheckIcon sx={{ color: '#06617A' }} /> : <ClearIcon sx={{ color: '#06617A' }} />)
            // deleteIcon.push(<img src={DeleteIcon} alt="" className={`${style.docTypeImgStyle} ${style.cursorPointer}`} onClick={() => { handleDeleteTestDetail(category, innerData) }} />)
        })

        return [
            { type: "text", value: test },
            { type: "text", value: pos },
            { type: "text", value: lastTestDate },
            { type: "icon", icon: valid },
            // { type: "icon", icon: deleteIcon },
        ];
    }

    const getPreApplication = async () => {
        try {
            const { data: basicForm } = await GET(`application-management-service/application/${applicationId}`);
            setForm(basicForm);
            // setReference(basicForm?.references?.reference?.filter(data => data?.rowId === refId)?.length !== 0 ? basicForm?.references?.reference?.filter(data => data?.rowId === refId)?.[0] : basicForm?.privilegeReference?.reference?.filter(data => data?.rowId === refId)?.[0])
            // console.log(basicForm?.references?.reference?.filter(data => data?.rowId === refId)?.length !== 0 ? basicForm?.references?.reference?.filter(data => data?.rowId === refId) : basicForm?.privilegeReference?.reference?.filter(data => data?.rowId === refId), 'reference')
        } catch (error) {
            console.error('Error fetching application:', error);
        }
    };

    const getDepartmentHead = async () => {
        const { data: deptHead } = await GET(
            // `user-management-service/user/role?role=Department Head`
            `user-management-service/user/role?role=Department Head&departmentSpecialties=${form?.basicDetailReferences?.specialty?.id ? `${form?.basicDetailReferences?.department?.id}#${form?.basicDetailReferences?.specialty?.id}` : form?.basicDetailReferences?.department?.id}`
        );
        setDeptHead(deptHead?.[0])
    }

    const getFormSchema = async () => {
        const { data: formValue } = await GET(
            `application-management-service/formSchema/${form?.formSchemas?.[form?.formSchemas?.findIndex(data => data?.schemaCategory === "Immunization")]?.id}`
        );
        setFormSchema(formValue?.schema)
    }

    const getApplicationImmunization = async () => {
        try {
            const { data: immunizationData } = await GET(`application-management-service/application/${applicationId}/immunization`);
            setImmunization(immunizationData)
        } catch (error) {
            console.error('Error fetching application:', error);
        }
    }

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
            "notes": {
                "notes": notes
            },
            "workflowAction": immunizationStatus,
            "name": `${user?.name?.firstName} ${user?.name?.lastName}`,
            "title": user?.title,
            "esignature": {
                "esign": encryptedText,
                "name": `${user?.name?.firstName} ${user?.name?.lastName}`,
                "signedDate": format(new Date(), 'MMM dd, yyyy')
            }
        }
        await PUT(`application-management-service/application/${applicationId}/immunization/action`, temp)
            .then(response => {
                getApplicationImmunization()
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster2('Something went wrong while saving your data. Please try again later.')
            });
    }


    const onClose = () => {
        // setIsReferenceReview(false);
    }


    return (
        <div style={{
            maxHeight: 'calc(100vh - 10px)',
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "gray transparent",
        }}>
            <ApplicationHeader
                title={`Immunization History Form`}
                close={true}
                closeClick={onClose}
                isNotLogout={true}
            />
            <div className={`${style.marginLeftRight50} ${style.marginTop10}`}>
                <div className={style.referenceGrid}>
                    <div>
                        <div className={`${style.applicantInfoCard}`}>
                            <div className={style.applicantInformation}>APPLICANT INFORMATION</div>
                            <div className={style.applicantName}>{`${form?.basicDetails?.applicant?.name?.firstName} ${form?.basicDetails?.applicant?.name?.lastName}`}</div>
                            <div className={style.description}>{`${form?.basicDetails?.applicant?.applicantType} Applying for a staff position as ${form?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory}`}</div>
                            <div className={`${style.twoCol} ${style.marginTop10}`}>
                                <div className={style.applicantInfoGrid}>
                                    <div className={style.descriptionMild}>Department:</div>
                                    <div className={style.descriptionMild}>{form?.basicDetails?.departmentSpecialty?.department}</div>
                                </div>
                                <div className={style.applicantInfoGrid}>
                                    <div className={style.descriptionMild}>Department Head:</div>
                                    <div>
                                        <div className={style.descriptionMild}>{`${deptHead?.name?.firstName} ${deptHead?.name?.lastName}`}</div>
                                        <div className={style.descriptionMild}>{`${`${deptHead?.email?.officialEmail} `} | ${`${deptHead?.communication?.countryCode} ${deptHead?.communication?.mobileNumber}`}`}</div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.twoCol} ${style.marginTop10}`}>
                                <div className={style.applicantInfoGrid}>
                                    <div className={style.descriptionMild}>Speciality:</div>
                                    <div className={style.descriptionMild}>{form?.basicDetailReferences?.specialty?.name}</div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={` ${style.marginTop10} ${style.tableDataStyle}`}
                        >
                            <div className={`${style.marginTop10} ${style.screenPadding}`}>
                                <>
                                    <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Tuberculosis(TB)']?.label}</div>
                                    <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Tuberculosis(TB)']?.description}</div>
                                    {immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "TUBERCULIN")?.length !== 0 && (
                                        <TableTwo
                                            tableHeaderValues={tableHeader}
                                            tableDataValues={getTableValues(immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "TUBERCULIN")?.[0]?.testDetails, 'TUBERCULIN')}
                                            tableData={immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "TUBERCULIN")?.[0]?.testDetails}
                                            gridStyle={style.testGrid}
                                            tableSortValues={[]}
                                            heading={"There are no records to display"}
                                            className={`${style.tableRow} ${style.reportSection}`}
                                            hidePagination={true}
                                        />
                                    )}
                                    <CommonDivider />
                                    <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Measles, Mumps & Rubella (MMR)']?.label}</div>
                                    <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Measles, Mumps & Rubella (MMR)']?.description}</div>
                                    {immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "MEASLES_MUMPS_RUBELLA")?.length !== 0 && (
                                        <TableTwo
                                            tableHeaderValues={tableHeader}
                                            tableDataValues={getTableValues(immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "MEASLES_MUMPS_RUBELLA")?.[0]?.testDetails, "MEASLES_MUMPS_RUBELLA")}
                                            tableData={immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "MEASLES_MUMPS_RUBELLA")?.[0]?.testDetails}
                                            gridStyle={style.testGrid}
                                            tableSortValues={[]}
                                            heading={"There are no records to display"}
                                            className={`${style.tableRow} ${style.reportSection}`}
                                            hidePagination={true}
                                        />
                                    )}
                                    <CommonDivider />
                                    <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Hepatitis B Vaccination']?.label}</div>
                                    <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Hepatitis B Vaccination']?.description}</div>
                                    {immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "HEPATITIS_B")?.length !== 0 && (
                                        <TableTwo
                                            tableHeaderValues={tableHeader}
                                            tableDataValues={getTableValues(immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "HEPATITIS_B")?.[0]?.testDetails, "HEPATITIS_B")}
                                            tableData={immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "HEPATITIS_B")}
                                            gridStyle={style.testGrid}
                                            tableSortValues={[]}
                                            heading={"There are no records to display"}
                                            className={`${style.tableRow} ${style.reportSection}`}
                                            hidePagination={true}
                                        />
                                    )}
                                    <CommonDivider />
                                    <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Varicella']?.label}</div>
                                    <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Varicella']?.description}</div>
                                    {immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "VARICELLA")?.length !== 0 && (
                                        <TableTwo
                                            tableHeaderValues={tableHeader}
                                            tableDataValues={getTableValues(immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "VARICELLA")?.[0]?.testDetails, "VARICELLA")}
                                            tableData={immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "VARICELLA")?.[0]?.testDetails}
                                            gridStyle={style.testGrid}
                                            tableSortValues={[]}
                                            heading={"There are no records to display"}
                                            className={`${style.tableRow} ${style.reportSection}`}
                                            hidePagination={true}
                                        />
                                    )}
                                    <CommonDivider />
                                    <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Tetnues/Diptheriea/Pertussis(Tdap) and Tetatnus/Diphtheria(Td)']?.label}</div>
                                    <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Tetnues/Diptheriea/Pertussis(Tdap) and Tetatnus/Diphtheria(Td)']?.description}</div>
                                    {immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "TETANUS_DIPHTHERIA_PERTUSSIS_OR_TETANUS_DIPHTHERIA")?.length !== 0 && (
                                        <TableTwo
                                            tableHeaderValues={tableHeader}
                                            tableDataValues={getTableValues(immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "TETANUS_DIPHTHERIA_PERTUSSIS_OR_TETANUS_DIPHTHERIA")?.[0]?.testDetails, "TETANUS_DIPHTHERIA_PERTUSSIS_OR_TETANUS_DIPHTHERIA")}
                                            tableData={immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "TETANUS_DIPHTHERIA_PERTUSSIS_OR_TETANUS_DIPHTHERIA")?.[0]?.testDetails}
                                            gridStyle={style.testGrid}
                                            tableSortValues={[]}
                                            heading={"There are no records to display"}
                                            className={`${style.tableRow} ${style.reportSection}`}
                                            hidePagination={true}
                                        />
                                    )}
                                    <CommonDivider />
                                    <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Influenza']?.label}</div>
                                    <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Influenza']?.description}</div>
                                    {immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "INFLUENZA")?.length !== 0 && (
                                        <TableTwo
                                            tableHeaderValues={tableHeader}
                                            tableDataValues={getTableValues(immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "INFLUENZA")?.[0]?.testDetails, "INFLUENZA")}
                                            tableData={immunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "INFLUENZA")?.[0]?.testDetails}
                                            gridStyle={style.testGrid}
                                            tableSortValues={[]}
                                            heading={"There are no records to display"}
                                            className={`${style.tableRow} ${style.reportSection}`}
                                            hidePagination={true}
                                        />
                                    )}
                                </>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={`${style.cardLeftStyleWithPadding}`}>
                            <div className={`${style.cardTextBoldStyle}`}>
                                <strong>Immunization History Review</strong>
                            </div>
                            <CommonDivider />
                            <CommonRadio
                                isRow={true}
                                value={immunizationStatus}
                                onChange={(e) => setImmunizationStatus(e.target.value)}
                                radioValue={['APPROVED', 'NOT_APPROVED']}
                                label={['Approved', 'Not Approved']}
                                readOnly={immunization?.approvalDetails?.esignature?.esign}
                            />
                            <div className={`${style.cardTextBoldStyle} ${style.marginTop10}`}>
                                Notes / Comments
                            </div>
                            <div className={style.marginTop10}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={notes || ""}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        if (!immunization?.approvalDetails?.esignature?.esign)
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
                            <CommonDivider />
                            <div className={style.marginTop10}>
                                <CommonTextField
                                    value={immunization?.approvalDetails?.name ? immunization?.approvalDetails?.name : `${user?.name?.firstName} ${user?.name?.lastName}`}
                                    className={style.fullWidth}
                                    label={'Name'}
                                />
                                {/* <CommonTextField
                                value={`${user?.name?.firstName} ${user?.name?.lastName}`}
                                className={style.fullWidth}
                                label={'Title'}
                            /> */}
                                <div className={style.marginTop10}>
                                    <div onClick={immunization?.approvalDetails?.esignature?.esign ? () => { } : () => setIsSigned(!isSigned)}>
                                        <ESignature
                                            userName={immunization?.approvalDetails?.name ? immunization?.approvalDetails?.name : `${user?.name?.firstName} ${user?.name?.lastName}`}
                                            encData={immunization?.approvalDetails?.esignature?.esign ? immunization?.approvalDetails?.esignature?.esign : isSigned ? encryptedText : ''}
                                            showData={(isSigned || immunization?.approvalDetails?.esignature?.esign) ? true : false}
                                            showDatais={(isSigned || immunization?.approvalDetails?.esignature?.esign) ? true : false}
                                            alternateSignature={immunization?.approvalDetails?.name ? immunization?.approvalDetails?.name : `${user?.name?.firstName} ${user?.name?.lastName}`}
                                        />
                                    </div>
                                    <div className={style.verticalAlignCenter}>
                                        <div className={style.displayInRow}>
                                            <div className={style.dateTitle}>Date:</div>
                                            <div className={`${style.date} ${style.marginLeft}`}>
                                                {immunization?.approvalDetails?.esignature?.signedDate ? immunization?.approvalDetails?.esignature?.signedDate : isSigned ? format(new Date(), 'MMM dd, yyyy') : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {!immunization?.approvalDetails?.esignature?.esign && (
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

export default ImmunizationReview;