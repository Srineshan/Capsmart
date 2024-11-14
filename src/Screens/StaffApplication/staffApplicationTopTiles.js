import React, { useState, useEffect } from 'react';
import TileApplication from '../../Components/TileApplication';
import style from './index.module.scss';
import { GET } from './../../Screens/dataSaver';

const StaffApplicationTopTiles = () => {
  const [selectedTab, setSelectedTab] = useState('NewApplicants');
  const [applicationCreationType, setApplicationCreationType] = useState('NEW');
  const [counts, setCounts] = useState({
    applicantsToProcess: 0,
  });
  //   const [counts, setCounts] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

    // const getTitleCounts = async () => {
    //   await GET(`application-management-service/application/workflowUser/meta?applicationCreationType=${applicationCreationType}`)
    //     .then(response => {
    //       setCounts(response?.data);
    //     })
    //     .catch(error => {
    //       console.log('error', error);
    //     })
    // };

    // const getApplicationCreationType = (value) => {
    //   setApplicationCreationType(value);
    // }

    useEffect(() => {
      const storedApplicationType = sessionStorage.getItem('applicationCreationType');
      if (storedApplicationType) {
        setApplicationCreationType(storedApplicationType);
        const initialTab = storedApplicationType === 'NEW' ? 'NewApplicants' : 'StaffReappointments';
        setSelectedTab(initialTab);
      }
    }, []);

    // useEffect(() => {
    //   getTitleCounts();
    // }, [applicationCreationType]);

    // const getSelectedTab = (tab) => {
    //   setSelectedTab(tab);
    //   // if (tab === "StaffReappointments") {
    //   //   setIsDialogOpen(true);  
    //   // }
    // };

    // const getSelectedTab = (tab) => {
    //   setSelectedTab(tab);
    //   if (selectedTab === 'StaffReappointments') {
    //     setApplicationCreationType('REAPPOINTMENT');
    //     // setIsDialogOpen(true); 
    //   } else {
    //     setApplicationCreationType('NEW');
    //   }
    //   console.log("setApplicationCreationType" + applicationCreationType)
    // };

    const getSelectedTab = (tab) => {
      setSelectedTab(tab);
      const newType = tab === 'NewApplicants' ? 'NEW' : 'REAPPOINTMENT';
      setApplicationCreationType(newType);
      sessionStorage.setItem('applicationCreationType', newType);
      console.log("setApplicationCreationType" + newType)
    };

    // useEffect(() => {
    //   getSelectedTab();
    //   sessionStorage.setItem('applicationCreationType', applicationCreationType);
    // }, []);

  return (
    <div className={`${style.tabs}`} >
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="New Applicants" currentTile="NewApplicants" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Staff Reappointments" currentTile="StaffReappointments" />
      {/* <TileApplication selectedTab={selectedTab}  tileLabel="New Applicants" tileCount={counts.applicantsToProcess} currentTile="NewApplicants" /> */}
      {/* <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Staff Reappointments" isDisabled={true} /> */}
    </div>
  )
}

export default StaffApplicationTopTiles;
