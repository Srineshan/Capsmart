import React from 'react';
import style from './index.module.scss';


const NoDataBox = ({ heading, subHeading, onClickText, onClickFunction, buttonComponent }) => {
    return (
        <div className={`${style.noContractsBox} ${style.alignCenter}`}>
            <div>
                <div className={style.noContractsFontStyle}>{heading}</div>
                {subHeading !== '' && (
                    <div className={` ${style.marginTop20} ${style.displayInRow} ${style.justifyCenter} ${style.alignCenter}`}>
                        <div className={`${style.noContractsSmallFontStyle}`}>{subHeading}</div>
                        <div>{buttonComponent}</div>
                    </div>
                )}
                <a><div className={`${style.linkStyle} ${style.marginTop10} ${style.justifyCenter}`} onClick={() => onClickFunction()}>{onClickText}</div></a>
            </div>
        </div>
    )
}

export default NoDataBox;