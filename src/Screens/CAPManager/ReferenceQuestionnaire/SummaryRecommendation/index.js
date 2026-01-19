import React, { useEffect, useState } from 'react';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import CryptoJS from "crypto-js";

import style from './index.module.scss';
import ESignature from '../../../../Components/ESignature';
import { format } from 'date-fns';
import { getValueByPath } from '../../../../utils/formatting';

const SummaryRecommendation = ({ referenceForm, setReferenceForm, applicationId, getReferenceDetails, formSchema, formIndex, formSchemaWholeObject, getAllPath, getAllLabels }) => {
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [warningFields, setWarningFields] = useState([]);
    const [isSigned, setIsSigned] = useState(false);
    const publicKey =
        "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [encryptedText, setEncryptedText] = useState(
        CryptoJS.AES.encrypt(
            `${referenceForm?.referenceDetails?.firstName} ${referenceForm?.referenceDetails?.lastName}` +
            new Date().toISOString(),
            publicKey
        ).toString()
    );
    const phoneCallNeeded = getValueByPath(referenceForm, `referenceDetails.responses[${formIndex}].data.summaryRecommendation.anySensitiveNatureToDiscussByPhone`)
    const getIsEdited = () => {

    }

    useEffect(() => {
        setReferenceForm((prevData) => ({
            ...prevData,
            referenceDetails: {
                ...prevData?.referenceDetails,
                responses: prevData?.referenceDetails?.responses?.map((form, idx) => {
                    if (idx !== formIndex) return form;

                    return {
                        ...form,
                        data: {
                            ...form?.data,
                            referenceInformation: {
                                ...form?.data?.referenceInformation,
                                name: `${referenceForm?.referenceDetails?.firstName ?? ""} ${referenceForm.referenceDetails?.lastName ?? ""
                                    }`.trim(),
                            },
                        },
                    };
                }),
            },
        }));
    }, [
        referenceForm?.referenceDetails?.firstName,
        referenceForm?.referenceDetails?.lastName,
        formIndex,
    ]);

    // const getAllPath = (data) => {
    //     let temp = metadata;
    //     if (!temp?.includes(data)) {
    //         console.log(temp, data, 'Metadata')
    //         temp.push(data);
    //     }
    //     setMetadata(temp);
    // }

    // const getAllLabels = (data) => {
    //     let tempLabels = labels;
    //     if (tempLabels?.filter(innerData => data?.path === innerData?.path)?.length === 0) {
    //         console.log(tempLabels, data, 'MetadataLabel')
    //         tempLabels.push(data);
    //     }
    //     setLabels(tempLabels);
    // }

    return (
        <div className={style.applicantInfoCard}>
            {formSchema !== undefined && "summaryRecommendation" in formSchema?.properties && (
                <ApplicationFieldCard
                    object={formSchema?.properties?.summaryRecommendation}
                    refGridStyle={style.gridStyle}
                    gridStyle={phoneCallNeeded ? style.fieldGridStyle : style.alternateFieldGridStyle}
                    baseKey={"summaryRecommendation"}
                    basicForm={referenceForm}
                    setBasicForm={setReferenceForm}
                    getAllPath={getAllPath}
                    getAllLabels={getAllLabels}
                    warningFields={warningFields}
                    formSchema={formSchemaWholeObject}
                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                    setIsEdited={getIsEdited}
                    referenceRadioShowLabel={true}
                    hideBackground={true}
                />
            )}
            {formSchema !== undefined && "referenceInformation" in formSchema?.properties && (
                <ApplicationFieldCard
                    object={formSchema?.properties?.referenceInformation}
                    refGridStyle={style.gridStyle}
                    gridStyle={style.fieldGridStyle2}
                    baseKey={"referenceInformation"}
                    basicForm={referenceForm}
                    setBasicForm={setReferenceForm}
                    getAllPath={getAllPath}
                    getAllLabels={getAllLabels}
                    warningFields={warningFields}
                    formSchema={formSchemaWholeObject}
                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                    setIsEdited={getIsEdited}
                    referenceRadioShowLabel={true}
                    hideBackground={true}
                />
            )}
            <div className={`${style.marginTop10} ${style.twoCol}`}>
                <div onClick={isSigned ? () => { } : () => setIsSigned(!isSigned)}>
                    <ESignature
                        userName={`${referenceForm?.referenceDetails?.firstName} ${referenceForm?.referenceDetails?.lastName}`}
                        encData={encryptedText}
                        showData={isSigned ? true : false}
                        showDatais={isSigned ? true : false}
                        alternateSignature={`${referenceForm?.referenceDetails?.firstName} ${referenceForm?.referenceDetails?.lastName}`}
                    />
                </div>
                <div className={style.verticalAlignCenter}>
                    <div className={style.displayInRow}>
                        <div className={style.dateTitle}>Date:</div>
                        <div className={`${style.date} ${style.marginLeft}`}>
                            {isSigned ? format(new Date(), 'MMM dd, yyyy') : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SummaryRecommendation;