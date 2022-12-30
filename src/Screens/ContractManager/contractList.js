import React, { useState, useEffect } from 'react';
import Download from './../../images/downloadLightColor.png';
import PrintIcon from './../../images/printIcon.png';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import Popover from '@mui/material/Popover';
import GreenPage from './../../images/greenPage.png';
import ContractTiles from './contractTiles';
import SearchBar from './../../Components/SearchBar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { GET, PUT, POST } from './../dataSaver';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { SuccessToaster, ErrorToaster } from './../../utils/toaster';
import { currentUser } from './../../utils/auth';
import { format } from 'date-fns';
import UserCard from './userCard';
import Table from '../../Components/TableDesign';
import LeftStatsCard from '../../Components/LeftStatsCard';

import {validateTimesheetSubmission} from './contractValidation';

import style from './index.module.scss';
import SideBar from '../../Components/Sidebar';

const ContractList = ({ getSearchKey, getDeleteDraftDialog, contracts, getSelectedContract, getContracts, getAddContract, getExtensionDialog, getTerminationDialog, getCloneDialog, activeContracts, getNewContract, getContractType, getSelectedContractType, getContractIdFromActive, selectedContract, users, getSelectedPage, totalCount, page }) => {
  const activeHeaderValues = ["", "", "CONTRACT TYPE", "ID",
    // "",
    "NAME", "CONTRACTORS",
    "EFFECTIVE DATE",
    // "POD STATUS",
    "LAST UPDATED"];
  const draftHeaderValues = ["", "CONTRACT TYPE", "ID",
    // "",
    "NAME", "ACTIVATION STATUS", "LAST UPDATED",
    // "REF DOCS",
    "LAST UPDATED BY", "MANAGER", "ACTION"];
  const activationPendingHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "REVIEWS", "APPROVALS", "REF DOCS", "GO LIVE DATE", "EFFECTIVE DATE", "MANAGER", "ACTION"];
  const upcomingHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "EXPIRATION DATE", "EXPIRING IN", "LAST UPDATE", "MANAGER", "ACTION"];
  const expiredHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "TERMINATION DATE", "NEW CONTRACT ID", "LAST UPDATE", "MANAGER"];
  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isDownloadClicked, setIsDownloadClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMyContract, setIsMyContract] = useState(true);
  const [isDraft, setIsDraft] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const currentUserData = currentUser();
  const [metadata, setMetadata] = useState();
  const activateContracts = async (data) => {
    let status = 'ACTIVE';
    let activationData = {
      "contractActivation": {
        "activationNotes": {
          "notes": ""
        },
        "activatedBy": {
          "id": currentUserData?.id,
          "name": {
            "firstName": currentUserData?.firstName,
            "lastName": currentUserData?.lastName
          },
          "email": {
            "officialEmail": currentUserData?.email
          }
        }
      }
    }
    await PUT(`contract-managment-service/contracts/${data?.id}/contractStatus/${status}`, activationData)
      .then(response => {
        SuccessToaster('Contract Activated Successfully');
        getContracts();
        getContractsMetadata();
      })
      .catch(error => { ErrorToaster('Contract Activation Failed'); })
  };

  const contractExtension = (data) => {
    getExtensionDialog(true);
    getContractIdFromActive(data?.id);
  }

  const contractTermination = (data) => {
    getTerminationDialog(true);
    getContractIdFromActive(data?.id);
  }

  const contractClone = (data) => {
    getCloneDialog(true);
    getContractIdFromActive(data?.id);
  }

  const deleteDraft = (data) => {
    getDeleteDraftDialog(true);
    getContractIdFromActive(data?.id);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setIsPrintClicked(false);
    setAnchorEl(null);
  };

  useEffect(() => {
    getContractsMetadata();
  }, [])

  const getContractors = (id) => {
    let contractedUsers = [];
    users?.filter(user => user?.contracts?.map(contract => contract?.roles?.map(role => role?.roleName)?.includes('Activity Logger') && contract?.id)?.includes(id))?.map(data => {
      let name = `${data?.name?.firstName} ${data?.name?.lastName || ''}`
      contractedUsers.push(name);
    });
    return contractedUsers;
  }

  const onClickFunction = (data) => {
    getNewContract(true);
    getContractType(data?.contractType);
    getSelectedContractType('New Contract');
    getContractIdFromActive(data?.id);
  }

  let dot = [];
  let notification = [];
  let contractType = [];
  let contractId = [];
  let lock = [];
  let lockHoverText = [];
  let icon = [];
  let iconHoverText = [];
  let podHoverText = [];
  let name = [];
  let reviews = [];
  let approvals = [];
  let goLiveDate = [];
  let contractors = [];
  let effectiveDate = [];
  let expirationDate = [];
  let expiringIn = [];
  let podStatus = [];
  let manager = [];
  let lastUpdated = [];
  let action = [];
  let activationStatus = [];
  let lastUpdatedBy = [];
  let contractorHoverText = [];

  const getActiveContractsValues = () => {
    dot = [];
    notification = [];
    contractType = [];
    contractId = [];
    lock = [];
    lockHoverText = [];
    podHoverText = [];
    contractorHoverText = [];
    name = [];
    contractors = [];
    effectiveDate = [];
    podStatus = [];
    //  manager = [];
    lastUpdated = [];
    action = [];

    contracts?.map(data => {
      let contractorList = getContractors(data?.id);
      dot.push('green');
      notification.push(<WarningAmberIcon style={{ color: '#FF6562' }} />);
      contractType.push(data?.contractType);
      contractId.push(data?.contractDetail?.contractId?.id || '-');
      lock.push(<LockOpenOutlinedIcon style={{ color: '#14B15A' }} />)
      lockHoverText.push('Contract available for other contract managers to access & work on');
      podHoverText.push(['Medical Lic Cer { Contrname}', 'Medical Lic Cer { Contrname}']);
      contractorHoverText.push(contractorList)
      notification.push(<WarningAmberIcon style={{ color: '#FF6562' }} />);
      name.push(data?.contractName?.contractName);
      contractors.push(contractorList?.length?.toString() || '');
      effectiveDate.push(format(new Date(data?.contractDetail?.contractTerm?.effectiveDate), 'MM-dd-yyyy'));
      // podStatus.push("3");
      manager.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
      lastUpdated.push(format(new Date(data?.lastModifiedDate), 'MM-dd-yyyy'))
      action.push(true);
    })

    return [
      { "type": "dot", "value": dot },
      { "type": "icon", "icon": notification },
      { "type": "text", "value": contractType, "onClickFunction": onClickFunction },
      { "type": "text", "value": contractId, "onClickFunction": onClickFunction },
      // { "type": "icon", "icon": lock, "hoverText": lockHoverText, 'isShowHoverText': true },
      { "type": "text", "value": name, "onClickFunction": onClickFunction },
      { "type": "iconWithCount", "value": contractors, "hoverText": contractorHoverText, 'isShowHoverText': true, "icon": <GroupOutlinedIcon style={{ fontSize: 20, color: '#857AEF' }} /> },
      { "type": "text", "value": effectiveDate, "onClickFunction": onClickFunction },
      // { "type": "iconWithCount", "value": podStatus, "hoverText": podHoverText, 'isShowHoverText': true, "icon": <TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#14B15A' }} /> },
      // {"type": "text", "value": manager, "onClickFunction": onClickFunction},
      { "type": "text", "value": lastUpdated, "onClickFunction": onClickFunction },
      // {"type": "action", "value": action},
    ];
  }

  const getDraftContractsValues = () => {
    dot = [];
    icon = [];
    iconHoverText = [];
    contractType = [];
    contractId = [];
    name = [];
    activationStatus = [];
    effectiveDate = [];
    manager = [];
    lastUpdated = [];
    lastUpdatedBy = [];
    action = [];

    console.log('validateContractIDTermLimit', validateTimesheetSubmission(contracts?.[0]))

    contracts?.map(data => {
      dot.push('yellow');
      contractType.push(data?.contractType);
      contractId.push(data?.contractDetail?.contractId?.id);
      lock.push(<LockOpenOutlinedIcon style={{ color: '#14B15A' }} />)
      lockHoverText.push('Contract available for other contract managers to access & work on');
      name.push(data?.contractName?.contractName);
      reviews.push('1/1');
      approvals.push('3/3');
      goLiveDate.push('07/19/2019');
      activationStatus.push(data?.status);
      icon.push(<TextSnippetOutlinedIcon style={{ color: '#F94848' }} />);
      iconHoverText.push('No Document Uploaded');
      effectiveDate.push(format(new Date(data?.contractDetail?.contractTerm?.effectiveDate), 'MM-dd-yyyy'));
      manager.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
      lastUpdated.push(format(new Date(data?.lastModifiedDate), 'MM-dd-yyyy'))
      lastUpdatedBy.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
      action.push(true)
    })

    return isDraft ? [
      { "type": "dot", "value": dot },
      { "type": "text", "value": contractType, "onClickFunction": onClickFunction },
      { "type": "text", "value": contractId, "onClickFunction": onClickFunction },
      // { "type": "icon", "icon": lock, "hoverText": lockHoverText, 'isShowHoverText': true },
      { "type": "text", "value": name, "onClickFunction": onClickFunction },
      { "type": "text", "value": activationStatus, "onClickFunction": onClickFunction },
      { "type": "text", "value": lastUpdated, "onClickFunction": onClickFunction },
      // { "type": "icon", "icon": icon, "hoverText": iconHoverText, 'isShowHoverText': true },
      { "type": "text", "value": lastUpdatedBy, "onClickFunction": onClickFunction },
      { "type": "text", "value": manager, "onClickFunction": onClickFunction },
      { "type": "action", "value": action },
    ] : [
      { "type": "dot", "value": dot },
      { "type": "text", "value": contractType, "onClickFunction": onClickFunction },
      { "type": "text", "value": contractId, "onClickFunction": onClickFunction },
      { "type": "text", "value": name, "onClickFunction": onClickFunction },
      { "type": "text", "value": reviews, "onClickFunction": onClickFunction },
      { "type": "text", "value": approvals, "onClickFunction": onClickFunction },
      { "type": "icon", "icon": icon, "hoverText": iconHoverText, 'isShowHoverText': true },
      { "type": "text", "value": goLiveDate, "onClickFunction": onClickFunction },
      { "type": "text", "value": effectiveDate, "onClickFunction": onClickFunction },
      { "type": "text", "value": manager, "onClickFunction": onClickFunction },
      { "type": "action", "value": action },
    ];
  }

  const getUpcomingContractsValues = () => {
    dot = [];
    contractType = [];
    contractId = [];
    name = [];
    expirationDate = [];
    expiringIn = [];
    manager = [];
    lastUpdated = [];
    action = [];

    contracts?.map(data => {
      dot.push('yellow');
      contractType.push(data?.contractType);
      contractId.push(data?.contractDetail?.contractId?.id);
      name.push(data?.contractName?.contractName);
      expirationDate.push('07/19/2019');
      expiringIn.push('15 days');
      manager.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
      lastUpdated.push(format(new Date(data?.lastModifiedDate), 'MM-dd-yyyy'))
      action.push(true)
    })

    return [
      { "type": "dot", "value": dot },
      { "type": "text", "value": contractType, "onClickFunction": onClickFunction },
      { "type": "text", "value": contractId, "onClickFunction": onClickFunction },
      { "type": "text", "value": name, "onClickFunction": onClickFunction },
      { "type": "text", "value": expirationDate, "onClickFunction": onClickFunction },
      { "type": "text", "value": expiringIn, "onClickFunction": onClickFunction },
      { "type": "text", "value": lastUpdated, "onClickFunction": onClickFunction },
      { "type": "text", "value": manager, "onClickFunction": onClickFunction },
      { "type": "action", "value": action },
    ];
  }

  const activeActionsData = [
    // {'data': 'Contract Extension', 'onClick': contractExtension, 'requiredValue': 'boolean'},
    //   {'data': 'Contract Termination', 'onClick': contractTermination, 'requiredValue': 'boolean'},
    //   {'data': 'Clone Contract', 'onClick': contractClone, 'requiredValue': 'boolean'}
  ]

  const draftActionsData = [
    // {'data': 'Delete Contract', 'onClick': deleteDraft, 'requiredValue': 'boolean'},
    { 'data': 'Activate Contract', 'onClick': activateContracts, 'requiredValue': 'id' },
    // {'data': 'Share', 'onClick': activateContracts, 'requiredValue': 'id'}
  ]

  const upcomingActionsData = [
    // {'data': 'Renew Existing Contract', 'onClick': deleteDraft, 'requiredValue': 'boolean'},
    { 'data': 'Extend Contract', 'onClick': activateContracts, 'requiredValue': 'id' },
    // {'data': 'Terminate Contract', 'onClick': activateContracts, 'requiredValue': 'id'}
  ]


  const handleAddContract = () => {
    getAddContract(true);
  }

  const getContractsMetadata = async () => {
    const { data: contractMetadata } = await GET(`contract-managment-service/contracts/metadata`);
    setMetadata(contractMetadata);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  }

  let tableHeaderValues = selectedContract === 'activecontracts' ? activeHeaderValues : selectedContract === 'draft' ? (isDraft ? draftHeaderValues : activationPendingHeaderValues) : selectedContract === 'upcomingrenewals' ? upcomingHeaderValues : expiredHeaderValues;
  let tableDataValues = selectedContract === 'activecontracts' ? getActiveContractsValues() : selectedContract === "draft" ? getDraftContractsValues() : getUpcomingContractsValues();
  let actions = selectedContract === 'activecontracts' ? activeActionsData : draftActionsData;
  let gridStyle = selectedContract === 'activecontracts' ? style.activeContractGridWithoutAction : selectedContract === "draft" ? (isDraft ? style.draftContractGrid : style.activationPendingContractGrid) : selectedContract === "upcomingrenewals" ? style.upcomingContractGrid : style.expiredContractGrid;
  // let gridStyle = selectedContract === 'activecontracts' ? style.activeContractGrid : style.draftContractGrid;

  return (
    <div className={style.margin20}>
      <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
        <div>
          <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
            <LeftStatsCard metadata={metadata} />
          </SideBar>
        </div>
        <div>
          <ContractTiles getSelectedContract={getSelectedContract} selectedContract={selectedContract}
            metadata={metadata} />
          <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
            <div className={`${style.spaceBetween} ${style.marginLeftRight20}`}>
              <div className={`${style.displayInRow} ${style.marginTop20}`}>
                {selectedContract === 'activecontracts' ? (
                  <>
                    <button className={isMyContract ? style.myActiveContractsButton : style.otherContractsButton} onClick={() => setIsMyContract(true)}>My Active Contracts ( {metadata?.activeContract?.activeContractCount} )</button>
                    {
                      // <button className={`${!isMyContract ? style.myActiveContractsButton : style.otherContractsButton} ${style.marginLeft20}`} onClick={() => setIsMyContract(false)}>Other Contracts ( 150 )</button>
                    }
                  </>
                ) : selectedContract === 'draft' ? (
                  <>
                    <button className={isDraft ? style.myActiveContractsButton : style.otherContractsButton} onClick={() => setIsDraft(true)}>Draft Contracts ( {metadata?.draft?.draftCount} )</button>

                    {
                      // <button className={`${!isDraft ? style.myActiveContractsButton : style.otherContractsButton} ${style.marginLeft20}`} onClick={() => setIsDraft(false)}>Activation Pending ( 2 )</button>
                    }
                  </>
                ) : selectedContract === 'upcomingrenewals' ? (
                  <>
                    <button className={style.myActiveContractsButton} >Upcoming Renewals ( - )</button>
                  </>
                ) : (
                  <>
                    <button className={style.myActiveContractsButton} >Expired / Terminated ( - )</button>
                  </>
                )}
              </div>
              <div className={`${style.displayInRow} ${style.marginTop20} ${style.marginLeft}`}>
                <div className={style.marginLeft}>
                  <SearchBar getSearchKey={getSearchKey} />
                </div>
                {
                  //   <div className={`${isDownloadClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft}`} onClick={() => setIsDownloadClicked(!isDownloadClicked)}>
                  //     <DownloadIcon sx={{ fontSize: isDownloadClicked ? 20 : 25, color: isDownloadClicked ? '#fff' : '#857AEF' }} />
                  //   </div>
                  //   <div className={`${isPrintClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft}`} onClick={() => setIsPrintClicked(!isPrintClicked)}>
                  //     <PrintOutlinedIcon sx={{ fontSize: isPrintClicked ? 20 : 25, color: isPrintClicked ? '#fff' : '#857AEF' }} onClick={(e) => handleClick(e)} aria-describedby={id} />
                  //     <Popover
                  //       id={id}
                  //       open={open}
                  //       anchorEl={anchorEl}
                  //       onClose={handleClose}
                  //       anchorOrigin={{
                  //         vertical: 'bottom',
                  //         horizontal: 'left',
                  //       }}
                  //     >
                  //       <div className={style.actionsCard}>
                  //         <div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => { handleClose() }}>Contract Master List</div>
                  //         <div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => { handleClose() }}>One Time Contracts With Termination Date</div>
                  //         <div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => { handleClose() }}>Contracts With Written Continuation Policy</div>
                  //         <div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => { handleClose() }}>Contracts In Auto-Renewal Mode</div>
                  //       </div>
                  //     </Popover>
                  //   </div>
                  //
                }
                <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft}`} onClick={() => { handleAddContract() }}>
                  <AddCircleOutlineIcon sx={{ fontSize: 20, color: 'white' }} />
                </div>
              </div>
            </div>

            <Table
              tableHeaderValues={tableHeaderValues}
              tableDataValues={tableDataValues}
              tableData={contracts}
              getNewContract={getNewContract}
              getContractType={getContractType}
              getSelectedContractType={getSelectedContractType}
              getContractIdFromActive={getContractIdFromActive}
              gridStyle={gridStyle}
              actions={actions}
              getSelectedPage={getSelectedPage}
              totalCount={totalCount}
              page={page}
              scrollStyle={style.contractScrollStyle}
            />
            {/* <div className={`${style.noContractsBox} ${style.alignCenter}`}>
                      <div>
                        <div className={style.noContractsFontStyle}>There are no contracts for you to manage.</div>
                        <div className={`${style.displayInRow} ${style.justifyCenter} ${style.marginTop20}`}>
                          <div className={style.noContractsSmallFontStyle}>To add a new contract click on </div>
                          <div className={`${style.addSmallStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft20}`} onClick={() => {handleAddContract()}}>
                            <AddCircleOutlineIcon sx={{ fontSize: 15, color: 'white' }} />
                          </div>
                        </div>
                        <a><div className={`${style.linkStyle} ${style.marginTop10}`}>Click To View A Short Tutorial On How To Add A Contract</div></a>
                      </div>
                    </div> */}
          </div>
        </div>
      </div>
      <div className={style.spaceBetween}>
        <p className={style.poweredBy}>Powered by - TimeSmartAI</p>
        <p className={style.poweredBy}>© {new Date().getFullYear()} TimeSmartAI</p>
      </div>
    </div>
  )
}

export default ContractList;
