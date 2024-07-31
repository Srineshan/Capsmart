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
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Step7 from './Step7';
import Step8 from './Step8';
import Step9 from './Step9';
import Step10 from './Step10';


const ApplicationForm = () => {
    const { section, step } = useParams();
    const [basicForm, setBasicForm] = useState({})

    useEffect(() => {
        getPreApplication()
    }, [])

    const getPreApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/${`66a9d13792a3ce59d5bf166b`}`
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
            case 'step4':
                return <Step4 basicForm={basicForm} setBasicForm={setBasicForm} />;
            case 'step5':
                return <Step5 basicForm={basicForm} setBasicForm={setBasicForm} />;
            case 'step6':
                return <Step6 basicForm={basicForm} setBasicForm={setBasicForm} />;
            case 'step7':
                return <Step7 basicForm={basicForm} setBasicForm={setBasicForm} />;
            // case 'step8':
            //     return <Step8 basicForm={basicForm} setBasicForm={setBasicForm} />;
            // case 'step9':
            //     return <Step9 basicForm={basicForm} setBasicForm={setBasicForm} />;
            // case 'step10':
            //     return <Step10 basicForm={basicForm} setBasicForm={setBasicForm} />;
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