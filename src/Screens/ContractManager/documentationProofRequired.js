import React, {useState, useEffect} from 'react';
import { InputGroup, Icon, Dialog, Classes, Intent } from '@blueprintjs/core';
import {GET,DELETE} from './../dataSaver';
import {ErrorToaster, SuccessToaster}  from './../../utils/toaster';
import CompletedIcon from './../../images/completedIcon.png';
import RedWarning from './../../images/redWarning.png';
import FileImg from './../../images/fileImg.png';
import AddProofOfDocumentation from './addProofOfDocumentation';

import style from './index.module.scss';
import EditProofOfDocumentation from './editProofOfDocumentation';
import NoProofOfDocumentationDialog from './noProofOfDocumentationDialog';

const DocumentationProofRequired = ({ getViewPage5, getCurrentPage, contractId, isMultipleContract}) => {
  const [deleteExecutedContractDialog, setDeleteExecutedContractDialog] = useState(false);
  const [documents,setDocuments] = useState([]);
  const [fileToDelete,setFileToDelete] = useState('');
  const [showProofDialog,setShowProofDialog] = useState(false);
  const [showEditProofDialog,setShowEditProofDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [userLength, setUserLength] = useState(0);
  const [selectedProof, setSelectedProof] = useState({});
  const [noProofOfDocumentationPlan, setNoProofOfDocumentationPlan] = useState(true);

  useEffect(()=>{
    getDocumentationData();
    getUserData();
  },[showProofDialog, showEditProofDialog])

  useEffect(() => {
    setUserLength(users?.length);
  }, [users])

  const getShowProofDialog = (value) => {
    setShowProofDialog(value);
  }

  const getShowEditProofDialog = (value) => {
    setShowEditProofDialog(value);
  }

  const getDocumentationData = async() => {
    const {data: documentsData} = await GET(`contract-managment-service/contracts/${contractId}/DocumentationProof`);
    if(documentsData){
      setDocuments(documentsData?.documentProofs);
    }
  }

  const getUserData = async () => {
    const { data: userData } = await GET(`user-management-service/user?contractID=${contractId}`);
    if (userData) {
      setUsers(userData);
    }
  }

  const getDeleteExecutedContractDialog = (value) => {
      setDeleteExecutedContractDialog(value);
  }

  const getNoProofOfDocumentationDialog = (value) => {
    setNoProofOfDocumentationPlan(value);
  }

  const handleFileDeletion = async() => {
    await DELETE(`contract-managment-service/contracts/DocumentationProof/${fileToDelete}`)
    .then(response=>{
      SuccessToaster('Document Deleted Successfully');
    })
    .then(error=>{
      ErrorToaster('Unexpected Error occured deleting document');
    })
  }

    return(
      <>
      {userLength !== 0 ? (
        <div className={style.cloneBlockStyle}>
            <div className={style.tableHeight}>
                <div className={style.activationDescriptionBoxStyle}>
                For contract <span className={style.green}>ACTIVATION</span>, compliance with Proof of Documentation is required for items below.
                </div>
                <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                    <div className={`${style.extentionLableStyle} ${style.marginTop20} ${style.marginLeft20} ${style.blackText}`}>DOCUMENT DATA STATUS</div>
                    <button className={`${style.addCotractorButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} ${style.marginRight20}`}
                        onClick={()=>{setShowProofDialog(true)}} >ADD PROOF OF DOCUMENTATION</button>
                </div>
                <div className={`${style.documentPageHeader} ${style.marginTop10}`}>
                    <p className={style.documentProofTextWidth}></p>
                    <p className={style.documentProofTextWidth}>POD TYPE</p>
                    <p className={style.documentProofTextWidth}>SITE</p>
                    <p className={style.documentProofTextWidth}>CONTRACTOR</p>
                    <p className={style.documentProofTextWidth}>COPY ON FILE</p>
                    <p className={style.documentProofTextWidth}></p>
                </div>
                {
                  documents?.map((data, index)=>(
                    <div className={`${style.documentDataProof} ${style.displayInRow}`} key={index} >
                        <img src={CompletedIcon} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
                        <p className={`${style.documentProofDataTextWidth} ${style.cursorPointer}`} onClick={() => {setSelectedProof(data);setShowEditProofDialog(true)}}>{data?.podType?.type}</p>
                        <p className={style.documentProofDataTextWidth}>{data?.dataMap?.dataMap?.privilegingFacility?.siteName?.siteName}</p>
                        <p className={style.documentProofDataTextWidth}>{users?.filter(userData => data?.dataMap?.dataMap?.contractedServiceProvider === userData?.id)?.map(data => data)[0]?.name?.firstName} {users?.filter(userData => data?.dataMap?.dataMap?.contractedServiceProvider === userData?.id)?.map(data => data)[0]?.name?.lastName}</p>
                        <div className={`${style.displayInRow} ${style.alignCenter}`}>
                            <img src={FileImg} alt="file" className={`${style.fileIcon} ${style.marginLeft20}`} />
                            <p className={style.documentProofDataTextWidth}>{data?.file?.fileName !== '' ? data?.file?.fileName : 'Missing'}</p>
                        </div>
                        <Icon icon="trash" size={20} color="#52575D" onClick={()=>{setFileToDelete(data?.id);setDeleteExecutedContractDialog(true);}}/>
                    </div>
                  ))
                }
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
            </div>
            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <button className={`${style.newContractButtonStyle}`} onClick={()=> {getCurrentPage('Contractor Business Entity')}}>BACK</button>
                <div>
                    <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                    <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`}
                    onClick={()=>{getViewPage5(true);getCurrentPage('Contracted Services Specification')}}>CONTINUE</button>
                </div>
            </div>

            {
              showProofDialog &&
              <AddProofOfDocumentation getShowProofDialog={getShowProofDialog} isMultipleContract={isMultipleContract} contractId={contractId}/>
            }
            {
              showEditProofDialog &&
              <EditProofOfDocumentation getShowEditProofDialog={getShowEditProofDialog} isMultipleContract={isMultipleContract} contractId={contractId} selectedProof={selectedProof} />
            }
            {
              noProofOfDocumentationPlan && 
              <NoProofOfDocumentationDialog getNoProofOfDocumentationDialog={getNoProofOfDocumentationDialog} />
            }
        </div>
        ) : (
          <>
            <div className={style.cloneBlockStyle}></div>
            <Dialog isOpen={true} className={`${style.cloneDialog}`} canOutsideClickClose={false}>
              <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                <div className={style.spaceBetween}>
                  <p className={style.extensionStyle}>NO USERS FOUND</p>
                </div>
                <div className={style.extensionBorder}></div>
                <p className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}>
                No Contracted Service Provider Is Found.
                </p>
                <div className={`${style.positionCenter} ${style.marginTop20}`}>
                  <button className={`${style.newContractButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`} onClick={() => getCurrentPage('Contracted Services Provider(s)')}>ADD CONTRACTOR</button>
                </div>
                <br />
              </div>
            </Dialog>
          </>
        )}
      </>
    )
}

export default DocumentationProofRequired;
