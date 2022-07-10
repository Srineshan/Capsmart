import React, { useState, useEffect } from 'react';
import { Icon, Intent, Dialog, Classes, InputGroup, TextArea, Checkbox } from "@blueprintjs/core";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import UserLogo from './../../images/userLogo.jpg';
import ChevronRight from './../../images/chevronRight.png';
import Filter from './../../images/filter.png';
import Tooltip from '@mui/material/Tooltip';
import style from './index.module.scss';
import AddTutorial from './addTutorialDialog';
import VideoSequencePlayerDialog from './videoSequencePlayer';
import NewFAQPost from './newFAQPost';
import RequestFAQPost from './requestFaqPost';

const FAQ = ({getSelectedHelp}) => {
    const [selectedRow, setSelectedRow] = useState('');
    const [isSelected, setIsSelected] = useState(false);
    const [viewTickets, setViewTickets] = useState(true);
    const [viewExceptionTickets, setViewExceptionTickets] = useState(false);
    const [viewMessages, setViewMessages] = useState(false);
    const [sendEMail, setSendEMail] = useState(false);
    const [userDetails, setUserDetails] = useState();
    const [sendEmailUserListDialog, setSendEmailUserListDialog] = useState(false);
    const [newFAQPostDialog,setNewFAQPostDialog] = useState(false);
    const [requestFAQPostDialog, setRequestFAQPostDialog] = useState(false)
    const [showEditUserDialog,setShowEditUserDialog] = useState(false);
    const [showFeedbackPage,setShowFeedbackPage] = useState(false);
    const [showVideoSequenceDialog,setShowVideoSequenceDialog] = useState(false);
    const [faqName, setFaqName] = useState('Frequently Asked Question');
    const [faqPage2, setFaqPage2] = useState(false);

    const getSendEmailDialog = (value) => {
        setSendEMail(value);
    }

    const getSendEmailUserListDialog = (value) => {
        setSendEmailUserListDialog(value);
    }

    const getNewFAQPostDialog = (value) => {
        setNewFAQPostDialog(value);
    }

    const getRequestFAQPostDialog = (value) => {
        setRequestFAQPostDialog(value);
    }

    const getEditUserDialog = (value) => {
        setShowEditUserDialog(value);
    }

    const getShowVideoSequenceDialog = (value) => {
        setShowVideoSequenceDialog(value);
    }
    return(
        <>
            {!faqPage2 ? (
            <div className={style.margin20}>
                <div className={style.bigCardGrid}>
                    <div className={style.chevronCardStyle}>
                        <div className={`${style.alignCenter}`}>
                            <img src={ChevronRight} className={style.chevronRightStyle}/>
                        </div>
                    </div>
                    <div className={style.displayInRow}>
                        <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                            HELP MANAGEMENT
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
                    <div className={`${style.cardStyle}`} onClick={() => getSelectedHelp('TICKETS')}>
                        <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>TICKETS</h5>
                        <p className={style.last30Style}>LAST 30 DAYS</p>
                        <div className={style.spaceBetween}>
                            <p></p>
                            <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>12</p>
                        </div>
                    </div>
                    <div className={`${style.cardStyle}`} onClick={() => getSelectedHelp('TUTORIALS & VIDEOS')}>
                        <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>TUTORIALS & VIDEOS</h5>
                        <p className={style.last30Style}>LAST 30 DAYS</p>
                        <div className={style.spaceBetween}>
                            <p></p>
                            <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>4</p>
                        </div>
                    </div>
                    <div className={`${style.cardStyle} ${style.selectedCardBackground}`} onClick={() => getSelectedHelp('FAQS')}>
                        <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>FAQS</h5>
                        <p className={style.last30Style}>LAST 7 DAYS</p>
                        <div className={style.spaceBetween}>
                            <p></p>
                            <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>2</p>
                        </div>
                    </div>
                    <div className={style.cardStyle} onClick={() => getSelectedHelp('RELEASE NOTES')}>
                        <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>RELEASE NOTES</h5>
                        <p className={style.last30Style}>LAST 30 DAYS</p>
                        <div className={style.spaceBetween}>
                            <p></p>
                            <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>2</p>
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
                                {/* <img src={UploadUser} alt="UploadUser" className={style.uploadIcon} onClick={()=> getMailTemplate(true)} />
                                <img src={CancelUser} alt="CancelUser" className={style.smallIcons} onClick={()=> getEditUserDialog(true)} />
                                <img src={BlockUser} alt="BlockUser" className={style.smallIcons} onClick={() => getSendEmailDialog(true)} />
                                <img src={LockReset} alt="LockReset" className={style.smallIcons} /> */}
                                {/* <img src={Filter} alt="Filter" className={style.filterIcon} /> */}
                                <button className={style.tutorialButton} onClick={() => getNewFAQPostDialog(true)}>ADD NEW FAQ</button>
                            </div>
                        </div>
                        <div className={style.spaceBetween}>
                            <div className={style.buttonGroupUsers}>
                                <button className={faqName === "Frequently Asked Question" ? style.registeredButton : style.normalButton} onClick={() => setFaqName('Frequently Asked Question')}>Frequently Asked Question ( 2 )</button>
                                <button className={faqName === "New Faq Suggestion"  ? style.registeredButton : style.normalButton} onClick={() => setFaqName('New Faq Suggestion')}>New Faq Suggestion ( 1 )</button>
                            </div>
                            <div>
                                <Icon icon="trash" size={20} color="#D0DBE5" className={`${style.marginRight20} ${style.marginTop40}`} onClick={() => setFaqPage2(!faqPage2)} />
                            </div>
                        </div>
                        {faqName === "Frequently Asked Question" ? (
                        <div>
                            <div className={`${style.tableHeaderFAQ} ${style.reduceTop10}`}>
                                <Checkbox large className={style.marginTop7} />
                                <p className={style.tableHeaderFontStyle}>FREQUENTLY ASKED QUESTION</p>
                                <p className={style.tableHeaderFontStyle}>USER NAME</p>
                                <p className={style.tableHeaderFontStyle}>DATE / TIME</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1')}}>
                                <div className={`${style.fullWidth} ${style.marginTop7} ${style.verticalCenter} ${style.spaceBetween} ${style.padding2}`}>
                                    <div className={style.displayInRow}>
                                        <Checkbox large className={style.marginTop7} />
                                        <p className={style.tableDataFontStyle}><strong>Question 1Hjhslj; Kljd;Ljok;Lm ?</strong></p>
                                    </div>
                                    <Icon icon={isSelected && selectedRow === '1' ? "chevron-up" : "chevron-down"} color='#7165E3' size={20} />
                                </div>
                            </div>
                            {isSelected && selectedRow === '1' && (
                                <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`}>
                                    <p className={`${style.answerTextStyle} ${style.padding15}`}>
                                    Answer B Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mollis magna leo, a 
                                    varius risus vestibulum sit amet. Pellentesque vel leo sit amet metus dictum ullamcorper. 
                                    Proin eget tellus aliquet, lobortis massa a, tempus eros. Aliquam euismod sed purus egestas
                                    sagittis. Nam consequat mollis nunc non viverra. Fusce finibus libero ante, ut hendrerit
                                    ipsum euismod quis. In sit amet consectetur sapien. Quisque eget euismod sem. Mauris 
                                    malesuada dui sed dui sagittis consectetur.
                                    </p>
                                    <div className={`${style.tableGridFAQ} ${style.fullWidth}`}>
                                        <p></p>
                                        <p></p>
                                        <div className={style.displayInRow}>
                                            <img src={UserLogo} className={`${style.userLogoVerySmall} ${style.reduceTop2}`}  />
                                            <p className={`${style.tableDataFontStyle} ${style.reduceTop} ${style.marginLeft20}`}>
                                            Lorem Ipsum
                                            </p>
                                        </div>
                                        <p className={style.smallGreyText}>3 days ago</p>  
                                    </div>
                                    <br />
                                    <div className={`${style.faqAnswerGrid} ${style.fullWidth} ${style.padding15} ${style.reduceTop10}`}>
                                        <TextArea className={`${style.fullWidth} ${style.transparentDashedStyle}`} fill={true} placeholder="type to comment..." />
                                        <button className={`${style.commentButton} ${style.floatRight} ${style.marginTop20}`}>COMMENT</button>
                                    </div>
                                </div>
                            )}
                            <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('2')}}>
                                <div className={`${style.fullWidth} ${style.marginTop7} ${style.verticalCenter} ${style.spaceBetween} ${style.padding2}`}>
                                    <div className={style.displayInRow}>
                                        <Checkbox large className={style.marginTop7} />
                                        <p className={style.tableDataFontStyle}><strong>Question B ??</strong></p>
                                    </div>
                                    <Icon icon={isSelected && selectedRow === '2' ? "chevron-up" : "chevron-down"} color='#7165E3' size={20} />
                                </div>
                            </div>
                            {isSelected && selectedRow === '2' && (
                                <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`}>
                                    <p className={`${style.answerTextStyle} ${style.padding15}`}>
                                    Answer B Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mollis magna leo, a 
                                    varius risus vestibulum sit amet. Pellentesque vel leo sit amet metus dictum ullamcorper. 
                                    Proin eget tellus aliquet, lobortis massa a, tempus eros. Aliquam euismod sed purus egestas
                                    sagittis. Nam consequat mollis nunc non viverra. Fusce finibus libero ante, ut hendrerit
                                    ipsum euismod quis. In sit amet consectetur sapien. Quisque eget euismod sem. Mauris 
                                    malesuada dui sed dui sagittis consectetur.
                                    </p>
                                    <div className={`${style.tableGridFAQ} ${style.fullWidth}`}>
                                        <p></p>
                                        <p></p>
                                        <div className={style.displayInRow}>
                                            <img src={UserLogo} className={`${style.userLogoVerySmall} ${style.reduceTop2}`}  />
                                            <p className={`${style.tableDataFontStyle} ${style.reduceTop} ${style.marginLeft20}`}>
                                            Lorem Ipsum
                                            </p>
                                        </div>
                                        <p className={style.smallGreyText}>3 days ago</p>  
                                    </div>
                                    <br />
                                    <div className={`${style.faqAnswerGrid} ${style.fullWidth} ${style.padding15} ${style.reduceTop10}`}>
                                        <TextArea className={`${style.fullWidth} ${style.transparentDashedStyle}`} fill={true} placeholder="type to comment..." />
                                        <button className={`${style.commentButton} ${style.floatRight} ${style.marginTop20}`}>COMMENT</button>
                                    </div>
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
                        ) : faqName === "New Faq Suggestion"  ?  (
                            <div>
                                <div className={`${style.tableHeaderFAQSuggestion} ${style.marginTop20}`}>
                                    <Checkbox large className={style.marginTop7} />
                                    <p className={style.tableHeaderFontStyle}>USER NAME</p>
                                    <p className={style.tableHeaderFontStyle}>EMAIL ADDRESS</p>
                                    <p className={style.tableHeaderFontStyle}>REASON TO REQUEST</p>
                                    <p className={style.tableHeaderFontStyle}>REQUESTED DATE / TIME</p>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1');setShowFeedbackPage(true)}}>
                                    <div className={`${style.tableDataGridFAQSuggestion} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Checkbox large className={style.marginTop7} />
                                        <p className={style.tableDataFontStyle}><strong>Philipp Stevens</strong></p>
                                        <p className={style.tableDataFontStyle}><strong>customer@metropolitan.com</strong></p>
                                        <p className={style.tableDataFontStyle}><strong>lorem ipsum dolor sit amet, consectetur lorem ipsum dolor sit amet, consectetur...</strong></p>
                                        <p className={style.tableDataFontStyle}><strong>07/19/2019 1:30 EST</strong></p>
                                    </div>
                                    {isSelected && selectedRow === '1' && (
                                        <div className={`${style.fullWidth} ${style.padding15}`}>
                                            <div className={style.videoSequenceBorder}></div>
                                            <div className={`${style.suggestionDetailsGrid} ${style.fullWidth} ${style.marginTop20}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}><strong>FAQ SUGGESTION</strong></p> 
                                                <p className={style.tableDataFontStyle}>Lorem ipsum dolor sit amet, consectetur Lorem ipsum dolor sit amet, consectetur...</p>
                                                <div className={style.displayInRow}>
                                                    <button className={style.suggestionWhiteButton}>IGNORE</button>
                                                    <button className={`${style.suggestionBlueButton} ${style.marginLeft20}`}>CREATE</button>
                                                </div>
                                            </div>
                                        </div>
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
                        ) : ''}
                    </div>
                </div>
                <div className={style.spaceBetween}>
                    <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
                    <p className={style.poweredBy}>© TimeSmart.AI</p>
                </div>
                {newFAQPostDialog && <NewFAQPost getNewFAQPostDialog={getNewFAQPostDialog} />}
            </div>
            ) : (
                <div className={style.margin20}>
                    <div className={style.bigCardGrid}>
                        <div className={style.chevronCardStyle}>
                            <div className={`${style.alignCenter}`}>
                                <img src={ChevronRight} className={style.chevronRightStyle}/>
                            </div>
                        </div>
                        <div className={style.displayInRow}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                HELP MANAGEMENT
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
                        <div className={`${style.cardStyle}`} onClick={() => getSelectedHelp('TICKETS')}>
                            <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>TICKETS</h5>
                            <p className={style.last30Style}>LAST 30 DAYS</p>
                            <div className={style.spaceBetween}>
                                <p></p>
                                <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>12</p>
                            </div>
                        </div>
                        <div className={`${style.cardStyle}`} onClick={() => getSelectedHelp('TUTORIALS & VIDEOS')}>
                            <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>TUTORIALS & VIDEOS</h5>
                            <p className={style.last30Style}>LAST 30 DAYS</p>
                            <div className={style.spaceBetween}>
                                <p></p>
                                <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>4</p>
                            </div>
                        </div>
                        <div className={`${style.cardStyle} ${style.selectedCardBackground}`} onClick={() => getSelectedHelp('FAQS')}>
                            <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>FAQS</h5>
                            <p className={style.last30Style}>LAST 7 DAYS</p>
                            <div className={style.spaceBetween}>
                                <p></p>
                                <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>2</p>
                            </div>
                        </div>
                        <div className={style.cardStyle} onClick={() => getSelectedHelp('RELEASE NOTES')}>
                            <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>RELEASE NOTES</h5>
                            <p className={style.last30Style}>LAST 30 DAYS</p>
                            <div className={style.spaceBetween}>
                                <p></p>
                                <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>2</p>
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
                                    {/* <img src={UploadUser} alt="UploadUser" className={style.uploadIcon} onClick={()=> getMailTemplate(true)} />
                                    <img src={CancelUser} alt="CancelUser" className={style.smallIcons} onClick={()=> getEditUserDialog(true)} />
                                    <img src={BlockUser} alt="BlockUser" className={style.smallIcons} onClick={() => getSendEmailDialog(true)} />
                                    <img src={LockReset} alt="LockReset" className={style.smallIcons} /> */}
                                    {/* <img src={Filter} alt="Filter" className={style.filterIcon} /> */}
                                    <button className={style.tutorialButton} onClick={() => getRequestFAQPostDialog(true)}>Request FAQ</button>
                                </div>
                            </div>
                            <div className={style.spaceBetween}>
                                <div className={style.buttonGroupUsers}>
                                    <button className={faqName === "Frequently Asked Question" ? style.registeredButton : style.normalButton} onClick={() => setFaqName('Frequently Asked Question')}>FAQ's ( 2 )</button>
                                </div>
                                {/* <div>
                                    <Icon icon="trash" size={20} color="#D0DBE5" className={`${style.marginRight20} ${style.marginTop40}`} onClick={() => setFaqPage2(!faqPage2)} />
                                </div> */}
                            </div>
                            <div>
                                <div className={`${style.tableHeaderFAQ} ${style.reduceTop10}`}>
                                    <Checkbox large className={style.marginTop7} />
                                    <p className={style.tableHeaderFontStyle}>FREQUENTLY ASKED QUESTION</p>
                                    <p className={style.tableHeaderFontStyle}>USER NAME</p>
                                    <p className={style.tableHeaderFontStyle}>DATE / TIME</p>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1')}}>
                                    <div className={`${style.fullWidth} ${style.marginTop7} ${style.verticalCenter} ${style.spaceBetween} ${style.padding2}`}>
                                        <div className={style.displayInRow}>
                                            <Checkbox large className={style.marginTop7} />
                                            <p className={style.tableDataFontStyle}><strong>Question 1Hjhslj; Kljd;Ljok;Lm ?</strong></p>
                                        </div>
                                        <Icon icon={isSelected && selectedRow === '1' ? "chevron-up" : "chevron-down"} color='#7165E3' size={20} />
                                    </div>
                                </div>
                                {isSelected && selectedRow === '1' && (
                                    <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`}>
                                        <p className={`${style.answerTextStyle} ${style.padding15}`}>
                                        Answer B Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mollis magna leo, a 
                                        varius risus vestibulum sit amet. Pellentesque vel leo sit amet metus dictum ullamcorper. 
                                        Proin eget tellus aliquet, lobortis massa a, tempus eros. Aliquam euismod sed purus egestas
                                        sagittis. Nam consequat mollis nunc non viverra. Fusce finibus libero ante, ut hendrerit
                                        ipsum euismod quis. In sit amet consectetur sapien. Quisque eget euismod sem. Mauris 
                                        malesuada dui sed dui sagittis consectetur.
                                        </p>
                                        <div className={`${style.tableGridFAQ} ${style.fullWidth}`}>
                                            <p></p>
                                            <p></p>
                                            <div className={style.displayInRow}>
                                                <img src={UserLogo} className={`${style.userLogoVerySmall} ${style.reduceTop2}`}  />
                                                <p className={`${style.tableDataFontStyle} ${style.reduceTop} ${style.marginLeft20}`}>
                                                Lorem Ipsum
                                                </p>
                                            </div>
                                            <p className={style.smallGreyText}>3 days ago</p>  
                                        </div>
                                        <br />
                                        <div className={`${style.faqAnswerGrid} ${style.fullWidth} ${style.padding15} ${style.reduceTop10}`}>
                                            <TextArea className={`${style.fullWidth} ${style.transparentDashedStyle}`} fill={true} placeholder="type to comment..." />
                                            <button className={`${style.commentButton} ${style.floatRight} ${style.marginTop20}`}>COMMENT</button>
                                        </div>
                                    </div>
                                )}
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('2')}}>
                                    <div className={`${style.fullWidth} ${style.marginTop7} ${style.verticalCenter} ${style.spaceBetween} ${style.padding2}`}>
                                        <div className={style.displayInRow}>
                                            <Checkbox large className={style.marginTop7} />
                                            <p className={style.tableDataFontStyle}><strong>Question B ??</strong></p>
                                        </div>
                                        <Icon icon={isSelected && selectedRow === '2' ? "chevron-up" : "chevron-down"} color='#7165E3' size={20} />
                                    </div>
                                </div>
                                {isSelected && selectedRow === '2' && (
                                    <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`}>
                                        <p className={`${style.answerTextStyle} ${style.padding15}`}>
                                        Answer B Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mollis magna leo, a 
                                        varius risus vestibulum sit amet. Pellentesque vel leo sit amet metus dictum ullamcorper. 
                                        Proin eget tellus aliquet, lobortis massa a, tempus eros. Aliquam euismod sed purus egestas
                                        sagittis. Nam consequat mollis nunc non viverra. Fusce finibus libero ante, ut hendrerit
                                        ipsum euismod quis. In sit amet consectetur sapien. Quisque eget euismod sem. Mauris 
                                        malesuada dui sed dui sagittis consectetur.
                                        </p>
                                        <div className={`${style.tableGridFAQ} ${style.fullWidth}`}>
                                            <p></p>
                                            <p></p>
                                            <div className={style.displayInRow}>
                                                <img src={UserLogo} className={`${style.userLogoVerySmall} ${style.reduceTop2}`}  />
                                                <p className={`${style.tableDataFontStyle} ${style.reduceTop} ${style.marginLeft20}`}>
                                                Lorem Ipsum
                                                </p>
                                            </div>
                                            <p className={style.smallGreyText}>3 days ago</p>  
                                        </div>
                                        <br />
                                        <div className={`${style.faqAnswerGrid} ${style.fullWidth} ${style.padding15} ${style.reduceTop10}`}>
                                            <TextArea className={`${style.fullWidth} ${style.transparentDashedStyle}`} fill={true} placeholder="type to comment..." />
                                            <button className={`${style.commentButton} ${style.floatRight} ${style.marginTop20}`}>COMMENT</button>
                                        </div>
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
                    {requestFAQPostDialog && <RequestFAQPost getRequestFAQPostDialog={getRequestFAQPostDialog} />}
                </div>
            )}
        </>
    )
}

export default FAQ;
