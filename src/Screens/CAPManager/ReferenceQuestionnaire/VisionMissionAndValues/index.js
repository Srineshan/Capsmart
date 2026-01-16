import React, { useState } from 'react';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';

import style from './index.module.scss';
import { getValueByPath } from '../../../../utils/formatting';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';

const VisionMissionAndValues = ({ referenceForm, setReferenceForm, applicationId, getReferenceDetails, formSchema, formIndex, formSchemaWholeObject }) => {
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [warningFields, setWarningFields] = useState([]);
    const referenceRadioColor = {
        'No Knowledge': '#14358F',
        'Yes': '#14B15A',
        'No': '#F94848'
    }
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

    const checkSomeSelected = (expectedValue) => {
        const proceduresPath = `referenceDetails.responses[${formIndex}].data.willEndorseAndFulfillVisionMission`;
        const procedures = getValueByPath(referenceForm, proceduresPath) || {};
        const someValuesMatch = Object.values(procedures).some((val) => val === expectedValue);
        return someValuesMatch;
    }
    return (
        <div>
            <div className={style.applicantInfoCard}>
                {formSchema !== undefined && "applicantEndorsementDetails" in formSchema?.properties && (
                    <ApplicationFieldCard
                        object={formSchema?.properties?.applicantEndorsementDetails}
                        refGridStyle={style.gridStyle}
                        gridStyle={style.fieldGridStyle}
                        baseKey={"applicantEndorsementDetails"}
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
                <div className={`${style.refRadioCard} ${style.headerGrid}`}>
                    <div className={style.headerText}>TO THE BEST OF YOUR KNOWLEDGE:</div>
                    <div className={style.headerText}>YES</div>
                    <div className={style.headerText}>NO</div>
                    <div className={style.headerText}>NO KNOWLEDGE</div>
                </div>
                {formSchema !== undefined && "willEndorseAndFulfillVisionMission" in formSchema?.properties && (
                    <ApplicationFieldCard
                        object={formSchema?.properties?.willEndorseAndFulfillVisionMission}
                        refGridStyle={style.gridStyle}
                        gridStyle={style.fieldGridStyle}
                        baseKey={"willEndorseAndFulfillVisionMission"}
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
                        alternateReferenceRadioColor={referenceRadioColor}
                    />
                )}
                {checkSomeSelected('No') && (
                    <>
                        {formSchema !== undefined && "notEndorsedExplanation" in formSchema?.properties && (
                            <ApplicationFieldCard
                                object={formSchema?.properties?.notEndorsedExplanation}
                                refGridStyle={style.gridStyle}
                                gridStyle={style.fieldGridStyle}
                                baseKey={"notEndorsedExplanation"}
                                basicForm={referenceForm}
                                setBasicForm={setReferenceForm}
                                getAllPath={getAllPath}
                                getAllLabels={getAllLabels}
                                warningFields={warningFields}
                                formSchema={formSchemaWholeObject}
                                stepPath={`referenceDetails.responses[${formIndex}].data`}
                                setIsEdited={getIsEdited}
                                hideBackground={true}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default VisionMissionAndValues;