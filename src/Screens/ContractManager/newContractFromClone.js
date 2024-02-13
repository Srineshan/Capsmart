import React, { useState, useEffect } from "react";
import { InputGroup, Icon, Intent, Dialog, Classes } from "@blueprintjs/core";
import AddNewContractManager from "./addNewContractManager";
import FileImg from "./../../images/fileImg.png";
import DeleteExecutedContractDialog from "./deleteExecutedContractDialog";
import NewServiceProvider from "./newServiceProvider";
import WritingFile from "./../../images/writingFile.png";
import CompletedIcon from "./../../images/completedIcon.png";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import RedWarning from "./../../images/redWarning.png";
import Tooltip from "@mui/material/Tooltip";
import ServiceSpecification from "./serviceSpecification";
import { DELETE, TenantID, GET } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import "react-datalist-input/dist/styles.css";
import Alert from "../../Components/AlertPopUp";
import ContractIdTermLimitIndividual from "./contractIdTermLimitIndividual";
import ContractedServicesProviderMultiple from "./contractedServicesProviderMultiple";
import ContractedServicesProviderIndividual from "./contractedServiceProviderIndividual";
import ContractorBusinessEntity from "./contractorBusinessEntity";
import DocumentationProofRequired from "./documentationProofRequired";
import PaymentAndCompensation from "./paymentAndCompensation";
import TimeSheetSubmissionTerms from "./timeSheetSubmissionTerms";
import TimesheetProcessingWorkflow from "./timesheetProcessingWorkflow";
import {
  validateTabs,
  validateContractIDTermLimit,
  validateContractProvider,
  validateBusinessEntity,
  validateServices,
  validateTimesheetSubmission,
  validateTimesheetProcessingWorkflow,
  validateRequestProcessingWorkflow,
} from "./contractValidation";

import style from "./index.module.scss";
import RequestProcessingWorkflow from "./requestProcessingWorkflow";
import SaveInProgressDialog from "./saveInProgressDialog";

const NewContractFromClone = ({
  contracts,
  getNewContract,
  contractType,
  selectedContract,
  selectedContractType,
  contractIdFromActive,
  getContractIdFromActive,
  method,
  isEditable,
}) => {
  console.log('contract Type', contractType)
  const contractStatus = sessionStorage.getItem("Selected Contract Status");
  const [selectContractInfo, setSelectContractInfo] = useState(contractType?.value);
  const [deleteExecutedContractDialog, setDeleteExecutedContractDialog] =
    useState(false);
  const [newServiceProviderDialog, setNewServiceProviderDialog] =
    useState(false);
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
  const [selectedField, setSelectedField] = useState({
    fieldName: "",
    empty: false,
  });
  const [selectedFileURL, setSelectedFileURL] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isTabsValid, setIsTabsValid] = useState([]);
  const [contractSelected, setContractSelected] = useState(
    contracts
      ?.filter((contract) => contract?.id === contractId)
      ?.map((data) => data)[0]
  );
  const [providerDetails, setProviderDetails] = useState();
  useEffect(() => {
    getTabDataStatus();
  }, []);

  useEffect(() => {
    getFileData();
    getEntityData();
    helpText();
  }, []);

  useEffect(() => {
    helpText();
  }, [currentPage]);

  useEffect(() => {
    getFileData();
    console.log("entered");
  }, [fileFields]);

  const getTabDataStatus = () => {
    let temp = validateTabs(contractSelected?.id);
    temp.then((value) => {
      setIsTabsValid(value);
      let temp = value?.value2;
      temp.then((response) => {
        setProviderDetails(response);
      });
    });
  };

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
    getNewContract(false);
    getContractIdFromActive("");
    sessionStorage.setItem(
      "isEditable",
      selectedContract !== "draft" ? false : true
    );
  };

  return (
    <div className={`${style.welcomePadding} ${style.addContractBody}`}>
      <div className={style.spaceBetween}>
        <p className={style.welcomeStyle}>
          {selectedContractType === "New Contract"
            ? "New Contract With No Prior Contract(s) With Entity"
            : selectedContractType === "Existing Contract"
              ? "Existing Active Contract"
              : "Contracted Services Continuation Renewal Contract"}{" "}
          <strong className={style.darkText}>
            {contractStatus === "ACTIVE" ? "( ACTIVE CONTRACT )" : ""}
          </strong>
        </p>
        <div className={style.displayInRow}>
          <img
            src={WritingFile}
            alt="Writing File"
            className={`${style.smallIcons} ${style.reduceTop10}`}
          />
          <InputGroup
            value={
              selectContractInfo === "INDIVIDUAL"
                ? "INDIVIDUAL CONTRACTOR"
                : selectContractInfo === "EMPLOYEE" ? "EMPLOYED STAFF AGREEMENT"
                  : "MULTIPLE CONTRACTORS"
            }
            readOnly
            className={`${style.contractWidth} ${style.marginLeft20} ${style.reduceTop10} ${style.marginBottom}`}
          />
          <Icon
            icon="cross"
            size={25}
            intent={Intent.DANGER}
            className={style.newContractCrossStyle}
            onClick={() => onClose()}
          />
        </div>
      </div>
      <div className={style.welcomeBorder}></div>

      <div
        className={
          contractStatus === "ACTIVE"
            ? style.newContractFromCloneGridActiveView
            : style.newContractFromCloneGrid
        }
      >
        <div className={style.cloneBlockStyle}>
          <div
            className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle
              } ${contractId !== "" ? style.completedEntityCardStyle : ""} ${currentPage === "Contract ID & Term Limit" &&
              style.selectedContractEntityStyle
              }`}
            onClick={() => {
              setCurrentPage("Contract ID & Term Limit");
              setSelectedField({ ...selectedField, fieldName: "" });
            }}
          >
            Contract ID & Term Limit
            {contractId !== "" && (
              <img
                src={isTabsValid?.tab1 ? CompletedIcon : RedWarning}
                alt="completed"
                className={`${style.completedIconStyle}`}
              />
            )}
          </div>
          <div
            className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle
              } ${style.marginTop10} ${contractId !== "" ? style.completedEntityCardStyle : ""
              } ${currentPage === "Contracted Services Provider(s)" &&
              style.selectedContractEntityStyle
              }`}
            onClick={() => {
              setCurrentPage("Contracted Services Provider(s)");
              setSelectedField({ ...selectedField, fieldName: "" });
            }}
          >
            {!(selectContractInfo === "EMPLOYEE" || contractSelected?.contractDetail?.contractType?.value === "EMPLOYEE") ? 'Contracted Services Provider(s)' : 'Service Provider'}
            {contractId !== "" && (
              <img
                src={
                  providerDetails
                    ?.filter((data) => data?.[1]?.length !== 0)
                    ?.map((data) => data)?.length === 0
                    ? CompletedIcon
                    : RedWarning
                }
                alt="completed"
                className={`${style.completedIconStyle}`}
              />
            )}
          </div>
          {!(selectContractInfo === "EMPLOYEE" || contractSelected?.contractDetail?.contractType?.value === "EMPLOYEE") && < div
            className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle
              } ${style.marginTop10} ${contractId !== "" ? style.completedEntityCardStyle : ""
              } ${currentPage === "Contractor Business Entity" &&
              style.selectedContractEntityStyle
              }`}
            onClick={() => {
              setCurrentPage("Contractor Business Entity");
              setSelectedField({ ...selectedField, fieldName: "" });
            }}
          >
            Contractor Business Entity
            {contractId !== "" && (
              <img
                src={isTabsValid?.tab3 ? CompletedIcon : RedWarning}
                alt="completed"
                className={`${style.completedIconStyle}`}
              />
            )}
          </div>}
          {
            // <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage5 ? style.completedEntityCardStyle : ''} ${currentPage === "Documentation Proof Required" && style.selectedContractEntityStyle}`}
            // onClick={() => {setCurrentPage('Documentation Proof Required'); setSelectedField('');}}>
            //     Documentation Proof Required
            //     {viewPage5 && (
            //         <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
            //     )}
            // </div>
          }
          <div
            className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle
              } ${style.marginTop10} ${contractId !== "" ? style.completedEntityCardStyle : ""
              } ${currentPage === "Contracted Services Specification" &&
              style.selectedContractEntityStyle
              }`}
            onClick={() => {
              setCurrentPage("Contracted Services Specification");
              setSelectedField({ ...selectedField, fieldName: "" });
            }}
          >
            {!(selectContractInfo === "EMPLOYEE" || contractSelected?.contractDetail?.contractType?.value === "EMPLOYEE") ? 'Contracted Services Specification' : 'Services Specified'}
            {contractId !== "" && (
              <img
                src={isTabsValid?.tab4 ? CompletedIcon : RedWarning}
                alt="completed"
                className={`${style.completedIconStyle}`}
              />
            )}
          </div>
          {/* <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage6 ? style.completedEntityCardStyle : addOn ? style.selectedContractEntityStyle : ''}`}
                    onClick={() => setCurrentPage('Contracted Add on service specification')}>
                        Contracted Add on service specification
                        {viewPage6 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div> */}

          {(!(selectContractInfo === "EMPLOYEE" || contractSelected?.contractDetail?.contractType?.value === "EMPLOYEE") || (contractSelected?.contractedServices?.length || 0 !== 0)) && (<> < div
            className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle
              } ${style.marginTop10} ${contractId !== "" ? style.completedEntityCardStyle : ""
              } ${currentPage === "Timesheet Submission Terms" &&
              style.selectedContractEntityStyle
              }`}
            onClick={() => {
              setCurrentPage("Timesheet Submission Terms");
              setSelectedField({ ...selectedField, fieldName: "" });
            }}
          >
            Timesheet Submission Terms
            {contractId !== "" && (
              <img
                src={isTabsValid?.tab5 ? CompletedIcon : RedWarning}
                alt="completed"
                className={`${style.completedIconStyle}`}
              />
            )}
          </div>
            <div
              className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle
                } ${style.marginTop10} ${contractId !== "" ? style.completedEntityCardStyle : ""
                } ${currentPage === "Payment & Compensation" &&
                style.selectedContractEntityStyle
                }`}
              onClick={() => {
                setCurrentPage("Payment & Compensation");
                setSelectedField({ ...selectedField, fieldName: "" });
              }}
            >
              Payment & Compensation
              {contractId !== "" && (
                <img
                  src={isTabsValid?.tab6 ? CompletedIcon : RedWarning}
                  alt="completed"
                  className={`${style.completedIconStyle}`}
                />
              )}
            </div>
            <div
              className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle
                } ${style.marginTop10} ${contractId !== "" ? style.completedEntityCardStyle : ""
                } ${currentPage === "Timesheet Processing Workflow" &&
                style.selectedContractEntityStyle
                }`}
              onClick={() => {
                setCurrentPage("Timesheet Processing Workflow");
                setSelectedField({ ...selectedField, fieldName: "" });
              }}
            >
              Timesheet Processing Workflow
              {contractId !== "" && (
                <img
                  src={isTabsValid?.tab7 ? CompletedIcon : RedWarning}
                  alt="completed"
                  className={`${style.completedIconStyle}`}
                />
              )}
            </div>
          </>)
          }

          {/* <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${contractId !== '' ? style.completedEntityCardStyle : ''} ${currentPage === "Request Processing Workflow" && style.selectedContractEntityStyle}`}
                        onClick={() => {
                            setCurrentPage('Request Processing Workflow');
                            setSelectedField({ ...selectedField, fieldName: '' });
                        }}>
                        Request Processing Workflow
                        {contractId !== '' && (
                            <img src={isTabsValid?.tab8 ? CompletedIcon : RedWarning} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div> */}
        </div>


        {(currentPage === "Request Processing Workflow" && (contractSelected?.contractedServices?.length !== 0 && contractSelected?.contractDetail?.contractType?.value !== "EMPLOYEE")) ? (
          <RequestProcessingWorkflow
            getViewPage10={getViewPage10}
            getCurrentPage={getCurrentPage}
            selectContractInfo={selectContractInfo}
            contractId={contractId}
            contractName={contractName}
            isEditable={isEditable}
            contract={contractSelected}
            getTabDataStatus={getTabDataStatus}
          />
        ) : (currentPage === "Timesheet Processing Workflow" && (contractSelected?.contractedServices?.length !== 0 && contractSelected?.contractDetail?.contractType?.value !== "EMPLOYEE")) ? (
          <TimesheetProcessingWorkflow
            getViewPage9={getViewPage9}
            getCurrentPage={getCurrentPage}
            selectContractInfo={selectContractInfo}
            contractId={contractId}
            contractName={contractName}
            contract={contractSelected}
            isEditable={isEditable}
            getTabDataStatus={getTabDataStatus}
            getShowAlert={getShowAlert}
          />
        ) : (currentPage === "Timesheet Submission Terms" && (contractSelected?.contractedServices?.length !== 0 || contractSelected?.contractDetail?.contractType?.value !== "EMPLOYEE")) ? (
          <TimeSheetSubmissionTerms
            getViewPage7={getViewPage7}
            getCurrentPage={getCurrentPage}
            contractId={contractId}
            isMultiSiteEntity={isMultiSiteEntity}
            getShowAlert={getShowAlert}
            isEditable={isEditable}
            getTabDataStatus={getTabDataStatus}
          />
        ) : (currentPage === "Payment & Compensation" && (contractSelected?.contractedServices?.length !== 0 || contractSelected?.contractDetail?.contractType?.value !== "EMPLOYEE")) ? (
          <PaymentAndCompensation
            selectContractInfo={selectContractInfo}
            getViewPage8={getViewPage8}
            getCurrentPage={getCurrentPage}
            contractId={contractId}
            checkFieldAndPopAlert={checkFieldAndPopAlert}
            getShowAlert={getShowAlert}
            isEditable={isEditable}
            getTabDataStatus={getTabDataStatus}
          />
        ) : currentPage === "Contracted Add on service specification" ||
          currentPage === "Contracted Services Specification" ? (
          <ServiceSpecification
            getViewPage6={getViewPage6}
            getAddon={getAddOn}
            contractId={contractId}
            getCurrentPage={getCurrentPage}
            selectContractInfo={selectContractInfo}
            isMultiSiteEntity={isMultiSiteEntity}
            isEditable={isEditable}
            getTabDataStatus={getTabDataStatus}
          />
        ) : currentPage === "Documentation Proof Required" ? (
          <DocumentationProofRequired
            getViewPage5={getViewPage5}
            getCurrentPage={getCurrentPage}
            contractId={contractId}
            isMultipleContract={isMultipleContract}
            isMultiSiteEntity={isMultiSiteEntity}
            isEditable={isEditable}
            getTabDataStatus={getTabDataStatus}
          />
        ) : currentPage === "Contractor Business Entity" ? (
          <ContractorBusinessEntity
            getViewPage5={getViewPage5}
            getCurrentPage={getCurrentPage}
            selectContractInfo={selectContractInfo}
            contractId={contractId}
            contractName={contractName}
            checkFieldAndPopAlert={checkFieldAndPopAlert}
            getShowAlert={getShowAlert}
            isEditable={isEditable}
            getTabDataStatus={getTabDataStatus}
          />
        ) : selectContractInfo === "INDIVIDUAL" &&
          currentPage === "Contracted Services Provider(s)" ? (
          <ContractedServicesProviderIndividual
            getViewPage3={getViewPage3}
            getCurrentPage={getCurrentPage}
            contractId={contractId}
            contracts={contracts}
            contractName={contractName}
            checkFieldAndPopAlert={checkFieldAndPopAlert}
            getShowAlert={getShowAlert}
            isEditable={isEditable}
            getTabDataStatus={getTabDataStatus}
          />
        ) : currentPage === "Contract ID & Term Limit" ? (
          <ContractIdTermLimitIndividual
            contracts={contracts}
            getViewPage1={getViewPage1}
            getViewPage2={getViewPage2}
            contractType={contractType}
            selectedContractType={selectedContractType}
            getContractId={getContractId}
            getCurrentPage={getCurrentPage}
            setFileFields={getFileFields}
            contractIdFromActive={contractId}
            setName={getContractName}
            method={method}
            fileData={fileFields}
            isMultiSiteEntity={isMultiSiteEntity}
            checkFieldAndPopAlert={checkFieldAndPopAlert}
            getShowAlert={getShowAlert}
            isEditable={isEditable}
            getTabDataStatus={getTabDataStatus}
          />
        ) : selectContractInfo === "MULTIPLE" &&
          currentPage === "Contracted Services Provider(s)" ? (
          <ContractedServicesProviderMultiple
            getNewServiceProviderDialog={getNewServiceProviderDialog}
            newServiceProviderDialog={newServiceProviderDialog}
            getViewPage1={getViewPage1}
            getViewPage2={getViewPage2}
            getViewPage3={getViewPage3}
            getCurrentPage={getCurrentPage}
            contractId={contractId}
            contractName={contractName}
            isEditable={isEditable}
            getTabDataStatus={getTabDataStatus}
          />
        )
          : selectContractInfo === "EMPLOYEE" &&
            currentPage === "Contracted Services Provider(s)" ? (
            <ContractedServicesProviderIndividual
              getViewPage3={getViewPage3}
              getCurrentPage={getCurrentPage}
              contractId={contractId}
              contracts={contracts}
              contractName={contractName}
              checkFieldAndPopAlert={checkFieldAndPopAlert}
              getShowAlert={getShowAlert}
              isEditable={isEditable}
              getTabDataStatus={getTabDataStatus}
            />
          ) : (
            ""
          )}
        {contractStatus !== "ACTIVE" && (
          <div className={style.cloneBlockStyle}>
            {contractName !== "" && (
              <div>
                <p className={`${style.smallHeadingStyle}`}>{contractName}</p>
                <div className={style.welcomeBorder}></div>
              </div>
            )}
            <p className={`${style.smallHeadingStyle}`}>{currentPage}</p>
            <div className={style.welcomeBorder}></div>
            <div>
              {selectedField?.fieldName === "" ? (
                <p className={`${style.blackText} ${style.leftAlign}`}>
                  {helpTextData?.[currentPage]?.description || ""}
                </p>
              ) : (
                <div>
                  <p className={`${style.blackText} ${style.leftAlign}`}>
                    <strong>{selectedField?.fieldName}</strong>
                  </p>
                  <p className={`${style.blackText} ${style.leftAlign}`}>
                    {helpTextData?.[selectedField?.fieldName]?.description ||
                      ""}
                  </p>
                </div>
              )}
            </div>

            {!selectedField?.empty &&
              helpTextData?.[selectedField?.fieldName]?.skipDataAlerts && (
                <>
                  {
                    <div className={style.validationAlert}>
                      <div className={style.displayInRow}>
                        <div>
                          <p
                            className={`${style.blackText} ${style.leftAlign}`}
                          >
                            {
                              helpTextData?.[selectedField?.fieldName]
                                ?.skipDataAlerts
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  }
                </>
              )}

            {fileItems?.length !== 0 ? (
              <>
                <p
                  className={`${style.smallHeadingStyle} ${style.marginTop20}`}
                >
                  Reference Contract Documents
                </p>
                <div className={style.welcomeBorder}></div>
                {fileItems}
              </>
            ) : (
              <>
                <p
                  className={`${style.smallHeadingStyle} ${style.marginTop20}`}
                >
                  Reference Contract Documents
                </p>
                <div className={style.welcomeBorder}></div>
                <div>
                  <p className={`${style.blackText}`}>
                    Contract Documents Not Uploaded
                  </p>
                  {currentPage !== "Contract ID & Term Limit" && (
                    <p
                      className={`${style.cursorPointer} ${style.blueColor}`}
                      onClick={() => setCurrentPage("Contract ID & Term Limit")}
                    >
                      Click to Upload your documents
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {
        deleteExecutedContractDialog && (
          <Dialog
            isOpen={getDeleteExecutedContractDialog}
            onClose={() => getDeleteExecutedContractDialog(false)}
            className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}
          >
            <div
              className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}
            >
              <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Delete Executed Contract</p>
                <Icon
                  icon="cross"
                  size={20}
                  intent={Intent.DANGER}
                  className={style.crossStyle}
                  onClick={() => getDeleteExecutedContractDialog(false)}
                />
              </div>
              <div className={style.extensionBorder}></div>
              <p
                className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}
              >
                Delete Executed File Data
              </p>
              <div className={`${style.positionCenter} ${style.marginTop20}`}>
                <button
                  className={`${style.cloneOutlinedButton} ${style.cursorPointer}`}
                  onClick={() => getDeleteExecutedContractDialog(false)}
                >
                  NO
                </button>
                <button
                  className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`}
                  onClick={handleFileDeletion}
                >
                  YES
                </button>
              </div>
            </div>
          </Dialog>
        )
      }
      {
        newServiceProviderDialog && (
          <NewServiceProvider
            getNewServiceProviderDialog={getNewServiceProviderDialog}
            contractId={contractId}
            contractName={contractName}
          />
        )
      }
      {/* {showAlert && (
        <Alert
          getShowAlertDialog={getShowAlert}
          header={"SAVE-IN PROGRESS"}
          content={
            "Your contract will be saved in draft, you can edit it later..."
          }
          redirectTo={"contracts"}
        />
      )} */}

      {
        showAlert && (
          <SaveInProgressDialog
            getSaveInProgressDialog={getShowAlert}
            header={"SAVE-IN PROGRESS"}
            redirectTo={"contracts"}
            contractType={contractType}
            contractId={contractId}
          />
        )
      }
    </div >
  );
};

export default NewContractFromClone;
