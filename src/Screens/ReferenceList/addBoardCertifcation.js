import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import AddHealthcareGroup from './../../images/addGroupBlue.png';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { POST, GET, PUT } from '../dataSaver'

const AddBoardCertifcation = ({ getAddEntityDialog, isEdit, selectedEntity }) => {
    const arrowDown = () => {
        return (
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }

    const [industryTypes, setIndustryTypes] = useState([])
    const [entityTypes, setEntityTypes] = useState([])
    const [contarctedServiceProviderType, setContarctedServiceProviderType] = useState([])
    const [currentindustryType, setCurrentIndustryType] = useState("")
    const [currentEntityType, setCurrentEntityType] = useState("")
    const [currentCSPType, setCurrentCSPType] = useState("")
    const [boardId, setBoardId] = useState('')
    const [primaryBoardName, setPrimaryBoardName] = useState('')
    const [primaryBoardUrl, setPrimaryBoardUrl] = useState('')
    const [secondaryBoardName, setSecondaryBoardName] = useState('')
    const [secondaryBoardUrl, setSecondaryBoardUrl] = useState('')

    const getAllIndustries = async () => {
        const { data: data } = await GET(`entity-service/industryMaster`);
        setIndustryTypes(data);
    }

    const getEntityData = async (industryId) => {
        const { data: types } = await GET(`entity-service/entityTypeMaster?industryId=${industryId}`);
        setEntityTypes(types)
    }

    const getContractedServiceProviderData = async (cspId) => {
        const { data: csptypes } = await GET(`entity-service/contractedServiceProviderMaster?siteTypeId=${cspId}`);
        setContarctedServiceProviderType(csptypes)
    }

    useEffect(() => {
        getAllIndustries()
    }, [])

    useEffect(() => {
        if (contarctedServiceProviderType.length !== 0) {
            setCurrentCSPType(contarctedServiceProviderType?.[0]?.id)
        }
    }, [currentEntityType, contarctedServiceProviderType])

    const AddSaveBoardCertification = async () => {
        const date = new Date()
        console.log(date);

        const data = {
            "primaryBoard": {
                "name": primaryBoardName,
                "url": primaryBoardUrl
            },
            "secondaryBoards": [
                {
                    "name": secondaryBoardName,
                    "url": secondaryBoardUrl
                }
            ],
            "contractedServiceProviderType": currentCSPType,
            "industry": currentindustryType,
            "createdDate": `${date.toISOString()}`,
            "lastModifiedDate": `${date.toISOString()}`
        }

        console.log(data);

        if (!isEdit ? await POST('entity-service/boardCertificateSpecialtiesMaster', JSON.stringify(data))
            .then(response => {
                SuccessToaster('BoardCertificateSpecialties Added Successfully');
                getAddEntityDialog(false)
            })
            .catch(error => {
                ErrorToaster(error);
            })
            :
            await PUT(`entity-service/boardCertificateSpecialtiesMaster/${boardId}`, JSON.stringify(data))
                .then(response => {
                    SuccessToaster('BoardCertificateSpecialties Updated Successfully');
                    getAddEntityDialog(false)
                })
                .catch(error => {
                    ErrorToaster(error);
                })
        )

            getAddEntityDialog(false)
    }

    // const AddMoreFunctionalData = async () => {
    //     const data = {
    //         "title": title,
    //         "alias1": alias1,
    //         "alias2": alias2,
    //         "contractedServiceProviderTypeId": {
    //             "id": currentCSPType
    //         },
    //         "entityId": {
    //             "id": currentEntityType
    //         }
    //     }
    //     getAddEntityDialog(true)
    //     setEntityTypes([])
    //     setContarctedServiceProviderType([])
    //     setCurrentIndustryType("")
    //     setCurrentEntityType("")
    //     setCurrentCSPType("")
    //     await POST('entity-service/functionalTitlesForCSPTypeMaster', JSON.stringify(data))
    //         .then(response => {
    //             SuccessToaster('User Added Successfully');
    //             getAddEntityDialog(true)
    //             getFuntionalTitleData()
    //         })
    //         .catch(error => {
    //             ErrorToaster(error);
    //         })
    //     getAddEntityDialog(true)
    // }

    return (
        <Dialog isOpen={getAddEntityDialog} onClose={() => getAddEntityDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>ADD / Edit Board Certification Specialties</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddEntityDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid} `}>
                        <div className={style.entityLableStyle}>Industry Type*</div>
                        <div className={style.displayInRow}>
                            <select value={currentindustryType} className={style.fullWidth} rightElement={arrowDown()} onChange={obj => { setCurrentIndustryType(obj.target.value); getEntityData(obj.target.value) }} >
                                {industryTypes.map(type => (<option value={type.id}>{type.industry}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Entity / Site Type*</div>
                        <div className={style.displayInRow}>
                            <select value={currentEntityType} className={style.fullWidth} rightElement={arrowDown()} onChange={obj => { setCurrentEntityType(obj.target.value); getContractedServiceProviderData(obj.target.value) }}>
                                {entityTypes.map(type => (<option value={type.id}>{type.type}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Contracted Service Provide Type*</div>
                        <div className={style.displayInRow}>
                            <select value={currentCSPType} className={style.fullWidth} rightElement={arrowDown()} onChange={obj => { setCurrentCSPType(obj.target.value) }}>
                                {contarctedServiceProviderType.map(type => (<option value={type.id}>{type.contractedServiceProviderType}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Primary Specialty Board*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value={primaryBoardName} className={style.fullWidth} onChange={e => setPrimaryBoardName(e.target.value)} />
                            <RadioGroup
                                inline={true}
                                className={` ${style.marginLeft20} ${style.marginTop}`}
                                selectedValue={"ADD SUB-SPECIALTY"}
                            >
                                <Radio label="ADD SUB-SPECIALTY" value="ADD SUB-SPECIALTY" />
                            </RadioGroup>
                        </div>
                    </div>
                    <div className={style.extentionGrid}>
                        <p></p>
                        <InputGroup value={primaryBoardUrl} className={`${style.entityLableStyle}`} onChange={e => setPrimaryBoardUrl(e.target.value)} />
                    </div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.extentionGrid}`}>
                            <div className={style.entityLableStyle}>Sub- Specialty Board*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value={secondaryBoardName} className={style.fullWidth} onChange={e => setSecondaryBoardName(e.target.value)} />
                            </div>
                        </div>
                        <div className={style.extentionGrid}>
                            <p></p>
                            <InputGroup value={secondaryBoardUrl} className={`${style.entityLableStyle}`} onChange={e => setSecondaryBoardUrl(e.target.value)} />
                        </div>
                    </div>
                    <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                        <div>
                        </div>
                        <div className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}>ADD MORE</div>
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.outlinedButton}>SAVE & ADDMORE</button>
                        <button onClick={AddSaveBoardCertification} className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE & CLOSE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddBoardCertifcation;