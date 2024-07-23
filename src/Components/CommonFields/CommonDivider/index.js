import React from 'react';

import style from './index.module.scss';

const CommonDivider = () => {
    return (
        <div className={`${style.divider} ${style.marginTop}`}></div>
    )
}

export default CommonDivider;