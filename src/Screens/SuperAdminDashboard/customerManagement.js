import React, { useState, useEffect, Fragment } from 'react';
import { GET, isSuperAdminAccess } from './../dataSaver';
import ActiveCustomers from './activeCustomers';
import FeedbackCustomers from './feedbackTickets';
import { Checkbox, CircularProgress } from '@material-ui/core';
import Envelope from './../../images/envelope.png';
import Filter from './../../images/filter.png';
import Bell from './../../images/bell.png';
import style from './index.module.scss';
import TerminatedCustomers from './terminatedCustomer';
import TrialCustomers from './trialCustomer';
import LoadingScreen from '../../Components/LoadingScreen';
import SearchBar from './../../Components/SearchBar';
import { Link } from 'react-router-dom';
import SideBar from '../../Components/Sidebar';
import Navbar from '../../Components/Navbar';

const CustomerManagement = () => {
    const [customerPage, setCustomerPage] = useState('ACTIVE CUSTOMERS');
    const [addCustomerDialog, setAddCustomerDialog] = useState(false);
    const [entityList, setEntityList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewInprogress, setViewInprogress] = useState(true);
    const [viewTrial, setViewTrial] = useState(false);
    const [viewPendingActivation, setViewPendingActivation] = useState(true);
    const [viewOnHold, setViewOnHold] = useState(false);
    const [viewTerminated, setViewTerminated] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    useEffect(() => {
        getEntityList();
    }, [])

    const getEntityList = async () => {
        setLoading(true);
        const { data: entityData, loading: loading } = await GET(`entity-service/entity`);
        setEntityList(entityData);
        setLoading(false);
    }

    if (loading) {
        return <LoadingScreen text={['Sit Back And Relax', 'Loading Your Details']} />;
    }


    const getSelectedCustomer = (value) => {
        setCustomerPage(value);
    }

    const getAddCustomer = (value) => {
        setAddCustomerDialog(value);
    }

    const getIsExpanded = (value) => {
        setIsExpanded(value);
    }

    return (
        <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
                    <div>
                        <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                            <div></div>
                        </SideBar>
                    </div>
                    <div>
                        <div className={style.displayInRow}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                CUSTOMER MANAGEMENT
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                        </div>
                        <div className={`${style.grid4} ${style.marginTop20}`}>
                            <div className={`${style.cardStyle} ${customerPage === "ACTIVE CUSTOMERS" ? style.selectedContractBackground : ''}`} onClick={() => getSelectedCustomer('ACTIVE CUSTOMERS')}>
                                <h5 className={`${style.headingForContracts}`}>ACTIVE ACCOUNTS</h5>
                                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                                    <p className={`${style.headingCountForCustomers} ${style.displayInColRev}`}>{entityList?.filter(data => data?.subscriptionPlan?.subscriptionStatus === 'ACTIVE')?.map(data => data)?.length || 0}</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.red}>1 </span> RENEWAL PAST DUE</span>
                                        <span><span className={style.yellow}>1 </span> AUTO RENEWED</span>
                                        <span><span className={style.red}>1 </span> RENEWAL IN 30 DAYS</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.cardStyle} ${customerPage === "IN-PROGRESS / TRIAL CUSTOMERS" ? style.selectedContractBackground : ''}`} onClick={() => getSelectedCustomer('IN-PROGRESS / TRIAL CUSTOMERS')}>
                                <h5 className={`${style.headingForContracts}`}>IN-PROGRESS / TRIAL ACCOUNTS</h5>
                                <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                                    <p className={`${style.headingCountForCustomers} ${style.displayInColRev}`}>{entityList?.filter(data => data?.subscriptionPlan?.subscriptionStatus !== 'ACTIVE')?.map(data => data)?.length || 0}</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.green}>1 </span> ON TRIAL</span>
                                        <span><span className={style.yellow}>1 </span> OVER 30 DAYS</span>
                                        <span><span className={style.red}>1 </span> OVER 60 DAYS</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.cardStyle} ${customerPage === "ON HOLD / TERMINATED CUSTOMERS" ? style.selectedContractBackground : ''}`} onClick={() => getSelectedCustomer('ON HOLD / TERMINATED CUSTOMERS')}>
                                <h5 className={style.headingForContracts}>PENDING ACTIVATION / ON HOLD / TERMINATED</h5>
                                <div className={`${style.spaceBetween}`}>
                                    <p className={`${style.headingCountForCustomers}`}>2</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.yellow}>1 </span> ON HOLD FOR 30 DAYS</span>
                                        <span><span className={style.red}>1 </span> SUBSCRIPTION EXPIRED</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.cardStyle} ${customerPage === "FEEDBACK TICKETS" ? style.selectedContractBackground : ''}`} onClick={() => getSelectedCustomer('FEEDBACK TICKETS')}>
                                <h5 className={`${style.headingForContracts}`}>FEEDBACK TICKETS</h5>
                                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                                    <p className={`${style.headingCountForCustomers} ${style.displayInColRev}`}>3</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.green}>1 </span> NEW</span>
                                        <span><span className={style.yellow}>1 </span> HIGH PRIORITY</span>
                                        <span><span className={style.red}>1 </span> PASS DUE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style.marginTop20} >
                            <div className={style.bigCardStyle}>
                                <div className={style.spaceBetween}>
                                    {/* <div className={`${style.displayInRow} ${style.marginTop20} ${style.marginLeft30}`}>
                                        <p className={`${style.blue} ${style.activeContractsWidth}`}>LIST OF {customerPage === "ACTIVE CUSTOMERS" ? 'ACTIVE CUSTOMERS' : customerPage === "IN-PROGRESS / TRIAL CUSTOMERS" ? 'IN-PROGRESS CUSTOMERS' : customerPage === "ON HOLD / TERMINATED CUSTOMERS" ? 'ON-HOLD/ TERMINATED CUSTOMERS' : 'FEEDBACK TICKET'} </p>
                                    </div> */}
                                    {(customerPage === "ACTIVE CUSTOMERS") ? (
                                        <div className={style.buttonGroupUsers}>
                                            <button className={style.activeButton}>ACTIVE CUSTOMERS ( {entityList?.filter(data => data?.subscriptionPlan?.subscriptionStatus === 'ACTIVE')?.map(data => data)?.length || 0} )</button>
                                        </div>
                                    ) : (customerPage === "IN-PROGRESS / TRIAL CUSTOMERS") ? (
                                        <div className={style.buttonGroupUsers}>
                                            <button className={viewInprogress && style.activeButton} onClick={() => { setViewInprogress(true); setViewTrial(false) }}>TRIAL ACCOUNTS ( {entityList?.filter(data => data?.subscriptionPlan?.subscriptionStatus !== 'ACTIVE')?.map(data => data)?.length || 0} )</button>
                                            <button className={viewTrial && style.activeButton} onClick={() => { setViewTrial(true); setViewInprogress(false) }}>IN-PROGRESS ACCOUNTS ( {entityList?.filter(data => data?.subscriptionPlan?.subscriptionStatus !== 'ACTIVE')?.map(data => data)?.length || 0} )</button>
                                        </div>
                                    ) : customerPage === "ON HOLD / TERMINATED CUSTOMERS" ? (
                                        <div className={style.buttonGroupUsers}>
                                            <button className={viewPendingActivation && style.activeButton} onClick={() => { setViewPendingActivation(true); setViewOnHold(false); setViewTerminated(false) }}>PENDING ACTIVATION ( 3 )</button>
                                            <button className={viewOnHold && style.activeButton} onClick={() => { setViewOnHold(true); setViewPendingActivation(false); setViewTerminated(false) }}>ON HOLD ( 3 )</button>
                                            <button className={viewTerminated && style.activeButton} onClick={() => { setViewTerminated(true); setViewOnHold(false); setViewPendingActivation(false) }}>TERMINATED ( 3 )</button>
                                        </div>
                                    ) : (
                                        <div className={style.buttonGroupUsers}>
                                            <button className={style.activeButton}>FEEDBACK TICKETS ( 3 )</button>
                                        </div>
                                    )}
                                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                        <SearchBar />
                                        {/* <img src={Envelope} alt="Envelope" className={style.smallIcons} />
                                        <img src={Bell} alt="Bell" className={style.smallIcons} /> */}
                                        <img src={Filter} alt="Filter" className={style.filterIcon} />
                                        {customerPage !== "ON HOLD / TERMINATED CUSTOMERS" && (
                                            <Link to={isSuperAdminAccess ? "/customerSetup" : "/welcome"}>
                                                <button className={style.contractButton}>ADD CUSTOMER</button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                {customerPage === "ACTIVE CUSTOMERS" ? (
                                    <ActiveCustomers getSelectedCustomer={getSelectedCustomer} getAddCustomer={getAddCustomer} entityList={entityList} />
                                ) : customerPage === "IN-PROGRESS / TRIAL CUSTOMERS" ? (
                                    <TrialCustomers getSelectedCustomer={getSelectedCustomer} entityList={entityList} viewInprogress={viewInprogress} viewTrial={viewTrial} />
                                ) : customerPage === "ON HOLD / TERMINATED CUSTOMERS" ? (
                                    <TerminatedCustomers getSelectedCustomer={getSelectedCustomer} entityList={entityList} viewPendingActivation={viewPendingActivation} viewOnHold={viewOnHold} viewTerminated={viewTerminated} />
                                ) : (
                                    <FeedbackCustomers getSelectedCustomer={getSelectedCustomer} entityList={entityList} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.spaceBetween}>
                    <p className={style.poweredBy}>Powered by - TimeSmartAI.Inc LLP</p>
                    <p className={style.poweredBy}>© TimeSmartAI.Inc</p>
                </div>
            </div>
        </Fragment >
    )
}

export default CustomerManagement;
