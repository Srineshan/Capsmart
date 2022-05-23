import React, { useState } from 'react';
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
import EditUser from './editUser';
import MailTemplate from './mailTemplate';
import style from './index.module.scss';
import SendEmail from './sendEmail';
import SendEmailUserList from './sendMailUserList';

const ActiveContracts = ({getSelectedContract, getAddContract, getExtensionDialog, getTerminationDialog, getCloneDialog}) => {
    const [selectedRow, setSelectedRow] = useState('');
    const [isSelected, setIsSelected] = useState(false);
    const [viewRegisteredUser, setViewRegisteredUser] = useState(true);
    const [sendEMail, setSendEMail] = useState(false);
    const [sendEmailUserListDialog, setSendEmailUserListDialog] = useState(false);
    const [showAddUserDialog,setShowAddUserDialog] = useState(false);
    const [showEditUserDialog,setShowEditUserDialog] = useState(false);
    const [showMailtemplate,setShowMailTemplate] = useState(false);

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
                            <img src={CancelUser} alt="CancelUser" className={style.smallIcons} onClick={()=> getEditUserDialog(true)} />
                            <img src={BlockUser} alt="BlockUser" className={style.smallIcons} onClick={() => getSendEmailDialog(true)} />
                            <img src={LockReset} alt="LockReset" className={style.smallIcons} />
                            <img src={Filter} alt="Filter" className={style.filterIcon} />
                            <button className={style.contractButton} onClick={() => getAddUserDialog(true)}>ADD USER</button>
                        </div>
                    </div>
                    <div className={style.buttonGroupUsers}>
                        <button className={viewRegisteredUser && style.registeredButton} onClick={() => setViewRegisteredUser(true)}>Registered Users ( 10 )</button>
                        <button className={!viewRegisteredUser ? style.blockedButton : style.redText} onClick={() => setViewRegisteredUser(false)}>Blocked Users (2)</button>
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
                        <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1')}}>
                            <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                <input type="checkbox" className={style.checkBoxData} />
                                <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                    <div className={`${style.greenDotStyle}`}></div>
                                    John DOE
                                </p>
                                <p className={style.tableDataFontStyle}>Doctor</p>
                                <p className={style.tableDataFontStyle}>Maggiehaven </p>
                                <p className={style.tableDataFontStyle}>Contractor</p>
                                <p className={style.tableDataFontStyle}>07/19/2019</p>
                                <p className={style.tableDataFontStyle}>0:32</p>
                                <p className={style.tableDataFontStyle}>3</p>
                            </div>
                            {isSelected && selectedRow === '1' && (
                                <>
                                    <div className={style.divideStyle}></div>
                                    <div className={style.userInfoGrid}>
                                        <div className={`${style.displayInCol} ${style.userInfoDivStyle}`}>
                                            <p className={style.tableDataFontStyle}>Contact Informations</p>
                                            <p className={style.addressTextStyle}>john.doe@sureshield.com</p>
                                            <p className={style.addressTextStyle}>+1 (342) 444-5505</p>
                                            <p className={style.addressTextStyle}>+1 (342) 444-5507</p>
                                        </div>
                                        <div className={style.sideDivideStyle}></div>
                                        <div className={`${style.displayInCol} ${style.textAlignCenter}`}>
                                            <div>
                                                <p className={style.tableDataFontStyle}>Address</p>
                                                <p className={style.addressTextStyle}>75297 Marisa Station</p>
                                                <p className={style.addressTextStyle}>, South Clement, Borders, NE 16466</p>
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
                        <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('2')}}>
                            <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                <input type="checkbox" className={style.checkBoxData} />
                                <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                    <div className={`${style.greenDotStyle}`}></div>
                                    John DOE
                                </p>
                                <p className={style.tableDataFontStyle}>Doctor</p>
                                <p className={style.tableDataFontStyle}>Maggiehaven </p>
                                <p className={style.tableDataFontStyle}>Contractor</p>
                                <p className={style.tableDataFontStyle}>07/19/2019</p>
                                <p className={style.tableDataFontStyle}>0:32</p>
                                <p className={style.tableDataFontStyle}>3</p>
                            </div>
                            {isSelected && selectedRow === '2' && (
                                <>
                                    <div className={style.divideStyle}></div>
                                    <div className={style.userInfoGrid}>
                                        <div className={`${style.displayInCol} ${style.userInfoDivStyle}`}>
                                            <p className={style.tableDataFontStyle}>Contact Informations</p>
                                            <p className={style.addressTextStyle}>john.doe@sureshield.com</p>
                                            <p className={style.addressTextStyle}>+1 (342) 444-5505</p>
                                            <p className={style.addressTextStyle}>+1 (342) 444-5507</p>
                                        </div>
                                        <div className={style.sideDivideStyle}></div>
                                        <div className={`${style.displayInCol} ${style.textAlignCenter}`}>
                                            <div>
                                                <p className={style.tableDataFontStyle}>Address</p>
                                                <p className={style.addressTextStyle}>75297 Marisa Station</p>
                                                <p className={style.addressTextStyle}>, South Clement, Borders, NE 16466</p>
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
                        <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('3')}}>
                            <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                <input type="checkbox" className={style.checkBoxData} />
                                <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                    <div className={`${style.yellowDotStyle}`}></div>
                                    John DOE
                                </p>
                                <p className={style.tableDataFontStyle}>Doctor</p>
                                <p className={style.tableDataFontStyle}>Maggiehaven </p>
                                <p className={style.tableDataFontStyle}>Contractor</p>
                                <p className={style.tableDataFontStyle}>07/19/2019</p>
                                <p className={style.tableDataFontStyle}>0:32</p>
                                <p className={style.tableDataFontStyle}>3</p>
                            </div>
                            {isSelected && selectedRow === '3' && (
                                <>
                                    <div className={style.divideStyle}></div>
                                    <div className={style.userInfoGrid}>
                                        <div className={`${style.displayInCol} ${style.userInfoDivStyle}`}>
                                            <p className={style.tableDataFontStyle}>Contact Informations</p>
                                            <p className={style.addressTextStyle}>john.doe@sureshield.com</p>
                                            <p className={style.addressTextStyle}>+1 (342) 444-5505</p>
                                            <p className={style.addressTextStyle}>+1 (342) 444-5507</p>
                                        </div>
                                        <div className={style.sideDivideStyle}></div>
                                        <div className={`${style.displayInCol} ${style.textAlignCenter}`}>
                                            <div>
                                                <p className={style.tableDataFontStyle}>Address</p>
                                                <p className={style.addressTextStyle}>75297 Marisa Station</p>
                                                <p className={style.addressTextStyle}>, South Clement, Borders, NE 16466</p>
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
                        <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('4')}}>
                            <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                <input type="checkbox" className={style.checkBoxData} />
                                <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                    <div className={`${style.redDotStyle}`}></div>
                                    John DOE
                                </p>
                                <p className={style.tableDataFontStyle}>Doctor</p>
                                <p className={style.tableDataFontStyle}>Maggiehaven </p>
                                <p className={style.tableDataFontStyle}>Contractor</p>
                                <p className={style.tableDataFontStyle}>07/19/2019</p>
                                <p className={style.tableDataFontStyle}>0:32</p>
                                <p className={style.tableDataFontStyle}>3</p>
                            </div>
                            {isSelected && selectedRow === '4' && (
                                <>
                                    <div className={style.divideStyle}></div>
                                    <div className={style.userInfoGrid}>
                                        <div className={`${style.displayInCol} ${style.userInfoDivStyle}`}>
                                            <p className={style.tableDataFontStyle}>Contact Informations</p>
                                            <p className={style.addressTextStyle}>john.doe@sureshield.com</p>
                                            <p className={style.addressTextStyle}>+1 (342) 444-5505</p>
                                            <p className={style.addressTextStyle}>+1 (342) 444-5507</p>
                                        </div>
                                        <div className={style.sideDivideStyle}></div>
                                        <div className={`${style.displayInCol} ${style.textAlignCenter}`}>
                                            <div>
                                                <p className={style.tableDataFontStyle}>Address</p>
                                                <p className={style.addressTextStyle}>75297 Marisa Station</p>
                                                <p className={style.addressTextStyle}>, South Clement, Borders, NE 16466</p>
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
                        <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('5')}}>
                            <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                <input type="checkbox" className={style.checkBoxData} />
                                <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                    <div className={`${style.redDotStyle}`}></div>
                                    John DOE
                                </p>
                                <p className={style.tableDataFontStyle}>Doctor</p>
                                <p className={style.tableDataFontStyle}>Maggiehaven </p>
                                <p className={style.tableDataFontStyle}>Contractor</p>
                                <p className={style.tableDataFontStyle}>07/19/2019</p>
                                <p className={style.tableDataFontStyle}>0:32</p>
                                <p className={style.tableDataFontStyle}>3</p>
                            </div>
                            {isSelected && selectedRow === '5' && (
                                <>
                                    <div className={style.divideStyle}></div>
                                    <div className={style.userInfoGrid}>
                                        <div className={`${style.displayInCol} ${style.userInfoDivStyle}`}>
                                            <p className={style.tableDataFontStyle}>Contact Informations</p>
                                            <p className={style.addressTextStyle}>john.doe@sureshield.com</p>
                                            <p className={style.addressTextStyle}>+1 (342) 444-5505</p>
                                            <p className={style.addressTextStyle}>+1 (342) 444-5507</p>
                                        </div>
                                        <div className={style.sideDivideStyle}></div>
                                        <div className={`${style.displayInCol} ${style.textAlignCenter}`}>
                                            <div>
                                                <p className={style.tableDataFontStyle}>Address</p>
                                                <p className={style.addressTextStyle}>75297 Marisa Station</p>
                                                <p className={style.addressTextStyle}>, South Clement, Borders, NE 16466</p>
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
                        <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('6')}}>
                            <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                <input type="checkbox" className={style.checkBoxData} />
                                <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                    <div className={`${style.greenDotStyle}`}></div>
                                    John DOE
                                </p>
                                <p className={style.tableDataFontStyle}>Doctor</p>
                                <p className={style.tableDataFontStyle}>Maggiehaven </p>
                                <p className={style.tableDataFontStyle}>Contractor</p>
                                <p className={style.tableDataFontStyle}>07/19/2019</p>
                                <p className={style.tableDataFontStyle}>0:32</p>
                                <p className={style.tableDataFontStyle}>3</p>
                            </div>
                            {isSelected && selectedRow === '6' && (
                                <>
                                    <div className={style.divideStyle}></div>
                                    <div className={style.userInfoGrid}>
                                        <div className={`${style.displayInCol} ${style.userInfoDivStyle}`}>
                                            <p className={style.tableDataFontStyle}>Contact Informations</p>
                                            <p className={style.addressTextStyle}>john.doe@sureshield.com</p>
                                            <p className={style.addressTextStyle}>+1 (342) 444-5505</p>
                                            <p className={style.addressTextStyle}>+1 (342) 444-5507</p>
                                        </div>
                                        <div className={style.sideDivideStyle}></div>
                                        <div className={`${style.displayInCol} ${style.textAlignCenter}`}>
                                            <div>
                                                <p className={style.tableDataFontStyle}>Address</p>
                                                <p className={style.addressTextStyle}>75297 Marisa Station</p>
                                                <p className={style.addressTextStyle}>, South Clement, Borders, NE 16466</p>
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
                        <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('7')}}>
                            <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                <input type="checkbox" className={style.checkBoxData} />
                                <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                    <div className={`${style.yellowDotStyle}`}></div>
                                    John DOE
                                </p>
                                <p className={style.tableDataFontStyle}>Doctor</p>
                                <p className={style.tableDataFontStyle}>Maggiehaven </p>
                                <p className={style.tableDataFontStyle}>Contractor</p>
                                <p className={style.tableDataFontStyle}>07/19/2019</p>
                                <p className={style.tableDataFontStyle}>0:32</p>
                                <p className={style.tableDataFontStyle}>3</p>
                            </div>
                            {isSelected && selectedRow === '7' && (
                                <>
                                    <div className={style.divideStyle}></div>
                                    <div className={style.userInfoGrid}>
                                        <div className={`${style.displayInCol} ${style.userInfoDivStyle}`}>
                                            <p className={style.tableDataFontStyle}>Contact Informations</p>
                                            <p className={style.addressTextStyle}>john.doe@sureshield.com</p>
                                            <p className={style.addressTextStyle}>+1 (342) 444-5505</p>
                                            <p className={style.addressTextStyle}>+1 (342) 444-5507</p>
                                        </div>
                                        <div className={style.sideDivideStyle}></div>
                                        <div className={`${style.displayInCol} ${style.textAlignCenter}`}>
                                            <div>
                                                <p className={style.tableDataFontStyle}>Address</p>
                                                <p className={style.addressTextStyle}>75297 Marisa Station</p>
                                                <p className={style.addressTextStyle}>, South Clement, Borders, NE 16466</p>
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
                            <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1')}}>
                                <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                    <input type="checkbox" className={style.checkBoxData} />
                                    <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                        John DOE
                                    </p>
                                    <p className={style.tableDataFontStyle}>Doctor</p>
                                    <p className={style.tableDataFontStyle}>Maggiehaven </p>
                                    <p className={style.tableDataFontStyle}>Maggiehaven</p>
                                    <p className={style.tableDataFontStyle}>07/19/2019</p>
                                    <p className={style.tableDataFontStyle}>3</p>
                                    <button className={style.unblockButton}>UNBLOCK</button>
                                </div>
                                {isSelected && selectedRow === '1' && (
                                    <>
                                        <div className={style.divideStyle}></div>
                                        <div className={style.userInfoGrid}>
                                            <div className={`${style.displayInCol} ${style.userInfoDivStyle}`}>
                                                <p className={style.tableDataFontStyle}>Contact Informations</p>
                                                <p className={style.addressTextStyle}>john.doe@sureshield.com</p>
                                                <p className={style.addressTextStyle}>+1 (342) 444-5505</p>
                                                <p className={style.addressTextStyle}>+1 (342) 444-5507</p>
                                            </div>
                                            <div className={style.sideDivideStyle}></div>
                                            <div className={`${style.displayInCol} ${style.textAlignCenter}`}>
                                                <div>
                                                    <p className={style.tableDataFontStyle}>Address</p>
                                                    <p className={style.addressTextStyle}>75297 Marisa Station</p>
                                                    <p className={style.addressTextStyle}>, South Clement, Borders, NE 16466</p>
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
                            <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('2')}}>
                                <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                    <input type="checkbox" className={style.checkBoxData} />
                                    <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                        John DOE
                                    </p>
                                    <p className={style.tableDataFontStyle}>Doctor</p>
                                    <p className={style.tableDataFontStyle}>Maggiehaven </p>
                                    <p className={style.tableDataFontStyle}>Maggiehaven</p>
                                    <p className={style.tableDataFontStyle}>07/19/2019</p>
                                    <p className={style.tableDataFontStyle}>3</p>
                                    <button className={style.unblockButton}>UNBLOCK</button>
                                </div>
                                {isSelected && selectedRow === '2' && (
                                    <>
                                        <div className={style.divideStyle}></div>
                                        <div className={style.userInfoGrid}>
                                            <div className={`${style.displayInCol} ${style.userInfoDivStyle}`}>
                                                <p className={style.tableDataFontStyle}>Contact Informations</p>
                                                <p className={style.addressTextStyle}>john.doe@sureshield.com</p>
                                                <p className={style.addressTextStyle}>+1 (342) 444-5505</p>
                                                <p className={style.addressTextStyle}>+1 (342) 444-5507</p>
                                            </div>
                                            <div className={style.sideDivideStyle}></div>
                                            <div className={`${style.displayInCol} ${style.textAlignCenter}`}>
                                                <div>
                                                    <p className={style.tableDataFontStyle}>Address</p>
                                                    <p className={style.addressTextStyle}>75297 Marisa Station</p>
                                                    <p className={style.addressTextStyle}>, South Clement, Borders, NE 16466</p>
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
                <EditUser getEditUserDialog={getEditUserDialog}/>
            )}
            {showMailtemplate && (
                <MailTemplate getMailTemplate={getMailTemplate} />
            )}
        </div>
    )
}

export default ActiveContracts;
