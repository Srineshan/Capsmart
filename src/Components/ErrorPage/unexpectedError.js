import React from 'react';
import UnexpectedErrorImg from '../../images/unexpectedError.png';

import style from './index.module.scss';

const UnexpectedError = () => {
    return (
        <div className={style.unexpectedErrorBackgroundCard}>
            <div className={style.verticalAlignCenter}>
                <div className={style.fullWidth}>
                    <div className={style.horizontalAlignCenter}>
                        <img alt='' src={UnexpectedErrorImg} className={style.errorImgStyle} />
                    </div>
                    <div className={style.horizontalAlignCenter}>
                        <div className={style.errorBorder}></div>
                    </div>
                    <div className={`${style.unexpectedErrormessageStyle} ${style.marginTop30}`}>Oops! Something seems to have gone wrong...</div>
                    <div className={`${style.unexpectedErrordescriptionStyle} ${style.marginTop20}`}>
                        We apologise for the inconvenience. This issue has automatically been logged and our team is looking into it. Please bear with us as we resolve this issue expeditiously.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnexpectedError;