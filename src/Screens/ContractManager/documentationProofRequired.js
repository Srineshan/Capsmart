import React, {useState, useEffect} from 'react';
import { InputGroup, Icon } from '@blueprintjs/core';
import {GET} from './../dataSaver';
import CompletedIcon from './../../images/completedIcon.png';
import RedWarning from './../../images/redWarning.png';
import FileImg from './../../images/fileImg.png';
import style from './index.module.scss';

const DocumentationProofRequired = ({getShowAlertDialog, getViewPage5, getCurrentPage}) => {
  const contractId = 'e96eca5e-40cd-47b8-b1cc-c5cb4be9fdbf';
  const [documents,setDocuments] = useState([]);

  useEffect(()=>{
    getDocumentationData();
  },[])

  const getDocumentationData = async() => {
    const {data: documentsData} = await GET(`contract-managment-service/contracts/${contractId}/DocumentationProof`);
    if(documentsData){
      setDocuments(documentsData?.documentProofs);
    }
  }
  
    return(
        <div className={style.cloneBlockStyle}>
            <div className={style.tableHeight}>
                <div>
                    <InputGroup className={`${style.documentProofInputWidth} ${style.marginLeft20}`} placeholder="For this contract to be active, proof of documentation is required for items listed on the Right." />
                </div>
                <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                    <div className={`${style.extentionLableStyle} ${style.marginTop20} ${style.marginLeft20} ${style.blackText}`}>DOCUMENT DATA STATUS</div>
                    <button className={`${style.addCotractorButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} ${style.marginRight20}`}
                        onClick={()=> getShowAlertDialog(true)} >ADD PROOF OF DOCUMENTATION</button>
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
                  documents?.map(data=>(
                    <div className={`${style.documentDataProof} ${style.displayInRow}`}>
                        <img src={CompletedIcon} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
                        <p className={style.documentProofDataTextWidth}>{data?.podType?.type}</p>
                        <p className={style.documentProofDataTextWidth}>business</p>
                        <p className={style.documentProofDataTextWidth}>name</p>
                        <div className={style.displayInRow}>
                            <img src={FileImg} alt="file" className={`${style.fileIcon} ${style.marginLeft20}`} />
                            <p className={style.documentProofDataTextWidth}>{data?.file?.fileName !== '' ? data?.file?.fileName : 'Missing'}</p>
                        </div>
                        <Icon icon="trash" size={20} color="#52575D"/>
                    </div>
                  ))
                }
                {
                  // <div className={`${style.documentDataProof} ${style.displayInRow}`}>
                  //     <img src={CompletedIcon} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
                  //     <p className={style.documentProofDataTextWidth}>Medical license Certificate</p>
                  //     <p className={style.documentProofDataTextWidth}>entity </p>
                  //     <p className={style.documentProofDataTextWidth}>name</p>
                  //     <div className={style.displayInRow}>
                  //         <img src={FileImg} alt="file" className={`${style.fileIcon} ${style.marginLeft20}`} />
                  //         <p className={style.documentProofDataTextWidth}>Missing</p>
                  //     </div>
                  //     <Icon icon="trash" size={20} color="#52575D"/>
                  // </div>
                  // <div className={`${style.documentDataProof} ${style.displayInRow}`}>
                  //     <img src={RedWarning} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
                  //     <p className={style.documentProofDataTextWidth}>Medical license Certificate</p>
                  //     <p className={style.documentProofDataTextWidth}>sample </p>
                  //     <p className={style.documentProofDataTextWidth}>name</p>
                  //     <div className={style.displayInRow}>
                  //         <img src={FileImg} alt="file" className={`${style.fileIcon} ${style.marginLeft20}`} />
                  //         <p className={style.documentProofDataTextWidth}>ss.png</p>
                  //     </div>
                  //     <Icon icon="trash" size={20}  color="#52575D"/>
                  // </div>
                }

            </div>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button className={style.outlinedButton}>SAVE IN-PROGRESS</button>
                <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={()=>{getViewPage5(true);getCurrentPage('Contracted Services Specification')}}>CONTINUE</button>
            </div>
        </div>
    )
}

export default DocumentationProofRequired;
