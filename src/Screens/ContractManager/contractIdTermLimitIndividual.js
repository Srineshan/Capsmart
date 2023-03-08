import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TextArea, Icon, TagInput, FileInput, EditableText, Divider } from '@blueprintjs/core';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import cloneDeep from 'lodash.clonedeep';
import TextField from '@mui/material/TextField';
import { TimePicker } from "@blueprintjs/datetime";
import InputAdornment from '@mui/material/InputAdornment';
import DatalistInput from 'react-datalist-input';
import { GET, PUT, POST, role, TenantID } from './../dataSaver';
import SiteDepartmentField from '../../Components/ReusableSmallComponents/siteDepartmentField';
import AddNewContractManager from './addNewContractManager';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { Auth } from './../../utils/auth'
import { format, sub, add } from 'date-fns';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { GetDateFromHours } from './../../utils/formatting';
import axios from 'axios';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import CommonSwitch from '../../Components/CommonFields/CommonSwitch';
import CommonDateField from '../../Components/CommonFields/CommonDateField';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

import style from './index.module.scss';
import { DetailsTwoTone } from '@material-ui/icons';

const VALUES = ['Site 1', "Site 2"];
const VALUES2 = ['Department 1', "Department 2", "Department 3"];
const TEXTFIELDLEN = 100;
const DESCLEN = 250;

const ContractIdTermLimitIndividual = (
  { contracts,
    getViewPage1,
    getViewPage2,
    getCurrentPage,
    contractType,
    selectedContractType,
    getContractId,
    setName,
    setFileFields,
    fileData,
    contractIdFromActive,
    method,
    isMultiSiteEntity,
    checkFieldAndPopAlert,
    getShowAlert,
    isEditable,
    getTabDataStatus,
  }) => {
  const [calendarStart, setCalendarStart] = useState(false);
  const [calendarEnd, setCalendarEnd] = useState(false);
  const [calendarEffective, setCalendarEffective] = useState(false);
  const [selectContractManager, setSelectContractManager] = useState();
  const [siteSpecific, setSiteSpecific] = useState(false);
  const [selectedContractContinuationPolicy, setSelectedContractContinuationPolicy] = useState('');
  const [item, setItem] = useState();
  const [contractData, setContractData] = useState();
  const [addNewManagerDialog, setAddNewManagerDialog] = useState(false);
  const [fullyExecutedContract, setFullyExecutedContract] = useState(false);
  const [fullyExecutedContractData, setFullyExecutedContractData] = useState(fileData);
  const [fileFieldData, setFileFieldData] = useState({ id: '', type: '', name: '', desc: '', fileName: '', file: null, filePath: '' });
  const [files, setFiles] = useState([]);
  const [departmentSpecific, setDepartmentSpecific] = useState(false);
  const [contractTermPeriodFrom, setContractTermPeriodFrom] = useState(null);
  const [contractTermPeriodTo, setContractTermPeriodTo] = useState(null);
  const [contractEffectiveDate, setContractEffectiveDate] = useState(null);
  const [contractName, setContractName] = useState('');
  const [contractId, setContractId] = useState({ id: '', missing: false });
  const [contractPriorId, setContractPriorId] = useState({ id: '', na: false });
  const [user, setUsers] = useState([]);
  const [sites, setSites] = useState();
  const [selectedSites, setSelectedSites] = useState([]);
  const [autoRenewal, setAutoRenewal] = useState({ renewalTerm: '0', allowableRenewalTerm: '0', calendar: 'WEEKS' });
  const [renewalReminder, setRenewalreminder] = useState([{ 'days': 0 }]);
  const [reminderFields, setReminderFields] = useState([]);
  const [documentFields, setDocumentFields] = useState([]);
  const [userName, setUserName] = useState('');
  const [selectedDepartmentSites, setSelectedDepartmentSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [createdContractId, setCreatedContractId] = useState(contractIdFromActive);
  const [contractedTimeCommitment, setContractTimeCommitment] = useState({ value: 0, frequency: '' });
  const [continueLoading, setContinueLoading] = useState(false);

  useEffect(() => {
    if (method === 'PUT' && createdContractId !== '') {
      getContractDetail();
    }
    getUserData();
    getSites();
  }, [])

  useEffect(() => {
    if (selectedSites?.length === 0 && sites?.length !== 0) {
      if (isMultiSiteEntity) {
        setSelectedSites([]);
        setSelectedSite('');
      } else {
        setSelectedSites(sites?.filter((data, index) => index === 0)?.map(data => data));
        setSelectedSite(sites?.[0]?.id);
      }
    }
  }, [isMultiSiteEntity, sites])

  useEffect(() => {
    getReminder();
  }, [renewalReminder])

  useEffect(() => {
    getReminder();
  }, [renewalReminder])

  useEffect(() => {
    getContractDetail();
    getContractId(createdContractId);
  }, [createdContractId])

  useEffect(() => {
    setFullyExecutedContractData(fileData);
  }, [fileData])

  useEffect(() => {
    setFileFields(fullyExecutedContractData);
  }, [fullyExecutedContractData])

  console.log('manager', selectContractManager);
  useEffect(() => {
    setSelectContractManager(user?.filter(data => data?.id === contractData?.contractManager?.userID)?.map(data => data)[0] || undefined);
  }, [user, contractData])

  useEffect(() => {
    if (departmentSpecific) {
      let temp = [];
      const siteList = siteSpecific ? cloneDeep(selectedSites) : cloneDeep(sites);
      siteList?.map(data => {
        data.departmentList.departments = [];
        temp.push(data);
      })
      setSelectedDepartmentSites(temp);
    } else {
      setSelectedDepartmentSites([]);
    }
  }, [selectedSites?.length, departmentSpecific, siteSpecific])


  const getContractDetail = async () => {
    const { data: contractData } = await GET(`contract-managment-service/contracts/${createdContractId}/contractDetail`);
    if (contractData) {
      let contractDetail = contractData?.contractDetail;
      setContractData(contractData?.contractDetail);
      setName(contractData?.contractName?.contractName || '');
      setContractName(contractData?.contractName?.contractName);
      setContractId({ id: contractDetail?.contractId?.id, missing: contractDetail?.contractIdMissing });
      setDepartmentSpecific(contractDetail?.departmentSpecificContract);
      setSiteSpecific(contractDetail?.siteSpecificContract);
      setContractTimeCommitment(contractDetail?.timeCommitment || {});
      setFullyExecutedContract(contractDetail?.fullyExecutedContract);
      // setSelectContractManager(user?.filter(data => data?.id === contractDetail?.contractManager?.userID)?.map(data => data)[0] || undefined);
      setContractPriorId({ id: contractDetail?.priorContract?.id, na: contractDetail?.priorContract?.notApplicable });
      setContractTermPeriodFrom(contractDetail?.contractTerm?.startDate !== null ? new Date(contractDetail?.contractTerm?.startDate) : null);
      setContractTermPeriodTo(contractDetail?.contractTerm?.endDate !== null ? new Date(contractDetail?.contractTerm?.endDate) : null);
      setContractEffectiveDate(contractDetail?.contractTerm?.effectiveDate !== null ? new Date(contractDetail?.contractTerm?.effectiveDate) : null);
      setSelectedContractContinuationPolicy(contractDetail?.continuationPolicy?.contractPolicyType);
      let continuation = contractDetail?.continuationPolicy?.autoRenewalPeriod;
      setAutoRenewal({ renewalTerm: continuation?.autoRenewalTerm?.term.toString(), allowableRenewalTerm: continuation?.allowableAutoRenewalTerm?.term.toString(), calendar: continuation?.autoRenewalCalender })
      setRenewalreminder(contractDetail?.continuationPolicy?.reminderList?.renewalReminderList || [{ days: 0 }]);
      let fileData = [];
      contractDetail?.contractFiles?.map(data => {
        fileData.push({ id: data?.id, type: data?.documentType, name: data?.documentName, desc: data?.documentDescription, fileName: data?.fileName, file: null, filePath: data?.fileURL })
      })
      if (fullyExecutedContractData?.length === 0) {
        setFullyExecutedContractData(fileData);
      }
      setSelectedSites(contractDetail?.site?.sites || []);
      onSelectDepartment(contractDetail?.site?.sites || []);
      if (contractDetail?.site?.sites?.length === 0) {
        getSites();
      }
    }
  }

  console.log('departments', selectedDepartmentSites, selectedSites);

  const getUserData = async () => {
    const { data: user } = await GET('user-management-service/user/role?role=Contract Manager');
    if (user) {
      setUsers(user);
    }
  }

  const getSites = async () => {
    const { data: sitesList } = await GET('entity-service/sites');
    setSites(sitesList);
  }
  const getAddNewManagerDialog = (value) => {
    setAddNewManagerDialog(value);
  }

  const handleFileUpload = (e) => {
    setFileFieldData({ ...fileFieldData, file: e.target.files[0], fileName: e.target.files?.[0]?.name });
  }

  const getSiteData = () => {
    let siteData = [];
    if (!siteSpecific && !departmentSpecific) {
      siteData = sites;
    } else if (siteSpecific && !departmentSpecific) {
      siteData = selectedSites;
    } else {
      siteData = selectedDepartmentSites;
    }

    return siteData;
  }

  const addContract = async (buttonType) => {
    setContinueLoading(true);
    let sites = getSiteData();
    if (contractName === '') {
      ErrorToaster('Enter Contract Name to proceed');
      return;
    }
    if (departmentSpecific && sites?.some(data => data?.departmentList?.departments?.length === 0)) {
      ErrorToaster('Select Departments for all the selected Sites');
      return;
    }
    if (selectContractManager === null || selectContractManager === undefined) {
      ErrorToaster('Select Contract Manager');
      return;
    }

    let contractFiles = [];
    fullyExecutedContract && fullyExecutedContractData?.filter(data => data?.file !== null)?.map(data => {
      contractFiles?.push({
        fileName: data.fileName,
        documentType: data.type,
        documentDescription: data.desc,
        documentName: data.name,
      })
    })


    let data = {
      ...(createdContractId !== '' && method !== 'POST' && { 'id': createdContractId }),
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
          "sites": sites
        },
        "contractTerm": {
          "startDate": contractTermPeriodFrom === null ? null : format(contractTermPeriodFrom, 'yyyy-MM-dd').toString(),
          "endDate": contractTermPeriodTo === null ? null : format(contractTermPeriodTo, 'yyyy-MM-dd').toString(),
          "effectiveDate": contractEffectiveDate === null ? null : format(contractEffectiveDate, 'yyyy-MM-dd').toString(),
        },
        ...(selectedContractContinuationPolicy !== '' && {
          "continuationPolicy": {
            "contractPolicyType": selectedContractContinuationPolicy,
            "autoRenewalPeriod": {
              ...(parseInt(autoRenewal.renewalTerm) && {
                "autoRenewalTerm": {
                  "term": selectedContractContinuationPolicy === 'AUTORENEWAL' ? parseInt(autoRenewal.renewalTerm) : 0,
                }
              }),
              ...(parseInt(autoRenewal.allowableRenewalTerm) && {
                "allowableAutoRenewalTerm": {
                  "term": selectedContractContinuationPolicy === 'AUTORENEWAL' ? parseInt(autoRenewal.allowableRenewalTerm) : 0,
                }
              }),
              ...(autoRenewal.calendar !== '' &&
              {
                "autoRenewalCalender": selectedContractContinuationPolicy === 'AUTORENEWAL' ? autoRenewal.calendar : 'WEEKS'
              })
            },
            "reminderList": {
              "renewalReminderList": renewalReminder
            }
          }
        }),
        "timeCommitment": {
          "value": parseInt(contractedTimeCommitment?.value),
          "frequency": contractedTimeCommitment?.frequency,
        },
        "contractIdMissing": contractId?.missing,
        "fullyExecutedContract": fullyExecutedContract,
        "siteSpecificContract": siteSpecific,
        "departmentSpecificContract": departmentSpecific,
      },
      "newContract": selectedContractType === 'New Contract' ? true : false
    }

    const formData = new FormData();
    let file = fullyExecutedContractData?.map(data => data.file);
    formData.append('contractDetail', new Blob([JSON.stringify(data)], {
      type: "application/json"
    }));
    file?.filter(data => data !== null)?.map(data => {
      formData.append('contractFiles', data);
    })
    if (method === 'POST' && contractIdFromActive === '') {
      await POST('contract-managment-service/contracts/contractDetail', formData)
        .then(response => {
          getContractId(response?.data);
          SuccessToaster('Contract Draft Saved Successfully');
        }).catch(error => {
          ErrorToaster('Unexpected Error Creating Contract');
        })
    } else {
      await PUT(`contract-managment-service/contracts/${contractIdFromActive}/contractDetail`, formData)
        .then(response => {
          SuccessToaster('Contract Updated Successfully');
        }).catch(error => {
          ErrorToaster('Unexpected Error Updating Contract');
        })
    }
    setContinueLoading(false);
    if (buttonType === 'Continue') {
      getViewPage2(true);
      getViewPage1(false);
      getCurrentPage('Contracted Services Provider(s)')
    } else {
      getShowAlert(true);
    }
    getTabDataStatus();
  }

  const onSelect = (selectedItem) => {
    setSelectContractManager(selectedItem);
  }

  const onSelectSite = (selectedItem) => {
    setItem(selectedItem);
    let temp = selectedSites || [];
    if (!selectedSites?.includes(selectedItem)) {
      temp.push(selectedItem);
    }
    setSelectedSites(temp);
    setDepartmentSpecific(false);
    siteFieldCheck(siteSpecific)
  }


  const onSelectContractId = (selectedItem) => {
    setContractPriorId({ ...contractPriorId, id: selectedItem?.contractDetails?.contractId?.id, na: false });
  }

  const handleTagsRemove = (tags, index) => {
    let siteId = selectedSites?.filter((data, indexVal) => index === indexVal)?.map(data => data?.id)[0];
    setSelectedSites(selectedSites?.filter((data, indexValue) => index !== indexValue)?.map(data => data));
    setDepartmentSpecific(false);
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
      contracts?.filter(data => data?.contractDetail?.contractId !== null)?.map((option) => ({
        id: option?.contractDetail?.contractId?.id,
        value: option?.contractDetail?.contractId?.id,
        ...option,
      })),
    [contracts],
  );

  const addReminder = () => {
    let temp = renewalReminder;
    temp.push({ 'days': 0 });
    setRenewalreminder(temp);
    getReminder();
  }

  const removeReminder = (index) => {
    setRenewalreminder(renewalReminder?.filter((data, indexValue) => index !== indexValue)?.map(data => data));
  }

  const handleReminder = (e, i) => {
    let temp = renewalReminder;
    temp[i] = { 'days': parseInt(e.target.value) };
    setRenewalreminder(temp);
  }

  const handleFileChange = (e, name) => {
    setFileFieldData({ ...fileFieldData, [name]: e.target.value });
  }

  const getReminder = () => {
    let temp = [];
    for (let i = 0; i < renewalReminder?.length; i++) {
      temp[i] = (
        <div className={`${style.renewalRemainderBoxGrid} ${style.marginBottom}`} key={`reminder${i}-${renewalReminder?.[i]?.days}`}>
          <div className={style.verticalAlignCenter}>
            Set Renewal Reminder*
          </div>
          {/* <div className={style.displayInRow}>
            <EditableText className={style.inputRenewalRemainderStyle} defaultValue={renewalReminder?.[i]?.days} placeholder="" onChange={(e) => handleReminder(e, i)} key={`days${i}${renewalReminder?.[i]?.days}`} />
            <div className={`${style.marginTop10} ${style.marginLeft20}`}>Days</div>
          </div> */}
          <div className={style.renewalWidth}>
            <CommonTextField
              InputProps={{
                endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Days</InputAdornment>,
              }}
              onChange={(e) => handleReminder(e, i)}
              key={`days${i}${renewalReminder?.[i]?.days}`}
              defaultValue={renewalReminder?.[i]?.days}
            />
          </div>
          <div className={style.verticalAlignCenter}>
            {renewalReminder?.length !== 1 && (
              <Icon icon="cross" color="#a0a5ab" onClick={() => removeReminder(i)} />
            )}
          </div>
        </div>
      )
    }
    setReminderFields(temp);
  }

  const addNewDocumentField = () => {
    let temp = fullyExecutedContractData;
    temp.push(fileFieldData);
    setFileFields(temp);
    setFullyExecutedContractData(temp);
    setFileFieldData({ id: '', type: '', name: '', desc: '', fileName: '', file: null, filePath: '' });
  }

  const onSelectDepartment = (data) => {
    setSelectedDepartmentSites(data);
  }

  const getDocumentFields = () => {
    let temp = [];
    for (let i = 0; i < fullyExecutedContractData?.length; i++) {
      temp[i] = (
        <div>
          <div className={style.reduce10Left}>
            <select
              name="class"
              id="Class"
              value={fullyExecutedContractData[i].type || 'Select...'}
              onChange={(e) => handleFileChange(e, 'type')}
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
          <CommonInputField className={`${style.fullWidth} ${style.marginTop10}`} placeholder="Document Name" value={fullyExecutedContractData[i].name} onChange={(e) => handleFileChange(e, 'name')} />
          <TextArea rows={4} placeholder="Document Description" className={`${style.fullWidth} ${style.marginTop10}`} value={fullyExecutedContractData[i].desc} onChange={(e) => handleFileChange(e, 'desc')} />
          <div className={style.grid2}>
            <CommonInputField value={fullyExecutedContractData?.[i]?.fileName !== '' ? fullyExecutedContractData?.[i]?.fileName : ''} leftElement={leftElement()} className={`${style.fullWidth} ${style.marginTop10}`} onChange={(e) => handleFileUpload(i, e)} />
          </div>
        </div>
      )
    }
    setDocumentFields(temp);
  }

  const leftElement = () => {
    return (
      <div>
        <label for="file-upload" className={style.customFileUpload}>
          Choose File
        </label>
        <input id="file-upload" type="file" accept="image/*, .pdf" onChange={(e) => handleFileUpload(e)} />
      </div>
    )
  }

  const disableFileAddButton = () => {
    if (fileFieldData?.type !== '' && fileFieldData?.name !== '' && fileFieldData?.file !== null) {
      return false;
    } else {
      return true;
    }
  }

  const handleDepartmentSpecific = () => {
    setDepartmentSpecific(!departmentSpecific);
  }

  const siteFieldCheck = (value) => {
    checkFieldAndPopAlert(value ? selectedSites?.length : true, 'Site Specific Contract')
  }

  const deptFieldCheck = (value) => {
    checkFieldAndPopAlert(value ? sites?.filter(data => data?.departmentList?.departments?.length !== 0)?.map(data => data)?.length : true, 'Department Specific Contract')
  }

  const changeContractFile = (value) => {
    if (fullyExecutedContractData?.length === 0 || value) {
      setFullyExecutedContract(value);
    }
  }

  console.log('contract', contractTermPeriodFrom, contractTermPeriodTo);

  return (
    <div className={style.cloneBlockStyle}>
      <div className={`${style.newContractFromCloneBoxStyle}`}>
        <div className={`${style.extentionGrid}`}>
          <CommonLabel value='Contract / Agreement Name*' />
          <CommonInputField placeholder="Contract Name" className={style.fullWidth} value={contractName}
            maxLength={TEXTFIELDLEN} onChange={(e) => { setContractName(e.target.value); setName(e.target.value) }}
            onFocus={() => { checkFieldAndPopAlert(contractName, 'Contract / Agreement Name') }} />
        </div>
        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel value='Contract ID / Resolution No*' />
          <div className={style.displayInRow}>
            <CommonInputField placeholder="Contract ID / Resolution No" value={contractId.id} disabled={contractId.missing}
              maxLength={TEXTFIELDLEN}
              onFocus={() => { checkFieldAndPopAlert(contractId?.id, 'Contract ID') }} className={`${style.entityFieldWidth}`} onChange={(e) => setContractId({ ...contractId, id: e.target.value, missing: false })} />
            <CommonCheckBox label="Missing" checked={contractId.missing} onChange={(e) => setContractId({ ...contractId, missing: e.target.checked, id: '' })} className={` ${style.marginLeft20}`} />
          </div>
        </div>
        {selectedContractType !== "New Contract" && (
          <div className={contracts?.length !== 0 ? `${style.extentionGrid} ${style.marginTop20}` : `${style.extentionGrid} ${style.marginTop20} ${style.disabledView} `}>
            <CommonLabel value='Prior Contract ID*' />
            <div className={style.displayInRow}>
              <DatalistInput items={priorContractItems || []}
                onSelect={onSelectContractId} className={style.selectFieldWidth}
                maxLength={TEXTFIELDLEN}
                onChange={(e) => setContractPriorId({ ...contractPriorId, id: e.target.value })} placeholder="Search by CID / Name" value={contractPriorId?.id}
              />
              <CommonCheckBox label="NA" checked={contractPriorId.na} onChange={(e) => setContractPriorId({ ...contractPriorId, id: '', na: e.target.checked })} className={` ${style.marginLeft20}`} />

            </div>
          </div>
        )}
        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel value='Assigned Contract Manager*' />
          <div className={style.displayInRow}>
            <div className={style.fullWidth}>
              <DatalistInput items={items || []} onSelect={onSelect}
                onChange={(e) => setUserName(e.target.value)}
                className={style.selectAssignedContractFieldWidth}
                maxLength={TEXTFIELDLEN}
                value={`${contractData?.contractManager?.name?.firstName || ''} ${contractData?.contractManager?.name?.lastName || ''}`}
                onFocus={() => { checkFieldAndPopAlert(selectContractManager, 'Assigned Contract Manager') }} />
              {(!items?.map(data => data?.name?.firstName)?.includes(userName) && userName !== '') && (
                <div className={`${style.addBoxDescription} ${style.marginTop}`}>
                  The Contract Manager you are trying to add is not a registered
                  user. To add a new contract manager click on the "ADD" button.
                </div>
              )}
            </div>
            <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} ${(items?.map(data => data?.name?.firstName)?.includes(userName) || userName === '') && style.disabledUploadButton}`} disabled={(items?.map(data => data?.name?.firstName)?.includes(userName) || userName === '')} onClick={() => setAddNewManagerDialog(true)} >ADD</button>
          </div>
        </div>


        {
          //// Contract Access Previlege Field DO NOT DELETE THIS ////
          // <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          //   <div className={style.extentionLableStyle}>Contract Access Privilege To Other Contract Manager</div>
          //   <div className={style.verticalAlignCenter}>
          //     <ThemeProvider theme={switchTheme}>
          //   <FormControlLabel
          //     control={
          //       <Switch checked={contractAccessPrivilege} className={`${style.floatLeft}`} onChange={() => { setContractAccessPrivilege(!contractAccessPrivilege) }} />
          //     }
          //     color='primary'
          //     className={`${style.switchFontStyle} ${style.marginTop} ${style.flexLeft}`}
          //     label={contractAccessPrivilege ? 'YES' : "NO"}
          //   />
          // </ThemeProvider>
          //     {contractAccessPrivilege ? (
          //       <LockOpenOutlinedIcon className={style.lockStyle} style={{ color: '#14B15A' }} />
          //     ) : (
          //       <LockOutlinedIcon className={style.lockStyle} style={{ color: '#F94848' }} />
          //     )}
          //   </div>
          // </div>
        }

        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel value='Contract Documents On File*' />
          <div onFocus={() => { checkFieldAndPopAlert(fullyExecutedContractData?.length, 'Fully Executed Contract on File') }}>
            <div className={`${style.spaceBetween}`}>
              <CommonSwitch checked={fullyExecutedContract} className={`${style.switchFontStyle} ${style.flexLeft}`}
                label={fullyExecutedContract ? 'YES' : "NO"}
                onChange={() => changeContractFile(!fullyExecutedContract)}
              />
            </div>
            {fullyExecutedContract && (
              <div>
                <div>
                  <CommonSelectField value={fileFieldData?.type || 'Select...'} onChange={(e) => handleFileChange(e, 'type')}
                    className={`${style.fullWidth}`} firstOptionLabel={'Select...'} firstOptionValue={'Select...'}
                    valueList={['Agreement Draft', 'Executed Agreement', 'Contract Amendment', 'Exhibit', 'Appendix Addendum', 'Schedule', 'Attachment']}
                    labelList={['Agreement Draft', 'Executed Agreement', 'Contract Amendment', 'Exhibit', 'Appendix Addendum', 'Schedule', 'Attachment']}
                    disabledList={[false, false]} />
                </div>
                <CommonInputField className={`${style.fullWidth} ${style.marginTop10}`} placeholder="Document Name"
                  value={fileFieldData?.name}
                  maxLength={TEXTFIELDLEN}
                  onChange={(e) => handleFileChange(e, 'name')} />
                <TextArea rows={4} placeholder="Document Description" value={fileFieldData?.desc}
                  maxLength={DESCLEN} className={`${style.fullWidth} ${style.marginTop10}`} onChange={(e) => handleFileChange(e, 'desc')} />
                <div>
                  <CommonInputField value={fileFieldData?.fileName !== '' ? fileFieldData?.fileName : ''} leftElement={leftElement()} className={`${style.fullWidth} ${style.marginTop10}`} onChange={(e) => handleFileUpload(e)} />
                </div>
              </div>
            )}
            <div className={`${style.spaceBetween} ${style.marginTop}`}>
              <div></div>
              {fullyExecutedContract && (
                <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} ${(fileFieldData?.type === '' || fileFieldData?.name === '' || fileFieldData?.file === null) && style.disabledUploadButton}`} disabled={fileFieldData?.type === '' || fileFieldData?.name === '' || fileFieldData?.file === null} onClick={() => { addNewDocumentField() }}>UPLOAD</button>
              )}
            </div>
          </div>
        </div>
        {isMultiSiteEntity &&
          <div className={`${style.extentionGrid} ${style.marginTop20}`}
            onFocus={() => siteFieldCheck(siteSpecific)}>
            <CommonLabel value='Site Specific Contract*' />
            <div>
              <div className={style.displayInRow}>
                <CommonSwitch checked={siteSpecific} className={`${style.textAlignLeft} ${style.switchFontStyle}`} label={siteSpecific ? 'YES' : "NO"} onChange={() => { setSiteSpecific(!siteSpecific); siteFieldCheck(!siteSpecific); }} />
                {siteSpecific && (
                  <div className={style.displayInRow}>
                    <DatalistInput items={siteItems || []} placeholder="Select Sites" onSelect={onSelectSite} className={`${style.selectFieldSwitchWidth} ${style.marginLeft20}`} />
                    {
                      // <div className={`${style.addSymbolStyle} ${style.marginLeft20}`} onClick={()=>{setSelectedSites([...selectedSites,])}}><span className={style.plusSymbolPosition}>+</span></div>
                    }
                  </div>
                )}
              </div>
              {siteSpecific && (
                <TagInput
                  placeholder="Selected Sites"
                  values={selectedSites?.map(data => data?.siteName?.siteName) || []}
                  className={`${style.marginTop20}`}
                  onRemove={handleTagsRemove}
                  separator={/[\s,]/}
                  addOnBlur={true}
                  addOnPaste={true}
                />
              )}
            </div>
          </div>
        }

        <div className={`${style.extentionGrid} ${style.marginTop20}`}
          onFocus={() => { deptFieldCheck(departmentSpecific) }}>
          <CommonLabel value='Department Specific Contract*' />
          <CommonSwitch checked={departmentSpecific} className={` ${style.textAlignLeft} ${style.switchFontStyle}`}
            label={departmentSpecific ? 'YES' : "NO"} onChange={() => { handleDepartmentSpecific(); deptFieldCheck(!departmentSpecific) }} />
        </div>

        {
          departmentSpecific &&
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div></div>
            <SiteDepartmentField sites={(siteSpecific || !isMultiSiteEntity) ? selectedSites?.map(data => data) : sites} getSelectedSites={onSelectDepartment} selectedSites={selectedDepartmentSites} isMultiSiteEntity={isMultiSiteEntity} />
          </div>
        }

        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel value='Contract Term Period*' />
          <div className={style.termPeriodGrid}>
            <div onFocus={() => { checkFieldAndPopAlert(contractTermPeriodFrom, 'Contract Term Period Start Date') }}>
              <CommonDateField
                open={calendarStart}
                onOpen={() => setCalendarStart(true)}
                onClose={() => setCalendarStart(false)}
                minDate={sub(new Date(), { years: 3 })}
                maxDate={add(new Date(), { months: 6 })}
                value={contractTermPeriodFrom}
                onChange={(newValue) => {
                  // setCalendarStart(true);
                  setContractTermPeriodFrom(newValue);
                  setContractEffectiveDate(newValue);
                }}
                InputProps={{
                  style: {
                    fontSize: 14,
                    height: 30,
                  },
                  // onFocus: e => {
                  //   setCalendarStart(true);
                  // },
                  // onBlur: e => {
                  //   setCalendarStart(false);
                  // }
                }}
                renderInput={(params) => <TextField {...params}
                  // onClick={() => setCalendarStart(true)}
                  inputProps={{
                    ...params.inputProps,
                    placeholder: "Start Date"
                  }} />}
              />
            </div>
            <p className={`${style.toStyle} ${style.alignCenter}`}>To</p>
            <div onFocus={() => { checkFieldAndPopAlert(contractTermPeriodTo, 'Contract Term Period End Date') }}>
              <CommonDateField
                open={calendarEnd}
                onOpen={() => setCalendarEnd(true)}
                onClose={() => setCalendarEnd(false)}
                value={contractTermPeriodTo}
                onChange={(newValue) => {
                  setContractTermPeriodTo(newValue);
                }}
                InputProps={{
                  style: {
                    fontSize: 14,
                    height: 30,
                  },
                  // onFocus: e => {
                  //   setCalendarEnd(true);
                  // },
                  // onBlur: e => {
                  //   setCalendarEnd(false);
                  // }
                }}
                minDate={contractTermPeriodFrom}
                maxDate={add(new Date(), { years: 5 })}
                renderInput={(params) => <TextField  {...params}
                  //  onClick={() => setCalendarEnd(true)}
                  inputProps={{
                    ...params.inputProps,
                    placeholder: "End Date"
                  }} />}
              />
            </div>
          </div>
        </div>
        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel value='Contracted Services Effective Date*' />
          <div className={`${style.leftAlign} ${style.effectiveDateWidth}`} onFocus={() => { checkFieldAndPopAlert(contractEffectiveDate, 'Contracted Services Effective Date') }}>
            <CommonDateField
              open={calendarEffective}
              onOpen={() => setCalendarEffective(true)}
              onClose={() => setCalendarEffective(false)}
              value={contractEffectiveDate}
              onChange={(newValue) => {
                setContractEffectiveDate(newValue);
              }}
              InputProps={{
                style: {
                  fontSize: 14,
                  height: 30,
                },
                // onFocus: e => {
                //   setCalendarEffective(true);
                // },
                // onBlur: e => {
                //   setCalendarEffective(false);
                // }
              }}
              minDate={contractTermPeriodFrom}
              maxDate={contractTermPeriodTo}
              renderInput={(params) => <TextField  {...params}
                // onClick={() => setCalendarEffective(true)}
                inputProps={{
                  ...params.inputProps,
                  placeholder: "Effective Date"
                }} />}
            />
          </div>
        </div>


        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel value='Contract Time Commitment*' />
          <div className={style.contractedTime}>
            <CommonInputField type="tel" maxLength={3} value={contractedTimeCommitment?.value} placeholder="0" onChange={(e) => e.target.value >= 0 && setContractTimeCommitment({ ...contractedTimeCommitment, value: e.target.value })} />
            <CommonSelectField value={contractedTimeCommitment?.frequency || 'Select...'}
              onChange={(e) => setContractTimeCommitment({ ...contractedTimeCommitment, frequency: e.target.value })}
              className={`${style.timeCommitment}`} firstOptionLabel={'Select...'} firstOptionValue={'Select...'}
              valueList={['WEEK', 'MONTH']}
              labelList={['Weeks Per Contract Year', 'Months Per Contract Year']}
              disabledList={[false, false]} />
          </div>
        </div>

        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
          <CommonLabel value='Contract Continuation Policy*' />
          <div>
            <div onFocus={() => { checkFieldAndPopAlert(selectedContractContinuationPolicy, 'Contract Continuation Policy') }}>
              <CommonSelectField value={selectedContractContinuationPolicy || ''}
                onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                className={`${style.fullWidth}`} firstOptionLabel={'Choose Your Contract Continuation Policy'} firstOptionValue={''}
                valueList={['AUTORENEWAL', 'NEWCONTRACTONEXPIRATION', 'ONETIMECONTRACTTERMINATEONEXPIRATION', 'WRITTENCONTRACTEXTENSIONFORFIXEDTERM']}
                labelList={['Auto Renewal', 'New Contract On Expiration', 'One Time Contract - Terminate On Expiration', 'Extension By Mutual Written Signed Agreement.']}
                disabledList={[false, false]} />
            </div>
            {selectedContractContinuationPolicy === "AUTORENEWAL" && (
              <div className={`${style.renewalBoxStyle}`}>
                <div className={`${style.renewalBoxGrid}`} onFocus={() => { checkFieldAndPopAlert(autoRenewal.renewalTerm, 'Auto Renewal - Auto Renewal Term') }}>
                  <div className={style.marginTop}>Auto Renewal Term*</div>
                  <EditableText className={`${style.inputRenewalStyle}`} placeholder="" value={autoRenewal.renewalTerm} onChange={(e) => (e <= 52 && setAutoRenewal({ ...autoRenewal, renewalTerm: e, calendar: '' }))} type="tel" />
                  <CommonSelectField value={autoRenewal.calendar}
                    onChange={(e) => setAutoRenewal({ ...autoRenewal, calendar: e.target.value })}
                    className={`${style.marginLeft20} ${style.weekSelectStyle}`} firstOptionLabel={'Select Frequecy'} firstOptionValue={''}
                    valueList={['WEEKS', 'MONTHS']}
                    labelList={['Weeks', 'Months']}
                    disabledList={[false, autoRenewal?.renewalTerm > 12]} />
                </div>
                <div className={`${style.renewalBoxGrid}`} onFocus={() => { checkFieldAndPopAlert(autoRenewal.allowableRenewalTerm, 'Auto Renewal - Allowable Auto Renewal Terms') }}>
                  <div className={style.marginTop10}>Allowable Auto Renewal Terms*</div>
                  <EditableText className={`${style.inputRenewalStyle} ${style.marginTop10}`} placeholder="" value={autoRenewal.allowableRenewalTerm} onChange={(e) => (e <= 12 && setAutoRenewal({ ...autoRenewal, allowableRenewalTerm: e }))} type="tel" />
                </div>
              </div>
            )}
            {(selectedContractContinuationPolicy === "WRITTENCONTRACTEXTENSIONFORFIXEDTERM"
              || selectedContractContinuationPolicy === "NEWCONTRACTONEXPIRATION"
              || selectedContractContinuationPolicy === "ONETIMECONTRACTTERMINATEONEXPIRATION") && (
                <div className={`${style.renewalRemainderBoxStyle}`}
                  onFocus={() => {
                    checkFieldAndPopAlert(renewalReminder?.[0]?.days || 0, selectedContractContinuationPolicy === "WRITTENCONTRACTEXTENSIONFORFIXEDTERM"
                      ? "Written Contract Extension - Set Renewal Reminder"
                      : selectedContractContinuationPolicy === "NEWCONTRACTONEXPIRATION"
                        ? "New Contract on Expiration - Set Renewal Reminder"
                        : "One Time Contract - Set Renewal Reminder")
                  }}>
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
      {isEditable &&
        (<div className={`${style.floatRight} ${style.marginTop20}`}>
          <button className={`${style.newContractOutlinedButton} ${style.cursorPointer} ${continueLoading ? style.disabled : ''}`} onClick={!continueLoading ? () => addContract('Save In Progress') : {}}>SAVE IN-PROGRESS</button>
          <button className={`${style.newContractButtonStyle}  ${style.cursorPointer} ${style.marginLeft20} ${continueLoading ? style.disabled : ''}`} onClick={!continueLoading ? () => { addContract('Continue') } : {}}>CONTINUE</button>
        </div>)
      }

      {addNewManagerDialog && (
        <AddNewContractManager getAddNewManagerDialog={getAddNewManagerDialog} contractType={contractType} getUserData={getUserData} contractId={contractIdFromActive} />
      )}

    </div>
  )
}

export default ContractIdTermLimitIndividual;
