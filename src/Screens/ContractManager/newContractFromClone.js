import React, { useState, useEffect } from 'react';
import { InputGroup, Icon, Intent, Dialog, Classes } from '@blueprintjs/core';
import AddNewContractManager from './addNewContractManager';
import Alert from './alert';
import DeleteExecutedContractDialog from './deleteExecutedContractDialog';
import NewServiceProvider from './newServiceProvider';
import WritingFile from './../../images/writingFile.png';
import CompletedIcon from './../../images/completedIcon.png';
import RedWarning from './../../images/redWarning.png';
import ServiceSpecification from './serviceSpecification';
import {DELETE, TenantID, GET} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import 'react-datalist-input/dist/styles.css';
import ContractIdTermLimitIndividual from './contractIdTermLimitIndividual';
import ContractedServicesProviderMultiple from './contractedServicesProviderMultiple';
import ContractedServicesProviderIndividual from './contractedServiceProviderIndividual';
import ContractorBusinessEntity from './contractorBusinessEntity';
import DocumentationProofRequired from './documentationProofRequired';
import PaymentAndCompensation from './paymentAndCompensation';
import TimeSheetSubmissionTerms from './timeSheetSubmissionTerms';
import TimesheetProcessingWorkflow from './timesheetProcessingWorkflow';

import style from './index.module.scss';
import RequestProcessingWorkflow from './requestProcessingWorkflow';

const NewContractFromClone = ({contracts, getNewContract, contractType, selectedContract, selectedContractType, contractIdFromActive, getContractIdFromActive, method}) => {
    const [selectContractInfo, setSelectContractInfo] = useState(contractType);
    const [deleteExecutedContractDialog, setDeleteExecutedContractDialog] = useState(false);
    const [newServiceProviderDialog, setNewServiceProviderDialog] = useState(false);
    const [showAlertDialog,setShowAlertDialog] = useState(false);
    const [addOn, setAddOn] = useState(false);
    const [viewPage1, setViewPage1] = useState(true);
    const [viewPage2, setViewPage2] = useState(false);
    const [viewPage3, setViewPage3] = useState(false);
    const [viewPage4, setViewPage4] = useState(false);
    const [viewPage5, setViewPage5] = useState(false);
    const [viewPage6, setViewPage6] = useState(false);
    const [viewPage7, setViewPage7] = useState(false);
    const [viewPage8, setViewPage8] = useState(false);
    const [currentPage, setCurrentPage] = useState('Contract ID & Term Limit');
    const [isMultipleContract, setIsMultipleContract] = useState(false);
    const [contractId,setContractId] = useState(contractIdFromActive);
    const [fileFields,setFileFields] = useState([]);
    const [contractName, setContractName] = useState('');
    const [fileDeletionIndex,setFileDeletionIndex] = useState();
    const [fileItems,setFileItems] = useState([]);
    const [isMultiSiteEntity,setIsMultiSiteEntity] = useState(false);


    useEffect(()=>{
        getFileData();
        getEntityData();
    },[]);

    useEffect(()=>{
      getFileData();
    }, [fileFields])

    const getEntityData = async() => {
      const {data: data} = await GET(`entity-service/entity/${TenantID}`);
      setIsMultiSiteEntity(data?.multiSiteEntity);
    }


    const getFileData = () => {
      let temp = [];
      for(let i=0; i< fileFields?.length || 0 ;i++){
        temp[i] = (
          <div className={`${style.documentCard} ${style.marginTop10}`}>
              <div>
                  <div>
                      <p className={`${style.blackText} ${style.leftAlign}`}><strong>{fileFields?.[i]?.type}</strong></p>
                      <div className={style.spaceBetween}>
                          <p className={`${style.blackText} ${style.leftAlign}`}>{fileFields?.[i]?.name}</p>
                          <div>
                              <Icon icon="trash" className={style.trashStyle} size={10} onClick={() => {getDeleteExecutedContractDialog(true);setFileDeletionIndex(i);}}  />
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

    const getShowAlertDialog = (value) => {
        setShowAlertDialog(value);
    }

    const getDeleteExecutedContractDialog = (value) => {
        setDeleteExecutedContractDialog(value);
    }

    const getAddOn = (value) => {
        setAddOn(value);
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
        setCurrentPage('Payment & Compensation');
    }

    const getViewPage7 = (value) => {
        setViewPage7(value);
    }

    const getViewPage8 = (value) => {
        setViewPage8(value);
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

    const handleFileDeletion = async() => {
      let fileIdToDelete = fileFields?.filter((data,index)=>index === fileDeletionIndex)?.map(data=>data?.id)[0];
      setFileFields(fileFields?.filter((data,index)=>index !== fileDeletionIndex)?.map(data=>data));
      if(fileIdToDelete){
        await DELETE(`contract-managment-service/contracts/contractFile/${fileIdToDelete}`)
        .then(response=>{
          SuccessToaster('Document Deleted Successfully');
        })
      }
      getDeleteExecutedContractDialog(false);
      setFileDeletionIndex();
    }

    return(
        <div className={`${style.welcomePadding} ${style.addContractBody}`}>
            <div className={style.spaceBetween}>
                <p className={style.welcomeStyle}>{selectedContractType === "New Contract" ? 'New Contract With No Prior Contract(s) With Entity' : 'Contracted Services Continuation Renewal Contract'}</p>
                <div className={style.displayInRow}>
                    <img src={WritingFile} alt="Writing File" className={`${style.smallIcons} ${style.reduceTop10}`} />
                    <InputGroup
                        value={selectContractInfo === 'INDIVIDUAL' ? 'INDIVIDUAL CONTRACTOR' : 'MULTIPLE CONTRACTORS'}
                        className={`${style.contractWidth} ${style.marginLeft20} ${style.reduceTop10} ${style.marginBottom}`} />
                    <Icon icon="cross" size={25} intent={Intent.DANGER} className={style.newContractCrossStyle} onClick={() => {getNewContract(false);getContractIdFromActive('');}}  />
                </div>
            </div>
            <div className={style.welcomeBorder}></div>

            <div className={style.newContractFromCloneGrid}>
                <div className={style.cloneBlockStyle}>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${viewPage2 ? style.completedEntityCardStyle : ''} ${currentPage === "Contract ID & Term Limit" && style.selectedContractEntityStyle}`}
                    onClick={() => setCurrentPage('Contract ID & Term Limit')}>
                        Contract ID & Term Limit
                        {viewPage2 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage3 ? style.completedEntityCardStyle : ''} ${currentPage === "Contracted Services Provider(s)" && style.selectedContractEntityStyle}`}
                    onClick={() => setCurrentPage('Contracted Services Provider(s)')}>
                        Contracted Services Provider(s)
                        {viewPage3 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage4 ? style.completedEntityCardStyle : ''} ${currentPage === "Contractor Business Entity" && style.selectedContractEntityStyle}`}
                    onClick={() => setCurrentPage('Contractor Business Entity')}>
                        Contractor Business Entity
                        {viewPage4 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage5 ? style.completedEntityCardStyle : ''} ${currentPage === "Documentation Proof Required" && style.selectedContractEntityStyle}`}
                    onClick={() => setCurrentPage('Documentation Proof Required')}>
                        Documentation Proof Required
                        {viewPage5 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${((viewPage5 && addOn) || viewPage6) ? style.completedEntityCardStyle : ''} ${currentPage === "Contracted Services Specification" && style.selectedContractEntityStyle}`}
                    onClick={() => setCurrentPage('Contracted Services Specification')}>
                        Contracted Services Specification
                        {((viewPage5 && addOn) || viewPage6) && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    {/* <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage6 ? style.completedEntityCardStyle : addOn ? style.selectedContractEntityStyle : ''}`}
                    onClick={() => setCurrentPage('Contracted Add on service specification')}>
                        Contracted Add on service specification
                        {viewPage6 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div> */}
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage7 ? style.completedEntityCardStyle : ''} ${currentPage === "Payment & Compensation" && style.selectedContractEntityStyle}`}
                    onClick={() => setCurrentPage('Payment & Compensation')}>
                        Payment & Compensation
                        {viewPage7 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage8 ? style.completedEntityCardStyle : ''} ${currentPage === "Timesheet Submission Terms" && style.selectedContractEntityStyle}`}
                    onClick={() => setCurrentPage('Timesheet Submission Terms')}>
                        Timesheet Submission Terms
                        {viewPage8 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${currentPage === "Timesheet Processing Workflow" && style.selectedContractEntityStyle}`}
                    onClick={() => setCurrentPage('Timesheet Processing Workflow')}>
                        Timesheet Processing Workflow
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${currentPage === "Request Processing Workflow" && style.selectedContractEntityStyle}`}
                    onClick={() => setCurrentPage('Request Processing Workflow')}>
                        Request Processing Workflow
                    </div>
                </div>
                {currentPage === "Request Processing Workflow" ? (
                    <RequestProcessingWorkflow
                    getViewPage8={getViewPage8}
                    getCurrentPage={getCurrentPage}
                    selectContractInfo={selectContractInfo}
                    contractId = {contractId}
                    contractName={contractName}
                     />
                ) : currentPage === "Timesheet Processing Workflow" ? (
                    <TimesheetProcessingWorkflow
                    getViewPage8={getViewPage8}
                    getCurrentPage={getCurrentPage}
                    selectContractInfo={selectContractInfo}
                    contractId = {contractId}
                    contractName={contractName}
                     />
                ) : currentPage === "Timesheet Submission Terms"  ? (
                    <TimeSheetSubmissionTerms
                    getViewPage8={getViewPage8}
                    getCurrentPage={getCurrentPage}
                    contractId = {contractId}/>
                ) : currentPage === "Payment & Compensation"  ? (
                    <PaymentAndCompensation
                    selectContractInfo={selectContractInfo}
                    getViewPage7={getViewPage7}
                    getCurrentPage={getCurrentPage}
                    contractId = {contractId}
                     />
                ) : (currentPage === "Contracted Add on service specification" || currentPage === "Contracted Services Specification")  ?
                  <ServiceSpecification getViewPage6={getViewPage6} getAddon={getAddOn} contractId = {contractId} getCurrentPage={getCurrentPage} selectContractInfo={selectContractInfo}/>
                  :currentPage === "Documentation Proof Required"  ? (
                    <DocumentationProofRequired
                    getViewPage5={getViewPage5}
                    getCurrentPage={getCurrentPage}
                    contractId = {contractId}
                    isMultipleContract={isMultipleContract}
                    isMultiSiteEntity={isMultiSiteEntity}
                     />
                ) : currentPage === "Contractor Business Entity"  ? (
                    <ContractorBusinessEntity
                    getViewPage4={getViewPage4}
                    getCurrentPage={getCurrentPage}
                    selectContractInfo={selectContractInfo}
                    contractId = {contractId}
                    contractName={contractName}
                    />
                )
                : selectContractInfo === "INDIVIDUAL" && currentPage === "Contracted Services Provider(s)"  ? (
                    <ContractedServicesProviderIndividual
                    getViewPage3={getViewPage3}
                    getCurrentPage={getCurrentPage}
                    contractType = {contractType}
                    contractId = {contractId}
                    contracts={contracts}/>
                ) : (currentPage === "Contract ID & Term Limit") ? (
                    <ContractIdTermLimitIndividual
                    getViewPage1={getViewPage1}
                    getViewPage2={getViewPage2}
                    contractType = {contractType}
                    selectedContractType = {selectedContractType}
                    getContractId={getContractId}
                    getCurrentPage={getCurrentPage}
                    setFileFields={getFileFields}
                    contractIdFromActive={contractId}
                    setName={getContractName}
                    method={method}
                    fileData={fileFields}
                    isMultiSiteEntity={isMultiSiteEntity}
                    />
                ) : (selectContractInfo === "MULTIPLE" && currentPage === "Contracted Services Provider(s)") ? (
                    <ContractedServicesProviderMultiple
                    getNewServiceProviderDialog={getNewServiceProviderDialog}
                    getViewPage1={getViewPage1}
                    getViewPage2={getViewPage2}
                    getViewPage3={getViewPage3}
                    getCurrentPage={getCurrentPage}
                    contractId={contractId}
                    contractName={contractName}/>

                ) : ''}
                <div className={style.cloneBlockStyle}>
                    <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Identification Information</p>
                    <div className={style.welcomeBorder}></div>
                    <p className={style.descriptionStyle}>
                    {currentPage}
                    </p>
                    {
                      // <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Activity Performed</p>
                      // <div className={style.welcomeBorder}></div>
                      // {viewPage1 && !viewPage2 && (
                      //     <div className={style.validationAlert}>
                      //         <div className={style.displayInRow}>
                      //             <div>
                      //                 <p className={`${style.blackText} ${style.leftAlign}`}><strong>Text to Alert User</strong></p>
                      //                 <p className={`${style.blackText} ${style.leftAlign}`}>This area will display specific alerts for the users</p>
                      //             </div>
                      //         </div>
                      //     </div>
                      // )}
                    }

                    {fileItems?.length !== 0 &&
                      <>
                        <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Reference Contract Documents</p>
                        <div className={style.welcomeBorder}></div>
                        {fileItems}
                      </>
                    }

                </div>
            </div>
            {deleteExecutedContractDialog && (
              <Dialog isOpen={getDeleteExecutedContractDialog} onClose={() => getDeleteExecutedContractDialog(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                  <div className={style.spaceBetween}>
                      <p className={style.extensionStyle}>Delete Executed Contract</p>
                      <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getDeleteExecutedContractDialog(false)}  />
                  </div>
                  <div className={style.extensionBorder}></div>
                  <p className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}>
                  Delete Executed File Data
                  </p>
                  <div className={`${style.positionCenter} ${style.marginTop20}`}>
                      <button className={`${style.cloneOutlinedButton} ${style.cursorPointer}`} onClick={()=>getDeleteExecutedContractDialog(false)}>NO</button>
                      <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`} onClick={handleFileDeletion}>YES</button>
                  </div>
                </div>
              </Dialog>
              )}
            {newServiceProviderDialog && (
                <NewServiceProvider getNewServiceProviderDialog={getNewServiceProviderDialog} contractId={contractId} contractType = {contractType} contractName={contractName}/>
            )}
            {showAlertDialog && (
              <Alert getShowAlertDialog={getShowAlertDialog} isMultipleContract={isMultipleContract} contractId={contractId}/>
            )}
        </div>
    )
}

export default NewContractFromClone;
