import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { POST, GET } from './../dataSaver'
import { useEffect } from 'react';

const AddCompanyHoliday = ({ getAddCompanyHolidayDialog }) => {
    const [eventT, setEventT] = useState("")
    const [eventN, setEventN] = useState("")
    const [eventD, setEventD] = useState("")
    const [stateN, setStateN] = useState("")
    const [country, setCountry] = useState("")
    const [industry, setindustry] = useState("")
    const [industryTypes, setIndustryTypes] = useState([])
    const [entityTypes, setEntityTypes] = useState([])

    const getAllIndustries = async () => {
        const { data: data } = await GET(`/industryMaster`);
        setIndustryTypes(data);
        console.log("data", data)
    }


    const SubmitHoliday = async () => {
        let Input = {
            "eventType": eventT,
            "stateName": stateN,
            "eventName": eventN,
            "eventDate": eventD,
            "country": "string",
            "industry": industryTypes
        }

        await POST('/holidayMaster', JSON.stringify(Input))
            .then(response => {
                SuccessToaster('User Added Successfully');
            })
            .catch(error => {
                ErrorToaster(error);
            })
        getAddCompanyHolidayDialog(false)
    }

    useEffect(() => {
        getAllIndustries()
    }, [])

    const arrowDown = () => {
        return (
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }
    return (
        <Dialog isOpen={getAddCompanyHolidayDialog} onClose={() => getAddCompanyHolidayDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Add Company Holiday</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddCompanyHolidayDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.editHealthCareGrid2}`}>
                        <div className={style.entityLableStyle}>Event Type*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value={eventT} className={style.halfWidth} rightElement={arrowDown()} onChange={obj => setEventT(obj.target.value)} />
                        </div>
                    </div>
                    <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>State Name*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value={stateN} className={style.halfWidth} onChange={obj => setStateN(obj.target.value)} />
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
                                <InputGroup value={eventN} className={style.fullWidth} onChange={obj => setEventN(obj.target.value)} />
                            </div>
                        </div>
                        <div className={`${style.AddCompanyHolidayGrid1} ${style.marginTop20}`}>
                            <div className={style.entityLableStyle}>Event date*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value={eventD} className={style.fullWidth} onChange={obj => setEventD(obj.target.value)} />
                            </div>
                            <p className={`${style.entityLableStyle2}`}>auto: Display day of the week</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.outlinedButton}>CANCEL</button>
                        <button onClick={() => SubmitHoliday()} className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddCompanyHoliday;