import React, { useState } from 'react';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';

import style from './index.module.scss';

const ClinicalAbilities = ({ referenceForm, setReferenceForm, applicationId, getReferenceDetails, formSchema, formIndex, formSchemaWholeObject }) => {
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
                    <div className={style.headerText}>NATURE OF CLINICAL PROCEDURES OBSERVED</div>
                    <div className={style.headerText}>OUTSTANDING</div>
                    <div className={style.headerText}>SATISFACTORY</div>
                    <div className={style.headerText}>UNSATISFACTORY</div>
                    <div className={style.headerText}>UNABLE TO ASSESS</div>
                </div>
                {formSchema !== undefined && "natureOfProceduresObserved" in formSchema?.properties && (
                    <ApplicationFieldCard
                        object={formSchema?.properties?.natureOfProceduresObserved}
                        refGridStyle={style.gridStyle}
                        gridStyle={style.fieldGridStyle}
                        baseKey={"natureOfProceduresObserved"}
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
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: 1,
                            justifyItems: "center",
                            alignItems: "center"
                        }}
                    />
                )}
            </div>
            {formSchema !== undefined && "unsatisfactoryExplanation" in formSchema?.properties && (
                <ApplicationFieldCard
                    object={formSchema?.properties?.unsatisfactoryExplanation}
                    refGridStyle={style.gridStyle}
                    gridStyle={style.fieldGridStyle}
                    baseKey={"unsatisfactoryExplanation"}
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

export default ClinicalAbilities;