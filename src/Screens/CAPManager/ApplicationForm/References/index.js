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

const References = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
  const [formSchema, setFormSchema] = useState();
  const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
  const [metadata, setMetadata] = useState([]);
  const [labels, setLabels] = useState([]);
  const [metadata2, setMetadata2] = useState([]);
  const [labels2, setLabels2] = useState([]);
  const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [showValidationDialog2, setShowValidationDialog2] = useState(false);
  const [warningFields, setWarningFields] = useState([]);
  const [warningFields2, setWarningFields2] = useState([]);
  const [isAddMore, setIsAddMore] = useState(false)
  const [isAddMore2, setIsAddMore2] = useState(false)
  const { section, step } = useParams()
  const [formIndex, setFormIndex] = useState();
  const navigate = useNavigate()
  const [navigateURL, setNavigateURL] = useState();
  const [navigateBackURL, setNavigateBackURL] = useState();
  const isDataAvailable = basicForm?.forms?.[formIndex]?.data?.references?.length > 0;
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


  useEffect(() => {
    if (isAddMore) {
      setIsAddMore2(false)
      setMetadata2([])
      setLabels2([])
    }
  }, [isAddMore])

  useEffect(() => {
    if (isAddMore2) {
      setIsAddMore(false)
      setMetadata([])
      setLabels([])
    }
  }, [isAddMore2])


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

  const getAllPath2 = (data) => {
    let temp = metadata2;
    if (!temp?.includes(data)) {
      console.log(temp, data, 'Metadata')
      temp.push(data);
    }
    setMetadata2(temp);
  }

  const getAllLabels2 = (data) => {
    setLabels2(prev => {
      const exists = prev.some(item => JSON.stringify(item) === JSON.stringify(data));
      return exists ? prev : [...prev, data];
    });
  };

  const getIsSaveInProgressOpen = (value) => {
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

  const getIsSubmitClicked = (value, data, skip) => {
    if (value) {
      // setIsAddMore(false);
      // setIsAddMore2(false);
      handleSubmitApplicationReq(data, skip)
    }
  }

  // const getSkipClicked = (value) => {
  //     if (value) {
  //         handleSubmitApplicationReq("skipped")
  //     }
  // }

  const getMissingFields = () => {
    let missingKeys = [];
    let keyValuePair = [];
    metadata?.map((data, index) => {
      console.log("datadata", data, labels[index]?.mandatory);
      if (labels[index]?.mandatory) {
        keyValuePair.push({
          key: data,
          value: getValueByPath(basicForm, data),
          label: labels[index]?.label,
        });
      }
    });
    keyValuePair?.map((data) => {
      console.log("keyValuePair", keyValuePair);
      const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/; // Example for formatted phone number
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        data?.value === "" ||
        data?.value === null ||
        data?.value === undefined ||
        data?.value === 0 ||
        (data?.key === "undefined.references.emailAddress" &&
          !emailRegex.test(data?.value)) ||
        (data?.key === "undefined.references.contactNumber" &&
          !phoneRegex.test(data?.value))
      ) {
        missingKeys.push(data);
      }
    });
    if (missingKeys?.length !== 0) {
      // setShowValidationDialog(true);
    } else {
      handleSubmitApplicationReq();
    }
    setWarningFields(missingKeys);
    console.log(keyValuePair, "Metadata", missingKeys);
    return missingKeys;
  };

  const getMissingFields2 = () => {
    let missingKeys = [];
    let keyValuePair = [];
    metadata2?.map((data, index) => {
      console.log("datadata", data, labels2[index]?.mandatory);
      if (labels2[index]?.mandatory) {
        keyValuePair.push({
          key: data,
          value: getValueByPath(basicForm, data),
          label: labels2[index]?.label,
        });
      }
    });
    keyValuePair?.map((data) => {
      console.log("keyValuePair", keyValuePair);
      const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/; // Example for formatted phone number
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        data?.value === "" ||
        data?.value === null ||
        data?.value === undefined ||
        data?.value === 0 ||
        (data?.key === "undefined.references.emailAddress" &&
          !emailRegex?.test(data?.value)) ||
        (data?.key === "undefined.references.contactNumber" &&
          !phoneRegex?.test(data?.value))
      ) {
        missingKeys.push(data);
      }
    });
    if (missingKeys?.length !== 0) {
      // setShowValidationDialog(true);
    } else {
      handleSubmitApplicationReq();
    }
    setWarningFields2(missingKeys);
    console.log(keyValuePair, "Metadata", missingKeys);
    return missingKeys;
  };


  const removeEmptyStrings = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "string" && obj[key].trim() === "") {
        delete obj[key];
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        removeEmptyStrings(obj[key]);
      }
    });
    return obj;
  };

  const handleSubmitApplicationReq = async (data) => {
    let missingFields = []
    let emptyStringCheckedObject = removeEmptyStrings(data?.forms?.[formIndex]?.data);
    let tempValidation = {
      schemaId: data?.forms?.[formIndex]?.schemaId,
      data: emptyStringCheckedObject,
    }
    await POST(`application-management-service/application/validateForm`, tempValidation)
      .then(response => {
        console.log(response, response?.response?.data, 'missingFields')
        missingFields = (response?.data !== undefined && response?.data === true) ? [] : response?.response?.data;
      })
      .catch((error) => {
        console.log(error)
      })
    let temp = {
      schemaId: data?.forms?.[formIndex]?.schemaId,
      data: data?.forms?.[formIndex]?.data,
      unFilledFields: missingFields,
      acknowledged: missingFields?.length !== 0 ? false : true,
      dataStatus: missingFields?.length > 0 ? 'SKIPPED_MANDATORY_FIELD' : 'COMPLETED'
    }
    await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
      .then(response => {
        console.log(response)
        SuccessToaster("Application Updated Successfully");
        getPreApplication();
      })
      .catch((error) => {
        console.log(error)
        ErrorToaster("Unexpected Error Updating Application");
      });
  }

  const handleContinue = async (skip) => {
    if (skip) {
      let temp = {
        schemaId: basicForm?.forms?.[formIndex]?.schemaId,
        data: basicForm?.forms?.[formIndex]?.data,
        unFilledFields: basicForm?.forms?.[formIndex]?.unFilledFields,
        acknowledged: true,
        dataStatus: basicForm?.forms?.[formIndex]?.dataStatus
      }
      await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
        .then(response => {
          console.log(response)
          SuccessToaster("Application Updated Successfully");
          getPreApplication();
        })
        .catch((error) => {
          console.log(error)
          ErrorToaster("Unexpected Error Updating Application");
        });
    }
    if (sessionStorage.getItem('fromSummary') === "true") {
      navigate(-1);
      sessionStorage.setItem('fromSummary', false)
    }
    else {
      navigate(navigateURL)
    }
  }

  const getValueByPath = (obj, path) => {
    const keys = path.split(/[\.\[\]]+/).filter(Boolean);
    console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
    return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
  };

  const handleBackClick = () => {
    navigate(navigateBackURL)
  }

  return (
    <div>
      <div className={style.applicationScreenGrid}>
        <ProgressCard step={'STEP 10'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={20} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} applicationId={applicationId} basicForm={basicForm} />
        <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
      </div>
      <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
        <div>
          <div className={style.applicationCardStyle}>
            {formSchema !== undefined && 'references' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.references} gridStyle={style.twoCol} baseKey={'references'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} addMoreType={true} formId={basicForm?.forms?.[formIndex]?.id} getIsSubmitClicked={getIsSubmitClicked} applicationId={applicationId} tableGrid={style.tableGrid} warningFields={warningFields} getMissingFields={getMissingFields} showValidationDialog={showValidationDialog} setShowValidationDialog={setShowValidationDialog} isAddMore={isAddMore} setIsAddMore={setIsAddMore} formSchema={formSchemaWholeObject} heading={'References not yet provided'} />
            )}
            {/* <CommonDivider />
            {formSchema !== undefined && 'privilegeReferences' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.privilegeReferences} gridStyle={style.twoCol} baseKey={'privilegeReferences'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath2} getAllLabels={getAllLabels2} addMoreType={true} formId={basicForm?.forms?.[formIndex]?.id} getIsSubmitClicked={getIsSubmitClicked} applicationId={applicationId} tableGrid={style.tableGrid} warningFields={warningFields2} getMissingFields={getMissingFields2} showValidationDialog={showValidationDialog2} setShowValidationDialog={setShowValidationDialog2} isAddMore={isAddMore2} setIsAddMore={setIsAddMore2} formSchema={formSchemaWholeObject} heading={'References not yet provided'} />
            )} */}
          </div>
        </div>
        <div>
          <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
          <div className={style.stickyContainer}>
            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
            <div className={`${style.saveInProgress} ${style.marginTop10} ${isDataAvailable ? style.disabledButton : ''} `} onClick={isDataAvailable ? () => { } : () => handleContinue(true)} > SKIP FOR NOW </div>
            <div className={style.twoColForButton}>
              <div className={`${style.continue} ${style.marginTop10}`} onClick={handleBackClick}>BACK</div>
              <div className={`${style.continue} ${style.marginTop10} ${isDataAvailable ? '' : style.disabledButton}`} onClick={isDataAvailable ? () => handleContinue() : () => { }}>CONTINUE</div>
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
      {/* {showValidationDialog && (
                <ValidationDialog getIsOpen={getIsValidationDialogOpen} labelList={warningFields} getSkipClicked={getSkipClicked} />
            )} */}
    </div>
  )
}

export default References;