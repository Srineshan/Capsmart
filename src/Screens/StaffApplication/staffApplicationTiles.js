import React from 'react';
import TileApplication from '../../Components/TileApplication';
import style from './index.module.scss';

const StaffApplicationTiles = ({ getSelectedApplicant, selectedApplicant }) => {
  return (
    <div className={`${style.tabs}`}>
      <TileApplication selectedApplicant={selectedApplicant} getSelectedApplicant={getSelectedApplicant} tileLabel="Applicants to Process" tileCount={3} currentTile="Applicants" />
      <TileApplication selectedApplicant={selectedApplicant} getSelectedApplicant={getSelectedApplicant} tileLabel="Applications Under Review" tileCount={3} currentTile="Applications" />
      <TileApplication selectedApplicant={selectedApplicant} getSelectedApplicant={getSelectedApplicant} tileLabel="Clarifications Required" tileCount={2} currentTile="Clarifications" />
      <TileApplication selectedApplicant={selectedApplicant} getSelectedApplicant={getSelectedApplicant} tileLabel="Approved" tileCount={1} currentTile="Approved" />
    </div>
  )
}

export default StaffApplicationTiles;
