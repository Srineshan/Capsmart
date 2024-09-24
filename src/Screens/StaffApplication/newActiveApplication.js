import React, { useState, useEffect, useRef } from "react";
import { InputGroup, Icon, Intent, Dialog, Classes } from "@blueprintjs/core";
import FileImg from "./../../images/fileImg.png";
import WritingFile from "./../../images/writingFile.png";
import CompletedIcon from "./../../images/completedIcon.png";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import RedWarning from "./../../images/redWarning.png";
import Verified from "./../../images/verifiedImage.png";
import CrossPink from "./../../images/crossPink.png";
import ToBeVerified from "./../../images/toBeVerifiedImage.png";
import Tooltip from "@mui/material/Tooltip";
import { DELETE, TenantID, GET, PUT } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import "react-datalist-input/dist/styles.css";
import Alert from "../../Components/AlertPopUp";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DataStatusIcon from './../../images/dqStatus.png';
import DocumentIcon from '../../images/document.png';
import EditBlue from "../../images/editBlue.png";
import OutGoing from "../../images/Outgoing.png";
import { format } from 'date-fns';
import Popover from '@mui/material/Popover';
import style from "./index.module.scss";
import ApplicationDecline from "./applicationDeclineDialog";
import ApplicationHeader from '../../Components/ApplicationHeader';
import ApplicationFieldCard from '../../Components/ApplicationFieldCard';
import CommonDivider from '../../Components/CommonFields/CommonDivider';


const NewActiveApplication = ({
  contracts,
  getNewContract,
  contractType,
  selectedContract,
  selectedContractType,
  contractIdFromActive,
  getContractIdFromActive,
  method,
  isEditable,
  getActiveApplicationView
}) => {
  console.log('contract Type', contractType)
  const [applicationId, setApplicationId] = useState(sessionStorage.getItem('applicationId'));
  const [form, setForm] = useState();
  const contractStatus = sessionStorage.getItem("Selected Contract Status");
  const [selectContractInfo, setSelectContractInfo] = useState(contractType?.value);
  const [deleteExecutedContractDialog, setDeleteExecutedContractDialog] =
    useState(false);
  const [newServiceProviderDialog, setNewServiceProviderDialog] =
    useState(false);
  const [formSchema, setFormSchema] = useState();
  const [formSchemaId, setFormSchemaId] = useState();
  const [addOn, setAddOn] = useState(false);
  const [viewPage1, setViewPage1] = useState(true);
  const [viewPage2, setViewPage2] = useState(false);
  const [viewPage3, setViewPage3] = useState(false);
  const [viewPage4, setViewPage4] = useState(false);
  const [viewPage5, setViewPage5] = useState(false);
  const [viewPage6, setViewPage6] = useState(false);
  const [viewPage7, setViewPage7] = useState(false);
  const [viewPage8, setViewPage8] = useState(false);
  const [viewPage9, setViewPage9] = useState(false);
  const [viewPage10, setViewPage10] = useState(false);
  const [currentPage, setCurrentPage] = useState("Contract ID & Term Limit");
  const [isMultipleContract, setIsMultipleContract] = useState(false);
  const [contractId, setContractId] = useState(contractIdFromActive);
  const [fileFields, setFileFields] = useState([]);
  const [contractName, setContractName] = useState("");
  const [fileDeletionIndex, setFileDeletionIndex] = useState();
  const [fileItems, setFileItems] = useState([]);
  const [isMultiSiteEntity, setIsMultiSiteEntity] = useState(false);
  const [helpTextData, setHelpTextData] = useState();
  const [form1, setForm1] = useState();
  const [selectedField, setSelectedField] = useState({
    fieldName: "",
    empty: false,
  });
  const [selectedFileURL, setSelectedFileURL] = useState("");
  const [priorContractId, setPriorContractId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showPrevContractDataAlert, setShowPrevContractDataAlert] = useState(false);
  const [isTabsValid, setIsTabsValid] = useState([]);
  const [expand, setExpand] = useState({ status: false, index: 0 });
  const [contractSelected, setContractSelected] = useState(
    contracts
      ?.filter((contract) => contract?.id === contractId)
      ?.map((data) => data)[0]
  );
  const [showDocVerifyDialog, setShowDocVerifyDialog] = useState(false);
  const [file, setFile] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRowTableName, setSelectedRowTableName] = useState();
  const [selectedFormId, setSelectedFormId] = useState();
  useEffect(() => {
    getPreApplication();
  }, [])

  const [providerDetails, setProviderDetails] = useState();
  const [prevContractData, setPrevContractData] = useState();
  const [showApplicationDeclineDialog, setShowApplicationDeclineDialog] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const getPreApplication = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/${applicationId}`
    );
    setForm(basicForm)
  }

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getFormSchema()
  }, [formSchemaId])

  const open = Boolean(anchorEl);

  const [anchorTextEl, setAnchorTextEl] = React.useState(null);

  const handlePopoverTextOpen = (event) => {
    setAnchorTextEl(event.currentTarget);
  };

  const handlePopoverTextClose = () => {
    setAnchorTextEl(null);
  };

  const openTextWithHover = Boolean(anchorTextEl);

  const getApplicationDeclineDialog = (value) => {
    setShowApplicationDeclineDialog(value);
  }

  console.log(contractSelected, prevContractData, 'selected contract')

  // useEffect(() => {
  //   getTabDataStatus();
  // }, []);

  useEffect(() => {
    getFileData();
    getEntityData();
    getBasicForm();
    helpText();
  }, []);

  useEffect(() => {
    helpText();
  }, [currentPage]);

  useEffect(() => {
    getFileData();
    console.log("entered");
  }, [fileFields]);

  useEffect(() => {
    setContractSelected(contracts
      ?.filter((contract) => contract?.id === contractId)
      ?.map((data) => data)[0])
  }, [contractId])

  useEffect(() => {
    if (contractSelected?.contractDetail?.priorContractRefId?.id !== undefined) {
      getPrevContractData()
    }
  }, [contractSelected])

  const getPrevContractData = async () => {
    const { data: contractData } = await GET(
      `contract-managment-service/contracts/${contractSelected?.contractDetail?.priorContractRefId?.id}/contractDetail`
    );
    if (contractData) {
      setPrevContractData(contractData)
    }
  }

  const getFormSchema = async () => {
    if (formSchemaId !== '' && formSchemaId !== undefined && formSchemaId !== null) {
      const { data: form } = await GET(
        `application-management-service/formSchema/${formSchemaId}`
      );
      setFormSchema(form?.schema)
    }
  }

  const getTabDataStatus = () => {
    // let temp = validateTabs(contractSelected?.id);
    // temp.then((value) => {
    //   setIsTabsValid(value);
    //   let temp = value?.value2;
    //   temp.then((response) => {
    //     setProviderDetails(response);
    //   });
    // });
  };

  const getPriorContractId = (value) => {
    console.log('prior contract id', value)
    setPriorContractId(value);
  }

  const checkFieldAndPopAlert = (value, fieldName) => {
    if (value === null || value === 0 || value === '' || value === undefined || value === '0') {
      console.log('inside');
      setSelectedField({ fieldName: fieldName, empty: false })
    } else {
      setSelectedField({ fieldName: fieldName, empty: true })
    }
  }

  const helpText = async () => {
    const { data: data } = await GET(`contract-managment-service/helpText?tabName=${encodeURIComponent(currentPage)}`);
    setHelpTextData(data?.dataElement);
  }

  const getEntityData = async () => {
    const { data: data } = await GET(`entity-service/entity/${TenantID}`);
    setIsMultiSiteEntity(data?.multiSiteEntity);
  }

  const getShowPrevContractDataAlert = (value) => {
    console.log(value, 'test')
    setShowPrevContractDataAlert(value === false ? true : false)
  }

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
        delete temp.properties.applicant.properties['applicantType']
        delete temp.properties.applicant.properties['startDate']
      }
      setForm1(form1?.schema)
    }
  }

  const getFileData = () => {
    let temp = [];
    console.log('entered', fileFields)
    for (let i = 0; i < fileFields?.length || 0; i++) {
      temp[i] = (
        <div className={`${style.documentCard} ${style.marginTop10}`} key={i}>
          <div className={`${style.documentGrid}`}>
            <a href={fileFields?.[i]?.fileURL} target="_blank">
              <Tooltip title={'Preview'} arrow>
                <ArticleOutlinedIcon sx={{ color: '#b0a9ef', fontSize: 35 }} onClick={() => { setSelectedFileURL(fileFields?.[i]?.fileURL) }} />
              </Tooltip>
            </a>
            <div className={style.marginTop}>
              <a href={fileFields?.[i]?.fileURL} target="_blank">
                <Tooltip title={'Preview'} arrow>
                  <p className={`${style.documentText} ${style.leftAlign} ${style.removeUnderline}`} onClick={() => { setSelectedFileURL(fileFields?.[i]?.fileURL) }}><strong>{fileFields?.[i]?.documentType}</strong></p>
                </Tooltip>
              </a>

              <div className={style.spaceBetween}>
                <p className={`${style.documentText} ${style.leftAlign}`}><strong>{fileFields?.[i]?.fileName}</strong></p>
                <div onClick={() => { getDeleteExecutedContractDialog(true); setFileDeletionIndex(i); }} className={`${style.floatRight} ${style.cursorPointer}`}>
                  <DeleteOutlineIcon sx={{ color: '#F94848' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    setFileItems(temp);
  };

  const handleVerify = async (formId) => {
    await PUT(`application-management-service/application/${applicationId}/APPROVED`)
      .then(response => {
        console.log('success')
      })
      .catch((error) => {
        console.log(error)
      });
    getPreApplication();
  }

  const handleStepsVerify = async (formId) => {
    await PUT(`application-management-service/application/${applicationId}/form/${formId}/APPROVED`)
      .then(response => {
        console.log('success')
      })
      .catch((error) => {
        console.log(error)
      });
    getPreApplication();
  }

  const handleDocVerify = async (rowId) => {
    let temp = {
      "formId": selectedFormId,
      "contentToVerify": "DOCUMENT",
      "tableName": selectedRowTableName,
      "rowId": rowId
    }
    await PUT(`application-management-service/application/${applicationId}/verifyForm`, temp)
      .then(response => {
        console.log('success')
      })
      .catch((error) => {
        console.log(error)
      });
    getPreApplication();
  }

  const handleApplicationAccept = async () => {
    await PUT(`application-management-service/application/${applicationId}/workflow/complete/APPROVED`)
      .then(response => {
        console.log('success')
        window.location.reload()
      })
      .catch((error) => {
        console.log(error)
      });
    getPreApplication();
  }

  const getContractId = (value) => {
    setContractId(value);
  };

  const getNewServiceProviderDialog = (value) => {
    setNewServiceProviderDialog(value);
  };

  const getDeleteExecutedContractDialog = (value) => {
    setDeleteExecutedContractDialog(value);
  };

  const getAddOn = (value) => {
    setAddOn(value);
  };

  const getValueByPath = (obj, path) => {
    const keys = path.split(/[\.\[\]]+/).filter(Boolean);
    console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], form), form, 'if')
    return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], form);
  };

  const getShowAlert = (value, type = "cross") => {
    setShowAlert(value);
    if (!value && type === "ok") {
      getNewContract(false);
      getContractIdFromActive("");
    }
  };

  const getViewPage1 = (value) => {
    setViewPage1(value);
  };

  const getViewPage2 = (value) => {
    setViewPage2(value);
  };

  const getViewPage3 = (value) => {
    setViewPage3(value);
  };

  const getViewPage4 = (value) => {
    setViewPage4(value);
  };

  const getViewPage5 = (value) => {
    setViewPage5(value);
  };

  const getViewPage6 = (value) => {
    setViewPage6(value);
  };

  const getViewPage7 = (value) => {
    setViewPage7(value);
  };

  const getViewPage8 = (value) => {
    setViewPage8(value);
  };

  const getViewPage9 = (value) => {
    setViewPage9(value);
  };

  const getViewPage10 = (value) => {
    setViewPage10(value);
  };

  const getCurrentPage = (value) => {
    setCurrentPage(value);
  };

  const getFileFields = (value) => {
    console.log(value);
    setFileFields(value);
    if (value?.[value?.length - 1]?.id === "" && value?.length !== 0) {
      getFileData();
    }
  };

  const getContractName = (value) => {
    setContractName(value);
  };

  useEffect(() => {
    setIsMultipleContract(selectContractInfo === "MULTIPLE" ? true : false);
  }, [selectContractInfo]);

  const handleFileDeletion = async () => {
    let fileIdToDelete = fileFields
      ?.filter((data, index) => index === fileDeletionIndex)
      ?.map((data) => data?.id)[0];
    setFileFields(
      fileFields
        ?.filter((data, index) => index !== fileDeletionIndex)
        ?.map((data) => data)
    );
    if (fileIdToDelete) {
      await DELETE(
        `contract-managment-service/contracts/contractFile/${fileIdToDelete}`
      ).then((response) => {
        SuccessToaster("Document Deleted Successfully");
      });
    }
    getDeleteExecutedContractDialog(false);
    setFileDeletionIndex();
  };

  const onClose = () => {
    getActiveApplicationView(false);
  };

  const renderFieldsBasedOnStep = (data) => {
    switch (data?.schemaCategory) {
      case 'ContactAddress':
        return (
          <>
            {formSchema !== undefined && formSchema?.properties !== null && 'contactAddress1' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.contactAddress1} basicForm={form} setBasicForm={setForm} stepPath={`forms[1].data`} gridStyle={style.homeMailingAddressGrid} baseKey={'contactAddress1'} isPOD={true} />
            )}
            <CommonDivider />
            {formSchema !== undefined && formSchema?.properties !== null && 'contactAddress2' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.contactAddress2} basicForm={form} setBasicForm={setForm} stepPath={`forms[1].data`} gridStyle={style.mailingAddressGrid} baseKey={'contactAddress2'} isPOD={true} />
            )}
            <CommonDivider />
            {formSchema !== undefined && formSchema?.properties !== null && 'contactAddress3' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.contactAddress3} basicForm={form} setBasicForm={setForm} stepPath={`forms[1].data`} gridStyle={style.businessMailingAddressGrid} baseKey={'contactAddress3'} isPOD={true} />
            )}
          </>
        );
      case 'Qualification':
        return (
          <>
            {formSchema !== undefined && formSchema?.properties !== null && 'certifications' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.certifications} basicForm={form} setBasicForm={setForm} stepPath={`forms[2].data`} gridStyle={style.licenseGrid} baseKey={'certifications'} isPOD={true} />
            )}
          </>
        );
      case 'MalpracticeInfo':
        return (
          <>
            {formSchema !== undefined && formSchema?.properties !== null && 'insuranceCarrierInformation' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.insuranceCarrierInformation} basicForm={form} setBasicForm={setForm} stepPath={`forms[3].data`} gridStyle={style.insuranceGrid} baseKey={'insuranceCarrierInformation'} isPOD={true} />
            )}
          </>
        );
      case 'Education':
        return (
          <>
            {formSchema !== undefined && formSchema?.properties !== null && 'graduation' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.graduation} basicForm={form} gridStyle={style.EducationGrid} baseKey={'graduation'} addMoreType={true} formId={form?.forms?.[4]?.id} applicationId={applicationId} tableGrid={style.tableGridGraduation} isPOD={true}
                heading={'Information Requirement Alert'}
                subHeading={'For this application you are required to provide information on all of the different undergraduate / graduate qualifications you have.'}
                subHeading2={'You will not be able to submit your application if this is not provided.'} />
            )}
            <div className={style.marginTop20}>
              {form?.forms?.[4]?.data?.graduation?.map((data, index) =>
                data?.file?.fileURL !== undefined ? (
                  <div className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`} key={index}>
                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.file?.fileName}</div>
                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.file?.classification !== null ? data?.file?.classification : '-'}</div>
                    <div className={`${style.displayInRow} ${style.cursorPointer}`} onClick={() => { setFile(data?.file); setShowDocVerifyDialog(true); setSelectedRow(data); setSelectedRowTableName('graduation'); setSelectedFormId(form?.forms?.[4]?.id) }}>
                      {(data?.file?.isVerified !== undefined && data?.file?.isVerified) ? (
                        <>
                          <img src={Verified} alt="" className={style.verifyImage} />
                          <div className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}>
                            <div className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}>Verified</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img src={ToBeVerified} alt="" className={style.verifyImage} />
                          <div className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}>
                            <div className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}>Verify</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : ''
              )}
            </div>
          </>
        );
      case 'WorkExperience':
        return (
          <>
            {formSchema !== undefined && formSchema?.properties !== null && 'trainingAndWorkingExperience' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.trainingAndWorkingExperience} basicForm={form} gridStyle={style.trainingGrid} baseKey={'trainingAndWorkingExperience'} addMoreType={true} formId={form?.forms?.[5]?.id} applicationId={applicationId} tableGrid={style.tableGridTrainingAndExperience} isPOD={true} />
            )}
            <div className={style.marginTop20}>
              {form?.forms?.[5]?.data?.trainingAndWorkingExperience?.map((data, index) =>
                data?.file?.fileURL !== undefined ? (
                  <div className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`} key={index}>
                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.file?.fileName}</div>
                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.file?.classification !== null ? data?.file?.classification : '-'}</div>
                    <div className={`${style.displayInRow} ${style.cursorPointer}`} onClick={() => { setFile(data?.file); setShowDocVerifyDialog(true); setSelectedRow(data); setSelectedRowTableName('trainingAndWorkingExperience'); setSelectedFormId(form?.forms?.[5]?.id) }}>
                      {(data?.file?.isVerified !== undefined && data?.file?.isVerified) ? (
                        <>
                          <img src={Verified} alt="" className={style.verifyImage} />
                          <div className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}>
                            <div className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}>Verified</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img src={ToBeVerified} alt="" className={style.verifyImage} />
                          <div className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}>
                            <div className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}>Verify</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : ''
              )}
            </div>
            <CommonDivider />
            {formSchema !== undefined && formSchema?.properties !== null && 'healthcareFacilityAppointments' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.healthcareFacilityAppointments} basicForm={form} gridStyle={style.healthCareGrid} baseKey={'healthcareFacilityAppointments'} addMoreType={true} formId={form?.forms?.[5]?.id} applicationId={applicationId} tableGrid={style.tableGridTrainingAndExperience} isPOD={true} />
            )}
            <div className={style.marginTop20}>
              {form?.forms?.[5]?.data?.healthcareFacilityAppointments?.map((data, index) =>
                data?.file?.fileURL !== undefined ? (
                  <div className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`} key={index}>
                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.file?.fileName}</div>
                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.file?.classification !== null ? data?.file?.classification : '-'}</div>
                    <div className={`${style.displayInRow} ${style.cursorPointer}`} onClick={() => { setFile(data?.file); setShowDocVerifyDialog(true); setSelectedRow(data); setSelectedRowTableName('healthcareFacilityAppointments'); setSelectedFormId(form?.forms?.[5]?.id) }}>
                      {(data?.file?.isVerified !== undefined && data?.file?.isVerified) ? (
                        <>
                          <img src={Verified} alt="" className={style.verifyImage} />
                          <div className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}>
                            <div className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}>Verified</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img src={ToBeVerified} alt="" className={style.verifyImage} />
                          <div className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}>
                            <div className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}>Verify</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : ''
              )}
            </div>
          </>
        );
      case 'References':
        console.log(formSchema)
        return (
          <>
            {formSchema !== undefined && formSchema?.properties !== null && 'references' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.references} basicForm={form} gridStyle={style.twoCol} baseKey={'references'} setBasicForm={setForm} addMoreType={true} formId={form?.forms?.[7]?.id} applicationId={applicationId} tableGrid={style.tableGridReferences} isPOD={true} />
            )}
            <div className={style.marginTop20}>
              {form?.forms?.[7]?.data?.references?.map((data, index) =>
                data?.file?.fileURL !== undefined ? (
                  <div className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`} key={index}>
                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.file?.fileName}</div>
                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.file?.classification !== null ? data?.file?.classification : '-'}</div>
                    <div className={`${style.displayInRow} ${style.cursorPointer}`} onClick={() => { setFile(data?.file); setShowDocVerifyDialog(true); setSelectedRow(data); setSelectedRowTableName('references'); setSelectedFormId(form?.forms?.[7]?.id) }}>
                      {(data?.file?.isVerified !== undefined && data?.file?.isVerified) ? (
                        <>
                          <img src={Verified} alt="" className={style.verifyImage} />
                          <div className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}>
                            <div className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}>Verified</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img src={ToBeVerified} alt="" className={style.verifyImage} />
                          <div className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}>
                            <div className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}>Verify</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : ''
              )}
            </div>
            <CommonDivider />
            {formSchema !== undefined && formSchema?.properties !== null && 'privilegeReferences' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.privilegeReferences} basicForm={form} gridStyle={style.twoCol} baseKey={'privilegeReferences'} setBasicForm={setForm} addMoreType={true} formId={form?.forms?.[7]?.id} applicationId={applicationId} tableGrid={style.tableGridReferences} isPOD={true} />
            )}
            <div className={style.marginTop20}>
              {form?.forms?.[7]?.data?.privilegeReferences?.map((data, index) =>
                data?.file?.fileURL !== undefined ? (
                  <div className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`} key={index}>
                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.file?.fileName}</div>
                    <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.file?.classification !== null ? data?.file?.classification : '-'}</div>
                    <div className={`${style.displayInRow} ${style.cursorPointer}`} onClick={() => { setFile(data?.file); setShowDocVerifyDialog(true); setSelectedRow(data); setSelectedRowTableName('privilegeReferences'); setSelectedFormId(form?.forms?.[7]?.id) }}>
                      {(data?.file?.isVerified !== undefined && data?.file?.isVerified) ? (
                        <>
                          <img src={Verified} alt="" className={style.verifyImage} />
                          <div className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}>
                            <div className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}>Verified</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img src={ToBeVerified} alt="" className={style.verifyImage} />
                          <div className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}>
                            <div className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}>Verify</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : ''
              )}
            </div>
          </>
        );
      case 'ProfessionalConduct':
        return (
          <>
            {formSchema !== undefined && formSchema?.properties !== null && 'conductDisclosure1' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.conductDisclosure1} basicForm={form} stepPath={`forms[8].data`} gridStyle={style.conductGrid} baseKey={'conductDisclosure1'} collapsableQuestionCard={true} isPOD={true} />
            )}
            {formSchema !== undefined && formSchema?.properties !== null && 'conductDisclosure2' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.conductDisclosure2} basicForm={form} stepPath={`forms[8].data`} gridStyle={style.conductGrid} baseKey={'conductDisclosure2'} collapsableQuestionCard={true} isPOD={true} />
            )}
          </>
        );
      case 'CriminalHistory':
        return (
          <>
            {formSchema !== undefined && formSchema?.properties !== null && 'criminalData1' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.criminalData1} basicForm={form} stepPath={`forms[9].data`} gridStyle={style.conductGrid} baseKey={'criminalData1'} collapsableQuestionCard={true} isPOD={true} />
            )}
            {formSchema !== undefined && formSchema?.properties !== null && 'criminalData2' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.criminalData2} basicForm={form} stepPath={`forms[9].data`} gridStyle={style.conductGrid} baseKey={'criminalData2'} collapsableQuestionCard={true} isPOD={true} />
            )}
          </>
        );
      case 'MedicalHistory':
        return (
          <>
            {formSchema !== undefined && formSchema?.properties !== null && 'impactingPractice' in formSchema?.properties && (
              <ApplicationFieldCard object={formSchema?.properties?.impactingPractice} basicForm={form} stepPath={`forms[10].data`} gridStyle={style.conductGrid} baseKey={'impactingPractice'} collapsableQuestionCard={true} isPOD={true} />
            )}
          </>
        );
      case 'PrivilegeSelection':
        return (
          <>
            <div className={style.marginLeft50}>
              <div className={style.cardTextBoldStyle}>Selected Previleges</div>
              {form?.privileges?.obligatedPrivileges?.map((data, index) => (
                <div className={`${style.documentTextStyle} ${style.marginLeft} ${style.marginTop10}`} key={index}>{data?.privilegeSetTitle}</div>
              ))}
              {form?.privileges?.additionalPrivileges?.map((data, index) => (
                <div className={`${style.documentTextStyle} ${style.marginLeft} ${style.marginTop10}`} key={index}>{data?.privilegeSetTitle}</div>
              ))}
            </div>
          </>
        );
      default:
        return <></>;
    }
  }


  return (
    <>
      <div className={style.screenBackground}></div>
      {/* <div className={`${style.welcomePadding} ${style.headerHeading} ${style.addContractBody}`}> */}
      {/* <div className={style.spaceBetween}>
          <p className={style.welcomeStyle}>New {"{Doctor}"} {"{Full Time}"} Application For {"{First Last Name}"}
            <strong className={style.darkText}></strong>
          </p>
          <div className={style.displayInRow}>
            <img
              src={WritingFile}
              alt="Writing File"
              className={`${style.smallIcons} ${style.reduceTop10}`}
            />
            <Icon
              icon="cross"
              size={25}
              intent={Intent.DANGER}
              className={style.newContractCrossStyle}
              onClick={() => onClose()}
            />
          </div>
        </div> */}
      <ApplicationHeader title={`New ${form?.basicDetails?.applicant?.applicantType !== undefined ? form?.basicDetails?.applicant?.applicantType : '{Applicant Type}'} Application For ${form?.basicDetails?.applicant?.name?.firstName !== undefined ? form?.basicDetails?.applicant?.name?.firstName : '{First Name}'} ${form?.basicDetails?.applicant?.name?.lastName !== undefined ? form?.basicDetails?.applicant?.name?.lastName : '{Last Name}'}`} />

      <div className={style.welcomeBorder}></div>
      {/* </div > */}
      <div className={`${style.marginLeftRight50}`}>
        <div className={`${style.displayInRow} ${style.spaceBetween} ${style.topHeadingTextStyle} ${style.marginTop20}`}>
          {`CAP MANAGER > APPLICATIONS >> ${form?.basicDetails?.applicant?.name?.firstName || ''} ${form?.basicDetails?.applicant?.name?.lastName || ''}`}</div>
        <div className={style.grid2}>
          <div className={style.grid5and1}>
            <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
              <div className={`${style.spaceBetween}`}>
                <div className={`${style.displayInRow}`} >
                  <div className={`${style.photoBorderStyle} ${style.marginLeftRight10}`}>
                    <div className={`${style.photoCardStyle}`}>
                      <span>Photo</span>
                    </div>
                  </div>
                  <div className={`${style.displayInCol} ${style.textAlignLeft}`}>
                    <div className={`${style.marginTop10}`}>
                      <span className={`${style.cardTextBoldStyle} ${style.marginTop10}`}>{form?.basicDetails?.applicant?.name?.firstName || ''} {form?.basicDetails?.applicant?.name?.middleName || ''} {form?.basicDetails?.applicant?.name?.lastName || ''}</span>
                      <span className={`${style.cardTextNormalStyle} ${style.marginTop10} ${style.marginLeft10}`}>Application ID</span>
                    </div>
                    <div className={`${style.cardTextNormalStyle} ${style.marginTop10} `}>{"{Full Time}"}{" {Doctor}"} Applying As {"{Associate}"}</div>
                    <div className={`${style.spaceBetween}`}>
                      <span className={`${style.cardTextBoldStyle} ${style.marginTop30}`}>{form?.basicDetails?.applicant?.cellPhone ? `+1 ${form?.basicDetails?.applicant?.cellPhone}` : ''}</span>
                      <span className={`${style.emailTextBoldStyle} ${style.marginTop30} ${style.marginLeft20}`}>{form?.basicDetails?.applicant?.email?.officialEmail || ''}</span>
                    </div>
                  </div>
                </div>
                <div className={`${style.displayInRow} ${style.marginRight20}`}>
                  <div className={`${style.displayInCol} `}>
                    {/* <div className={`${style.marginTop15} `}>
                      <span className={`${style.rightAlignTextStyle}`}>Proposed Start Date:</span>
                      <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>{}</span>
                    </div> 
                    <div className={`${style.marginTop15}`}>
                      <span className={`${style.rightAlignTextStyle}`}>Application Created On:</span>
                      <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>{format(new Date(form?.createdDate, 'dd/mm/YYYY'))}</span>
                    </div>*/}
                    <div className={`${style.marginTop15}`}>
                      <span className={`${style.rightAlignTextStyle}`}>Days To Complete:</span>
                      <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>15</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth}  ${style.marginTop20} ${style.statusCardHeight} ${style.displayInCol}`}>
              <div className={`${style.greyBigDotStyle} ${style.marginCenter} `}></div>
              <div className={`${style.greyDotTextStyle}`}>Overall Verification & Acceptance Status</div>
            </div>
          </div>

          <div>
            <div className={`${style.twoColumnGrid} ${style.marginTop20}`}>
              <div className={`${style.buttonCardStyle} `}>
                <div className={`${style.buttonTextStyle} ${style.alignCenter}`}>SAVE IN PROGRESS</div>
              </div>
              <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                <div className={`${style.buttonTextStyle} ${style.alignCenter}`} onClick={() => { setShowApplicationDeclineDialog(true) }}>REJECT</div>
              </div>
            </div>
            <div className={`${style.marginTop20}`}>
              <div className={`${style.bigButtonStyle} ${style.cursorPointer} `}>
                <div className={`${style.bigButtonTextStyle} ${style.alignCenter}`} onClick={handleApplicationAccept}>ACCEPT APPLICATION</div>
              </div>
            </div>
          </div>

          <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop10}`}>


            {/* //Table */}
            <div>
              <div className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle} `}>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                  <div className={`${style.marginLeft30} ${style.tableHeaderTextStyle}`}></div>
                </div>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                  <div className={`${style.tableHeaderTextStyle}`}>Required Data & POD Verification</div>
                </div>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                  <div className={`${style.tableHeaderTextStyle}`}
                    aria-owns={open ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}>
                    <img src={DataStatusIcon} alt="" style={{
                      width: "18px",
                      height: "20px"
                    }} />
                    <Popover
                      id={'mouse-over-popover'}
                      sx={{
                        pointerEvents: 'none',
                      }}
                      open={open}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      onClose={handlePopoverClose}
                      PaperProps={{
                        style: {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          borderRadius: 0
                        }
                      }}
                      disableRestoreFocus
                    >
                      <div className={style.multipleOptionsCard}>
                        <div className={`${style.specificActionCard} ${style.cursorPointer}`}>Data Quality Status</div>
                      </div>
                    </Popover>
                  </div>
                </div>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                  <div className={`${style.tableHeaderTextStyle}`}
                    aria-owns={openTextWithHover ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverTextOpen}
                    onMouseLeave={handlePopoverTextClose}>
                    <img src={DocumentIcon} alt=""
                      style={{
                        width: "18px",
                        height: "20px"
                      }} />
                    <Popover
                      id={'mouse-over-popover'}
                      sx={{
                        pointerEvents: 'none',
                      }}
                      open={openTextWithHover}
                      anchorEl={anchorTextEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      onClose={handlePopoverTextClose}
                      PaperProps={{
                        style: {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          borderRadius: 0
                        }
                      }}
                      disableRestoreFocus
                    >
                      <div className={style.multipleOptionsCard}>
                        <div className={`${style.specificActionCard} ${style.cursorPointer}`}>Document Status</div>
                      </div>
                    </Popover>
                  </div>
                </div>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                  <div className={`${style.tableHeaderTextStyle}`}>Documents</div>
                </div>
              </div>
              <div>
                <div className={` ${style.marginTop5} ${(expand?.status && expand?.index === 0) ? style.tableDataStyle1 : style.tableDataStyle}`}>
                  <div className={` ${style.tableHeaderGridStyle} ${style.marginTop10}`}>
                    <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                      <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${form?.basicInformationStatus ? style.greenDotStyle : style.greyDotStyle}`}></div>
                    </div>
                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                      <div className={`${(expand?.status && expand?.index === 0) ? style.tableHeaderTextStyle : style.tableDataFontStyle1}`}>Applicant Profile Information</div>
                    </div>
                    {/* {(expand?.status && expand?.index === 0) ? <div className={`${style.greenButton}  `}> <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>Verified</div>
                    </div> : <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                      <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                    </div>}
                    {!form?.basicInformationStatus ? (expand?.status && expand?.index === 0) ? <div className={`${style.purpleButton}  `}> <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`} onClick={() => handleVerify()}>Verify</div>
                    </div> :
                      (<div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                        <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                      </div>) : ''
                    }

                    {!form?.basicInformationStatus ? (expand?.status && expand?.index === 0) ?
                      <div className={`${style.whiteButton}`}>
                        <div className={`${style.buttonTextStyle} ${style.alignCenter}`}>RFC</div>
                      </div>
                      :
                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                        <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>0</div>
                      </div>
                      : ''
                    } */}
                    {(expand?.status && expand?.index === 0) ? (
                      <>
                        {!form?.basicInformationStatus ? (
                          <div className={`${style.purpleButton} ${style.cursorPointer} `}>
                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`} onClick={() => handleVerify()}>Verify</div>
                          </div>
                        ) : (
                          <div className={`${style.greenButton}  ${style.cursorPointer} `}>
                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>Verified</div>
                          </div>
                        )}
                        <div></div>
                      </>
                    ) : (
                      <>
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                          <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                        </div>
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                          <div className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                        </div>
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                          <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>-</div>
                        </div>
                      </>
                    )}

                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                      <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                        {
                          (expand?.status && expand?.index === 0) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => setExpand({ status: false, index: 0 })} />)
                            : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => setExpand({ status: true, index: 0 })} />)
                        }                    </div>
                    </div>
                  </div>
                  {expand?.status && expand?.index === 0 &&
                    <div className={`${style.marginTop} ${style.screenPadding}`}>
                      {/* <CommonMailingAddress label={'Business Mailing Address*'} onChangeAddressLine1={() => { }} placeholderAddressLine1={'123 Street'} maxLengthAddressLine1={25} valueAddressLine1={''}
                            onChangeAddressLine2={() => { }} placeholderAddressLine2={'Apartment 5'} maxLengthAddressLine2={25} valueAddressLine2={''} onChangeCity={() => { }} placeholderCity={'City'} maxLengthCity={25}
                            valueCity={''} onChangeState={() => { }} placeholderState={'Province'} maxLengthState={25} valueState={''} onChangeZipcode={() => { }} placeholderZipcode={'Zipcode'} maxLengthZipcode={15} valueZipcode={''} /> */}
                      {form1 !== undefined && 'applicant' in form1?.properties && (
                        <ApplicationFieldCard object={form1?.properties?.applicant} gridStyle={style.applicantGrid} baseKey={'applicant'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                      )}
                      {form1 !== undefined && 'credentialingPrivilegeCategory' in form1?.properties && (
                        <ApplicationFieldCard object={form1?.properties?.credentialingPrivilegeCategory} gridStyle={style.credentialingGrid} baseKey={'credentialingPrivilegeCategory'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                      )}
                      {form1 !== undefined && 'departmentSpecialty' in form1?.properties && (
                        <ApplicationFieldCard object={form1?.properties?.departmentSpecialty} gridStyle={style.twoCol} baseKey={'departmentSpecialty'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                      )}
                      {form1 !== undefined && (getValueByPath(form, 'basicDetails.departmentSpecialty.department') === form1.if.properties.departmentSpecialty.properties.department.const && form1.if.properties.departmentSpecialty.properties.specialty.enum?.includes(getValueByPath(form, 'basicDetails.departmentSpecialty.specialty'))) && (
                        form1 !== undefined && 'regionalCallResponsibilities' in form1?.properties && (
                          <ApplicationFieldCard object={form1?.properties?.regionalCallResponsibilities} gridStyle={''} baseKey={'regionalCallResponsibilities'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                        )
                      )}
                      {form1 !== undefined && 'billingNumber' in form1?.properties && (
                        <ApplicationFieldCard object={form1?.properties?.billingNumber} gridStyle={style.twoCol} baseKey={'billingNumber'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                      )}
                    </div>
                  }


                </div>

                {
                  form?.formSchemas?.filter(data => (data?.formCategory === 'Form' || data?.formCategory === 'Disclosure') && data?.schemaCategory !== "UploadYourDoc")?.map((data, index) => (

                    <div className={` ${style.marginTop5} ${(expand?.status && expand?.index === index + 1) ? style.tableDataStyle1 : style.tableDataStyle}`}>
                      <div className={` ${expand?.index === index + 1 ? style.tableHeaderGridStyleForm : style.tableHeaderGridStyle} ${style.marginTop10}`}>
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                          <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${form?.forms[index]?.status !== "APPROVED" ? style.greyDotStyle : style.greenDotStyle}`}></div>
                        </div>
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                          <div className={`${style.tableDataFontStyle1}`}>{data?.description}</div>
                        </div>
                        {expand?.status && expand?.index === index + 1 ? (
                          <>
                            {form?.forms[index]?.status !== "APPROVED" ? (
                              <div className={`${style.purpleButton} ${style.cursorPointer} `}>
                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`} onClick={() => handleStepsVerify(form?.forms[index]?.id)}>Verify</div>
                              </div>
                            ) : (
                              <div className={`${style.greenButton}  ${style.cursorPointer} `}>
                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>Verified</div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                              <div className={`${style.marginLeft10}${style.justifySpaceAround} ${form?.forms[index]?.status !== "APPROVED" ? style.greyDotStyle : style.greenDotStyle}`}></div>
                            </div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                              <div className={`${style.marginLeft10}${style.justifySpaceAround} ${form?.forms[index]?.status !== "APPROVED" ? style.greyDotStyle : style.greenDotStyle}`}></div>
                            </div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                              <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>{form?.forms?.filter((formData, formIndex) => formIndex === index)?.map(data => data?.uploadedFiles?.length || 0)}</div>
                            </div>
                          </>
                        )}
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                          <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                            {
                              (expand?.status && expand?.index === index + 1) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpand({ status: false, index: 0 }); setFormSchemaId('') }} />)
                                : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpand({ status: true, index: index + 1 }); setFormSchemaId(data?.id) }} />)
                            }

                          </div>
                        </div>
                      </div>
                      {expand?.status && expand?.index === index + 1 &&
                        <div className={`${style.marginTop} ${style.screenPadding}`}>
                          {renderFieldsBasedOnStep(data)}
                        </div>
                      }
                    </div>))}

              </div>

              <div>
                <div className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle1} `}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.tableHeaderTextStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.tableHeaderTextStyle}`}>Requested Form Completeness Check</div>
                  </div>
                </div>
                {form?.formSchemas?.filter(data => data?.formCategory === 'Acknowledgement')?.map((data, index) => (<div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableHeaderGridStyle1}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greyDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.tableDataFontStyle1}`}>{data?.description}</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>))}
              </div>
              <div className={style.marginBottom20}></div>
            </div>
          </div>

          <div>
            <div className={style.cardLeftStyle}>
              <div className={`${style.displayInRow}${style.marginTop20}`}>
                <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <span className={`${style.tableHeaderHeadingTextStyle}`}>Notes</span>
                    <div className={`${style.marginTop5} ${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <img
                        src={EditBlue}
                        alt="EditBlue"
                        className={style.colorFileStyle}
                      />
                    </div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${style.cardLeftStyle} ${style.marginTop20}`}>
              <div className={`${style.displayInRow}${style.marginTop20}`}>
                <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}>
                  <span className={`${style.tableHeaderHeadingTextStyle}`}>RFCs & Doc Clarification</span>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className={`${style.displayInRow}${style.marginTop20}`}>
                <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10} `}>
                  <span className={`${style.tableHeaderTextStyle1}`}>Proof of Qualifications</span>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div className={`${style.displayInRow}${style.marginTop10}`}>
                <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10} ${style.marginBottom20}`}>
                  <span className={`${style.tableHeaderTextStyle}`}>Education</span>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
              </div> */}

              {/* <div className={`${style.tableDataStyle1} ${style.tableHeaderGridStyle2}`}>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                  <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greenDotStyle}`}></div>
                </div>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                  <div className={`${style.tableDataFontStyle1}`}>Ontario Dolor Sit Amet, Consetetur Sadipscing.</div>
                </div>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                  <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                    <AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                  </div>
                </div>
              </div> */}
              {/* <div className={`${style.tableDataStyle} ${style.marginTop10}`}>
                <div className={`${style.tableHeaderGridStyle2}  ${style.marginTop10}`}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.justifySpaceAround} ${style.greenDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.tableDataFontStyle2}`}>Toronto Medical Society Amet, Consetetur Sadipscing</div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                      <RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10} `}>
                    <span className={`${style.tableHeaderTextStyle1}`}>Clarification requested</span>
                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                      <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                        <img
                          src={OutGoing}
                          alt="OutGoing"
                          className={style.colorFileStyle}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={`${style.cardInnerText} ${style.marginLeftRight20} ${style.marginTop5} `}>
                    <p className={`${style.tableHeaderTextStyle1} ${style.padding5}`}>Lorem Ipsum Dolor Sit Amet, Consetetur Sadipscing Elitr, Sed Diam Nonumy Eirmod Tempor Invidunt Ut.</p>
                  </div>
                  <div className={`${style.marginTop10} `}>
                    <div className={`${style.tableHeaderTextStyle1} ${style.marginLeft20}`}>Sent on dd/mm/yyyy, 0:00</div>
                  </div>
                  <div>
                    <div className={`${style.twoColumnGrid} ${style.marginTop20} ${style.marginLeftRight10} ${style.marginBottom20}`}>
                      <div className={`${style.buttonCardStyle1} ${style.marginLeft20} `}>
                        <div className={`${style.buttonTextStyle} ${style.alignCenter}`}>REJECT</div>
                      </div>
                      <div className={`${style.buttonCardGreyStyle} `}>
                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>ACCEPT</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className={style.marginBottom20}></div>

            </div>
          </div>


        </div >
        <div className={style.marginTop50}></div>
        {
          showApplicationDeclineDialog && (
            <ApplicationDecline getApplicationDeclineDialog={getApplicationDeclineDialog} />
          )
        }
        {showDocVerifyDialog && (
          <Dialog isOpen={showDocVerifyDialog} onClose={() => setShowDocVerifyDialog(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
              <div className={Classes.DIALOG_BODY}>
                <div className={style.spaceBetween}>
                  <div className={style.heading}>{`${form?.basicDetails?.applicant?.name?.firstName} ${form?.basicDetails?.applicant?.name?.lastName} ${file?.fileName} Preview`}</div>
                  <div className={style.displayInRow}>
                    {(file?.isVerified !== undefined && file?.isVerified) ? (
                      <div className={`${style.greenButton} ${style.cursorPointer} `}>
                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>Verified</div>
                      </div>
                    ) : (
                      <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`} onClick={() => { handleDocVerify(selectedRow?.rowId); setShowDocVerifyDialog(false) }}>Verify</div>
                      </div>
                    )}
                    <img
                      src={CrossPink}
                      alt="cross"
                      className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft20} `}
                      onClick={() => { setShowDocVerifyDialog(false) }}
                    />
                  </div>
                </div>
                <div className={style.marginTop20}>
                  <iframe src={file?.fileURL} width="100%" height="600px"></iframe>
                </div>
                <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                  <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { setShowDocVerifyDialog(false); }}>CLOSE</div>
                </div>
              </div>

            </div>
          </Dialog >
        )}
      </div >
    </>

  );
};

export default NewActiveApplication;
