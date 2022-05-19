import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, Checkbox, Switch, FileInput, RadioGroup, Radio } from '@blueprintjs/core';
import { DateInput } from "@blueprintjs/datetime";
import style from './index.module.scss';

const AddProofOfDocumentation = ({getShowProofDialog, isMultipleContract}) => {
    const [certificateCopyAvbl,setCertificateCopyAvbl] = useState(true);
    const podTypes = ['Medical Staff Membership & Privileges',
                      'Primary Speciality Board Certification',
                      'Secondary Specialty Board Certification',
                      'Liability Insurance Certificate',
                      'Workers Compensation Insurance Certificate',
                      'Tail Insurance Coverage Certificate',
                      'Medical license Certificate',
                      'Drug Enforcement Administration (DEA) License',
                      'Controlled Substance DEA Registration Certificate'];
    const [selectedPOD,setSelectedPOD] = useState('Medical Staff Membership & Privileges');
    const [selectedInsuranceCarrier,setSelectedInsuranceCarrier] = useState('By Entity')
    const podTypesForRadio = ['Liability Insurance Certificate','Workers Compensation Insurance Certificate','Tall Insurance Coverage Certificate'];
    console.log(isMultipleContract)
    const leftElement = () => {
        return(
            <button className={style.chooseFileStyle} >CHOOSE FILE</button>
        )
    }

    return(
        <Dialog isOpen={getShowProofDialog} onClose={() => getShowProofDialog(false)} className={`${style.addManagerDialogBackground} ${style.addProofDialog}`}>
          <div className={`${Classes.DIALOG_BODY} `}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Add Proof Of Documentation</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getShowProofDialog(false)}  />
            </div>

            <div className={style.extensionBorder}></div>
            <div className={style.proofBorder}>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>POD Type*</div>
                <div className={style.reduce10Left}>
                    <select
                        name="class"
                        id="Class"
                        onChange={(e)=>{setSelectedPOD(e.target.value)}}
                        className={`${style.fullWidth} ${style.marginLeft20} `}>
                        {
                          podTypes?.map(data=>(
                            <option value={data} >
                              {data}
                            </option>
                          ))
                        }
                    </select>
                  </div>
            </div>

            {
              selectedPOD === 'Medical Staff Membership & Privileges' ?
              <>
                {isMultipleContract ?
                  <>
                  <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contractor*</div>
                    <div className={style.reduce10Left}>
                        <select
                            name="class"
                            id="Class"
                            className={`${style.fullWidth} ${style.marginLeft20} `}>
                            <option >
                                Select Contractor Name
                            </option>
                        </select>
                      </div>
                   </div>
                   <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                     <div className={style.extentionLableStyle}>Privileging Facility*</div>
                     <div className={style.reduce10Left}>
                         <select
                             name="class"
                             id="Class"
                             className={`${style.fullWidth} ${style.marginLeft20} `}>
                             <option>
                                 Select Name
                             </option>
                         </select>
                       </div>
                 </div>
                </>:
                  <>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Contracted Service Provider*</div>
                      <InputGroup value="Contractor Name" />
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>{selectedPOD === 'Primary Speciality Board Certification'?'Speciality Board':'Privileging Facility'}*</div>
                        <InputGroup value="Name" />
                    </div>
                  </>
                }
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Medical Staff ID</div>
                    <InputGroup value="13578656" />
                </div>
              </>:
              ['Primary Speciality Board Certification','Secondary Specialty Board Certification'].includes(selectedPOD) ?
              <>
              {
                !isMultipleContract?
                <>
                  <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contracted Service Provider*</div>
                    <InputGroup value="Contractor Name" />
                  </div>
                  <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Speciality Board</div>
                      <InputGroup value="Name" />
                  </div>
                </>:
                <>
                  <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Contractor*</div>
                      <div className={style.reduce10Left}>
                          <select
                              name="class"
                              id="Class"
                              className={`${style.fullWidth} ${style.marginLeft20} `}>
                              <option >
                                  Select Contractor Name
                              </option>
                          </select>
                        </div>
                  </div>
                  <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Speciality Board</div>
                      <div className={style.reduce10Left}>
                          <select
                              name="class"
                              id="Class"
                              className={`${style.fullWidth} ${style.marginLeft20} `}>
                              <option >
                                  Select Name
                              </option>
                          </select>
                        </div>
                  </div>
                </>
              }
              <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Specialty Board Certificate ID</div>
                  <InputGroup value="13578656" />
              </div>
              </>:['Liability Insurance Certificate','Workers Compensation Insurance Certificate','Tail Insurance Coverage Certificate'].includes(selectedPOD)?
              <>
               <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                   <div className={style.extentionLableStyle}>Coverage to be provided by*</div>
                   <RadioGroup
                       inline={true}
                       className={`${style.marginTop} ${style.marginLeft20}`}
                       onChange={(e)=>setSelectedInsuranceCarrier(e.target.value)}
                       selectedValue={selectedInsuranceCarrier}
                   >
                       <Radio label="By Contractor" value="By Contractor"  />
                       <Radio label="By Entity" value="By Entity"  />
                   </RadioGroup>
               </div>

               <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                   <div className={style.extentionLableStyle}>Insurance Carrier</div>
                   <InputGroup value="name" />
               </div>
               <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                   <div className={style.extentionLableStyle}>Insurance Certificate ID</div>
                   <InputGroup value="13578656" />
               </div>
             </>
              :['Medical license Certificate','Drug Enforcement Administration (DEA) License'].includes(selectedPOD) ?
              <>
              {
                isMultipleContract &&
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Contractor*</div>
                      <div className={style.reduce10Left}>
                          <select
                              name="class"
                              id="Class"
                              className={`${style.fullWidth} ${style.marginLeft20} `}>
                              <option >
                                  Select Contractor Name
                              </option>
                          </select>
                        </div>
                  </div>
                }
                 <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>State of Licensure*</div>
                  <div className={style.reduce10Left}>
                      <select
                          name="class"
                          id="Class"
                          className={`${style.fieldWidth2InARow} ${style.marginLeft20} `}>
                          <option >
                              California
                          </option>
                      </select>
                    </div>
                  </div>
                  <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>License ID</div>
                      <InputGroup value="13578656" />
                  </div>
                </>
               :selectedPOD === 'Controlled Substance DEA Registration Certificate' && (
                 <>
                   {isMultipleContract &&
                     <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                          <div className={style.extentionLableStyle}>Contractor*</div>
                          <div className={style.reduce10Left}>
                              <select
                                  name="class"
                                  id="Class"
                                  className={`${style.fullWidth} ${style.marginLeft20} `}>
                                  <option >
                                      Select Contractor Name
                                  </option>
                              </select>
                            </div>
                      </div>
                   }
                   <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Certificate ID</div>
                    <InputGroup value="13578656" />
                </div>
                 </>
               )
            }

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>{selectedPOD === 'Medical Staff Membership & Privileges' ? 'Membership Renewal Date' : 'Expiration Date'}*</div>
                    <DateInput
                        formatDate={date => date.toLocaleString()}
                        parseDate={str => new Date(str)}
                        placeholder={"MM-DD-YYYY"}
                    />
                </div>

            <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Certificate Copy Available</div>
                  <div className={`${style.displayInRow} `}>
                    <Switch checked={certificateCopyAvbl} label={certificateCopyAvbl ? 'YES' : "NO"} className={`${style.marginTop} ${style.textAlignLeft}`} onChange={() => setCertificateCopyAvbl(!certificateCopyAvbl)}  />
                    <InputGroup  leftElement={leftElement()} className={`${style.fullWidth} ${style.marginLeft50}`} />
                  </div>
                </div>
                </div>
              </div>
              <div className={`${style.floatRight} ${style.marginTop20}`}>
                  <button className={`${style.buttonStyle} ${style.marginLeft20}`} >ADD MORE</button>
                  <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE & EXIT</button>
              </div>
            </div>
        </Dialog>
    )
}

export default AddProofOfDocumentation;
