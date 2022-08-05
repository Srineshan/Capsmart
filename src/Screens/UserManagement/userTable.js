import React, { useState, useEffect } from 'react';
import UserLogo from './../../images/userLogo.jpg';
import ChevronRight from './../../images/chevronRight.png';
import Envelope from './../../images/envelope.png';
import Filter from './../../images/filter.png';
import Bell from './../../images/bell.png';
import Terminate from './../../images/terminate.png';
import Clone from './../../images/clone.png';
import BlockUser from './../../images/blockUser.png';
import CancelUser from './../../images/cancelUser.png';
import LockReset from './../../images/lockReset.png';
import UploadUser from './../../images/uploadUser.png';
import ContractExtension from './../../images/contractExtension.png';
import ProgressBar from "@ramonak/react-progress-bar";
import AddUser from './addUser'
import {GET, TenantID, PUT} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import EditUser from './editUser';
import MailTemplate from './mailTemplate';
import style from './index.module.scss';
import SendEmail from './sendEmail';
import SendEmailUserList from './sendMailUserList';

const UserTable = ({getSelectedContract, getAddContract, getExtensionDialog, getTerminationDialog, getCloneDialog}) => {
    const [selectedRow, setSelectedRow] = useState('');
    const [isSelected, setIsSelected] = useState(false);
    const [viewRegisteredUser, setViewRegisteredUser] = useState(true);
    const [sendEMail, setSendEMail] = useState(false);
    const [userDetails, setUserDetails] = useState();
    const [sendEmailUserListDialog, setSendEmailUserListDialog] = useState(false);
    const [showAddUserDialog,setShowAddUserDialog] = useState(false);
    const [showEditUserDialog,setShowEditUserDialog] = useState(false);
    const [showMailtemplate,setShowMailTemplate] = useState(false);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState();

    const getUser = async() => {
        const {data: user} = await GET('user-management-service/user');
        setRegisteredUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
        setBlockedUsers(user?.filter(data => data?.blocked === true)?.map(data => data));
    };

    const handleUserUnBlock = async(data) => {
        const response = await PUT('user-management-service/user', JSON.stringify({...data, blocked: false}));
        if(response){
            SuccessToaster('User UnBlocked Successfully');
        }
        else {
            ErrorToaster('Unexpected Error');
        }
        getUser();
    }

    useEffect(()=>{
        getUser();
    },[showAddUserDialog, showEditUserDialog])

    const getSendEmailDialog = (value) => {
        setSendEMail(value);
    }

    const getSendEmailUserListDialog = (value) => {
        setSendEmailUserListDialog(value);
    }

    const getAddUserDialog = (value) => {
        setShowAddUserDialog(value);
    }

    const getEditUserDialog = (value) => {
        setShowEditUserDialog(value);
    }

    const getMailTemplate = (value) => {
        setShowMailTemplate(value);
    }

    return(
        <div className={style.margin20}>
            <div className={style.bigCardGrid}>
                <div className={style.chevronCardStyle}>
                    <div className={`${style.alignCenter}`}>
                        <img src={ChevronRight} className={style.chevronRightStyle}/>
                    </div>
                </div>
                <div className={style.displayInRow}>
                    <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                        USER MANAGEMENT
                    </div>
                    <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                        UPDATED ON FEB 16, 2022 16:45 EST
                    </div>
                </div>
            </div>
            <div className={`${style.grid5} ${style.marginTop20}`}>
                <div className={style.cardStyle}>
                    <div className={`${style.displayInCol} ${style.alignCenter}`}>
                         <div className={`${style.userNameStyle} `}>
                            JOHN
                        </div>
                        <img src={UserLogo} className={style.userLogo} />
                    </div>
                </div>
                <div className={`${style.cardStyle}`} onClick={() => getSelectedContract('active contracts')}>
                    <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>AVERAGE LOGINS</h5>
                    <p className={style.last30Style}>LAST 30 DAYS</p>
                    <div className={style.spaceBetween}>
                        <p></p>
                        <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>231</p>
                    </div>
                </div>
                <div className={`${style.cardStyle}`} onClick={() => getSelectedContract('active contracts')}>
                    <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>AVERAGE DURATION</h5>
                    <p className={style.last30Style}>PER SESSION</p>
                    <div className={style.spaceBetween}>
                        <p></p>
                        <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>13:34</p>
                    </div>
                </div>
                <div className={style.cardStyle} onClick={() => getSelectedContract('upcoming renewals')}>
                    <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>NEW USERS</h5>
                    <div className={style.spaceBetween}>
                        <p></p>
                        <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>2</p>
                    </div>
                </div>
                <div className={style.cardStyle} onClick={() => getSelectedContract('upcoming renewals')}>
                    <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>DEACTIVATED USERS</h5>
                    <p className={style.last30Style}>LAST 30 DAYS</p>
                    <div className={style.spaceBetween}>
                        <p></p>
                        <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>1</p>
                    </div>
                </div>

            </div>
            <div className={style.bigCardGrid}>
                <div className={`${style.bigCardStyle} ${style.bigCalendarLeftCardWidth}`}>
                    <div className={style.openCardStyle}>
                    </div>
                </div>
                <div className={style.bigCardStyle}>
                    <div className={style.spaceBetween}>
                        <p className={`${style.activeContractsWidth}`}>FEB 16, 2022 16:45 EST</p>
                        <div className={`${style.displayInRow} ${style.marginTop20}`}>
                            <div className={`${style.searchBarStyle} ${style.spaceBetween}`}>
                                <p>Search here</p>
                                <p className={style.marginRight}>&#128269;</p>
                            </div>
                            <img src={UploadUser} alt="UploadUser" className={style.uploadIcon} onClick={()=> getMailTemplate(true)} />
                            <img src={CancelUser} alt="CancelUser" className={style.smallIcons} />
                            <img src={BlockUser} alt="BlockUser" className={style.smallIcons} onClick={() => getSendEmailDialog(true)} />
                            <img src={LockReset} alt="LockReset" className={style.smallIcons} />
                            <img src={Filter} alt="Filter" className={style.filterIcon} />
                            <button className={style.contractButton} onClick={() => getAddUserDialog(true)}>ADD USER</button>
                        </div>
                    </div>
                    <div className={style.buttonGroupUsers}>
                        <button className={viewRegisteredUser && style.registeredButton} onClick={() => setViewRegisteredUser(true)}>Registered Users ( {registeredUsers?.length} )</button>
                        <button className={!viewRegisteredUser ? style.blockedButton : style.redText} onClick={() => setViewRegisteredUser(false)}>Blocked Users ( {blockedUsers?.length} )</button>
                    </div>
                    {viewRegisteredUser ? (
                    <div>
                        <div className={`${style.tableHeader} ${style.marginTop20}`}>
                            <input type="checkbox" className={style.checkBoxHeader} />
                            <p className={style.tableHeaderFontStyle}>USER NAME</p>
                            <p className={style.tableHeaderFontStyle}>TITLE</p>
                            <p className={style.tableHeaderFontStyle}>CUSTOMER</p>
                            <p className={style.tableHeaderFontStyle}>USER TYPE</p>
                            <p className={style.tableHeaderFontStyle}>LAST LOGIN DATE/TIME</p>
                            <p className={style.tableHeaderFontStyle}>AVG LOGINS PER DAY</p>
                            <p className={style.tableHeaderFontStyle}>AVG DURATION PER LOGINS(MIN)</p>
                        </div>
                        {registeredUsers?.map((data, index) =>
                            <div className={`${style.tableData} ${style.displayInCol} ${style.marginTop7} ${index % 2 === 0 ? style.alternativeBackgroundColor : ''}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow(index)}}
                            key={index}>
                                <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                    <input type="checkbox" className={style.checkBoxData} />
                                    <p className={`${style.tableDataFontStyle} ${style.displayInRow}`} onClick={() => {getEditUserDialog(true);setSelectedUsers(data)}}>
                                        <div className={`${style.greenDotStyle}`}></div>
                                        {data?.name?.firstName}
                                    </p>
                                    <p className={style.tableDataFontStyle}>{data?.title?.title}</p>
                                    <p className={style.tableDataFontStyle}>Maggiehaven </p>
                                    <p className={style.tableDataFontStyle}>{data?.userType}</p>
                                    <p className={style.tableDataFontStyle}>07/19/2019</p>
                                    <p className={style.tableDataFontStyle}>0:32</p>
                                    <p className={style.tableDataFontStyle}>3</p>
                                </div>
                                {isSelected && selectedRow === index && (
                                    <>
                                        <div className={style.divideStyle}></div>
                                        <div className={style.userInfoGrid}>
                                            <div className={`${style.displayInCol} ${style.userInfoDivStyle}`}>
                                                <p className={style.tableDataFontStyle}>Contact Informations</p>
                                                <p className={style.addressTextStyle}>{data?.communication?.personalEmail}</p>
                                                <p className={style.addressTextStyle}>{data?.communication?.mobileNumber}</p>
                                                <p className={style.addressTextStyle}>{data?.communication?.landlineNumber}</p>
                                            </div>
                                            <div className={style.sideDivideStyle}></div>
                                            <div className={`${style.displayInCol} ${style.textAlignCenter}`}>
                                                <div>
                                                    <p className={style.tableDataFontStyle}>Address</p>
                                                    <p className={style.addressTextStyle}>75297 Marisa Station</p>
                                                    <p className={style.addressTextStyle}>{data?.address?.city}, {data?.address?.state}, {data?.address?.zipcode}</p>
                                                </div>
                                            </div>
                                            <div className={style.sideDivideStyle}></div>
                                            <div className={`${style.displayInCol} ${style.textAlignCenter}`}>
                                                <div>
                                                    <p className={style.tableDataFontStyle}>Creation Date</p>
                                                    <p className={style.addressTextStyle}>02/19/2022 1:30 pm</p>
                                                </div>
                                            </div>
                                            <div className={style.sideDivideStyle}></div>
                                            <div className={`${style.displayInCol} ${style.textAlignRight}`}>
                                                <div>
                                                    <p className={style.tableDataFontStyle}>Last Activity</p>
                                                    <p className={style.addressTextStyle}>02/19/2022 1:30 pm</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
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
                    ) : (
                        <div>
                            <div className={`${style.tableHeader} ${style.marginTop20}`}>
                                <input type="checkbox" className={style.checkBoxHeader} />
                                <p className={style.tableHeaderFontStyle}>USER NAME</p>
                                <p className={style.tableHeaderFontStyle}>TITLE</p>
                                <p className={style.tableHeaderFontStyle}>CUSTOMER</p>
                                <p className={style.tableHeaderFontStyle}>MSP</p>
                                <p className={style.tableHeaderFontStyle}>LAST LOGIN DATE/TIME</p>
                                <p className={style.tableHeaderFontStyle}>BLOCKED DURATION (DAYS)</p>
                                <p className={style.tableHeaderFontStyle}>ACTION</p>
                            </div>
                            {blockedUsers?.map((data, index) =>
                                <div className={`${style.tableData} ${style.displayInCol} ${index % 2 === 0 ? style.alternativeBackgroundColor : ''}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow(index)}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <input type="checkbox" className={style.checkBoxData} />
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            {data?.name?.firstName}
                                        </p>
                                        <p className={style.tableDataFontStyle}>{data?.title?.title}</p>
                                        <p className={style.tableDataFontStyle}>Maggiehaven </p>
                                        <p className={style.tableDataFontStyle}>Maggiehaven</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019</p>
                                        <p className={style.tableDataFontStyle}>3</p>
                                        <button className={style.unblockButton} onClick={() => handleUserUnBlock(data)}>UNBLOCK</button>
                                    </div>
                                    {isSelected && selectedRow === index && (
                                        <>
                                            <div className={style.divideStyle}></div>
                                            <div className={style.userInfoGrid}>
                                                <div className={`${style.displayInCol} ${style.userInfoDivStyle}`}>
                                                    <p className={style.tableDataFontStyle}>Contact Informations</p>
                                                    <p className={style.addressTextStyle}>{data?.communication?.personalEmail}</p>
                                                    <p className={style.addressTextStyle}>{data?.communication?.mobileNumber}</p>
                                                    <p className={style.addressTextStyle}>{data?.communication?.landlineNumber}</p>
                                                </div>
                                                <div className={style.sideDivideStyle}></div>
                                                <div className={`${style.displayInCol} ${style.textAlignCenter}`}>
                                                    <div>
                                                        <p className={style.tableDataFontStyle}>Address</p>
                                                        <p className={style.addressTextStyle}>75297 Marisa Station</p>
                                                        <p className={style.addressTextStyle}>{data?.address?.city}, {data?.address?.state}, {data?.address?.zipcode}</p>
                                                    </div>
                                                </div>
                                                <div className={style.sideDivideStyle}></div>
                                                <div className={`${style.displayInCol} ${style.textAlignCenter}`}>
                                                    <div>
                                                        <p className={style.tableDataFontStyle}>Creation Date</p>
                                                        <p className={style.addressTextStyle}>02/19/2022 1:30 pm</p>
                                                    </div>
                                                </div>
                                                <div className={style.sideDivideStyle}></div>
                                                <div className={`${style.displayInCol} ${style.textAlignRight}`}>
                                                    <div>
                                                        <p className={style.tableDataFontStyle}>Last Activity</p>
                                                        <p className={style.addressTextStyle}>02/19/2022 1:30 pm</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
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
                    )}
                </div>
            </div>
            <div className={style.spaceBetween}>
                <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
                <p className={style.poweredBy}>© TimeSmart.AI</p>
            </div>
            {sendEMail && (
                <SendEmail getSendEmailDialog={getSendEmailDialog} getSendEmailUserListDialog={getSendEmailUserListDialog} />
            )}
            {sendEmailUserListDialog && (
                <SendEmailUserList getSendEmailUserListDialog={getSendEmailUserListDialog}  />
            )}
            {showAddUserDialog && (
                <AddUser getAddUserDialog={getAddUserDialog}/>
            )}
            {showEditUserDialog && (
                <EditUser getEditUserDialog={getEditUserDialog} selectedUsers={selectedUsers} />
            )}
            {showMailtemplate && (
                <MailTemplate getMailTemplate={getMailTemplate} />
            )}
        </div>
    )
}

export default UserTable;
