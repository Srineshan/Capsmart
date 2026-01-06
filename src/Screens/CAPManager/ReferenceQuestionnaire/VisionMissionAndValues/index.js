import React, { useState } from 'react';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';

import style from './index.module.scss';

const VisionMissionAndValues = ({ referenceForm, setReferenceForm, applicationId, getReferenceDetails, formSchema, formIndex, formSchemaWholeObject }) => {
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
                />
            )}
        </div>
    )
}

export default VisionMissionAndValues;