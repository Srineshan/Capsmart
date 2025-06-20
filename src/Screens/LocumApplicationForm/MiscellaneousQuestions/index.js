import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { GET, PUT, POST } from '../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import SaveInProgressDialog from '../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../Components/validationDialog';
import JourneyStep6 from './../../../images/journeyStep6.png';
import style from './index.module.scss';
import WelcomeCard from '../../../Components/WelcomeCard';
import ReappointmentProgressCard from '../../../Components/ReappointmentProgressCard';
import { format } from 'date-fns';
import ReappointmentJourneyDialog from '../../../Components/reappointmentJourneyDialog';
import CommonSelectField from "../../../Components/CommonFields/CommonSelectField";
import CommonTextField from "../../../Components/CommonFields/CommonTextField";
import { TextArea } from "@blueprintjs/core";
import CancelIcon from '@mui/icons-material/Cancel';
import DatalistInput from 'react-datalist-input';
import MenuIcon from "@mui/icons-material/Menu";
import Close from './../../../images/close.png';
import LocumProgressCard from '../../../Components/LocumProgressCard';
import { Tooltip } from '@mui/material';

const MiscellaneousQuestions = ({ basicForm, setBasicForm, getPreApplication }) => {
  const [formSchema, setFormSchema] = useState();
  const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
  const [metadata, setMetadata] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [warningFields, setWarningFields] = useState([]);
  const navigate = useNavigate()
  const [isEdited, setIsEdited] = useState(false);
  const [formIndex, setFormIndex] = useState();
  const { applicationId, section, step } = useParams();
  const [navigateURL, setNavigateURL] = useState();
  const [navigateBackURL, setNavigateBackURL] = useState();
  const [yesOrNoLMS, setYesOrNoLMS] = useState('');
  const [updatedDateLMS, setUpdatedDateLMS] = useState('');
  const [yesOrNoSuboxone, setYesOrNoSuboxone] = useState('');
  const [updatedDateSuboxone, setUpdatedDateSuboxone] = useState('');
  const [yesOrNoMRP, setYesOrNoMRP] = useState('');
  const [updatedDateMRP, setUpdatedDateMRP] = useState('');
  const [showJourneyDialog, setShowJourneyDialog] = useState(false);
  const [providerType, setProviderType] = useState("");
  const [providerOptions, setProviderOptions] = useState([]);
  const [obstetricsProviderType, setObstetricsProviderType] = useState("");
  const [applicantOptions, setApplicantOptions] = useState([]);
  const [selectApplicant, setSelectApplicant] = useState([]);
  const [selectApplicantObstetrics, setSelectApplicantObstetrics] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [providerLabels, setProviderLabels] = useState("");
  const [obstetricsapplicantOptions, setObstetricsApplicantOptions] = useState(
    []
  );
  const [covererName, setCovererName] = useState("");
  const [covererNameList, setCovererNameList] = useState([]);
  const [covererId, setCovererId] = useState("");
  const [obstetricsCovererName, setObstetricsCovererName] = useState("");
  const [obstetricsCovererNameList, setObstetricsCovererNameList] = useState([]);
  const [obstetricsCovererId, setObstetricsCovererId] = useState("");
  const [showAddButton, setShowAddButton] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [checkingCondition, setCheckingCondition] = useState([]);
  let allMissingFields = [];
  useEffect(() => {
    if (basicForm && !formSchema) {
      getFormSchema()
    }
    if (basicForm !== undefined && formIndex !== undefined) {
      setYesOrNoLMS(basicForm?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.response !== undefined ? basicForm?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.response : '');
      setUpdatedDateLMS(basicForm?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.date !== undefined ? basicForm?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.date : '');
      setYesOrNoSuboxone(basicForm?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.response !== undefined ? basicForm?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.response : '');
      setUpdatedDateSuboxone(basicForm?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.date !== undefined ? basicForm?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.date : '');
      setYesOrNoMRP(basicForm?.forms?.[formIndex]?.data?.wishToBeMRP?.response !== undefined ? basicForm?.forms?.[formIndex]?.data?.wishToBeMRP?.response : '');
      setUpdatedDateMRP(basicForm?.forms?.[formIndex]?.data?.wishToBeMRP?.date !== undefined ? basicForm?.forms?.[formIndex]?.data?.wishToBeMRP?.date : '');
      setProviderType(
        basicForm?.forms?.[formIndex]?.data?.coverageDetails?.providerType !== undefined
          ? basicForm?.forms?.[formIndex]?.data?.coverageDetails?.providerType
          : ""
      )
      setObstetricsProviderType(
        basicForm?.forms?.[formIndex]?.data?.coverageDetails?.obstetricsProviderType !== undefined
          ? basicForm?.forms?.[formIndex]?.data?.coverageDetails?.obstetricsProviderType
          : ""
      )
      setCovererName(
        basicForm?.forms?.[formIndex]?.data?.coverageDetails?.covererName !== undefined
          ? basicForm?.forms?.[formIndex]?.data?.coverageDetails?.covererName
          : ""
      );
      setObstetricsCovererName(
        basicForm?.forms?.[formIndex]?.data?.coverageDetails?.obstetricsCovererName !== undefined
          ? basicForm?.forms?.[formIndex]?.data?.coverageDetails?.obstetricsCovererName
          : ""
      );
      if (basicForm?.forms?.[formIndex]?.data?.coverageDetails?.obstetricsProviderType !== undefined) {
        setObstetricsCovererNameList(basicForm?.forms?.[formIndex]?.data?.coverageDetails?.obstetricsProviderType === 'Group' ? basicForm?.coverageDetails?.obstetricsGroupDetails : basicForm?.coverageDetails?.obstetricsProviderDetails?.map(data => data?.id))
      }
      if (basicForm?.forms?.[formIndex]?.data?.coverageDetails?.providerType !== undefined) {
        setCovererNameList(basicForm?.forms?.[formIndex]?.data?.coverageDetails?.providerType === 'Group' ? basicForm?.coverageDetails?.groupDetails : basicForm?.coverageDetails?.providerDetails?.map(data => data?.id))
      }
      setNavigateURL(`/locumApplicationForm/${applicationId}/${basicForm?.forms?.[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex + 1]?.schemaCategory)}`);
      setNavigateBackURL(`/locumApplicationForm/${applicationId}/${basicForm?.forms?.[formIndex - 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex - 1]?.schemaCategory)}`);
      console.log(basicForm?.forms?.[formIndex]?.data?.coverageDetails?.covererName, obstetricsCovererName, covererName, 'coverername', basicForm?.forms?.[formIndex]?.data?.coverageDetails)
    }
  }, [basicForm, formIndex])

  useEffect(() => {
    const fetchDepartmentStaffs = async () => {
      try {
        const currentApplicantId = basicForm?.applicant?.id;
        const departmentId = basicForm?.basicDetailReferences?.department?.id;
        const applicantTypeId = basicForm?.basicDetailReferences?.applicantType?.id;
        const response = await GET(
          `application-management-service/staff?status=ACTIVE&departmentId=${departmentId}&applicantTypeId=${applicantTypeId}&sortByField=STAFF_NAME`
        );
        console.log(response.data);

        const filteredStaffs = response.data.staffs.filter(
          (staff) => staff.applicant.id !== currentApplicantId
        );
        setSelectApplicant(filteredStaffs)
        console.log("appselect", selectApplicant)
        const options = filteredStaffs.map((staff) => ({
          id: `${staff.id}`,
          value: `${staff.applicant.name.firstName} ${staff.applicant.name.middleName} ${staff.applicant.name.lastName} ${staff?.basicDetailReferences?.specialty?.name !== undefined ? `- ${staff?.basicDetailReferences?.specialty?.name}` : ''}`,
          label: `${staff.applicant.name.firstName} ${staff.applicant.name.middleName} ${staff.applicant.name.lastName} ${staff?.basicDetailReferences?.specialty?.name !== undefined ? `- ${staff?.basicDetailReferences?.specialty?.name}` : ''}`,
        }));
        setApplicantOptions(options);
        console.log(options)
      } catch (error) {
        console.error("Error fetching department staffs:", error);
      }
    };

    fetchDepartmentStaffs();
  }, [basicForm]);

  useEffect(() => {
    if (
      basicForm?.basicDetails?.departmentSpecialty?.department ===
      "Women & Children"
      &&
      basicForm?.basicDetails?.departmentSpecialty?.specialty ===
      "Obstetrics & Gynecology"
    ) {
      const fetchObstetricsStaffs = async () => {
        try {
          const currentApplicantId = basicForm?.applicant?.id;
          const response = await GET(
            `application-management-service/staff?status=ACTIVE&departmentId=66dc4b370e34d3372e43f023&sortByField=STAFF_NAME`
          );

          const filteredStaffs = response.data.staffs.filter(
            (staff) => staff.applicant.id !== currentApplicantId
          );
          setSelectApplicantObstetrics(filteredStaffs);
          const staffOptions = filteredStaffs?.map((obstetricsstaff) => ({
            id: `${obstetricsstaff.id}`,
            value: `${obstetricsstaff.applicant.name.firstName} ${obstetricsstaff.applicant.name.middleName} ${obstetricsstaff.applicant.name.lastName}`,
            label: `${obstetricsstaff.applicant.name.firstName} ${obstetricsstaff.applicant.name.middleName} ${obstetricsstaff.applicant.name.lastName}`,
          }));
          setObstetricsApplicantOptions(staffOptions);
          console.log(obstetricsCovererNameList)
        } catch (error) {
          console.error("Error fetching obstetrics department staffs:", error);
        }
      };

      fetchObstetricsStaffs();
    }
  }, [basicForm]);

  useEffect(() => {
    setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
  }, [basicForm, step])

  useEffect(() => {
    getCoverageGroups();
    getDepartmentList();
  }, []);

  // useEffect(() => {
  //   setObstetricsCovererName("");
  // }, [obstetricsProviderType]);

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
    let tempLabels = labels;
    if (!tempLabels?.includes(data)) {
      console.log(tempLabels, data, 'Metadata')
      tempLabels.push(data);
    }
    setLabels(tempLabels);
  }

  const getIsShowReappointmentJourneyDialog = (value) => {
    setShowJourneyDialog(value);
  }

  const getIsSaveInProgressOpen = (value) => {
    setIsSaveInProgressOpen(value);
  }

  useEffect(() => {
    getCoverageGroups()
  }, [refresh])


  const getCoverageGroups = async () => {
    const { data: data } = await GET(
      `entity-service/callCoverageGroups`
    );
    setGroupOptions(data)
  }

  const getDepartmentList = async () => {
    const { data: department } = await GET(`entity-service/department`);
    setDepartmentList(department);
  };

  const getaddCoverageGroups = async () => {
    const payload = [{ name: covererName || 'N/A' }];
    const { data: data } = await POST(
      `entity-service/callCoverageGroups`, payload
    );
    getCoverageGroups(data)
    setRefresh(prev => !prev);
  }

  const getaddCoverageGroupsobstetrics = async () => {
    const payload = [{ name: obstetricsCovererName || 'N/A' }];
    const { data: data } = await POST(
      `entity-service/callCoverageGroups`, payload
    );
    getCoverageGroups(data)
    setRefresh(prev => !prev);
  }

  const getFormSchema = async () => {
    if (basicForm?.forms?.[formIndex]?.schemaId !== undefined) {
      const { data: form } = await GET(
        `application-management-service/formSchema/${basicForm?.forms?.[formIndex]?.schemaId}`
      );
      setFormSchema(form?.schema)
      setFormSchemaWholeObject(form)

      const providerField = form?.schema?.properties?.coverageDetails?.properties?.providerType;
      console.log(providerField);

      const providerLabel = providerField?.label;
      setProviderLabels(providerLabel);

      if (providerField?.enum) {
        const enumValues = providerField?.enum
        console.log(enumValues);

        setProviderOptions(enumValues);
      }
    }
  }

  const getSkipClicked = (value) => {
    if (value) {
      // handleSubmit()
      // handleSubmitApplicationReq("skipped")
      // navigate(navigateURL);
      getMissingFields("skipped")
    }
  }

  const handleRemoveChip = (index) => {
    const updatedList = covererNameList.filter((_, i) => i !== index);
    setCovererNameList(updatedList);
  };

  const handleRemoveChipObstetrics = (index) => {
    const updatedList = obstetricsCovererNameList.filter((_, i) => i !== index);
    setObstetricsCovererNameList(updatedList);
  };

  const getItems = (data) => {
    let temp = [];
    data?.map((data) => {
      temp.push({ id: data?.id, value: data?.name });
    });
    return temp;
  };

  const getItemsSingle = (data) => {
    let temp = [];
    data?.map((data) => {
      temp.push({ id: data?.id, label: data?.label, value: data?.value });
    });
    console.log("getItems", temp, data)
    return temp;

  };

  const getDeptItems = (data) => {
    let temp = [];
    data?.map((data) => {
      // if (!(basicForm?.basicDetails?.departmentSpecialty?.department === data?.departmentName?.name && basicForm?.basicDetails?.departmentSpecialty?.specialty === "")) {
      temp.push({ departmentId: data?.id, departmentSpecialtyName: data?.departmentName?.name, departmentName: data?.departmentName?.name, serviceAreaId: null, serviceAreaName: null });
      // }
      data?.serviceAreas?.map((specialityData => {
        // if (!(basicForm?.basicDetails?.departmentSpecialty?.department === data?.departmentName?.name && basicForm?.basicDetails?.departmentSpecialty?.specialty === specialityData?.name)) {
        temp.push({ departmentId: data?.id, departmentSpecialtyName: `${data?.departmentName?.name} - ${specialityData?.name}`, serviceAreaId: specialityData?.id, departmentName: data?.departmentName?.name, serviceAreaName: specialityData?.name });
        // }
      }))
    });
    return temp;
  };

  console.log(covererName, providerType, basicForm?.forms?.[formIndex]?.data?.coverageDetails?.covererName)

  const getMissingFields = (data) => {
    let missingKeys = [];
    let hasMandatoryMissingFields = [];
    // if (yesOrNoLMS === '') {
    //   missingKeys.push({ label: { label: 'Have you completed all of the CMH assigned LMS Modules for your reappointment?', mandatory: true } });

    // }
    if (yesOrNoSuboxone === '') {
      missingKeys.push({ label: { label: 'Do you prescribe Suboxone?', mandatory: true } });
    }
    // if (yesOrNoMRP === '' && (basicForm?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && basicForm?.basicDetails?.departmentSpecialty?.specialty === 'Pediatrics')) {
    //   missingKeys.push({ label: { label: 'Do you wish to be MRP for your patients in the Nursery?', mandatory: true } });
    // }
    // if ((covererName === "" && covererNameList?.length === 0) && providerType !== "Not Applicable" && providerType !== "Department / Specialty Group" &&
    //   basicForm?.basicDetails?.departmentSpecialty?.department !==
    //   "Women & Children" &&
    //   basicForm?.basicDetails?.departmentSpecialty?.specialty !==
    //   "Obstetrics & Gynecology") {
    //   missingKeys.push({ label: { label: "Who covers your hospital patients when you are not available?", mandatory: true } });
    // }
    // if (
    //   (obstetricsCovererName === "" && obstetricsCovererNameList?.length === 0) && obstetricsProviderType !== "Not Applicable" && obstetricsProviderType !== "Department / Specialty Group"
    //   &&
    //   basicForm?.basicDetails?.departmentSpecialty?.department ===
    //   "Women & Children" &&
    //   basicForm?.basicDetails?.departmentSpecialty?.specialty ===
    //   "Obstetrics & Gynecology"
    // ) {
    //   missingKeys.push({
    //     label: { label: "If You Are Practicing Obstetrics, Who Covers Your Patients When You Are Not Available?", mandatory: true }
    //   });
    // }
    setWarningFields(missingKeys)
    allMissingFields = missingKeys;
    hasMandatoryMissingFields = missingKeys?.find(field => field?.label?.mandatory === true);

    if (data === "skipped") {
      handleSubmit()
        .then(() => {
          return getPreApplication();
        })
        .then(() => {
          return handleSubmitApplicationReq();
        })
        .catch((error) => {
          console.error("Error during API calls:", error);
        });
    }


    if (data !== "skipped") {
      if (hasMandatoryMissingFields) {
        setShowValidationDialog(true)
      } else {
        handleSubmit()
          .then(() => {
            return getPreApplication();
          })
          .then(() => {
            return handleSubmitApplicationReq();
          })
          .catch((error) => {
            console.error("Error during API calls:", error);
          });
      }
    }
    console.log('Metadata', missingKeys)
  }

  const handleSubmit = async () => {
    // let temp = {
    //   providerType: providerType,
    //   providerDetails: groupOptions.filter(obj => covererNameList.includes(obj.id)),
    //   obstetricsProviderType: obstetricsProviderType,
    //   obstetricsProviderDetails: groupOptions.filter(obj => obstetricsCovererNameList.includes(obj.id))
    // }
    let temp = {
      providerType: providerType,
      providerDetails: providerType === 'Group' ? [] : selectApplicant
        .filter(obj => covererNameList?.includes(obj.id))
        .map(obj => ({
          id: obj?.id,
          name: [obj?.applicant?.name?.firstName, obj?.applicant?.name?.middleName, obj?.applicant?.name?.lastName]
            .filter(Boolean) // Remove any empty or falsy values
            .join(' ') || 'N/A', // If all fields are empty, send 'N/A'
        })),
      groupDetails: providerType === 'Group' ? covererNameList : [],
      obstetricsProviderType: obstetricsProviderType,
      obstetricsProviderDetails: obstetricsProviderType === 'Group' ? [] : selectApplicantObstetrics
        .filter(obj => obstetricsCovererNameList?.includes(obj?.id))
        .map(obj => ({
          id: obj?.id,
          name: [obj?.applicant?.name?.firstName, obj?.applicant?.name?.middleName, obj?.applicant?.name?.lastName]
            .filter(Boolean) // Remove any empty or falsy values
            .join(' ') || 'N/A', // If all fields are empty, send 'N/A'
        })),
      obstetricsGroupDetails: obstetricsProviderType === 'Group' ? obstetricsCovererNameList : [],
    };
    await PUT(`application-management-service/application/${applicationId}/coverageDetails`, temp)
      .then(response => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const handleSubmitApplicationReq = async (data) => {
    // if (isEdited) {
    let temp = {
      schemaId: basicForm?.forms?.[formIndex]?.schemaId,
      data: {
        isModulesForReAppointmentCompleted: { response: yesOrNoLMS, date: updatedDateLMS },
        doYouPrescribeSuboxone: { response: yesOrNoSuboxone, date: updatedDateSuboxone },
        wishToBeMRP: { response: yesOrNoMRP, date: updatedDateMRP },
        coverageDetails: { covererName: covererName, obstetricsCovererName: obstetricsCovererName, providerType: providerType, obstetricsProviderType: obstetricsProviderType },
      },
      unFilledFields: allMissingFields?.map(field => JSON.stringify(field)),
      acknowledged: data === "skipped" ? false : true
    }
    await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
      .then(response => {
        console.log(response)
        setBasicForm(response?.data)
        SuccessToaster("Application Updated Successfully");
        getPreApplication();
        if (sessionStorage.getItem('fromSummary') === "true") {
          navigate(-1);
        }
        else {
          navigate(navigateURL)

        }
      })
      .catch((error) => {
        console.log(error)
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
  }

  const getValueByPath = (obj, path) => {
    const keys = path.split(/[\.\[\]]+/).filter(Boolean);
    console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
    return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
  };

  const handleBackClick = async () => {
    navigate(navigateBackURL)
  }

  const getIsEdited = (value) => {
    setIsEdited(value)
  }

  console.log(covererId, obstetricsCovererId, covererNameList)
  return (
    <div>
      {showInfo && <div className={style.bgdrop} onClick={() => setShowInfo(false)}></div>}
      <div className={`${style.applicationScreenGrid} ${showInfo ? "blurredBackground" : ""}`}>
        <div>
          <LocumProgressCard step={'STEP 11'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={22} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} basicForm={basicForm} />

          <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
            <div className={style.cardTitle}>
              {formSchema?.properties?.doYouPrescribeSuboxone?.properties?.response?.label}
            </div>
            {yesOrNoSuboxone === '' ? (
              <div
                className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
              >
                <Tooltip title={"Click to mark as Yes"} arrow>
                <div
                  className={`${style.reappointmentButtonOutlined}`}
                  onClick={() => { setYesOrNoSuboxone('Yes'); setUpdatedDateSuboxone(format(new Date(), "yyyy-MM-dd'T'00:00")) }}
                >
                  YES
                </div>
                </Tooltip>
                <Tooltip title={"Click to mark as No"} arrow>
                <div
                  className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                  onClick={() => { setYesOrNoSuboxone('No'); setUpdatedDateSuboxone(format(new Date(), "yyyy-MM-dd'T'00:00")) }}
                >
                  NO
                </div>
                </Tooltip>
              </div>
            ) : (
              <>
                <div className={`${style.markedAsText} ${style.marginTop10}`}><strong>Marked as <span className={yesOrNoSuboxone === 'Yes' ? style.yesText : style.noText}>{yesOrNoSuboxone}</span></strong> on {format(new Date(updatedDateSuboxone || new Date()), "MMM dd, yyyy")}</div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                >
                  <div
                    className={`${style.reappointmentButtonEdit}`}
                    onClick={() => setYesOrNoSuboxone('')}
                  >
                    VIEW TO MODIFY
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={style.threeColForButton}>
            <Tooltip title={"Click to Skip This Step and Continue Later"} arrow>
            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getSkipClicked(true)}>SKIP FOR NOW</div>
            </Tooltip>
            <Tooltip title={"Click to Save your Progress and Continue later"} arrow>
            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
            </Tooltip>
            <Tooltip title={"Click to Go Back to the Previous Step"} arrow>
            <div className={`${style.continue} ${style.marginTop}`} onClick={() => handleBackClick()}>BACK</div>
            </Tooltip>
            <Tooltip title={"Click to Proceed to the Next Step"} arrow>
            <div className={`${style.continue} ${style.marginTop} ${yesOrNoSuboxone !== '' ? '' : style.disabledButton}`} onClick={yesOrNoSuboxone !== '' ? () => getMissingFields() : () => { }}>CONTINUE</div>
            </Tooltip>
          </div>
        </div>
        <div>
          {!showInfo && (
            <div>
              <div className={`${style.toggleButton} ${isSaveInProgressOpen || showValidationDialog || showJourneyDialog ? style.hidden : ""}`} onClick={() => setShowInfo(!showInfo)}>
                <MenuIcon className={style.toggleIcon} />
              </div>
              <div className={`${style.headerData} ${isSaveInProgressOpen || showValidationDialog || showJourneyDialog ? style.hidden : ""}`}>
                <span style={{ marginLeft: '20px' }}>Confirm Your Miscellaneous Questions</span>
              </div>
            </div>
          )}
          <div>
            <div className={`${style.infoContainer} ${showInfo ? style.show : ""}`}>
              <img src={Close} alt="Close" className={style.closeIcon} onClick={() => setShowInfo(false)} />
              <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
              <div className={style.marginTop}>
                <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
              </div>
              <div className={style.marginTop}>
                <ApplicationReferenceDocuments />
              </div>
            </div>
          </div>
          <div className={`${style.stickyContainer} ${isSaveInProgressOpen || showValidationDialog || showJourneyDialog ? style.hiddenStickyContainer : ""}`}>
            <Tooltip title={"Click to Skip This Step and Continue Later"} arrow>
            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getSkipClicked(true)}>SKIP FOR NOW</div>
            </Tooltip>
            <Tooltip title={"Click to Save your Progress and Continue later"} arrow>
            <div className={`${style.saveInProgress} ${style.marginTop10}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
            </Tooltip>
            <div className={style.twoColForButton}>
              <Tooltip title={"Click to Go Back to the Previous Step"} arrow>
              <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleBackClick()}>BACK</div>
              </Tooltip>
              {/* <div className={`${style.continue} ${style.marginTop10}`} onClick={() => setShowJourneyDialog(true)}>CONTINUE</div> */}
              <Tooltip title={"Click to Proceed to the Next Step"} arrow>
              <div className={`${style.continue} ${style.marginTop10} ${yesOrNoSuboxone !== '' ? '' : style.disabledButton}`} onClick={yesOrNoSuboxone !== '' ? () => getMissingFields() : () => { }}>CONTINUE</div>
              </Tooltip>

            </div>
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
      {showJourneyDialog && (
        <ReappointmentJourneyDialog getIsOpen={getIsShowReappointmentJourneyDialog} title={`Almost There! Don't Give Up Now`} img={JourneyStep6} formIndex={formIndex} basicForm={basicForm} continueClick={getMissingFields} />
      )}
    </div>
  )
}

export default MiscellaneousQuestions;