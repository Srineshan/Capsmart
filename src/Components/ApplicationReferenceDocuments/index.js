import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
import style from './index.module.scss'

const ApplicationReferenceDocuments = () => {
    return (
        <div className={style.referenceDocumentParentCard}>
            <div className={style.referenceDocumentTitle}>Your Reference Documents</div>
            <div className={`${style.referenceDocumentCard} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                <div className={style.fullWidth}>
                    <div className={style.spaceBetween}>
                        <div className={style.displayInRow}>
                            <FilePresentRoundedIcon sx={{ fontSize: 16, color: '#52575D' }} />
                            <div className={style.documentNameStyle}>Document Name</div>
                        </div>
                        <div className={`${style.checkBackground} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
                            <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${style.referenceDocumentCard} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                <div className={style.fullWidth}>
                    <div className={style.spaceBetween}>
                        <div className={style.displayInRow}>
                            <FilePresentRoundedIcon sx={{ fontSize: 16, color: '#52575D' }} />
                            <div className={style.documentNameStyle}>Document Name</div>
                        </div>
                        <div className={`${style.checkBackground} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
                            <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${style.referenceDocumentCard} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                <div className={style.fullWidth}>
                    <div className={style.spaceBetween}>
                        <div className={style.displayInRow}>
                            <FilePresentRoundedIcon sx={{ fontSize: 16, color: '#52575D' }} />
                            <div className={style.documentNameStyle}>Document Name</div>
                        </div>
                        <div className={`${style.checkBackground} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
                            <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${style.referenceDocumentCard} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                <div className={style.fullWidth}>
                    <div className={style.spaceBetween}>
                        <div className={style.displayInRow}>
                            <FilePresentRoundedIcon sx={{ fontSize: 16, color: '#52575D' }} />
                            <div className={style.documentNameStyle}>Document Name</div>
                        </div>
                        <div className={`${style.checkBackground} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
                            <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApplicationReferenceDocuments;