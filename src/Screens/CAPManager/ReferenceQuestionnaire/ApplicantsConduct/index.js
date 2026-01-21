import React, { useState } from 'react';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';

import style from './index.module.scss';
import { getValueByPath } from '../../../../utils/formatting';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';

const ApplicantsConduct = ({ referenceForm, setReferenceForm, applicationId, getReferenceDetails, formSchema, formIndex, formSchemaWholeObject, getAllPath, getAllLabels }) => {
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [warningFields, setWarningFields] = useState([]);

    const getIsEdited = () => {

    }

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

    const checkAllSelected = (expectedValue) => {
        const proceduresPath = `referenceDetails.responses[${formIndex}].data.bestOfYourKnowledge`;
        const procedures = getValueByPath(referenceForm, proceduresPath) || {};
        const allValuesMatch = Object.values(procedures).every((val) => val === expectedValue);
        return allValuesMatch;
    }

    const checkSomeSelected = (expectedValue) => {
        const proceduresPath = `referenceDetails.responses[${formIndex}].data.bestOfYourKnowledge`;
        const procedures = getValueByPath(referenceForm, proceduresPath) || {};
        const someValuesMatch = Object.values(procedures).some((val) => val === expectedValue);
        return someValuesMatch;
    }

    const handleChange = (value) => {
        setReferenceForm((prevForm) => ({
            ...prevForm,
            referenceDetails: {
                ...prevForm.referenceDetails,
                responses: prevForm?.referenceDetails?.responses?.map((form, idx) => {
                    if (form?.schemaId === prevForm?.referenceDetails?.responses?.[formIndex]?.schemaId) {
                        const existingProcedures =
                            formSchema?.properties?.bestOfYourKnowledge?.properties || {};
                        const updatedProcedures = Object.keys(existingProcedures).reduce(
                            (acc, key) => {
                                acc[key] = value;
                                return acc;
                            },
                            {}
                        );

                        return {
                            ...form,
                            data: {
                                ...form.data,
                                bestOfYourKnowledge: updatedProcedures,
                            },
                        };
                    }

                    return form;
                }),
            },
        }));
    }
    return (
        <div>
            <div className={style.applicantInfoCard}>
                <div className={`${style.refRadioCard} ${style.headerGrid}`}>
                    <div className={style.headerText}>TO THE BEST OF YOUR KNOWLEDGE:</div>
                    <div>
                        <div className={style.headerText}>YES</div>
                        <div>
                            <CommonCheckBox checked={checkAllSelected('Yes')} onChange={(e) => handleChange('Yes')} />
                        </div>
                    </div>
                    <div>
                        <div className={style.headerText}>NO</div>
                        <div>
                            <CommonCheckBox checked={checkAllSelected('No')} onChange={(e) => handleChange('No')} />
                        </div>
                    </div>
                    <div>
                        <div className={style.headerText}>NO KNOWLEDGE</div>
                        <div>
                            <CommonCheckBox checked={checkAllSelected('No Knowledge')} onChange={(e) => handleChange('No Knowledge')} />
                        </div>
                    </div>
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
            {checkSomeSelected('Yes') && (
                <>
                    {formSchema !== undefined && "applicantsConductExplanation" in formSchema?.properties && (
                        <ApplicationFieldCard
                            object={formSchema?.properties?.applicantsConductExplanation}
                            refGridStyle={style.gridStyle}
                            gridStyle={style.fieldGridStyle}
                            baseKey={"applicantsConductExplanation"}
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
                </>
            )}
        </div>
    )
}

export default ApplicantsConduct;