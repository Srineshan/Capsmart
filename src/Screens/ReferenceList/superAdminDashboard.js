import React, { Fragment, useState } from 'react';
import Navbar from '../../Components/Navbar';
import SideBar from './../../Components/Sidebar';
import style from './index.module.scss';
import { Icon, Intent } from "@blueprintjs/core";
import { Link } from 'react-router-dom';
import NewPodTypeForHealthcare from './newPodTypeForHealthCare';

const SuperAdminDashboard = () => {
    const [showPodTypeForHealthcareDialog, setShowPodTypeForHealthcareDialog] = useState(true);

    const getPodTypeForHealthcareDialog = (value) => {
        setShowPodTypeForHealthcareDialog(value);
    }

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
                                        <Link to={'/referenceList/industriesWithEntityTypes'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>INDUSTRIES SUPPORTED WITH ENTITY TYPES</h5>
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={'/referenceList/departmentsByEntityTypes'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>DEPARTMENTS / SERVICE AREAS BY ENTITY TYPES</h5>
                                                <div className={`${style.dashboardInsideCardStyle} ${style.marginTop30}`}>
                                                    <span className={style.dashboardCardColorOption1}>DEFAULT LIST SETUP REQUIRED</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={'/referenceList/absenseReasonsByIndustries'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>ABSENCE REASONS BY INDUSTRY TYPE</h5>
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={'/referenceList/suffixByIndustries'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>NAME SUFFIX BY INDUSTRY TYPE</h5><br />
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={'/referenceList/contractedServiceProviderByIndustries'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>CONTRACTED SERVICE PROVIDERS BY INDUSTRY & ENTITY TYPES</h5>
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={'/referenceList/functionalTitles'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>FUNCTIONAL TITLES FOR CONTRACTED SERVICE PROVIDERS</h5>
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={'/referenceList/boardCertification'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>BOARD CERTIFICATION SPECIALTIES BY INDUSTRIES</h5><br />
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={'/referenceList/terminationReasons'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>TERMINATION REASONS BY ENTITY TYPE</h5><br />
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={'/referenceList/proofOfDocumentByEntity'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>PROOF OF DOCUMENTATION BY INDUSTRIES</h5>
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className={style.dashboardCardStyle}>
                                            <h5 className={`${style.headingForReferenceList}`}>CONTRACTED SERVICES BY INDUSTRIES</h5>
                                            <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                            </div>
                                        </div>
                                        <Link to={'/referenceList/holidayListByIndustries'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>HOLIDAY LIST BY INDUSTRIES</h5><br />
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={'/referenceList/contractDoumentTypeForUpload'} className={style.linkStyle}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>CONTRACT DOCUMENT <br /> TYPE  FOR UPLOAD</h5>
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                {/* <div className={style.margin20}>
                                    <div className={style.grid4}>
                                        <div className={style.dashboardCardStyle}>
                                            <h5 className={`${style.headingForReferenceList}`}>CONTRACTED SERVICE PROVIDERS BY INDUSTRY & ENTITY TYPES</h5>
                                            <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link to={'/referenceList/functionalTitles'}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>FUNCTIONAL TITLES FOR CONTRACTED SERVICE PROVIDERS</h5>
                                                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                        <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                        <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={'/referenceList/boardCertification'}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>BOARD CERTIFICATION SPECIALTIES BY INDUSTRIES</h5>
                                                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                        <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                        <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={'/referenceList/terminationReasons'}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>TERMINATION REASONS BY ENTITY TYPE</h5>
                                                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                        <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                        <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className={style.margin20}>
                                    <div className={style.grid4}>
                                        <div className={style.dashboardCardStyle}>
                                            <h5 className={`${style.headingForReferenceList}`}>POOF OF DOCUMENTATION BY INDUSTRIES</h5>
                                            <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={style.dashboardCardStyle}>
                                            <h5 className={`${style.headingForReferenceList}`}>CONTRACTED SERVICES BY INDUSTRIES</h5>
                                            <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                    <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                    <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link to={'/referenceList/holidayListByIndustries'}>
                                            <div className={style.dashboardCardStyle}>
                                                <h5 className={`${style.headingForReferenceList}`}>HOLIDAY LIST BY INDUSTRIES</h5>
                                                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                                        <span className={style.dashboardCardColorOption1}>DEFAULT LIST IS CREATED</span>
                                                        <span className={style.dashboardCardColorOption2}>LAST UPDATED ON JULY 2022</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.spaceBetween}>
                    <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
                    <p className={style.poweredBy}>© TimeSmart.AI</p>
                </div>
            </div>
            {/* {showPodTypeForHealthcareDialog && (
                <NewPodTypeForHealthcare getPodTypeForHealthcareDialog={getPodTypeForHealthcareDialog} />
            )} */}
        </Fragment>
    )
}

export default SuperAdminDashboard;
