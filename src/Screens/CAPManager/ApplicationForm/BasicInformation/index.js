import React, { useEffect, useState } from "react";
import ProgressCard from "../../../../Components/ProgressCard";
import ApplicationUserCard from "../../../../Components/ApplicationUserCard";
import ApplicationAssistanceCard from "../../../../Components/ApplicationAssistanceCard";
import CommonDivider from "../../../../Components/CommonFields/CommonDivider";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ApplicationFieldCard from "../../../../Components/ApplicationFieldCard";
import CommonCheckBox from "../../../../Components/CommonFields/CommonCheckBox";
import { GET, PUT } from "../../../dataSaver";
import { useNavigate } from "react-router-dom";
import { ErrorToaster, SuccessToaster } from "../../../../utils/toaster";

import style from "./index.module.scss";
import AIAssistantDialog from "../../../../Components/AIAssistantDialog";
import SaveInProgressDialog from "../../../../Components/SaveInProgressDialog";
import ValidationDialog from "../../../../Components/validationDialog";
import { FormatPhoneNumber } from "../../../../utils/formatting";

const BasicInformation = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
  const [form1, setForm1] = useState();
  const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
  const [form2, setForm2] = useState();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
  const [fieldPaths, setFieldPaths] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [labels, setLabels] = useState([]);
  const [warningFields, setWarningFields] = useState([]);
  const [showValidationDialog, setShowValidationDialog] = useState(false);

  console.log("basicForm", basicForm);
  useEffect(() => {
    getBasicForm();
  }, []);

  const getIsOpen = (value) => {
    setIsOpen(value);
  };

  const getIsValidationDialogOpen = (value) => {
    setShowValidationDialog(value);
  };

  const getAllPath = (data) => {
    let temp = metadata;
    if (!temp?.includes(data)) {
      console.log(temp, data, "Metadata");
      temp.push(data);
    }
    setMetadata(temp);
  };

  const getAllLabels = (data) => {
    setLabels(prev => {
      const exists = prev.some(item => JSON.stringify(item) === JSON.stringify(data));
      return exists ? prev : [...prev, data];
    });
    console.log(labels, "Metadata");
  };

  const getIsSaveInProgressOpen = (value) => {
    setIsSaveInProgressOpen(value);
  };

  const getBasicForm = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/basicForm`
    );
    if (basicForm) {
      const { data: form1 } = await GET(
        `application-management-service/formSchema/${basicForm?.generalSchemas?.[1]?.id}`
      );
      let temp = form1?.schema;
      if (temp.properties.applicant.properties !== null) {
        delete temp.properties.applicant.properties["applicantType"];
        delete temp.properties.applicant.properties["startDate"];
      }
      setForm1(form1?.schema);
      setFormSchemaWholeObject(form1);
    }
  };

  const getSkipClicked = (value) => {
    if (value) {
      handleSubmitApplicationReq();
    }
  };

  const getMissingFields = () => {
    let missingKeys = [];
    let keyValuePair = [];
    console.log(metadata, 'metadata')
    metadata?.map((data, index) => {
      if (labels[index]?.mandatory) {
        keyValuePair.push({
          key: data,
          value: getValueByPath(basicForm, data),
          label: labels[index]?.label,
        });
      }
    });
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/; // Example for formatted phone number

    keyValuePair?.map((data) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        data?.value === "" ||
        data?.value === null ||
        data?.value === undefined ||
        data?.value === 0 ||
        (data?.key === "basicDetails.applicant.email.officialEmail" &&
          !emailRegex.test(data?.value))
      ) {
        if (
          data.key === "basicDetails.applicant.email.officialEmail" &&
          !emailRegex.test(data.value)
        ) {
          setBasicForm((prevForm) => ({
            ...prevForm,
            basicDetails: {
              ...prevForm.basicDetails,
              applicant: {
                ...prevForm.basicDetails.applicant,
                email: {
                  ...prevForm.basicDetails.applicant.email,
                  officialEmail: "",
                },
              },
            },
          }));
        }
        if (
          basicForm.basicDetails.applicant.cellPhone &&
          !phoneRegex.test(basicForm.basicDetails.applicant.cellPhone)
        ) {
          missingKeys.push({
            key: "basicDetails.applicant.cellPhone",
            label: "Cell Phone",
            error: "Invalid phone number format",
          });
          setBasicForm((prevForm) => ({
            ...prevForm,
            basicDetails: {
              ...prevForm.basicDetails,
              applicant: {
                ...prevForm.basicDetails.applicant,
                cellPhone: "",
              },
            },
          }));
        }
        missingKeys.push(data);
      }
    });
    if (
      !formSchemaWholeObject?.schema?.properties?.departmentSpecialty?.dependencies?.department?.oneOf
        ?.map((data) => data?.properties?.department?.enum[0])
        ?.includes(
          getValueByPath(
            basicForm,
            "basicDetails.departmentSpecialty.department"
          )
        )
    ) {
      let temp = missingKeys?.filter(
        (data) =>
          !["basicDetails.departmentSpecialty.specialty"]?.includes(data?.key)
      );
      missingKeys = temp;
    }
    if (missingKeys?.length !== 0) {
      setShowValidationDialog(true);
    } else {
      handleSubmitApplicationReq();
    }
    setWarningFields(missingKeys);
  };

  const handleSubmitApplicationReq = async () => {
    // const errors = validateSchema(form1, basicForm?.basicDetails);
    // console.log(errors)
    let data = basicForm;
    console.log(data);
    await PUT(
      `application-management-service/application/${applicationId}`,
      data
    )
      .then((response) => {
        console.log(response);
        setBasicForm(response?.data);
        SuccessToaster("Staff Member Application Updated Successfully");
        getPreApplication();
        if (sessionStorage.getItem("fromSummary") === "true") {
          navigate(-1);
        } else {
          navigate(`/applicationForm/${applicationId}/${data?.forms[0]?.formCategory}/${btoa(data?.forms[0]?.schemaCategory)}`)
        }
      })
      .catch((error) => {
        console.log(error);
        ErrorToaster("Unexpected Error Updating Staff Member Application");
      });
  };

  const addPath = (newPath) => {
    setFieldPaths((prevPaths) => {
      // Use spread operator to append new paths to existing array
      const updatedPaths = new Set([...prevPaths, ...newPath]);
      return Array.from(updatedPaths);
    });
  };

  const getValueByPath = (obj, path) => {
    const keys = path.split(/[\.\[\]]+/).filter(Boolean);
    console.log(
      path,
      keys.reduce(
        (acc, key) => acc && acc[isNaN(key) ? key : Number(key)],
        basicForm
      ),
      basicForm,
      "if"
    );
    return keys.reduce(
      (acc, key) => acc && acc[isNaN(key) ? key : Number(key)],
      basicForm
    );
  };

  console.log(
    getValueByPath(basicForm, "basicDetails.departmentSpecialty.department"),
    fieldPaths
  );
  return (
    <div>
      <div className={`${style.applicationScreenGrid} `}>
        <div>
          <ProgressCard
            step={""}
            dataType={form1?.description}
            title={form1?.title}
            timeNumber={1}
            timeText={"Min"}
            progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`}
          />
          <div className={`${style.applicationCardStyle}  ${style.marginTop}`}>
            {/* <CommonMailingAddress label={'Business Mailing Address*'} onChangeAddressLine1={() => { }} placeholderAddressLine1={'123 Street'} maxLengthAddressLine1={25} valueAddressLine1={''}
                            onChangeAddressLine2={() => { }} placeholderAddressLine2={'Apartment 5'} maxLengthAddressLine2={25} valueAddressLine2={''} onChangeCity={() => { }} placeholderCity={'City'} maxLengthCity={25}
                            valueCity={''} onChangeState={() => { }} placeholderState={'Province'} maxLengthState={25} valueState={''} onChangeZipcode={() => { }} placeholderZipcode={'Zipcode'} maxLengthZipcode={15} valueZipcode={''} /> */}
            {form1 !== undefined && "applicant" in form1?.properties && (
              <ApplicationFieldCard
                object={form1?.properties?.applicant}
                gridStyle={style.applicantGrid}
                baseKey={"applicant"}
                basicForm={basicForm}
                setBasicForm={setBasicForm}
                isBasicPath={true}
                getAllPath={getAllPath}
                getAllLabels={getAllLabels}
                warningFields={warningFields}
                formSchema={formSchemaWholeObject}
              />
            )}
            <CommonDivider />
            {form1 !== undefined &&
              "credentialingPrivilegeCategory" in form1?.properties && (
                <ApplicationFieldCard
                  object={form1?.properties?.credentialingPrivilegeCategory}
                  gridStyle={style.credentialingGrid}
                  baseKey={"credentialingPrivilegeCategory"}
                  basicForm={basicForm}
                  setBasicForm={setBasicForm}
                  isBasicPath={true}
                  getAllPath={getAllPath}
                  getAllLabels={getAllLabels}
                  warningFields={warningFields}
                  formSchema={formSchemaWholeObject}
                />
              )}
            <CommonDivider />
            {form1 !== undefined &&
              "departmentSpecialty" in form1?.properties && (
                <ApplicationFieldCard
                  object={form1?.properties?.departmentSpecialty}
                  gridStyle={style.twoCol}
                  baseKey={"departmentSpecialty"}
                  basicForm={basicForm}
                  setBasicForm={setBasicForm}
                  isBasicPath={true}
                  getAllPath={getAllPath}
                  getAllLabels={getAllLabels}
                  warningFields={warningFields}
                  formSchema={formSchemaWholeObject}
                />
              )}
            {form1 !== undefined &&
              getValueByPath(
                basicForm,
                "basicDetails.departmentSpecialty.department"
              ) ===
              form1.if.properties.departmentSpecialty.properties.department
                .const &&
              form1.if.properties.departmentSpecialty.properties.specialty.enum?.includes(
                getValueByPath(
                  basicForm,
                  "basicDetails.departmentSpecialty.specialty"
                )
              ) &&
              form1 !== undefined &&
              "regionalCallResponsibilities" in form1?.properties && (
                <ApplicationFieldCard
                  object={form1?.properties?.regionalCallResponsibilities}
                  gridStyle={""}
                  baseKey={"regionalCallResponsibilities"}
                  basicForm={basicForm}
                  setBasicForm={setBasicForm}
                  isBasicPath={true}
                  getAllPath={getAllPath}
                  getAllLabels={getAllLabels}
                  warningFields={warningFields}
                  formSchema={formSchemaWholeObject}
                />
              )}
            <CommonDivider />
            {form1 !== undefined && "billingNumber" in form1?.properties && (
              <ApplicationFieldCard
                object={form1?.properties?.billingNumber}
                gridStyle={style.twoCol}
                baseKey={"billingNumber"}
                basicForm={basicForm}
                setBasicForm={setBasicForm}
                isBasicPath={true}
                getAllPath={getAllPath}
                getAllLabels={getAllLabels}
                warningFields={warningFields}
                formSchema={formSchemaWholeObject}
              />
            )}
            {/*<CommonDivider />
                     <div className={`${style.backgroundCard} ${style.marginTop}`}>
                        <div className={style.cardTitle}>Department / Speciality of Service</div>
                        <div className={style.fourCol}>
                            <div className={`${style.siteDisplayCard} ${style.siteDisplayGrid} ${style.marginTop}`}>
                                <div>
                                    <div className={style.siteDisplayDepartmentTextStyle}>Department of Surgery </div>
                                    <div className={style.siteDisplaySurgeryTextStyle}>Cardiothoracic Surgery</div>
                                    <div className={`${style.siteDisplaySiteTextStyle} ${style.marginTop10}`}>Cambridge Memorial Hospital </div>
                                </div>
                                <DeleteOutlineIcon sx={{ color: '#06617A', cursor: 'pointer' }} />
                            </div>
                             <div className={`${style.siteDisplayCard} ${style.siteDisplayGrid} ${style.marginTop}`}>
                                <div>
                                    <div className={style.siteDisplayDepartmentTextStyle}>Department of Surgery </div>
                                    <div className={style.siteDisplaySurgeryTextStyle}>General Surgery</div>
                                    <div className={`${style.siteDisplaySiteTextStyle} ${style.marginTop10}`}>Cambridge Memorial Hospital </div>
                                </div>
                                <DeleteOutlineIcon sx={{ color: '#06617A', cursor: 'pointer' }} />
                            </div> 
                        </div>
                    </div>
                    <CommonDivider />

                    <div className={style.marginTop}>
                        <CommonCheckBox checked={true} onChange={(e) => { }} label="I Have Verified the Information to be Correct, and would like to Proceed with my Application" />
                    </div> */}
          </div>
        </div>
        <div>
          <ApplicationAssistanceCard
            user={"Neena Greenly"}
            designation={"{Designation}"}
            contactNumber={"{Contact Number}"}
            email={"{Email}"}
          />
          <div className={style.stickyContainer}>
            <div
              className={`${style.saveInProgress} ${style.marginTop}`}
              onClick={() => getIsSaveInProgressOpen(true)}
            >
              SAVE IN PROGRESS
            </div>
            <div className={style.twoColForButton}>
              <div
                className={`${style.continue} ${style.marginTop10}`}
                onClick={() => navigate(-1)}
              >
                BACK
              </div>
              <div
                className={`${style.continue} ${style.marginTop10}`}
                onClick={() => getMissingFields()}
              >
                CONTINUE
              </div>
            </div>
          </div>
          {/* <div className={style.marginTop}>
                            <ApplicationReferenceDocuments />
                        </div> */}
        </div>
      </div>
      {isOpen && <AIAssistantDialog getIsOpen={getIsOpen} />}
      {isSaveInProgressOpen && (
        <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
      )}
      {showValidationDialog && (
        <ValidationDialog
          getIsOpen={getIsValidationDialogOpen}
          labelList={warningFields}
          getSkipClicked={getSkipClicked}
        />
      )}
    </div>
  );
};

export default BasicInformation;
