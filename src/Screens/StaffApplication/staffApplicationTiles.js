import React, { useState, useEffect } from 'react';
import TileApplication from '../../Components/TileApplication';
import style from './index.module.scss';
import { GET } from './../../Screens/dataSaver';

const StaffApplicationTiles = ({ getSelectedTab }) => {
  const [counts, setCounts] = useState({
    chiefOfStaff: 0,
    credentialingCommittee: 0,
    mac: 0,
    bod: 0
  });

  const [selectedTab, setSelectedTab] = useState('chiefOfStaff');
  
  const getTitleCounts = async () => {
    await GET('application-management-service/application/workflowUser/meta')
      .then(response => {
        setCounts(response?.data);
        var str = JSON.stringify(response?.data);
        console.log("titlesssss"+ str)
      })
      .catch(error => {
        console.log('error', error);
      })
  };

  useEffect(() => {
    getTitleCounts();
  }, []);

  const handleTileClick = (tile) => {
    setSelectedTab(tile);
    if (getSelectedTab) {
      getSelectedTab(tile);
    }
  };

  return (
    <div className={`${style.tabs}`}>
      <TileApplication selectedTab={selectedTab} getSelectedTab={handleTileClick} tileLabel="Applicants to Verify" tileCount={counts.chiefOfStaff} currentTile="chiefOfStaff" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={handleTileClick} tileLabel="Cred. Comm." tileCount={counts['level-1']} currentTile="level-1" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={handleTileClick} tileLabel="MAC" tileCount={counts.mac} currentTile="mac" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={handleTileClick} tileLabel="BOD" tileCount={counts.bod} currentTile="bod" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={handleTileClick} tileLabel="Clarifications" tileCount={counts.clarificationsRequired} currentTile="clarificationsRequired" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={handleTileClick} tileLabel="Rejected/Declined" tileCount={counts.rejected} currentTile="rejected" />
    </div>
  )
}

export default StaffApplicationTiles;
