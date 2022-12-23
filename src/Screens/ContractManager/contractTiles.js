import React from 'react';
import Tile from './../../Components/Tile';
import style from './index.module.scss';

const ContractTiles = ({ metadata, getSelectedContract, selectedContract, activeContractsLength, draftContractsLength, upcomingContractsLength, expiredContractsLength }) => {
  return (
    <div className={style.grid4}>
      <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="ACTIVE CONTRACTS" bigNumber={metadata?.activeContract?.activeContractCount || '-'} smallNum1={'-'} smallNum2={metadata?.activeContract?.expiredIn30DaysCount} smallText1="AUTO RENEWED" smallText2="EXPIRING IN 30 DAYS" currentTile="activecontracts" topText='' bigNumberColor={style.greenBigNumber} smallNum1Color={style.greenSmallNumber} smallNum2Color={style.yellowSmallNumber} smallNum1SelectedColor={style.greenSmallNumberSelected} smallNum2SelectedColor={style.yellowSmallNumberSelected} />
      <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="DRAFT CONTRACTS" bigNumber={metadata?.draft?.draftCount || '-'} smallNum1={'-'} smallNum2={'-'} smallText1="ACTIVATION IN-PROGRESS" smallText2="ACTIVATION PAST DUE" currentTile="draft" topText='' bigNumberColor={style.yellowBigNumber} smallNum1Color={style.yellowSmallNumber} smallNum2Color={style.redSmallNumber} smallNum1SelectedColor={style.yellowSmallNumberSelected} smallNum2SelectedColor={style.redSmallNumberSelected} />
      <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="UPCOMING RENEWALS" bigNumber={'-'} smallNum1={'-'} smallNum2={"-"} smallText1="EXTENSION REQUIRED" smallText2="NEW CONTRACT REQUIRED" currentTile="upcomingrenewals" topText='' bottomText='IN NEXT 30 DAYS' bigNumberColor={style.redBigNumber} smallNum1Color={style.yellowSmallNumber} smallNum2Color={style.redSmallNumber} smallNum1SelectedColor={style.yellowSmallNumberSelected} smallNum2SelectedColor={style.redSmallNumberSelected} />
      <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="EXPIRED / TERMINATED" bigNumber={metadata?.expiredOrTerminatedContract?.expiredOrTerminatedContractCount || '-'} smallNum1={'-'} smallNum2={"-"} smallText1="EXPIRED" smallText2="TERMINATED" currentTile="expired/terminated" topText='' bottomText='IN LAST 30 DAYS' bigNumberColor={style.redBigNumber} smallNum1Color={style.redSmallNumber} smallNum2Color={style.redSmallNumber} smallNum1SelectedColor={style.redSmallNumberSelected} smallNum2SelectedColor={style.redSmallNumberSelected} />
    </div>
  )
}

export default ContractTiles;
