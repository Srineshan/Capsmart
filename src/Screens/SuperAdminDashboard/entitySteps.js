import React, {useState} from 'react';
import EntitySetup from './entitySetup';
import SiteInformation from './siteInformation';
import SiteUser from './siteUsers';
import Billing from './appSubscription';

const EntityStep = () => {
  const [step,setStep] = useState('1');
  return(
    <div>
      {
        step === '1' ? <EntitySetup /> : step === '2' ? <SiteInformation />: step === '3' ? <SiteUser /> : <Billing />
      }
    </div>
  )
}

export default EntityStep;
