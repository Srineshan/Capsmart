import React from 'react';

import style from './index.module.scss';

const CommonLabel = ({ value }) => {
    return (
        <div className={style.lableStyle}>{value}</div>
    )
}

export default CommonLabel;