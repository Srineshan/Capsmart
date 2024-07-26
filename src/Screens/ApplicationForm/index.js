import React, { useEffect, useState } from 'react'
import ProgressCard from '../../Components/ProgressCard';
import ApplicationHeader from '../../Components/ApplicationHeader';
import ApplicationUserCard from '../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../Components/ApplicationAssistanceCard';
import ApplicationReferenceDocuments from '../../Components/ApplicationReferenceDocuments';
import CommonMailingAddress from '../../Components/CommonFields/CommonMailingAddress';
import CommonDivider from '../../Components/CommonFields/CommonDivider';
import { GET } from '../dataSaver';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ApplicationFieldCard from '../../Components/ApplicationFieldCard';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';

import style from './index.module.scss'
import Step1 from './Step1';
import { useParams } from 'react-router-dom';
import Step2 from './Step2';
import Step3 from './Step3';


const ApplicationForm = () => {
    const { section, step } = useParams();
    const [basicForm, setBasicForm] = useState({})

    useEffect(() => {
        getPreApplication()
    }, [])

    const getPreApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/${`669f8d8a3c6ad75864d2ec8d`}`
        );
        setBasicForm(basicForm)
    }

    const StepDisplay = () => {
        switch (step) {
            case 'step1':
                return <Step1 basicForm={basicForm} setBasicForm={setBasicForm} />;
            case 'step2':
                return <Step2 basicForm={basicForm} setBasicForm={setBasicForm} />;
            case 'step3':
                return <Step3 basicForm={basicForm} setBasicForm={setBasicForm} />;
            // Add cases for other steps
            default:
                return <div>Step not found</div>;
        }
    };

    console.log(section, step)

    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={'New {Doctor} {Full Time} Application For {First Last Name}'} />
            <div className={style.screenPadding}>
                {StepDisplay()}
            </div>
        </div>
    )
}

export default ApplicationForm;