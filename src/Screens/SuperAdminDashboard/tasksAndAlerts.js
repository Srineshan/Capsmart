import React, { useState, useRef, useEffect, Fragment } from 'react';
import Navbar from './../../Components/Navbar';
import UserLogo from './../../images/userLogo.jpg';
import ChevronRight from './../../images/chevronRight.png';
import PrintIcon from './../../images/printIcon.png';
import Filter from './../../images/filter.png';
import Bell from './../../images/bell.png';
import Terminate from './../../images/terminate.png';
import Clone from './../../images/clone.png';
import RedPage from './../../images/redPage.png';
import YellowPage from './../../images/yellowPage.png';
import ThreeDot from './../../images/threeDot.png';
import GreenPage from './../../images/greenPage.png';
import PageFooterIcon from './../../images/pageFooterIcon.png';
import RedWarning from './../../images/redWarning.png';
import ContractExtension from './../../images/contractExtension.png';
import ProgressBar from "@ramonak/react-progress-bar";
import style from './index.module.scss';

const TasksAndAlerts = ({getSelectedContract, getAddContract, getExtensionDialog, getTerminationDialog, getCloneDialog}) => {
    const [showOptions, setShowOptions] = useState(false);
    const [viewToDo, setViewToDo] = useState(true);

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
                    <div className={`${style.cardStyle} ${style.selectedContractBackground}`} onClick={() => getSelectedContract('active contracts')}>
                        <h5 className={`${style.headingForContracts}`}>CUSTOMERS & PROSPECTS</h5>
                        <div className={`${style.spaceBetween} ${style.marginTop20} ${style.marginRight}`}>
                            <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                <span className={style.displayInRow}><p className={style.headingCountForContracts}>110 </p> ACTIVE CUSTOMERS</span>
                                <span className={style.displayInRow}><p className={`${style.yellow} ${style.headingCountForContracts}`}>12 </p> ON GOING TRIALS</span>
                            </div>
                            <div className={`${style.optionsStyle} ${style.displayInColRev}`}>
                                <span><span className={style.red}>1 </span> TRIAL EXPIRING</span>
                                <span><span className={style.red}>1 </span> UPCOMING RENEWAL</span>
                                <span><span className={style.green}>1 </span> AUTO RENEWED</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.cardStyle} onClick={() => getSelectedContract('draft')}>
                        <h5 className={`${style.headingForContracts}`}>REGISTERED USERS</h5>
                        <div className={`${style.spaceBetween} ${style.marginTop20} ${style.marginRight}`}>
                            <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                <span className={style.displayInRow}><p className={style.headingCountForContracts}>22376 </p> REGISTERED USERS</span>
                                <span className={style.displayInRow}><p className={`${style.yellow} ${style.headingCountForContracts}`}>14 </p> TRIAL USERS</span>
                            </div>
                            <div className={`${style.optionsStyle} ${style.displayInColRev}`}>
                                <span className={style.displayInRow}><span className={`${style.red} ${style.marginRight}`}>1 </span> BLOCKED</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.cardStyle} onClick={() => getSelectedContract('upcoming renewals')}>
                        <h5 className={style.headingForContracts}>AT RISK SUBSCRIPTIONS</h5>
                        <div className={`${style.spaceBetween} ${style.marginTop20} ${style.marginRight}`}>
                            <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                <span className={style.displayInRow}><p className={style.headingCountForContracts}>5 </p> EXPIRED</span>
                                <span className={style.displayInRow}><p className={`${style.yellow} ${style.headingCountForContracts}`}>14 </p>NO ACTIVITY IN LAST 30 DAYS</span>
                            </div>
                            <div className={`${style.optionsStyle} ${style.displayInColRev}`}>
                                <span>AT RISK</span>
                                <span className={`${style.red} ${style.displayInRow}`}><span className={style.marginRight}>$ </span>30,050</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.cardStyle} onClick={() => getSelectedContract('expired or terminated')}>
                        <h5 className={`${style.headingForContracts}`}>PRIORITY FEEDBACK TICKETS</h5>
                        <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                            <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                <span className={style.displayInRow}><p className={style.headingCountForContracts}>25 </p> TOTAL TICKETS</span>
                            </div>
                            <div className={`${style.optionsStyle} ${style.displayInColRev} ${style.marginLeft30}`}>
                                <span><span className={style.red}>8 </span> PAST DUE</span>
                                <span><span className={style.red}>9 </span> HIGH PRIORITY</span>
                                <span><span className={style.red}>13 </span> EXCEPTION ERRORS</span>
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
                        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                            <p className={`${style.marginLeft30} ${style.activeContractsWidth}`}>{`{{Today Date}}`}</p>
                            <div className={`${style.displayInRow}`}>
                                <div className={style.searchBarStyle}>
                                    <p>Search here</p>
                                    <p className={style.marginRight}>&#128269;</p>
                                </div>
                                <img src={Bell} alt="Bell" className={style.smallIcons} />
                                <img src={PrintIcon} alt="Print" className={style.smallIcons} />
                                <img src={Filter} alt="Filter" className={style.filterIcon} />
                            </div>
                        </div>
                        <div className={style.buttonGroupUsers}>
                            <button className={viewToDo && style.registeredButton} onClick={() => setViewToDo(true)}>To Do ( 3 )</button>
                            <button className={!viewToDo ? style.registeredButton : style.redText} onClick={() => setViewToDo(false)}>Alerts ( 16 )</button>
                        </div>
                        <div>
                            <div className={`${style.tableHeaderToDo} ${style.marginTop40}`}>
                                <p className={style.checkBoxHeader}></p>
                                <p className={`${style.tableHeaderFontStyleToDo}`}> Task Id</p>
                                <p className={style.tableHeaderFontStyleToDo}> Task Type</p>
                                <p className={style.tableHeaderFontStyleToDo}>Subject / Reference</p>
                                <p className={style.tableHeaderFontStyleToDo}>Action Required</p>
                                <p className={style.tableHeaderFontStyleToDo}>Due Date</p>
                                <p className={style.tableHeaderFontStyleToDo}> Assign To</p>
                                <p className={style.tableHeaderFontStyleToDo}>Last Updated</p>
                                <p className={style.tableHeaderFontStyleToDo}>Last Updated By</p>
                            </div>
                            <div className={`${style.tableDataToDo} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            
                            {showOptions && (
                                <div className={`${style.displayInCol} ${style.actionCard} ${style.cursorPointer}`} ref={menuRef}>
                                    <img src={ContractExtension} className={style.actionsIcon} onClick={() => getExtensionDialog(true)} />
                                    <img src={Terminate} className={style.actionsIcon} onClick={() => getTerminationDialog(true)} />
                                    <img src={Clone} className={style.actionsIcon} onClick={() => getCloneDialog(true)} />
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
                <div className={style.spaceBetween}>                        
                    <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
                    <p className={style.poweredBy}>© TimeSmart.AI</p>
                </div>
            </div>
        </Fragment>
    )
}

export default TasksAndAlerts;