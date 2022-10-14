import React from 'react';
import Filter from './../../images/filter.png';
import PrintIcon from './../../images/printIcon.png';
import File from './../../images/file.png';
import ContractTiles from './contractTiles';
import {PUT} from './../dataSaver';
import {SuccessToaster,ErrorToaster} from './../../utils/toaster';
import SearchBar from './../../Components/SearchBar';
import UserCard from './userCard';
import LeftStatsCard from '../../Components/LeftStatsCard';
import Table from '../../Components/TableDesign';

import style from './index.module.scss';

const Draft = ({getSelectedContract, getDeleteDraftDialog, getContractActivationDialog, getAddContract, draftContracts, selectedContract, users, activeContractsLength, draftContractsLength, upcomingContractsLength, expiredContractsLength, getContracts,getNewContract, getContractType, getSelectedContractType, getContractIdFromActive,}) => {
    const tableHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "ACTIVATION STATUS", "MANAGER", "LAST UPDATED", "LAST UPDATED BY", "ACTION"];

    const activateContracts = async(id) => {
      let status = 'ACTIVE';
      await PUT(`contract-managment-service/contracts/${id}/contractStatus/${status}`)
      .then(response=>{SuccessToaster('Contract Activated Successfully');getContracts();})
      .catch(error=>{ErrorToaster('Contract Activation Failed');})
    };

    let dot = [];
    let contractType = [];
    let contractId = [];
    let name = [];
    let activationStatus = [];
    let manager = [];
    let lastUpdated = [];
    let lastUpdatedBy = [];
    let action = [];

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

        draftContracts?.map(data=> 
        {
            dot.push('yellow');
            contractType.push(data?.contractType);
            contractId.push(data?.contractDetail?.contractId?.id);
            name.push(data?.contractName?.contractName);
            activationStatus.push(data?.status);
            manager.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
            lastUpdated.push('08-01-2022')
            lastUpdatedBy.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
            action.push(true)
        })

        return [
            {"type": "dot", "value": dot},
            {"type": "text", "value": contractType},
            {"type": "text", "value": contractId},
            {"type": "text", "value": name},
            {"type": "text", "value": activationStatus},
            {"type": "text", "value": manager},
            {"type": "text", "value": lastUpdated},
            {"type": "text", "value": lastUpdatedBy},
            {"type": "action", "value": action},
        ];
    }

    const actionsData = [{'data': 'Delete Contract', 'onClick': getDeleteDraftDialog, 'requiredValue': 'boolean'},
        {'data': 'Activate Contract', 'onClick': activateContracts, 'requiredValue': 'id'}]

    return(
        <div className={style.margin20}>
            <div className={`${style.bigCardGrid}`}>
                <UserCard />
                <ContractTiles getSelectedContract={getSelectedContract} selectedContract={selectedContract}
                activeContractsLength={activeContractsLength}
                draftContractsLength={draftContractsLength}
                upcomingContractsLength={upcomingContractsLength}
                expiredContractsLength={expiredContractsLength} />
            </div>
            <div className={style.bigCardGrid}>
                <LeftStatsCard />
                <div className={style.bigCardStyle}>
                    <div className={style.spaceBetween}>
                        <div className={`${style.displayInRow} ${style.marginTop20}`}>
                            <p className={`${style.blue} ${style.activeContractsWidth}`}>DRAFT CONTRACTS</p>
                            <SearchBar />
                            <img src={File} alt="File" className={style.smallIcons} />
                            <img src={PrintIcon} alt="PrintIcon" className={style.smallIcons} />
                            <img src={Filter} alt="Filter" className={style.filterIcon} />
                        </div>
                        <button className={style.contractButton} onClick={() => getAddContract(true)} >ADD CONTRACT</button>
                    </div>
                    <Table
                        tableHeaderValues={tableHeaderValues} 
                        tableDataValues={getDraftContractsValues()}
                        tableData={draftContracts}
                        getNewContract={getNewContract}
                        getContractType={getContractType}
                        getSelectedContractType={getSelectedContractType}
                        getContractIdFromActive={getContractIdFromActive}
                        gridStyle={style.draftContractGrid}
                        actions={actionsData}
                    />
                </div>
            </div>
            <div className={style.spaceBetween}>
                <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
                <p className={style.poweredBy}>© TimeSmart.AI</p>
            </div>
        </div>
    )
}

<<<<<<< HEAD
export default Draft;
=======
export default Draft;
>>>>>>> b3f0a82b8137ce2b8862b66e3f59a9f119f4eb43
