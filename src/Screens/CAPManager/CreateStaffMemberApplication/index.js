import React, { useEffect, useState, useRef } from "react";
import ApplicationHeader from "../../../Components/ApplicationHeader";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { GET, POST, PUT } from "../../dataSaver";
import ApplicationFieldCard from "../../../Components/ApplicationFieldCard";
import { ErrorToaster, ErrorToaster2, SuccessToaster } from "../../../utils/toaster";
import Switch from "@mui/material/Switch";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import style from "./index.module.scss";
import SendEmailFromStaffManagerConfirmationDialog from "../../../Components/sendEmailFromStaffManagerConfirmation";
import jwt from "jwt-decode";
import Cookie from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { fileLoadingURL, getValueByPath } from "../../../utils/formatting";
import ValidationDialog from "../../../Components/validationDialog";
import { Tooltip } from "@mui/material";

const CreateStaffMemberApplication = () => {
  let cookie = new Cookie();
  let userDetails = cookie.get("user");
  const navigate = useNavigate();
  const user = jwt(userDetails);
  const [form, setForm] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
  const [isNextpage, setIsNextPage] = useState(false);
  const [isShowMailSendDialog, setIsShowMailSendDialog] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [basicFormForDocuments, setBasicFormForDocuments] = useState();
  const [requiredDocumentList, setRequiredDocumentList] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [labels, setLabels] = useState([]);
  const [managerName, setManagerName] = useState('');
  const [warningFields, setWarningFields] = useState([]);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [basicForm, setBasicForm] = useState({
    applicant: {
      name: {
        firstName: "",
        lastName: "",
        middleName: "",
      },
      email: {
        officialEmail: "",
      },
      mobileNumber: "",
      category: "GUEST",
    },
    providerType: {
      id: "",
      serviceProviderType: "",
    },
    basicDetails: {
      applicant: {
        name: {
          firstName: "",
          lastName: "",
          middleName: "",
        },
        email: {
          officialEmail: "",
        },
        mobileNumber: "",
        applicantType: "",
        startDate: "",
        category: "GUEST",
        curriculumVitae: {
          filePath: "",
          fileName: "",
          fileURL: "",
        },
        letterOfInterest: {
          filePath: "",
          fileName: "",
          fileURL: "",
        },
      },
      credentialingPrivilegeCategory: {
        credentialingCategory: "",
        from: null,
        to: null,
      },
      departmentSpecialty: {
        department: "",
        specialty: "",
      },
      // regionalCallResponsibilities: {
      //   regionalCallResponsibilities: "",
      // },
      billingNumber: {
        billingNumber: "",
        specialityBillingCode: "",
      },
    },
  });
  useEffect(() => {
    setUserDetails();
  }, [user?.id]);

  const switchTheme = createTheme({
    palette: {
      primary: {
        main: "#25BF6A",
      },
    },
  });

  useEffect(() => {
    getBasicForm();
  }, []);

  useEffect(() => {
    getPreApplication();
  }, [applicationId]);

  useEffect(() => {
    setRequiredDocumentList(basicFormForDocuments?.documentsRequired);
  }, [basicFormForDocuments]);

  useEffect(() => {
    if (basicForm?.basicDetailReferences?.department?.id !== "")
      getDeptHead()
  }, [basicForm?.basicDetailReferences?.department?.id])

  const getApplicantProfile = async () => {
    const { data: profile } = await GET(
      `application-management-service/application/${applicationId}/profile`
    );
    let applicantData = profile;
    applicantData.managerName = managerName;
    applicantData.department = basicForm?.basicDetailReferences?.department;
    applicantData.jobTitle = basicForm?.basicDetails?.applicant?.applicantType;
    await PUT(`application-management-service/application/${applicationId}/profile`, applicantData)
      .then(response => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const getDeptHead = async () => {
    const { data: profile } = await GET(
      `user-management-service/user/role?role=Department Head&departmentSpecialties=${basicForm?.basicDetailReferences?.department?.id}`
    );
    setManagerName(`${profile?.[0]?.name?.firstName} ${profile?.[0]?.name?.lastName}`)
  }

  const setUserDetails = async () => {
    const { data: userDetails } = await GET(
      `user-management-service/user/${user?.id}`
    );
    sessionStorage.setItem("user", JSON.stringify(userDetails));
  };

  const getShowMailSendDialog = (value) => {
    setIsShowMailSendDialog(value);
  };

  const handleSendMail = async () => {
    await POST(
      `application-management-service/application/${basicForm?.id}/sendEmail`
    )
      .then((response) => {
        getApplicantProfile();
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSwitchChange = (value, id) => {
    // let temp = requiredDocumentList;
    // temp[index].required = value;
    // setRequiredDocumentList(temp)
    // console.log(temp)

    setRequiredDocumentList((prevStates) =>
      prevStates.map((data) =>
        data.document.id === id
          ? { ...data, required: value } // Update the checked status
          : data
      )
    );
  };
  console.log(requiredDocumentList);

  const getSkipClicked = (value) => {
    // if (!basicForm?.applicant?.name?.firstName && basicForm?.applicant?.name?.firstName === '') {
    //   ErrorToaster2(`First Name is mandatory to create the application.`)
    //   return;
    // }
    // if (!basicForm?.applicant?.name?.lastName && basicForm?.applicant?.name?.lastName === '') {
    //   ErrorToaster2('Last Name is mandatory to create the application')
    //   return;
    // }
    // if (!basicForm?.applicant?.email?.officialEmail && basicForm?.applicant?.email?.officialEmail === '') {
    //   ErrorToaster2('Email is mandatory to create the application')
    //   return;
    // }
    // if (!basicForm?.applicant?.applicantType && basicForm?.applicant?.applicantType === '') {
    //   ErrorToaster2(`Applicant Type is mandatory to create the application.`)
    //   return;
    // }
    // if (!basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory && basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory === '') {
    //   ErrorToaster2('Credentialing & Privileges Category is mandatory to create the application')
    //   return;
    // }
    // if (!basicForm?.basicDetails?.departmentSpecialty?.department && basicForm?.basicDetails?.departmentSpecialty?.department === '') {
    //   ErrorToaster2('Department is mandatory to create the application')
    //   return;
    // }
    if (value) {
      handleSubmitApplicationReq();
    }
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

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const refsMap = useRef({});
  const getMissingFields = () => {
    setIsLoading(true);

    let missingKeys = [];
    let keyValuePair = [];

    metadata?.map((data, index) => {
      if (!refsMap.current[data]) {
        refsMap.current[data] = React.createRef(); // Create and store refs dynamically
      }
      if (labels[index]?.mandatory) {
        keyValuePair.push({
          key: data,
          value: getValueByPath(basicForm, data),
          label: labels[index],
          ref: refsMap.current[data], // Associate ref with field
        });
      }
    });
    keyValuePair?.map((data) => {
      if (
        data?.value === "" ||
        data?.value === null ||
        data?.value === undefined ||
        data?.value === 0 ||
        (data.key === "basicDetails.applicant.email.officialEmail" &&
          !validateEmail(data.value))
      ) {
        if (
          data.key === "basicDetails.applicant.email.officialEmail" &&
          !validateEmail(data.value)
        ) {
          setBasicForm((prevForm) => ({
            ...prevForm,
            basicDetails: {
              ...prevForm.basicDetails,
              applicant: {
                ...prevForm.basicDetails.applicant,
                email: {
                  officialEmail: "",
                },
              },
            },
          }));
        }
        missingKeys.push({
          ...data,
          error:
            data.key === "basicDetails.applicant.email.officialEmail" &&
              !validateEmail(data.value)
              ? "Invalid email format"
              : "",
        });
      }
      // Handle cellPhone -> mobileNumber transformation
      if (data.key === "basicDetails.applicant.cellPhone" && data.value) {
        setBasicForm((prevForm) => ({
          ...prevForm,
          basicDetails: {
            ...prevForm.basicDetails,
            applicant: {
              ...prevForm.basicDetails.applicant,
              mobileNumber:
                data.value || prevForm.basicDetails.applicant.mobileNumber,
            },
          },
        }));
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
      // Focus the first missing field
      const firstMissingField = missingKeys[0];
      if (firstMissingField?.ref?.current) {
        firstMissingField.ref.current.focus();
      }
      setShowValidationDialog(true);
    } else {
      handleSubmitApplicationReq();
    }
    setWarningFields(missingKeys);
    console.log(keyValuePair, "Metadata", missingKeys);
    setIsLoading(false);
  };

  const getIsValidationDialogOpen = (value) => {
    setShowValidationDialog(value);
  };

  const getPreApplication = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/${applicationId}`
    );
    setBasicFormForDocuments(basicForm);
  };

  const getBasicForm = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/basicForm`
    );
    if (basicForm) {
      // if (!isNextpage) {
      const { data: form } = await GET(
        `application-management-service/formSchema/${basicForm?.generalSchemas?.[1]?.id}`
      );
      let temp = form?.schema;
      if (temp.properties.applicant.properties !== null) {
        delete temp.properties.applicant.properties["letterOfInterest"];
        delete temp.properties.applicant.properties["curriculumVitae"];
      }
      setForm(form?.schema);
      setFormSchemaWholeObject(form);
      // } else {
      //     const { data: form } = await GET(
      //         `application-management-service/formSchema/${basicForm?.generalSchemas?.[2]?.id}`
      //     );
      //     setForm(form)
      // }
    }
  };

  const handleSubmitApplicationReq = async () => {
    setIsLoading(true);
    let data = basicForm;
    data.providerType = {
      id: "6398687f95164c0bb67ff4b2",
      serviceProviderType: "Physician / Doctor",
    };

    data.basicDetails.providerType = {
      id: "6398687f95164c0bb67ff4b2",
      serviceProviderType: "Physician / Doctor",
    };

    console.log(data);
    if (applicationId === "") {
      await POST("application-management-service/application", data)
        .then((response) => {
          console.log(response);
          setBasicForm(response?.data);
          setApplicationId(response?.data?.id);
          SuccessToaster("Staff Member Application Created Successfully");
          setIsNextPage(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          ErrorToaster("Unexpected Error Creating Staff Member Application");
          setIsLoading(false);
        });
    } else {
      await PUT(
        `application-management-service/application/${applicationId}`,
        data
      )
        .then((response) => {
          console.log(response);
          setBasicForm(response?.data);
          SuccessToaster("Staff Member Application Updated Successfully");
          if (!isNextpage) {
            setIsNextPage(true);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          ErrorToaster("Unexpected Error Updating Staff Member Application");
          setIsLoading(false);
        });
    }
  };

  const handleRequiredFileSubmit = async () => {
    let data = basicFormForDocuments;
    data.documentsRequired = requiredDocumentList;
    await PUT(
      `application-management-service/application/${applicationId}`,
      data
    )
      .then((response) => {
        handleSendMail();
        getPreApplication();
        setIsShowMailSendDialog(true);
        SuccessToaster("Staff Member Application Updated Successfully");
      })
      .catch((error) => {
        console.log(error);
        ErrorToaster("Unexpected Error Updating Staff Member Application");
      });
  };

  const handleCloseClick = () => {
    navigate("/applications");
  };

  return (
    <>
      {isLoading && (
        <div
          className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
        >
          <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
        </div>
      )}
      <div className={style.screenBackground}>
        <ApplicationHeader
          title={
            "Create A New Staff Member Credentialing And Privileging Application"
          }
          close={true}
          closeClick={handleCloseClick}
          isNotLogout={true}
        />
        <div className={style.screenPadding}>
          <div className={style.displayInRowRev}>
            {/* <div className={style.breadcrumbStyle}>{`STAFF APPOINTMENT APPLICATION >> NEW APPLICATION`}</div> */}
            <div className={style.cardTitle}>{`* Indicates a required field.`}</div>
          </div>
          {!isNextpage ? (
            <>
              {form !== undefined && "applicant" in form?.properties && (
                <ApplicationFieldCard
                  object={form?.properties?.applicant}
                  gridStyle={style.applicantGrid}
                  baseKey={"applicant"}
                  basicForm={basicForm}
                  setBasicForm={setBasicForm}
                  isBasicPath={true}
                  getAllPath={getAllPath}
                  getAllLabels={getAllLabels}
                  warningFields={warningFields}
                  formSchema={formSchemaWholeObject}
                  refsMap={refsMap.current}
                />
              )}
              {form !== undefined &&
                "credentialingPrivilegeCategory" in form?.properties && (
                  <ApplicationFieldCard
                    object={form?.properties?.credentialingPrivilegeCategory}
                    gridStyle={style.credentialingGrid}
                    baseKey={"credentialingPrivilegeCategory"}
                    basicForm={basicForm}
                    setBasicForm={setBasicForm}
                    isBasicPath={true}
                    getAllPath={getAllPath}
                    getAllLabels={getAllLabels}
                    warningFields={warningFields}
                    formSchema={formSchemaWholeObject}
                    refsMap={refsMap.current}
                  />
                )}
              {form !== undefined &&
                "departmentSpecialty" in form?.properties && (
                  <ApplicationFieldCard
                    object={form?.properties?.departmentSpecialty}
                    gridStyle={style.appointmentGrid}
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
              {/* {form !== undefined && 'regionalCallResponsibilities' in form?.properties && (
                <ApplicationFieldCard object={form?.properties?.regionalCallResponsibilities} gridStyle={style.regionalCallGrid} baseKey={'regionalCallResponsibilities'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
              )} */}
              <div className={style.spaceBetween}>
                <div></div>
                <div className={style.displayInRow}>
                  <div className={style.displayInRow}>
                    <Tooltip title="Discard changes and reload the page" arrow>
                      <div
                        className={`${style.saveInProgress} ${style.marginTop}`}
                        onClick={() => window.location.reload()}
                      >
                        DISCARD
                      </div>
                    </Tooltip>
                    <Tooltip title={isLoading ? "" : "Continue to the next step"} arrow>
                      <div
                        className={`${style.continue} ${style.marginTop} ${style.marginLeft}`}
                        onClick={() => getMissingFields()}
                        disabled={isLoading}
                      >
                        CONTINUE
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={style.applicationCardStyle}>
                <div className={style.marginTop}>
                  <div className={style.cardTitle}>
                    Required and Recommended documents & forms for this
                    Application
                  </div>
                </div>
                <div
                  className={`${style.fileGrid} ${style.marginTop} ${style.tableHeader}`}
                >
                  <div
                    className={`${style.tableHeaderFont} ${style.centerAlign}`}
                  >
                    Required?
                  </div>
                  <div className={style.tableHeaderFont}>Document / Form</div>
                </div>
                {requiredDocumentList?.map((data, index) => (
                  <div
                    className={`${style.tableData} ${index % 2 === 0 ? style.alternativeBackgroundColor : ""
                      }`}
                    key={`${index}radio`}
                  >
                    <div className={style.fileGrid}>
                      <div className={style.centerAlign}>
                        <ThemeProvider theme={switchTheme}>
                          <FormControlLabel
                            control={
                              <Switch
                                className={`${style.textAlignLeft}`}
                                onChange={(e) =>
                                  handleSwitchChange(
                                    e.target.checked,
                                    data?.document?.id
                                  )
                                }
                                checked={data?.required}
                                size="small"
                                key={`${index}radio`}
                              />
                            }
                            color="primary"
                            className={`${style.textAlignLeft}`}
                            label={data?.required ? "YES" : "NO"}
                            key={`${index}radio`}
                          />
                        </ThemeProvider>
                      </div>
                      <div className={style.fileNameText}>
                        {data?.document?.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={style.spaceBetween}>
                <div
                  className={`${style.saveInProgress} ${style.marginTop}`}
                  onClick={() => setIsNextPage(false)}
                >
                  BACK
                </div>
                <div className={style.displayInRow}>
                  <div
                    className={`${style.continue} ${style.marginTop} ${style.marginLeft}`}
                    onClick={() => handleRequiredFileSubmit()}
                  >
                    SEND APPLICATION LINK
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {isShowMailSendDialog && (
          <SendEmailFromStaffManagerConfirmationDialog
            getIsOpen={getShowMailSendDialog}
            basicForm={basicForm}
          />
        )}
        {showValidationDialog && (
          <ValidationDialog
            getIsOpen={getIsValidationDialogOpen}
            labelList={warningFields}
            getSkipClicked={getSkipClicked}
            hideSkip={true}
          />
        )}
      </div>
    </>
  );
};

export default CreateStaffMemberApplication;
