import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import CompletedIcon from './../../images/completedIcon.png';
import { GET, PUT } from './../dataSaver';
import LoadingScreen from '../../Components/LoadingScreen';
import RedirectingPopUp from './redirectingPopUp';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import Table from '../../Components/TableDesign';
import { validateTabs } from './contractValidation';
import style from './index.module.scss';
import AddServiceProvided from './addServiceToBeProvided';
import { CLINIC, SURGERY, ONCALL, SUPPLEMENTAL, ADDON, ADMINISTRATIVE, PROCEDUREREADING } from '../../Constants';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

const ServiceSpecification = ({ getViewPage6, getAddon, contractId, getCurrentPage, selectContractInfo, isMultiSiteEntity, isEditable, getTabDataStatus, getShowPrevContractDataAlert, isNewContract }) => {
  const [addService, setAddService] = useState(false);
  const [editService, setEditService] = useState(false);
  const [addOn, setAddOn] = useState(false);
  const [contractedServices, setContractedServices] = useState([]);
  const [selectedService, setSelectedService] = useState({});
  const [users, setUsers] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedContractServiceIndex, setSelectedContractServiceIndex] = useState();
  const [contractToDelete, setContractToDelete] = useState([]);
  const [userLength, setUserLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [servicesValid, setServicesValid] = useState([]);
  const [serviceToDelete, setServiceToDelete] = useState('');
  const contractStatus = sessionStorage.getItem('Selected Contract Status');
  const [contractTabsMetaData, setContractTabsMetaData] = useState();

  let tableHeaderValues = selectContractInfo === 'INDIVIDUAL' ? ['', 'ACTIVITY TYPE', 'SPECIFIC ACTIVITY', 'BILLABLE', '', ''] : ['', 'ACTIVITY TYPE', 'SPECIFIC ACTIVITY', 'APPLIES TO', 'BILLABLE', '', ''];

  useEffect(() => {
    getContractedServices();
  }, [addService, editService, selectedContractServiceIndex])

  useEffect(() => {
    getUserData();
    getDataStatus();
    getContractTabsMetadata();
  }, [])

  useEffect(() => {
    getDataStatus();
  }, [contractedServices])

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

  const getContractTabsMetadata = async () => {
    const { data: contractTabsMetaData } = await GET(
      `contract-managment-service/contracts/${contractId}/contractTabsMetaData`
    );
    setContractTabsMetaData(contractTabsMetaData)
    getShowPrevContractDataAlert(contractTabsMetaData?.contractedServicesUpdated)
  }

  const getContractedServices = async () => {
    const { data: contractedServices } = await GET(`contract-managment-service/contracts/${contractId}/ContractedService`);
    setContractedServices(contractedServices?.contractedServices);
  }

  const getUserData = async () => {
    const { data: userData } = await GET(`user-management-service/user?contractID=${contractId}`);
    if (userData) {
      setUsers(userData?.filter(user => !user?.contracts?.map(data => data?.id)?.includes(''))?.map(data => data));
    }
    setIsLoading(false);
  }

  const handleDeleteService = async () => {
    setServiceToDelete(contractedServices?.filter((data, index) => contractToDelete?.includes(index))?.map(data => data?.refId)[0])
    updateTimesheet(contractedServices, contractedServices?.filter((data, index) => !contractToDelete?.includes(index))?.map(data => data)[0]);
    let formattedData = {
      contractedServices: contractedServices?.filter((data, index) => !contractToDelete?.includes(index))?.map(data => data)
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
    getContractedServices();
    getTabDataStatus();
  }

  const updateTimesheet = async (services, serviceSelected) => {
    const { data: timesheetSubmissionTerms } = await GET(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`);
    let temp = [];

    if (timesheetSubmissionTerms?.timesheetActivitiesPeriods?.length === 1) {
      services?.filter(data => data?.refId !== serviceToDelete)?.map(data => {
        temp.push({ activityType: { activityType: data?.activityType?.activityType }, performingActivity: { activity: data?.activities?.map(data => data?.activity)?.join('-') } })
      })
      timesheetSubmissionTerms.timesheetActivitiesPeriods[0].activities = temp;
    } else {
      timesheetSubmissionTerms.timesheetActivitiesPeriods?.map(data => {
        data.activities = [];
      })
    }
    const response = await PUT(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`, JSON.stringify(timesheetSubmissionTerms));
    if (response) {
      console.log('Successfully Updated Timesheet Activities')
    }
    else {
      console.log('Unexpected Error');
    }

  }

  const onClickFunction = (data, index) => {
    getEditServiceDialog(true);
    setSelectedService(data);
    setSelectedContractServiceIndex(index);
  }

  const onClickCrossFunction = (data, index) => {
    let temp = [];
    setServiceToDelete(data?.refId);
    setShowDeleteConfirmation(true);
    temp.push(index);
    temp.push(contractedServices?.findIndex(service => service?.activityResponse?.dataMap?.selectedActivityId === data?.refId));
    setContractToDelete(temp);
  }

  let dataStatus = [];
  let activityType = [];
  let specificActivity = [];
  let specificActivityHoverText = [];
  let appliesTo = [];
  let appliesToHoverText = [];
  let billable = [];
  let deleteIcon = [];
  let firstTimeCheckIcon = [];
  let firstTimeCheckIconText = [];
  const getDataStatus = () => {
    let tabsValid = validateTabs(contractId);
    tabsValid?.then(response => {
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
    firstTimeCheckIcon = [];
    firstTimeCheckIconText = [];

    contractedServices?.map((data, index) => {
      let billableValue = data?.billableService;
      if (data?.activityTypeTemplate?.activityTypeTemplate === ADMINISTRATIVE) {
        data?.activityResponse?.dataMap?.adminActivities?.map(item => {
          if (item?.billable) {
            billableValue = true;
          }
        })
      } else {
        billableValue = data?.billableService;
      }
      dataStatus.push(servicesValid?.[index]?.length === 0 ? <TaskAltOutlinedIcon style={{ color: "#14B15A" }} /> : <WarningAmberIcon style={{ color: "#FF6562" }} />);
      activityType.push(data?.activityType?.activityType);
      specificActivity.push(data?.activities?.length > 1 ? `${data?.activities?.length} Activities` : data?.activities?.[0]?.activity || '-');
      specificActivityHoverText.push(data?.activities?.map(data => data?.activity) || '-');
      appliesTo.push(data?.users?.[0]?.name?.firstName || '-');
      appliesToHoverText.push(data?.users?.map(user => user?.name?.firstName) || '-');
      billable.push(billableValue ? 'YES' : 'NO');
      deleteIcon.push(<CloseOutlinedIcon style={{ color: "#F94848" }} />);
      if (!isNewContract) {
        firstTimeCheckIcon.push(contractTabsMetaData?.contractedServices?.filter(tabData => tabData?.refId === data?.refId)[0]?.updated ? <ThumbUpAltIcon style={{ color: "#14B15A" }} /> : <ReportGmailerrorredIcon style={{ color: "#F94848" }} />);
        firstTimeCheckIconText.push(contractTabsMetaData?.contractedServices?.filter(tabData => tabData?.refId === data?.refId)[0]?.updated ? 'Service Data Verified' : 'Previous Contract Data Have Been Copied To This Contract. After Verifying The Data Press Continue In The Specific Service.');
      }
    })

    return selectContractInfo === 'INDIVIDUAL' ? [
      { "type": "icon", "icon": dataStatus },
      { "type": "text", "value": activityType, "onClickFunction": onClickFunction },
      { "type": "textWithHover", "value": specificActivity, "hoverText": specificActivityHoverText, "onClickFunction": onClickFunction },
      // { "type": "textWithHover", "value": appliesTo, "hoverText": appliesToHoverText, "onClickFunction": onClickFunction },
      { "type": "text", "value": billable, "onClickFunction": onClickFunction },
      ...!isNewContract ? [{ "type": "icon", "icon": firstTimeCheckIcon, "hoverText": firstTimeCheckIconText, 'isShowHoverText': true }] : [],
      ...sessionStorage.getItem('isEditable') === 'true' ? [{ "type": "text", "value": deleteIcon, "onClickFunction": onClickCrossFunction }] : [],

    ] : [
      { "type": "icon", "icon": dataStatus },
      { "type": "text", "value": activityType, "onClickFunction": onClickFunction },
      { "type": "textWithHover", "value": specificActivity, "hoverText": specificActivityHoverText, "onClickFunction": onClickFunction },
      { "type": "textWithHover", "value": appliesTo, "hoverText": appliesToHoverText, "onClickFunction": onClickFunction },
      { "type": "text", "value": billable, "onClickFunction": onClickFunction },
      ...!isNewContract ? [{ "type": "icon", "icon": firstTimeCheckIcon, "hoverText": firstTimeCheckIconText, 'isShowHoverText': true }] : [],
      ...sessionStorage.getItem('isEditable') === 'true' ? [{ "type": "text", "value": deleteIcon, "onClickFunction": onClickCrossFunction }] : [],
    ];
  }

  console.log('servicesValid', servicesValid, isEditable, sessionStorage.getItem('isEditable'))

  if (isLoading) {
    return <LoadingScreen text={['Sit Back And Relax', 'Loading Your Details']} />
  }

  return (
    <>
      {userLength !== 0 ? (
        <div className={style.cloneBlockStyle}>
          <div className={style.tableHeight}>
            {contractStatus === "DRAFT" && <button className={`${style.addCotractorButton} ${style.selectedColor} ${style.cursorPointer} ${style.floatRight} ${style.marginBottom}`} onClick={() => setAddService(true)}>ADD SERVICE</button>}
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
                hidePagination={true}
                tableHeaderValues={tableHeaderValues}
                tableDataValues={getServiceProviderValues()}
                tableData={contractedServices}
                gridStyle={selectContractInfo === 'INDIVIDUAL' && !isEditable ? style.serviceSpecificationGridIndividualActive : selectContractInfo === 'INDIVIDUAL' ? style.serviceSpecificationGridIndividual : selectContractInfo === 'MULTIPLE' && !isEditable ? style.serviceSpecificationGridActive : style.serviceSpecificationGrid}
              />
            </div>
          </div>
          {contractStatus === "DRAFT" &&
            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
              <button className={`${style.newContractButtonStyle}  ${style.cursorPointer}`} onClick={() => { getCurrentPage('Contractor Business Entity') }}>BACK</button>
              <div>
                <button className={`${style.newContractButtonStyle}  ${style.cursorPointer} ${style.marginLeft20}`} onClick={() => { getViewPage6(true); getCurrentPage('Timesheet Submission Terms'); }}>CONTINUE</button>
              </div>
            </div>
          }

          {
            (addService || editService) &&
            <AddServiceProvided getAddServiceDialog={getAddServiceDialog} getAddOn={getAddOn} contractId={contractId} selectContractInfo={selectContractInfo} selectedService={selectedService} editService={editService} getEditServiceDialog={getEditServiceDialog} isMultiSiteEntity={isMultiSiteEntity} selectedIndex={selectedContractServiceIndex} isEditable={isEditable} getTabDataStatus={getTabDataStatus} contractTabsMetaData={contractTabsMetaData} />
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
          (
          <RedirectingPopUp getCurrentPage={getCurrentPage} tabName={'Contracted Services Provider(s)'} title={'NO USERS FOUND'} description={'No Contracted Service Provider Is Found.'} buttonText={'ADD CONTRACTOR'} />
          )
        </>
      )}
    </>
  )
}

export default ServiceSpecification;
