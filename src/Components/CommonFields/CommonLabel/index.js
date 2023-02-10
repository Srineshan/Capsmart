import React from 'react';

import style from './index.module.scss';

const CommonLabel = ({ value, className }) => {
    return (
        <div className={`${style.lableStyle} ${className}`}>{value}</div>
    )
}

export default CommonLabel;