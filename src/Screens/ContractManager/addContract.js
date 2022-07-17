import React, { useState, useEffect} from 'react';
import { Icon, Intent } from "@blueprintjs/core";
import Doctor from './../../images/doctor.png';
import DoctorTeam from './../../images/doctorTeam.png';
import HighlightedDoctor from './../../images/highlightedDoctor.png';
import style from './index.module.scss';

const AddContract = ({getAddContract, getNewContract, getContractType}) => {
    const [selectedContract, setSelectedContract] = useState('Select...');
    const [selectedContractOnClick, setSelectedContractOnClick] = useState(false);
    const [contractType, setContractType] = useState('Individual Contractor');

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
                        value={selectedContract || 'Select...'}
                        onChange={(e) => setSelectedContract(e.target.value)}
                        className={`${style.textFieldWidth} ${style.marginLeft20}`}>
                            <option value="0" >
                             Select...
                            </option>
                            <option value="New Contract with No Prior Contract(s) with Entity" >
                            New Contract with No Prior Contract(s) with Entity
                            </option>
                            <option value="Contracted Services Continuation Renewal Contract">
                            Contracted Services Continuation Renewal Contract
                            </option>
                        </select>
                </div>
                <div className={style.displayInRow}>
                    <div className={`${style.contractCards} ${contractType === "Individual Contractor" && style.selectedContractCard}`} onClick={() => {setSelectedContractOnClick(true);setContractType('Individual Contractor')}}>
                        <div className={style.alignCenter}>
                            <div>
                                <img src={selectedContractOnClick ? HighlightedDoctor : Doctor} alt="doctor" className={`${style.contractCardImage} ${style.alignCenter} ${selectedContract === 'New Contract with No Prior Contract(s) with Entity' ? '' : style.reducedOpacity}`} />
                                <div className={`${style.contractCardData} ${selectedContract === 'New Contract with No Prior Contract(s) with Entity' ? style.activeContractText : ''}`}>
                                Individual Contractor Contract
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.contractCards} ${contractType === "Multiple Contractor" && style.selectedContractCard}`} onClick={() => setContractType('Multiple Contractor')}>
                        <div className={style.alignCenter}>
                            <div>
                                <img src={DoctorTeam} alt="doctor" className={`${style.contractCardImage} ${style.alignCenter} ${selectedContract === 'New Contract with No Prior Contract(s) with Entity' ? '' : style.reducedOpacity}`} />
                                <div className={`${style.contractCardData} ${selectedContract === 'New Contract with No Prior Contract(s) with Entity' ? style.activeContractText : ''}`}>
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
                <button className={style.nextButton} onClick={() => {getNewContract(true);getAddContract(false);getContractType(contractType)}}>NEXT</button>
            </div>
        </div>
    )
}

export default AddContract;
