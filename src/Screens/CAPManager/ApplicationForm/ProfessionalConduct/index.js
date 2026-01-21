import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../../Components/ProgressCard';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import ApplicationReferenceDocuments from '../../../../Components/ApplicationReferenceDocuments';
import { GET, PUT } from '../../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from '../../../../utils/toaster';
import SaveInProgressDialog from '../../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../../Components/validationDialog';

import style from './index.module.scss';

const ProfessionalConduct = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
    const [formSchema, setFormSchema] = useState();
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [warningFields, setWarningFields] = useState([]);
    const { section, step } = useParams()
    const [formIndex, setFormIndex] = useState();
    const navigate = useNavigate()
    const [isEdited, setIsEdited] = useState(false);
    const [navigateURL, setNavigateURL] = useState();
    const [navigateBackURL, setNavigateBackURL] = useState();
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            setNavigateURL((basicForm?.forms?.filter(data => data?.formCategory === 'Form' || data?.formCategory === 'Disclosure')?.length === (formIndex + 1)) ? `/applicationForm/${applicationId}/Form/${btoa('PODCheck')}` : `/applicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms[formIndex + 1]?.schemaCategory)}`)
            if (formIndex > 0) {
                setNavigateBackURL(`/applicationForm/${applicationId}/${basicForm?.forms[formIndex - 1]?.formCategory}/${btoa(basicForm?.forms[formIndex - 1]?.schemaCategory)}`)
            } else {
                setNavigateBackURL(`/applicationForm/${applicationId}/${basicForm?.forms[0]?.formCategory}/${btoa(basicForm?.forms[0]?.schemaCategory)}`)
            }
        }
    }, [basicForm?.forms?.[formIndex]?.schemaId, formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    }, [basicForm, step])

    const getIsValidationDialogOpen = (value) => {
        setShowValidationDialog(value);
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
        setLabels(prev => {
            const exists = prev.some(item => JSON.stringify(item) === JSON.stringify(data));
            return exists ? prev : [...prev, data];
        });
    };

    const getIsSaveInProgressOpen = (value) => {
        if (value) {
            handleSubmitApplicationReq('', true);
        }
        setIsSaveInProgressOpen(value);
    }

    const getFormSchema = async () => {
        if (basicForm?.forms?.[formIndex]?.schemaId !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.forms?.[formIndex]?.schemaId}`
            );
            setFormSchema(form?.schema)
            setFormSchemaWholeObject(form)
        }
    }

    const getSkipClicked = (value) => {
        if (value) {
            handleSubmitApplicationReq("skipped")
        }
    }

    const getValueByPath = (obj, path) => {
        const keys = path.split(/[\.\[\]]+/).filter(Boolean);
        console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
        return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
    };

    const getMissingFields = () => {
        let missingKeys = [];
        let keyValuePair = [];
        metadata?.map((data, index) => {
            keyValuePair.push({ key: data, value: getValueByPath(basicForm, data), label: labels[index]?.label })
        })
        keyValuePair?.map(data => {
            if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0) {
                missingKeys.push(data)
            }
        })
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.disciplineCommittee`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.disciplineCommittee`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.disciplineCommitteeText`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.disciplineCommitteeFile`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.disciplineCommitteeResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.complaintsAndReportCommittee`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.complaintsAndReportCommittee`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.complaintsAndReportCommitteeText`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.complaintsAndReportCommitteeFile`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.complaintsAndReportCommitteeResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.investigation`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.investigation`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.investigationText`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.investigationFile`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.investigationResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.randomReview`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.randomReview`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.randomReviewText`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.randomReviewFile`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.randomReviewResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.resultOfQac`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.resultOfQac`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.resultOfQacText`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.resultOfQacFile`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.resultOfQacResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.outcomeByTheCollege`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.outcomeByTheCollege`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.outcomeByTheCollegeText`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.outcomeByTheCollegeFile`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.outcomeByTheCollegeResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.advanceProceeding`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.advanceProceeding`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.advanceProceedingText`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.advanceProceedingFile`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.advanceProceedingResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.disciplinaryReviews`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.disciplinaryReviews`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.disciplinaryReviewsText`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.disciplinaryReviewsFile`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.disciplinaryReviewsResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.involuntaryRestriction`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.involuntaryRestriction`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.involuntaryRestrictionText`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.involuntaryRestrictionFile`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.involuntaryRestrictionResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.privilegeDisputes`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.privilegeDisputes`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.privilegeDisputesText`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.privilegeDisputesFile`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.privilegeDisputesResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.disciplineCommittee`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.disciplineCommitteeResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.complaintsAndReportCommittee`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.complaintsAndReportCommitteeResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.investigation`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.investigationResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.randomReview`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.randomReviewResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.resultOfQac`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.resultOfQacResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.outcomeByTheCollege`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.outcomeByTheCollegeResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.advanceProceeding`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.advanceProceedingResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.disciplinaryReviews`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.disciplinaryReviewsResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.involuntaryRestriction`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.involuntaryRestrictionResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.privilegeDisputes`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.privilegeDisputesResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (missingKeys?.length !== 0) {
            setShowValidationDialog(true)
        } else {
            handleSubmitApplicationReq()
        }
        setWarningFields(missingKeys)
        console.log(keyValuePair, 'Metadata', missingKeys)
    }

    const getDataStatus = () => {
        let missingItems = [];
        let keyValuePair = [];
        metadata?.map((data, index) => {
            keyValuePair.push({ key: data, value: getValueByPath(basicForm, data), label: labels[index]?.label, mandatory: labels[index]?.mandatory })
        })
        keyValuePair?.map(data => {
            if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0) {
                missingItems.push(data)
            }
        })
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.disciplineCommittee`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.disciplineCommittee`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.disciplineCommitteeText`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.disciplineCommitteeFile`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.disciplineCommitteeResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.complaintsAndReportCommittee`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.complaintsAndReportCommittee`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.complaintsAndReportCommitteeText`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.complaintsAndReportCommitteeFile`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.complaintsAndReportCommitteeResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.investigation`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.investigation`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.investigationText`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.investigationFile`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.investigationResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.randomReview`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.randomReview`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.randomReviewText`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.randomReviewFile`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.randomReviewResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.resultOfQac`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.resultOfQac`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.resultOfQacText`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.resultOfQacFile`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.resultOfQacResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.outcomeByTheCollege`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.outcomeByTheCollege`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.outcomeByTheCollegeText`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.outcomeByTheCollegeFile`, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.outcomeByTheCollegeResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.advanceProceeding`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.advanceProceeding`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.advanceProceedingText`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.advanceProceedingFile`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.advanceProceedingResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.disciplinaryReviews`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.disciplinaryReviews`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.disciplinaryReviewsText`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.disciplinaryReviewsFile`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.disciplinaryReviewsResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.involuntaryRestriction`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.involuntaryRestriction`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.involuntaryRestrictionText`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.involuntaryRestrictionFile`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.involuntaryRestrictionResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.privilegeDisputes`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.privilegeDisputes`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.privilegeDisputesText`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.privilegeDisputesFile`, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.privilegeDisputesResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.disciplineCommittee`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.disciplineCommitteeResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.complaintsAndReportCommittee`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.complaintsAndReportCommitteeResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.investigation`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.investigationResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.randomReview`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.randomReviewResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.resultOfQac`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.resultOfQacResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.outcomeByTheCollege`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure1.professionalConductDisclosures.outcomeByTheCollegeResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.advanceProceeding`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.advanceProceedingResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.disciplinaryReviews`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.disciplinaryReviewsResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.involuntaryRestriction`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.involuntaryRestrictionResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.privilegeDisputes`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.conductDisclosure2.hospitalMisconductHistory.privilegeDisputesResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        return missingItems;
    }

    const skipDisable = getDataStatus()?.filter(data => data?.mandatory)?.length === 0;

    const handleSubmitApplicationReq = async (data, save) => {
        if (isEdited || data || save) {
            let temp = {
                schemaId: basicForm?.forms?.[formIndex]?.schemaId,
                data: basicForm?.forms?.[formIndex]?.data,
                unFilledFields: warningFields?.map(data => data?.label),
                acknowledged: true,
                dataStatus: getDataStatus()?.filter(data => data?.mandatory)?.length > 0 ? 'SKIPPED_MANDATORY_FIELD' : getDataStatus()?.length > 0 ? 'SKIPPED_NON_MANDATORY_FIELD' : 'COMPLETED'
            }
            await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
                .then(response => {
                    console.log(response)
                    setBasicForm(response?.data)
                    SuccessToaster("Application Updated Successfully");
                    getPreApplication();
                    if (!save) {
                        if (sessionStorage.getItem('fromSummary') === "true") {
                            navigate(-1);
                            sessionStorage.setItem('fromSummary', false)
                        }
                        else {
                            navigate(navigateURL)

                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    ErrorToaster("Unexpected Error Updating Application");
                });
        } else {
            if (sessionStorage.getItem('fromSummary') === "true") {
                navigate(-1);
                sessionStorage.setItem('fromSummary', false)
            }
            else {
                navigate(navigateURL)

            }
        }
    }

    const getIsEdited = (value) => {
        setIsEdited(value)
    }

    const handleBackClick = () => {
        navigate(navigateBackURL)
    }

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 11'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={22} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} applicationId={applicationId} basicForm={basicForm} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        {formSchema !== undefined && 'conductDisclosure1' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.conductDisclosure1} gridStyle={style.conductGrid} baseKey={'conductDisclosure1'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} collapsableQuestionCard={true} stepPath={`forms[${formIndex}].data`} applicationId={applicationId} setIsEdited={getIsEdited} warningFields={warningFields} formSchema={formSchemaWholeObject} />
                        )}
                        {formSchema !== undefined && 'conductDisclosure2' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.conductDisclosure2} gridStyle={style.conductGrid} baseKey={'conductDisclosure2'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} collapsableQuestionCard={true} stepPath={`forms[${formIndex}].data`} applicationId={applicationId} setIsEdited={getIsEdited} warningFields={warningFields} formSchema={formSchemaWholeObject} />
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={style.stickyContainer}>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        <div className={`${style.saveInProgress} ${style.marginTop10}  ${skipDisable ? style.disabledButton : ''}`} onClick={skipDisable ? () => { } : () => getSkipClicked(true)} > SKIP FOR NOW </div>
                        <div className={style.twoColForButton}>
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={handleBackClick}>BACK</div>
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => getMissingFields()}>CONTINUE</div>
                        </div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
            {
                isSaveInProgressOpen && (
                    <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
                )
            }
            {showValidationDialog && (
                <ValidationDialog getIsOpen={getIsValidationDialogOpen} labelList={warningFields} getSkipClicked={getSkipClicked} />
            )}
        </div>
    )
}

export default ProfessionalConduct;