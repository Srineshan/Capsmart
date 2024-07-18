import React from 'react';
import Tile from '../../Components/Tile';
import style from './index.module.scss';

const StaffTiles = ({ metadata, getSelectedContract, selectedContract, activeContractsLength, draftContractsLength, upcomingContractsLength, expiredContractsLength, getTabFilter }) => {
  return (
    <div className={style.grid4}>
      <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="ACTIVE STAFF" bigNumber={420} smallNum1={1} smallNum2={2} smallText1="RED FLAGS" smallText2="EXPIRING IN 30 DAYS" currentTile="activestaffs" topText='' bigNumberColor={style.greenBigNumber} smallNum1Color={style.redSmallNumber} smallNum2Color={style.yellowSmallNumber} smallNum1SelectedColor={style.redSmallNumberSelected} smallNum2SelectedColor={style.yellowSmallNumberSelected} getTabFilter={getTabFilter} />
      <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="APPLICATIONS" bigNumber={7} smallNum1={2} smallNum2={1} smallText1="IN-PROGRESS" smallText2="PAST DUE" currentTile="applications" topText='' smallNum1Color={style.yellowSmallNumber} smallNum2Color={style.redSmallNumber} smallNum1SelectedColor={style.yellowSmallNumberSelected} smallNum2SelectedColor={style.redSmallNumberSelected} getTabFilter={getTabFilter} />
      <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="STAFF REAPPOINTMENTS" bigNumber={6} smallNum1={1} smallNum2={1} smallText1="EXTENSION REQUIRED" smallText2="PAST DUE" currentTile="staff/reappointments" topText='' bottomText={''} bigNumberColor={style.yellowBigNumber} smallNum1Color={style.yellowSmallNumber} smallNum2Color={style.redSmallNumber} smallNum1SelectedColor={style.yellowSmallNumberSelected} smallNum2SelectedColor={style.redSmallNumberSelected} getTabFilter={getTabFilter} />
      <Tile selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="INACTIVE" bigNumber={15} smallNum1={2} smallNum2={2} smallNum3={1} smallText1="REJECTED" smallText2="EXPIRED" smallText3="TERMINATED" currentTile="inactive" topText='' bottomText={['IN LAST 30 DAYS', 'IN LAST 60 DAYS', 'IN LAST 90 DAYS']} bigNumberColor={style.redBigNumber} smallNum1Color={style.redSmallNumber} smallNum2Color={style.redSmallNumber} smallNum3Color={style.redSmallNumber} smallNum1SelectedColor={style.redSmallNumberSelected} smallNum2SelectedColor={style.redSmallNumberSelected} smallNum3SelectedColor={style.redSmallNumberSelected} getTabFilter={getTabFilter} />
    </div>
  )
}

export default StaffTiles;
