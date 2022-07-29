import React, {useState} from 'react';
import ActiveCustomers from './activeCustomers';
import FeedbackCustomers from './feedbackTickets';

import style from './index.module.scss';
import TerminatedCustomers from './terminatedCustomer';
import TrialCustomers from './trialCustomer';

const CustomerManagement = () => {
    const [customerPage, setCustomerPage] = useState('ACTIVE CUSTOMERS');
    const [addCustomerDialog, setAddCustomerDialog] = useState(false);

    const getSelectedCustomer = (value) => {
        setCustomerPage(value);
    }

    const getAddCustomer = (value) => {
        setAddCustomerDialog(value);
    }

    return(
        <div>
            {customerPage === "ACTIVE CUSTOMERS" ? (
                <ActiveCustomers getSelectedCustomer={getSelectedCustomer} getAddCustomer={getAddCustomer} />
            ) : customerPage === "IN-PROGESS / TRIAL CUSTOMERS" ? (
                <TrialCustomers getSelectedCustomer={getSelectedCustomer} />
            ) : customerPage === "ON HOLD / TERMINATED CUSTOMERS" ? (
                <TerminatedCustomers getSelectedCustomer={getSelectedCustomer} />
            ) : (
                <FeedbackCustomers getSelectedCustomer={getSelectedCustomer}  />
            )}
        </div>
    )
}

export default CustomerManagement;