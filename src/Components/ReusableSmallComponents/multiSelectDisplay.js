import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

import style from './index.module.scss';

const MultiSelectDisplay = ({values}) => {
    return(
        <div>
            <div className={`${style.siteDeptFieldCard} ${style.displayInRow} ${style.marginTop10}`}>
                {values?.map((data, index) => (
                    <div className={`${style.deptCard} ${style.displayInRow} ${style.verticalAlignCenter}`} key={index}>
                        <div className={`${style.siteDeptTextStyle} ${style.marginLeft10}`}>{data}</div>
                        <CloseIcon fontSize="20px" className={`${style.siteDeptCrossStyle} ${style.marginLeft10} ${style.cursorPointer}`} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MultiSelectDisplay;