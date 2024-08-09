import React, { useEffect, useState } from 'react';
import ApplicationHeader from '../../Components/ApplicationHeader';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import style from './index.module.scss';
import { GET, POST, PUT } from '../dataSaver';
import ApplicationFieldCard from '../../Components/ApplicationFieldCard';
import { ErrorToaster, SuccessToaster } from '../../utils/toaster';

const CreateStaffMemberApplication = () => {
    const [form, setForm] = useState();
    const [isNextpage, setIsNextPage] = useState(false);
    const [applicationId, setApplicationId] = useState('');
    const [basicForm, setBasicForm] = useState(
        {
            "applicant": {
                "id": "string",
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
                    "id": "",
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
                "natureOfService": {
                    "id": "",
                    "name": ""
                },
                "proposedStartDate": "2024-07-12",
                "curriculumVitae": {
                    "filePath": "",
                    "fileName": "",
                    "fileURL": ""
                },
                "letterOfInterest": {
                    "filePath": "",
                    "fileName": "",
                    "fileURL": ""
                },
                "interviewDetails": {
                    "interviewDate": "2024-07-12",
                    "interviewedBy": ""
                },
                "sites": {
                    "siteDepartments": [
                        {
                            "site": {
                                "id": "",
                                "name": ""
                            },
                            "department": {
                                "id": "",
                                "name": ""
                            },
                            "speciality": {
                                "id": "",
                                "name": ""
                            }
                        }
                    ]
                },
                "natureOfPractice": {
                    "natureOfPracticeType": "",
                    "partTimeDetails": {
                        "locumTenensType": "",
                        "startDate": "2024-07-12",
                        "endDate": "2024-07-12"
                    }
                },
                "regionalCallResponsibilities": {
                    "applicable": true,
                    "sites": {
                        "siteDepartments": [
                            {
                                "site": {
                                    "id": "",
                                    "name": ""
                                },
                                "department": {
                                    "id": "",
                                    "name": ""
                                },
                                "speciality": {
                                    "id": "",
                                    "name": ""
                                }
                            }
                        ]
                    }
                }
            }
        }
    )
    useEffect(() => {
        getBasicForm()
    }, [applicationId])

    const getBasicForm = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/preApplication/basicForm`
        );
        if (basicForm) {
            if (applicationId === '') {
                const { data: form } = await GET(
                    `application-management-service/formSchema/${basicForm?.generalSchemas?.[0]?.id}`
                );
                let temp = form;
                if (temp.properties.applicant.properties !== null) {
                    delete temp.properties.applicant.properties['letterOfInterest']
                    delete temp.properties.applicant.properties['curriculumVitae']
                }
                setForm(form)
            } else {
                const { data: form } = await GET(
                    `application-management-service/formSchema/${basicForm?.generalSchemas?.[1]?.id}`
                );
                setForm(form)
            }
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
    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={'Create A New Staff Member Application'} />
            <div className={style.screenPadding}>
                <div className={style.breadcrumbStyle}>{`CAP MANAGER > APPLICATIONS >> NEW APPLICATION`}</div>
                {!isNextpage ? (
                    <>
                        {form !== undefined && 'applicant' in form?.properties && (
                            <ApplicationFieldCard object={form?.properties?.applicant} gridStyle={style.threeCol} baseKey={'applicant'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                        {form !== undefined && 'service' in form?.properties && (
                            <ApplicationFieldCard object={form?.properties?.service} gridStyle={style.twoCol} baseKey={'service'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                        {form !== undefined && 'interviewDetails' in form?.properties && (
                            <ApplicationFieldCard object={form?.properties?.interviewDetails} gridStyle={style.jobInterviewGrid} baseKey={'interviewDetails'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                        <div className={style.spaceBetween}>
                            <div></div>
                            <div className={style.displayInRow}>
                                <div className={`${style.saveInProgress} ${style.marginTop}`}>DISCARD</div>
                                <div className={`${style.continue} ${style.marginTop} ${style.marginLeft}`} onClick={() => handleSubmitApplicationReq()}>Next</div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {form !== undefined && 'sites' in form?.properties && (
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
                        )}
                        <div className={style.spaceBetween}>
                            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => setIsNextPage(false)}>BACK</div>
                            <div className={style.displayInRow}>
                                <div className={`${style.saveInProgress} ${style.marginTop}`} >SEND APPLICATION LINK</div>
                                <div className={`${style.continue} ${style.marginTop} ${style.marginLeft}`} onClick={() => handleSubmitApplicationReq()}>Next</div>
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