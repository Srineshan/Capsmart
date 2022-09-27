import React from 'react';
import style from './index.module.scss';

const ContractTiles = ({getSelectedContract, selectedContract, activeContractsLength, draftContractsLength, upcomingContractsLength, expiredContractsLength}) => {

    return(
        <div className={style.grid4}>
            <div className={`${style.cardStyle} ${selectedContract === "active contract" && style.selectedContractBackground}`} onClick={() => getSelectedContract('active contract')}>
                <h5 className={`${style.headingForContracts}`}>ACTIVE CONTRACTS</h5>
                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                    <p className={`${style.headingCountForContracts}`}>{activeContractsLength}</p>
                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                        <span><span className={style.green}>0</span> AUTO RENEWED</span>
                        <span><span>0</span> EXPIRING IN 30 DAYS</span>
                    </div>
                </div>
            </div>
            <div className={`${style.cardStyle} ${selectedContract === "draft" && style.selectedContractBackground}`} onClick={() => getSelectedContract('draft')}>
                <h5 className={`${style.headingForContracts}`}>DRAFT</h5>
                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                    <p className={`${style.headingCountForContracts}`}>{draftContractsLength}</p>
                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                        <span><span className={style.yellow}>0</span> ACTIVATION IN-PROGRESS</span>
                        <span><span className={style.red}>0</span> ACTIVATION PAST DUE</span>
                    </div>
                </div>
            </div>
            <div className={`${style.cardStyle} ${selectedContract === "upcoming renewals" && style.selectedContractBackground}`} onClick={() => getSelectedContract('upcoming renewals')}>
                <p className={style.next30Style}>NEXT 30 DAYS</p>
                <h5 className={style.headingForContracts}>UPCOMING RENEWALS</h5>
                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                    <p className={`${style.headingCountForContracts}`}>{upcomingContractsLength}</p>
                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                        <span><span className={style.blue}>0 </span> EXTENSION REQUIRED</span>
                        <span><span className={style.blue}>0 </span> NEW CONTRACT REQUIRED</span>
                    </div>
                </div>
            </div>
            <div className={`${style.cardStyle} ${selectedContract === "expired or terminated" && style.selectedContractBackground}`} onClick={() => getSelectedContract('expired or terminated')}>
                <h5 className={`${style.headingForContracts}`}>EXPIRED / TERMINATED</h5>
                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                    <p className={`${style.headingCountForContracts}`}>{expiredContractsLength}</p>
                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                        <span><span className={style.red}>0 </span> EXPIRED</span>
                        <span><span className={style.red}>0 </span> TERMINATED</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContractTiles;
