import React, { useState, useRef, useEffect } from 'react';
import Navbar from './../../Components/Navbar';
import {GET, PUT, POST, TenantID} from './../dataSaver';
import Popover from '@mui/material/Popover';
import UserLogo from './../../images/userLogo.jpg';
import DefaultUserLogo from './../../images/defaultUserLogo.jpg';
import ChevronRight from './../../images/chevronRight.png';
import Envelope from './../../images/envelope.png';
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
import ContractExtensionDialog from './contractExtensionDialog';
import ContractTiles from './contractTiles';
import {format} from 'date-fns';

import style from './index.module.scss';

const ActiveContracts = ({getSelectedContract, getAddContract, getExtensionDialog, getTerminationDialog, getCloneDialog, activeContracts, getNewContract, getContractType, getSelectedContractType, getContractIdFromActive, selectedContract, users, activeContractsLength, draftContractsLength, upcomingContractsLength, expiredContractsLength}) => {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const menuRef = useRef(null);
    useOptionsHide(menuRef);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const id = open ? 'simple-popover' : undefined;

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

      const handleAddContract = () => {
        getAddContract(true);
      }
    return(
        <div className={style.margin20}>
            <div className={`${style.bigCardGrid}`}>
                <div className={`${style.cardStyle} ${style.bigCalendarLeftCardWidth}`}>
                    <div className={`${style.displayInRow} ${style.alignCenter}`}>
                        <label for="file-upload">
                            <img src={DefaultUserLogo} className={`${style.userLogo} ${style.cursorPointer}`} />
                        </label>
                        <input id="file-upload" type="file"/>
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
                            <p className={`${style.blue} ${style.activeContractsWidth}`}>ACTIVE CONTRACTS</p>
                            <div className={style.searchBarStyle}>
                                <p>Search here</p>
                                <p className={style.marginRight}>&#128269;</p>
                            </div>
                            {/* <img src={Envelope} alt="Envelope" className={style.smallIcons} />
                            <img src={Bell} alt="Bell" className={style.smallIcons} /> */}
                            <img src={Filter} alt="Filter" className={style.filterIcon} />
                        </div>
                        <button className={style.contractButton} onClick={() => {handleAddContract()}} >ADD CONTRACT</button>
                    </div>
                    <div>
                        <div className={`${style.tableHeader} ${style.activeContractGrid} ${style.marginTop40}`}>
                            <p className={style.marginLeft30}></p>
                            <p className={`${style.tableHeaderFontStyle}`}>CONTRACT TYPE</p>
                            <p className={style.tableHeaderFontStyle}> ID</p>
                            <p className={style.tableHeaderFontStyle}> NAME</p>
                            <p className={style.tableHeaderFontStyle}>CONTRACTORS</p>
                            <p className={style.tableHeaderFontStyle}>EFFECTIVE DATE</p>
                            <p className={style.tableHeaderFontStyle}>POD STATUS</p>
                            <p className={style.tableHeaderFontStyle}> MANAGER</p>
                            <p className={style.tableHeaderFontStyle}>LAST UPDATED</p>
                            <p className={style.tableHeaderFontStyle}>ACTION</p>
                        </div>
                        {activeContracts?.map((data, index) => (
                          <>
                            <div className={`${style.tableData} ${style.activeContractGrid} ${index%2 === 0 && style.alternativeBackgroundColor}`} key={index}>
                                <div className={`${style.displayInRow} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                </div>
                                <p className={`${style.tableDataFontStyle} ${style.cursorPointer}`} onClick={() => {getNewContract(true);getContractType(data?.contractType);getSelectedContractType('New Contract');getContractIdFromActive(data?.id);console.log(data?.id)}}>{data?.contractType}</p>
                                <p className={`${style.tableDataFontStyle} ${style.cursorPointer}`} onClick={() => {getNewContract(true);getContractType(data?.contractType);getSelectedContractType('New Contract');getContractIdFromActive(data?.id);console.log(data?.id)}}>{data?.contractDetail?.contractId?.id}</p>
                                <p className={`${style.tableDataFontStyle} ${style.cursorPointer}`} onClick={() => {getNewContract(true);getContractType(data?.contractType);getSelectedContractType('New Contract');getContractIdFromActive(data?.id);console.log(data?.id)}}>{data?.contractName?.contractName}</p>
                                <p className={`${style.tableDataFontStyle} ${style.cursorPointer}`} onClick={() => {getNewContract(true);getContractType(data?.contractType);getSelectedContractType('New Contract');getContractIdFromActive(data?.id);console.log(data?.id)}}> - </p>
                                <p className={`${style.tableDataFontStyle} ${style.cursorPointer}`} onClick={() => {getNewContract(true);getContractType(data?.contractType);getSelectedContractType('New Contract');getContractIdFromActive(data?.id);console.log(data?.id)}}>{format(new Date(data?.contractDetail?.contractTerm?.effectiveDate), 'MM-dd-yyyy')}</p>
                                <div className={`${style.displayInRow} ${style.cursorPointer}`} onClick={() => {getNewContract(true);getContractType(data?.contractType);getSelectedContractType('New Contract');getContractIdFromActive(data?.id);console.log(data?.id)}}>
                                    <img src={GreenPage} alt="warning" className={style.colorFileStyle} />
                                    <p className={style.tableDataFontStyle}>5</p>
                                </div>
                                <p className={`${style.tableDataFontStyle} ${style.cursorPointer}`} onClick={() => {getNewContract(true);getContractType(data?.contractType);getSelectedContractType('New Contract');getContractIdFromActive(data?.id);console.log(data?.id)}}>
                                {users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} {users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}
                                </p>
                                <p className={`${style.tableDataFontStyle} ${style.cursorPointer}`} onClick={() => {getNewContract(true);getContractType(data?.contractType);getSelectedContractType('New Contract');getContractIdFromActive(data?.id);console.log(data?.id)}}>08-01-2022</p>
                                <div className={`${style.tableDataFontStyle} ${style.cursorPointer}`} onClick={() => {setShowOptions(true);setSelectedMenuIndex(index)}}>
                                    <img src={ThreeDot} alt="ThreeDot" className={`${style.dotStyle}`} onClick={(e) => handleClick(e)} aria-describedby={id} />
                                    {showOptions && index === selectedMenuIndex && (
                                        <Popover
                                            id={id}
                                            open={open}
                                            anchorEl={anchorEl}
                                            onClose={handleClose}
                                            anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                            }}
                                        >
                                            <div className={`${style.displayInCol} ${style.actionCard} ${style.cursorPointer}`} ref={menuRef}>
                                                <img src={ContractExtension} className={style.actionsIcon} onClick={() => getExtensionDialog(true)} />
                                                <img src={Terminate} className={style.actionsIcon} onClick={() => getTerminationDialog(true)} />
                                                <img src={Clone} className={style.actionsIcon} onClick={() => getCloneDialog(true)} />
                                            </div>
                                        </Popover>
                                    )}
                                </div>
                            </div>
                          </>
                        ))}
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

export default ActiveContracts;
