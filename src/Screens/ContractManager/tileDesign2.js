import React from 'react';
import style from './index.module.scss';

const ContractTilesNew = ({getSelectedContract, selectedContract, activeContractsLength, draftContractsLength, upcomingContractsLength, expiredContractsLength}) => {

    return(
        <div className={style.grid4}>
            <div className={`${style.cardStyle} ${selectedContract === "active contract" && style.selectedContractBackground}`} onClick={() => getSelectedContract('active contract')}>
                <h5 className={`${style.headingForContracts}`}>ACTIVE CONTRACTS</h5>
                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                    <p className={`${style.headingCountForContracts} ${style.green}`}>{activeContractsLength}</p>
                    <div className={`${style.optionsStyle} ${style.displayInCol} ${style.reduceTop20}`}>
                        <span className={`${style.displayInRow} ${style.verticalAlignCenter}`}><span className={`${selectedContract === "active contract" ? style.selectedOrangeCountStyle : style.orangeCountStyle} ${style.countDesign}`}>0</span> AUTO RENEWED</span>
                        <span className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.reduceTop35}`}><span className={`${selectedContract === "active contract" ? style.selectedRedCountStyle : style.redCountStyle} ${style.countDesign}`}>0</span> EXPIRING IN 30 DAYS</span>
                    </div>
                </div>
            </div>
            <div className={`${style.cardStyle} ${selectedContract === "draft" && style.selectedContractBackground}`} onClick={() => getSelectedContract('draft')}>
                <h5 className={`${style.headingForContracts}`}>DRAFT</h5>
                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                    <p className={`${style.headingCountForContracts} ${style.yellow}`}>{draftContractsLength}</p>
                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                        <span><span className={style.orange}>0</span> ACTIVATION IN-PROGRESS</span>
                        <span><span className={style.red}>0</span> ACTIVATION PAST DUE</span>
                    </div>
                </div>
            </div>
            <div className={`${style.cardStyle} ${selectedContract === "upcoming renewals" && style.selectedContractBackground}`} onClick={() => getSelectedContract('upcoming renewals')}>
                <p className={style.next30Style}>NEXT 30 DAYS</p>
                <h5 className={style.headingForContracts}>UPCOMING RENEWALS</h5>
                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                    <p className={`${style.headingCountForContracts} ${style.yellow}`}>{upcomingContractsLength}</p>
                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                        <span><span className={style.orange}>0 </span> EXTENSION REQUIRED</span>
                        <span><span className={style.red}>0 </span> NEW CONTRACT REQUIRED</span>
                    </div>
                </div>
            </div>
            <div className={`${style.cardStyle} ${selectedContract === "expired or terminated" && style.selectedContractBackground}`} onClick={() => getSelectedContract('expired or terminated')}>
                <p className={style.next30Style}>LAST 30 DAYS</p>
                <h5 className={`${style.headingForContracts}`}>EXPIRED / TERMINATED</h5>
                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                    <p className={`${style.headingCountForContracts} ${style.red}`}>{expiredContractsLength}</p>
                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                        <span><span className={style.red}>0 </span> EXPIRED</span>
                        <span><span className={style.red}>0 </span> TERMINATED</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContractTilesNew;
