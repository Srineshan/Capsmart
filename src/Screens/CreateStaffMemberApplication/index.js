import React, { useEffect, useState } from 'react';
import ApplicationHeader from '../../Components/ApplicationHeader';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { GET, POST, PUT } from '../dataSaver';
import ApplicationFieldCard from '../../Components/ApplicationFieldCard';
import { ErrorToaster, SuccessToaster } from '../../utils/toaster';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import style from './index.module.scss';


const CreateStaffMemberApplication = () => {
    const [form, setForm] = useState();
    const [isNextpage, setIsNextPage] = useState(false);
    const [applicationId, setApplicationId] = useState('');
    const [basicFormForDocuments, setBasicFormForDocuments] = useState()
    const [requiredDocumentList, setRequiredDocumentList] = useState();
    const [basicForm, setBasicForm] = useState(
        {
            "applicant": {
                "name": {
                    "firstName": "",
                    "lastName": "",
                    "middleName": ""
                },
                "email": {
                    "officialEmail": ""
                },
                "mobileNumber": "",
                "category": "GUEST"
            },
            "providerType": {
                "id": "",
                "serviceProviderType": ""
            },
            "basicDetails": {
                "applicant": {
                    "name": {
                        "firstName": "",
                        "lastName": "",
                        "middleName": ""
                    },
                    "email": {
                        "officialEmail": ""
                    },
                    "cellPhone": "",
                    "applicantType": "",
                    "startDate": "",
                    "category": "GUEST",
                    "curriculumVitae": {
                        "filePath": "",
                        "fileName": "",
                        "fileURL": ""
                    },
                    "letterOfInterest": {
                        "filePath": "",
                        "fileName": "",
                        "fileURL": ""
                    }
                },
                "credentialingPrivilegeCategory": {
                    "credentialingCategory": "",
                    "from": null,
                    "to": null
                },
                "departmentSpecialty": {
                    "department": "",
                    "specialty": ""
                },
                "regionalCallResponsibilities": {
                    "regionalCallResponsibilities": ""
                },
                "billingNumber": {
                    "billingNumber": "",
                    "specialityBillingCode": ""
                }
            }
        }
    )

    const switchTheme = createTheme({
        palette: {
            primary: {
                main: '#25BF6A',
            },
        },
    });

    useEffect(() => {
        getBasicForm()
        getPreApplication()
    }, [])

    useEffect(() => {
        setRequiredDocumentList(basicFormForDocuments?.documentsRequired)
    }, [basicFormForDocuments])

    const handleSwitchChange = (value, id) => {
        // let temp = requiredDocumentList;
        // temp[index].required = value;
        // setRequiredDocumentList(temp)
        // console.log(temp)

        setRequiredDocumentList((prevStates) =>
            prevStates.map((data) =>
                data.document.id === id
                    ? { ...data, required: value } // Update the checked status
                    : data
            )
        );
    }
    console.log(requiredDocumentList)

    const getPreApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/66d1cae19354e9022ad82027`
        );
        setBasicFormForDocuments(basicForm)
    }

    const getBasicForm = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/basicForm`
        );
        if (basicForm) {
            // if (!isNextpage) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.generalSchemas?.[1]?.id}`
            );
            let temp = form?.schema;
            if (temp.properties.applicant.properties !== null) {
                delete temp.properties.applicant.properties['letterOfInterest']
                delete temp.properties.applicant.properties['curriculumVitae']
            }
            setForm(form?.schema)
            // } else {
            //     const { data: form } = await GET(
            //         `application-management-service/formSchema/${basicForm?.generalSchemas?.[2]?.id}`
            //     );
            //     setForm(form)
            // }
        }
    }

    const handleSubmitApplicationReq = async () => {
        let data = basicForm;
        data.providerType = {
            "id": "6398687f95164c0bb67ff4b2",
            "serviceProviderType": "Physician / Doctor"
        }

        data.basicDetails.providerType = {
            "id": "6398687f95164c0bb67ff4b2",
            "serviceProviderType": "Physician / Doctor"
        }

        console.log(data)
        if (applicationId === '') {
            await POST('application-management-service/application', data)
                .then(response => {
                    console.log(response)
                    setBasicForm(response?.data)
                    setApplicationId(response?.data?.id)
                    SuccessToaster("Staff Member Application Created Successfully");
                    setIsNextPage(true);
                })
                .catch((error) => {
                    console.log(error)
                    ErrorToaster("Unexpected Error Creating Staff Member Application");
                });
        } else {
            await PUT(`application-management-service/application/${applicationId}`, data)
                .then(response => {
                    console.log(response)
                    setBasicForm(response?.data)
                    SuccessToaster("Staff Member Application Updated Successfully");
                    if (!isNextpage) {
                        setIsNextPage(true);
                    }
                })
                .catch((error) => {
                    console.log(error)
                    ErrorToaster("Unexpected Error Updating Staff Member Application");
                });
        }
    }

    const handleRequiredFileSubmit = async () => {
        let data = basicFormForDocuments;
        data.documentsRequired = requiredDocumentList;
        await PUT(`application-management-service/application/66d1cae19354e9022ad82027`, data)
            .then(response => {
                getPreApplication()
                SuccessToaster("Staff Member Application Updated Successfully");
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Staff Member Application");
            });
    }
    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={'Create A New Staff Member Application'} />
            <div className={style.screenPadding}>
                <div className={style.displayInRowRev}>
                    {/* <div className={style.breadcrumbStyle}>{`STAFF APPOINTMENT APPLICATION >> NEW APPLICATION`}</div> */}
                    <div className={style.cardTitle}>{`* - Required`}</div>
                </div>
                {!isNextpage ? (
                    <>
                        {form !== undefined && 'applicant' in form?.properties && (
                            <ApplicationFieldCard object={form?.properties?.applicant} gridStyle={style.applicantGrid} baseKey={'applicant'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                        {form !== undefined && 'credentialingPrivilegeCategory' in form?.properties && (
                            <ApplicationFieldCard object={form?.properties?.credentialingPrivilegeCategory} gridStyle={style.credentialingGrid} baseKey={'credentialingPrivilegeCategory'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                        {form !== undefined && 'departmentSpecialty' in form?.properties && (
                            <ApplicationFieldCard object={form?.properties?.departmentSpecialty} gridStyle={style.appointmentGrid} baseKey={'departmentSpecialty'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                        {/* {form !== undefined && 'regionalCallResponsibilities' in form?.properties && (
                                <ApplicationFieldCard object={form?.properties?.regionalCallResponsibilities} gridStyle={style.regionalCallGrid} baseKey={'regionalCallResponsibilities'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                            )} */}
                        <div className={style.spaceBetween}>
                            <div></div>
                            <div className={style.displayInRow}>
                                <div className={style.displayInRow}>
                                    <div className={`${style.saveInProgress} ${style.marginTop}`}>DISCARD</div>
                                    <div className={`${style.continue} ${style.marginTop} ${style.marginLeft}`} onClick={() => handleSubmitApplicationReq()}>CONTINUE</div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* {form !== undefined && 'sites' in form?.properties && (
                            <div className={style.siteCardGrid}>
                                <ApplicationFieldCard object={form?.properties?.sites} gridStyle={style.siteGrid} baseKey={'sites'} basicForm={basicForm} setBasicForm={setBasicForm} showAdd={true} isBasicPath={true} />
                                <div className={`${style.backgroundCard} ${style.marginTop}`}>
                                    <div className={style.cardTitle}>Added Sites</div>
                                    <div className={`${style.siteDisplayCard} ${style.siteDisplayGrid} ${style.marginTop}`}>
                                        <div>
                                            <div className={style.siteDisplaySiteTextStyle}>Cambridge Memorial Hospital </div>
                                            <div className={style.siteDisplayDepartmentTextStyle}>Department of Surgery (Cardiothoracic Surgery)</div>
                                        </div>
                                        <DeleteOutlineIcon sx={{ color: '#7165E3', cursor: 'pointer' }} />
                                    </div>
                                    <div className={`${style.siteDisplayCard} ${style.siteDisplayGrid} ${style.marginTop}`}>
                                        <div>
                                            <div className={style.siteDisplaySiteTextStyle}>Cambridge Memorial Hospital </div>
                                            <div className={style.siteDisplayDepartmentTextStyle}>Department of Surgery (General Surgery)</div>
                                        </div>
                                        <DeleteOutlineIcon sx={{ color: '#7165E3', cursor: 'pointer' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {form !== undefined && 'natureOfPractice' in form?.properties && (
                            <ApplicationFieldCard object={form?.properties?.natureOfPractice} gridStyle={style.natureOfPracticeGrid} baseKey={'natureOfPractice'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                        {form !== undefined && 'regionalCallResponsibilities' in form?.properties && (
                            <ApplicationFieldCard object={form?.properties?.regionalCallResponsibilities} gridStyle={style.jobInterviewGrid} baseKey={'regionalCallResponsibilities'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )} */}
                        <div className={style.applicationCardStyle}>
                            <div className={style.marginTop}>
                                <div className={style.cardTitle}>Recommended documents & forms for this Application</div>
                            </div>
                            <div className={`${style.fileGrid} ${style.marginTop} ${style.tableHeader}`}>
                                <div className={`${style.tableHeaderFont} ${style.centerAlign}`}>Mandatory?</div>
                                <div className={style.tableHeaderFont}>Document / Form</div>
                            </div>
                            {requiredDocumentList?.map((data, index) => (
                                <div className={`${style.tableData} ${index % 2 === 0 ? style.alternativeBackgroundColor : ''}`} key={`${index}radio`}>
                                    <div className={style.fileGrid}>
                                        <div className={style.centerAlign}>
                                            {/* <CommonSwitch
                                                className={`${style.textAlignLeft}`}
                                                checked={true}
                                                onChange={(e) =>
                                                    handleSwitchChange(e.target.checked)
                                                }
                                                label={true ? "YES" : "NO"}
                                            /> */}
                                            <ThemeProvider theme={switchTheme}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch className={`${style.textAlignLeft}`} onChange={(e) =>
                                                            handleSwitchChange(e.target.checked, data?.document?.id)
                                                        } checked={data?.required} size="small" key={`${index}radio`} />
                                                    }
                                                    color='primary'
                                                    className={`${style.textAlignLeft}`}
                                                    label={data?.required ? "YES" : "NO"}
                                                    key={`${index}radio`}
                                                />
                                            </ThemeProvider>
                                        </div>
                                        <div className={style.fileNameText}>{data?.document?.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={style.spaceBetween}>
                            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => setIsNextPage(false)}>BACK</div>
                            <div className={style.displayInRow}>
                                <div className={`${style.continue} ${style.marginTop} ${style.marginLeft}`} onClick={() => handleRequiredFileSubmit()}>SEND APPLICATION LINK</div>
                            </div>
                        </div>
                    </>
                )}
                {/* {
                    <>
                        {form !== undefined && 'sites' in form?.properties && (
                            <div className={style.siteCardGrid}>
                                <ApplicationFieldCard object={form?.properties?.sites} gridStyle={style.siteGrid} baseKey={'sites'} basicForm={basicForm} setBasicForm={setBasicForm} showAdd={true} />
                                <div className={`${style.backgroundCard} ${style.marginTop}`}>
                                    <div className={style.cardTitle}>Added Sites</div>
                                    <div className={`${style.siteDisplayCard} ${style.siteDisplayGrid} ${style.marginTop}`}>
                                        <div>
                                            <div className={style.siteDisplaySiteTextStyle}>Cambridge Memorial Hospital </div>
                                            <div className={style.siteDisplayDepartmentTextStyle}>Department of Surgery (Cardiothoracic Surgery)</div>
                                        </div>
                                        <DeleteOutlineIcon sx={{ color: '#7165E3', cursor: 'pointer' }} />
                                    </div>
                                    <div className={`${style.siteDisplayCard} ${style.siteDisplayGrid} ${style.marginTop}`}>
                                        <div>
                                            <div className={style.siteDisplaySiteTextStyle}>Cambridge Memorial Hospital </div>
                                            <div className={style.siteDisplayDepartmentTextStyle}>Department of Surgery (General Surgery)</div>
                                        </div>
                                        <DeleteOutlineIcon sx={{ color: '#7165E3', cursor: 'pointer' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {form !== undefined && 'natureOfPractice' in form?.properties && (
                            <ApplicationFieldCard object={form?.properties?.natureOfPractice} gridStyle={style.natureOfPracticeGrid} baseKey={'natureOfPractice'} basicForm={basicForm} setBasicForm={setBasicForm} />
                        )}
                        {form !== undefined && 'regionalCallResponsibilities' in form?.properties && (
                            <ApplicationFieldCard object={form?.properties?.regionalCallResponsibilities} gridStyle={style.jobInterviewGrid} baseKey={'regionalCallResponsibilities'} basicForm={basicForm} setBasicForm={setBasicForm} />
                        )}
                        <div className={style.spaceBetween}>
                            <div className={`${style.saveInProgress} ${style.marginTop}`}>DISCARD</div>
                            <div className={style.displayInRow}>
                                <div className={`${style.saveInProgress} ${style.marginTop}`}>SEND APPLICATION LINK</div>
                                <div className={`${style.continue} ${style.marginTop} ${style.marginLeft}`} onClick={() => handleSubmitApplicationReq()}>Next</div>
                            </div>
                        </div>
                    </>
                } */}
            </div>
        </div>
    )
}

export default CreateStaffMemberApplication;