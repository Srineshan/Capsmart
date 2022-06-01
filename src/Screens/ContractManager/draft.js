import React from 'react';
import UserLogo from './../../images/userLogo.jpg';
import ChevronRight from './../../images/chevronRight.png';
import Envelope from './../../images/envelope.png';
import Filter from './../../images/filter.png';
import Bell from './../../images/bell.png';
import Activate from './../../images/activate.png';
import Delete from './../../images/delete.png';
import ProgressBar from "@ramonak/react-progress-bar";
import RedWarning from './../../images/redWarning.png';
import PageFooterIcon from './../../images/pageFooterIcon.png';
import style from './index.module.scss';

const Draft = ({getSelectedContract, getDeleteDraftDialog, getContractActivationDialog, getAddContract}) => {
    return(
        <div className={style.margin20}>
            <div className={`${style.grid5}`}>
                <div className={style.cardStyle}>
                    <div className={`${style.displayInRow} ${style.alignCenter}`}>
                        <img src={UserLogo} className={style.userLogo} />
                        <div className={style.marginLeft20}>
                            <div className={style.userNameStyle}>
                                User
                            </div>
                            <div className={style.loginStatus}>
                                last login DEC 4,21 11:48 am
                            </div>
                        </div>
                        <img src={ChevronRight} className={style.chevronRightStyle}/>
                    </div>
                </div>
                <div className={`${style.cardStyle}`} onClick={() => getSelectedContract('active contracts')}>
                    <h5 className={`${style.headingForContracts}`}>ACTIVE CONTRACTS</h5>
                    <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                        <p className={`${style.headingCountForContracts}`}>4</p>
                        <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                            <span><span className={style.green}>1 </span> AUTO RENEWED</span>
                            <span><span>1 </span> EXPIRING IN 30 DAYS</span>
                        </div>
                    </div>
                </div>
                <div className={`${style.cardStyle} ${style.selectedContractBackground}`} onClick={() => getSelectedContract('draft')}>
                    <h5 className={`${style.headingForContracts}`}>DRAFT</h5>
                    <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                        <p className={`${style.headingCountForContracts}`}>2</p>
                        <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                            <span><span className={style.yellow}>1 </span> ACTIVATION IN-PROGRESS</span>
                            <span><span className={style.red}>1 </span> ACTIVATION PAST DUE</span>
                        </div>
                    </div>
                </div>
                <div className={style.cardStyle} onClick={() => getSelectedContract('upcoming renewals')}>
                    <p className={style.next30Style}>NEXT 30 DAYS</p>
                    <h5 className={style.headingForContracts}>UPCOMING RENEWALS</h5>
                    <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                        <p className={`${style.headingCountForContracts}`}>2</p>
                        <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                            <span><span className={style.blue}>1 </span> EXTENSION REQUIRED</span>
                            <span><span className={style.blue}>1 </span> NEW CONTRACT REQUIRED</span>
                        </div>
                    </div>
                </div>
                <div className={style.cardStyle} onClick={() => getSelectedContract('expired or terminated')}>
                    <h5 className={`${style.headingForContracts}`}>EXPIRED / TERMINATED</h5>
                    <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                        <p className={`${style.headingCountForContracts}`}>3</p>
                        <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                            <span><span className={style.red}>1 </span> EXPIRED</span>
                            <span><span className={style.red}>1 </span> TERMINATED</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.bigCardGrid}>
                <div className={`${style.bigCardStyle} ${style.bigCalendarLeftCardWidth}`}>
                    <h5 className={style.statisticsHeading}>February 2022 Summary Statistics</h5>
                    <div className={style.scrollStyle}>
                        <div className={style.progressbarStyle}>
                            <div className={style.spaceBetween}>
                                <p className={style.statisticsProgress}><strong>13</strong> <span className={style.marginLeft20}>INDIVIDUAL</span></p>
                                <p className={style.viewStyle}>View</p>
                            </div>
                            <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#00C07F' baseBgColor="#ccffee" className={style.progressMargin} />
                        </div>
                        <div className={style.progressbarStyle}>
                            <div className={style.spaceBetween}>
                                <p className={style.statisticsProgress}><strong>32</strong> <span className={style.marginLeft20}>MULTIPLE</span></p>
                                <p className={style.viewStyle}>View</p>
                            </div>
                            <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#FEC106' baseBgColor="#fff2cc" className={style.progressMargin} />
                        </div>
                        <div className={style.progressbarStyle}>
                            <div className={style.spaceBetween}>
                                <p className={style.statisticsProgress}><strong>47</strong> <span className={style.marginLeft20}>UPCOMING RENEWAL</span></p>
                                <p className={style.viewStyle}>View</p>
                            </div>
                            <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#FF6562' baseBgColor="#ffcdcc" className={style.progressMargin} />
                        </div>
                        <div className={style.progressbarStyle}>
                            <div className={style.spaceBetween}>
                                <p className={style.statisticsProgress}><strong>50</strong> <span className={style.marginLeft20}>AUTO RENEWED</span></p>
                                <p className={style.viewStyle}>View</p>
                            </div>
                            <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#FF6562' baseBgColor="#ffcdcc" className={style.progressMargin} />
                        </div>
                        <div className={style.progressbarStyle}>
                            <div className={style.spaceBetween}>
                                <p className={style.statisticsProgress}><strong>50</strong> <span className={style.marginLeft20}>CONTRACT WITH EXPIRING DOC</span></p>
                                <p className={style.viewStyle}>View</p>
                            </div>
                            <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#FF6562' baseBgColor="#ffcdcc" className={style.progressMargin} />
                        </div>
                    </div>
                    <img src={PageFooterIcon} alt="footer" className={style.footerIconStyle} />
                </div>
                <div className={style.bigCardStyle}>
                    <div className={style.spaceBetween}>
                        <div className={`${style.displayInRow} ${style.marginTop20}`}>
                            <p className={`${style.blue} ${style.activeContractsWidth}`}>DRAFT CONTRACTS</p>
                            <div className={style.searchBarStyle}>
                                <p>Search here</p>
                                <p className={style.marginRight}>&#128269;</p>
                            </div>
                            <img src={Envelope} alt="Envelope" className={style.smallIcons} />
                            <img src={Bell} alt="Bell" className={style.smallIcons} />
                            <img src={Filter} alt="Filter" className={style.filterIcon} />
                        </div>
                        <button className={style.contractButton} onClick={() => getAddContract(true)} >ADD CONTRACT</button>
                    </div>
                    <div>
                        <div className={`${style.tableHeader} ${style.marginTop40}`}>
                            <input type="checkbox" className={style.checkBoxHeader} />
                            <p className={style.tableHeaderFontStyle}>CONTRACT TYPE</p>
                            <p className={style.tableHeaderFontStyle}>CONTRACT ID</p>
                            <p className={style.tableHeaderFontStyle}>CONTRACT NAME</p>
                            <p className={style.tableHeaderFontStyle}>ACTIVATION STATUS</p>
                            <p className={style.tableHeaderFontStyle}>LAST UPDATED</p>
                            <p className={style.tableHeaderFontStyle}>LAST UPDATED BY</p>
                            <p className={style.tableHeaderFontStyle}>CONTRACT MANAGER</p>
                            <p className={style.tableHeaderFontStyle}>ACTION</p>
                        </div>
                        <div className={`${style.tableData} ${style.displayInRow}`}>
                            <div className={`${style.displayInRow} ${style.width10}`}>
                                <input type="checkbox" className={style.checkBoxData} />
                                <div className={`${style.yellow} ${style.yellowDotStyle}`}></div>
                            </div>
                            <p className={style.tableDataFontStyle}>Multiple</p>
                            <p className={style.tableDataFontStyle}>7837428</p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum </p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum</p>
                            <p className={style.tableDataFontStyle}>07/19/2019</p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum</p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum</p>
                            <p className={style.tableDataFontStyle}>...</p>
                        </div>
                        <div className={`${style.tableData} ${style.displayInRow}`}>
                            <div className={`${style.displayInRow} ${style.width10}`}>
                                <input type="checkbox" className={style.checkBoxData} />
                                <div className={`${style.red} ${style.redDotStyle}`}></div>
                            </div>
                            <p className={style.tableDataFontStyle}>Individual</p>
                            <p className={style.tableDataFontStyle}>7837428</p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum </p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum</p>
                            <p className={style.tableDataFontStyle}>07/19/2019</p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum</p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum</p>
                            <p className={style.tableDataFontStyle}>...</p>
                        </div>
                        <div className={`${style.tableData} ${style.displayInRow}`}>
                            <div className={`${style.displayInRow} ${style.width10}`}>
                                <input type="checkbox" className={style.checkBoxData} />
                                <div className={`${style.blue} ${style.blueDotStyle}`}></div>
                            </div>
                            <p className={style.tableDataFontStyle}>Individual</p>
                            <p className={style.tableDataFontStyle}>7837428</p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum </p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum</p>
                            <p className={style.tableDataFontStyle}>07/19/2019</p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum</p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum</p>
                            <p className={style.tableDataFontStyle}>...</p>
                        </div>
                        <div className={`${style.tableData} ${style.displayInRow}`}>
                            <div className={`${style.displayInRow} ${style.width10}`}>
                                <input type="checkbox" className={style.checkBoxData} />
                                <div className={`${style.yellow} ${style.yellowDotStyle}`}></div>
                                <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                            </div>
                            <p className={style.tableDataFontStyle}>Individual</p>
                            <p className={style.tableDataFontStyle}>7837428</p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum </p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum</p>
                            <p className={style.tableDataFontStyle}>07/19/2019</p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum</p>
                            <p className={style.tableDataFontStyle}>Lorem Ipsum</p>
                            <p className={style.tableDataFontStyle}>...</p>
                        </div>
                        <div className={`${style.displayInCol} ${style.actionCard} ${style.cursorPointer}`}>
                            <img src={Delete} className={style.actionsIcon} onClick={() => getDeleteDraftDialog(true)} />
                            <img src={Activate} className={style.activateIcon} onClick={() => getContractActivationDialog(true)} />
                        </div>
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
            <div className={style.spaceBetween}>                        
                <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
                <p className={style.poweredBy}>© TimeSmart.AI</p>
            </div>
        </div>
    )
}

export default Draft;