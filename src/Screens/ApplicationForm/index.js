import React from 'react'

import style from './index.module.scss'
import ProgressCard from '../../Components/ProgressCard';
import ApplicationHeader from '../../Components/ApplicationHeader';
import ApplicationUserCard from '../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../Components/ApplicationAssistanceCard';
import ApplicationReferenceDocuments from '../../Components/ApplicationReferenceDocuments';

const ApplicationForm = () => {
    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={'New {Doctor} {Full Time} Application For {First Last Name}'} />
            <div className={style.screenPadding}>
                <div className={style.applicationScreenGrid}>
                    <ProgressCard step={'STEP 3'} dataType={'Documents and Data'} title={'Proof Of Your Qualifications'} timeNumber={2} timeText={'Min'} />
                    <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
                </div>
                <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                    <div className={style.applicationCardStyle}>

                    </div>
                    <div>
                        <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                        <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                        <div className={`${style.continue} ${style.marginTop10}`}>CONTINUE</div>
                        <div className={style.marginTop}>
                            <ApplicationReferenceDocuments />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApplicationForm;