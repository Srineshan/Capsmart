import React, { useState } from 'react';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';

import style from './index.module.scss';

const HealthStatus = ({ referenceForm, setReferenceForm, applicationId, getReferenceDetails, formSchema, formIndex, formSchemaWholeObject }) => {
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [warningFields, setWarningFields] = useState([]);

    const getIsEdited = () => {

    }

    const getAllPath = (data) => {
        let temp = metadata;
        if (!temp?.includes(data)) {
            console.log(temp, data, 'Metadata')
            temp.push(data);
        }
        setMetadata(temp);
    }

    const getAllLabels = (data) => {
        let tempLabels = labels;
        if (tempLabels?.filter(innerData => data?.path === innerData?.path)?.length === 0) {
            console.log(tempLabels, data, 'MetadataLabel')
            tempLabels.push(data);
        }
        setLabels(tempLabels);
    }
    return (
        <div>
            <div className={style.applicantInfoCard}>
                <div className={`${style.refRadioCard} ${style.headerGrid}`}>
                    <div className={style.headerText}>TO THE BEST OF YOUR KNOWLEDGE:</div>
                    <div className={style.headerText}>YES</div>
                    <div className={style.headerText}>NO</div>
                    <div className={style.headerText}>NO KNOWLEDGE</div>
                </div>
                {formSchema !== undefined && "bestOfYourKnowledge" in formSchema?.properties && (
                    <ApplicationFieldCard
                        object={formSchema?.properties?.bestOfYourKnowledge}
                        refGridStyle={style.gridStyle}
                        gridStyle={style.fieldGridStyle}
                        baseKey={"bestOfYourKnowledge"}
                        basicForm={referenceForm}
                        setBasicForm={setReferenceForm}
                        getAllPath={getAllPath}
                        getAllLabels={getAllLabels}
                        warningFields={warningFields}
                        formSchema={formSchemaWholeObject}
                        stepPath={`referenceDetails.responses[${formIndex}].data`}
                        setIsEdited={getIsEdited}
                        hideBackground={true}
                        customRadioStyle={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 1,
                            justifyItems: "left",
                            alignItems: "center"
                        }}
                    />
                )}
            </div>
            {formSchema !== undefined && "healthStatusExplanation" in formSchema?.properties && (
                <ApplicationFieldCard
                    object={formSchema?.properties?.healthStatusExplanation}
                    refGridStyle={style.gridStyle}
                    gridStyle={style.fieldGridStyle}
                    baseKey={"healthStatusExplanation"}
                    basicForm={referenceForm}
                    setBasicForm={setReferenceForm}
                    getAllPath={getAllPath}
                    getAllLabels={getAllLabels}
                    warningFields={warningFields}
                    formSchema={formSchemaWholeObject}
                    stepPath={`referenceDetails.responses[${formIndex}].data`}
                    setIsEdited={getIsEdited}
                />
            )}
        </div>
    )
}

export default HealthStatus;