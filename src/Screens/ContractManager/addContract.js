import React, { useState, useEffect} from 'react';
import { Icon, Intent } from "@blueprintjs/core";
import Doctor from './../../images/doctor.png';
import DoctorTeam from './../../images/doctorTeam.png';
import HighlightedDoctor from './../../images/highlightedDoctor.png';
import style from './index.module.scss';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

const AddContract = ({getAddContract, getNewContract, getContractType, getSelectedContractType, getMethod}) => {
    const [selectedContract, setSelectedContract] = useState('0');
    const [selectedContractOnClick, setSelectedContractOnClick] = useState(false);
    const [contractType, setContractType] = useState('INDIVIDUAL');


    const handleNext = () => {
      if(selectedContract === '0'){
        ErrorToaster('Select a contract type to add');

      }
      else{
        getMethod('POST')
        getNewContract(true);
        getAddContract(false);
        getContractType(contractType);
        getSelectedContractType(selectedContract);
      }
    }

    console.log('type',contractType,selectedContract);

    return(
        <div className={`${style.welcomePadding} ${style.addContractBody}`}>
            <div className={style.spaceBetween}>
                <p className={style.welcomeStyle}>Welcome to the Add Contract Wizard</p>
                <Icon icon="cross" size={25} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getAddContract(false)}  />
            </div>
            <div className={style.welcomeBorder}></div>
            <div className={style.welcomeMessage}>
            Welcome to the TimeSmart.AI Contract Manager Wizard.  Please select the appropriate
             option from the drop down menu below, and whether this is an Individual Contractor
              Agreement or Multiple Contractor Agreement.
            </div>
            <div className={style.contractOptions}>
                <div className={style.displayInRow}>
                    <p className={style.selectLable}>Select the Contract type to add</p>
                        <select
                        name="class"
                        id="Class"
                        value={selectedContract || '0'}
                        onChange={(e) => setSelectedContract(e.target.value)}
                        className={`${style.textFieldWidth} ${style.marginLeft20}`}>
                            <option value="0" >
                             Select...
                            </option>
                            <option value="New Contract" >
                            New Contract with No Prior Contract(s) with Entity
                            </option>
                            <option value="Renewal Contract">
                            Contracted Services Continuation Renewal Contract
                            </option>
                        </select>
                </div>
                <div className={style.displayInRow}>
                    <div className={`${style.contractCards} ${contractType === "INDIVIDUAL" && style.selectedContractCard}`} onClick={() => {setSelectedContractOnClick(true);setContractType('INDIVIDUAL')}}>
                        <div className={style.alignCenter}>
                            <div>
                                <img src={selectedContractOnClick ? HighlightedDoctor : Doctor} alt="doctor" className={`${style.contractCardImage} ${style.alignCenter} ${selectedContract === 'New Contract' ? '' : style.reducedOpacity}`} />
                                <div className={`${style.contractCardData} ${selectedContract !== '0' ? style.activeContractText : ''}`}>
                                Individual Contractor Contract
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.contractCards} ${contractType === "MULTIPLE" && style.selectedContractCard}`} onClick={() => setContractType('MULTIPLE')}>
                        <div className={style.alignCenter}>
                            <div>
                                <img src={DoctorTeam} alt="doctor" className={`${style.contractCardImage} ${style.alignCenter} ${selectedContract === 'New Contract' ? '' : style.reducedOpacity}`} />
                                <div className={`${style.contractCardData} ${selectedContract !== '0' ? style.activeContractText : ''}`}>
                                Multiple Contractor Contract
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {selectedContractOnClick && (
                    <div className={style.descriptionBoxStyle}>
                        <p className={style.descriptionStyle}>
                            After selecting one of the options above and clicking Next, you will be guided through
                            <span className={`${style.blueColor} ${style.marginLeft20}`}>
                            the Contracts Manager wizard to help upload contracts and assign the appropriate
                            metadata.
                            </span>
                        </p>
                    </div>
                )}
            </div>
            <div className={`${style.nextButtonPosition} ${style.marginTop20}`}>
                <button className={style.nextButton} onClick={() => {handleNext()}}>NEXT</button>
            </div>
        </div>
    )
}

export default AddContract;
