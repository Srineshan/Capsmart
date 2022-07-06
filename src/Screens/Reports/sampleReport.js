import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import { Button, Icon, Intent, Dialog, Classes, TextArea } from '@blueprintjs/core';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';
import Chart from 'react-apexcharts'
import straightAreaChart from './chart-data/straight-area-chart';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DownloadingOutlinedIcon from '@mui/icons-material/DownloadingOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import UserLogo1 from './../../images/userLogo3.png';
import UserLogo2 from './../../images/userLogo4.png';
import UserLogo3 from './../../images/userLogo5.png';
import UserLogo4 from './../../images/userLogo6.png';
import UserLogo from './../../images/userLogo.jpg';
import ChevronRight from './../../images/chevronRight.png';
import Search from './../../images/search.png';
import Info from './../../images/info.png';
import style from './index.module.scss';
import SaveReport from './saveReport';

const SampleReport = () => {
    const [showSaveReport, setShowSaveReport] = useState(false);
    const [showSaveReportOutput, setShowSaveReportOutput] = useState(false);
    const [showReportSavedDialog, setShowReportSavedDialog] = useState(false);
    const [showReportRefreshingDialog, setShowReportRefreshingDialog] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);

    const [activityType, setActivityType] = useState('Outpatient Clinic Service');
    const [activityPerformed, setActivityPerformed] = useState('Half Day Clinic Session');

    const donutChart = {
        series: [4, 6, 10],
        chartOptions: {
        labels: ["Electronics", "Furniture", "Toys"],
        },
        options: {
            chart: {
                type: 'donut',
            },
            colors: ['#8A8C8D', '#707070', '#52575D'],
            legend: {
                show: true,
                position: 'top'
            },
            stroke: {
                curve: 'smooth',
                width: 10,
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                  return val
                },
            },
            plotOptions: {
                pie: {
                  size: 20
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                chart: {
                    width: 300,
                    height: 300
                },
                }
            }]
        }
    }

    const handleChange = (event) => {
        setActivityType(event.target.value);
    };

    const handleChangeActivityPerformed = (event) => {
        setActivityPerformed(event.target.value);
    };

    const getSaveReportDialog = (value) => {
        setShowSaveReport(value);
    }
    return(
        <div className={style.margin20}>
            <div className={style.bigCardGrid}>
                <div>
                    <div className={style.cardStyle}>
                        <div className={`${style.spaceBetween} ${style.alignCenter}`}>
                            <div className={style.displayInRow}>
                                <img src={UserLogo} className={style.userLogo} />
                                <div className={`${style.marginLeft10} ${style.marginTop}`}>
                                    <div className={style.userNameStyle}>
                                        Hi, Ronald Jones, MD
                                    </div>
                                    <div className={style.loginStatus}>
                                        last login DEC 4,21 11:48 am
                                    </div>
                                </div>
                            </div>
                            <img src={ChevronRight} className={style.roundChevronForUser} />
                        </div>
                    </div>
                    <div className={style.leftCard}>
                        <button className={style.primaryButtonStyle} onClick={()=> setShowSaveReport(true)} >Save Parameter Selection As My Report</button>
                        <div className={`${style.darkLabel} ${style.marginTop20}`}>Time Range:</div>
                        <select
                            name="action"
                            id="action"
                            className={`${style.fullWidth} ${style.marginTop}`}>
                            <option value="Feb 12, 2022 - Mar 13, 2022" >
                            Feb 12, 2022 - Mar 13, 2022
                            </option>
                        </select>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: '95%', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Activity Type</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={activityType}
                            onChange={handleChange}
                            label="Activity Type"
                            >
                            <MenuItem value={'Outpatient Clinic Service'}>Outpatient Clinic Service</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: '95%', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Activity Performed</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={activityPerformed}
                            onChange={handleChangeActivityPerformed}
                            label="Activity Performed"
                            >
                            <MenuItem value={'Half Day Clinic Session'}>Half Day Clinic Session</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: '95%', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Activity Type</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={activityType}
                            onChange={handleChange}
                            label="Activity Type"
                            >
                            <MenuItem value={'Outpatient Clinic Service'}>Outpatient Clinic Service</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: '95%', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Activity Performed</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={activityPerformed}
                            onChange={handleChangeActivityPerformed}
                            label="Activity Performed"
                            >
                            <MenuItem value={'Half Day Clinic Session'}>Half Day Clinic Session</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div className={style.bigCardStyle}>
                    <div className={style.spaceBetween}>
                        <div className={`${style.displayInRow} ${style.cardPadding}`}>
                            <div className={style.reportTypeTextStyle}>Report Type 1</div>
                            <img src={Info} className={`${style.infoStyle} ${style.marginLeft20}`} />
                            <div className={`${style.displayInRow} ${style.marginLeft20} ${style.reduceMarginTop}`}>
                                <Icon icon="star" size={20} color="#FEC106" className={style.marginLeft} />
                                <Icon icon="star" size={20} color="#FEC106" className={style.marginLeft} />
                                <Icon icon="star" size={20} color="#FEC106" className={style.marginLeft} />
                                <Icon icon="star" size={20} color="#D3D3D3" className={style.marginLeft} />
                                <Icon icon="star" size={20} color="#D3D3D3" className={style.marginLeft} />
                            </div>
                        </div>
                        <div className={` ${style.margin20}`}>
                            <div className={style.displayInRow}>
                                <div className={style.iconPadding}>
                                    <CachedOutlinedIcon style={{color:"#52575D"}} onClick={() => setShowReportRefreshingDialog(true)} />
                                </div>
                                <div className={style.iconPadding}>
                                    <ShareOutlinedIcon style={{color:"#52575D"}} onClick={() => setShowShareDialog(true)} />
                                </div>
                                <div className={style.iconPadding} onClick={() => setShowSaveReportOutput(true)}>
                                    <SaveOutlinedIcon style={{color:"#52575D"}} />
                                </div>
                                <div className={style.iconPadding}>
                                    <DownloadingOutlinedIcon style={{color:"#52575D"}} />
                                </div>
                                <div className={style.iconPadding}>
                                    <Link to={'/chart'} className={style.noFontStyle}>
                                        <PrintOutlinedIcon style={{color:"#52575D"}} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.blueBorderStyle}></div>
                    <div className={style.graphBox}>
                        <div className={style.chartGrid}>
                            <div className={style.individualBox}>
                                <div className={style.spaceBetween}>
                                    <div className={`${style.performanceTextStyle} ${style.alignCenter}`}>SALES PERFORMANCE</div>
                                    <div className={`${style.settingBackground} ${style.alignCenter} ${style.justifyCenter}`}>
                                        <SettingsIcon style={{color:"#707070"}} />
                                    </div>
                                </div>
                                <div className={style.performanceBorder}></div>
                                <div className={`${style.chartMargin}`}>
                                    <Chart {...straightAreaChart} className={style.marginTop20} />
                                </div>
                            </div>
                            <div className={style.individualBox}>
                                <div className={style.spaceBetween}>
                                    <div className={`${style.performanceTextStyle} ${style.alignCenter}`}>TOP CATEGORIES</div>
                                </div>
                                <div className={`${style.performanceBorder} ${style.marginTop20}`}></div> 
                                <div className={`${style.chartMargin}`}>
                                    <Chart {...donutChart}  type="donut" height={270} className={style.marginTop20} />
                                </div>
                            </div>
                        </div>
                        <div className={style.margin20}>
                            <div className={style.spaceBetween}>
                                <div className={`${style.performanceTextStyle} ${style.alignCenter}`}>RECENT CUSTOMERS</div>
                                <div className={`${style.settingBackground} ${style.alignCenter} ${style.justifyCenter}`}>
                                    <SettingsIcon style={{color:"#707070"}} />
                                </div>
                            </div>
                            <div className={`${style.individualBox} ${style.marginTop10}`}>
                                <div className={style.recentCustomerGrid}>
                                    <div className={`${style.performanceTextStyle} ${style.alignCenter}`}>Jerry Mattedi</div>
                                    <div className={`${style.chartTitleStyle3} ${style.alignCenter}`}>13 aug 2018 <br />Joined</div>
                                    <div className={`${style.chartTitleStyle3} ${style.alignCenter}`}>251-661-5362 <br /> Phone Number</div>
                                    <div className={`${style.chartTitleStyle3} ${style.alignCenter}`}>New York <br /> Location</div>
                                    <div className={style.optionsButton}>Options</div>
                                    <div className={`${style.detailsButton}`}>Details</div>
                                </div>
                                <div className={style.recentCustomerGrid}>
                                    <div className={`${style.performanceTextStyle} ${style.alignCenter}`}>ElianoraVasilov</div>
                                    <div className={`${style.chartTitleStyle3} ${style.alignCenter}`}>13 aug 2018 <br />Joined</div>
                                    <div className={`${style.chartTitleStyle3} ${style.alignCenter}`}>351-661-3252 <br /> Phone Number</div>
                                    <div className={`${style.chartTitleStyle3} ${style.alignCenter}`}>Ontario <br /> Location</div>
                                    <div className={style.optionsButton}>Options</div>
                                    <div className={`${style.detailsButton}`}>Details</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showSaveReport && (
                <SaveReport getSaveReportDialog={getSaveReportDialog} />
            )}
            <Dialog isOpen={showSaveReportOutput} onClose={() => setShowSaveReportOutput(false)} className={`${style.sendMailUserDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={`${style.extensionStyle} ${style.marginTop} ${style.bold}`}>Save This Report Output</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowSaveReportOutput(false)}  />
                    </div>
                    <div className={style.extensionBorder}></div>
                    <div className={`${style.padding10}`}>
                        <div>
                            <div className={`${style.marginTop20} ${style.recipientsDataHeight}`}>
                                <div className={style.displayInCol}>
                                    <label for="standard-basic" className={style.saveReportLabelStyle}>Report Output Name</label>
                                    <TextField id="standard-basic" variant="standard" value="Report Name - ABC" className={`${style.threeColWidth} ${style.saveReportFieldStyle} ${style.marginTop10}`} />
                                </div>
                                <div className={style.marginTop20}>
                                    <label for="description" className={`${style.saveReportLabelStyle}`}>Report Output Notes</label>
                                    <TextArea id="description" rows={5} placeholder="Enter Notes" className={`${style.fullWidth} ${style.saveReportFieldStyle} ${style.marginTop10}`} />
                                </div>
                            </div>
                            <div>
                                <div className={`${style.justifyCenter} ${style.marginTop20}`}>
                                    <button className={`${style.saveButtonStyle} ${style.marginLeft20} ${style.cursorPointer} `} onClick={() => {setShowReportSavedDialog(true);setShowSaveReportOutput(false)}}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            <Dialog isOpen={showReportSavedDialog} onClose={() => setShowReportSavedDialog(false)} className={`${style.reportSavedDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.justifyCenter}>
                        <div className={style.reportIconStyle}></div>
                    </div>
                    <div className={style.reportSavedStyle}>Report Saved</div>
                </div>
            </Dialog>
            <Dialog isOpen={showReportRefreshingDialog} onClose={() => setShowReportRefreshingDialog(false)} className={`${style.reportSavedDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.justifyCenter}>
                        <div className={style.reportIconStyle}></div>
                    </div>
                    <div className={style.reportSavedStyle}>Refreshing Report</div>
                </div>
            </Dialog>
            <Dialog isOpen={showShareDialog} onClose={() => setShowShareDialog(false)} className={`${style.sendMailUserDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={`${style.extensionStyle} ${style.marginTop} ${style.bold}`}>Share This Report Output</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowShareDialog(false)}  />
                    </div>
                    <div className={style.extensionBorder}></div>
                    <div className={style.spaceBetween}>
                        <div className={style.displayInRow}>
                            <p className={`${style.mailBoldText} ${style.marginTop20} ${style.blueText}`}>Registered Users</p>
                            <div className={`${style.taskCountStyle} ${style.marginTop20} ${style.marginLeft20}`}>20</div>
                            <p className={`${style.mailBoldText} ${style.marginTop20} ${style.externalRecipientsMarginLeft}`}>External Recipients</p>
                            <div className={style.deliveryCountStyle}>20</div>
                            <div className={`${style.searchBarStyle} ${style.spaceBetween} ${style.externalRecipientsMarginLeft}`}>
                                <p>Search</p>
                                <img src={Search} className={style.searchIcon} />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.extensionBorder} ${style.marginTop10}`}></div>
                    <div className={`${style.padding10}`}>
                        <div>
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
                                    </div>
                                    <Icon icon="cross" className={style.marginTop10} color="#52575D" />
                                </div>
                                <div className={`${style.extensionBorder}`}></div>
                            </div>
                            <div>
                                <div className={`${style.justifyCenter} ${style.marginTop20}`}>
                                    <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer} `}>{'Share Now'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default SampleReport;