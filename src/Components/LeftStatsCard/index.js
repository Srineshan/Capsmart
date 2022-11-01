import React from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import PageFooterIcon from './../../images/pageFooterIcon.png';

import style from './index.module.scss';

const LeftStatsCard = ({metadata}) => {
    let individualCount = metadata?.metaData?.individualContractCount;
    let multipleCount = metadata?.metaData?.multipleContractCount;
    let expiringDoc = metadata?.metaData?.contractWithExpiringDocCount;
    return(
        <div className={`${style.bigCardStyle} ${style.bigCalendarLeftCardWidth}`}>
            <h5 className={style.statisticsHeading}>September 2022 Summary Statistics</h5>
            <div className={style.scrollStyle}>
                <div className={style.progressbarStyle}>
                    <div className={style.spaceBetween}>
                        <p className={style.statisticsProgress}><strong>{individualCount}</strong> <span className={style.marginLeft20}>INDIVIDUAL</span></p>
                        <p className={style.viewStyle}>View</p>
                    </div>
                    <ProgressBar completed={individualCount} isLabelVisible={false} height='5px' bgColor='#00C07F' baseBgColor="#ccffee" className={style.progressMargin} />
                </div>
                <div className={style.progressbarStyle}>
                    <div className={style.spaceBetween}>
                        <p className={style.statisticsProgress}><strong>{multipleCount}</strong> <span className={style.marginLeft20}>MULTIPLE</span></p>
                        <p className={style.viewStyle}>View</p>
                    </div>
                    <ProgressBar completed={multipleCount} isLabelVisible={false} height='5px' bgColor='#FEC106' baseBgColor="#fff2cc" className={style.progressMargin} />
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
                        <p className={style.statisticsProgress}><strong>{expiringDoc}</strong> <span className={style.marginLeft20}>CONTRACT WITH EXPIRING DOC</span></p>
                        <p className={style.viewStyle}>View</p>
                    </div>
                    <ProgressBar completed={expiringDoc} isLabelVisible={false} height='5px' bgColor='#FF6562' baseBgColor="#ffcdcc" className={style.progressMargin} />
                </div>
            </div>
            <img src={PageFooterIcon} alt="footer" className={style.footerIconStyle} />
        </div>
    )
}

export default LeftStatsCard;
