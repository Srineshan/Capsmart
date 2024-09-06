import React, { useState, useEffect } from 'react';
import TileApplication from '../../Components/TileApplication';
import style from './index.module.scss';
import { GET } from '../dataSaver';

const ActiveStaffTiles = ({ getSelectedTab, selectedTab }) => {

  return (
    <div className={`${style.tabs}`}>
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Permanent Staff" tileCount={1} currentTile="permanentStaff" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Provisional Staff" tileCount={1} currentTile="provisionalStaff" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Locum Staff" tileCount={1} currentTile="locumStaff" />
    </div>
  )
}

export default ActiveStaffTiles;
