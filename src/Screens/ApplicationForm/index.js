import React from 'react'

import style from './index.module.scss'
import ProgressCard from '../../Components/ProgressCard';
import ApplicationHeader from '../../Components/ApplicationHeader';
import ApplicationUserCard from '../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../Components/ApplicationAssistanceCard';
import ApplicationReferenceDocuments from '../../Components/ApplicationReferenceDocuments';
import CommonMailingAddress from '../../Components/CommonFields/CommonMailingAddress';
import CommonDivider from '../../Components/CommonFields/CommonDivider';

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
                        <CommonMailingAddress label={'Business Mailing Address*'} onChangeAddressLine1={() => { }} placeholderAddressLine1={'123 Street'} maxLengthAddressLine1={25} valueAddressLine1={''}
                            onChangeAddressLine2={() => { }} placeholderAddressLine2={'Apartment 5'} maxLengthAddressLine2={25} valueAddressLine2={''} onChangeCity={() => { }} placeholderCity={'City'} maxLengthCity={25}
                            valueCity={''} onChangeState={() => { }} placeholderState={'Province'} maxLengthState={25} valueState={''} onChangeZipcode={() => { }} placeholderZipcode={'Zipcode'} maxLengthZipcode={15} valueZipcode={''} />
                        <CommonDivider />
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