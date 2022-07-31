import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, Checkbox, FileInput, RadioGroup, Radio } from '@blueprintjs/core';
import { DateInput } from "@blueprintjs/datetime";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {GET, PUT, POST, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import {format} from 'date-fns';
import style from './index.module.scss';

const AddProofOfDocumentation = ({getShowProofDialog, isMultipleContract}) => {
    const contractId = 'e96eca5e-40cd-47b8-b1cc-c5cb4be9fdbf';
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
    const [contractorName, setContractorName] = useState('');
    const [privilegingFacilityName, setPrivilegingFacilityName] = useState('');
    const [contractedServiceProviderName, setContractedServiceProviderName] = useState('');
    const [specialityBoardName, setSpecialityBoardName] = useState('');
    const [medicalStaffId, setMedicalStaffId] = useState('');
    const [specialityBoardCertificateId, setSpecialityBoardCertificateId] = useState('');
    const [insuranceCarrierName, setInsuranceCarrierName] = useState('');
    const [insuranceCertificateId, setInsuranceCertificateId] = useState('');
    const [stateOfLicensure, setStateOfLicensure] = useState('');
    const [licenseId, setLicenseId] = useState('');
    const [certificateId, setCertificateId] = useState('');
    const [membershipRenewalDate, setmembershipRenewalDate] = useState(new Date());
    const [expirationDate, setExpirationDate] = useState(new Date());
    const [fileName, setFileName] = useState('');
    const [fileData, setFileData] = useState(null);

    const handleContinue = async () => {
      console.log('entered')
      const data = selectedPOD === 'Medical Staff Membership & Privileges' ?
      {
        podType: {type: selectedPOD},
        dataMap: {
          dataMap: {
            contractedServiceProvider: contractedServiceProviderName,
            privilegingFacility: privilegingFacilityName,
            medicalStaffId: medicalStaffId,
          }
        },
        expirationDate: {date: format(membershipRenewalDate, 'yyyy-MM-dd').toString()},
        file: {
        filePath: "",
        fileName: fileName
          },
        certificateCopyAvailable: certificateCopyAvbl
      } : selectedPOD === 'Primary Speciality Board Certification' || 'Secondary Specialty Board Certification' ?
      {
        // id: contractId,
        podType: {type: selectedPOD},
        dataMap: {
          dataMap: {
            contractedServiceProvider: contractedServiceProviderName,
            specialityBoard: specialityBoardName,
            specialityBoardCertificateId: specialityBoardCertificateId,
          }
        },
        expirationDate: {date: format(membershipRenewalDate, 'yyyy-MM-dd').toString()},
        file: {
        filePath: "",
        fileName: fileName
          },
        certificateCopyAvailable: certificateCopyAvbl
      } : selectedPOD === 'Liability Insurance Certificate' || 'Workers Compensation Insurance Certificate' || 'Tail Insurance Coverage Certificate' ?
      {
        // id: contractId,
        podType: {type: selectedPOD},
        dataMap: {
          dataMap: {
            coverageToBeProvidedBy: selectedInsuranceCarrier,
            insuranceCarrier: insuranceCarrierName,
            insuranceCertificateId: insuranceCertificateId,
          }
        },
        expirationDate: {date: format(membershipRenewalDate, 'yyyy-MM-dd').toString()},
        file: {
        filePath: "",
        fileName: fileName
          },
        certificateCopyAvailable: certificateCopyAvbl
      } : selectedPOD === 'Medical license Certificate' || 'Drug Enforcement Administration (DEA) License' ?
      {
        // id: contractId,
        podType: {type: selectedPOD},
        dataMap: {
          dataMap: {
            stateOfLicensure: stateOfLicensure,
            licenseId: licenseId,
          }
        },
        expirationDate: {date: format(membershipRenewalDate, 'yyyy-MM-dd').toString()},
        file: {
        filePath: "",
        fileName: fileName
          },
        certificateCopyAvailable: certificateCopyAvbl
      } : selectedPOD === 'Controlled Substance DEA Registration Certificate' ?
      {
        // id: contractId,
        podType: {type: selectedPOD},
        dataMap: {
          dataMap: {
            certificateId: certificateId,
          }
        },
        expirationDate: {date: format(membershipRenewalDate, 'yyyy-MM-dd').toString()},
        file: {
        filePath: "",
        fileName: fileName
          },
        certificateCopyAvailable: certificateCopyAvbl
      } : '';
      console.log('data',data);

      let podData = {
        "documentProofs" : [data]
      }

     //  const formData = new FormData();
     //  let file = fullyExecutedContractData?.map(data=>data.file);
     //   formData.append('contractDetail', new Blob([JSON.stringify(data)], {
     //        type: "application/json"
     //    }));
     //   formData.append('contractFiles',file);
     //   await POST('contract-managment-service/contracts/contractDetail',formData)
     //   .then(response=>{getContractId(response);
     //   SuccessToaster('Contract Created Successfully');
     // }).catch(error=>{
     //   ErrorToaster('Unexpected Error Creating Contract');
     // })

      const formData = new FormData();
       formData.append('documentationProof', new Blob([JSON.stringify(podData)], {
        type: "application/json"
        }));
       formData.append('documentProofFiles',fileData);
       console.log('formdata',formData);
       const response = await POST(`contract-managment-service/contracts/${contractId}/DocumentationProof`, formData);
       if(response){
           SuccessToaster('Documentation Proof Updated Successfully');
       }
       else {
           ErrorToaster('Unexpected Error');
       }
      console.log('data',formData);
    }

    const handleFileUpload = (e) => {
      setFileData(e.target.files[0]);
      setFileName(e.target.files[0]?.name);
    }

    console.log(isMultipleContract)
    const leftElement = () => {
        return(
          <div>
            <label for="file-upload"  className={style.customFileUpload}>
                Choose File
            </label>
            <input id="file-upload" type="file" onChange={(e)=> handleFileUpload(e)}/>
          </div>
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
                            value={contractorName}
                            onChange={(e) => setContractorName(e.target.value)}
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
                             value={privilegingFacilityName}
                             onChange={(e) => setPrivilegingFacilityName(e.target.value)}
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
                      <InputGroup value={contractedServiceProviderName} onChange={(e) => setContractedServiceProviderName(e.target.value)} />
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>{selectedPOD === 'Primary Speciality Board Certification'?'Speciality Board':'Privileging Facility'}*</div>
                        <InputGroup value={selectedPOD === 'Primary Speciality Board Certification'? specialityBoardName : privilegingFacilityName}
                        onChange={(e) => selectedPOD === 'Primary Speciality Board Certification'? setSpecialityBoardName(e.target.value) : setPrivilegingFacilityName(e.target.value)} />
                    </div>
                  </>
                }
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Medical Staff ID</div>
                    <InputGroup value={medicalStaffId} onChange={(e) => setMedicalStaffId(e.target.value)} />
                </div>
              </>:
              ['Primary Speciality Board Certification','Secondary Specialty Board Certification'].includes(selectedPOD) ?
              <>
              {
                !isMultipleContract?
                <>
                  <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contracted Service Provider*</div>
                    <InputGroup value={contractedServiceProviderName} onChange={(e) => setContractedServiceProviderName(e.target.value)} />
                  </div>
                  <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Speciality Board</div>
                      <InputGroup value={specialityBoardName} onChange={(e) => setSpecialityBoardName(e.target.value)} />
                  </div>
                </>:
                <>
                  <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Contractor*</div>
                      <div className={style.reduce10Left}>
                          <select
                              name="class"
                              id="Class"
                              value={contractorName}
                              onChange={(e) => setContractorName(e.target.value)}
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
                              value={specialityBoardName}
                              onChange={(e) => setSpecialityBoardName(e.target.value)}
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
                  <InputGroup value={specialityBoardCertificateId} onChange={(e) => setSpecialityBoardCertificateId(e.target.value)} />
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
                   <InputGroup value={insuranceCarrierName} onChange={(e)=>setInsuranceCarrierName(e.target.value)} />
               </div>
               <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                   <div className={style.extentionLableStyle}>Insurance Certificate ID</div>
                   <InputGroup value={insuranceCertificateId} onChange={(e)=>setInsuranceCertificateId(e.target.value)} />
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
                              value={contractorName}
                              onChange={(e) => setContractorName(e.target.value)}
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
                          value={stateOfLicensure}
                          onChange={(e) => setStateOfLicensure(e.target.value)}
                          className={`${style.fieldWidth2InARow} ${style.marginLeft20} `}>
                          <option >
                              California
                          </option>
                      </select>
                    </div>
                  </div>
                  <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>License ID</div>
                      <InputGroup value={licenseId} onChange={(e) => setLicenseId(e.target.value)} />
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
                                  value={contractorName}
                                  onChange={(e) => setContractorName(e.target.value)}
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
                    <InputGroup value={certificateId} onChange={(e) => setCertificateId(e.target.value)} />
                </div>
                 </>
               )
            }

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>{selectedPOD === 'Medical Staff Membership & Privileges' ? 'Membership Renewal Date' : 'Expiration Date'}*</div>
                    <DateInput
                        formatDate={date => date.toLocaleDateString()}
                        parseDate={str => new Date(str)}
                        placeholder={"MM-DD-YYYY"}
                        value={membershipRenewalDate}
                        onChange={(e) => setmembershipRenewalDate(e)}
                    />
                </div>

            <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Certificate Copy Available</div>
                  <div className={`${style.displayInRow} `}>
                    <FormControlLabel
                        control={
                          <Switch checked={certificateCopyAvbl} className={`${style.textAlignLeft}`} onChange={() => setCertificateCopyAvbl(!certificateCopyAvbl)}  />
                        }
                        className={`${style.switchFontStyle} ${style.flexLeft}`}
                        label={certificateCopyAvbl ? 'YES' : "NO"}
                    />
                    <InputGroup value={fileName}  leftElement={leftElement()} className={`${style.fullWidth}`} />
                  </div>
                </div>
                </div>
              </div>
              <div className={`${style.floatRight} ${style.marginTop20}`}>
                  <button className={`${style.buttonStyle} ${style.marginLeft20}`} >ADD MORE</button>
                  <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => handleContinue()}>SAVE & EXIT</button>
              </div>
            </div>
        </Dialog>
    )
}

export default AddProofOfDocumentation;
