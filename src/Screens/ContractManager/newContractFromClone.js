import React, { useState, useEffect } from 'react';
import { InputGroup, Icon, Intent } from '@blueprintjs/core';
import AddNewContractManager from './addNewContractManager';
import Alert from './alert';
import DeleteExecutedContractDialog from './deleteExecutedContractDialog';
import NewServiceProvider from './newServiceProvider';
import WritingFile from './../../images/writingFile.png';
import CompletedIcon from './../../images/completedIcon.png';
import RedWarning from './../../images/redWarning.png';
import ServiceSpecification from './serviceSpecification';
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

const NewContractFromClone = ({getNewContract, contractType, selectedContract, selectedContractType}) => {
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

    useEffect(() => {
        setIsMultipleContract(selectContractInfo === "MULTIPLE" ? true : false);
      }, [selectContractInfo]);

    return(
        <div className={`${style.welcomePadding} ${style.addContractBody}`}>
            <div className={style.spaceBetween}>
                <p className={style.welcomeStyle}>New Contract With No Prior Contract(s) With Entity - (From Clone)</p>
                <div className={style.displayInRow}>
                    <img src={WritingFile} alt="Writing File" className={`${style.smallIcons} ${style.reduceTop10}`} />
                    <InputGroup
                        value={selectContractInfo}
                        className={`${style.contractWidth} ${style.marginLeft20} ${style.reduceTop10} ${style.marginBottom}`} />
                    <Icon icon="cross" size={25} intent={Intent.DANGER} className={style.newContractCrossStyle} onClick={() => getNewContract(false)}  />
                </div>
            </div>
            <div className={style.welcomeBorder}></div>

            <div className={style.newContractFromCloneGrid}>
                <div className={style.cloneBlockStyle}>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${viewPage2 ? style.completedEntityCardStyle : viewPage1 ? style.selectedContractEntityStyle : ''}`}>
                        Contract ID & Term Limit
                        {viewPage2 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage3 ? style.completedEntityCardStyle : viewPage2 ? style.selectedContractEntityStyle : ''}`}>
                        Contracted Services Provider(s)
                        {viewPage3 && (
                            <img src={RedWarning} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage4 ? style.completedEntityCardStyle : viewPage3 ? style.selectedContractEntityStyle : ''}`}>
                        Contractor Business Entity
                        {viewPage4 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage5 ? style.completedEntityCardStyle : viewPage4 ? style.selectedContractEntityStyle : ''}`}>
                        Documentation Proof Required
                        {viewPage5 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${((viewPage5 && addOn) || viewPage6) ? style.completedEntityCardStyle : viewPage5 ? style.selectedContractEntityStyle : ''}`}>
                        Contracted Services Specification
                        {((viewPage5 && addOn) || viewPage6) && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage6 ? style.completedEntityCardStyle : addOn ? style.selectedContractEntityStyle : ''}`}>
                        Contracted Add on service specification
                        {viewPage6 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage7 ? style.completedEntityCardStyle : viewPage6 ? style.selectedContractEntityStyle : ''}`}>
                        Payment & Compensation
                        {viewPage7 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage8 ? style.completedEntityCardStyle : viewPage7 ? style.selectedContractEntityStyle : ''}`}>
                        Timesheet Submission Terms
                        {viewPage8 && (
                            <img src={CompletedIcon} alt="completed" className={`${style.completedIconStyle}`} />
                        )}
                    </div>
                    <div className={`${style.contractEntityCardStyle} ${style.contractEntityFontStyle} ${style.marginTop10} ${viewPage8 && style.selectedContractEntityStyle}`}>
                        Timesheet Processing Workflow
                    </div>
                </div>
                {viewPage8 ? (
                    <TimesheetProcessingWorkflow
                    getViewPage8={getViewPage8}
                    getCurrentPage={getCurrentPage}
                    selectContractInfo={selectContractInfo}
                     />
                ) : viewPage7 ? (
                    <TimeSheetSubmissionTerms
                    getViewPage8={getViewPage8}
                    getCurrentPage={getCurrentPage} />
                ) : viewPage6 ? (
                    <PaymentAndCompensation
                    selectContractInfo={selectContractInfo}
                    getViewPage7={getViewPage7}
                    getCurrentPage={getCurrentPage}
                     />
                ) : viewPage5 ?
                  <ServiceSpecification getViewPage6={getViewPage6} getAddon={getAddOn} />
                  :viewPage4 ? (
                    <DocumentationProofRequired
                    getShowAlertDialog={getShowAlertDialog}
                    getViewPage5={getViewPage5}
                    getCurrentPage={getCurrentPage}
                     />
                ) : viewPage3 ? (
                    <ContractorBusinessEntity
                    getViewPage4={getViewPage4}
                    getCurrentPage={getCurrentPage}
                    selectContractInfo={selectContractInfo} />
                )
                : selectContractInfo === "INDIVIDUAL" && viewPage2 ? (
                    <ContractedServicesProviderIndividual
                    getViewPage3={getViewPage3}
                    getCurrentPage={getCurrentPage} />
                ) : (selectContractInfo === "INDIVIDUAL" && viewPage1) ? (
                    <ContractIdTermLimitIndividual
                    getViewPage1={getViewPage1}
                    getViewPage2={getViewPage2}
                    contractType = {contractType}
                    selectedContractType = {selectedContractType}/>
                ) : (selectContractInfo === "MULTIPLE" && (viewPage1 || viewPage2)) ? (
                    <ContractedServicesProviderMultiple
                    getNewServiceProviderDialog={getNewServiceProviderDialog}
                    getViewPage1={getViewPage1}
                    getViewPage2={getViewPage2}
                    getViewPage3={getViewPage3}
                    getCurrentPage={getCurrentPage} />
                ) : ''}
                <div className={style.cloneBlockStyle}>
                    <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Indentification Information</p>
                    <div className={style.welcomeBorder}></div>
                    <p className={style.descriptionStyle}>
                    {currentPage}
                    </p>
                    <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Activity Performed</p>
                    <div className={style.welcomeBorder}></div>
                    {viewPage1 && !viewPage2 && (
                        <div className={style.validationAlert}>
                            <div className={style.displayInRow}>
                                <div>
                                    <p className={`${style.blackText} ${style.leftAlign}`}><strong>Text to Alert User</strong></p>
                                    <p className={`${style.blackText} ${style.leftAlign}`}>This area will display specific alerts for the users</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <p className={`${style.smallHeadingStyle} ${style.marginTop20}`}>Reference Contract Documents</p>
                    <div className={style.welcomeBorder}></div>
                    <div className={style.documentCard}>
                        <div>
                            <div>
                                <p className={`${style.blackText} ${style.leftAlign}`}><strong>executed Contract (Current)</strong></p>
                                <div className={style.spaceBetween}>
                                    <p className={`${style.blackText} ${style.leftAlign}`}>Contract name to appear here</p>
                                    <div>
                                        <Icon icon="trash" className={style.trashStyle} size={10} onClick={() => getDeleteExecutedContractDialog(true)}  />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.documentCard} ${style.marginTop10}`}>
                        <div>
                            <div>
                                <p className={`${style.blackText} ${style.leftAlign}`}><strong>Exhibit</strong></p>
                                <div className={style.spaceBetween}>
                                    <p className={`${style.blackText} ${style.leftAlign}`}>Exhibit A and B</p>
                                    <div>
                                        <Icon icon="trash" className={style.trashStyle} size={10} onClick={() => getDeleteExecutedContractDialog(true)}  />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {deleteExecutedContractDialog && (
                <DeleteExecutedContractDialog getDeleteExecutedContractDialog={getDeleteExecutedContractDialog} />
            )}
            {newServiceProviderDialog && (
                <NewServiceProvider getNewServiceProviderDialog={getNewServiceProviderDialog} />
            )}
            {showAlertDialog && (
              <Alert getShowAlertDialog={getShowAlertDialog} isMultipleContract={isMultipleContract} />
            )}
        </div>
    )
}

export default NewContractFromClone;
