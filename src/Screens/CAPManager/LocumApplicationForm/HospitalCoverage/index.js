import React, { useEffect, useState } from "react";
import ProgressCard from "../../../../Components/ProgressCard";
import ApplicationUserCard from "../../../../Components/ApplicationUserCard";
import ApplicationAssistanceCard from "../../../../Components/ApplicationAssistanceCard";
import CommonDivider from "../../../../Components/CommonFields/CommonDivider";
import ApplicationFieldCard from "../../../../Components/ApplicationFieldCard";
import ApplicationReferenceDocuments from "../../../../Components/ApplicationReferenceDocuments";
import { GET, PUT } from "../../../dataSaver";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorToaster, SuccessToaster } from "../../../../utils/toaster";
import SaveInProgressDialog from "../../../../Components/SaveInProgressDialog";
import ValidationDialog from "../../../../Components/validationDialog";
import JourneyStep9 from "./../../../../images/journeyStep9.png";
import style from "./index.module.scss";
import WelcomeCard from "../../../../Components/WelcomeCard";
import ReappointmentProgressCard from "../../../../Components/ReappointmentProgressCard";
import CommonTextField from "../../../../Components/CommonFields/CommonTextField";
import { TextArea } from "@blueprintjs/core";
import ReappointmentJourneyDialog from "../../../../Components/reappointmentJourneyDialog";
import CommonSelectField from "../../../../Components/CommonFields/CommonSelectField";
import LocumProgressCard from "../../../../Components/LocumProgressCard";

const HospitalCoverage = ({ basicForm, setBasicForm, getPreApplication }) => {
  const [formSchema, setFormSchema] = useState();
  const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
  const [metadata, setMetadata] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [warningFields, setWarningFields] = useState([]);
  const navigate = useNavigate();
  const [isEdited, setIsEdited] = useState(false);
  const [formIndex, setFormIndex] = useState();
  const { applicationId, section, step } = useParams();
  const [navigateURL, setNavigateURL] = useState();
  const [whoCovers, setWhoCovers] = useState("");
  const [whoCoversObstetrics, setWhoCoversObstetrics] = useState("");
  const [showJourneyDialog, setShowJourneyDialog] = useState(false);
  const [specificProviderGroup, setSpecificProviderGroup] = useState("");
  const [providerOptions, setProviderOptions] = useState([]);
  const [obstetricsSpecificProviderGroup, setObstetricsSpecificProviderGroup] =
    useState("");
  const [applicantOptions, setApplicantOptions] = useState([]);
  const [providerLabels, setProviderLabels] = useState("");
  const [obstetricsapplicantOptions, setObstetricsApplicantOptions] = useState(
    []
  );

  useEffect(() => {
    if (basicForm && !formSchema) {
      getFormSchema();
    }
    if (basicForm !== undefined && formIndex !== undefined) {
      setWhoCovers(
        basicForm?.forms?.[formIndex]?.data?.whoCovers !== undefined
          ? basicForm?.forms?.[formIndex]?.data?.whoCovers
          : ""
      );
      setWhoCoversObstetrics(
        basicForm?.forms?.[formIndex]?.data?.whoCoversObstetrics !== undefined
          ? basicForm?.forms?.[formIndex]?.data?.whoCoversObstetrics
          : ""
      );
      setNavigateURL(
        basicForm?.forms?.filter((data) => data?.formCategory === 'Form' || 'Disclosure')
          ?.length ===
          formIndex + 1
          ? `/locumApplicationForm/${applicationId}/Form/${btoa(
            `ApplicantAcknowledgement`
          )}`
          : `/locumApplicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory
          }/${btoa(basicForm?.forms[formIndex + 1]?.schemaCategory)}`
      );
    }
  }, [basicForm, formIndex]);

  useEffect(() => {
    setFormIndex(
      basicForm?.forms?.findIndex((data) => data?.schemaCategory === atob(step))
    );
  }, [basicForm, step]);

  useEffect(() => {
    const fetchDepartmentStaffs = async () => {
      try {
        const currentApplicantId = basicForm?.applicant?.id;
        const departmentId = basicForm?.basicDetailReferences?.department?.id;
        const applicantTypeId =
          basicForm?.basicDetailReferences?.applicantType?.id;
        const response = await GET(
          `application-management-service/staff?status=ACTIVE&departmentId=${departmentId}&applicantTypeId=${applicantTypeId}&sortByField=STAFF_NAME`
        );
        console.log(response.data);

        const filteredStaffs = response.data.staffs.filter(
          (staff) => staff.applicant.id !== currentApplicantId
        );

        const options = filteredStaffs.map((staff) => ({
          value: `${staff.applicant.name.firstName} ${staff.applicant.name.middleName} ${staff.applicant.name.lastName}`,
          label: `${staff.applicant.name.firstName} ${staff.applicant.name.middleName} ${staff.applicant.name.lastName}`,
        }));
        setApplicantOptions(options);
        console.log(options);
      } catch (error) {
        console.error("Error fetching department staffs:", error);
      }
    };

    fetchDepartmentStaffs();
  }, [basicForm]);

  useEffect(() => {
    if (
      basicForm?.basicDetails?.departmentSpecialty?.department ===
      "Women & Children" &&
      basicForm?.basicDetails?.departmentSpecialty?.specialty ===
      "Obstetrics & Gynecology"
    ) {
      const fetchObstetricsStaffs = async () => {
        try {
          const response = await GET(
            `application-management-service/staff?status=ACTIVE&departmentId=66dc4b370e34d3372e43f023&sortByField=STAFF_NAME`
          );
          const staffOptions = response.data.map((obstetricsstaff) => ({
            value: `${obstetricsstaff.applicant.name.firstName} ${obstetricsstaff.applicant.name.middleName} ${obstetricsstaff.applicant.name.lastName}`,
            label: `${obstetricsstaff.applicant.name.firstName} ${obstetricsstaff.applicant.name.middleName} ${obstetricsstaff.applicant.name.lastName}`,
          }));
          setObstetricsApplicantOptions(staffOptions);
        } catch (error) {
          console.error("Error fetching obstetrics department staffs:", error);
        }
      };

      fetchObstetricsStaffs();
    }
  }, [basicForm]);

  useEffect(() => {
    setWhoCovers("");
  }, [specificProviderGroup]);

  useEffect(() => {
    setWhoCoversObstetrics("");
  }, [obstetricsSpecificProviderGroup]);

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
    let tempLabels = labels;
    if (!tempLabels?.includes(data)) {
      console.log(tempLabels, data, "Metadata");
      tempLabels.push(data);
    }
    setLabels(tempLabels);
  };

  const getIsSaveInProgressOpen = (value) => {
    setIsSaveInProgressOpen(value);
  };

  const getIsShowReappointmentJourneyDialog = (value) => {
    setShowJourneyDialog(value);
  };

  const getFormSchema = async () => {
    if (basicForm?.forms?.[formIndex]?.schemaId !== undefined) {
      const { data: form } = await GET(
        `application-management-service/formSchema/${basicForm?.forms?.[formIndex]?.schemaId}`
      );
      setFormSchema(form?.schema || {});
      setFormSchemaWholeObject(form || {});
      console.log(form);

      const providerField =
        form?.schema?.properties?.coverageDetails?.properties?.providerType;
      console.log(providerField);

      const providerLabel = providerField.label;
      setProviderLabels(providerLabel);

      if (providerField?.enum) {
        const enumValues = providerField.enum;
        console.log(enumValues);

        setProviderOptions(enumValues);
      }
    }
  };

  const getSkipClicked = (value) => {
    if (value) {
      handleSubmitApplicationReq("skipped");
    }
  };

  const getMissingFields = () => {
    let missingKeys = [];
    if (whoCovers === "") {
      missingKeys.push({
        label: "Who covers your hospital patients when you are not available?",
      });
    }
    if (
      whoCoversObstetrics === "" &&
      basicForm?.basicDetails?.departmentSpecialty?.department ===
      "Women & Children" &&
      basicForm?.basicDetails?.departmentSpecialty?.specialty ===
      "Obstetrics & Gynecology"
    ) {
      missingKeys.push({
        label:
          "If You Are Practicing Obstetrics, Who Covers Your Patients When You Are Not Available?",
      });
    }
    if (missingKeys?.length !== 0) {
      setShowValidationDialog(true);
    } else {
      handleSubmitApplicationReq();
    }
    setWarningFields(missingKeys);
    console.log("Metadata", missingKeys);
  };

  const handleSubmitApplicationReq = async (data) => {
    // if (isEdited) {
    let temp = {
      schemaId: basicForm?.forms?.[formIndex]?.schemaId,
      data: { whoCovers: whoCovers, whoCoversObstetrics: whoCoversObstetrics },
      unFilledFields: warningFields?.map((data) => data?.label),
      acknowledged: data === "skipped" ? false : true,
    };
    await PUT(
      `application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`,
      temp
    )
      .then((response) => {
        console.log(response);
        setBasicForm(response?.data);
        SuccessToaster("Application Updated Successfully");
        getPreApplication();
        if (sessionStorage.getItem("fromSummary") === "true") {
          navigate(-1);
        } else {
          navigate(navigateURL);
        }
      })
      .catch((error) => {
        console.log(error);
        ErrorToaster("Unexpected Error Updating Application");
      });
    // } else {
    //     if (sessionStorage.getItem('fromSummary') === "true") {
    //         navigate(-1);
    //     }
    //     else {
    //         navigate(navigateURL)

    //     }
    // }
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

  const getIsEdited = (value) => {
    setIsEdited(value);
  };
  return (
    <div>
      <div className={style.applicationScreenGrid}>
        <LocumProgressCard
          step={"STEP 11"}
          dataType={formSchema?.description}
          title={formSchema?.title}
          timeNumber={22}
          timeText={"Min"}
          progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`}
          basicForm={basicForm}
        />
        <ApplicationUserCard
          user={"First Mi Last"}
          applyingFor={"{Doctor} Applying As {Associate}"}
        />
      </div>
      <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
        <div>
          <div className={`${style.applicationCardStyle}`}>
            <div className={`${style.warningCard} ${style.marginTop10}`}>
              <div className={style.warningText}>
                24 hours coverage of hospital patients, including those in the
                ER, is a requirement of Professional Staff responsibilities. The
                physician must provide an acceptable method to respond to
                hospital calls.
              </div>
            </div>
            <div className={style.marginTop}>
              <div className={`${style.lableStyle}`}>
                {`Who covers your hospital patients when you are not available?*`}
              </div>
              <div className={style.rowContainer}>
                <div className={style.fieldWrapper}>
                  <CommonSelectField
                    value={specificProviderGroup}
                    onChange={(e) => setSpecificProviderGroup(e.target.value)}
                    className={style.fullWidth}
                    firstOptionLabel={providerLabels}
                    firstOptionValue=""
                    valueList={providerOptions}
                    labelList={providerOptions}
                    disabledList={[]}
                    label={providerLabels}
                    disabledSelect={false}
                    required={true}
                    error={false}
                    warning={false}
                  />
                </div>
                {specificProviderGroup === "Individual" && (
                  <div className={style.fieldWrapper}>
                    <CommonSelectField
                      value={whoCovers}
                      onChange={(e) => setWhoCovers(e.target.value)}
                      className={style.fullWidth}
                      valueList={applicantOptions.map((option) => option.value)}
                      labelList={applicantOptions.map((option) => option.label)}
                      disabledList={[]}
                      disabledSelect={false}
                      error={!whoCovers}
                      label={"Select Who covers in Individual Provider"}
                      required={true}
                      warning={warningFields
                        ?.map((data) => data?.label)
                        ?.includes(
                          `Who covers your hospital patients when you are not available?`
                        )}
                    />
                  </div>
                )}

                {specificProviderGroup === "Group" && (
                  <div className={style.fieldWrapper}>
                    <CommonTextField
                      value={whoCovers}
                      className={`${style.fullWidth}`}
                      onChange={(e) => setWhoCovers(e.target.value)}
                      placeholder={"Enter Here"}
                      label={"Who covers in Group provider"}
                      required={true}
                      warning={warningFields
                        ?.map((data) => data?.label)
                        ?.includes(
                          `Who covers your hospital patients when you are not available?`
                        )}
                      normalLabel={true}
                    />
                  </div>
                )}
              </div>
            </div>
            {basicForm?.basicDetails?.departmentSpecialty?.department ===
              "Women & Children" &&
              basicForm?.basicDetails?.departmentSpecialty?.specialty ===
              "Obstetrics & Gynecology" && (
                <div className={style.marginTop}>
                  <div className={`${style.lableStyle}`}>
                    {`If you are practicing obstetrics, who covers your patients when you are not available?*`}
                  </div>
                  <CommonSelectField
                    value={obstetricsSpecificProviderGroup}
                    onChange={(e) =>
                      setObstetricsSpecificProviderGroup(e.target.value)
                    }
                    className={style.fullWidth}
                    firstOptionLabel={providerLabels}
                    firstOptionValue=""
                    valueList={providerOptions}
                    labelList={providerOptions}
                    disabledList={[]}
                    label={providerLabels}
                    disabledSelect={false}
                    required={true}
                    error={false}
                    warning={false}
                  />

                  {obstetricsSpecificProviderGroup === "Individual" && (
                    <div>
                      <CommonSelectField
                        value={whoCoversObstetrics}
                        onChange={(e) => setWhoCoversObstetrics(e.target.value)}
                        firstOptionLabel="Select who covers in Specific Provider"
                        firstOptionValue=""
                        className={style.fullWidth}
                        valueList={obstetricsapplicantOptions.map(
                          (option) => option.value
                        )}
                        labelList={obstetricsapplicantOptions.map(
                          (option) => option.label
                        )}
                        disabledList={[]}
                        disabledSelect={false}
                        error={!whoCoversObstetrics}
                        label={"Select Who covers in Specific Provider"}
                        required={true}
                        warning={!whoCoversObstetrics}
                      />
                    </div>
                  )}

                  {obstetricsSpecificProviderGroup === "Group" && (
                    <TextArea
                      value={whoCoversObstetrics}
                      className={`${style.fullWidth} ${style.marginTop10}`}
                      onChange={(e) => setWhoCoversObstetrics(e.target.value)}
                      placeholder={"Enter Here"}
                      rows={4}
                    />
                  )}
                </div>
              )}
          </div>
          {/* <div className={style.threeColForButton}>
            <div
              className={`${style.continue} ${style.marginTop}`}
              onClick={() => navigate(-1)}
            >
              BACK
            </div>
            <div
              className={`${style.saveInProgress} ${style.marginTop}`}
              onClick={() => getIsSaveInProgressOpen(true)}
            >
              SAVE IN PROGRESS
            </div>
            <div
              className={`${style.continue} ${style.marginTop}`}
              onClick={() => getMissingFields()}
            >
              CONTINUE
            </div>
          </div> */}
        </div>
        <div>
          <ApplicationAssistanceCard
            user={"Neena Greenly"}
            designation={"{Designation}"}
            contactNumber={"{Contact Number}"}
            email={"{Email}"}
          />
          <div
            className={`${style.stickyContainer} ${isSaveInProgressOpen || showValidationDialog || showJourneyDialog
              ? style.hiddenStickyContainer
              : ""
              }`}
          >
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
              {/* <div className={`${style.continue} ${style.marginTop10}`} onClick={() => setShowJourneyDialog(true)}>CONTINUE</div> */}
              <div
                className={`${style.continue} ${style.marginTop10}`}
                onClick={() => getMissingFields()}
              >
                CONTINUE
              </div>
            </div>
          </div>
          <div className={style.marginTop}>
            <ApplicationReferenceDocuments />
          </div>
        </div>
      </div>
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
      {showJourneyDialog && (
        <ReappointmentJourneyDialog
          getIsOpen={getIsShowReappointmentJourneyDialog}
          title={`One Last Push! You Can Do It.`}
          img={JourneyStep9}
          formIndex={formIndex}
          basicForm={basicForm}
          continueClick={getMissingFields}
        />
      )}
    </div>
  );
};

export default HospitalCoverage;
