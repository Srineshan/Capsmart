import React, {useState, useEffect} from 'react';
import {GET} from './../dataSaver';
import ActiveCustomers from './activeCustomers';
import FeedbackCustomers from './feedbackTickets';
import { Checkbox, CircularProgress } from '@material-ui/core';

import style from './index.module.scss';
import TerminatedCustomers from './terminatedCustomer';
import TrialCustomers from './trialCustomer';

const CustomerManagement = () => {
    const [customerPage, setCustomerPage] = useState('ACTIVE CUSTOMERS');
    const [addCustomerDialog, setAddCustomerDialog] = useState(false);
    const [entityList,setEntityList] = useState([]);
    const [loading,setLoading] = useState(false);
    useEffect(()=>{
      getEntityList();
    }, [])

    const getEntityList = async() => {
      setLoading(true);
      const {data: entityData, loading:loading} = await GET(`entity-service/entity`);
      setEntityList(entityData);
      setLoading(false);
    }

    if(loading){
      return <CircularProgress />;
    }


    const getSelectedCustomer = (value) => {
        setCustomerPage(value);
    }

    const getAddCustomer = (value) => {
        setAddCustomerDialog(value);
    }

    return(
        <div>
            {customerPage === "ACTIVE CUSTOMERS" ? (
                <ActiveCustomers getSelectedCustomer={getSelectedCustomer} getAddCustomer={getAddCustomer} entityList={entityList}/>
            ) : customerPage === "IN-PROGRESS / TRIAL CUSTOMERS" ? (
                <TrialCustomers getSelectedCustomer={getSelectedCustomer} entityList={entityList}/>
            ) : customerPage === "ON HOLD / TERMINATED CUSTOMERS" ? (
                <TerminatedCustomers getSelectedCustomer={getSelectedCustomer} />
            ) : (
                <FeedbackCustomers getSelectedCustomer={getSelectedCustomer}  />
            )}
        </div>
    )
}

export default CustomerManagement;
