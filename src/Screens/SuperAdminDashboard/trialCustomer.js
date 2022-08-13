import React, { useState, useRef, useEffect, Fragment } from 'react';
import {Link} from 'react-router-dom';
import { Checkbox } from '@material-ui/core';
import ChevronRight from './../../images/chevronRight.png';
import Envelope from './../../images/envelope.png';
import Filter from './../../images/filter.png';
import Bell from './../../images/bell.png';
import CustomerBox1 from './../../images/cutomerBox1.png';
import CustomerBox2 from './../../images/cutomerBox2.png';
import CustomerBox3 from './../../images/cutomerBox3.png';
import SideBar from '../../Components/Sidebar';
import Navbar from '../../Components/Navbar';
import ThreeDot from './../../images/threeDot.png';

import style from './index.module.scss';
import StopTrial from './stopTrial';
import ExtendTrial from './extendTrial';
import ConvertTrial from './convertTrial';

const TrialCustomers = ({getSelectedCustomer, getAddContract, entityList}) => {
    const [showOptions, setShowOptions] = useState(false);

    const [stopTrialDialog, setStopTrialDialog] = useState(false);
    const [extendTrialDialog, setExtendTrialDialog] = useState(false);
    const [convertTrialDialog, setConvertTrialDialog] = useState(false);

    const getStopTrialDialog = (value) => {
        setStopTrialDialog(value);
    }

    const getExtendTrialDialog = (value) => {
        setExtendTrialDialog(value);
    }

    const getConvertTrialDialog = (value) => {
        setConvertTrialDialog(value);
    }

    const menuRef = useRef(null);
    useOptionsHide(menuRef);

    function useOptionsHide(ref) {
        useEffect(() => {
          function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
              setShowOptions(false)
            }
          }
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref]);
      }
    return(
        <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div className={`${style.bigCardGrid2}`}>
                    <SideBar />
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
                            <div className={`${style.cardStyle}`} onClick={() => getSelectedCustomer('ACTIVE CUSTOMERS')}>
                                <h5 className={`${style.headingForContracts}`}>ACTIVE CUSTOMERS</h5>
                                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                                    <p className={`${style.headingCountForCustomers} ${style.displayInColRev}`}>{entityList?.filter(data=>data?.subscriptionPlan?.subscriptionStatus === 'ACTIVE')?.map(data=>data)?.length || 0}</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.red}>1 </span> RENEWAL PAST DUE</span>
                                        <span><span className={style.yellow}>1 </span> AUTO RENEWED</span>
                                        <span><span className={style.red}>1 </span> RENEWAL IN 30 DAYS</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.cardStyle} ${style.selectedContractBackground}`} onClick={() => getSelectedCustomer('IN-PROGRESS / TRIAL CUSTOMERS')}>
                                <h5 className={`${style.headingForContracts}`}>IN-PROGRESS / TRIAL CUSTOMERS</h5>
                                <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                                    <p className={`${style.headingCountForCustomers} ${style.displayInColRev}`}>{entityList?.filter(data=>data?.subscriptionPlan?.subscriptionStatus !== 'ACTIVE')?.map(data=>data)?.length || 0}</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.green}>1 </span> ON TRIAL</span>
                                        <span><span className={style.yellow}>1 </span> OVER 30 DAYS</span>
                                        <span><span className={style.red}>1 </span> OVER 60 DAYS</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.cardStyle} onClick={() => getSelectedCustomer('ON HOLD / TERMINATED CUSTOMERS')}>
                                <h5 className={style.headingForContracts}>ON HOLD / TERMINATED CUSTOMERS</h5>
                                <div className={`${style.spaceBetween}`}>
                                    <p className={`${style.headingCountForCustomers}`}>2</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.yellow}>1 </span> ON HOLD FOR 30 DAYS</span>
                                        <span><span className={style.red}>1 </span> SUBSCRIPTION EXPIRED</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.cardStyle} onClick={() => getSelectedCustomer('FEEDBACK TICKETS')}>
                                <h5 className={`${style.headingForContracts}`}>FEEDBACK TICKETS</h5>
                                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                                    <p className={`${style.headingCountForCustomers} ${style.displayInColRev}`}>5</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.green}>1 </span> NEW</span>
                                        <span><span className={style.yellow}>1 </span> HIGH PRIORITY</span>
                                        <span><span className={style.red}>1 </span> PASS DUE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style.marginTop20}>
                            <div className={style.bigCardStyle}>
                                <div className={style.spaceBetween}>
                                    <div className={`${style.displayInRow} ${style.marginTop20} ${style.marginLeft30}`}>
                                        <p className={`${style.blue} ${style.activeContractsWidth}`}>LIST OF IN-PROGRESS CUSTOMERS</p>
                                    </div>
                                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                        <div className={style.searchBarStyle}>
                                            <p>Search here</p>
                                            <p className={style.marginRight}>&#128269;</p>
                                        </div>
                                        <img src={Envelope} alt="Envelope" className={style.smallIcons} />
                                        <img src={Bell} alt="Bell" className={style.smallIcons} />
                                        <img src={Filter} alt="Filter" className={style.filterIcon} />
                                        <button className={style.contractButton} onClick={() => getAddContract(true)} >ADD CUSTOMER</button>
                                    </div>
                                </div>
                                <div>
                                    <div className={`${style.tableHeaderTrialCustomer} ${style.marginTop20}`}>
                                        <Checkbox />
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>CUSTOMER</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>TYPE OF CUSTOMER</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>SUBSCRIPTION</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>CITY</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>STATE</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>LAST UPDATED</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>SETUP DELAY</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>LAST UPDATED BY</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>PARTNER</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>ACTION</p>
                                    </div>
                                    {
                                    entityList?.filter(data=>data?.subscriptionPlan?.subscriptionStatus !== 'ACTIVE')?.map(data=> (
                                      <div className={`${style.tableDataTrialCustomer}`}>
                                          <div className={`${style.displayInRow}`}>
                                              <Checkbox />
                                              <div className={`${style.green} ${style.greenDotStyle} ${style.marginTop20}`}></div>
                                          </div>
                                          <Link to={`/entitySetup/${data?.id}`} className={`${style.linkStyle}`}>
                                            <p className={`${style.tableDataFontStyleActiveCustomers} ${style.marginLeft30}`}>{data?.entityName?.entityName}</p>
                                          </Link>
                                          <p className={style.tableDataFontStyleActiveCustomers}>{data?.customerType}</p>
                                          <p className={style.tableDataFontStyleActiveCustomers}>Trial</p>
                                          <p className={`${style.tableDataFontStyleActiveCustomers} ${style.marginLeft30}`}>Maggiehaven</p>
                                          <p className={style.tableDataFontStyleActiveCustomers}>NY</p>
                                          <p className={style.tableDataFontStyleActiveCustomers}>07/19/2019</p>
                                          <p className={style.tableDataFontStyleActiveCustomers}>-</p>
                                          <p className={style.tableDataFontStyleActiveCustomers}>Lorem</p>
                                          <p className={style.tableDataFontStyleActiveCustomers}>Lorem</p>
                                          <div className={style.tableDataFontStyle}>
                                              <img src={ThreeDot} alt="ThreeDot" className={`${style.dotStyle}`} onClick={() => setShowOptions(true)} />
                                          </div>
                                      </div>
                                    ))
                                    }

                                    {showOptions && (
                                        <div className={`${style.displayInCol} ${style.actionCard} ${style.cursorPointer}`} ref={menuRef}>
                                            <img src={CustomerBox3} alt="CustomerBox1" className={style.actionsIcon} onClick={() => setStopTrialDialog(true)} />
                                            <img src={CustomerBox1} alt="CustomerBox2" className={style.actionsIcon} onClick={() => setExtendTrialDialog(true)} />
                                            <img src={CustomerBox2} alt="CustomerBox3" className={style.actionsIcon} onClick={() => setConvertTrialDialog(true)} />
                                        </div>
                                    )}
                                    <div className={style.spaceBetween}>
                                        <p className={style.accountActivityStyle}>Last account activity: 30 days</p>
                                        <div className={style.displayInRow}>
                                        <p className={style.paginationStyle}>1 - 10 of 200<span className={`${style.marginLeft20} ${style.leftChevronColor}`}>&lt;</span> </p>
                                        <img src={ChevronRight} className={style.roundChevron} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.spaceBetween}>
                    <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
                    <p className={style.poweredBy}>© TimeSmart.AI</p>
                </div>
            </div>
            {stopTrialDialog && (
                <StopTrial getStopTrialDialog={getStopTrialDialog} />
            )}
            {extendTrialDialog && (
                <ExtendTrial getExtendTrialDialog={getExtendTrialDialog} />
            )}
            {convertTrialDialog && (
                <ConvertTrial getConvertTrialDialog={getConvertTrialDialog} />
            )}
        </Fragment>
    )
}

export default TrialCustomers;
