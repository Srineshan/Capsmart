import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import { GET, PUT } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';

import style from './index.module.scss';
import AIAssistantDialog from '../../../Components/AIAssistantDialog';
import SaveInProgressDialog from '../../../Components/SaveInProgressDialog';

const Step1 = ({ basicForm, setBasicForm, applicationId }) => {
    const [form1, setForm1] = useState();
    const [form2, setForm2] = useState();
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(true);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    useEffect(() => {
        getBasicForm()
    }, [])

    const getIsOpen = (value) => {
        setIsOpen(value);
    }

    const getIsSaveInProgressOpen = (value) => {
        setIsSaveInProgressOpen(value);
    }

    const getBasicForm = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/basicForm`
        );
        if (basicForm) {
            const { data: form1 } = await GET(
                `application-management-service/formSchema/${basicForm?.generalSchemas?.[1]?.id}`
            );
            let temp = form1?.schema;
            if (temp.properties.applicant.properties !== null) {
                delete temp.properties.applicant.properties['applicantType']
                delete temp.properties.applicant.properties['startDate']
            }
            setForm1(form1?.schema)
        }
    }

    const handleSubmitApplicationReq = async () => {
        let data = basicForm;
        console.log(data)
        await PUT(`application-management-service/application/${applicationId}`, data)
            .then(response => {
                console.log(response)
                setBasicForm(response?.data)
                SuccessToaster("Staff Member Application Updated Successfully");
                navigate('/applicationForm/section1/step2')
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Staff Member Application");
            });
    }

    return (
        <div>
            <div className={`${style.applicationScreenGrid} `}>
                <div>
                    <ProgressCard step={''} dataType={'Process Required Documents'} title={form1?.title} timeNumber={1} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                    <div className={`${style.applicationCardStyle}  ${style.marginTop}`}>
                        {/* <CommonMailingAddress label={'Business Mailing Address*'} onChangeAddressLine1={() => { }} placeholderAddressLine1={'123 Street'} maxLengthAddressLine1={25} valueAddressLine1={''}
                            onChangeAddressLine2={() => { }} placeholderAddressLine2={'Apartment 5'} maxLengthAddressLine2={25} valueAddressLine2={''} onChangeCity={() => { }} placeholderCity={'City'} maxLengthCity={25}
                            valueCity={''} onChangeState={() => { }} placeholderState={'Province'} maxLengthState={25} valueState={''} onChangeZipcode={() => { }} placeholderZipcode={'Zipcode'} maxLengthZipcode={15} valueZipcode={''} /> */}
                        {form1 !== undefined && 'applicant' in form1?.properties && (
                            <ApplicationFieldCard object={form1?.properties?.applicant} gridStyle={style.applicantGrid} baseKey={'applicant'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                        <CommonDivider />
                        {form1 !== undefined && 'credentialingPrivilegeCategory' in form1?.properties && (
                            <ApplicationFieldCard object={form1?.properties?.credentialingPrivilegeCategory} gridStyle={style.credentialingGrid} baseKey={'credentialingPrivilegeCategory'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                        <CommonDivider />
                        {form1 !== undefined && 'departmentSpecialty' in form1?.properties && (
                            <ApplicationFieldCard object={form1?.properties?.departmentSpecialty} gridStyle={style.twoCol} baseKey={'departmentSpecialty'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                        {form1 !== undefined && 'regionalCallResponsibilities' in form1?.properties && (
                            <ApplicationFieldCard object={form1?.properties?.regionalCallResponsibilities} gridStyle={style.twoCol} baseKey={'regionalCallResponsibilities'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                        <CommonDivider />
                        {form1 !== undefined && 'billingNumber' in form1?.properties && (
                            <ApplicationFieldCard object={form1?.properties?.billingNumber} gridStyle={style.twoCol} baseKey={'billingNumber'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                        {/*<CommonDivider />
                     <div className={`${style.backgroundCard} ${style.marginTop}`}>
                        <div className={style.cardTitle}>Department / Speciality of Service</div>
                        <div className={style.fourCol}>
                            <div className={`${style.siteDisplayCard} ${style.siteDisplayGrid} ${style.marginTop}`}>
                                <div>
                                    <div className={style.siteDisplayDepartmentTextStyle}>Department of Surgery </div>
                                    <div className={style.siteDisplaySurgeryTextStyle}>Cardiothoracic Surgery</div>
                                    <div className={`${style.siteDisplaySiteTextStyle} ${style.marginTop10}`}>Cambridge Memorial Hospital </div>
                                </div>
                                <DeleteOutlineIcon sx={{ color: '#7165E3', cursor: 'pointer' }} />
                            </div>
                             <div className={`${style.siteDisplayCard} ${style.siteDisplayGrid} ${style.marginTop}`}>
                                <div>
                                    <div className={style.siteDisplayDepartmentTextStyle}>Department of Surgery </div>
                                    <div className={style.siteDisplaySurgeryTextStyle}>General Surgery</div>
                                    <div className={`${style.siteDisplaySiteTextStyle} ${style.marginTop10}`}>Cambridge Memorial Hospital </div>
                                </div>
                                <DeleteOutlineIcon sx={{ color: '#7165E3', cursor: 'pointer' }} />
                            </div> 
                        </div>
                    </div>
                    <CommonDivider />

                    <div className={style.marginTop}>
                        <CommonCheckBox checked={true} onChange={(e) => { }} label="I Have Verified the Information to be Correct, and would like to Proceed with my Application" />
                    </div> */}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleSubmitApplicationReq()}>CONTINUE</div>
                    {/* <div className={style.marginTop}>
                            <ApplicationReferenceDocuments />
                        </div> */}
                </div>
            </div>
            {isOpen && (
                <AIAssistantDialog getIsOpen={getIsOpen} />
            )}
            {isSaveInProgressOpen && (
                <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
            )}
        </div>
    )
}

export default Step1;