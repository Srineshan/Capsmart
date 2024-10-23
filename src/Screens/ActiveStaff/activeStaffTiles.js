import React, { useState, useEffect } from 'react';
import TileApplication from '../../Components/TileApplication';
import style from './index.module.scss';
import { GET } from './../../Screens/dataSaver';

const ActiveStaffTiles = ({ getSelectedTab, selectedTab,reFetchMetaData,getReFetchMetaData }) => {
  const [counts, setCounts] = useState({
    LOCUM : 0,
    PERMANENT : 0,
    PROVISIONAL : 0,
  });

  useEffect(() => {
    getTitleCounts();
  }, []);

  useEffect(() =>{
    if(reFetchMetaData === true){
      getTitleCounts();
    }
  },[reFetchMetaData] )
  
  const getTitleCounts = async () => {
    await GET('application-management-service/staff/meta')
      .then(response => {
        setCounts(response?.data);
        var str = JSON.stringify(response?.data);
        console.log("titlesssss" + str)
        getReFetchMetaData(false)
      })
      .catch(error => {
        console.log('errorrrrrrrrrrrrrrrr', error);
      })
  };
  

  return (
    <div className={`${style.tabs}`}>
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Permanent" tileCount={counts?.PERMANENT} currentTile="PERMANENT" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Locum Tennens" tileCount={counts?.LOCUM} currentTile="LOCUM" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Temporary" tileCount={counts?.PROVISIONAL} currentTile="PROVISIONAL" />
    </div>
  )
}

export default ActiveStaffTiles;
