import React from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import style from './index.module.scss'

const RequiredDocumentCard = ({ array }) => {
    return (
        array?.map((data, index) => (
            <div className={`${style.requiredDocumentCard} ${index % 2 === 0 ? style.requiredDocumentCardAlternativeColor : ''}  ${index !== 0 ? style.marginTop5 : ''}`}>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                    <div className={style.documentTextStyle}>{data?.title}</div>
                    <InfoOutlinedIcon sx={{ fontSize: 14, marginLeft: '10px' }} className={style.info} />
                </div>
            </div>
        ))
    )
}

export default RequiredDocumentCard;