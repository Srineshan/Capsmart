import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import CompletedIcon from './../../images/completedIcon.png';
import { GET, PUT } from './../dataSaver';
import LoadingScreen from '../../Components/LoadingScreen';
import RedirectingPopUp from './redirectingPopUp';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Table from '../../Components/TableDesign';
import {validateTabs} from './contractValidation';
import style from './index.module.scss';
import AddServiceProvided from './addServiceToBeProvided';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

const ServiceSpecification = ({ getViewPage6, getAddon, contractId, getCurrentPage, selectContractInfo, isMultiSiteEntity, isEditable, getTabDataStatus }) => {
  const [addService, setAddService] = useState(false);
  const [editService, setEditService] = useState(false);
  const [addOn, setAddOn] = useState(false);
  const [contractedServices, setContractedServices] = useState([]);
  const [selectedService, setSelectedService] = useState({});
  const [users, setUsers] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedContractServiceIndex, setSelectedContractServiceIndex] = useState();
  const [userLength, setUserLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [servicesValid, setServicesValid] = useState([]);
  const tableHeaderValues = ['', 'ACTIVITIES TYPE', 'SPECIFIC ACTIVITY', 'APPLIES TO', 'BILLABLE', ''];

  useEffect(() => {
    getContractedServices();
  }, [addService, editService, selectedContractServiceIndex])

  useEffect(() => {
    getUserData();
    getDataStatus();
  }, [])

  useEffect(() => {
    setUserLength(users?.length);
  }, [users])

  const getDeleteServiceDialog = (value) => {
    setShowDeleteConfirmation(value);
  }

  const getAddServiceDialog = (value) => {
    setAddService(value);
    setSelectedService({});
    if (value === false) {
      getContractedServices();
    }
  }

  const getEditServiceDialog = (value) => {
    setEditService(value);
    setSelectedService({});
  }

  const getAddOn = (value) => {
    setAddOn(value);
    getAddon(value);
  }

  const getContractedServices = async () => {
    const { data: contractedServices } = await GET(`contract-managment-service/contracts/${contractId}/ContractedService`);
    setContractedServices(contractedServices?.contractedServices);
  }

  const getUserData = async () => {
    const { data: userData } = await GET(`user-management-service/user?contractID=${contractId}`);
    if (userData) {
      setUsers(userData);
    }
    setIsLoading(false);
  }

  const handleDeleteService = async () => {
    let formattedData = {
      contractedServices: contractedServices?.filter((data, index) => selectedContractServiceIndex !== index)?.map(data => data)
    }

    const response = await PUT(`contract-managment-service/contracts/${contractId}/ContractedService`, JSON.stringify(formattedData));
    if (response) {
      SuccessToaster('Contracted Service Deleted Successfully');
    }
    else {
      ErrorToaster('Unexpected Error');
    }
    setShowDeleteConfirmation(false);
    setSelectedContractServiceIndex();
  }

  const onClickFunction = (data, index) => {
    getEditServiceDialog(true);
    setSelectedService(data);
    setSelectedContractServiceIndex(index);
  }

  const onClickCrossFunction = (data, index) => {
    setShowDeleteConfirmation(true);
    setSelectedContractServiceIndex(index);
  }

  let dataStatus = [];
  let activityType = [];
  let specificActivity = [];
  let specificActivityHoverText = [];
  let appliesTo = [];
  let appliesToHoverText = [];
  let billable = [];
  let deleteIcon = [];

  const getDataStatus = () => {
    let tabsValid = validateTabs(contractId);
    tabsValid?.then(response=>{
      console.log('inside',response);
      setServicesValid(response?.value4);
    })
  }

  const getServiceProviderValues = () => {
    dataStatus = [];
    activityType = [];
    specificActivity = [];
    specificActivityHoverText = [];
    appliesTo = [];
    appliesToHoverText = [];
    billable = [];
    deleteIcon = [];

    contractedServices?.map((data,index) => {
      dataStatus.push(servicesValid?.[index]?.length === 0 ? <TaskAltOutlinedIcon style={{ color: "#14B15A" }} /> : <WarningAmberIcon style={{color : "#FF6562"}} />);
      activityType.push(data?.activityType?.activityType);
      specificActivity.push(data?.activities?.length  > 1 ? `${data?.activities?.[0]?.activity}...` : data?.activities?.[0]?.activity || '-');
      specificActivityHoverText.push(data?.activities?.map(data=>data?.activity) || '-');
      appliesTo.push(data?.users?.[0]?.name?.firstName || '-');
      appliesToHoverText.push(data?.users?.map(user=>user?.name?.firstName) || '-');
      billable.push(data?.billableService ? 'YES' : 'NO');
      deleteIcon.push(<CloseOutlinedIcon style={{ color: "#F94848" }} />);
    })

    return [
      { "type": "icon", "icon": dataStatus },
      { "type": "text", "value": activityType, "onClickFunction": onClickFunction },
      { "type": "textWithHover", "value": specificActivity, "hoverText": specificActivityHoverText, "onClickFunction": onClickFunction },
      { "type": "textWithHover", "value": appliesTo, "hoverText": appliesToHoverText, "onClickFunction": onClickFunction },
      { "type": "text", "value": billable, "onClickFunction": onClickFunction },
      { "type": "text", "value": deleteIcon, "onClickFunction": onClickCrossFunction },
    ];
  }

  if (isLoading) {
    return <LoadingScreen text={['Sit Back And Relax', 'Loading Your Details']} />
  }

  console.log('editable', isEditable, typeof isEditable);
  return (
    <>
      {userLength !== 0 ? (
        <div className={style.cloneBlockStyle}>
          <div className={style.tableHeight}>
            {isEditable && <button className={`${style.addCotractorButton} ${style.selectedColor} ${style.cursorPointer} ${style.floatRight} ${style.marginBottom}`} onClick={() => getAddServiceDialog(true)}>ADD SERVICE</button>}
            {/* <div className={`${style.serviceSpecificationTableHeader} ${style.marginTop20}`}>
              <p className={style.documentProofTextWidth}></p>
              <p className={`${style.documentProofTextWidth}`}>ACTIVITIES TYPE</p>
              <p className={style.documentProofTextWidth}>SPECIFIC ACTIVITY</p>
              <p className={style.documentProofTextWidth}>APPLIES TO</p>
              <p className={style.documentProofTextWidth}></p>
            </div>

            {contractedServices?.map((data, index) => (
              <div className={`${style.serviceSpecificationTableData} ${style.displayInRow}`} key={index}>
                <img src={CompletedIcon} alt="completed" className={`${style.completedIconTableStyle} ${style.marginLeft20}`} />
                <p className={`${style.documentProofDataTextWidth} ${style.cursorPointer}`} onClick={() => { getEditServiceDialog(true); setSelectedService(data); setSelectedContractServiceIndex(index); }}>{data?.activityType?.activityType}</p>
                <p className={style.documentProofDataTextWidth}>{data?.performingActivity?.activity} </p>
                <p className={style.documentProofDataTextWidth}>{data?.users?.[0]?.name?.firstName}</p>
                <Icon icon="cross" size={20} className={`${style.marginRight20} ${style.cursorPointer}`} intent={Intent.DANGER} onClick={() => { setShowDeleteConfirmation(true); setSelectedContractServiceIndex(index) }} />
              </div>
            ))} */}
            <div className={style.marginTop20}>
              <Table
                tableHeaderValues={tableHeaderValues}
                tableDataValues={getServiceProviderValues()}
                tableData={contractedServices}
                gridStyle={style.serviceSpecificationGrid}
              />
            </div>
          </div>
          {isEditable &&
            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
              <button className={`${style.newContractButtonStyle}`} onClick={() => { getCurrentPage('Contractor Business Entity') }}>BACK</button>
              <div>
                <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={() => { getViewPage6(true); getCurrentPage('Timesheet Submission Terms'); }}>CONTINUE</button>
              </div>
            </div>
          }

          {
            (addService || editService) &&
            <AddServiceProvided getAddServiceDialog={getAddServiceDialog} getAddOn={getAddOn} contractId={contractId} selectContractInfo={selectContractInfo} selectedService={selectedService} editService={editService} getEditServiceDialog={getEditServiceDialog} isMultiSiteEntity={isMultiSiteEntity} selectedIndex={selectedContractServiceIndex} isEditable={isEditable} getTabDataStatus={getTabDataStatus}/>
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
        (
          <RedirectingPopUp getCurrentPage={getCurrentPage} tabName={'Contracted Services Provider(s)'} title={'NO USERS FOUND'} description={'No Contracted Service Provider Is Found.'} buttonText={'ADD CONTRACTOR'} />
        )
      )}
    </>
  )
}

export default ServiceSpecification;
