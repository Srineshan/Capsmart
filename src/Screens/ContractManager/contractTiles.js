import React from 'react';
import Tile from './../../Components/Tile';
import style from './index.module.scss';

const ContractTiles = ({getSelectedContract, selectedContract, activeContractsLength, draftContractsLength, upcomingContractsLength, expiredContractsLength}) => {
    return(
        <div className={style.grid4}>
            <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="ACTIVE CONTRACTS" bigNumber={activeContractsLength} smallNum1="0" smallNum2="0" smallText1="AUTO RENEWED" smallText2="EXPIRING IN 30 DAYS" currentTile="active contract" topText=''/>
            <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="DRAFT" bigNumber={draftContractsLength} smallNum1="0" smallNum2="0" smallText1="ACTIVATION IN-PROGRESS" smallText2="ACTIVATION PAST DUE" currentTile="draft" topText=''/>
            <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="UPCOMING RENEWALS" bigNumber={upcomingContractsLength} smallNum1="0" smallNum2="0" smallText1="EXTENSION REQUIRED" smallText2="NEW CONTRACT REQUIRED" currentTile="upcoming renewals" topText='NEXT 30 DAYS'/>
            <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="EXPIRED / TERMINATED" bigNumber={expiredContractsLength} smallNum1="0" smallNum2="0" smallText1="EXPIRED" smallText2="TERMINATED" currentTile="expired or terminated" topText='LAST 30 DAYS'/>
        </div>
    )
}

export default ContractTiles;
