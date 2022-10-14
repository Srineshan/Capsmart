import React, {useState} from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, Radio, RadioGroup, InputGroup } from '@blueprintjs/core';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { DateInput } from "@blueprintjs/datetime";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Typography from '@mui/material/Typography';
import UserLogo1 from './../../images/userLogo3.png';
import UserLogo2 from './../../images/userLogo4.png';
import UserLogo3 from './../../images/userLogo5.png';
import UserLogo4 from './../../images/userLogo6.png';
import Search from './../../images/search.png';
import BlueChevronLeft from './../../images/blueChevronLeft.png';
import style from './index.module.scss';

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#7165E3' : '#7165E3',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === 'dark' ? '#7165E3' : '#7165E3',
      boxSizing: 'border-box',
    },
  }));

const SaveReport = ({getSaveReportDialog}) => {
    const [isPrivate, setIsPrivate] = useState(false);
    const [schedule, setSchedule] = useState('Only Myself');
    const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
    const [isAddRecipients, setIsAddRecipients] = useState(false);
    return(
        <div>
            <Dialog isOpen={getSaveReportDialog} onClose={() => getSaveReportDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Save As My Report</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getSaveReportDialog(false)}  />
                </div>
                <div className={style.extensionBorder}></div>
                <div className={style.saveReportDialogGrid}>
                    <div className={style.saveLeftPart}>
                        <div>
                            <label for="standard-basic" className={style.saveReportLabelStyle}>Title (name of the report)</label>
                            <TextField id="standard-basic" variant="standard" value="Report Name - ABC" className={`${style.fullWidth} ${style.saveReportFieldStyle}`} />
                        </div>
                        <div className={style.marginTop20}>
                            <label for="description" className={`${style.saveReportLabelStyle}`}>Description</label>
                            <TextArea id="description" rows={9} placeholder="Enter Notes" className={`${style.fullWidth} ${style.saveReportFieldStyle} ${style.marginTop10}`} />
                        </div>
                    </div>
                    <div className={`${style.marginTop20} ${style.marginLeft20}`}>
                        <div className={style.smallHeading}>Report Schedule</div>
                        <div className={`${style.marginTop20} ${style.spaceBetween}`}>
                            <label className={`${style.saveReportLabelStyle}`}>Create Delivery Schedule</label>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography>No</Typography>
                                <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
                                <Typography className={style.typographyStyle}>Yes</Typography>
                            </Stack>                    
                        </div>
                        <div className={`${style.saveReportLabelStyle} ${style.marginTop20}`}>Delivery Schedule</div>
                        <select
                            name="action"
                            id="action"
                            className={`${style.fullWidth} ${style.marginTop10}`}>
                            <option value="One Time (Does Not Repeat)" >
                            One Time (Does Not Repeat)
                            </option>
                            <option value="Every Weekday" >
                            Every Weekday
                            </option>
                            <option value="Weekly" >
                            Weekly
                            </option>
                            <option value="Monthly" >
                            Monthly
                            </option>
                            <option value="Quarterly" >
                            Quarterly
                            </option>
                            <option value="Annually" >
                            Annually
                            </option>
                        </select>
                        <div className={`${style.displayInRow} ${style.marginTop20}`}>
                            <div className={`${style.displayInCol} ${style.marginTop5}`}>
                                <label className={`${style.saveReportLabelStyle}`}>Start Date</label>
                                <div className={style.marginTop10}>
                                    {/* <DateInput
                                        formatDate={date => date.toLocaleDateString()}
                                        parseDate={str => new Date(str)}
                                        placeholder={"MM-DD-YYYY"}
                                    /> */}
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            InputProps={{
                                            style: {
                                                fontSize: 14,
                                                height: 30,
                                            }
                                            }}
                                            renderInput={(params) => <TextField  {...params} />}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <div className={style.marginLeft20}>
                                <label className={`${style.saveReportLabelStyle}`}>Delivery Time</label>
                                <select
                                    name="action"
                                    id="action"
                                    className={`${style.fullWidth} ${style.marginTop3}`}>
                                    <option value="One Time (Does Not Repeat)" >
                                    12:00 PM
                                    </option>
                                </select>
                            </div>
                            <div className={style.marginTop20}>

                            </div>
                        </div>
                        <div className={style.marginTop20}>
                            <RadioGroup
                                label="Schedule this Report for"
                                selectedValue={schedule}
                                onChange={(e) => setSchedule(e.target.value)}
                                intent="success"
                                inline={true}
                            >
                                <Radio label="Only Myself" value="Only Myself" intent={Intent.SUCCESS} />
                                <Radio label="Myself & Others" value="Myself & Others" />
                                <Radio label="Others Only" value="Others Only" />
                            </RadioGroup>
                        </div>
                    </div>
                </div>
                <div className={style.privateGrid}>
                    <div className={`${style.marginTop20} ${style.spaceBetween}`}>
                        <label className={`${style.privateLabelStyle}`}>Private</label>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography className={style.typographyStyle}>No</Typography>
                            <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
                            <Typography>Yes</Typography>
                        </Stack>                    
                    </div>
                </div>
                <div className={`${style.justifyCenter} ${style.marginTop20}`}>
                    <button className={style.saveStyle} onClick={() => schedule !== "Only Myself" && setShowDeliveryDialog(true)}>{schedule === "Only Myself" ? "SAVE" : "NEXT"}</button>
                </div>
            </div>
            </Dialog>
            <Dialog isOpen={showDeliveryDialog} onClose={() => setShowDeliveryDialog(false)} className={`${style.sendMailUserDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={`${style.extensionStyle} ${style.marginTop} ${style.bold}`}>Report Delivery Recipents - Myself & Others</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowDeliveryDialog(false)}  />
                    </div>
                    <div className={style.extensionBorder}></div>
                    {isAddRecipients ? (
                        <div className={`${style.displayInRow} ${style.marginTop10}`}>
                            <img src={BlueChevronLeft} alt="chevronLeft" className={`${style.chevronImgLeft}`}  onClick={() => setIsAddRecipients(false)}/>
                            <p className={`${style.extensionStyle} ${style.marginTop10} ${style.bold} ${style.marginLeft20}`}>Add External Recipients</p>
                        </div>
                    ) : (
                    <div className={style.spaceBetween}>
                        <div className={style.displayInRow}>
                            <p className={`${style.mailBoldText} ${style.marginTop20}`}>Registered Users</p>
                            <div className={style.deliveryCountStyle}>20</div>
                            <div className={`${style.searchBarStyle} ${style.spaceBetween} ${style.marginLeft20}`}>
                                <p>Search</p>
                                <img src={Search} className={style.searchIcon} />
                            </div>
                        </div>
                        <button className={`${style.cloneOutlinedButton} ${style.cursorPointer}`} onClick={() => setIsAddRecipients(true)}>Add External Recipients</button>
                    </div>
                    )}
                    <div className={`${style.extensionBorder} ${style.marginTop10}`}></div>
                    <div className={`${style.padding10}`}>
                        <div>
                            {isAddRecipients ? (
                                <div className={`${style.marginTop20} ${style.recipientsDataHeight}`}>
                                    <div className={style.recipientsGrid}>
                                        <div>
                                            <p>First Name</p>
                                            <InputGroup value="John" className={style.fullWidth} />
                                        </div>
                                        <div>
                                            <p>Last Name</p>
                                            <InputGroup value="Scott" className={style.fullWidth} />
                                        </div>
                                        <div>
                                            <p>Title</p>
                                            <select
                                                name="action"
                                                id="action"
                                                className={`${style.fullWidth} ${style.marginTop3}`}>
                                                <option value="Scott" className={style.fullWidth} >
                                                Scott
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={style.marginTop20}>
                                        <div>
                                            <p>Company Name</p>
                                            <InputGroup value="ABC Medical"  className={style.companyFieldWidth} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={style.padding10}>
                                    <div className={`${style.userMailListGrid} ${style.padding10} `}>
                                        <img src={UserLogo1} alt={'User Logo 1'} className={style.userLogoMailStyle} />
                                        <div>
                                            <p className={`${style.mailIdTextColor}`}>Ronald Jones (Myself)</p>
                                            <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>Medical Director, Dept. of Surgery</p>
                                        </div>                                
                                        <Icon icon="cross" className={style.marginTop10} color="#52575D" />
                                    </div>
                                    <div className={`${style.extensionBorder}`}></div>
                                    <div className={`${style.userMailListGrid} ${style.padding10} ${style.marginTop10}`}>
                                        <img src={UserLogo2} alt={'User Logo 2'} className={style.userLogoMailStyle} />
                                        <div>
                                            <p className={`${style.mailIdTextColor}`}>Kyle Wright, MD</p>
                                            <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>Medical Director, Dept. of Surgery</p>
                                        </div>
                                        <Icon icon="cross" className={style.marginTop10} color="#52575D" />
                                    </div>
                                    <div className={`${style.extensionBorder} `}></div>
                                    <div className={`${style.userMailListGrid} ${style.padding10} ${style.marginTop10} `}>
                                        <img src={UserLogo3} alt={'User Logo 3'} className={style.userLogoMailStyle} />
                                        <div>
                                            <p className={`${style.mailIdTextColor}`}>Mathew Bailey, MD</p>
                                            <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>Medical Director, Dept. of Surgery</p>
                                        </div>
                                        <Icon icon="cross" className={style.marginTop10} color="#52575D" />
                                    </div>
                                    <div className={`${style.extensionBorder}`}></div>
                                    <div className={`${style.userMailListGrid} ${style.padding10} ${style.marginTop10}`}>
                                        <img src={UserLogo4} alt={'User Logo 4'} className={style.userLogoMailStyle} />
                                        <div className={style.displayInRow}>
                                            <div>
                                                <p className={`${style.mailIdTextColor}`}>Ronnie Owens, MD</p>
                                                <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>Medical Director, Dept. of Surgery</p>
                                            </div>
                                            <div className={`${style.expertStyle} ${style.blueCard}`}>Expert</div>
                                        </div>
                                        <Icon icon="cross" className={style.marginTop10} color="#52575D" />
                                    </div>
                                    <div className={`${style.extensionBorder}`}></div>
                                </div>
                            )}
                            <div>
                                <div className={`${style.justifyCenter} ${style.marginTop20}`}>
                                    <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer} `}>{isAddRecipients ? "Add Recipient" : 'Save My Report'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default SaveReport;