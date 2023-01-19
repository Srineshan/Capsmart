<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
    Dialog,
    Classes,
    Icon,
    Intent,
    InputGroup,
} from "@blueprintjs/core";
import ArrowDown from "./../../images/arrowDown.png";
import style from "./index.module.scss";
import { POST, PUT } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";

const AddAbsenseReasonsForHealthcare = ({
    getAddEntityDialog,
    isEdit,
    IndustryId,
    selectedAbsence,
    getEntityData,
    tableEntityData
}) => {
    const [absenseId, setAbsenseId] = useState("");
    const [absenseType, setAbsenseType] = useState("Planned");
    const [absenceReason, setAbsenseReason] = useState("");
    const [notificationPeriod, setNotificationPeriod] = useState("14");
    const [createdDate, setCreatedDate] = useState("")

=======
import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import AddHealthcareGroup from './../../images/addGroupBlue.png';
import { GET,POST, PUT, TenantID } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import CrossPink from './../../images/crossPink.png';


const AddAbsenseReasonsForHealthcare = ({ getAddAbsenseReasonsDialog, isEdit, selectedAbsence}) => {
    const [absenceReason, setAbsenceReason] = useState('');
    const [notificationPeriod,setNotificationPeriod] = useState('');
    const [absenceType, setAbsenceType] = useState('PLANNED');
    const [selectedIndustry, setSelectedIndustry] = useState({});
    const [absenceId, setAbsenceId] = useState('');
>>>>>>> 01ff1ddd22400e2d6f0257795b0972f06746bb21
    const arrowDown = () => {
        return (
            <img
                src={ArrowDown}
                className={`${style.colorFileStyle3} ${style.marginRight}`}
                alt=""
            />
        );
    };

    const saveSubmitHandler = async () => {
        const isPresent = tableEntityData.filter((e) => e.absenceType === absenseType.toUpperCase()).find((p) => p.absenceReason === absenceReason);
        if (isPresent) {
            ErrorToaster("Already This Absence Reason Exists");
            document.getElementById("absenceEl").focus();
            getAddEntityDialog(true)
            return false;
        }

        if (!absenceReason && absenceReason === "") {
            document.getElementById("absenceEl").focus()
            return false
        }
        const data = {
            ...(isEdit && { 'id': absenseId }),
            ...(isEdit && { 'createdDate': createdDate }),
            "absenceType": absenseType.toUpperCase(),
            "absenceReason": absenceReason,
            "notificationPeriod": {
                "numberOfDays": parseInt(notificationPeriod),
            },
            "industryId": {
                "id": IndustryId,
            }
        };

        if (!isEdit ?
            await POST("entity-service/absenceReasonMaster", JSON.stringify(data))
                .then((response) => {
                    SuccessToaster("Absence Added Successfully");
                    getAddEntityDialog(false);
                    getEntityData()
                })
                .catch((error) => {
                    ErrorToaster(error);
                })
            :
            await PUT(`entity-service/absenceReasonMaster/${absenseId}`, JSON.stringify(data))
                .then(response => {
                    SuccessToaster('Absence Updated Successfully');
                    getAddEntityDialog(false);
                    getEntityData()
                })
                .catch(error => {
                    ErrorToaster(error);
                })
        )

            getAddEntityDialog(false);

    }

<<<<<<< HEAD
    useEffect(() => {
        if (isEdit) {
            setAbsenseId(selectedAbsence?.id)
            setAbsenseType(selectedAbsence?.absenceType.charAt(0).toUpperCase() + selectedAbsence?.absenceType.slice(1).toLowerCase())
            setAbsenseReason(selectedAbsence?.absenceReason)
            setNotificationPeriod(selectedAbsence?.notificationPeriod?.numberOfDays)
            setCreatedDate(selectedAbsence?.createdDate)
        }
    }, [isEdit, selectedAbsence])

=======
    const addMore = () => {
        setAbsenceId('')
        setAbsenceReason('')
    }

    useEffect(()=> {
        if(isEdit){
            setAbsenceType(selectedAbsence?.absenceType)
            setAbsenceReason(selectedAbsence?.absenceReason)
            setNotificationPeriod(selectedAbsence?.notificationPeriod.numberOfDays)
            setAbsenceId(selectedAbsence?.id)
        }
    }, [isEdit, selectedAbsence])

    const getIndustryData = async() => {
        const {data : data} = await GET (`entity-service/industryMaster`);
        setSelectedIndustry(data?.filter(data => data?.industry === 'HEALTHCARE')?.map(data => data));
    }

    const handleSave = async () => {
        if(isEdit) {
            let data = {
                ...( isEdit &&
                {'id': absenceId}),
                "absenceType": absenceType,
                "absenceReason": absenceReason,
                "notificationPeriod": {
                  "numberOfDays": parseInt(notificationPeriod)
                },
                "industryId": {
                  "id": selectedIndustry[0]['id']
                },
                "entityId": {
                  "id": TenantID
                }
              }
        
        //     await PUT(`entity-service/absenceReason/${absenceId}`, JSON.stringify(data))
        //     .then(response => {
        //         SuccessToaster('Absence Updated Successfully');
        //         getAddAbsenseReasonsDialog(false)
        //     })
        //     .catch(error => {
        //         ErrorToaster(error);
        //     })
        // } else {
        //     let data = [{
        //         "absenceType": absenceType,
        //         "absenceReason": absenceReason,
        //         "notificationPeriod": {
        //           "numberOfDays": parseInt(notificationPeriod)
        //         },
        //         "industryId": {
        //           "id": selectedIndustry[0]['id']
        //         },
        //         "entityId": {
        //           "id": TenantID
        //         }
        //       }];
            if(!isEdit ? 
            await POST(`entity-service/absenceReason`, JSON.stringify(data))
            .then(response => {
                SuccessToaster('Absence Added Successfully');
                getAddAbsenseReasonsDialog(false)
            })
            .catch(error => {
                ErrorToaster(error);
            })
            :
            await PUT(`entity-service/absenceReason/${absenceId}`, JSON.stringify(data))
            .then(response => {
                SuccessToaster('Absence Updated Successfully');
                getAddAbsenseReasonsDialog(false)
            })
            .catch(error => {
                ErrorToaster(error);
            })
        )
        getAddAbsenseReasonsDialog(false)
    }
    }

    useEffect(()=>{
        getIndustryData();
    },[]);

>>>>>>> 01ff1ddd22400e2d6f0257795b0972f06746bb21
    return (
        <Dialog
            isOpen={getAddEntityDialog}
            onClose={() => getAddEntityDialog(false)}
            className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
        >
            <div
                className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
            >
                <div className={style.spaceBetween}>
<<<<<<< HEAD
                    <p className={style.extensionStyle}>
                        {isEdit
                            ? "Add/Edit Absence Reasons"
                            : "New Absence Reason For Healthcare"}
                    </p>
                    <Icon
                        icon="cross"
                        size={20}
                        intent={Intent.DANGER}
                        className={style.dialogCrossStyle}
                        onClick={() => getAddEntityDialog(false)}
                    />
=======
                    <p className={style.extensionStyle}>{isEdit ? 'Add/Edit Absence Reasons' : 'New Absence Reason For Healthcare'}</p>
                    <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} onClick={() => getAddAbsenseReasonsDialog(false)} />
>>>>>>> 01ff1ddd22400e2d6f0257795b0972f06746bb21
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.entityLableStyle}>Absence Type*</div>
                        <div className={style.displayInRow}>
                            <select
                                name="class"
<<<<<<< HEAD
                                id="class"
                                value={absenseType}
                                onChange={(e) => {
                                    setAbsenseType(e.target.value);
                                    if (e.target.value === "Planned") {
                                        setNotificationPeriod("14");
                                    } else {
                                        setNotificationPeriod("7");
                                    }
                                }}
                                className={`${style.width75Percent}`}
                            >
                                <option value="Planned">Planned</option>
                                <option value="Unplanned">Unplanned</option>
=======
                                id="Class"
                                value={absenceType}
                                onChange={(e) => {
                                    setAbsenceType(e.target.value);
                                    if(e.target.value == "PLANNED"){        
                                        setNotificationPeriod("14");
                                    }else{
                                        setNotificationPeriod("7");
                                    }
                                }}
                                className={`${style.width75Percent}`}>
                                <option value="PLANNED" >
                                    Planned
                                </option>
                                <option value="UNPLANNED" >
                                    Unplanned
                                </option>
>>>>>>> 01ff1ddd22400e2d6f0257795b0972f06746bb21
                            </select>
                        </div>
                    </div>
                    <div
                        className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
                    ></div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.absenseCareGrid2}`}>
                            <div className={style.entityLableStyle}>Absence Reason*</div>
                            <div className={style.displayInRow}>
<<<<<<< HEAD
                                <InputGroup
                                    value={absenceReason}
                                    placeholder="Reason"
                                    id="absenceEl"
                                    className={style.fullWidth}
                                    onChange={(e) => setAbsenseReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={`${style.absenseCareGrid2} ${style.marginTop20}`}>
                            <div className={style.entityLableStyle}>
                                {absenseType === "Planned"
                                    ? "Request Notification Period*"
                                    : "Notification Period"}
                            </div>
                            <div className={style.displayInRow}>
                                <div className={style.entityLableStyle}>Not more than</div>
                                <InputGroup
                                    value={notificationPeriod}
                                    name="notificationPeriod"
                                    type="number"
                                    className={style.marginLeft20}
                                    onChange={(e) => setNotificationPeriod(e.target.value)}
                                />
                                <div
                                    className={`${style.entityLableStyle} ${style.marginLeft20}`}
                                >
                                    Days
                                </div>
=======
                                <InputGroup value={absenceReason} onChange={(e)=> setAbsenceReason(e.target.value)} className={style.fullWidth} />
                            </div>
                        </div>
                        <div className={`${style.absenseCareGrid2} ${style.marginTop20}`}>
                            <div className={style.entityLableStyle}>{absenceType === "PLANNED" ? "Request Notification Period*" : "Notification Period"}</div>
                            <div className={style.displayInRow}>
                                <div className={style.entityLableStyle}>Not more than</div>
                                <InputGroup value={notificationPeriod} type="number" min={0} className={style.marginLeft20} onChange={(e)=> setNotificationPeriod(e.target.value)} />
                                <div className={`${style.entityLableStyle} ${style.marginLeft20}`}>Days</div>
>>>>>>> 01ff1ddd22400e2d6f0257795b0972f06746bb21
                            </div>
                        </div>
                    </div>

                    <div className={`${style.spaceBetween} ${style.marginTop20}`}>
<<<<<<< HEAD
                        <div></div>
                        {!isEdit &&
                            <div
                                className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}
                            >
                                ADD MORE
                            </div>
                        }
=======
                        <div>
                        </div>
                        <div className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`} onClick={() => addMore()} >ADD MORE</div>
>>>>>>> 01ff1ddd22400e2d6f0257795b0972f06746bb21
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
<<<<<<< HEAD
                        <button
                            className={style.outlinedButton}
                            onClick={() => getAddEntityDialog(false)}
                        >
                            CANCEL
                        </button>
                        <button
                            className={`${style.buttonStyle} ${style.marginLeft20}`}
                            onClick={saveSubmitHandler}
                        >
                            SAVE
                        </button>
=======
                        <button className={style.outlinedButton} onClick={() => getAddAbsenseReasonsDialog(false)}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => handleSave()}>SAVE</button>
>>>>>>> 01ff1ddd22400e2d6f0257795b0972f06746bb21
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default AddAbsenseReasonsForHealthcare;
