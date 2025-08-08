import React from 'react';

import style from './index.module.scss';

const CommonDivider = ({ className }) => {
    return (
        <div className={`${style.divider} ${style.marginTop10} ${className}`}></div>
    )
}

export default CommonDivider;