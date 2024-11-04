import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import { GET, POST, PUT } from '../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';

import style from './index.module.scss';
import NoDataBox from '../../../Components/ReusableSmallComponents/noDataBox';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import CommonDropZone from '../../../Components/CommonFields/CommonDropZone';
import CommonTextField from '../../../Components/CommonFields/CommonTextField';
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';
import CommonDateField from '../../../Components/CommonFields/CommonDateField';
import { TextField } from '@mui/material';

const Immunization = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
    const [formSchema, setFormSchema] = useState();
    const [isEdited, setIsEdited] = useState(false);
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const { section, step } = useParams()
    const [formIndex, setFormIndex] = useState();
    const [navigateURL, setNavigateURL] = useState();
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [calendarStart, setCalendarStart] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            setNavigateURL((basicForm?.forms?.filter(data => data?.formCategory === 'Form')?.length === (formIndex + 1)) ? '/applicationForm/Form/PODCheck' : `/applicationForm/${basicForm?.forms[formIndex + 1]?.formCategory}/${basicForm?.forms[formIndex + 1]?.schemaCategory}`)
        }
    }, [basicForm, formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === step))
    }, [basicForm, step])

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[formIndex]?.id}`
        );
        setFormSchema(form?.schema)
    }

    const getIsSubmitClicked = (value, data) => {
        if (value) {
            handleSubmitApplicationReq(data)
        }
    }

    const handleSubmitApplicationReq = async (data) => {
        let temp = {
            schemaId: data?.forms?.[formIndex]?.schemaId,
            data: data?.forms?.[formIndex]?.data
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                getPreApplication();
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
    }

    const changeHandler = async (event) => {
        setIsLoading(true);
        setFiles(event);
        console.log(event, 'Test');

        const formData = new FormData();
        let fileNameArray = [];
        event?.forEach(file => {
            fileNameArray.push({ "fileName": file?.name });
            formData.append('documents', file); // Append each file individually
        });

        formData.append('files', new Blob([JSON.stringify(fileNameArray)], {
            type: "application/json"
        }));
        console.log(fileNameArray)
        try {
            const response = await POST(`application-management-service/application/${applicationId}/files/bulk?isLLMRequired=${true}`, formData);
            SuccessToaster('File Uploaded Successfully');
            console.log(response?.data);
            setIsLoading(false);
            return response?.data;
        } catch (error) {
            ErrorToaster('File Upload Failed');
            console.error(error);
            setIsLoading(false);
            return null;
        }
    };

    const handleAddMore = () => {

    }

    const getIsEdited = (value) => {
        setIsEdited(value)
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 15'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={2} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        <div className={`${style.cardTitle} ${style.marginTop}`}>Professional Staff Immunization & Surveillance Policy Information Sheet</div>
                        <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.description}</div>
                        <CommonDivider />
                        <div className={`${style.twoCol} ${style.marginTop}`}>
                            <CommonDropZone
                                title={"Upload Your Documents"}
                                description={
                                    "Upload your files or drag & drop from your file cabinet (Computer / Online Drive)"
                                }
                                changeHandler={changeHandler}
                                files={files}
                            />
                            <CommonDropZone
                                title={"Upload A Photo"}
                                description={
                                    "Click a picture of the document with your camera and Upload or Upload from your photo gallery."
                                }
                                changeHandler={changeHandler}
                                files={files}
                                accept="image/*"
                            />
                        </div>
                        <div className={`${style.addMoreBorder} ${style.marginTop}`}>
                            <div className={style.padding20}>
                                <div
                                    className={style.cardTitle}>
                                    {formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.label}
                                </div>
                                <div className={`${style.ImmunizationGrid} ${style.marginTop}`}>
                                    <CommonSelectField
                                        value={''}
                                        // onChange={(e) =>
                                        //     handleChange(fieldKey, e.target.value, baseKey)
                                        // }
                                        className={style.fullWidth}
                                        // firstOptionLabel={fieldData.label}
                                        // firstOptionValue={fieldData.label}
                                        valueList={[]}
                                        labelList={[]}
                                        disabledList={[]}
                                        label={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['test/ImmunizationCategory']?.label}
                                        required={true}
                                    />
                                    <CommonSelectField
                                        value={''}
                                        // onChange={(e) =>
                                        //     handleChange(fieldKey, e.target.value, baseKey)
                                        // }
                                        className={style.fullWidth}
                                        // firstOptionLabel={fieldData.label}
                                        // firstOptionValue={fieldData.label}
                                        valueList={[]}
                                        labelList={[]}
                                        disabledList={[]}
                                        label={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['test/Immunization']?.label}
                                        required={true}
                                    />
                                    <CommonDateField
                                        className={style.fullWidth}
                                        open={calendarStart}
                                        onOpen={() => setCalendarStart(true)}
                                        onClose={() => setCalendarStart(false)}
                                        // minDate={sub(new Date(), { years: 3 })}
                                        // maxDate={add(new Date(), { months: 6 })}
                                        // value={
                                        //     getValueByPath(
                                        //         basicForm,
                                        //         `${basicpath}.${baseKey}.${fieldKey}`
                                        //     ) || null
                                        // }
                                        // onChange={(newValue) =>
                                        //     handleChange(
                                        //         fieldKey,
                                        //         fieldData.format === "date-time"
                                        //             ? format(new Date(newValue), "yyyy-MM-dd'T'HH:mm:ss'Z'")
                                        //             : format(new Date(newValue), "yyyy-MM-dd"),
                                        //         baseKey
                                        //     )
                                        // }
                                        InputProps={{
                                            style: {
                                                fontSize: 14,
                                                height: 30,
                                            },

                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    placeholder: `DD-MM-YYYY`,
                                                    readOnly: true
                                                }}
                                                // color={
                                                //     warningFields
                                                //         ?.map((data) => data?.key)
                                                //         ?.includes(`${basicpath}.${baseKey}.${fieldKey}`) &&
                                                //         (getValueByPath(
                                                //             basicForm,
                                                //             `${basicpath}.${baseKey}.${fieldKey}`
                                                //         ) === null ||
                                                //             getValueByPath(
                                                //                 basicForm,
                                                //                 `${basicpath}.${baseKey}.${fieldKey}`
                                                //             ) === "")
                                                //         ? "error"
                                                //         : ""
                                                // }
                                                fullWidth
                                            // focused={
                                            //     warningFields
                                            //         ?.map((data) => data?.key)
                                            //         ?.includes(`${basicpath}.${baseKey}.${fieldKey}`) &&
                                            //         (getValueByPath(
                                            //             basicForm,
                                            //             `${basicpath}.${baseKey}.${fieldKey}`
                                            //         ) === null ||
                                            //             getValueByPath(
                                            //                 basicForm,
                                            //                 `${basicpath}.${baseKey}.${fieldKey}`
                                            //             ) === "")
                                            //         ? true
                                            //         : false
                                            // }
                                            />
                                        )}
                                        label={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['from']?.label}
                                        required={true}
                                    />
                                    <CommonSelectField
                                        value={''}
                                        // onChange={(e) =>
                                        //     handleChange(fieldKey, e.target.value, baseKey)
                                        // }
                                        className={style.fullWidth}
                                        // firstOptionLabel={fieldData.label}
                                        // firstOptionValue={fieldData.label}
                                        valueList={[]}
                                        labelList={[]}
                                        disabledList={[]}
                                        label={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['result']?.label}
                                        required={true}
                                    />
                                    <CommonTextField
                                        value={""
                                        }
                                        className={style.fullWidth}
                                        // onChange={(e) =>
                                        //     handleChange(
                                        //         fieldKey,
                                        //         fieldData.type === "number"
                                        //             ? parseInt(
                                        //                 e.target.value <= fieldData.maximum
                                        //                     ? e.target.value
                                        //                     : fieldData.maximum
                                        //             )
                                        //             : fieldKey === "pinCode" ? FormatPostalCode(e.target.value) : e.target.value,
                                        //         baseKey
                                        //     )
                                        // }
                                        placeholder={''}
                                        label={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['induration']?.label}
                                        required={true}
                                    />
                                </div>
                                <div
                                    className={`${style.displayInRowRev} ${style.marginTop}`}
                                >
                                    <div className={style.marginLeft}>
                                        <div
                                            className={`${style.addMoreButton}`}
                                            onClick={() => {
                                                handleAddMore('close');
                                            }}
                                        >
                                            SAVE & CLOSE
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            className={`${style.addMoreButtonOutlined}`}
                                            onClick={() => {
                                                handleAddMore('');
                                            }}
                                        >
                                            SAVE & ADD MORE
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Tuberculosis(TB)']?.label}</div>
                        <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Tuberculosis(TB)']?.description}</div>
                        <CommonDivider />
                        <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Measles, Mumps & Rubella (MMR)']?.label}</div>
                        <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Measles, Mumps & Rubella (MMR)']?.description}</div>
                        <CommonDivider />
                        <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Hepatitis B Vaccination']?.label}</div>
                        <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Hepatitis B Vaccination']?.description}</div>
                        <CommonDivider />
                        <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Varicella']?.label}</div>
                        <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Varicella']?.description}</div>
                        <CommonDivider />
                        <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Tetnues/Diptheriea/Pertussis(Tdap) and Tetatnus/Diphtheria(Td)']?.label}</div>
                        <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Tetnues/Diptheriea/Pertussis(Tdap) and Tetatnus/Diphtheria(Td)']?.description}</div>
                        <CommonDivider />
                        <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Influenza']?.label}</div>
                        <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Influenza']?.description}</div>
                        <CommonDivider />
                        <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.primaryCarePhysicianForVerificationOfImmunizationHistory?.label}</div>
                        <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.primaryCarePhysicianForVerificationOfImmunizationHistory?.description}</div>
                        <CommonDivider />
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/applicationForm/section1/acknowledgementStep1')} >CONTINUE</div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Immunization;