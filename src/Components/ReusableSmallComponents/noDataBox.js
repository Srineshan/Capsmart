import React from 'react';
import style from './index.module.scss';


const NoDataBox = ({heading, onClickText, onClickFunction}) => {
    return(
        <div className={`${style.noContractsBox} ${style.alignCenter}`}>
            <div>
                <div className={style.noContractsFontStyle}>{heading}</div>
                <a><div className={`${style.linkStyle} ${style.marginTop40} ${style.justifyCenter}`} onClick={() => onClickFunction()}>{onClickText}</div></a>
            </div>
        </div> 
    )
}

export default NoDataBox;