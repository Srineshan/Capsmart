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
      setObstetricsCovererNameList(basicForm?.coverageDetails?.obstetricsProviderDetails?.map(data => data?.id))
      setCovererNameList(basicForm?.coverageDetails?.providerDetails?.map(data => data?.id))
      setNavigateURL(`/reappointmentApplicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms[formIndex + 1]?.schemaCategory)}`);
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
          value: `${staff.applicant.name.firstName} ${staff.applicant.name.middleName} ${staff.applicant.name.lastName}`,
          label: `${staff.applicant.name.firstName} ${staff.applicant.name.middleName} ${staff.applicant.name.lastName}`,
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

      const providerLabel = providerField.label;
      setProviderLabels(providerLabel);

      if (providerField?.enum) {
        const enumValues = providerField.enum
        console.log(enumValues);

        setProviderOptions(enumValues);
      }
    }
  }

  const getSkipClicked = (value) => {
    if (value) {
      handleSubmit()
      handleSubmitApplicationReq("skipped")
      navigate(navigateURL);
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
    console.log("getItems", temp)
    return temp;

  };

  console.log(covererName, providerType, basicForm?.forms?.[formIndex]?.data?.coverageDetails?.covererName)

  const getMissingFields = () => {
    let missingKeys = [];
    if (yesOrNoLMS === '') {
      missingKeys.push({ label: 'Have you completed all of the CMH assigned LMS Modules for your reappointment?' })
    }
    if (yesOrNoSuboxone === '') {
      missingKeys.push({ label: 'Do you prescribe Suboxone?' })
    }
    if (yesOrNoMRP === '' && (basicForm?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && basicForm?.basicDetails?.departmentSpecialty?.specialty === 'Pediatrics')) {
      missingKeys.push({ label: 'Do you wish to be MRP for your patients in the Nursery?' })
    }
    if ((covererName === "" && covererNameList?.length === 0) && providerType !== "Not Applicable") {
      missingKeys.push({
        label: "Who covers your hospital patients when you are not available?",
      });
    }
    if (
      (obstetricsCovererName === "" && obstetricsCovererNameList?.length === 0) && obstetricsProviderType !== "Not Applicable"
      &&
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

    setWarningFields(missingKeys)
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
      providerDetails: providerType === 'Group'
        ? groupOptions.filter(obj => covererNameList.includes(obj.id))
        : selectApplicant
          .filter(obj => covererNameList.includes(obj.id))
          .map(obj => ({
            id: obj.id,
            name: [obj.applicant?.name?.firstName, obj.applicant?.name?.middleName, obj.applicant?.name?.lastName]
              .filter(Boolean) // Remove any empty or falsy values
              .join(' ') || 'N/A', // If all fields are empty, send 'N/A'
          })),
      obstetricsProviderType: obstetricsProviderType,
      obstetricsProviderDetails: obstetricsProviderType === 'Group'
        ? groupOptions.filter(obj => obstetricsCovererNameList.includes(obj.id))
        : selectApplicantObstetrics
          .filter(obj => obstetricsCovererNameList.includes(obj.id))
          .map(obj => ({
            id: obj.id,
            name: [obj.applicant?.name?.firstName, obj.applicant?.name?.middleName, obj.applicant?.name?.lastName]
              .filter(Boolean) // Remove any empty or falsy values
              .join(' ') || 'N/A', // If all fields are empty, send 'N/A'
          })),
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
      unFilledFields: warningFields?.map(data => data?.label),
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

  const getIsEdited = (value) => {
    setIsEdited(value)
  }

  console.log(covererId, obstetricsCovererId, covererNameList)
  return (
    <div>
      {showInfo && <div className={style.bgdrop} onClick={() => setShowInfo(false)}></div>}
      <div className={`${style.applicationScreenGrid} ${showInfo ? "blurredBackground" : ""}`}>
        <div>
          <ReappointmentProgressCard step={'STEP 11'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={22} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} basicForm={basicForm} />
          <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
            <div className={style.cardTitle}>
              {formSchema?.properties?.isModulesForReAppointmentCompleted?.properties?.response?.label}
            </div>
            {yesOrNoLMS === '' ? (
              <div
                className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
              >
                <div
                  className={`${style.reappointmentButtonOutlined}`}
                  onClick={() => { setYesOrNoLMS('Yes'); setUpdatedDateLMS(format(new Date(), 'yyyy-MM-dd')) }}
                >
                  YES
                </div>
                <div
                  className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                  onClick={() => { setYesOrNoLMS('No'); setUpdatedDateLMS(format(new Date(), 'yyyy-MM-dd')) }}
                >
                  NO
                </div>
              </div>
            ) : (
              <>
                <div className={`${style.markedAsText} ${style.marginTop10}`}><strong>Marked as <span className={yesOrNoLMS === 'Yes' ? style.yesText : style.noText}>{yesOrNoLMS}</span></strong> on {format(new Date(updatedDateLMS), "MMM dd, yyyy")}</div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                >
                  <div
                    className={`${style.reappointmentButtonEdit}`}
                    onClick={() => setYesOrNoLMS('')}
                  >
                    VIEW TO MODIFY
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
            <div className={style.cardTitle}>
              {formSchema?.properties?.doYouPrescribeSuboxone?.properties?.response?.label}
            </div>
            {yesOrNoSuboxone === '' ? (
              <div
                className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
              >
                <div
                  className={`${style.reappointmentButtonOutlined}`}
                  onClick={() => { setYesOrNoSuboxone('Yes'); setUpdatedDateSuboxone(format(new Date(), 'yyyy-MM-dd')) }}
                >
                  YES
                </div>
                <div
                  className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                  onClick={() => { setYesOrNoSuboxone('No'); setUpdatedDateSuboxone(format(new Date(), 'yyyy-MM-dd')) }}
                >
                  NO
                </div>
              </div>
            ) : (
              <>
                <div className={`${style.markedAsText} ${style.marginTop10}`}><strong>Marked as <span className={yesOrNoSuboxone === 'Yes' ? style.yesText : style.noText}>{yesOrNoSuboxone}</span></strong> on {format(new Date(updatedDateSuboxone), "MMM dd, yyyy")}</div>
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
          {(basicForm?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && basicForm?.basicDetails?.departmentSpecialty?.specialty === 'Pediatrics') && (
            <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
              <div className={style.cardTitle}>
                {formSchema?.properties?.wishToBeMRP?.properties?.response?.label}
              </div>
              {yesOrNoMRP === '' ? (
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                >
                  <div
                    className={`${style.reappointmentButtonOutlined}`}
                    onClick={() => { setYesOrNoMRP('Yes'); setUpdatedDateMRP(format(new Date(), 'yyyy-MM-dd')) }}
                  >
                    YES
                  </div>
                  <div
                    className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                    onClick={() => { setYesOrNoMRP('No'); setUpdatedDateMRP(format(new Date(), 'yyyy-MM-dd')) }}
                  >
                    NO
                  </div>
                </div>
              ) : (
                <>
                  <div className={`${style.markedAsText} ${style.marginTop10}`}><strong>Marked as <span className={yesOrNoMRP === 'Yes' ? style.yesText : style.noText}>{yesOrNoMRP}</span></strong> on {format(new Date(updatedDateMRP), "MMM dd, yyyy")}</div>
                  <div
                    className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                  >
                    <div
                      className={`${style.reappointmentButtonEdit}`}
                      onClick={() => setYesOrNoMRP('')}
                    >
                      VIEW TO MODIFY
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <div className={` ${style.marginTop}`}>
            <div className={`${style.applicationCardStyle}`}>
              <div className={style.cardTitle}>
                Hospital Coverage
              </div>
              <div className={`${style.warningCard} ${style.marginTop10}`}>
                <div className={style.warningText}>
                  24 hours coverage of hospital patients, including those in the
                  ER, is a requirement of Professional Staff responsibilities. The
                  physician must provide an acceptable method to respond to
                  hospital calls.
                </div>
              </div>
              {(basicForm?.basicDetails?.departmentSpecialty?.department ===
                "Women & Children" &&
                basicForm?.basicDetails?.departmentSpecialty?.specialty ===
                "Obstetrics & Gynecology") ? (
                <div className={style.marginTop}>
                  <div className={`${style.lableStyle}`}>
                    {`If you are practicing obstetrics, who covers your patients when you are not available?*`}
                  </div>
                  <div className={style.rowContainer}>
                    <div className={style.fieldWrapper}>
                      <CommonSelectField
                        value={obstetricsProviderType}
                        onChange={(e) => { setObstetricsProviderType(e.target.value); setObstetricsCovererName(""); setObstetricsCovererNameList("") }}
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
                    {obstetricsProviderType !== "Not Applicable" && (
                      <>
                        {obstetricsProviderType === "Individual" && (
                          <div className={style.fieldWrapper}>
                            <div className={`${style.lableStyle}`}>
                              {'Select Who covers in Specific Provider*'}
                            </div>
                            {/* <CommonSelectField
                              value={obstetricsCovererName}
                              onChange={(e) => setObstetricsCovererName(e.target.value)}
                              firstOptionLabel="Select who covers in Specific Provider"
                              firstOptionValue=""
                              className={style.fullWidth}
                              valueList={obstetricsapplicantOptions.map((option) => option.value)}
                              labelList={obstetricsapplicantOptions.map((option) => option.label)}
                              disabledList={[]}
                              disabledSelect={false}
                              error={!obstetricsCovererName}
                              label={"Select Who covers in Specific Provider"}
                              required={true}
                              warning={!obstetricsCovererName}
                            /> */}
                            <DatalistInput
                              items={getItemsSingle(obstetricsapplicantOptions) || []}
                              onSelect={(item) => {
                                console.log('Selected Item:', item); // Debugging selection
                                setObstetricsCovererName(item.label);
                                setObstetricsCovererId(item.id);
                                setObstetricsCovererNameList((prevCheckedIds) => {
                                  const filteredIds = (Array.isArray(prevCheckedIds) ? prevCheckedIds : []).filter((id) => id !== item.id);
                                  return [...filteredIds, item.id];
                                });
                              }}
                              className={`${style.fullWidth} ${style.marginTop10} ${style.leftAlign}`}
                              maxLength={50}
                              placeholder={'Select who covers in Specific Provider'}
                              value={obstetricsCovererName}
                              required={true}
                              error={!obstetricsCovererName}
                              warning={warningFields
                                ?.map((data) => data?.label)
                                ?.includes(
                                  `Who covers your hospital patients when you are not available?`
                                )}
                            />
                          </div>
                        )}

                        {obstetricsProviderType === "Group" && (
                          // <TextArea
                          //   value={obstetricsCovererName}
                          //   className={`${style.fullWidth} ${style.marginTop10}`}
                          //   onChange={(e) => setObstetricsCovererName(e.target.value)}
                          //   placeholder={"Enter Here"}
                          //   rows={4}
                          // />
                          <div className={style.fieldWrapper}>
                            <div className={`${style.lableStyle}`}>
                              {'Name the Provider Groups to cover you*'}
                            </div>
                            <div className={`${style.displayInRow}`}>
                              <DatalistInput
                                items={getItems(groupOptions) || []}
                                onSelect={(item) => {
                                  setObstetricsCovererName('');
                                  setObstetricsCovererId(item.id);
                                  setObstetricsCovererNameList((prevCheckedIds) => {
                                    const filteredIds = (Array.isArray(prevCheckedIds) ? prevCheckedIds : []).filter((id) => id !== item.id);
                                    return [...filteredIds, item.id];
                                  });
                                }}
                                onInput={(e) => {
                                  const value = e.target.value.trim();
                                  setObstetricsCovererName(value);
                                  const filteredItems = (getItems(groupOptions))
                                    .filter(
                                      (item) => item?.value?.toLowerCase().includes(value.toLowerCase())
                                    );
                                  setShowAddButton(filteredItems.length === 0 && value !== '');
                                }}
                                className={`${style.fullWidth} ${style.marginTop10} ${style.leftAlign}`}
                                maxLength={50}
                                // onChange={(e) => {
                                //   setObstetricsCovererName(e.target.value);
                                // }}
                                placeholder={'Enter the Provider Group to cover you'}
                                value={obstetricsCovererName}
                                required={true}
                                error={!obstetricsCovererName}
                                warning={warningFields
                                  ?.map((data) => data?.label)
                                  ?.includes(
                                    `Who covers your hospital patients when you are not available?`
                                  )}
                              />
                              {showAddButton && (
                                <button
                                  type="button"
                                  className={`${style.continue} ${style.addButton}`}
                                  onClick={() => {
                                    getaddCoverageGroupsobstetrics();
                                  }}
                                >
                                  Add
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className={`${style.chipsContainer} ${style.marginTop10}`}>
                    {/* {obstetricsCovererNameList?.map ? (
                    obstetricsCovererNameList?.map(data => {
                      return (
                        <div className={`${style.privilegeCategoryChips} ${style.displayInRow}`}>
                          <div>{groupOptions?.filter(optionData => optionData?.id === data)?.[0]?.name}</div> <div className={`${style.verticalAlignCenter} ${style.marginLeft} ${style.cursorPointer}`}
                            onClick={() => obstetricsCovererNameList(obstetricsCovererNameList?.filter(innerData => innerData !== data))}
                          ><CancelIcon sx={{ color: '#06617A', fontSize: 20 }} /></div></div>
                      )
                    })
                  ) : null } */}
                    {obstetricsProviderType === "Group" && (
                      <div className={`${style.chipsContainer}`}>
                        {obstetricsCovererNameList?.map ? (
                          obstetricsCovererNameList?.map(data => {
                            console.log("grouplevel", obstetricsCovererNameList)
                            return (
                              <div className={`${style.privilegeCategoryChips} ${style.displayInRow}`}>
                                <div>{groupOptions?.filter(optionData => optionData?.id === data)?.[0]?.name}</div>
                                <div className={`${style.verticalAlignCenter} ${style.marginLeft} ${style.cursorPointer}`}
                                  onClick={() => setObstetricsCovererNameList(obstetricsCovererNameList?.filter(innerData => innerData !== data))}
                                ><CancelIcon sx={{ color: '#06617A', fontSize: 20 }} /></div></div>
                            )
                          })
                        ) : null}
                      </div>
                    )}
                    {obstetricsProviderType === "Individual" && (
                      <div className={`${style.chipsContainer}`}>
                        {obstetricsCovererNameList?.map ? (
                          obstetricsCovererNameList.map((data, index) => (
                            <div key={index} className={`${style.privilegeCategoryChips} ${style.displayInRow}`}>
                              {/* <div>{name}</div>   */}
                              <div>
                                {selectApplicantObstetrics?.filter(optionData => optionData?.id === data)?.[0]?.applicant?.name?.firstName}{" "}
                                {selectApplicantObstetrics?.filter(optionData => optionData?.id === data)?.[0]?.applicant?.name?.middleName}{" "}
                                {selectApplicantObstetrics?.filter(optionData => optionData?.id === data)?.[0]?.applicant?.name?.lastName}
                              </div>
                              <div
                                className={`${style.verticalAlignCenter} ${style.marginLeft} ${style.cursorPointer}`}
                                onClick={() => handleRemoveChipObstetrics(index)} // Optional: Add a remove handler
                              >
                                <CancelIcon sx={{ color: '#06617A', fontSize: 20 }} />
                              </div>
                            </div>
                          ))
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={style.marginTop}>
                  <div className={`${style.lableStyle}`}>
                    {`Who covers your hospital patients when you are not available?`}
                  </div>
                  <div className={style.rowContainer}>
                    <div className={style.fieldWrapper}>
                      <CommonSelectField
                        value={providerType}
                        onChange={(e) => { setProviderType(e.target.value); setCovererName(""); setCovererNameList(""); }}
                        className={style.fullWidth}
                        firstOptionLabel={providerLabels}
                        firstOptionValue=""
                        valueList={providerOptions}
                        labelList={providerOptions}
                        disabledList={providerOptions?.map(data => false)}
                        label={providerLabels}
                        disabledSelect={false}
                        required={true}
                        error={false}
                        warning={false}
                      />
                    </div>
                    {providerType !== "Not Applicable" && (
                      <>
                        {providerType === "Individual" && (
                          <div className={`${style.fieldWrapper}`}>
                            <div className={`${style.lableStyle}`}>
                              {'Select Named Covering Providers*'}
                            </div>
                            {/* <CommonSelectField
                              value={covererName}
                              onChange={(e) => setCovererName(e.target.value)}
                              className={style.fullWidth}
                              valueList={applicantOptions?.map((option) => option?.value)}
                              labelList={applicantOptions?.map((option) => option?.label)}
                              disabledList={[]}
                              disabledSelect={false}
                              error={!covererName}
                              label={"Select Named Covering Providers"}
                              required={true}
                              warning={warningFields
                                ?.map((data) => data?.label)
                                ?.includes(
                                  `Who covers your hospital patients when you are not available?`
                                )}
                            /> */}
                            <DatalistInput
                              items={getItemsSingle(applicantOptions) || []}
                              onSelect={(item) => {
                                setCovererName(item.label);
                                setCovererId(item.id);
                                setCovererNameList(prevCheckedIds => {
                                  // return prevCheckedIds?.includes(item.id)
                                  //   ? prevCheckedIds.filter(checkedId => checkedId !== item.id)
                                  //   : [...prevCheckedIds, item.id];
                                  const filteredIds = (Array.isArray(prevCheckedIds) ? prevCheckedIds : []).filter((id) => id !== item.id);
                                  return [...filteredIds, item.id];
                                });
                              }}
                              className={`${style.fullWidth} ${style.marginTop10} ${style.leftAlign}`}
                              maxLength={50}
                              placeholder={'Enter the Provider Group to select'}
                              value={covererName}
                              required={true}
                              error={!covererName}
                              warning={warningFields
                                ?.map((data) => data?.label)
                                ?.includes(
                                  `Who covers your hospital patients when you are not available?`
                                )}
                            />
                          </div>
                        )}

                        {providerType === "Group" && (
                          <div className={style.fieldWrapper}>
                            {/* <CommonSelectField
                            value={covererName}
                            onChange={(e) => setCovererName(e.target.value)}
                            className={style.fullWidth}
                            valueList={groupOptions?.map(data => data?.id)}
                            labelList={groupOptions?.map(data => data?.name)}
                            disabledList={groupOptions?.map(data => false)}
                            disabledSelect={false}
                            error={!covererName}
                            label={"Name the Provider Group to cover you"}
                            required={true}
                            warning={warningFields
                              ?.map((data) => data?.label)
                              ?.includes(
                                `Who covers your hospital patients when you are not available?`
                              )}
                          /> */}
                            <div>
                              <div className={`${style.lableStyle}`}>
                                {'Name the Provider Groups to cover you*'}
                              </div>
                              <div className={`${style.displayInRow}`}>
                                <DatalistInput
                                  items={getItems(groupOptions) || []}
                                  onSelect={(item) => {
                                    setCovererName('');
                                    setCovererId(item.id);
                                    setCovererNameList(prevCheckedIds => {
                                      const filteredIds = (Array.isArray(prevCheckedIds) ? prevCheckedIds : []).filter((id) => id !== item.id);
                                      return [...filteredIds, item.id];
                                    });
                                  }}
                                  onInput={(e) => {
                                    const value = e.target.value.trim();
                                    setCovererName(value);
                                    const filteredItems = (getItems(groupOptions))
                                      .filter(
                                        (item) => item?.value?.toLowerCase().includes(value.toLowerCase())
                                      );
                                    setShowAddButton(filteredItems.length === 0 && value !== '');
                                  }}
                                  className={`${style.fullWidth} ${style.marginTop10} ${style.leftAlign}`}
                                  maxLength={50}
                                  placeholder={'Enter the Provider Group to select'}
                                  value={covererName}
                                  required={true}
                                  error={!covererName}
                                  warning={warningFields
                                    ?.map((data) => data?.label)
                                    ?.includes(
                                      `Who covers your hospital patients when you are not available?`
                                    )}
                                />
                                {showAddButton && (
                                  <button
                                    type="button"
                                    className={`${style.continue} ${style.addButton}`}
                                    onClick={() => {
                                      getaddCoverageGroups();
                                    }}
                                  >
                                    Add
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {providerType === "Group" && (
                    <div className={`${style.chipsContainer} ${style.marginTop10}`}>
                      {covererNameList?.map ? (
                        covererNameList?.map(data => {
                          console.log("grouplevel", covererNameList)
                          return (
                            <div className={`${style.privilegeCategoryChips} ${style.displayInRow}`}>
                              <div>{groupOptions?.filter(optionData => optionData?.id === data)?.[0]?.name}</div>
                              <div className={`${style.verticalAlignCenter} ${style.marginLeft} ${style.cursorPointer}`}
                                onClick={() => setCovererNameList(covererNameList?.filter(innerData => innerData !== data))}
                              ><CancelIcon sx={{ color: '#06617A', fontSize: 20 }} /></div></div>
                          )
                        })
                      ) : null}
                    </div>
                  )}
                  {providerType === "Individual" && (
                    <div className={`${style.chipsContainer} ${style.marginTop10}`}>
                      {covererNameList?.map ? (
                        covererNameList.map((data, index) => (
                          <div key={index} className={`${style.privilegeCategoryChips} ${style.displayInRow}`}>
                            {/* <div>{name}</div> */}
                            {/* <div>{selectApplicant?.filter(optionData => optionData?.id === data)?.[0]?.applicant?.name?.firstName}</div>   */}
                            <div>
                              {selectApplicant?.filter(optionData => optionData?.id === data)?.[0]?.applicant?.name?.firstName}{" "}
                              {selectApplicant?.filter(optionData => optionData?.id === data)?.[0]?.applicant?.name?.middleName}{" "}
                              {selectApplicant?.filter(optionData => optionData?.id === data)?.[0]?.applicant?.name?.lastName}
                            </div>

                            <div
                              className={`${style.verticalAlignCenter} ${style.marginLeft} ${style.cursorPointer}`}
                              onClick={() => handleRemoveChip(index)} // Optional: Add a remove handler
                            >
                              <CancelIcon sx={{ color: '#06617A', fontSize: 20 }} />
                            </div>
                          </div>
                        ))
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={style.threeColForButton}>
            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getSkipClicked(true)}>SKIP FOR NOW</div>
            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
            <div className={`${style.continue} ${style.marginTop}`} onClick={() => navigate(-1)}>BACK</div>
            <div className={`${style.continue} ${style.marginTop} ${((basicForm?.basicDetails?.departmentSpecialty?.department === 'Women & Children'
              && basicForm?.basicDetails?.departmentSpecialty?.specialty === 'Pediatrics') ? (yesOrNoLMS !== '' && yesOrNoSuboxone !== '' && yesOrNoMRP !== '')
              : (yesOrNoLMS !== '' && yesOrNoSuboxone !== '')) ? '' : style.disabledButton}`} onClick={((basicForm?.basicDetails?.departmentSpecialty?.department === 'Women & Children'
                && basicForm?.basicDetails?.departmentSpecialty?.specialty === 'Pediatrics') ? (yesOrNoLMS !== '' && yesOrNoSuboxone !== '' && yesOrNoMRP !== '') :
                (yesOrNoLMS !== '' && yesOrNoSuboxone !== '')) ? () => getMissingFields() : () => { }}>CONTINUE</div>
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
            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getSkipClicked(true)}>SKIP FOR NOW</div>
            <div className={`${style.saveInProgress} ${style.marginTop10}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
            <div className={style.twoColForButton}>
              <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
              {/* <div className={`${style.continue} ${style.marginTop10}`} onClick={() => setShowJourneyDialog(true)}>CONTINUE</div> */}
              <div className={`${style.continue} ${style.marginTop10} ${((basicForm?.basicDetails?.departmentSpecialty?.department === 'Women & Children'
                && basicForm?.basicDetails?.departmentSpecialty?.specialty === 'Pediatrics') ? (yesOrNoLMS !== '' && yesOrNoSuboxone !== '' && yesOrNoMRP !== '')
                : (yesOrNoLMS !== '' && yesOrNoSuboxone !== '')) ? '' : style.disabledButton}`} onClick={((basicForm?.basicDetails?.departmentSpecialty?.department === 'Women & Children'
                  && basicForm?.basicDetails?.departmentSpecialty?.specialty === 'Pediatrics') ? (yesOrNoLMS !== '' && yesOrNoSuboxone !== '' && yesOrNoMRP !== '') :
                  (yesOrNoLMS !== '' && yesOrNoSuboxone !== '')) ? () => getMissingFields() : () => { }}>CONTINUE</div>

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