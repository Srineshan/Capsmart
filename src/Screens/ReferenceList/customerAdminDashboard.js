import React, { Fragment } from 'react';
import Navbar from '../../Components/Navbar';
import SideBar from './../../Components/Sidebar';
import style from './index.module.scss';
import { Icon, Intent } from "@blueprintjs/core";
import { Link } from 'react-router-dom';

const ClientAdminDashboard = () => {
    return (
        <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div className={style.bigCardGrid}>
                    <SideBar />
                    <div>
                        <div className={`${style.displayInRow} ${style.marginTop10}`}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                REFERENCE LIST
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                                <Icon icon="cross" size={25} intent={Intent.DANGER} />
                            </div>
                        </div>
                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.grid4}>
                                        <Link to={'/referenceList/departmentsForCustomers'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>DEPARTMENTS / SERVICE AREAS BY ENTITY / SITE</h5>
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>STANDARD LIST IN USE</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={'/referenceList/absenceReasonsForCustomer'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>ABSENCE REASONS</h5><br />
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={`${style.dashboardCardColorOption1}`}>MY CUSTOM LIST IN USE</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={'/referenceList/suffixByCustomer'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>NAME SUFFIX</h5><br />
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>STANDARD LIST IN USE</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to='/referenceList/contractServiceProviderBySiteType' className={style.linkStyle}> <div className={style.dashboardCardStyle}>
                                            <h5 className={`${style.headingForReferenceList}`}>CONTRACTED SERVICE PROVIDERS BY ENTITY / SITE TYPES</h5>
                                            <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                <span className={style.dashboardCardColorOption1}>STANDARD LIST IN USE</span>
                                                <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                            </div>
                                        </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className={style.margin20}>
                                    <div className={style.grid4}>
                                        <Link to={'/referenceList/functionalTitleForCustomer'} className={style.linkStyle}> <div className={style.dashboardCardStyle}>
                                            <h5 className={`${style.headingForReferenceList}`}>FUNCTIONAL TITLES FOR CONTRACTED SERVICE PROVIDERS</h5>
                                            <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                <span className={style.dashboardCardColorOption1}>STANDARD LIST IN USE</span>
                                                <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                            </div>
                                        </div>
                                        </Link>
                                       <Link to='/referenceList/contractTerminationReasonForCustomer'className={style.linkStyle}> <div className={style.dashboardCardStyle}>
                                            <h5 className={`${style.headingForReferenceList}`}>CONTRACT TERMINATION REASONS BY ENTITY TYPE</h5>
                                            <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                <span className={style.dashboardCardColorOption1}>STANDARD LIST IN USE</span>
                                                <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                            </div>
                                        </div>
                                        </Link>
                                        <Link to='/referenceList/proofOfDocumentationByEntity'className={style.linkStyle}> <div className={style.dashboardCardStyle}>
                                            <h5 className={`${style.headingForReferenceList}`}>PROOF OF DOCUMENTATION BY ENTITY TYPE</h5>
                                            <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                <span className={style.dashboardCardColorOption1}>STANDARD LIST IN USE</span>
                                                <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                            </div>
                                        </div>
                                        </Link>
                                        <Link to='/referenceList/contractedServicesForHealthcare'className={style.linkStyle}> <div className={style.dashboardCardStyle}>
                                            <h5 className={`${style.headingForReferenceList}`}>CONTRACTED SERVICES BY ENTITY TYPE</h5>
                                            <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                <span className={style.dashboardCardColorOption1}>STANDARD LIST IN USE</span>
                                                <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                            </div>
                                        </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className={style.margin20}>
                                    <div className={style.grid4}>
                                        <Link to={'/referenceList/holidayScheduleForCustomers'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>HOLIDAY LIST BY ENTITY TYPE</h5><br />
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                <span className={style.dashboardCardColorOption1}>STANDARD LIST IN USE</span>
                                                <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={'/referenceList/contractDocumentTypeUploadForCustomer'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>CONTRACT DOCUMENT TYPES FOR UPLOAD BY ENTITY TYPE</h5><br />
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>STANDARD LIST IN USE</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
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
        </Fragment>
    )
}

export default ClientAdminDashboard;
