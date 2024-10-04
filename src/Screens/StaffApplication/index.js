import React, { Fragment, useState } from 'react';
import Navbar from '../../Components/Navbar';
import StaffApplicationList from './staffApplicationList';
import NewActiveApplication from './newActiveApplication';
import { Dialog, Classes } from '@blueprintjs/core';
import ValidationDialog from '../../Components/validationDialog';
import TaskStatusDialog from '../../Components/TaskStatusDialog';

const StaffApplication = () => {
    const [selectedTab, setSelectedTab] = useState('chiefOfStaff');
    const [activeApplicationView, setActiveApplicationView] = useState(false);
    const [activeApplicationTask, setActiveApplicationTask] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getSelectedTab = (value) => {
        setSelectedTab(value);
    }

    const getActiveApplicationView = (value) => {
        setActiveApplicationView(value);
    }

    const getActiveApplicationTask = (value) => {
        setActiveApplicationTask(value);
    }

    return (
        <>
          {activeApplicationView ? (
              <NewActiveApplication getActiveApplicationView={getActiveApplicationView} />
          ) : (
              <Fragment>
                  <Navbar />
                  <StaffApplicationList
                      isLoading={isLoading}
                      getSelectedTab={getSelectedTab}
                      selectedTab={selectedTab}
                      getActiveApplicationView={getActiveApplicationView}
                      getActiveApplicationTask={getActiveApplicationTask}
                  />
              </Fragment>
          )}
           {activeApplicationTask && (
                <TaskStatusDialog getIsOpen={getActiveApplicationTask}/>
            )}
        </>
      )
}

export default StaffApplication;
