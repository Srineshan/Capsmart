import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TextArea, InputGroup, Icon, TagInput, Checkbox, FileInput, EditableText, Divider } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DateInput } from "@blueprintjs/datetime";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DatalistInput from 'react-datalist-input';
import {GET,PUT,POST,role,TenantID} from './../dataSaver';
import AddNewContractManager from './addNewContractManager';
import {Auth} from './../../utils/auth'
import {format} from 'date-fns';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import axios from 'axios';

import style from './index.module.scss';

const VALUES = ['Site 1', "Site 2"];
const VALUES2 = ['Department 1', "Department 2", "Department 3"];
const ContractIdTermLimitIndividual = ({contracts, getViewPage1, getViewPage2, getCurrentPage, contractType, selectedContractType, getContractId, setName, setFileFields, fileData, contractIdFromActive, method, isMultiSiteEntity}) => {
    const [selectContractManager, setSelectContractManager] = useState();
    const [siteSpecific, setSiteSpecific] = useState(false);
    const [selectedContract, setSelectedContract] = useState('Select...');
    const [selectedContractContinuationPolicy, setSelectedContractContinuationPolicy] = useState('Select Value');
    const [item, setItem] = useState();
    const [contractData, setContractData] = useState();
    const [addNewManagerDialog, setAddNewManagerDialog] = useState(false);
    const [priorContractItem, setPriorContractItem] = useState();
    const [fullyExecutedContract, setFullyExecutedContract] = useState(false);
    const [fullyExecutedContractData,setFullyExecutedContractData] = useState(fileData);
    const [fileFieldData,setFileFieldData] = useState({id:'',type:'',name:'',desc:'',fileName:'',file:null,filePath:''});
    const [files,setFiles] = useState([]);
    const [departmentSpecific, setDepartmentSpecific] = useState(false);
    const [tags, setTags] = useState(VALUES);
    const [tagSet2, setTagSet2] = useState(VALUES2);
    const [contractTermPeriodFrom, setContractTermPeriodFrom] = useState(null);
    const [contractTermPeriodTo, setContractTermPeriodTo] = useState(null);
    const [contractEffectiveDate, setContractEffectiveDate] = useState(null);
    const [contractName,setContractName] = useState('');
    const [contractId,setContractId] = useState({id:'',missing:false});
    const [contractPriorId,setContractPriorId] = useState({id:'',na:false});
    const [contractNA,setContractNA] = useState(false);
    const [user,setUsers] = useState([]);
    const [selectedItem,setSelectedItem] = useState();
    const [sites,setSites] = useState();
    const [selectedSites,setSelectedSites] = useState([]);
    const [autoRenewal,setAutoRenewal] = useState({renewalTerm:'0',allowableRenewalTerm:'0',calendar:'WEEKS'});
    const [renewalReminder,setRenewalreminder] = useState([{'days':0}]);
    const [reminderFields,setReminderFields] = useState([]);
    const [documentFields,setDocumentFields] = useState([]);
    const [userName, setUserName] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [addFileClicked,setAddFileClicked] = useState(false);
    const [selectedDepartmentSites,setSelectedDepartmentSites] = useState([]);
    const [selectedSite,setSelectedSite] = useState('');
    const [departmentsName,setDepartmentsName] = useState([]);
    const [selectedDepartmentId,setSelectedDepartmentId] = useState([]);
    const [createdContractId,setCreatedContractId] = useState(contractIdFromActive);

    useEffect(() => {
      getUserData();
      getSites();
      if(method !== 'POST'){
        getContractDetail();
      }
    },[])

    useEffect(()=>{
      getReminder();
    },[renewalReminder])

    useEffect(()=>{
      getContractDetail();
      getContractId(createdContractId);
    },[createdContractId])

    useEffect(()=>{
      setFullyExecutedContractData(fileData);
    },[fileData])

    useEffect(()=>{
      setFileFields(fullyExecutedContractData);
    },[fullyExecutedContractData])


    const getContractDetail = async() => {
      const {data: contractData} = await GET(`contract-managment-service/contracts/${createdContractId}/contractDetail`);
      if(contractData){
        let contractDetail = contractData?.contractDetail;
        setContractData(contractData?.contractDetail);
        setName(contractData?.contractName?.contractName || '');
        setContractName(contractData?.contractName?.contractName);
        setContractId({id:contractDetail?.contractId?.id,missing:contractData?.contractIdMissing});
        setDepartmentSpecific(contractDetail?.departmentSpecificContract);
        setSiteSpecific(contractDetail?.siteSpecificContract);
        setFullyExecutedContract(contractDetail?.fullyExecutedContract);
        setSelectContractManager(user?.filter(data=>data?.id === contractDetail?.contractManager?.userID)?.map(data=>data)[0]);
        setContractPriorId({id:contractDetail?.priorContract?.id,na:contractDetail?.priorContract?.notApplicable});
        setContractTermPeriodFrom(contractDetail?.contractTerm?.startDate !== null ? new Date(contractDetail?.contractTerm?.startDate) : null);
        setContractTermPeriodTo(contractDetail?.contractTerm?.endDate  !== null ? new Date(contractDetail?.contractTerm?.endDate) : null );
        setContractEffectiveDate(contractDetail?.contractTerm?.effectiveDate  !== null ? new Date(contractDetail?.contractTerm?.effectiveDate) : null);
        setSelectedContractContinuationPolicy(contractDetail?.continuationPolicy?.contractPolicyType);
        let continuation = contractDetail?.continuationPolicy?.autoRenewalPeriod;
        setAutoRenewal({renewalTerm:continuation?.autoRenewalTerm?.term.toString(),allowableRenewalTerm:continuation?.allowableAutoRenewalTerm?.term.toString(),calendar:continuation?.autoRenewalCalender})
        setRenewalreminder(contractDetail?.continuationPolicy?.reminderList?.renewalReminderList);
        let fileData = [];
        contractDetail?.contractFiles?.map(data=>{
          fileData.push({id:data?.id, type:data?.documentType,name:data?.documentName,desc:data?.documentDescription,fileName:data?.fileName,file:null,filePath:data?.fileURL})
        })
        if(fullyExecutedContractData?.length === 0){
          setFullyExecutedContractData(fileData);
        }
        if(contractDetail?.siteSpecificContract && !contractDetail?.departmentSpecificContract){
          setSelectedSites(contractDetail?.site?.sites || []);
        }
        else if(contractDetail?.siteSpecificContract && contractDetail?.departmentSpecificContract){
          let deptTemp = [];
          let temp = contractDetail?.site?.sites;
          contractDetail?.site?.sites?.map(data=>{
            data.departmentList?.departments?.map(dept=>{
                deptTemp.push({id:dept?.id, name: dept?.departmentName?.name, site_id: data?.id});
            })
          })
          setSelectedDepartmentSites(deptTemp || []);

          temp?.map(data=>{
            data.departmentList.departments = sites?.filter(site=>site?.id === data?.id)?.map(site=>site?.departmentList?.departments)?.[0];
          })
          setSelectedSites(temp);
        }
        else{
          console.log('No data');
        }
      }
    }

    const getUserData = async() => {
      const {data: user} = await GET('user-management-service/user/role?role=Contract Manager');
      if(user){
        setUsers(user);
      }
    }

    const getSites = async () => {
      const {data:sites} = await GET('entity-service/sites');
      if(sites){
        setSites(sites);
    }
  }

      const getAddNewManagerDialog = (value) => {
        setAddNewManagerDialog(value);
    }

    const handleFileUpload = (e) => {
      setFileFieldData({...fileFieldData, file: e.target.files[0], fileName: e.target.files?.[0]?.name});
    }

    const getSiteData = () => {
      let siteData = [];

      if(!siteSpecific && !departmentSpecific){
        siteData = sites;
      }else if(siteSpecific && !departmentSpecific){
        siteData = selectedSites;
      }else{
        let temp = selectedSites;
        temp?.map(data=>{
          let departments = [];
          let siteDepartments = selectedDepartmentSites?.filter(dept=>dept?.site_id === data?.id)?.map(data=>data);
          if(siteDepartments?.length !== 0){
            siteDepartments?.map(dept=>{
              departments?.push({id:dept?.id,departmentHead:{id:dept?.name},departmentName:{name:dept?.name}})
            })
            data.departmentList.departments = departments;
          }
        })
        siteData = temp;
      }
      return siteData;
    }


    const addContract = async() => {
      if(selectedContractContinuationPolicy === 'Select Value'){
        ErrorToaster('Select Contract Continuation Policy');
        return;
      }
      let contractFiles = [];
      fullyExecutedContract && fullyExecutedContractData?.map(data=>{
        contractFiles?.push({
          filePath:data.filePath,
          fileName:data.fileName,
          documentType:data.type,
          documentDescription:data.desc,
          documentName:data.name,
        })
      })


      let data = {
        ...(createdContractId !== '' && method !== 'POST' && {'id':createdContractId}),
        "contractName": {
          "contractName": contractName
        },
        "contractType": contractType,
        "contractStatus": "DRAFT",
        "contractDetail": {
          "contractId": {
            "id": contractId?.id,
          },
          "priorContract": {
            "id": contractPriorId?.id,
            "notApplicable": contractPriorId?.na,
          },
          "contractManager": {
            "userID": selectContractManager?.id,
            "name": {
            "firstName": selectContractManager?.name?.firstName,
            "lastName": selectContractManager?.name?.lastName
            },
            "email": {
              "officialEmail": selectContractManager?.email?.officialEmail
            }
          },
          "contractFiles": contractFiles,
          "site": {
            "sites": getSiteData(),
          },
          "contractTerm": {
            "startDate": contractTermPeriodFrom === null ? null : format(contractTermPeriodFrom, 'yyyy-MM-dd').toString(),
            "endDate": contractTermPeriodTo === null ? null : format(contractTermPeriodTo, 'yyyy-MM-dd').toString(),
            "effectiveDate": contractEffectiveDate === null ?  null : format(contractEffectiveDate, 'yyyy-MM-dd').toString(),
          },
          "continuationPolicy": {
            "contractPolicyType": selectedContractContinuationPolicy,
            "autoRenewalPeriod": {
              "autoRenewalTerm": {
                "term": selectedContractContinuationPolicy === 'AUTORENEWAL' ? parseInt(autoRenewal.renewalTerm) : 0,
              },
              "allowableAutoRenewalTerm": {
                "term": selectedContractContinuationPolicy === 'AUTORENEWAL' ? parseInt(autoRenewal.allowableRenewalTerm) : 0,
              },
              "autoRenewalCalender": selectedContractContinuationPolicy === 'AUTORENEWAL' ? autoRenewal.calendar : 'WEEKS'
            },
            "reminderList": {
              "renewalReminderList": renewalReminder
            }
          },
          "contractIdMissing": contractId?.missing,
          "fullyExecutedContract": fullyExecutedContract,
          "siteSpecificContract": siteSpecific,
          "departmentSpecificContract": departmentSpecific,
        },
        "newContract": selectedContractType === 'New Contract'?true:false
      }

      const formData = new FormData();
      let file = fullyExecutedContractData?.map(data=>data.file);
       formData.append('contractDetail', new Blob([JSON.stringify(data)], {
            type: "application/json"
        }));
        console.log('file Data',file);
       formData.append('contractFiles',file);
       if(method === 'POST' && contractIdFromActive === ''){
         await POST('contract-managment-service/contracts/contractDetail',formData)
         .then(response=>{getContractId(response?.data);
         SuccessToaster('Contract Draft Saved Successfully');
       }).catch(error=>{
         ErrorToaster('Unexpected Error Creating Contract');
       })
     }else{
       await PUT(`contract-managment-service/contracts/${contractIdFromActive}/contractDetail`,formData)
       .then(response=>{
       SuccessToaster('Contract Updated Successfully');
     }).catch(error=>{
       ErrorToaster('Unexpected Error Updating Contract');
     })
     }

    }

    const onSelect = (selectedItem) => {
      setSelectContractManager(selectedItem);
    }

    const onSelectSite = (selectedItem) => {
      setItem(selectedItem);
      let temp = selectedSites;
      temp.push(selectedItem);
      setSelectedSites(temp);
    }


    const onSelectContractId = (selectedItem) => {
      setContractPriorId({...contractPriorId, id:selectedItem?.contractDetails?.contractId?.id, na:false});
    }


    const getTagProps = (_v, index) => ({
        minimal: true,
    });

    const handleTagsRemove = (tags, index) => {
        let siteId = selectedSites?.filter((data,indexVal)=>index === indexVal)?.map(data=>data?.id)[0];
        setSelectedSites(selectedSites?.filter((data,indexValue)=>index !== indexValue)?.map(data=>data));
        setSelectedDepartmentSites(selectedDepartmentSites?.filter(data=>data?.site_id !== siteId)?.map(data=>data));
    };


    const handleTagSet2Remove = (tags, index) => {
      setSelectedDepartmentSites(selectedDepartmentSites?.filter((data,indexVal)=>index !== indexVal)?.map(data=>data));
    };

    const items = useMemo(
        () =>
          user.map((option) => ({
            userId: option?.id,
            value: `${option.name.firstName} ${option.name.lastName}`,
            ...option,
          })),
        [user],
      );

      const siteItems = useMemo(
          () =>
            sites?.map((option) => ({
              id: option?.id,
              value: option?.siteName?.siteName,
              ...option,
            })),
          [sites],
        );

    const priorContractItems = useMemo(
      () =>
        contracts?.filter(data=>data?.contractDetail?.contractId !== null)?.map((option) => ({
          id: option?.contractDetail?.contractId?.id,
          value: option?.contractDetail?.contractId?.id,
          ...option,
        })),
      [contracts],
    );

    const addReminder = () => {
      let temp = renewalReminder;
      temp.push({'days':0});
      setRenewalreminder(temp);
      getReminder();
    }

    const removeReminder = (index) => {
      setRenewalreminder(renewalReminder?.filter((data,indexValue)=>index!==indexValue)?.map(data=>data));
    }

    const handleReminder = (e,i) => {
      let temp = renewalReminder;
      temp[i] = {'days':parseInt(e)};
      setRenewalreminder(temp);
    }

    const handleFileChange = (e, name) => {
      setFileFieldData({...fileFieldData, [name]:e.target.value});
    }

    const getReminder = () => {
      let temp = [];
      for(let i=0;i<renewalReminder?.length;i++){
        temp[i] = (
          <div className={`${style.renewalRemainderBoxGrid} ${style.marginBottom}`} key={`reminder${i}-${renewalReminder?.[i]?.days}`}>
              <div className={style.marginTop}>Set Renewal Reminder*</div>
              <div className={style.displayInRow}>
                <EditableText className={style.inputRenewalRemainderStyle} defaultValue={renewalReminder?.[i]?.days} placeholder="" onChange={(e)=>handleReminder(e,i)} key={`days${i}${renewalReminder?.[i]?.days}`}/>
                <div className={`${style.marginTop10} ${style.marginLeft20}`}>Days</div>
              </div>
              {renewalReminder?.length !== 1 && (
                <Icon icon="cross" className={style.marginTop10} color="black" onClick={()=>removeReminder(i)}/>
              )}
          </div>
        )
      }
      setReminderFields(temp);
    }

    console.log('user items',items, selectContractManager, contractName);

    const addNewDocumentField = () => {
      let temp = fullyExecutedContractData;
      temp.push(fileFieldData);
      setFileFields(temp);
      setFullyExecutedContractData(temp);
      setFileFieldData({id:'',type:'',name:'',desc:'',fileName:'',file:null,filePath:''});
    }

    const onSelectDepartment = (deptId) => {
      setSelectedItem(deptId);
      let temp = selectedDepartmentSites;
      let name = '';
      selectedSites?.filter(data=>data?.id === selectedSite)?.map(data=>{
        data?.departmentList?.departments?.map(dept=>{
          if(dept?.id === deptId){
            name = dept?.departmentName?.name;
          }
        })
      })
      const isAlreadyPresent = temp?.filter(data=>data.id === deptId && data.site_id === selectedSite)?.map(data=>data)?.length || 0;
      if(!isAlreadyPresent){
        temp.push({id:deptId,name:name,site_id:selectedSite});
      }
      setSelectedDepartmentSites(temp);
    }

    const getDocumentFields = () => {
      let temp = [];
      for(let i=0;i<fullyExecutedContractData?.length;i++){
        temp[i] = (
          <div>
              <div className={style.reduce10Left}>
                  <select
                      name="class"
                      id="Class"
                      value={fullyExecutedContractData[i].type || 'Select...'}
                      onChange={(e) => handleFileChange(e,'type')}
                      className={`${style.fullWidth} ${style.marginLeft20} `}>
                        <option value="Select...">
                          Select...
                        </option>
                          <option value="Agreement Draft">
                          Agreement Draft
                          </option>
                          <option value="Executed Agreement">
                          Executed Agreement
                          </option>
                          <option value="Appendix Addendum">
                          Appendix Addendum
                          </option>
                          <option value="Schedule">
                          Schedule
                          </option>
                          <option value="Attachment">
                          Attachment
                          </option>
                  </select>
              </div>
              <InputGroup className={`${style.fullWidth} ${style.marginTop10}`} placeholder="Document Name" value={fullyExecutedContractData[i].name} onChange={(e)=>handleFileChange(e,'name')}/>
              <TextArea rows={4} placeholder="Document Description" className={`${style.fullWidth} ${style.marginTop10}`} value={fullyExecutedContractData[i].desc} onChange={(e)=>handleFileChange(e,'desc')}/>
              <div className={style.grid2}>
                  <InputGroup value={fullyExecutedContractData?.[i]?.fileName !== '' ? fullyExecutedContractData?.[i]?.fileName : 'Choose File...'}  leftElement={leftElement()} className={`${style.fullWidth} ${style.marginTop10}`} onChange={(e)=>handleFileUpload(i,e)} />
              </div>
          </div>
        )
      }
      setDocumentFields(temp);
    }

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

    const disableFileAddButton = () => {
      if(fileFieldData?.type !== '' && fileFieldData?.name !== '' && fileFieldData?.file !== null){
        return false;
      }else{
        return true;
      }
    }

    const handleDepartmentSpecific = () => {
      setDepartmentSpecific(!departmentSpecific);
    }

    return(
        <div className={style.cloneBlockStyle}>
            <div className={`${style.newContractFromCloneBoxStyle}`}>
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>Contract / Agreement Name*</div>
                    <InputGroup placeholder="Contract Name" className={style.fullWidth} value={contractName} onChange={(e)=>{setContractName(e.target.value);setName(e.target.value)}}/>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contract ID*</div>
                    <div className={style.displayInRow}>
                        <InputGroup placeholder="Contract Id" value={contractId.id} className={`${style.entityFieldWidth}`} onChange={(e)=>setContractId({...contractId, id:e.target.value, missing:false})}/>
                      <Checkbox label="Missing"  checked={contractId.missing} onChange={(e)=>setContractId({...contractId, missing:e.target.checked, id:''})} className={`${style.marginTop10} ${style.marginLeft20}`}/>
                    </div>
                </div>
                {selectedContractType !== "New Contract" && (
                  <div className={contracts?.length !== 0 ? `${style.extentionGrid} ${style.marginTop20}`:`${style.extentionGrid} ${style.marginTop20} ${style.disabledView} `}>
                      <div className={style.extentionLableStyle}>Prior Contract ID*</div>
                      <div className={style.displayInRow}>
                          <DatalistInput items={priorContractItems || []} onSelect={onSelectContractId} className={style.selectFieldWidth} onChange={(e)=>setContractPriorId({...contractPriorId, id:'', na:e.target.checked})} placeholder="Search by CID / Name" value={contractPriorId?.id}/>
                            <Checkbox label="NA"  checked={contractPriorId.na} onChange={(e)=>setContractPriorId({...contractPriorId, id:'', na:e.target.checked})} className={`${style.marginTop10} ${style.marginLeft20}`}/>

                      </div>
                  </div>
                )}
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Assigned Contract Manager*</div>
                    <div className={style.displayInRow}>
                    <div>
                        <DatalistInput items={items || []} onSelect={onSelect}  onChange={(e)=>setUserName(e.target.value)} className={style.selectFieldWidth} value={contractData?.contractManager?.name?.firstName}/>
                        {(!items?.map(data=>data?.name?.firstName)?.includes(userName) && !userName === '') && (
                            <div className={style.addBoxDescription}>
                            The Contract Manager you are trying to add is not a registered
                            user. To add a new contract manager click on the "ADD" button.
                            </div>
                        )}
                    </div>
                    <button className={`${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} ${style.disabledButton}`} onClick={() =>setAddNewManagerDialog(true)}>ADD</button>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Fully Executed Contract on File*</div>
                    <div>
                        <div className={`${style.spaceBetween}`}>
                            <FormControlLabel
                                control={
                                    <Switch checked={fullyExecutedContract} className={`${style.floatLeft}`} onChange={() => {setFullyExecutedContract(!fullyExecutedContract)}}  />
                                }
                                className={`${style.switchFontStyle} ${style.marginTop} ${style.flexLeft}`}
                                label={fullyExecutedContract ? 'YES' : "NO"}
                            />
                            {fullyExecutedContract && (
                                <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} ${(fileFieldData?.type === '' || fileFieldData?.name === '' || fileFieldData?.file === null) && style.disabledUploadButton}`} disabled={fileFieldData?.type === '' || fileFieldData?.name === '' || fileFieldData?.file === null} onClick={()=>{addNewDocumentField()}}>UPLOAD</button>
                            )}
                        </div>
                        {fullyExecutedContract && (
                          <div>
                              <div>
                                  <select
                                      name="class"
                                      id="Class"
                                      value={fileFieldData?.type || 'Select...'}
                                      onChange={(e) => handleFileChange(e,'type')}
                                      className={`${style.fullWidth}`}>
                                        <option value="Select...">
                                          Select...
                                        </option>
                                          <option value="Agreement Draft">
                                          Agreement Draft
                                          </option>
                                          <option value="Executed Agreement">
                                          Executed Agreement
                                          </option>
                                          <option value="Contract Amendment">
                                          Contract Amendment
                                          </option>
                                          <option value="Exhibit">
                                          Exhibit
                                          </option>
                                          <option value="Appendix Addendum">
                                          Appendix Addendum
                                          </option>
                                          <option value="Schedule">
                                          Schedule
                                          </option>
                                          <option value="Attachment">
                                          Attachment
                                          </option>
                                  </select>
                              </div>
                              <InputGroup className={`${style.fullWidth} ${style.marginTop10}`} placeholder="Document Name"
                              value={fileFieldData?.name}
                              onChange={(e)=>handleFileChange(e,'name')}/>
                              <TextArea rows={4} placeholder="Document Description" value={fileFieldData?.desc} className={`${style.fullWidth} ${style.marginTop10}`}  onChange={(e)=>handleFileChange(e,'desc')}/>
                              <div >
                                  <InputGroup value={fileFieldData?.fileName !== '' ? fileFieldData?.fileName : 'Choose File...'}  leftElement={leftElement()} className={`${style.fullWidth} ${style.marginTop10}`} onChange={(e)=>handleFileUpload(e)} />
                              </div>
                          </div>
                        )}
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Site Specific Contract*</div>
                    <div>
                        <div className={style.displayInRow}>
                            <FormControlLabel
                                control={
                                    <Switch checked={siteSpecific} className={`${style.textAlignLeft}`} onChange={() => setSiteSpecific(!siteSpecific)}  />
                                }
                                className={`${style.switchFontStyle}`}
                                label={siteSpecific ? 'YES' : "NO"}
                            />
                            {siteSpecific && (
                                <div className={style.displayInRow}>
                                    <DatalistInput items={siteItems||[]} placeholder="Select Sites" onSelect={onSelectSite}  className={`${style.selectFieldSwitchWidth} ${style.marginLeft20}`} />
                                    {
                                      // <div className={`${style.addSymbolStyle} ${style.marginLeft20}`} onClick={()=>{setSelectedSites([...selectedSites,])}}><span className={style.plusSymbolPosition}>+</span></div>
                                    }
                                    </div>
                            )}
                        </div>
                        {siteSpecific && (
                            <TagInput
                                placeholder="Enter tags/keywords relative to the post"
                                values={selectedSites?.map(data=>data?.siteName?.siteName)}
                                className={`${style.marginTop20}`}
                                onRemove={handleTagsRemove}
                                separator={/[\s,]/}
                                addOnBlur={true}
                                addOnPaste={true}
                                tagProps={getTagProps}
                            />
                        )}
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Department Specific Contract*</div>
                    <div>
                        <div className={style.displayInRow}>
                            <FormControlLabel
                                control={
                                    <Switch checked={departmentSpecific} className={` ${style.textAlignLeft}`} onChange={()=>{handleDepartmentSpecific()}}  />
                                }
                                className={`${style.switchFontStyle}`}
                                label={departmentSpecific ? 'YES' : "NO"}
                            />
                            {departmentSpecific && (
                                    <select
                                        name="class"
                                        id="Class"
                                        value={selectedSite || 'Select...'}
                                        onChange={(e) => setSelectedSite(e.target.value)}
                                        className={`${style.fullWidth} ${style.marginLeft20} `}>
                                        <option value='Select...'>
                                          Select Site...
                                        </option>
                                        {
                                        selectedSites?.map(data=>(
                                            <option value={data?.id}>
                                              {data?.siteName?.siteName}
                                            </option>
                                          ))
                                        }
                                    </select>
                            )}
                        </div>
                        {departmentSpecific &&
                            selectedSites?.filter(data=>data?.id === selectedSite)?.map(data=>(
                              <div>
                                  <select
                                      name="class"
                                      id="Class"
                                      onChange={(e) => onSelectDepartment(e.target.value)}
                                      className={`${style.fullWidth} ${style.marginTop20}`}>
                                      <option value='Select...'>
                                        Select Department...
                                      </option>
                                      {
                                        data?.departmentList?.departments?.map(dept=>(
                                          <option value={dept?.id}>
                                            {dept?.departmentName?.name}
                                          </option>
                                        ))
                                      }
                                  </select>
                              </div>
                            )
                        )}
                        {departmentSpecific && (
                            <TagInput
                                placeholder="Enter tags/keywords relative to the post"
                                values={selectedDepartmentSites?.filter(data=>data?.site_id === selectedSite)?.map(data=>data?.name) || []}
                                className={`${style.marginTop20}`}
                                onRemove={handleTagSet2Remove}
                                separator={/[\s,]/}
                                addOnBlur={true}
                                addOnPaste={true}
                                tagProps={getTagProps}
                            />
                        )}
                    </div>
                </div>
                {/* // <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  //     <div className={style.extentionLableStyle}>Site Specific Contract*</div>
                  //     <div>
                  //         <div className={style.displayInRow}>
                  //             <FormControlLabel
                  //                 control={
                  //                     <Switch checked={siteSpecific} className={`${style.textAlignLeft}`} onChange={() => setSiteSpecific(!siteSpecific)}  />
                  //                 }
                  //                 className={`${style.switchFontStyle}`}
                  //                 label={siteSpecific ? 'YES' : "NO"}
                  //             />
                  //             {siteSpecific && (
                  //                 <div className={style.displayInRow}>
                  //                     <DatalistInput items={siteItems||[]} placeholder="Select Sites" onSelect={onSelectSite}  className={`${style.selectFieldSwitchWidth} ${style.marginLeft20}`} />
                  //                     {
                  //                       // <div className={`${style.addSymbolStyle} ${style.marginLeft20}`} onClick={()=>{setSelectedSites([...selectedSites,])}}><span className={style.plusSymbolPosition}>+</span></div>
                  //                     }
                  //                     </div>
                  //             )}
                  //         </div>
                  //         {siteSpecific && (
                  //             <TagInput
                  //                 placeholder="Enter tags/keywords relative to the post"
                  //                 values={selectedSites?.map(data=>data?.siteName?.siteName)}
                  //                 className={`${style.marginTop20}`}
                  //                 onRemove={handleTagsRemove}
                  //                 separator={/[\s,]/}
                  //                 addOnBlur={true}
                  //                 addOnPaste={true}
                  //                 tagProps={getTagProps}
                  //             />
                  //         )}
                  //     </div>
                  // </div>
                  // <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  //     <div className={style.extentionLableStyle}>Department Specific Contract*</div>
                  //     <div>
                  //         <div className={style.displayInRow}>
                  //             <FormControlLabel
                  //                 control={
                  //                     <Switch checked={departmentSpecific && siteSpecific} className={` ${style.textAlignLeft}`} onChange={()=>{if(siteSpecific){setDepartmentSpecific(!departmentSpecific)}}}  />
                  //                 }
                  //                 className={`${style.switchFontStyle}`}
                  //                 label={departmentSpecific ? 'YES' : "NO"}
                  //             />
                  //             {departmentSpecific && (
                  //                 <div>
                  //                   <div>
                  //                       <select
                  //                           name="class"
                  //                           id="Class"
                  //                           value={selectedSite || 'Select...'}
                  //                           onChange={(e) => setSelectedSite(e.target.value)}
                  //                           className={`${style.fullWidth} ${style.marginLeft20} `}>
                  //                           <option value='Select...'>
                  //                             Select Site...
                  //                           </option>
                  //                           {
                  //                             selectedSites?.map(data=>(
                  //                               <option value={data?.id}>
                  //                                 {data?.siteName?.siteName}
                  //                               </option>
                  //                             ))
                  //                           }
                  //                       </select>
                  //                   </div>
                  //                   {
                  //                     selectedSites?.filter(data=>data?.id === selectedSite)?.map(data=>(
                  //                       <div>
                  //                           <select
                  //                               name="class"
                  //                               id="Class"
                  //                               onChange={(e) => onSelectDepartment(e.target.value)}
                  //                               className={`${style.fullWidth} ${style.marginLeft20} ${style.marginTop20}`}>
                  //                               <option value='Select...'>
                  //                                 Select Department...
                  //                               </option>
                  //                               {
                  //                                 data?.departmentList?.departments?.map(dept=>(
                  //                                   <option value={dept?.id}>
                  //                                     {dept?.departmentName?.name}
                  //                                   </option>
                  //                                 ))
                  //                               }
                  //                           </select>
                  //                       </div>
                  //                     ))
                  //                   }
                  //
                  //                 </div>
                  //             )}
                  //         </div>
                  //         {departmentSpecific && (
                  //             <TagInput
                  //                 placeholder="Enter tags/keywords relative to the post"
                  //                 values={selectedDepartmentSites?.filter(data=>data?.site_id === selectedSite)?.map(data=>data?.name) || []}
                  //                 className={`${style.marginTop20}`}
                  //                 onRemove={handleTagSet2Remove}
                  //                 separator={/[\s,]/}
                  //                 addOnBlur={true}
                  //                 addOnPaste={true}
                  //                 tagProps={getTagProps}
                  //             />
                  //         )}
                  //     </div>
                  // </div>
                  */}
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contract Term Period*</div>
                    <div className={style.termPeriodGrid}>
                        {/* <DateInput
                            formatDate={date => date.toLocaleDateString()}
                            parseDate={str => new Date(str)}
                            placeholder={"MM-DD-YYYY"}
                            value={contractTermPeriodFrom}
                            onChange={(e)=> setContractTermPeriodFrom(e || new Date()) }
                        /> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={contractTermPeriodFrom}
                            onChange={(newValue) => {
                              setContractTermPeriodFrom(newValue);
                            }}
                            InputProps={{
                              style: {
                                  fontSize: 14,
                                  height: 30,
                              }
                          }}
                            renderInput={(params) => <TextField {...params} inputProps={{
                              ...params.inputProps,
                              placeholder: "Start Date"
                            }}/>}
                          />
                        </LocalizationProvider>
                    <p className={`${style.toStyle} ${style.alignCenter}`}>To</p>
                        {/* <DateInput
                            formatDate={date => date.toLocaleDateString()}
                            parseDate={str => new Date(str)}
                            placeholder={"MM-DD-YYYY"}
                            value={contractTermPeriodTo}
                            onChange={(e)=> setContractTermPeriodTo(e || new Date()) }
                            minDate={contractTermPeriodFrom}
                        /> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={contractTermPeriodTo}
                            onChange={(newValue) => {
                              setContractTermPeriodTo(newValue);
                            }}
                            InputProps={{
                              style: {
                                  fontSize: 14,
                                  height: 30,
                              }
                            }}
                            minDate={contractTermPeriodFrom}
                            renderInput={(params) => <TextField  {...params} inputProps={{
                              ...params.inputProps,
                              placeholder: "End Date"
                            }} />}
                          />
                        </LocalizationProvider>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contracted Services Effective Date*</div>
                    <div className={`${style.leftAlign} ${style.effectiveDateWidth}`}>
                    {/* <DateInput
                        formatDate={date => date.toLocaleDateString()}
                        parseDate={str => new Date(str)}
                        placeholder={"MM-DD-YYYY"}
                        value={contractEffectiveDate}
                        onChange={(e)=> setContractEffectiveDate(e || new Date()) }
                        minDate={contractTermPeriodFrom}
                    /> */}
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={contractEffectiveDate}
                          onChange={(newValue) => {
                            setContractEffectiveDate(newValue);
                          }}
                          InputProps={{
                            style: {
                                fontSize: 14,
                                height: 30,
                            }
                          }}
                          minDate={contractTermPeriodFrom}
                          renderInput={(params) => <TextField  {...params} inputProps={{
                            ...params.inputProps,
                            placeholder: "Effective Date"
                          }} />}
                        />
                      </LocalizationProvider>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contract Continuation Policy*</div>
                    <div>
                        <div>
                            <select
                                name="class"
                                id="Class"
                                value={selectedContractContinuationPolicy || 'Select...'}
                                onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                className={`${style.fullWidth}`}>
                                    <option value="0" >
                                    Choose Your Contract Continuation Policy
                                    </option>
                                    <option value="AUTORENEWAL" >
                                    Auto Renewal
                                    </option>
                                    <option value="WRITTENCONTRACTEXTENSIONFORFIXEDTERM" >
                                    Written Contract Extension For Fixed Term
                                    </option>
                                    <option value="NEWCONTRACTONEXPIRATION" >
                                    New Contract On Expiration
                                    </option>
                                    <option value="ONETIMECONTRACTTERMINATEONEXPIRATION" >
                                    One Time Contract - Terminate On Expiration
                                    </option>
                            </select>
                        </div>
                        {selectedContractContinuationPolicy === "AUTORENEWAL" && (
                            <div className={`${style.renewalBoxStyle}`}>
                                <div className={`${style.renewalBoxGrid}`}>
                                    <div className={style.marginTop}>Auto Renewal Term*</div>
                                    <EditableText className={`${style.inputRenewalStyle}`} placeholder="" value={autoRenewal.renewalTerm} onChange={(e)=>setAutoRenewal({...autoRenewal, renewalTerm:e})} />
                                    <select
                                        name="class"
                                        id="Class"
                                        value={autoRenewal.calendar}
                                        onChange={(e) => setAutoRenewal({...autoRenewal, calendar:e.target.value})}
                                        className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                            <option value="WEEKS" >
                                            Weeks
                                            </option>
                                            <option value="MONTHS" >
                                            Months
                                            </option>
                                    </select>
                                </div>
                                <div className={`${style.renewalBoxGrid}`}>
                                    <div className={style.marginTop10}>Allowable Auto Renewal Terms*</div>
                                    <EditableText className={`${style.inputRenewalStyle} ${style.marginTop10}`} placeholder="" value={autoRenewal.allowableRenewalTerm} onChange={(e)=>setAutoRenewal({...autoRenewal, allowableRenewalTerm:e})} />
                                </div>
                            </div>
                        )}
                        {(selectedContractContinuationPolicy === "WRITTENCONTRACTEXTENSIONFORFIXEDTERM"
                            || selectedContractContinuationPolicy === "NEWCONTRACTONEXPIRATION"
                            || selectedContractContinuationPolicy === "ONETIMECONTRACTTERMINATEONEXPIRATION") && (
                            <div className={`${style.renewalRemainderBoxStyle}`}>
                              {reminderFields}
                              <div className={`${style.renewalBoxGrid}`}>
                                {renewalReminder?.length <= 2 && (
                                  <button className={`${style.addMoreButton} ${style.selectedColor} ${style.cursorPointer}`} onClick={addReminder}>ADD MORE</button>
                                )}
                              </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button className={style.newContractOutlinedButton} onClick={()=>addContract()}>SAVE IN-PROGRESS</button>
                <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {addContract();getViewPage2(true);getViewPage1(false);getCurrentPage('Contracted Services Provider(s)')}}>CONTINUE</button>
            </div>
            {addNewManagerDialog && (
                <AddNewContractManager getAddNewManagerDialog={getAddNewManagerDialog} contractType={contractType} getUserData={getUserData} contractId={contractIdFromActive}/>
            )}
        </div>
    )
}

export default ContractIdTermLimitIndividual;
