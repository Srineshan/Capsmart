import React, { useState, useEffect } from 'react';
import TileApplication from '../../Components/TileApplication';
import style from './index.module.scss';
import { GET } from './../../Screens/dataSaver';

const StaffApplicationTopTiles = () => {
  const [selectedTab, setSelectedTab] = useState('NewApplicants');
  const [counts, setCounts] = useState({
    applicantsToProcess: 0,
  });
  //   const [counts, setCounts] = useState({});

    const getTitleCounts = async () => {
      await GET('application-management-service/application/workflowUser/meta')
        .then(response => {
          setCounts(response?.data);
        })
        .catch(error => {
          console.log('error', error);
        })
    };

    useEffect(() => {
      getTitleCounts();
    }, []);

  const getSelectedTab = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className={`${style.tabs}`} >
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="New Applicants" currentTile="NewApplicants" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Staff Reappointments" isDisabled={true} />
      {/* <TileApplication selectedTab={selectedTab}  tileLabel="New Applicants" tileCount={counts.applicantsToProcess} currentTile="NewApplicants" /> */}
      {/* <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Staff Reappointments" isDisabled={true} /> */}
    </div>
  )
}

export default StaffApplicationTopTiles;
