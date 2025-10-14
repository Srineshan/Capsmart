import React from 'react';
import TileStaff from '../../../Components/TileStaff';
import style from './index.module.scss';

const StaffTiles = ({ metadata, getSelectedApplicant, selectedApplicant, getTabFilter }) => {
  return (
    <div className={style.grid4}>
      <TileStaff selectedApplicant={selectedApplicant} getSelectedApplicant={getSelectedApplicant} tileLabel="ACTIVE STAFF ITEMS" bigNumber={20} smallNum1={1} smallNum2={2} smallText1="RED FLAGS" smallText2="EXPIRING IN 30 DAYS" currentTile="activestaffs" topText='' bigNumberColor={style.greenBigNumber} smallNum1Color={style.redSmallNumber} smallNum2Color={style.yellowSmallNumber} smallNum1SelectedColor={style.redSmallNumberSelected} smallNum2SelectedColor={style.yellowSmallNumberSelected} getTabFilter={getTabFilter} />
      <TileStaff selectedApplicant={selectedApplicant} getSelectedApplicant={getSelectedApplicant} tileLabel="APPLICATION TASKS" bigNumber={7} smallNum1={2} smallNum2={1} smallText1="IN-PROGRESS" smallText2="PAST DUE" currentTile="applications" topText='' smallNum1Color={style.yellowSmallNumber} smallNum2Color={style.redSmallNumber} smallNum1SelectedColor={style.yellowSmallNumberSelected} smallNum2SelectedColor={style.redSmallNumberSelected} getTabFilter={getTabFilter} />
      <TileStaff selectedApplicant={selectedApplicant} getSelectedApplicant={getSelectedApplicant} tileLabel="STAFF REAPPOINTMENT TASKS" bigNumber={6} smallNum1={1} smallNum2={1} smallText1="EXTENSION REQUIRED" smallText2="PAST DUE" currentTile="staff/reappointments" topText='' bottomText={''} bigNumberColor={style.yellowBigNumber} smallNum1Color={style.yellowSmallNumber} smallNum2Color={style.redSmallNumber} smallNum1SelectedColor={style.yellowSmallNumberSelected} smallNum2SelectedColor={style.redSmallNumberSelected} getTabFilter={getTabFilter} />
      {/* <TileStaff selectedApplicant={selectedApplicant} getSelectedApplicant={getSelectedApplicant} tileLabel="INACTIVE" bigNumber={15} smallNum1={2} smallNum2={2} smallNum3={1} smallText1="REJECTED" smallText2="EXPIRED" smallText3="TERMINATED" currentTile="inactive" topText='' bottomText={['IN LAST 30 DAYS', 'IN LAST 60 DAYS', 'IN LAST 90 DAYS']} bigNumberColor={style.redBigNumber} smallNum1Color={style.redSmallNumber} smallNum2Color={style.redSmallNumber} smallNum3Color={style.redSmallNumber} smallNum1SelectedColor={style.redSmallNumberSelected} smallNum2SelectedColor={style.redSmallNumberSelected} smallNum3SelectedColor={style.redSmallNumberSelected} getTabFilter={getTabFilter} /> */}
    </div>
  )
}

export default StaffTiles;
