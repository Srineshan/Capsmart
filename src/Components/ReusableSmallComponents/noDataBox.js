import React from 'react';
import style from './index.module.scss';


const NoDataBox = ({ heading, subHeading, subHeading2, onClickText, onClickFunction, buttonComponent }) => {
    return (
        <div className={`${style.noContractsBox} ${style.alignCenter}`}>
            <div>
                {heading && (
                    <div className={style.noContractsFontStyle}>{heading}</div>
                )}
                {subHeading !== '' && (
                    <div className={` ${style.marginTop20} ${style.displayInRow} ${style.justifyCenter} ${style.alignCenter}`}>
                        <div>
                            <div className={`${style.noContractsSmallFontStyle}`}>{subHeading}</div>
                            <div className={`${style.noContractsSmallFontStyleSubHeading2} ${style.marginTop20}`}>{subHeading2}</div>
                        </div>
                        <div>{buttonComponent}</div>
                    </div>
                )}
                <a><div className={`${style.linkStyle} ${style.marginTop10} ${style.justifyCenter}`} onClick={() => onClickFunction()}>{onClickText}</div></a>
            </div>
        </div>
    )
}

export default NoDataBox;