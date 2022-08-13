import React, {useState, useEffect} from 'react';
import {Icon, Intent } from '@blueprintjs/core';
import CompletedIcon from './../../images/completedIcon.png';
import {GET} from './../dataSaver';

import style from './index.module.scss';
import AddServiceProvided from './addServiceToBeProvided';
import EditServiceProvided from './editServiceToBeProvided';

const ServiceSpecification = ({getViewPage6, getAddon, contractId, getCurrentPage}) => {
  const [addService,setAddService] = useState(false);
  const [editService,setEditService] = useState(false);
  const [addOn, setAddOn] = useState(false);
  const [contractedServices, setContractedServices] = useState([]);
  const [selectedService, setSelectedService] = useState({})
  useEffect(()=> {
    getContractedServices();
  }, [addService])


  const getAddServiceDialog = (value) => {
    setAddService(value);
  }

  const getEditServiceDialog = (value) => {
    setEditService(value);
  }

  const getAddOn = (value) => {
    setAddOn(value);
    getAddon(value);
    console.log('received')
}

const getContractedServices = async() => {
  const {data: contractedServices} = await GET(`contract-managment-service/contracts/${contractId}/ContractedService`);
  setContractedServices(contractedServices?.contractedServices)
}

console.log(contractedServices);

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
        {contractedServices?.map((data, index) => (
          <div className={`${style.serviceSpecificationTableData} ${style.displayInRow}`} key={index} onClick={()=>{getEditServiceDialog(true);setSelectedService(data)}}>
              <img src={CompletedIcon} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
              <p className={style.documentProofDataTextWidth}>{data?.activityType?.activityType}</p>
              <p className={style.documentProofDataTextWidth}>{data?.performingActivity?.activity} </p>
              <p className={style.documentProofDataTextWidth}>Demo data</p>
              <Icon icon="trash" size={20} className={style.marginRight20} color="#52575D"/>
          </div>
        ))}
        {/* <div className={`${style.serviceSpecificationTableData} ${style.displayInRow}`}>
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
        </div> */}
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
      <AddServiceProvided getAddServiceDialog={getAddServiceDialog} getAddOn={getAddOn} contractId={contractId} />
    }
    {
      editService &&
      <EditServiceProvided getEditServiceDialog={getEditServiceDialog} getAddOn={getAddOn} contractId={contractId} selectedService={selectedService} />
    }
</div>
  )
}

export default ServiceSpecification;
