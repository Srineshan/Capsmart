import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, Checkbox, FileInput, RadioGroup, Radio } from '@blueprintjs/core';
import { DateInput } from "@blueprintjs/datetime";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {GET, PUT, POST, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import {format} from 'date-fns';
import style from './index.module.scss';

const AddProofOfDocumentation = ({getShowProofDialog, isMultipleContract, contractId}) => {
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
    const [users,setUsers] = useState([]);
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState({});

    useEffect(()=>{
      getUserData();
      getSites();
    },[])

    const getUserData = async() => {
      const {data: userData} = await GET(`user-management-service/user?contractID=${contractId}`);
      if(userData){
        setUsers(userData);
      }
    }

    const getSites = async() => {
      const {data: sites} = await GET('entity-service/sites');
      setSites(sites);
    };

    const handleSites = (value) => {
      if (value !== '0') {
        const tempSelectedSites = sites.filter(data => data?.siteName?.siteName === value).map(data => data)[0];
        setSelectedSite(tempSelectedSites);
      }
    }

    const handleContinue = async () => {
      let data;
      if(!isMultipleContract){
        if(selectedPOD === 'Medical Staff Membership & Privileges' && selectedSite === {}){
          ErrorToaster('Fill in mandatory fields');
          return;
        }
        if(['Liability Insurance Certificate', 'Workers Compensation Insurance Certificate', 'Tail Insurance Coverage Certificate']?.includes(selectedPOD) && selectedInsuranceCarrier === ''){
          ErrorToaster('Fill in mandatory fields');
          return;
        }
         if(['Medical license Certificate', 'Drug Enforcement Administration (DEA) License']?.includes(selectedPOD) && stateOfLicensure === ''){
          ErrorToaster('Fill in mandatory fields');
          return;
        }
         data = selectedPOD === 'Medical Staff Membership & Privileges' ?
        {
          podType: {type: selectedPOD},
          dataMap: {
            dataMap: {
              contractedServiceProvider: users?.[0]?.id,
              privilegingFacility: selectedSite,
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
          podType: {type: selectedPOD},
          dataMap: {
            dataMap: {
              contractedServiceProvider: users?.[0]?.id,
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

      }else{
        if(selectedPOD === 'Medical Staff Membership & Privileges' && contractorName === '' || selectedSite === {}){
          ErrorToaster('Fill in mandatory fields');
          return;
        }
        if(['Primary Speciality Board Certification','Secondary Specialty Board Certification']?.includes(selectedPOD) && contractorName === ''){
          ErrorToaster('Fill in mandatory fields');
          return;
        }
        if(['Liability Insurance Certificate', 'Workers Compensation Insurance Certificate', 'Tail Insurance Coverage Certificate']?.includes(selectedPOD) && selectedInsuranceCarrier === ''){
          ErrorToaster('Fill in mandatory fields');
          return;
        }
         if(['Medical license Certificate', 'Drug Enforcement Administration (DEA) License']?.includes(selectedPOD) && contractorName === '' || stateOfLicensure === ''){
          ErrorToaster('Fill in mandatory fields');
          return;
        }
        if(selectedPOD === 'Controlled Substance DEA Registration Certificate' && contractorName === ''){
          ErrorToaster('Fill in mandatory Fields');
          return;
        }
         data = selectedPOD === 'Medical Staff Membership & Privileges' ?
        {
          podType: {type: selectedPOD},
          dataMap: {
            dataMap: {
              contractor: contractorName,
              privilegingFacility: selectedSite,
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
          podType: {type: selectedPOD},
          dataMap: {
            dataMap: {
              contractor: contractorName,
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
          podType: {type: selectedPOD},
          dataMap: {
            dataMap: {
              contractor : contractorName,
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
          podType: {type: selectedPOD},
          dataMap: {
            dataMap: {
              contractor : contractorName,
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
      }

      let podData = {
        "documentProofs" : [data]
      }

      if(data?.certificateCopyAvailable && fileData === null){
        ErrorToaster('Document missing');
        return;
      }

      const formData = new FormData();
       formData.append('documentationProof', new Blob([JSON.stringify(podData)], {
        type: "application/json"
        }));
        if(data?.certificateCopyAvailable){
          formData.append('documentProofFiles',fileData);
        }else{
          let file = undefined;
          formData.append('documentProofFiles',file);
        }
       await POST(`contract-managment-service/contracts/${contractId}/DocumentationProof`, formData)
       .then(response=>{
         SuccessToaster('Documentation Proof Updated Successfully');
       })
       .catch(error=>{
         ErrorToaster('Unexpected Error Occured');
       })
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
                            {users?.map((data, index) => (
                              <option value={data?.id} key={index}>
                                  {`${data?.name?.firstName} ${data?.name?.lastName}`}
                              </option>
                            ))}
                        </select>
                      </div>
                   </div>
                   <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                     <div className={style.extentionLableStyle}>Privileging Facility*</div>
                     <div className={style.reduce10Left}>
                     <select
                      name="class"
                      id="Class"
                      onChange={(e) => handleSites(e.target.value)}
                      className={`${style.fullWidth} ${style.marginLeft20} `}>
                          <option value="0" >
                            Select Sites
                          </option>
                          {sites?.map((data, index) => (
                            <option key={`${data}-${index}`} value={data?.siteName?.siteName} >
                              {data?.siteName?.siteName}
                            </option>
                          ))}
                      </select>
                       </div>
                 </div>
                </>:
                  <>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Contracted Service Provider*</div>
                      <InputGroup value={users?.length !== 0 ? `${users?.[0]?.name?.firstName} ${users?.[0]?.name?.lastName}` : 'No Users found'} readOnly />
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>{selectedPOD === 'Primary Speciality Board Certification'?'Speciality Board':'Privileging Facility'}*</div>
                        {selectedPOD === 'Primary Speciality Board Certification'? (
                          <InputGroup value={specialityBoardName}
                          onChange={(e) => setSpecialityBoardName(e.target.value)} />
                        ) :
                        (
                        <select
                          name="class"
                          id="Class"
                          onChange={(e) => handleSites(e.target.value)}
                          className={`${style.fullWidth} `}>
                              <option value="0" >
                                Select Sites
                              </option>
                              {sites?.map((data, index) => (
                                <option key={`${data}-${index}`} value={data?.siteName?.siteName} >
                                  {data?.siteName?.siteName}
                                </option>
                              ))}
                          </select>
                        )}
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
                    <InputGroup value={users?.length !== 0 ? `${users?.[0]?.name?.firstName} ${users?.[0]?.name?.lastName}` : 'No Users found'} readOnly />
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
                            {users?.map((data, index) => (
                              <option value={data?.id} key={index}>
                                  {`${data?.name?.firstName} ${data?.name?.lastName}`}
                              </option>
                            ))}
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
                            {users?.map((data, index) => (
                              <option value={data?.id} key={index}>
                                  {`${data?.name?.firstName} ${data?.name?.lastName}`}
                              </option>
                            ))}
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
                          <option value=''>
                            Select State...
                          </option>
                          <option value="California">
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
                            {users?.map((data, index) => (
                              <option value={data?.id} key={index}>
                                  {`${data?.name?.firstName} ${data?.name?.lastName}`}
                              </option>
                            ))}
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
                  <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => {handleContinue(); getShowProofDialog(false)}}>SAVE & EXIT</button>
              </div>
            </div>
        </Dialog>
    )
}

export default AddProofOfDocumentation;
