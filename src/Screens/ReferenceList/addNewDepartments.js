import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, RadioGroup, Radio } from '@blueprintjs/core';
import style from './index.module.scss';
import { POST, PUT } from './../dataSaver'
import { SuccessToaster, ErrorToaster } from '../../utils/toaster';

const AddNewDepartments = ({ getAddEntityDialog, selectedEntity, isEdit, getEntityData, selectedDepart, departmentList }) => {

    const [departId, setDepartId] = useState("")
    const [departName, setDepartName] = useState("")

    const saveSubmitHandler = async () => {
        const isPresent = departmentList.find((p) => p.departmentName.name === departName);
        if (isPresent) {
            ErrorToaster("Already This Name Exists");
            document.getElementById("departName").focus();
            setDepartName("")
            getAddEntityDialog(true)
            return false;
        }

        const data = {
            ...(isEdit && { 'id': departId }),
            "departmentName": {
                "name": departName
            },
            "siteTypeId": {
                "id": selectedEntity?.id
            }
        }

        if (!isEdit ? await POST("entity-service/departmentMaster", JSON.stringify(data))
            .then((response) => {
                SuccessToaster("Department Added Successfully");
                getAddEntityDialog(false);
                getEntityData()
            })
            .catch((error) => {
                ErrorToaster(error);
            })
            :
            await PUT(`entity-service/departmentMaster/${departId}`, JSON.stringify(data))
                .then(response => {
                    SuccessToaster('Department Updated Successfully');
                    getAddEntityDialog(false)
                    getEntityData()
                })
                .catch(error => {
                    ErrorToaster(error);
                })
        )
            getAddEntityDialog(false)
    }

    useEffect(() => {
        if (isEdit) {
            setDepartId(selectedDepart?.id);
            setDepartName(selectedDepart?.departmentName?.name)
        }
    }, [selectedDepart])

    return (
        <Dialog isOpen={getAddEntityDialog} onClose={() => getAddEntityDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>New Departments / Services Area For Hospital / Acute Care Facility (ACF)</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddEntityDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.entityLableStyle}>Department Name*</div>
                        <div className={style.twoCol}>
                            <InputGroup placeholder='Enter Department Name' id="departName" value={departName} className={style.fullWidth} onChange={(e) => setDepartName(e.target.value)} />
                            <RadioGroup
                                inline={true}
                                className={` ${style.marginLeft20} ${style.marginTop}`}
                                selectedValue={"ADD SERVICES"}
                            >
                                <Radio label="ADD SERVICES" value="ADD SERVICES" />
                            </RadioGroup>
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    {/* <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.editHealthCareGrid2}`}>
                            <div className={style.entityLableStyle}>Service Area*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="Cardiothoracic Surgery" className={style.fullWidth} />
                            </div>
                        </div>
                    </div> */}
                    <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                        <div>
                        </div>
                        {!isEdit && <div className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}>ADD MORE</div>}
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.outlinedButton} onClick={() => getAddEntityDialog(false)}>SAVE & CLOSE</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={saveSubmitHandler} >SAVE & ADD MORE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddNewDepartments;
