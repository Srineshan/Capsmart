import React, {useState} from 'react';
import {Icon, Intent } from '@blueprintjs/core';
import CompletedIcon from './../../images/completedIcon.png';
import style from './index.module.scss';
import AddServiceProvided from './addServiceToBeProvided';

const ServiceSpecification = ({getViewPage6}) => {
  const [addService,setAddService] = useState(false);

  const getAddServiceDialog = (value) => {
    setAddService(value);
  }

  return(
    <div className={style.cloneBlockStyle}>
    <div className={style.tableHeight}>
        <button className={`${style.addCotractorButton} ${style.selectedColor} ${style.cursorPointer} ${style.floatRight} ${style.marginBottom}`} onClick={()=>getAddServiceDialog(true)}>ADD SERVICE</button>
        <div className={`${style.serviceSpecificationTableHeader} ${style.marginTop20}`}>
            <p className={style.documentProofTextWidth}></p>
            <p className={`${style.documentProofTextWidth}`}>ACTIVITIES TYPE</p>
            <p className={style.documentProofTextWidth}>SPECIFIC ACTIVITY</p>
            <p className={style.documentProofTextWidth}>APPLIES TO</p>
            <p className={style.documentProofTextWidth}></p>
        </div>
        <div className={`${style.serviceSpecificationTableData} ${style.displayInRow}`}>
            <img src={CompletedIcon} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
            <p className={style.documentProofDataTextWidth}>Loreum Ipsum</p>
            <p className={style.documentProofDataTextWidth}>Loreum Ipsum </p>
            <p className={style.documentProofDataTextWidth}>Loreum Ipsum</p>
            <Icon icon="trash" size={20} className={style.marginRight20} color="#52575D"/>
        </div>
        <div className={`${style.serviceSpecificationTableData} ${style.displayInRow}`}>
            <img src={CompletedIcon} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
            <p className={style.documentProofDataTextWidth}>Loreum Ipsum</p>
            <p className={style.documentProofDataTextWidth}>Loreum Ipsum</p>
            <p className={style.documentProofDataTextWidth}>Loreum Ipsum</p>
            <Icon icon="trash" size={20} className={style.marginRight20} color="#52575D"/>
        </div>
        <div className={`${style.serviceSpecificationTableData} ${style.displayInRow}`}>
            <img src={CompletedIcon} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
            <p className={style.documentProofDataTextWidth}>Loreum ipsum </p>
            <p className={style.documentProofDataTextWidth}>Loreum ipsum</p>
            <p className={style.documentProofDataTextWidth}>Loreum Ipsum</p>
            <Icon icon="trash" size={20} className={style.marginRight20} color="#52575D" />
        </div>
    </div>
    <div className={`${style.floatRight} ${style.marginTop20}`}>
        <button className={style.outlinedButton}>SAVE IN-PROGRESS</button>
        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => getViewPage6(true)}>CONTINUE</button>
    </div>
    {
      addService &&
      <AddServiceProvided getAddServiceDialog={getAddServiceDialog}/>
    }
</div>
  )
}

export default ServiceSpecification;
