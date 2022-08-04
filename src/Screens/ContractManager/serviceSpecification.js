import React, {useState} from 'react';
import {Icon, Intent } from '@blueprintjs/core';
import CompletedIcon from './../../images/completedIcon.png';
import style from './index.module.scss';
import AddServiceProvided from './addServiceToBeProvided';

const ServiceSpecification = ({getViewPage6, getAddon, getCurrentPage}) => {
  const [addService,setAddService] = useState(false);
  const [addOn, setAddOn] = useState(false);


  const getAddServiceDialog = (value) => {
    setAddService(value);
  }

  const getAddOn = (value) => {
    setAddOn(value);
    getAddon(value);
    console.log('received')
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
            <p className={style.documentProofDataTextWidth}>Demo data</p>
            <p className={style.documentProofDataTextWidth}>Demo data </p>
            <p className={style.documentProofDataTextWidth}>Demo data</p>
            <Icon icon="trash" size={20} className={style.marginRight20} color="#52575D"/>
        </div>
        <div className={`${style.serviceSpecificationTableData} ${style.displayInRow}`}>
            <img src={CompletedIcon} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
            <p className={style.documentProofDataTextWidth}>Demo data</p>
            <p className={style.documentProofDataTextWidth}>Demo data</p>
            <p className={style.documentProofDataTextWidth}>Demo data</p>
            <Icon icon="trash" size={20} className={style.marginRight20} color="#52575D"/>
        </div>
        <div className={`${style.serviceSpecificationTableData} ${style.displayInRow}`}>
            <img src={CompletedIcon} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
            <p className={style.documentProofDataTextWidth}>Demo data </p>
            <p className={style.documentProofDataTextWidth}>Demo data</p>
            <p className={style.documentProofDataTextWidth}>Demo data</p>
            <Icon icon="trash" size={20} className={style.marginRight20} color="#52575D" />
        </div>
    </div>
    <div className={`${style.spaceBetween} ${style.marginTop20}`}>
      <button className={`${style.newContractButtonStyle}`} onClick={()=> {getCurrentPage('Documentation Proof Required')}}>BACK</button>
      <div>
        <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
        <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={() => getViewPage6(true)}>CONTINUE</button>
      </div>
    </div>
    {
      addService &&
      <AddServiceProvided getAddServiceDialog={getAddServiceDialog} getAddOn={getAddOn}/>
    }
</div>
  )
}

export default ServiceSpecification;
