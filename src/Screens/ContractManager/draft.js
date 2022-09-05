import React, {useState, useRef, useEffect} from 'react';
import Popover from '@mui/material/Popover';
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
import ThreeDot from './../../images/threeDot.png';
import ContractTiles from './contractTiles';
import {PUT} from './../dataSaver';
import {SuccessToaster,ErrorToaster} from './../../utils/toaster';

import style from './index.module.scss';

const Draft = ({getSelectedContract, getDeleteDraftDialog, getContractActivationDialog, getAddContract, draftContracts, selectedContract, users, activeContractsLength, draftContractsLength, upcomingContractsLength, expiredContractsLength, getContracts}) => {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const id = open ? 'simple-popover' : undefined;

    const activateContracts = async(id) => {
      let status = 'ACTIVATE';
      await PUT(`contract-managment-service/contracts/${id}/contractStatus/${status}`)
      .then(response=>{SuccessToaster('Contract Activated Successfully');getContracts();})
      .catch(error=>{ErrorToaster('Contract Activation Failed');})
    };

    console.log(draftContracts);
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
                            <p className={`${style.blue} ${style.activeContractsWidth}`}>DRAFT CONTRACTS</p>
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
                            <p className={style.marginLeft30}></p>
                            <p className={`${style.tableHeaderFontStyle}`}>CONTRACT TYPE</p>
                            <p className={style.tableHeaderFontStyle}> ID</p>
                            <p className={style.tableHeaderFontStyle}> NAME</p>
                            <p className={style.tableHeaderFontStyle}>ACTIVATION STATUS</p>
                            <p className={style.tableHeaderFontStyle}> MANAGER</p>
                            <p className={style.tableHeaderFontStyle}>LAST UPDATED</p>
                            <p className={style.tableHeaderFontStyle}>LAST UPDATED BY</p>
                            <p className={style.tableHeaderFontStyle}>ACTION</p>
                        </div>
                        {draftContracts?.map((data, index) => (
                            <>
                                <div className={`${style.tableData} ${style.draftContractGrid} ${index%2 === 0 && style.alternativeBackgroundColor}`} key={index}>
                                    <div className={`${style.displayInRow} ${style.marginLeft30}`}>
                                        <div className={`${style.yellow} ${style.yellowDotStyle}`}></div>
                                    </div>
                                    <p className={style.tableDataFontStyle}>{data?.contractType}</p>
                                    <p className={style.tableDataFontStyle}>{data?.contractDetail?.contractId?.id}</p>
                                    <p className={style.tableDataFontStyle}>{data?.contractName?.contractName} </p>
                                    <p className={style.tableDataFontStyle}>{data?.status}</p>
                                    <p className={style.tableDataFontStyle}>{users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} {users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}</p>
                                    <p className={style.tableDataFontStyle}>08-01-2022</p>
                                    <p className={style.tableDataFontStyle}>{users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.firstName} {users?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data)[0]?.name?.lastName}</p>
                                    <div className={`${style.tableDataFontStyle} ${style.cursorPointer}`}>
                                        <img src={ThreeDot} alt="ThreeDot" className={`${style.dotStyle}`} onClick={(e) => {setShowOptions(true);setSelectedMenuIndex(index);handleClick(e)}}  aria-describedby={id} />
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
                                                    <img src={Delete} className={style.actionsIcon} onClick={() => getDeleteDraftDialog(true)} />
                                                    <img src={Activate} className={style.activateIcon}
                                                    onClick={() =>
                                                      {
                                                        // getContractActivationDialog(true);
                                                        activateContracts(data?.id);
                                                      }
                                                    }
                                                    />
                                                </div>
                                            </Popover>
                                        )}
                                    </div>
                                </div>
                            </>
                        ))}
                        {/* <>
                            <div className={`${style.tableData} ${style.draftContractGrid}`}>
                                <div className={`${style.displayInRow} ${style.marginLeft30}`}>
                                    <div className={`${style.red} ${style.redDotStyle}`}></div>
                                </div>
                                <p className={style.tableDataFontStyle}>Individual</p>
                                <p className={style.tableDataFontStyle}>7837428</p>
                                <p className={style.tableDataFontStyle}>PAMF </p>
                                <p className={style.tableDataFontStyle}>Draft</p>
                                <p className={style.tableDataFontStyle}>Alex Ball MD</p>
                                <p className={style.tableDataFontStyle}>07/19/2019</p>
                                <p className={style.tableDataFontStyle}>11/06/2022</p>
                                <div className={`${style.tableDataFontStyle} ${style.cursorPointer}`}>
                                    <img src={ThreeDot} alt="ThreeDot" className={`${style.dotStyle}`} onClick={() => {setShowOptions(true);setSelectedMenuIndex(1)}} />
                                </div>
                            </div>
                            {showOptions && 1 === selectedMenuIndex && (
                                <div className={`${style.displayInCol} ${style.actionCard} ${style.cursorPointer}`} ref={menuRef}>
                                    <img src={Delete} className={style.actionsIcon} onClick={() => getDeleteDraftDialog(true)} />
                                    <img src={Activate} className={style.activateIcon} onClick={() => getContractActivationDialog(true)} />
                                </div>
                            )}
                        </>
                        <>
                            <div className={`${style.tableData} ${style.draftContractGrid}`}>
                                <div className={`${style.displayInRow} ${style.marginLeft30}`}>
                                    <div className={`${style.blue} ${style.blueDotStyle}`}></div>
                                </div>
                                <p className={style.tableDataFontStyle}>Individual</p>
                                <p className={style.tableDataFontStyle}>7837428</p>
                                <p className={style.tableDataFontStyle}>LifeCare</p>
                                <p className={style.tableDataFontStyle}>Draft</p>
                                <p className={style.tableDataFontStyle}>Alex Ball MD</p>
                                <p className={style.tableDataFontStyle}>07/19/2019</p>
                                <p className={style.tableDataFontStyle}>02/06/2022</p>
                                <div className={`${style.tableDataFontStyle} ${style.cursorPointer}`}>
                                    <img src={ThreeDot} alt="ThreeDot" className={`${style.dotStyle}`} onClick={() => {setShowOptions(true);setSelectedMenuIndex(2)}} />
                                </div>
                            </div>
                            {showOptions && 2 === selectedMenuIndex && (
                                <div className={`${style.displayInCol} ${style.actionCard} ${style.cursorPointer}`} ref={menuRef}>
                                    <img src={Delete} className={style.actionsIcon} onClick={() => getDeleteDraftDialog(true)} />
                                    <img src={Activate} className={style.activateIcon} onClick={() => getContractActivationDialog(true)} />
                                </div>
                            )}
                        </>
                        <>
                            <div className={`${style.tableData} ${style.draftContractGrid}`}>
                                <div className={`${style.displayInRow} ${style.marginLeft30}`}>
                                    <div className={`${style.yellow} ${style.yellowDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyle}>Individual</p>
                                <p className={style.tableDataFontStyle}>7837428</p>
                                <p className={style.tableDataFontStyle}>Jeff Nunn MD</p>
                                <p className={style.tableDataFontStyle}>Waiting for Approval</p>
                                <p className={style.tableDataFontStyle}>Alex Ball MD</p>
                                <p className={style.tableDataFontStyle}>07/19/2019</p>
                                <p className={style.tableDataFontStyle}>08/06/2022</p>
                                <div className={`${style.tableDataFontStyle} ${style.cursorPointer}`}>
                                    <img src={ThreeDot} alt="ThreeDot" className={`${style.dotStyle}`} onClick={() => {setShowOptions(true);setSelectedMenuIndex(3)}} />
                                </div>
                            </div>
                            {showOptions && 3 === selectedMenuIndex && (
                                <div className={`${style.displayInCol} ${style.actionCard} ${style.cursorPointer}`} ref={menuRef}>
                                    <img src={Delete} className={style.actionsIcon} onClick={() => getDeleteDraftDialog(true)} />
                                    <img src={Activate} className={style.activateIcon} onClick={() => getContractActivationDialog(true)} />
                                </div>
                            )}
                        </> */}
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

export default Draft;
