import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TextArea, InputGroup, RadioGroup, Radio, Icon, TagInput, Checkbox, FileInput, EditableText } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DateInput } from "@blueprintjs/datetime";
import DatalistInput from 'react-datalist-input';
import {GET,PUT,POST,role,tenantID} from './contractDataSaver';
import AddNewContractManager from './addNewContractManager';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import axios from 'axios';

import style from './index.module.scss';

const VALUES = ['Site 1', "Site 2"];
const VALUES2 = ['Department 1', "Department 2", "Department 3"];
const ContractIdTermLimitIndividual = ({getViewPage1, getViewPage2, contractType, selectedContractType, getContractId, getCurrentPage}) => {
    console.log('type',contractType,selectedContractType);
    const [selectContractManager, setSelectContractManager] = useState('');
    const [siteSpecific, setSiteSpecific] = useState(false);
    const [selectedContract, setSelectedContract] = useState('Select...');
    const [selectedContractContinuationPolicy, setSelectedContractContinuationPolicy] = useState('Select Value');
    const [item, setItem] = useState();
    const [addNewManagerDialog, setAddNewManagerDialog] = useState(false);
    const [priorContractItem, setPriorContractItem] = useState();
    const [fullyExecutedContract, setFullyExecutedContract] = useState(false);
    const [fullyExecutedContractData,setFullyExecutedContractData] = useState([{type:'',name:'',desc:''}]);
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
    const [selectedSite,setSelectedSite] = useState([]);
    const [autoRenewal,setAutoRenewal] = useState({renewalTerm:'0',allowableRenewalTerm:'0',calendar:'WEEKS'});
    const [renewalReminder,setRenewalreminder] = useState([{'days':0}]);
    const [reminderFields,setReminderFields] = useState([]);
    const [documentFields,setDocumentFields] = useState([]);
    const [userName, setUserName] = useState('');
    const [selectedRole, setSelectedRole] = useState('')

    console.log('userName',userName);

    useEffect(() => {
      getUserData();
      getContracts();
      getSites();
    },[])

    useEffect(()=>{
      getReminder();
    },[renewalReminder])

    useEffect(()=>{
      getDocumentFields();
    },[fullyExecutedContractData.length])

    const getUserData = async() => {
      const {data: user} = await GET('user-management-service/user');
      if(user){
        setUsers(user);
        console.log('user items',items);
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

    const handleFileUpload = (index,e) => {
      console.log('file',e);
    }

    const addContract = async() => {
      let data = {
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
            "id": contractPriorId,
            "notApplicable": contractNA,
          },
          "contractManager": {
            "userID": "62d9650ea18d662326f0ce0d"
          },
          // "contractFiles": [
          //   {
          //     "id": "string",
          //     "filePath": "string",
          //     "fileName": "string",
          //     "documentType": "string",
          //     "documentDescription": "string",
          //     "documentName": "string"
          //   }
          // ],
          // "site": {
          //   "sites": [
          //     {
          //       "id": "string",
          //       "departmentList": {
          //         "departments": [
          //           {
          //             "id": "string",
          //             "departmentName": {
          //               "departmentName": "string"
          //             }
          //           }
          //         ]
          //       },
          //       "siteName": {
          //         "siteName": "string"
          //       }
          //     }
          //   ]
          // },
          // "departmentList": {
          //   "departments": [
          //     {
          //       "id": "string",
          //       "departmentName": {
          //         "departmentName": "string"
          //       }
          //     }
          //   ]
          // },
          "contractTerm": {
            "startDate": contractTermPeriodFrom.toString(),
            "endDate": contractTermPeriodTo.toString(),
            "effectiveDate": contractEffectiveDate.toString(),
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
              "autoRenewalCalender": selectedContractContinuationPolicy === 'AUTORENEWAL' ? autoRenewal.calendar : ''
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
      let file;
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

    console.log('selected user',selectContractManager);
    const onSelect = useCallback((selectedItem) => {
      setSelectContractManager(selectedItem.id);
    }, []);

    const onSelectContractId = useCallback((selectedItem) => {
      setContractPriorId({...contractPriorId, id:selectedItem?.contractDetails?.contractId?.id, na:false});
    }, []);


    const getTagProps = (_v, index) => ({
        minimal: true,
    });

    const handleTagsRemove = (tags, index) => {
        const updatedTags = [tags];
        updatedTags.splice(index, 1);
        tags = updatedTags;
        setTags(tags);
    };

    const handleTagSet2Add = values => {
        setTagSet2([...tags, values]);
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
        contracts?.map((option) => ({
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

    const handleFileChange = (e,i,name) => {
      let temp = fullyExecutedContractData;
      temp[i] = {...temp[i], [name]:e.target.value};
      setFullyExecutedContractData(temp);
    }

    const getReminder = () => {
      let temp = [];
      for(let i=0;i<renewalReminder?.length;i++){
        temp[i] = (
          <div className={`${style.renewalRemainderBoxGrid} ${style.marginBottom}`} key={`reminder${i}`}>
              <div className={style.marginTop}>Set Renewal Reminder*</div>
              <EditableText className={style.inputRenewalRemainderStyle} defaultValue={renewalReminder?.[i]?.days} placeholder="" onChange={(e)=>handleReminder(e,i)}/>
              <Icon icon="cross" className={style.marginTop10} color="black" onClick={()=>removeReminder(i)}/>
          </div>
        )
      }
      setReminderFields(temp);
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
      temp.push({type:'',name:'',desc:''});
      setFullyExecutedContractData(temp);
    }

    console.log('contracts',contracts,priorContractItems);

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
                      onChange={(e) => handleFileChange(e,i,'type')}
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
              <InputGroup className={`${style.fullWidth} ${style.marginTop10}`} placeholder="Document Name" value={fullyExecutedContractData[i].name} onChange={(e)=>handleFileChange(e,i,'name')}/>
              <TextArea rows={4} placeholder="Document Description" className={`${style.fullWidth} ${style.marginTop10}`} value={fullyExecutedContractData[i].desc} onChange={(e)=>handleFileChange(e,i,'desc')}/>
              <div className={`${style.floatRight} ${style.displayInRow} ${style.marginTop10}`}>
                  <div></div>
                  <FileInput text="Choose file..."  className={style.fileInputWidth} onChange={(e)=>handleFileUpload(i,e)}/>
              </div>
          </div>
        )
      }
      setDocumentFields(temp);
    }

    console.log('User',selectContractManager);

    return(
        <div className={style.cloneBlockStyle}>
            <div className={`${style.newContractFromCloneBoxStyle}`}>
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>Contract / Agreement Name*</div>
                    <InputGroup placeholder="Contract Name" className={style.fullWidth} value={contractName} onChange={(e)=>setContractName(e.target.value)}/>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contract ID*</div>
                    <div className={style.displayInRow}>
                        <InputGroup placeholder="Contract Id" value={contractId.id} className={`${style.entityFieldWidth} ${style.alertValidationInputStyle}`} onChange={(e)=>setContractId({...contractId, id:e.target.value, missing:false})}/>
                      <Checkbox label="Missing"  checked={contractId.missing} onChange={(e)=>setContractId({...contractId, missing:e.target.checked, id:''})}/>
                    </div>
                </div>
                <div className={contracts?.length !== 0 ? `${style.extentionGrid} ${style.marginTop20}`:`${style.extentionGrid} ${style.marginTop20} ${style.disabledView} `}>
                    <div className={style.extentionLableStyle}>Prior Contract ID*</div>
                    <div className={style.displayInRow}>
                        <DatalistInput items={priorContractItems || []} onSelect={onSelectContractId} className={style.selectFieldWidth} placeholder="Search by CID / Name" />
                        <Checkbox label="NA"  checked={contractPriorId.na} onChange={(e)=>setContractPriorId({...contractPriorId, id:'', na:e.target.checked})} className={`${style.marginTop10} ${style.marginLeft20}`}/>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Assigned Contract Manager*</div>
                    <div className={style.displayInRow}>
                    <div>
                        <DatalistInput items={items} onSelect={onSelect}  onChange={(e)=>setUserName(e.target.value)} className={style.selectFieldWidth} />
                        {!items?.map(data=>data.name?.firstName)?.includes(userName) && (

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
                                    <Switch checked={fullyExecutedContract} className={`${style.floatLeft}`} onChange={() => setFullyExecutedContract(!fullyExecutedContract)}  />
                                }
                                className={`${style.switchFontStyle} ${style.marginTop} ${style.flexLeft}`}
                                label={fullyExecutedContract ? 'YES' : "NO"}
                            />
                            {fullyExecutedContract && (
                                <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} onClick={()=>{addNewDocumentField()}}>ADD MORE</button>
                            )}
                        </div>
                        {fullyExecutedContract && (
                          documentFields
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
                                    <DatalistInput items={siteItems} placeholder="Select Sites" onSelect={onSelect}  className={`${style.selectFieldSwitchWidth} ${style.marginLeft20}`} />
                                    <div className={`${style.addSymbolStyle} ${style.marginLeft20}`} onClick={()=>{setSelectedSite([...selectedSite,])}}><span className={style.plusSymbolPosition}>+</span></div>
                                </div>
                            )}
                        </div>
                        {siteSpecific && (
                            <TagInput
                                placeholder="Enter tags/keywords relative to the post"
                                values={tags}
                                className={`${style.marginTop20}`}
                                // onAdd={handleTagsAdd}
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
                                          value={selectedRole || 'Select...'}
                                          onChange={(e) => setSelectedRole(e.target.value)}
                                          className={`${style.fullWidth} ${style.marginLeft20} `}>
                                              <option value="Contract Manager" >
                                              Contract Manager
                                              </option>
                                              <option value="User" >
                                              User
                                              </option>
                                      </select>
                                  </div>
                                  {selectedRole === "User" && (
                                    <div className={`${style.roleBoxStyle} ${style.marginLeft20} ${style.floatRight}`}>
                                      {
                                        // roles?.map(data=>(
                                          <Checkbox label={'data.roleName'} />
                                        // ))
                                      }
                                    </div>
                                  )}
                                </div>
                            )}
                        </div>
                        {departmentSpecific && (
                            <TagInput
                                placeholder="Enter tags/keywords relative to the post"
                                values={tagSet2}
                                className={`${style.marginTop20}`}
                                onAdd={handleTagSet2Add}
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
                            minDate={new Date()}
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
                        minDate={contractTermPeriodFrom}
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
                                    <option value="Select Value" >
                                    Select Value
                                    </option>
                                    <option value="AUTORENEWAL" >
                                    Auto Renewal
                                    </option>
                                    <option value="Written Contract Extension For Fixed Term" >
                                    Written Contract Extension For Fixed Term
                                    </option>
                                    <option value="New Contract On Expiration" >
                                    New Contract On Expiration
                                    </option>
                                    <option value="One Time Contract - Terminate On Expiration" >
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
                                            <option value="DAYS" >
                                            Days
                                            </option>
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
                        {(selectedContractContinuationPolicy === "Written Contract Extension For Fixed Term"
                            || selectedContractContinuationPolicy === "New Contract On Expiration"
                            || selectedContractContinuationPolicy === "One Time Contract - Terminate On Expiration") && (
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
