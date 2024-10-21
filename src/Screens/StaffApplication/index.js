import React, { Fragment, useState } from 'react';
import Navbar from '../../Components/Navbar';
import StaffApplicationList from './staffApplicationList';
import NewActiveApplication from './newActiveApplication';
import NewCredCommApplication from './newCredCommApplication';
import { Dialog, Classes } from '@blueprintjs/core';
import ValidationDialog from '../../Components/validationDialog';
import TaskStatusDialog from '../../Components/TaskStatusDialog';

const StaffApplication = () => {
    const [selectedTab, setSelectedTab] = useState('applicantsToProcess');
    const [activeApplicationView, setActiveApplicationView] = useState(false);
    const [credCommApplicationView, setCredCommApplicationView] = useState(false);
    const [activeApplicationTask, setActiveApplicationTask] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getSelectedTab = (value) => {
        setSelectedTab(value);
    }

    const getActiveApplicationView = (value) => {
        setActiveApplicationView(value);
    }

    const getCredCommApplicationView = (value) => {
        setCredCommApplicationView(value);
    }

    const getActiveApplicationTask = (value) => {
        setActiveApplicationTask(value);
    }

    return (
        <>
            {activeApplicationView ? (
                <NewActiveApplication getActiveApplicationView={getActiveApplicationView} />
            ) : credCommApplicationView ? (
                <NewCredCommApplication getSelectedTab={getSelectedTab} selectedTab={selectedTab} getCredCommApplicationView={getCredCommApplicationView} />
            ) : (
              <Fragment>
                  <Navbar />
                  <StaffApplicationList
                      isLoading={isLoading}
                      getSelectedTab={getSelectedTab}
                      selectedTab={selectedTab}
                      getActiveApplicationView={getActiveApplicationView}
                      getActiveApplicationTask={getActiveApplicationTask}
                      getCredCommApplicationView={getCredCommApplicationView}
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
