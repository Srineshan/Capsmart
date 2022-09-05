import React, {useState, useRef, useEffect} from 'react';
import UserLogo from './../../images/userLogo.jpg';
import ChevronRight from './../../images/chevronRight.png';
import Envelope from './../../images/envelope.png';
import Filter from './../../images/filter.png';
import Bell from './../../images/bell.png';
import RenewDark from './../../images/renewDark.png';
import TermianteDark from './../../images/termianteDark.png';
import ExtensionDark from './../../images/extensionDark.png';
import CreateContractDark from './../../images/createContractDark.png';
import PageFooterIcon from './../../images/pageFooterIcon.png';
import RedWarning from './../../images/redWarning.png';
import ThreeDot from './../../images/threeDot.png';
import ProgressBar from "@ramonak/react-progress-bar";
import ContractTiles from './contractTiles';

import style from './index.module.scss';

const UpcomingRenewals = ({getSelectedContract, getAddContract, upcomingContracts, selectedContract, activeContractsLength, draftContractsLength, upcomingContractsLength, expiredContractsLength}) => {
    const [showOptions, setShowOptions] = useState(false);
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
        <div className={style.margin20}>
            <div className={`${style.bigCardGrid}`}>
                <div className={`${style.cardStyle} ${style.bigCalendarLeftCardWidth}`}>
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
                <ContractTiles getSelectedContract={getSelectedContract} selectedContract={selectedContract}
                activeContractsLength={activeContractsLength}
                draftContractsLength={draftContractsLength}
                upcomingContractsLength={upcomingContractsLength}
                expiredContractsLength={expiredContractsLength} />
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
                            <p className={`${style.blue} ${style.activeContractsWidth}`}>UPCOMING RENEWALS</p>
                            <div className={style.searchBarStyle}>
                                <p>Search here</p>
                                <p className={style.marginRight}>&#128269;</p>
                            </div>
                            {/* <img src={Envelope} alt="Envelope" className={style.smallIcons} />
                            <img src={Bell} alt="Bell" className={style.smallIcons} /> */}
                            <img src={Filter} alt="Filter" className={style.filterIcon} />
                        </div>
                        <button className={style.contractButton} onClick={() => getAddContract(true)} >ADD CONTRACT</button>
                    </div>
                    <div>
                        <div className={`${style.tableHeader} ${style.draftContractGrid} ${style.marginTop40}`}>
                            <p className={style.marginLeft30} ></p>
                            <p className={`${style.tableHeaderFontStyle}`}>CONTRACT TYPE</p>
                            <p className={style.tableHeaderFontStyle}> ID</p>
                            <p className={style.tableHeaderFontStyle}> NAME</p>
                            <p className={style.tableHeaderFontStyle}>EXPIRATION DATE</p>
                            <p className={style.tableHeaderFontStyle}>EXPIRING IN</p>
                            <p className={style.tableHeaderFontStyle}> MANAGER</p>
                            <p className={style.tableHeaderFontStyle}>LAST UPDATE</p>
                            <p className={style.tableHeaderFontStyle}>ACTION</p>
                        </div>
                        {/* <div className={`${style.tableData} ${style.draftContractGrid}`}>
                            <div className={`${style.displayInRow} ${style.marginLeft30}`}>
                                <div className={`${style.green} ${style.greenDotStyle}`}></div>
                            </div>
                            <p className={style.tableDataFontStyle}>Multiple</p>
                            <p className={style.tableDataFontStyle}>7837428</p>
                            <p className={style.tableDataFontStyle}>Staff Burke MD</p>
                            <p className={style.tableDataFontStyle}>07/19/2019</p>
                            <p className={style.tableDataFontStyle}>15 days</p>
                            <p className={style.tableDataFontStyle}>Ismail Moola</p>
                            <p className={style.tableDataFontStyle}>07/19/2019</p>
                            <div className={style.tableDataFontStyle}>
                                <img src={ThreeDot} alt="ThreeDot" className={`${style.dotStyle}`} onClick={() => setShowOptions(true)} />
                            </div>
                        </div>
                        <div className={`${style.tableData} ${style.draftContractGrid}`}>
                            <div className={`${style.displayInRow} ${style.marginLeft30}`}>
                                <div className={`${style.green} ${style.yellowDotStyle}`}></div>
                            </div>
                            <p className={style.tableDataFontStyle}>Individual</p>
                            <p className={style.tableDataFontStyle}>7837428</p>
                            <p className={style.tableDataFontStyle}>Gary Judge MD </p>
                            <p className={style.tableDataFontStyle}>07/19/2019</p>
                            <p className={style.tableDataFontStyle}>15 days</p>
                            <p className={style.tableDataFontStyle}>Ismail Moola</p>
                            <p className={style.tableDataFontStyle}>07/19/2019</p>
                            <div className={style.tableDataFontStyle}>
                                <img src={ThreeDot} alt="ThreeDot" className={`${style.dotStyle}`} onClick={() => setShowOptions(true)} />
                            </div>
                        </div>
                        <div className={`${style.tableData} ${style.draftContractGrid}`}>
                            <div className={`${style.displayInRow} ${style.marginLeft30}`}>
                                <div className={`${style.green} ${style.yellowDotStyle}`}></div>
                            </div>
                            <p className={style.tableDataFontStyle}>Individual</p>
                            <p className={style.tableDataFontStyle}>7837428</p>
                            <p className={style.tableDataFontStyle}>Kathy Sims MD</p>
                            <p className={style.tableDataFontStyle}>07/19/2019</p>
                            <p className={style.tableDataFontStyle}>15 days</p>
                            <p className={style.tableDataFontStyle}>Ismail Moola</p>
                            <p className={style.tableDataFontStyle}>07/19/2019</p>
                            <div className={style.tableDataFontStyle}>
                                <img src={ThreeDot} alt="ThreeDot" className={`${style.dotStyle}`} onClick={() => setShowOptions(true)} />
                            </div>
                        </div>
                        <div className={`${style.tableData} ${style.draftContractGrid}`}>
                            <div className={`${style.displayInRow} ${style.marginLeft30}`}>
                                <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                            </div>
                            <p className={style.tableDataFontStyle}>Individual</p>
                            <p className={style.tableDataFontStyle}>7837428</p>
                            <p className={style.tableDataFontStyle}>Physician Group 1 </p>
                            <p className={style.tableDataFontStyle}>07/19/2019</p>
                            <p className={style.tableDataFontStyle}>15 days</p>
                            <p className={style.tableDataFontStyle}>Ismail Moola</p>
                            <p className={style.tableDataFontStyle}>07/19/2019</p>
                            <div className={style.tableDataFontStyle}>
                                <img src={ThreeDot} alt="ThreeDot" className={`${style.dotStyle}`} onClick={() => setShowOptions(true)} />
                            </div>
                        </div>
                        {showOptions && (
                            <div className={`${style.displayInCol} ${style.actionCard}`} ref={menuRef}>
                                <img src={RenewDark} className={style.actionsIcon} />
                                <img src={CreateContractDark} className={style.actionsIcon} />
                                <img src={ExtensionDark} className={style.actionsIcon} />
                                <img src={TermianteDark} className={style.actionsIcon} />
                            </div>
                        )} */}
                        <div className={style.spaceBetween}>
                            {/* <p className={style.accountActivityStyle}>Last account activity: 30 days</p> */}
                            <p></p>
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

export default UpcomingRenewals;
