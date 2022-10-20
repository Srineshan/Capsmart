import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button } from '@blueprintjs/core';
import { DateInput, IDateFormatProps } from "@blueprintjs/datetime";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {PUT, GET} from './../dataSaver';
import {format, differenceInDays} from 'date-fns';
import style from './index.module.scss';

const ContractExtension = ({getExtensionDialog, contractId, contracts}) => {
    const [selectedContractPolicy, setSelectedContractPolicy] = useState('WRITTENCONTRACTEXTENSIONFORFIXEDTERM');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [file,setFile] = useState(null);
    const [users,setUsers] = useState([]);
    const [documentName, setDocumentName] = useState('');
    const currentContract = contracts?.filter(data=>data?.id === contractId)?.map(data=>data)[0];

    const handleFileUpload = (e) => {
      setFile(e.target.files?.[0])
      console.log('file',e.target.files[0]?.name);
    }
    const expiringIn = differenceInDays(new Date(), new Date(currentContract?.contractDetail?.contractTerm?.endDate))

    useEffect(()=>{
      getUserData();
    }, [])

    const getUserData = async () => {
        const { data: userData } = await GET(`user-management-service/user?contractID=${contractId}`);
        if (userData) {
          setUsers(userData);
        }
    }


    console.log('id',contractId);

    const submit = async() => {
        let data = {
            "contractExtensionDate": {
            "from": format(startDate, 'yyyy-MM-dd').toString(),
            "to": format(endDate, 'yyyy-MM-dd').toString()
              },
            "extensionNotes": {
            "notes": notes
              },
            "contractPolicyType": selectedContractPolicy
        }
        let formData = new FormData();
        formData.append('contractExtension', new Blob([JSON.stringify(data)], {
             type: "application/json"
         }));
        let file = undefined;
        formData.append('extensionFile',file);
        await PUT(`contract-managment-service/contracts/${contractId}/extend`,formData)
        .then(response=>{
        console.log('Contract Updated Successfully');
      }).catch(error=>{
        console.log('Unexpected Error Updating Contract');
      })
    }

    const leftElement = () => {
        return(
          <div>
            <label for="file-upload"  className={style.customFileUpload}>
                Choose File
            </label>
            <input id="file-upload" type="file" onChange={handleFileUpload}/>
          </div>
        )
    }

    const calendarIcon = () => {
        return(
            <Icon icon="calendar" intent={Intent.PRIMARY} className={style.calendarStyle} />
        )
    }


    return(
        <Dialog isOpen={getExtensionDialog} onClose={() => getExtensionDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Contract Extension</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getExtensionDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.spaceBetween}>
                <p className={style.extensionOptionsStyle}>{currentContract?.contractName?.contractName}{` `}({currentContract?.contractDetail?.contractId?.id})</p>
                <p className={style.extensionOptionsStyle}>{currentContract?.contractType === 'INDIVIDUAL' ? 'INDIVIDUAL CONTRACTOR' : `MULTIPLE CONTRACTOR (${users?.length || 0})`}</p>
                <p className={style.extensionOptionsStyle}>{`EXPIRING IN ${expiringIn} DAYS`}</p>
            </div>
            <div className={style.extensionBorder}></div>
            <div className={`${style.extentionBoxStyle}`}>
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>Contract Extension*</div>
                    <div className={style.displayInRow}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={startDate}
                            onChange={(newValue) => {
                              setStartDate(newValue);
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
                    <p className={style.toStyle}>To</p>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={endDate}
                        onChange={(newValue) => {
                          setEndDate(newValue);
                        }}
                        InputProps={{
                          style: {
                              fontSize: 14,
                              height: 30,
                          }
                      }}
                      minDate={startDate}
                        renderInput={(params) => <TextField {...params} inputProps={{
                          ...params.inputProps,
                          placeholder: "Start Date"
                        }}/>}
                      />
                    </LocalizationProvider>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contract Extension Notes*</div>
                    <div>
                        <TextArea
                            rows={4}
                            placeholder='Extension Notes'
                            large={true}
                            value={notes}
                            onChange={(e)=>setNotes(e.target.value)}
                            className={style.fullWidth}
                        />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Executed extension document on File*</div>
                    <div className={style.displayInRow}>
                        <InputGroup value={documentName} placeholder="Document Name" className={style.textFieldWidth} onChange={(e)=>setDocumentName(e.target.value)}/>
                        <InputGroup  leftElement={leftElement()} className={style.marginLeft20} />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                    <div className={`${style.extentionLableStyle}`}>Extension Continuation Policy*</div>
                    <div className={style.reduce10Left}>
                        <select
                            name="class"
                            id="Class"
                            value={selectedContractPolicy || 'Select...'}
                            onChange={(e) => setSelectedContractPolicy(e.target.value)}
                            className={`${style.fullWidth} ${style.marginLeft20}`}>
                                <option value="WRITTENCONTRACTEXTENSIONFORFIXEDTERM">
                                Written Contract Extension For Fixed Term
                                </option>
                                <option value="NEWCONTRACTONEXPIRATION" >
                                New Contract On Expiration
                                </option>
                                <option value="ONETIMECONTRACTTERMINATEONEXPIRATION">
                                One Time Extension - Terminate On Expiration
                                </option>
                        </select>
                    </div>
                </div>
            </div>
            <div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={style.outlinedButton} onClick={() => getExtensionDialog(false)}>CANCEL</button>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={submit}>SAVE</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default ContractExtension;
