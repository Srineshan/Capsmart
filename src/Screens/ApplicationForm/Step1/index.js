import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import { GET } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';

import style from './index.module.scss';

const Step1 = ({ basicForm, setBasicForm }) => {
    const [form1, setForm1] = useState();
    const [form2, setForm2] = useState();
    const navigate = useNavigate()
    useEffect(() => {
        getBasicForm()
    }, [])

    const getBasicForm = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/preApplication/basicForm`
        );
        if (basicForm) {
            const { data: form1 } = await GET(
                `application-management-service/formSchema/${basicForm?.generalSchemas?.[0]?.id}`
            );
            let temp = form1;
            if (temp.properties.applicant.properties !== null) {
                delete temp.properties.applicant.properties['letterOfInterest']
                delete temp.properties.applicant.properties['curriculumVitae']
            }
            setForm1(form1)
            const { data: form2 } = await GET(
                `application-management-service/formSchema/${basicForm?.generalSchemas?.[1]?.id}`
            );
            console.log(form2)
            setForm2(form2)
        }
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 1'} dataType={'Prepare your requirements'} title={'Verify Your Information'} timeNumber={1} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div className={style.applicationCardStyle}>
                    {/* <CommonMailingAddress label={'Business Mailing Address*'} onChangeAddressLine1={() => { }} placeholderAddressLine1={'123 Street'} maxLengthAddressLine1={25} valueAddressLine1={''}
                            onChangeAddressLine2={() => { }} placeholderAddressLine2={'Apartment 5'} maxLengthAddressLine2={25} valueAddressLine2={''} onChangeCity={() => { }} placeholderCity={'City'} maxLengthCity={25}
                            valueCity={''} onChangeState={() => { }} placeholderState={'Province'} maxLengthState={25} valueState={''} onChangeZipcode={() => { }} placeholderZipcode={'Zipcode'} maxLengthZipcode={15} valueZipcode={''} /> */}
                    {form1 !== undefined && 'applicant' in form1?.properties && (
                        <ApplicationFieldCard object={form1?.properties?.applicant} gridStyle={style.twoCol} baseKey={'applicant'} basicForm={basicForm} setBasicForm={setBasicForm} />
                    )}
                    <CommonDivider />
                    {form1 !== undefined && 'service' in form1?.properties && (
                        <ApplicationFieldCard object={form1?.properties?.service} gridStyle={style.twoCol} baseKey={'service'} basicForm={basicForm} setBasicForm={setBasicForm} />
                    )}
                    <CommonDivider />
                    <div className={`${style.backgroundCard} ${style.marginTop}`}>
                        <div className={style.cardTitle}>Added Sites</div>
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
                    {form2 !== undefined && 'natureOfPractice' in form2?.properties && (
                        <ApplicationFieldCard object={form2?.properties?.natureOfPractice} gridStyle={style.twoCol} baseKey={'natureOfPractice'} basicForm={basicForm} setBasicForm={setBasicForm} />
                    )}
                    <CommonDivider />
                    {form2 !== undefined && 'regionalCallResponsibilities' in form2?.properties && (
                        <ApplicationFieldCard object={form2?.properties?.regionalCallResponsibilities} gridStyle={style.twoCol} baseKey={'regionalCallResponsibilities'} basicForm={basicForm} setBasicForm={setBasicForm} />
                    )}
                    <CommonDivider />
                    <div className={style.marginTop}>
                        <CommonCheckBox checked={true} onChange={(e) => { }} label="I HAVE VERIFIED THE INFORMATION" />
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/applicationForm/section1/step2')}>CONTINUE</div>
                    {/* <div className={style.marginTop}>
                            <ApplicationReferenceDocuments />
                        </div> */}
                </div>
            </div>
        </div>
    )
}

export default Step1;