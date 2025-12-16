import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../../Components/ProgressCard';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import ApplicationReferenceDocuments from '../../../../Components/ApplicationReferenceDocuments';
import { GET, POST, PUT } from '../../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from '../../../../utils/toaster';
import SaveInProgressDialog from '../../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../../Components/validationDialog';

import style from './index.module.scss';

const MedicalHistory = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
  const [formSchema, setFormSchema] = useState();
  const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
  const [metadata, setMetadata] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [warningFields, setWarningFields] = useState([]);
  const [isEdited, setIsEdited] = useState(false);
  const { section, step } = useParams()
  const [formIndex, setFormIndex] = useState();
  const [navigateURL, setNavigateURL] = useState();
  const [navigateBackURL, setNavigateBackURL] = useState();
  const navigate = useNavigate()
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
  }, [basicForm, formIndex])

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
    setIsSaveInProgressOpen(value);
  }


  const getFormSchema = async () => {
    if (basicForm?.formSchemas?.[formIndex]?.id !== undefined) {
      const { data: form } = await GET(
        `application-management-service/formSchema/${basicForm?.formSchemas?.[formIndex]?.id}`
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
  const getMissingFields = () => {
    let missingKeys = [];
    let keyValuePair = [];
    const cellPhone = getValueByPath(
      basicForm,
      `forms[${formIndex}].data.impactingPractice.medicalHistory.cellPhone`
    );
    const emailId = getValueByPath(
      basicForm,
      `forms[${formIndex}].data.impactingPractice.medicalHistory.emailId`
    );
    console.log(cellPhone, 'cellPhone')
    metadata?.forEach((data, index) => {
      console.log("datastep13metadata", data);
      if (labels[index]?.mandatory) {
        keyValuePair.push({
          key: data,
          value: getValueByPath(basicForm, data),
          label: labels[index]?.label,
        });
      }
    });

    const validateBusinessPhone = (phone) => {
      const cleaned = phone?.replace(/\D/g, "");
      const phoneRegex = /^[0-9]{10}$/;
      return phoneRegex.test(cleaned);
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isCellPhoneInvalid = !validateBusinessPhone(cellPhone);
    const isEmailInvalid = !emailRegex.test(emailId);

    if (isCellPhoneInvalid && cellPhone && cellPhone !== "") {
      missingKeys.push({
        key: "cellPhone",
        value: cellPhone,
        label: "Cell Phone is invalid",
      });
    }

    if (isEmailInvalid && emailId && emailId !== "") {
      missingKeys.push({
        key: "emailId",
        value: emailId,
        label: "Email ID is invalid",
      });
    }

    // Check other fields for missing values
    keyValuePair?.forEach((data) => {
      if (
        data?.value === "" ||
        data?.value === null ||
        data?.value === undefined ||
        data?.value === 0
      ) {
        missingKeys.push(data);
      }
    });

    // Reset fields if invalid
    if (isCellPhoneInvalid) {
      setBasicForm((prevForm) => ({
        ...prevForm,
        forms: prevForm.forms.map((form) => {
          if (form?.schemaId === basicForm?.forms?.[formIndex]?.schemaId) {
            return {
              ...form,
              data: {
                ...form?.data,
                impactingPractice: {
                  ...form?.data?.impactingPractice,
                  medicalHistory: {
                    ...form?.data?.impactingPractice?.medicalHistory,
                    cellPhone: "",
                  },
                },
              },
            };
          }
          return form;
        }),
      }));
    }

    if (isEmailInvalid) {
      setBasicForm((prevForm) => ({
        ...prevForm,
        forms: prevForm.forms.map((form) => {
          if (form?.schemaId === basicForm?.forms?.[formIndex]?.schemaId) {
            return {
              ...form,
              data: {
                ...form?.data,
                impactingPractice: {
                  ...form?.data?.impactingPractice,
                  medicalHistory: {
                    ...form?.data?.impactingPractice?.medicalHistory,
                    emailId: "",
                  },
                },
              },
            };
          }
          return form;
        }),
      }));
    }

    if (getValueByPath(basicForm, `forms[${formIndex}].data.impactingPractice.medicalHistory.abilityToPractice`) === 'No' && getValueByPath(basicForm, `forms[${formIndex}].data.impactingPractice.medicalHistory.abilityToPractice`) !== undefined && getValueByPath(basicForm, `forms[${formIndex}].data.impactingPractice.medicalHistory.abilityToPractice`) !== null) {
      let medicalHistoryRequiredKeys = [`forms[${formIndex}].data.impactingPractice.medicalHistory.nameOfFacility`, `forms[${formIndex}].data.impactingPractice.medicalHistory.treatingPhysicianOrProvider`, `forms[${formIndex}].data.impactingPractice.medicalHistory.emailId`, `forms[${formIndex}].data.impactingPractice.medicalHistory.cellPhone`]
      let temp = missingKeys?.filter(data => !medicalHistoryRequiredKeys?.includes(data?.key));
      missingKeys = temp;
    }

    if (getValueByPath(basicForm, `forms[${formIndex}].data.impactingPractice.medicalHistory.abilityToPractice`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.impactingPractice.medicalHistory.abilityToPractice`) === undefined) {
      let filterKeys = [`forms[${formIndex}].data.impactingPractice.medicalHistory.text`, `forms[${formIndex}].data.impactingPractice.medicalHistory.file`]
      let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
      missingKeys = temp;
    }

    if (missingKeys.length !== 0) {
      setShowValidationDialog(true);
    } else {
      handleSubmitApplicationReq();
    }

    setWarningFields(missingKeys);
    console.log(keyValuePair, "Metadata", missingKeys);
  };


  const handleSubmitApplicationReq = async (data) => {
    if (isEdited || data) {
      let temp = {
        schemaId: basicForm?.forms?.[formIndex]?.schemaId,
        data: basicForm?.forms?.[formIndex]?.data,
        unFilledFields: warningFields?.map(data => data?.label),
        acknowledged: true
      }
      await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
        .then(response => {
          console.log(response)
          setBasicForm(response?.data)
          SuccessToaster("Application Updated Successfully");
          navigate(navigateURL)
          getPreApplication()
        })
        .catch((error) => {
          console.log(error)
          ErrorToaster("Unexpected Error Updating Application");
        });
    } else {
      navigate(navigateURL)
    }
  }

  const handleSubmitApplication = async () => {
    await POST(`application-management-service/application/${applicationId}/submit`)
      .then(response => {
        console.log(response)
        SuccessToaster("Application Submitted Successfully");
      })
      .catch((error) => {
        console.log(error)
        ErrorToaster("Unexpected Error Submitting Application");
      });
  }


  const getValueByPath = (obj, path) => {
    const keys = path.split(/[\.\[\]]+/).filter(Boolean);
    console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
    return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
  };

  const getIsEdited = (value) => {
    setIsEdited(value)
  }

  const handleBackClick = () => {
    navigate(navigateBackURL)
  }

  return (
    <div>
      <div className={style.applicationScreenGrid}>
        <ProgressCard step={'STEP 13'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={26} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} applicationId={applicationId} basicForm={basicForm} />
        <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
      </div>
      <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
        <div>
          <div className={style.applicationCardStyle}>
            {formSchema !== undefined && 'impactingPractice' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.impactingPractice} gridStyle={style.criminalHistoryGrid} baseKey={'impactingPractice'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} collapsableQuestionCard={true} stepPath={`forms[${formIndex}].data`} applicationId={applicationId} setIsEdited={getIsEdited} warningFields={warningFields} formSchema={formSchemaWholeObject} />
            )}
          </div>
        </div>
        <div>
          <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
          <div className={style.stickyContainer}>
            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
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

export default MedicalHistory;