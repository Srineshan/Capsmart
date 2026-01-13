import React, { useState } from 'react';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';

import style from './index.module.scss';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';
import { getValueByPath } from '../../../../utils/formatting';

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

    const checkAllSelected = (expectedValue) => {
        const proceduresPath = `referenceDetails.responses[${formIndex}].data.natureOfProceduresObserved`;
        const procedures = getValueByPath(referenceForm, proceduresPath) || {};
        const allValuesMatch = Object.values(procedures).every((val) => val === expectedValue);
        return allValuesMatch;
    }

    const checkSomeSelected = (expectedValue) => {
        const proceduresPath = `referenceDetails.responses[${formIndex}].data.natureOfProceduresObserved`;
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
                            form?.data?.natureOfProceduresObserved || {};

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
                                natureOfProceduresObserved: updatedProcedures,
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
                    <div className={style.headerText}>NATURE OF CLINICAL PROCEDURES OBSERVED</div>
                    <div>
                        <div className={style.headerText}>OUTSTANDING</div>
                        <div className={style.centerAlign}>
                            <CommonCheckBox checked={checkAllSelected('OUTSTANDING')} onChange={(e) => handleChange('OUTSTANDING')} />
                        </div>
                    </div>
                    <div>
                        <div className={style.headerText}>SATISFACTORY</div>
                        <div className={style.centerAlign}>
                            <CommonCheckBox checked={checkAllSelected('SATISFACTORY')} onChange={(e) => handleChange('SATISFACTORY')} />
                        </div>
                    </div>
                    <div>
                        <div className={style.headerText}>UNSATISFACTORY</div>
                        <div className={style.centerAlign}>
                            <CommonCheckBox checked={checkAllSelected('UNSATISFACTORY')} onChange={(e) => handleChange('UNSATISFACTORY')} />
                        </div>
                    </div>
                    <div>
                        <div className={style.headerText}>UNABLE TO ASSESS</div>
                        <div className={style.centerAlign}>
                            <CommonCheckBox checked={checkAllSelected('UNABLE TO ASSESS')} onChange={(e) => handleChange('UNABLE TO ASSESS')} />
                        </div>
                    </div>
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
            {checkSomeSelected('UNSATISFACTORY') && (
                <>
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
                </>
            )}
        </div>
    )
}

export default ClinicalAbilities;