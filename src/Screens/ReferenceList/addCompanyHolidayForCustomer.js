import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { POST, PUT, TenantID } from './../dataSaver';
import style from './index.module.scss';
import CrossPink from './../../images/crossPink.png';

const AddCompanyHolidayForCustomer = ({ getAddCompanyHolidayDialog, isEdit, selectedHoliday }) => {
    const [eventType, setEventType] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState(new Date())
    const [country, setCountry] = useState("USA")
    const [stateName, setStateName] = useState("")
    const [holidayId, setHolidayId] = useState('');

    useEffect(()=> {
        if(isEdit){
            setEventType(selectedHoliday?.eventType)
            setEventName(selectedHoliday?.eventName)
            setEventDate(selectedHoliday?.eventDate)
            setStateName(selectedHoliday?.stateName)
            setCountry(selectedHoliday?.country)
            setHolidayId(selectedHoliday?.id)
        }
    }, [isEdit, selectedHoliday])

    const handleSave = async () => {
        if(isEdit) {
            let data = {
                "eventType": eventType,
                "stateName": stateName,
                "eventName": eventName,
                "eventDate": eventDate,
                "country": country,
                "entityId": {
                    "id": TenantID
                }
            };
            await PUT(`entity-service/holiday/${holidayId}`, JSON.stringify(data))
            .then(response => {
                SuccessToaster('Event Updated Successfully');
                getAddCompanyHolidayDialog(false)
            })
            .catch(error => {
                ErrorToaster(error);
            })
        } else {
            let data = [{
                "eventType": eventType,
                "stateName": stateName,
                "eventName": eventName,
                "eventDate": eventDate,
                "country": country,
                "entityId": {
                    "id": TenantID
                }
            }];
            await POST('entity-service/holiday', JSON.stringify(data))
            .then(response => {
                SuccessToaster('Event Added Successfully');
                getAddCompanyHolidayDialog(false)
            })
            .catch(error => {
                ErrorToaster(error);
            })
        }
    }
   
    return (
        <Dialog isOpen={getAddCompanyHolidayDialog} onClose={() => getAddCompanyHolidayDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>{isEdit ? 'Edit' : 'Add'} Company Holiday</p>
                    <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} onClick={() => getAddCompanyHolidayDialog(false)}/>
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.editHealthCareGrid2}`}>
                        <div className={style.entityLableStyle}>Event Type*</div>
                        <div className={style.displayInRow}>
                            <select
                                name="class"
                                id="Class"
                                value={eventType}
                                onChange={(e) => setEventType(e.target.value)}
                                className={`${style.halfWidth} ${style.transparentBackground}`}>
                                <option value='' >
                                    Select Event Type
                                </option>
                                <option value='FEDERAL' >
                                    Federal
                                </option>
                                <option value="STATE" >
                                    State
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={style.editHealthCareGrid1}>
                        <p></p>
                    </div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.editHealthCareGrid2}`}>
                            <div className={style.entityLableStyle}>Holiday Event Name*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value={eventName} onChange={(e)=> setEventName(e.target.value)} className={style.fullWidth} />
                            </div>
                        </div>
                        <div className={`${style.AddCompanyHolidayGrid1} ${style.marginTop20}`}>
                            <div className={style.entityLableStyle}>Event date*</div>
                            <div className={style.displayInRow}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        InputProps={{
                                            style: {
                                                fontSize: 14,
                                                height: 30,
                                            }
                                        }}
                                        value={eventDate}
                                        onChange={(e) => {setEventDate(e)}}
                                        renderInput={(params) => <TextField {...params} inputProps={{
                                        ...params.inputProps,
                                        placeholder: "MM/DD/YYYY"
                                        }}
                                        />}
                                    />
                                </LocalizationProvider>
                            </div>
                            <p className={`${style.entityLableStyle2}`}>auto: Display day of the week</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.outlinedButton}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => handleSave()}>SAVE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddCompanyHolidayForCustomer;