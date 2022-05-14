import React, { useState } from 'react';
import { Icon, Intent } from "@blueprintjs/core";
import style from './index.module.scss';

const AddContract = ({getAddContract}) => {
    const [selectedContract, setSelectedContract] = useState('Select...');
    const [selectedContractOnClick, setSelectedContractOnClick] = useState(false);
    return(
        <div className={`${style.welcomePadding} ${style.addContractBody}`}>
            <div className={style.spaceBetween}>
                <p className={style.welcomeStyle}>Welcome to the Add Contract Wizard</p>
                <Icon icon="cross" size={25} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getAddContract(false)}  />
            </div>
            <div className={style.welcomeBorder}></div>
            <div className={style.welcomeMessage}>
            Help lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus quam 
            nec tellus dictum, vitae ultrices urna porttitor. donec commodo tellus dapibus 
            semper mattis. aenean ut massa vitae tortor consequat tristique. etiam eget 
            condimentum sapien. morbi est ante, sagittis ac rhoncus eget, faucibus ut felis. 
            pellentesque iaculis aliquam massa. lorem ipsum dolor sit amet, consectetur 
            adipiscing elit. sed finibus quam nec tellus dictum.
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
                    <div className={`${style.contractCards} ${selectedContractOnClick && style.selectedContractCard}`} onClick={() => setSelectedContractOnClick(true)}>
                        <div className={style.alignCenter}>
                            <div>
                                <div className={style.contractCardImage}>

                                </div>
                                <div className={`${style.contractCardData} ${selectedContract === 'New Contract with No Prior Contract(s) with Entity' ? style.activeContractText : ''}`}>
                                Individual Contractor Contract
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.contractCards}>
                        <div className={style.alignCenter}>
                            <div>
                                <div className={style.contractCardImage}>

                                </div>
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
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                            tempor incididunt ut labore,
                            <span className={`${style.blueColor} ${style.marginLeft20}`}> 
                            quis nostrud xercitation ullamco laboris nisi 
                            ut aliquip ex ea commodo consequat
                            </span>
                        </p>  
                    </div>
                )}
            </div>
            <div className={style.nextButtonPosition}>
                <button className={style.nextButton}>NEXT</button>
            </div>
        </div>
    )
}

export default AddContract;