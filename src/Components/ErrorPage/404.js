import React from 'react';
import style from './index.module.scss';

const Error404 = () => {
    return (
        <div className={style.errorBackgroundCard}>
            <div className={style.verticalAlignCenter}>
                <div className={style.fullWidth}>
                    <div className={style.errorCodeTextStyle}>404</div>
                    <div className={style.messageStyle}>Oops! Something Wrong...</div>
                    <div className={`${style.descriptionStyle} ${style.marginTop20}`}>
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                    </div>
                    <div className={`${style.marginTop30} ${style.displayInRow} ${style.horizontalAlignCenter}`}>
                        <button className={`${style.colouredButton} ${style.buttonStyle}`}>GO BACK</button>
                        <button className={`${style.whiteButton} ${style.buttonStyle} ${style.marginLeft20}`}>HOMEPAGE</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Error404;