import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TextArea, InputGroup, Icon, TagInput, Checkbox, FileInput, EditableText, Divider } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DateInput } from "@blueprintjs/datetime";
import DatalistInput from 'react-datalist-input';
import {GET,PUT,POST,role,tenantID} from './../dataSaver';
import AddNewContractManager from './addNewContractManager';
import {Auth} from './../../utils/auth'
import {format} from 'date-fns';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import axios from 'axios';

import style from './index.module.scss';

const VALUES = ['Site 1', "Site 2"];
const VALUES2 = ['Department 1', "Department 2", "Department 3"];
const ContractIdTermLimitIndividual = ({getViewPage1, getViewPage2, getCurrentPage, contractType, selectedContractType, getContractId, setName, setFileFields}) => {
    const [selectContractManager, setSelectContractManager] = useState('');
    const [siteSpecific, setSiteSpecific] = useState(false);
    const [selectedContract, setSelectedContract] = useState('Select...');
    const [selectedContractContinuationPolicy, setSelectedContractContinuationPolicy] = useState('Select Value');
    const [item, setItem] = useState();
    const [addNewManagerDialog, setAddNewManagerDialog] = useState(false);
    const [priorContractItem, setPriorContractItem] = useState();
    const [fullyExecutedContract, setFullyExecutedContract] = useState(false);
    const [fullyExecutedContractData,setFullyExecutedContractData] = useState([]);
    const [fileFieldData,setFileFieldData] = useState({type:'',name:'',desc:'',fileName:'',file:null,filePath:''});
    const [files,setFiles] = useState([]);
    const [departmentSpecific, setDepartmentSpecific] = useState(false);
    const [tags, setTags] = useState(VALUES);
    const [tagSet2, setTagSet2] = useState(VALUES2);
    const [contractTermPeriodFrom, setContractTermPeriodFrom] = useState(new Date());
    const [contractTermPeriodTo, setContractTermPeriodTo] = useState(new Date());
    const [contractEffectiveDate, setContractEffectiveDate] = useState(new Date());
    const [contractName,setContractName] = useState('');
    const [contractId,setContractId] = useState({id:'',missing:false});
    const [contractPriorId,setContractPriorId] = useState({id:'',na:false});
    const [contractNA,setContractNA] = useState(false);
    const [user,setUsers] = useState([]);
    const [contracts,setContracts] = useState();
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
    const id = '50785c4d-056f-4a71-a066-18212905fc44';


    useEffect(() => {
      getUserData();
      getContracts();
      getSites();
      getDocumentFields();
      if(id!==''){
        getContractDetail();
      }
    },[])

    useEffect(()=>{
      getReminder();
    },[renewalReminder])

    useEffect(()=>{
      getDocumentFields()
    },[fullyExecutedContractData])

    const getContractDetail = async() => {
      const {data: contractData} = await GET(`contract-managment-service/contracts/${id}/contractDetail`);
      if(contractData){
        let contractDetail = contractData?.contractDetail;
        setName(contractData?.contractName?.contractName || '');
        setContractName(contractData?.contractName?.contractName);
        setContractId({id:contractDetail?.contractId?.id,missing:contractData?.contractIdMissing});
        setDepartmentSpecific(contractDetail?.departmentSpecificContract);
        setSiteSpecific(contractDetail?.siteSpecificContract);
        setFullyExecutedContract(contractDetail?.fullyExecutedContract);
        setSelectContractManager(contractDetail?.contractManager?.userID);
        setContractPriorId({id:contractDetail?.priorContract?.id,na:contractDetail?.priorContract?.notApplicable});
        setContractTermPeriodFrom(new Date(contractDetail?.contractTerm?.startDate) !== undefined ? new Date(contractDetail?.contractTerm?.startDate) : new Date());
        setContractTermPeriodTo(new Date(contractDetail?.contractTerm?.endDate)  !== undefined ? new Date(contractDetail?.contractTerm?.endDate) : new Date() );
        setContractEffectiveDate(new Date(contractDetail?.contractTerm?.effectiveDate)  !== undefined ? new Date(contractDetail?.contractTerm?.effectiveDate) : new Date());
        setSelectedContractContinuationPolicy(contractDetail?.continuationPolicy?.contractPolicyType);
        let continuation = contractDetail?.continuationPolicy?.autoRenewalPeriod;
        setAutoRenewal({renewalTerm:continuation?.autoRenewalTerm?.term.toString(),allowableRenewalTerm:continuation?.allowableAutoRenewalTerm?.term.toString(),calendar:continuation?.autoRenewalCalender})
        setRenewalreminder(contractDetail?.continuationPolicy?.reminderList?.renewalReminderList);
        if(contractDetail?.siteSpecificContract){
          setSelectedSites(contractDetail?.site?.sites);
        }
        else if(contractDetail?.departmentSpecificContract){
          setSelectedDepartmentSites(contractDetail?.site?.sites);
        }
        else{
          setSites(contractDetail?.site?.sites);
        }
      }
    }

    const getUserData = async() => {
      const {data: user} = await GET('user-management-service/user');
      if(user){
        setUsers(user);
      }
    }

    const getContracts = async() => {
      const {data:contracts} = await GET('contract-managment-service/contracts');
      if(contracts){
        setContracts(contracts);
      }
    }

    const getSites = async()=>{
      const {data:sites} = await GET('entity-service/sites');
      if(sites){
        setSites(sites);
      }
    }

      const getAddNewManagerDialog = (value) => {
        setAddNewManagerDialog(value);
    }

    const handleFileUpload = (e) => {
      console.log('file sample test', fileFieldData);
      setFileFieldData({...fileFieldData, file: e.target.files[0], fileName: e.target.files?.[0]?.name});
      // console.log('inside file handle',index,e);
      // let fileName = e.target.files?.[0]?.name;
      // let temp = fullyExecutedContractData;
      // temp?.filter((data,indexVal)=>index === indexVal)?.map(data=>{
      //   data.file = e.target.files[0];
      //   data.fileName = fileName;
      // })
      // setFullyExecutedContractData(temp);
      // getDocumentFields();
    }


    const addContract = async() => {
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
        "id":"5e05461e-2ce9-4197-b8be-0ae4ae3cc786",
        "contractName": {
          "contractName": contractName
        },
        "contractType": contractType,
        "contractStatus": "ACTIVE",
        "contractDetail": {
          "contractId": {
            "id": contractId?.id,
          },
          "priorContract": {
            "id": contractPriorId?.id,
            "notApplicable": contractPriorId?.na,
          },
          "contractManager": {
            "userID": selectContractManager,
          },
          "contractFiles": contractFiles,
          "site": {
            "sites": !siteSpecific ? sites : siteSpecific && !departmentSpecific ? selectedSites : siteSpecific && departmentSpecific ? selectedDepartmentSites : !siteSpecific && !departmentSpecific ? sites : [],
          },
          "contractTerm": {
            "startDate": format(contractTermPeriodFrom, 'yyyy-MM-dd').toString(),
            "endDate": format(contractTermPeriodTo, 'yyyy-MM-dd').toString(),
            "effectiveDate": format(contractEffectiveDate, 'yyyy-MM-dd').toString(),
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
       formData.append('contractFiles',file);
       await POST('contract-managment-service/contracts/contractDetail',formData)
       .then(response=>{getContractId(response);
       SuccessToaster('Contract Created Successfully');
     }).catch(error=>{
       ErrorToaster('Unexpected Error Creating Contract');
     })
    }

    const onSelect = (selectedItem) => {
      setSelectContractManager(selectedItem.id);
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
        setSelectedSites(selectedSites?.filter((data,indexValue)=>index !== indexValue)?.map(data=>data));
    };


    const handleTagSet2Remove = (tags, index) => {
      const updatedTags = [tags];
      updatedTags.splice(index, 1);
      tags = updatedTags;
      setTagSet2(tags);
    };

    const items = useMemo(
        () =>
          user.map((option) => ({
            id: option?.id,
            value: `${option.name.firstName} ${option.name.lastName} ${option.name.suffix}`,
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
          <div className={`${style.renewalRemainderBoxGrid} ${style.marginBottom}`} key={`reminder${i}`}>
              <div className={style.marginTop}>Set Renewal Reminder*</div>
              <EditableText className={style.inputRenewalRemainderStyle} defaultValue={renewalReminder?.[i]?.days} placeholder="" onChange={(e)=>handleReminder(e,i)} key={`days${i}`}/>
              <Icon icon="cross" className={style.marginTop10} color="black" onClick={()=>removeReminder(i)}/>
          </div>
        )
      }
      setReminderFields(temp);
    }

    const removeContractData = (index) => {
      setFullyExecutedContractData(fullyExecutedContractData?.filter((data,indexValue)=>indexValue!==index)?.map(data=>data));
    }

    const handlContractManagerOnChange = (e) => {
      setUserName(e.target.value);
      if(e.target.value !== ''){
        setSelectContractManager(items?.filter(data=>data.name?.firstName === 'userName')?.map(data=>data.id));
      }else{
        setSelectContractManager('');
      }
    }

    const addNewDocumentField = () => {
      let temp = fullyExecutedContractData;
      temp.push(fileFieldData);
      setFullyExecutedContractData(temp);
      setFileFieldData({type:'',name:'',desc:'',fileName:'',file:null,filePath:''});
      setFileFields(temp);
    }

    const onSelectDepartment = (value, siteId, deptIndex, deptValue) => {
      let modifiedSite = {};
      if(value){
        if(selectedDepartmentSites?.length === 0){
          let temp = [];
          selectedSites?.map((data,index)=>{
            console.log('index',index,'siteId',siteId);
            let department = {departments:[]}
            if(data?.id === siteId){
              department?.departments?.push(deptValue);
              setDepartmentsName([...departmentsName, {name:deptValue?.departmentName?.departmentName,id:deptValue?.id}])
            }
            temp.push({
              address:data.address,
              canSetupDepartment:data.canSetupDepartment,
              departmentList:department,
              id:data.id,
              npin:data.npin,
              primarySite:data.primarySite,
              siteAdmin:data.siteAdmin,
              siteDisplayId:data.siteDisplayId,
              siteName:data.seName,
              siteType:data.siteType,
            })
          })
          setSelectedDepartmentSites(temp);
        }else{
          let temp = selectedDepartmentSites;
          temp?.filter((data,indexValue)=>siteId === data?.id)?.map(data=>{
            let deptTemp = data?.departmentList?.departments;
            deptTemp.push(deptValue);
          })
          setSelectedDepartmentSites(temp);
        }
      }
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

    console.log('data',fileFieldData, fullyExecutedContractData);

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
                        <DatalistInput items={items} onSelect={onSelect}  onChange={(e)=>setUserName(e.target.value)} className={style.selectFieldWidth} value={items?.filter(data=>data?.id === selectContractManager)?.map(data=>data?.value)[0]}/>
                        {!items?.map(data=>data.name?.firstName)?.includes(userName) && !userName === '' &&(
                            <div className={style.addBoxDescription}>
                            The Contract Manager you are trying to add is not a registered
                            user. to add a new contract manager click on the "ADD" button.
                            </div>
                        )}
                    </div>
                    <button className={`${style.disabledButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} onClick={() =>setAddNewManagerDialog(true)}>ADD</button>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Fully Executed Contract on File*</div>
                    <div>
                        <div className={`${style.spaceBetween}`}>
                            <FormControlLabel
                                control={
                                    <Switch checked={fullyExecutedContract} className={`${style.floatLeft}`} onChange={() => {setFullyExecutedContract(!fullyExecutedContract);setFullyExecutedContractData([{type:'',name:'',desc:'',fileName:'',file:null,filePath:''}]);}}  />
                                }
                                className={`${style.switchFontStyle} ${style.marginTop} ${style.flexLeft}`}
                                label={fullyExecutedContract ? 'YES' : "NO"}
                            />
                            {fullyExecutedContract && (
                                <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} onClick={()=>{addNewDocumentField()}}>ADD MORE</button>
                            )}
                        </div>
                        {fullyExecutedContract && (
                          <div>
                              <div className={style.reduce10Left}>
                                  <select
                                      name="class"
                                      id="Class"
                                      value={fileFieldData?.type || 'Select...'}
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
                                    <Switch checked={departmentSpecific} className={` ${style.textAlignLeft}`} onChange={() => setDepartmentSpecific(!departmentSpecific)}  />
                                }
                                className={`${style.switchFontStyle}`}
                                label={departmentSpecific ? 'YES' : "NO"}
                            />
                            {departmentSpecific && (
                                <div>
                                  <div>
                                      <select
                                          name="class"
                                          id="Class"
                                          value={selectedSite || 'Select...'}
                                          onChange={(e) => setSelectedSite(e.target.value)}
                                          className={`${style.fullWidth} ${style.marginLeft20} `}>
                                          {
                                            selectedSites?.map(data=>(
                                              <option value={data?.siteName?.siteName}>
                                                {data?.siteName?.siteName}
                                              </option>
                                            ))
                                          }
                                      </select>
                                  </div>
                                  {selectedSites?.map(data=>data?.siteName?.siteName)?.includes(selectedSite) && (
                                    <div className={`${style.roleBoxStyle} ${style.marginLeft20} ${style.floatRight}`}>
                                      {
                                        selectedSites?.filter(site=>site?.siteName?.siteName === selectedSite)?.map((site)=>site?.departmentList?.departments?.map((dept,deptIndex)=>(
                                            <Checkbox label={dept?.departmentName?.departmentName} checked={departmentsName?.map(data=>data.name).includes(dept?.departmentName?.departmentName)} onChange={(e)=>onSelectDepartment(e.target.checked,site?.id,deptIndex,dept)}/>
                                        )))
                                    }
                                    </div>
                                  )}
                                </div>
                            )}
                        </div>
                        {departmentSpecific && (
                            <TagInput
                                placeholder="Enter tags/keywords relative to the post"
                                values={departmentsName?.map(data=>data.name)}
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
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contract Term Period*</div>
                    <div className={style.displayInRow}>
                        <DateInput
                            formatDate={date => date.toLocaleDateString()}
                            parseDate={str => new Date(str)}
                            placeholder={"MM-DD-YYYY"}
                            value={contractTermPeriodFrom}
                            onChange={(e)=> setContractTermPeriodFrom(e) }
                            minDate={contractTermPeriodFrom || new Date()}
                        />
                    <p className={style.toStyle}>To</p>
                        <DateInput
                            formatDate={date => date.toLocaleDateString()}
                            parseDate={str => new Date(str)}
                            placeholder={"MM-DD-YYYY"}
                            value={contractTermPeriodTo}
                            onChange={(e)=> setContractTermPeriodTo(e) }
                            minDate={contractTermPeriodFrom}
                        />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contracted Services Effective Date*</div>
                    <div className={`${style.leftAlign} `}>
                    <DateInput
                        formatDate={date => date.toLocaleDateString()}
                        parseDate={str => new Date(str)}
                        placeholder={"MM-DD-YYYY"}
                        value={contractEffectiveDate}
                        onChange={(e)=> setContractEffectiveDate(e) }
                        minDate={contractEffectiveDate||contractTermPeriodFrom}
                    />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contract Continuation Policy*</div>
                    <div>
                        <div className={style.reduce10Left}>
                            <select
                                name="class"
                                id="Class"
                                value={selectedContractContinuationPolicy || 'Select...'}
                                onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                className={`${style.fullWidth} ${style.marginLeft20} `}>
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
                                    <EditableText className={`${style.inputRenewalStyle} ${style.marginTop10}`} placeholder="" value={autoRenewal.renewalTerm} onChange={(e)=>setAutoRenewal({...autoRenewal, renewalTerm:e})} />
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
                                  <button className={`${style.addMoreButton} ${style.selectedColor} ${style.cursorPointer}`} onClick={addReminder}>ADD MORE</button>
                              </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button className={style.newContractOutlinedButton} onClick={()=>addContract()}>SAVE IN-PROGRESS</button>
                <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {getViewPage2(true);getViewPage1(false);getCurrentPage('Contracted Services Provider(s)')}}>CONTINUE</button>
            </div>
            {addNewManagerDialog && (
                <AddNewContractManager getAddNewManagerDialog={getAddNewManagerDialog} contractType={contractType} getUserData={getUserData}/>
            )}
        </div>
    )
}

export default ContractIdTermLimitIndividual;
