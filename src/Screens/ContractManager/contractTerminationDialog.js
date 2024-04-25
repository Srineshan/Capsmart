import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import { format, differenceInDays } from 'date-fns';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { currentUser } from './../../utils/auth';
import { SuccessToaster, ErrorToaster } from './../../utils/toaster';
import { GET, PUT } from './../dataSaver';
import style from './index.module.scss';
import { formatInTimeZone } from 'date-fns-tz'
import { siteTimeZone, timeZoneAbbreviation } from "../../utils/formatting";

const ContractTermination = ({ getTerminationDialog, contracts, contractId, getContracts }) => {
  const [reason, setReason] = useState('violation of contract terms');
  const currentUserData = currentUser();
  const [notes, setNotes] = useState('');
  const [terminationDate, setTerminationDate] = useState(new Date());
  const [terminationTrigger, setTerminationTrigger] = useState('CONTRACT_EXPIRATION');
  const currentContract = contracts?.filter(data => data?.id === contractId)?.map(data => data)[0];
  const expiringIn = differenceInDays(new Date(), new Date(currentContract?.contractDetail?.contractTerm?.endDate))
  const [users, setUsers] = useState([]);
  const [metadata, setMetadata] = useState();
  const [replace, setReplace] = useState({ replace: false, id: '' });
  const [writtenNoticeServed, setWrittenNoticeServed] = useState(false);
  const [selectedContract, setSelectedContract] = useState(contracts?.filter(data => data?.id === contractId)?.map(data => data)[0])

  useEffect(() => {
    getUserData();
  }, [])

  const getContractsMetadata = async () => {
    const { data: contractMetadata } = await GET(`contract-managment-service/contracts/metadata`);
    setMetadata(contractMetadata);
  };

  const getUserData = async () => {
    const { data: userData } = await GET(`user-management-service/user?contractID=${contractId}`);
    if (userData) {
      setUsers(userData);
    }
  }

  const calculateRemainingDays = () => {
    const currentDate = new Date();
    const endDate = new Date(currentContract?.contractDetail?.contractTerm?.endDate);
    const timeDifference = endDate - currentDate;
    const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  const remainingDays = calculateRemainingDays();
  // console.log(remainingDays)

  // console.log('terminate file contracts data', contracts, contractId)

  const contractData = contracts.find(item => item.id === contractId);

  // console.log(contractData, users)

  const submit = async () => {
    let status = 'TERMINATED';
    let terminationData = {
      "contractTermination": {
        "terminationTrigger": terminationTrigger,
        "newContractToBeReplaced": {
          "contractId": replace?.replace ? replace?.id : '',
          "replaced": replace?.replace
        },
        "terminationReason": {
          "reason": reason
        },
        "terminationNotes": {
          "notes": notes
        },
        "terminationDate": {
          "date": format(terminationDate, 'yyyy-MM-dd').toString()
        },
        "terminatedBy": {
          "id": currentUserData?.id,
          "name": {
            "firstName": currentUserData?.firstName,
            "lastName": currentUserData?.lastName,
          },
          "email": {
            "officialEmail": currentUserData?.email
          }
        }
      }
    }
    await PUT(`contract-managment-service/contracts/${currentContract?.id}/contractStatus/${status}`, terminationData)
      .then(response => {
        SuccessToaster('Contract Terminated Successfully');
        getContracts();
        getContractsMetadata();
        getTerminationDialog(false);
      })
      .catch(error => { ErrorToaster('Contract Termination Failed'); })
  }

  const leftElement = () => {
    return (
      <Button text="Upload" intent={Intent.PRIMARY} />
    )
  }

  const calendarIcon = () => {
    return (
      <Icon icon="calendar" intent={Intent.PRIMARY} className={style.calendarStyle} />
    )
  }

  return (
    <Dialog isOpen={getTerminationDialog} onClose={() => getTerminationDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>Contract Termination</p>
          <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getTerminationDialog(false)} />
        </div>
        <div className={style.extensionBorder}></div>
        {/* <div className={style.spaceBetween}>
                <p className={style.extensionOptionsStyle}>{currentContract?.contractName?.contractName}{` `}({currentContract?.contractDetail?.contractId?.id})</p>
                <p className={style.extensionOptionsStyle}>{currentContract?.contractType === 'INDIVIDUAL' ? 'INDIVIDUAL CONTRACTOR' : `MULTIPLE CONTRACTOR (${users?.length || 0})`}</p>
                <p className={style.extensionOptionsStyle}>{`EXPIRING IN ${expiringIn} DAYS`}</p>
            </div> */}
        <div className={`${style.dialogAdditionalDetailBoxStyle}`}>
          <div>
            {/* <div className={`${style.dialogAdditionalDetailTextStyle}`}>New Contract with No Prior Contract(s) with Entity</div> */}
            <div className={`${style.dialogAdditionalDetailTextStyle}`}> {contractData?.newContract === true
              ? "New Contract With No Prior Contract(s) With Entity"
              : contractData?.newContract === false
                ? "Existing Active Contract"
                : "Contracted Services Continuation Renewal Contract"}</div>
            <div className={`${style.dialogAdditionalDetailTextStyle} ${style.marginTop10}`}>PAMF CONTRACT ({`${contractData?.contractDetail?.contractId?.id
              ? contractData?.contractDetail?.contractId?.id
              : " - "
              }`})</div>
            <div className={`${style.dialogAdditionalDetailTextStyle} ${style.marginTop10}`}>CONTRACT NAME - {contractData?.contractName?.contractName}
              {contractData?.contractType === "MULTIPLE" && users.length > 0 ? ` - ( ${users.length} ) ` : ""}</div>
          </div>
          <div>
            <div className={`${style.dialogAdditionalDetailTextStyle}`}> {`${contractData?.contractDetail?.contractManager?.name
              ?.firstName || ""
              } ${contractData?.contractDetail?.contractManager?.name?.lastName ||
              ""
              }  `}
              (Contract Manager)</div>
            <div className={`${style.dialogAdditionalDetailTextStyle} ${style.marginTop10}`}>{`${contractData?.contractType === "MULTIPLE" ? " SITE NAME - ( " + contractData?.contractDetail?.site?.sites?.[0]?.siteName?.siteName + " ) " : ""}`}
            </div>
            <div className={`${style.dialogAdditionalDetailTextStyle} ${style.marginTop10}`}>EXPIRING IN {remainingDays} DAYS ( {currentContract?.contractDetail?.contractTerm?.endDate && formatInTimeZone(new Date(currentContract?.contractDetail?.contractTerm?.endDate) || new Date(), siteTimeZone(), 'MM-dd-yyyy HH:mm a')} {timeZoneAbbreviation()} )</div>
          </div>
        </div>
        <div className={style.extensionBorder}></div>
        <div className={`${style.extentionBoxStyle} ${style.marginTop10}`}>
          <div className={`${style.extentionGrid}`}>
            <div className={style.extentionLableStyle}>Termination Trigger*</div>
            <RadioGroup
              inline={true}
              onChange={(e) => setTerminationTrigger(e.target.value)}
              selectedValue={terminationTrigger}
            >
              <Radio label="Contract Expiration" value="CONTRACT_EXPIRATION" checked />
              <Radio label="For Cause By Contractor" value="FOR_CAUSE_BY_CONTRACTOR" />
              <Radio label="For Cause By Entity" value="FOR_CAUSE_BY_ENTITY" />
            </RadioGroup>
          </div>
          {terminationTrigger === "CONTRACT_EXPIRATION" ? (
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              <div className={style.extentionLableStyle}>New Contract To Replace Expired Contract*</div>
              <div className={style.displayInRow}>
                <Switch checked={replace?.replace} label={replace?.replace ? "YES" : "NO"} className={style.verticalAlignCenter} onChange={() => setReplace({ ...replace, replace: !replace?.replace })} />
                {/* <p className={style.contractId}>Contract Id</p>
                <InputGroup value={replace?.id} onChange={(e) => setReplace({ ...replace, id: e.target.value })} placeholder="Contract Id" /> */}
              </div>
            </div>
          ) : (
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              <div className={style.extentionLableStyle}>Termination Reason*</div>
              <div>
                <Select
                  displayEmpty
                  value={reason || 'Select...'}
                  onChange={(e) => setReason(e.target.value)}
                  SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                  className={`${style.fullWidth}`}
                >
                  <MenuItem value="violation of contract terms">violation of contract terms</MenuItem>
                  <MenuItem value="Integrity screening match">Integrity screening match</MenuItem>
                  <MenuItem value="Other Termination Reason:: Allow Them To Add New Reason">Other Termination Reason:: Allow Them To Add New Reason</MenuItem>
                </Select>
              </div>
            </div>
          )}
          {terminationTrigger === "CONTRACT_EXPIRATION" && (
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              <div className={style.extentionLableStyle}>Termination Reason*</div>
              <div>
                <Select
                  displayEmpty
                  SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                  className={`${style.fullWidth}`}
                >
                  <MenuItem value="One Time Contract Requiring Termination On Expiration">One Time Contract Requiring Termination On Expiration</MenuItem>
                </Select>
              </div>
            </div>
          )}
          {terminationTrigger === "FOR_CAUSE_BY_ENTITY" && (
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              <div className={style.extentionLableStyle}>Identify Specific Reasons</div>
              <div>
                <Select
                  displayEmpty
                  SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                  className={`${style.fullWidth}`}
                >
                  <MenuItem value="Lorem ipsim">Lorem ipsim</MenuItem>
                </Select>
              </div>
            </div>
          )}
          {(terminationTrigger === 'FOR_CAUSE_BY_CONTRACTOR' || terminationTrigger === 'FOR_CAUSE_BY_ENTITY') && (
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              <div className={style.extentionLableStyle}>Written Notice Served</div>
              <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                <div className={`${style.threeFieldWidth}`} >
                  <FormControlLabel
                    control={
                      <Switch checked={writtenNoticeServed} className={` ${style.textAlignLeft} `} onChange={(e) => setWrittenNoticeServed(e.target.checked)} />
                    }
                    className={`${style.switchFontStyle} ${style.flexLeft}`}
                    label={writtenNoticeServed ? 'Notice Served' : 'Not Required'}
                  />
                </div>
                <div className={`${style.threeFieldWidth} ${!writtenNoticeServed && style.disabledOpacity}`}>
                  <div className={style.helperText}>Notice Period</div>
                  <TextField
                    type="number"
                    disabled={!writtenNoticeServed}
                    size="small"
                    onInput={e => {
                      e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Days</InputAdornment>,
                    }}
                  />
                </div>
                <div className={`${style.threeFieldWidth} ${style.marginLeft20} ${!writtenNoticeServed && style.disabledOpacity}`}>
                  <div className={style.helperText}>Cure Period</div>
                  <TextField
                    type="number"
                    disabled={!writtenNoticeServed}
                    size="small"
                    onInput={e => {
                      e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Days</InputAdornment>,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.extentionLableStyle}>Termination Date*</div>
            <div className={style.displayInRow}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={terminationDate}
                  onChange={(newValue) => {
                    setTerminationDate(newValue);
                  }}
                  InputProps={{
                    style: {
                      fontSize: 14,
                      height: 30,
                    }
                  }}
                  minDate={terminationDate}
                  renderInput={(params) => <TextField {...params} inputProps={{
                    ...params.inputProps,
                    placeholder: "Termination Date"
                  }} />}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.extentionLableStyle}>Termination By*</div>
            <InputGroup className={style.terminationFieldWidth} readOnly value={currentUserData?.firstName} />
          </div>
          {terminationTrigger !== "Contract Expiration" && (
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              <div className={style.extentionLableStyle}>Termination Notes*</div>
              <div>
                <TextArea
                  placeholder="Termination Notes"
                  row={4}
                  large={true}
                  value={notes}
                  className={style.fullWidth}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button className={style.outlinedButton} onClick={() => getTerminationDialog(false)}>CANCEL</button>
            <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={submit}>SAVE</button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ContractTermination;
