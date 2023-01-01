import React, { useState, useEffect } from 'react';
import { InputGroup, Icon, Intent, Dialog, Classes } from '@blueprintjs/core';
import AddNewContractManager from './addNewContractManager';
import FileImg from './../../images/fileImg.png';
import DeleteExecutedContractDialog from './deleteExecutedContractDialog';
import NewServiceProvider from './newServiceProvider';
import WritingFile from './../../images/writingFile.png';
import CompletedIcon from './../../images/completedIcon.png';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import RedWarning from './../../images/redWarning.png';
import ServiceSpecification from './serviceSpecification';
import { DELETE, TenantID, GET } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import 'react-datalist-input/dist/styles.css';
import Alert from '../../Components/AlertPopUp';
import ContractIdTermLimitIndividual from './contractIdTermLimitIndividual';
import ContractedServicesProviderMultiple from './contractedServicesProviderMultiple';
import ContractedServicesProviderIndividual from './contractedServiceProviderIndividual';
import ContractorBusinessEntity from './contractorBusinessEntity';
import DocumentationProofRequired from './documentationProofRequired';
import PaymentAndCompensation from './paymentAndCompensation';
import TimeSheetSubmissionTerms from './timeSheetSubmissionTerms';
import TimesheetProcessingWorkflow from './timesheetProcessingWorkflow';
import {validateTabs, validateContractIDTermLimit, validateContractProvider, validateBusinessEntity, validateServices, validateTimesheetSubmission, validateTimesheetProcessingWorkflow, validateRequestProcessingWorkflow} from './contractValidation';

import style from './index.module.scss';
import RequestProcessingWorkflow from './requestProcessingWorkflow';

const NewContractFromClone = ({ contracts, getNewContract, contractType, selectedContract, selectedContractType, contractIdFromActive, getContractIdFromActive, method, isEditable }) => {
    const [selectContractInfo, setSelectContractInfo] = useState(contractType);
    const [deleteExecutedContractDialog, setDeleteExecutedContractDialog] = useState(false);
    const [newServiceProviderDialog, setNewServiceProviderDialog] = useState(false);
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
    const [currentPage, setCurrentPage] = useState('Contract ID & Term Limit');
    const [isMultipleContract, setIsMultipleContract] = useState(false);
    const [contractId, setContractId] = useState(contractIdFromActive);
    const [fileFields, setFileFields] = useState([]);
    const [contractName, setContractName] = useState('');
    const [fileDeletionIndex, setFileDeletionIndex] = useState();
    const [fileItems, setFileItems] = useState([]);
    const [isMultiSiteEntity, setIsMultiSiteEntity] = useState(false);
    const [helpTextData, setHelpTextData] = useState();
    const [selectedField, setSelectedField] = useState('');
    const [selectedFileURL, setSelectedFileURL] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [isTabsValid, setIsTabsValid] = useState([]);
    const [contractSelected, setContractSelected] = useState(contracts?.filter(contract=>contract?.id === contractId)?.map(data=>data)[0]);
    const [providerDetails, setProviderDetails] = useState();
    useEffect(()=>{
      getTabDataStatus();
    }, []);

    useEffect(() => {
        getFileData();
        getEntityData();
        helpText();
    }, []);

    useEffect(() => {
        helpText();
    }, [currentPage])

    useEffect(() => {
        getFileData();
    }, [fileFields])

    const getTabDataStatus = () => {
      let temp = validateTabs(contractSelected?.id);
      temp.then(value=>{
        setIsTabsValid(value);
        let temp = value?.value2;
        temp.then(response=>{
          console.log('value testing', response);
          setProviderDetails(response);
        })
      });
    }
    const getSelectedField = (value) => {
        setSelectedField(value)
    }

    const helpText = async () => {
        const { data: data } = await GET(`contract-managment-service/helpText?tabName=${encodeURIComponent(currentPage)}`);
        setHelpTextData(data?.dataElement);
    }

    const getEntityData = async () => {
        const { data: data } = await GET(`entity-service/entity/${TenantID}`);
        setIsMultiSiteEntity(data?.multiSiteEntity);
    }

    console.log('contractId', contractId);


    const getFileData = () => {
        let temp = [];
        for (let i = 0; i < fileFields?.length || 0; i++) {
            temp[i] = (
                <div className={`${style.documentCard} ${style.marginTop10}`}>
                    <div className={`${style.documentGrid}`}>
                        <a className={style.documentText} href={fileFields?.[i]?.filePath} target="_blank">
                            <ArticleOutlinedIcon sx={{ color: '#b0a9ef', fontSize: 35 }} onClick={() => { setSelectedFileURL(fileFields?.[i]?.filePath) }} />
                        </a>
                        <div className={style.marginTop}>
                            <p className={`${style.documentText} ${style.leftAlign}`}><strong>{fileFields?.[i]?.type}</strong></p>
                            <div className={style.spaceBetween}>
                                <p className={`${style.documentText} ${style.leftAlign}`}><strong>{fileFields?.[i]?.fileName}</strong></p>
                                <div onClick={() => { getDeleteExecutedContractDialog(true); setFileDeletionIndex(i); }} className={style.floatRight}>
                                    <DeleteOutlineIcon sx={{ color: '#F94848' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        setFileItems(temp);
    }

    const getContractId = (value) => {
        setContractId(value);
    }

    const getNewServiceProviderDialog = (value) => {
        setNewServiceProviderDialog(value);
    }

    const getDeleteExecutedContractDialog = (value) => {
        setDeleteExecutedContractDialog(value);
    }

    const getAddOn = (value) => {
        setAddOn(value);
    }

    const getShowAlert = (value, type='cross') => {
      setShowAlert(value);
      if(!value && type === 'ok'){
        getNewContract(false);
       getContractIdFromActive('');
      }
    }

    const getViewPage1 = (value) => {
        setViewPage1(value);
    }

    const getViewPage2 = (value) => {
        setViewPage2(value);
    }

    const getViewPage3 = (value) => {
        setViewPage3(value);
    }

    const getViewPage4 = (value) => {
        setViewPage4(value);
    }

    const getViewPage5 = (value) => {
        setViewPage5(value);
    }

    const getViewPage6 = (value) => {
        setViewPage6(value);
    }

    const getViewPage7 = (value) => {
        setViewPage7(value);
    }

    const getViewPage8 = (value) => {
        setViewPage8(value);
    }

    const getViewPage9 = (value) => {
        setViewPage9(value);
    }

    const getViewPage10 = (value) => {
        setViewPage10(value);
    }

    const getCurrentPage = (value) => {
        setCurrentPage(value);
    }

    const getFileFields = (value) => {
        setFileFields(value);
        getFileData();
    }

    const getContractName = (value) => {
        setContractName(value);
    }

    useEffect(() => {
        setIsMultipleContract(selectContractInfo === "MULTIPLE" ? true : false);
    }, [selectContractInfo]);

    const handleFileDeletion = async () => {
        let fileIdToDelete = fileFields?.filter((data, index) => index === fileDeletionIndex)?.map(data => data?.id)[0];
        setFileFields(fileFields?.filter((data, index) => index !== fileDeletionIndex)?.map(data => data));
        if (fileIdToDelete) {
            await DELETE(`contract-managment-service/contracts/contractFile/${fileIdToDelete}`)
                .then(response => {
                    SuccessToaster('Document Deleted Successfully');
                })
        }
        getDeleteExecutedContractDialog(false);
        setFileDeletionIndex();
    }

    return (
        <div className={`${style.welcomePadding} ${style.addContractBody}`}>
            <div className={style.spaceBetween}>
                <p className={style.welcomeStyle}>{selectedContractType === "New Contract" ? 'New Contract With No Prior Contract(s) With Entity' : selectedContractType === 'Existing Contract' ? 'Existing Active Contract' : 'Contracted Services Continuation Renewal Contract'}</p>
                <div className={style.displayInRow}>
                    <img src={WritingFile} alt="Writing File" className={`${style.smallIcons} ${style.reduceTop10}`} />
                    <InputGroup
                        value={selectContractInfo === 'INDIVIDUAL' ? 'INDIVIDUAL CONTRACTOR' : 'MULTIPLE CONTRACTORS'}
                        readOnly
                        className={`${style.contractWidth} ${style.marginLeft20} ${style.reduceTop10} ${style.marginBottom}`} />
                    <Icon icon="cross" size={25} intent={Intent.DANGER} className={style.newContractCrossStyle} onClick={() => { getNewContract(false); getContractIdFromActive(''); }} />
                </div>
            </div>
            <div className={style.welcomeBorder}></div>

            <div className={style.newContractFromCloneGrid}>
                <div className={style.cloneBlockStyle}>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${contractId !== '' ? style.completedEntityCardStyle : ''} ${currentPage === "Contract ID & Term Limit" && style.selectedContractEntityStyle}`}
                        onClick={() => {
                            setCurrentPage('Contract ID & Term Limit');
                            setSelectedField('');
                        }}>
                        Contract ID & Term Limit
                        {contractId !== '' && (
                            <img src={isTabsValid?.tab1 ? CompletedIcon : RedWarning} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${contractId !== '' ? style.completedEntityCardStyle : ''} ${currentPage === "Contracted Services Provider(s)" && style.selectedContractEntityStyle}`}
                        onClick={() => { setCurrentPage('Contracted Services Provider(s)'); setSelectedField(''); }}>
                        Contracted Services Provider(s)
                        {contractId !== '' && (
                            <img src={providerDetails?.filter(data=>data?.[1]?.length !== 0)?.map(data=>data)?.length === 0 ? CompletedIcon : RedWarning} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${contractId !== '' ? style.completedEntityCardStyle : ''} ${currentPage === "Contractor Business Entity" && style.selectedContractEntityStyle}`}
                        onClick={() => { setCurrentPage('Contractor Business Entity'); setSelectedField(''); }}>
                        Contractor Business Entity
                        {contractId !== '' && (
                            <img src={isTabsValid?.tab3 ? CompletedIcon : RedWarning} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    {
                        // <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage5 ? style.completedEntityCardStyle : ''} ${currentPage === "Documentation Proof Required" && style.selectedContractEntityStyle}`}
                        // onClick={() => {setCurrentPage('Documentation Proof Required'); setSelectedField('');}}>
                        //     Documentation Proof Required
                        //     {viewPage5 && (
                        //         <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        //     )}
                        // </div>
                    }
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${contractId !== '' ? style.completedEntityCardStyle : ''} ${currentPage === "Contracted Services Specification" && style.selectedContractEntityStyle}`}
                        onClick={() => { setCurrentPage('Contracted Services Specification'); setSelectedField(''); }}>
                        Contracted Services Specification
                        {contractId !== '' &&
                            <img src={isTabsValid?.tab4 ? CompletedIcon : RedWarning} alt="completed" className={`${style.completedIconStyle}`} />
                        }
                    </div>
                    {/* <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage6 ? style.completedEntityCardStyle : addOn ? style.selectedContractEntityStyle : ''}`}
                    onClick={() => setCurrentPage('Contracted Add on service specification')}>
                        Contracted Add on service specification
                        {viewPage6 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div> */}

                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${contractId !== '' ? style.completedEntityCardStyle : ''} ${currentPage === "Timesheet Submission Terms" && style.selectedContractEntityStyle}`}
                        onClick={() => { setCurrentPage('Timesheet Submission Terms'); setSelectedField(''); }}>
                        Timesheet Submission Terms
                        {contractId !== '' && (
                            <img src={isTabsValid?.tab5 ? CompletedIcon : RedWarning} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage7 ? style.completedEntityCardStyle : ''} ${currentPage === "Payment & Compensation" && style.selectedContractEntityStyle}`}
                        onClick={() => { setCurrentPage('Payment & Compensation'); setSelectedField(''); }}>
                        Payment & Compensation
                        {viewPage8 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${contractId !== '' ? style.completedEntityCardStyle : ''} ${currentPage === "Timesheet Processing Workflow" && style.selectedContractEntityStyle}`}
                        onClick={() => { setCurrentPage('Timesheet Processing Workflow'); setSelectedField(''); }}>
                        Timesheet Processing Workflow
                        {contractId !== '' && (
                            <img src={isTabsValid?.tab7 ? CompletedIcon : RedWarning} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${contractId !== '' ? style.completedEntityCardStyle : ''} ${currentPage === "Request Processing Workflow" && style.selectedContractEntityStyle}`}
                        onClick={() => { setCurrentPage('Request Processing Workflow'); setSelectedField(''); }}>
                        Request Processing Workflow
                        {contractId !== '' && (
                            <img src={isTabsValid?.tab8 ? CompletedIcon : RedWarning} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                </div>

                {currentPage === "Request Processing Workflow" ? (
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
                ) : currentPage === "Timesheet Processing Workflow" ? (
                    <TimesheetProcessingWorkflow
                        getViewPage9={getViewPage9}
                        getCurrentPage={getCurrentPage}
                        selectContractInfo={selectContractInfo}
                        contractId={contractId}
                        contractName={contractName}
                        isEditable={isEditable}
                        getTabDataStatus={getTabDataStatus}
                    />
                ) : currentPage === "Timesheet Submission Terms" ? (
                    <TimeSheetSubmissionTerms
                        getViewPage7={getViewPage7}
                        getCurrentPage={getCurrentPage}
                        contractId={contractId}
                        isMultiSiteEntity={isMultiSiteEntity}
                        getShowAlert={getShowAlert}
                        isEditable={isEditable}
                        getTabDataStatus={getTabDataStatus}/>
                ) : currentPage === "Payment & Compensation" ? (
                    <PaymentAndCompensation
                        selectContractInfo={selectContractInfo}
                        getViewPage8={getViewPage8}
                        getCurrentPage={getCurrentPage}
                        contractId={contractId}
                        getSelectedField={getSelectedField}
                        getShowAlert={getShowAlert}
                        isEditable={isEditable}
                        getTabDataStatus={getTabDataStatus}
                    />
                ) : (currentPage === "Contracted Add on service specification" || currentPage === "Contracted Services Specification") ?
                    <ServiceSpecification getViewPage6={getViewPage6} getAddon={getAddOn} contractId={contractId} getCurrentPage={getCurrentPage} selectContractInfo={selectContractInfo} isMultiSiteEntity={isMultiSiteEntity} isEditable={isEditable}/>
                    : currentPage === "Documentation Proof Required" ? (
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
                            getSelectedField={getSelectedField}
                            getShowAlert={getShowAlert}
                            isEditable={isEditable}
                            getTabDataStatus={getTabDataStatus}
                        />
                    )
                        : selectContractInfo === "INDIVIDUAL" && currentPage === "Contracted Services Provider(s)" ? (
                            <ContractedServicesProviderIndividual
                                getViewPage3={getViewPage3}
                                getCurrentPage={getCurrentPage}
                                contractType={contractType}
                                contractId={contractId}
                                contracts={contracts}
                                contractName={contractName}
                                getSelectedField={getSelectedField}
                                getShowAlert={getShowAlert}
                                isEditable={isEditable}
                                getTabDataStatus={getTabDataStatus}
                                />
                        ) : (currentPage === "Contract ID & Term Limit") ? (
                            <ContractIdTermLimitIndividual
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
                                getSelectedField={getSelectedField}
                                getShowAlert={getShowAlert}
                                isEditable={isEditable}
                                getTabDataStatus={getTabDataStatus}
                            />
                        ) : (selectContractInfo === "MULTIPLE" && currentPage === "Contracted Services Provider(s)") ? (
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
                                getTabDataStatus={getTabDataStatus} />

                        ) : ''}
                <div className={style.cloneBlockStyle}>
                    <p className={`${style.smallHeadingStyle}`}>{currentPage}</p>
                    <div className={style.welcomeBorder}></div>
                    <div>
                        {
                            selectedField === '' ?
                                <p className={`${style.blackText} ${style.leftAlign}`}>{helpTextData?.[currentPage]?.description || ''}</p>
                                :
                                <div>
                                    <p className={`${style.blackText} ${style.leftAlign}`}><strong>{selectedField}</strong></p>
                                    <p className={`${style.blackText} ${style.leftAlign}`}>{helpTextData?.[selectedField]?.description || ''}</p>
                                </div>

                        }
                    </div>

                    {helpTextData?.[selectedField]?.skipDataAlerts !== '' && helpTextData?.[selectedField]?.skipDataAlerts &&
                      <>
                        <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Activity Performed</p>
                        <div className={style.welcomeBorder}></div>
                        {viewPage1 && !viewPage2 && (
                            <div className={style.validationAlert}>
                                <div className={style.displayInRow}>
                                    <div>
                                        <p className={`${style.blackText} ${style.leftAlign}`}><strong>Text to Alert User</strong></p>
                                        <p className={`${style.blackText} ${style.leftAlign}`}>{helpTextData?.[selectedField]?.skipDataAlerts}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        </>
                    }

                    {fileItems?.length !== 0 ?
                        <>
                            <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Reference Contract Documents</p>
                            <div className={style.welcomeBorder}></div>
                            {fileItems}
                        </>
                        :
                        <>
                            <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Reference Contract Documents</p>
                            <div className={style.welcomeBorder}></div>
                            <div>
                                <p className={`${style.blackText}`}>Contract Documents Not Uploaded</p>
                                {currentPage !== 'Contract ID & Term Limit' && <p className={`${style.cursorPointer} ${style.blueColor}`} onClick={() => setCurrentPage('Contract ID & Term Limit')}>Click to Upload your documents</p>}
                            </div>
                        </>
                    }

                </div>
            </div>
            {deleteExecutedContractDialog && (
                <Dialog isOpen={getDeleteExecutedContractDialog} onClose={() => getDeleteExecutedContractDialog(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
                    <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                        <div className={style.spaceBetween}>
                            <p className={style.extensionStyle}>Delete Executed Contract</p>
                            <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getDeleteExecutedContractDialog(false)} />
                        </div>
                        <div className={style.extensionBorder}></div>
                        <p className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}>
                            Delete Executed File Data
                        </p>
                        <div className={`${style.positionCenter} ${style.marginTop20}`}>
                            <button className={`${style.cloneOutlinedButton} ${style.cursorPointer}`} onClick={() => getDeleteExecutedContractDialog(false)}>NO</button>
                            <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`} onClick={handleFileDeletion}>YES</button>
                        </div>
                    </div>
                </Dialog>
            )}
            {newServiceProviderDialog && (
                <NewServiceProvider getNewServiceProviderDialog={getNewServiceProviderDialog} contractId={contractId} contractType={contractType} contractName={contractName}/>
            )}
            {showAlert && (
              <Alert getShowAlertDialog={getShowAlert} header={'SAVE-IN PROGRESS'} content={'Your contract will be saved in draft, you can edit it later...'} redirectTo={'contracts'}/>
            )}
        </div>
    )
}

export default NewContractFromClone;
