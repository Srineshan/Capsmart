import React from 'react';
import Tile from './../../Components/Tile';
import style from './index.module.scss';

const ContractTiles = ({metadata, getSelectedContract, selectedContract, activeContractsLength, draftContractsLength, upcomingContractsLength, expiredContractsLength}) => {
    return(
        <div className={style.grid4}>
          <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="ACTIVE CONTRACTS" bigNumber={metadata?.activeContract?.activeContractCount || '-'} smallNum1={'-'} smallNum2={metadata?.activeContract?.expiredIn30DaysCount} smallText1="AUTO RENEWED" smallText2="EXPIRING IN 30 DAYS" currentTile="activecontracts" topText=''/>
          <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="DRAFT" bigNumber={metadata?.draft?.draftCount || '-'} smallNum1={'-'} smallNum2={'-'} smallText1="ACTIVATION IN-PROGRESS" smallText2="ACTIVATION PAST DUE" currentTile="draft" topText=''/>
          <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="UPCOMING RENEWALS" bigNumber={'-'} smallNum1={'-'} smallNum2={"-"} smallText1="EXTENSION REQUIRED" smallText2="NEW CONTRACT REQUIRED" currentTile="upcomingrenewals" topText='NEXT 30 DAYS'/>
          <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="EXPIRED / TERMINATED" bigNumber={metadata?.expiredOrTerminatedContract?.expiredOrTerminatedContractCount || '-'} smallNum1={'-'} smallNum2={"-"} smallText1="EXPIRED" smallText2="TERMINATED" currentTile="expired/terminated" topText='LAST 30 DAYS'/>
        </div>
    )
}

export default ContractTiles;
