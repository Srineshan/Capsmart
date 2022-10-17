import React from 'react';
import Filter from './../../images/filter.png';
import PrintIcon from './../../images/printIcon.png';
import File from './../../images/file.png';
import GreenPage from './../../images/greenPage.png';
import ContractTiles from './contractTiles';
import SearchBar from './../../Components/SearchBar';
import {format} from 'date-fns';
import UserCard from './userCard';
import Table from '../../Components/TableDesign';
import LeftStatsCard from '../../Components/LeftStatsCard';

import style from './index.module.scss';

const ActiveContracts = ({getSelectedContract, getAddContract, getExtensionDialog, getTerminationDialog, getCloneDialog, activeContracts, getNewContract, getContractType, getSelectedContractType, getContractIdFromActive, selectedContract, users, activeContractsLength, draftContractsLength, upcomingContractsLength, expiredContractsLength}) => {
    const tableHeaderValues = ["", "CONTRACT TYPE", "ID", "NAME", "CONTRACTORS", "EFFECTIVE DATE", "POD STATUS", "MANAGER", "LAST UPDATED", "ACTION"];

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

         activeContracts?.map(data=>
        {
            dot.push('green');
            contractType.push(data?.contractType);
            contractId.push(data?.contractDetail?.contractId?.id);
            name.push(data?.contractName?.contractName);
            contractors.push("-");
            effectiveDate.push(format(new Date(data?.contractDetail?.contractTerm?.effectiveDate), 'MM-dd-yyyy'));
            podStatus.push({"value": "5", "src": GreenPage});
            manager.push(`${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} ${users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}`);
            lastUpdated.push('08-01-2022')
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

    const actionsData = [{'data': 'Contract Extension', 'onClick': getExtensionDialog, 'requiredValue': 'boolean'},
        {'data': 'Contract Termination', 'onClick': getTerminationDialog, 'requiredValue': 'boolean'},
        {'data': 'Clone Contract', 'onClick': getCloneDialog, 'requiredValue': 'boolean'}]

    const handleAddContract = () => {
        getAddContract(true);
    }

    console.log(getExtensionDialog)

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
                            <p className={`${style.blue} ${style.activeContractsWidth}`}>ACTIVE CONTRACTS</p>
                            <SearchBar />
                            <img src={File} alt="File" className={style.smallIcons} />
                            <img src={PrintIcon} alt="PrintIcon" className={style.smallIcons} />
                            <img src={Filter} alt="Filter" className={style.filterIcon} />
                        </div>
                        <button className={style.contractButton} onClick={() => {handleAddContract()}} >ADD CONTRACT</button>
                    </div>
                    <Table
                        tableHeaderValues={tableHeaderValues}
                        tableDataValues={getActiveContractsValues()}
                        tableData={activeContracts}
                        getNewContract={getNewContract}
                        getContractType={getContractType}
                        getSelectedContractType={getSelectedContractType}
                        getContractIdFromActive={getContractIdFromActive}
                        gridStyle={style.activeContractGrid}
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

export default ActiveContracts;
