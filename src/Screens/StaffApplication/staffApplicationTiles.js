import React from 'react';
import TileApplication from '../../Components/TileApplication';
import style from './index.module.scss';

const StaffApplicationTiles = ({ metadata, getSelectedContract, selectedContract, activeContractsLength, draftContractsLength, upcomingContractsLength, expiredContractsLength, getTabFilter }) => {
  return (
    <div className={`${style.tabs}`}>
      <TileApplication selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="Applicants to Process" tileCount={3} currentTile="Applicants" />
      <TileApplication selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="Applications Under Review" tileCount={3} currentTile="Applications" />
      <TileApplication selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="Clarifications Required" tileCount={2} currentTile="Clarifications" />
      <TileApplication selectedContract={selectedContract} getSelectedContract={getSelectedContract} tileLabel="Approved" tileCount={1} currentTile="Approved" />
    </div>
  )
}

export default StaffApplicationTiles;
