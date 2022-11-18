import React, {useState, useEffect} from 'react';
import Filter from './../../images/filter.png';
import PrintIcon from './../../images/printIcon.png';
import File from './../../images/file.png';
import GreenPage from './../../images/greenPage.png';
import ContractTiles from './contractTiles';
import SearchBar from './../../Components/SearchBar';
import {GET, PUT, POST} from './../dataSaver';
import {SuccessToaster, ErrorToaster} from './../../utils/toaster';
import {currentUser} from './../../utils/auth';
import {format} from 'date-fns';
import UserCard from './userCard';
import Table from '../../Components/TableDesign';
import LeftStatsCard from '../../Components/LeftStatsCard';

import style from './index.module.scss';

const ContractList = ({getSearchKey, getDeleteDraftDialog,contracts, getSelectedContract,getContracts, getAddContract, getExtensionDialog, getTerminationDialog, getCloneDialog, activeContracts, getNewContract, getContractType, getSelectedContractType, getContractIdFromActive, selectedContract, users, getSelectedPage, totalCount, page}) => {
    const activeHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "CONTRACTORS", "EFFECTIVE DATE", "POD STATUS", "MANAGER", "LAST UPDATED", "ACTION"];
    const draftHeaderValues =  ["", "CONTRACT TYPE", "ID", "NAME", "ACTIVATION STATUS", "MANAGER", "LAST UPDATED", "LAST UPDATED BY", "ACTION"];
    const upcomingHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "EXPIRATION DATE", "EXPIRING IN", "MANAGER", "LAST UPDATE", "ACTION"];
    const expiredHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "TERMINATION DATE", "EXPIRATION DATE", "MANAGER", "LAST UPDATE"];
    const currentUserData = currentUser();
    const [metadata, setMetadata] = useState();
    const activateContracts = async(data) => {
      let status = 'ACTIVE';
      let activationData = {
        "contractActivation": {
          "activationNotes" : {
            "notes":""
          },
          "activatedBy": {
            "id":currentUserData?.id,
            "name" : {
              "firstName" : currentUserData?.firstName,
              "lastName" : currentUserData?.lastName
            },
            "email": {
              "officialEmail" : currentUserData?.email
            }
          }
        }
      }
      await PUT(`contract-managment-service/contracts/${data?.id}/contractStatus/${status}`,activationData)
      .then(response=>
        {SuccessToaster('Contract Activated Successfully');
          getContracts();
          getContractsMetadata();
        })
      .catch(error=>{ErrorToaster('Contract Activation Failed');})
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

    useEffect(()=>{
      getContractsMetadata();
    },[])

    const onClickFunction = (data) => {
        getNewContract(true);
        getContractType(data?.contractType);
        getSelectedContractType('New Contract');
        getContractIdFromActive(data?.id);
    }

    let dot = [];
    let contractType = [];
    let contractId = [];
    let name = [];
    let contractors = [];
    let effectiveDate = [];
    let podStatus = [];
    let manager = [];
    let lastUpdated = [];
    let action = [];
    let activationStatus = [];
    let lastUpdatedBy = [];

    const getActiveContractsValues = () => {
         dot = [];
         contractType = [];
         contractId = [];
         name = [];
         contractors = [];
         effectiveDate = [];
         podStatus = [];
         manager = [];
         lastUpdated = [];
         action = [];

         contracts?.map(data=>
        {
            dot.push('green');
            contractType.push(data?.contractType);
            contractId.push(data?.contractDetail?.contractId?.id);
            name.push(data?.contractName?.contractName);
            contractors.push("-");
            effectiveDate.push(format(new Date(data?.contractDetail?.contractTerm?.effectiveDate), 'MM-dd-yyyy'));
            podStatus.push({"value": "3", "src": GreenPage});
            manager.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
            lastUpdated.push(format(new Date(data?.lastModifiedDate), 'MM-dd-yyyy'))
            action.push(true)
        })

        return [
            {"type": "dot", "value": dot},
            {"type": "text", "value": contractType, "onClickFunction": onClickFunction},
            {"type": "text", "value": contractId, "onClickFunction": onClickFunction},
            {"type": "text", "value": name, "onClickFunction": onClickFunction},
            {"type": "text", "value": contractors, "onClickFunction": onClickFunction},
            {"type": "text", "value": effectiveDate, "onClickFunction": onClickFunction},
            {"type": "imgWithCount", "value": podStatus, "img": GreenPage},
            {"type": "text", "value": manager, "onClickFunction": onClickFunction},
            {"type": "text", "value": lastUpdated, "onClickFunction": onClickFunction},
            {"type": "action", "value": action},
        ];
    }

    const getDraftContractsValues = () => {
         dot = [];
         contractType = [];
         contractId = [];
         name = [];
         activationStatus = [];
         manager = [];
         lastUpdated = [];
         lastUpdatedBy = [];
         action = [];

        contracts?.map(data=>
        {
            dot.push('yellow');
            contractType.push(data?.contractType);
            contractId.push(data?.contractDetail?.contractId?.id);
            name.push(data?.contractName?.contractName);
            activationStatus.push(data?.status);
            manager.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
            lastUpdated.push(format(new Date(data?.lastModifiedDate), 'MM-dd-yyyy'))
            lastUpdatedBy.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
            action.push(true)
        })

        return [
            {"type": "dot", "value": dot},
            {"type": "text", "value": contractType, "onClickFunction": onClickFunction},
            {"type": "text", "value": contractId, "onClickFunction": onClickFunction},
            {"type": "text", "value": name, "onClickFunction": onClickFunction},
            {"type": "text", "value": activationStatus, "onClickFunction": onClickFunction},
            {"type": "text", "value": manager, "onClickFunction": onClickFunction},
            {"type": "text", "value": lastUpdated, "onClickFunction": onClickFunction},
            {"type": "text", "value": lastUpdatedBy, "onClickFunction": onClickFunction},
            {"type": "action", "value": action},
        ];
    }

    const activeActionsData = [
      // {'data': 'Contract Extension', 'onClick': contractExtension, 'requiredValue': 'boolean'},
      //   {'data': 'Contract Termination', 'onClick': contractTermination, 'requiredValue': 'boolean'},
      //   {'data': 'Clone Contract', 'onClick': contractClone, 'requiredValue': 'boolean'}
      ]

    const draftActionsData = [
        // {'data': 'Delete Contract', 'onClick': deleteDraft, 'requiredValue': 'boolean'},
        {'data': 'Activate Contract', 'onClick': activateContracts, 'requiredValue': 'id'},
        // {'data': 'Share', 'onClick': activateContracts, 'requiredValue': 'id'}
      ]


    const handleAddContract = () => {
        getAddContract(true);
    }

    const getContractsMetadata = async() => {
       const {data: contractMetadata} = await GET(`contract-managment-service/contracts/metadata`);
       setMetadata(contractMetadata);
   };

   let tableHeaderValues = selectedContract === 'activecontracts' ? activeHeaderValues : selectedContract === 'draft' ? draftHeaderValues : selectedContract === 'upcomingrenewals' ? upcomingHeaderValues : expiredHeaderValues;
   let tableDataValues = selectedContract === 'activecontracts' ? getActiveContractsValues() : getDraftContractsValues();
   let actions = selectedContract === 'activecontracts' ? activeActionsData : draftActionsData;
   let gridStyle = selectedContract === 'activecontracts' ? style.activeContractGrid : style.draftContractGrid;

   console.log('selectedContract', selectedContract);
    return(
        <div className={style.margin20}>
            <div className={`${style.bigCardGrid}`}>
                <UserCard />
                <ContractTiles getSelectedContract={getSelectedContract} selectedContract={selectedContract}
                metadata={metadata} />
            </div>
            <div className={style.bigCardGrid}>
                <LeftStatsCard metadata={metadata}/>
                <div className={style.bigCardStyle}>
                    <div className={style.spaceBetween}>
                        <div className={`${style.displayInRow} ${style.marginTop20}`}>
                            <p className={`${style.blue} ${style.activeContractsWidth}`}>{selectedContract === 'activecontracts' ? 'ACTIVE CONTRACTS' : selectedContract === 'draft' ? 'DRAFT CONTRACTS' : selectedContract === 'upcomingrenewals' ? 'UPCOMING RENEWALS' : 'EXIPIRED/TERMINATED CONTRACTS'}</p>
                            <SearchBar getSearchKey={getSearchKey}/>
                            {
                              // <img src={File} alt="File" className={style.smallIcons} />
                              // <img src={PrintIcon} alt="PrintIcon" className={style.smallIcons} />
                              // <img src={Filter} alt="Filter" className={style.filterIcon} />
                            }
                        </div>
                        <button className={style.contractButton} onClick={() => {handleAddContract()}} >ADD CONTRACT</button>
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
                    />
                </div>
            </div>
            <div className={style.spaceBetween}>
                <p className={style.poweredBy}>Powered by - TimeSmart.AI</p>
                <p className={style.poweredBy}>© TimeSmart.AI</p>
            </div>
        </div>
    )
}

export default ContractList;
