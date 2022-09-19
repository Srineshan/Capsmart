import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import CompletedIcon from './../../images/completedIcon.png';
import { GET, PUT } from './../dataSaver';

import style from './index.module.scss';
import AddServiceProvided from './addServiceToBeProvided';
import EditServiceProvided from './editServiceToBeProvided';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

const ServiceSpecification = ({ getViewPage6, getAddon, contractId, getCurrentPage, selectContractInfo }) => {
  const [addService, setAddService] = useState(false);
  const [editService, setEditService] = useState(false);
  const [addOn, setAddOn] = useState(false);
  const [contractedServices, setContractedServices] = useState([]);
  const [selectedService, setSelectedService] = useState({});
  const [users, setUsers] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [contractedServiceToBeRemoved, setContractedServiceToBeRemoved] = useState('');
  const [userLength, setUserLength] = useState(0);
  useEffect(() => {
    getContractedServices();
  }, [addService, editService, contractedServiceToBeRemoved])

  useEffect(() => {
    getUserData();
  }, [])

  useEffect(() => {
    setUserLength(users?.length);
  }, [users])

  const getDeleteServiceDialog = (value) => {
    setShowDeleteConfirmation(value);
  }

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

  const getContractedServices = async () => {
    const { data: contractedServices } = await GET(`contract-managment-service/contracts/${contractId}/ContractedService`);
    setContractedServices(contractedServices?.contractedServices)
  }

  const getUserData = async () => {
    const { data: userData } = await GET(`user-management-service/user?contractID=${contractId}`);
    if (userData) {
      setUsers(userData);
    }
  }

  console.log(users?.length)

  const handleDeleteService = async () => {
    console.log(contractedServices?.filter(data => data?.performingActivity?.activity !== contractedServiceToBeRemoved)?.map(data => data));
    let formattedData = {
      contractedServices: contractedServices?.filter(data => data?.performingActivity?.activity !== contractedServiceToBeRemoved)?.map(data => data)
    }

    const response = await PUT(`contract-managment-service/contracts/${contractId}/ContractedService`, JSON.stringify(formattedData));
    if (response) {
      SuccessToaster('Contracted Service Deleted Successfully');
    }
    else {
      ErrorToaster('Unexpected Error');
    }
    setShowDeleteConfirmation(false);
    setContractedServiceToBeRemoved('');
  }

  console.log(contractedServices);

  return (
    <>
      {userLength !== 0 ? (
        <div className={style.cloneBlockStyle}>
          <div className={style.tableHeight}>
            <button className={`${style.addCotractorButton} ${style.selectedColor} ${style.cursorPointer} ${style.floatRight} ${style.marginBottom}`} onClick={() => getAddServiceDialog(true)}>ADD SERVICE</button>
            <div className={`${style.serviceSpecificationTableHeader} ${style.marginTop20}`}>
              <p className={style.documentProofTextWidth}></p>
              <p className={`${style.documentProofTextWidth}`}>ACTIVITIES TYPE</p>
              <p className={style.documentProofTextWidth}>SPECIFIC ACTIVITY</p>
              <p className={style.documentProofTextWidth}>APPLIES TO</p>
              <p className={style.documentProofTextWidth}></p>
            </div>
            {contractedServices?.map((data, index) => (
              <div className={`${style.serviceSpecificationTableData} ${style.displayInRow}`} key={index}>
                <img src={CompletedIcon} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
                <p className={`${style.documentProofDataTextWidth} ${style.cursorPointer}`} onClick={() => { getEditServiceDialog(true); setSelectedService(data) }}>{data?.activityType?.activityType}</p>
                <p className={style.documentProofDataTextWidth}>{data?.performingActivity?.activity} </p>
                <p className={style.documentProofDataTextWidth}>Demo data</p>
                <Icon icon="trash" size={20} className={`${style.marginRight20} ${style.cursorPointer}`} color="#52575D" onClick={() => { setShowDeleteConfirmation(true); setContractedServiceToBeRemoved(data?.performingActivity?.activity) }} />
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
            <button className={`${style.newContractButtonStyle}`} onClick={() => { getCurrentPage('Documentation Proof Required') }}>BACK</button>
            <div>
              <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
              <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={() => getViewPage6(true)}>CONTINUE</button>
            </div>
          </div>
          {
            addService &&
            <AddServiceProvided getAddServiceDialog={getAddServiceDialog} getAddOn={getAddOn} contractId={contractId} selectContractInfo={selectContractInfo} />
          }
          {
            editService &&
            <EditServiceProvided getEditServiceDialog={getEditServiceDialog} getAddOn={getAddOn} contractId={contractId} selectedService={selectedService} selectContractInfo={selectContractInfo} />
          }
          <Dialog isOpen={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
              <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>DELETE CONFIRMATION</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowDeleteConfirmation(false)} />
              </div>
              <div className={style.extensionBorder}></div>
              <p className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}>
                Are you sure, you want to delete?
                <span className={`${style.blueColor} ${style.marginLeft20}`}>
                  Action performed cannot be retrieved!
                </span>
              </p>
              <div className={`${style.positionCenter} ${style.marginTop20}`}>
                <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`} onClick={() => { handleDeleteService() }}>DELETE</button>
              </div>
            </div>
          </Dialog>
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

export default ServiceSpecification;
