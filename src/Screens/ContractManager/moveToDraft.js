import React, { useState, useEffect } from 'react';
import { InputGroup, Icon } from '@blueprintjs/core';
import { TenantID, GET, PUT } from "./../dataSaver";
import { currentUser } from './../../utils/auth';
import CommonSelectField from "../../Components/CommonFields/CommonSelectField";
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

import style from './index.module.scss';

const MoveToDraft = () => {
    const [selectedContractId, setSelectedContractId] = useState('0');
    const currentUserData = currentUser();
    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        getContracts();
    }, []);

    const getContracts = async () => {
        const { data: contracts } = await GET(`contract-managment-service/contracts?limit=200&tab=activecontracts`);
        setContracts(contracts?.contractList);
    };


    const handleMoveToDraft = async () => {
        if (selectedContractId !== '0') {
            let status = 'DRAFT';
            let activationData = {
                "contractActivation": {
                    "activationNotes": {
                        "notes": ""
                    },
                    "activatedBy": {
                        "id": currentUserData?.id,
                        "name": {
                            "firstName": currentUserData?.firstName,
                            "lastName": currentUserData?.lastName
                        },
                        "email": {
                            "officialEmail": currentUserData?.email
                        }
                    }
                }
            }
            console.log(selectedContractId, status, activationData)
            await PUT(`contract-managment-service/contracts/${selectedContractId}/contractStatus/${status}`, activationData)
                .then(response => {
                    SuccessToaster('Contract Moved To Draft Successfully');
                    setSelectedContractId('0');
                    getContracts();
                })
                .catch(error => { ErrorToaster('Moving Contract To Draft Failed'); })
        } else {
            ErrorToaster("Select a Contract To Move")
        }
    }


    return (
        <div className={style.fullHeight}>
            <div className={`${style.justifyCenter} ${style.verticalAlignCenter}`}>
                <div>
                    <div className={`${style.moveToDraftHeaderBox} ${style.marginTop} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
                        <div className={style.moveToDraftHeading}>Move Active Contract to Draft</div>
                    </div>
                    <div className={`${style.moveToDraftBox} ${style.padding20}`}>
                        <div
                            className={`${style.addManagerGrid}`}
                        >
                            <CommonLabel value={"Contract List*"} />
                            <div className={style.fullWidth}>
                                <CommonSelectField
                                    className={`${style.fullWidth} `}
                                    value={selectedContractId}
                                    onChange={(e) => {
                                        setSelectedContractId(e.target.value);
                                    }}
                                    firstOptionLabel={"Select Contract"}
                                    firstOptionValue={"0"}
                                    valueList={contracts
                                        ?.map((data) => data?.id)}
                                    labelList={contracts
                                        ?.map(
                                            (titleData) => titleData?.contractName?.contractName)}
                                    disabledList={contracts?.map((data) => false)}
                                    widthValue={370}
                                />
                            </div>
                        </div>
                        <div className={style.marginTop20}>
                            <button className={`${style.newContractButtonStyle}  ${style.cursorPointer} ${style.floatRight}`}
                                onClick={() => handleMoveToDraft()}
                            >Move To Draft</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MoveToDraft;