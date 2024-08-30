import React, { useEffect, useState } from 'react'
import ApplicationHeader from '../../../Components/ApplicationHeader';
import TextForHelp from '../../../Components/TextForHelp';
import { GET, POST, PUT } from '../../dataSaver';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import style from './index.module.scss'
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';

const CompleteApplicationRequest = () => {
    const [form, setForm] = useState();
    const [isNextpage, setIsNextPage] = useState(false);
    const [applicationId, setApplicationId] = useState('');
    const [basicForm, setBasicForm] = useState({})

    useEffect(() => {
        getBasicForm()
        getPreApplication()
    }, [applicationId, isNextpage])

    const getBasicForm = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/basicForm`
        );
        if (basicForm) {
            if (!isNextpage) {
                const { data: form } = await GET(
                    `application-management-service/formSchema/${basicForm?.generalSchemas?.[1]?.id}`
                );
                console.log(form)
                setForm(form)
            } else {
                const { data: form } = await GET(
                    `application-management-service/formSchema/${basicForm?.generalSchemas?.[2]?.id}`
                );
                console.log(form)
                setForm(form)
            }
        }
    }

    const getPreApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/${`66d1cae19354e9022ad82027`}`
        );
        setBasicForm(basicForm)
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
        await PUT(`application-management-service/application/${data?.id}`, data)
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

    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={'New Appointment Request'} />
            <div className={style.screenPadding}>
                {!isNextpage ? (
                    <>
                        <TextForHelp title={'TEXT FOR HELP'} description={'help lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus quam nec tellus dictum, vitae ultrices urna porttitor. donec commodo tellus dapibus semper mattis. aenean ut massa vitae tortor consequat tristique. etiam eget condimentum sapien. morbi est ante, sagittis ac rhoncus eget, faucibus ut felis. pellentesque iaculis aliquam massa. lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus quam nec tellus dictum.'} />
                        {form !== undefined && 'applicant' in form?.properties && (
                            <ApplicationFieldCard object={form?.properties?.applicant} gridStyle={style.threeCol} baseKey={'applicant'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                        {form !== undefined && 'service' in form?.properties && (
                            <ApplicationFieldCard object={form?.properties?.service} gridStyle={style.twoCol} baseKey={'service'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                        <div className={style.spaceBetween}>
                            <div></div>
                            <div className={style.displayInRow}>
                                <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                                <div className={`${style.continue} ${style.marginTop} ${style.marginLeft}`} onClick={() => handleSubmitApplicationReq()}>Next</div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {form !== undefined && 'sites' in form?.properties && (
                            <div className={style.siteCardGrid}>
                                <ApplicationFieldCard object={form?.properties?.sites} gridStyle={style.siteGrid} baseKey={'sites'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} showAdd={true} />
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
                                <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                                <div className={`${style.continue} ${style.marginTop} ${style.marginLeft}`} onClick={() => handleSubmitApplicationReq()}>VERIFY & CONTINUE</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CompleteApplicationRequest;