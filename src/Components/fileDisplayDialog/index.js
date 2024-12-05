import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import ExpandIcon from '@mui/icons-material/Expand';


import style from './index.module.scss'

const FileDisplayDialog = ({ getIsOpen, file }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);


    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground} ${isExpanded ? style.expandedDialog : ''}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>{file?.fileUploaded !== undefined ? `${file?.documentType} (${file?.fileUploaded})` : file?.fileName !== undefined ? ` (${file?.fileName})` : ''}</div>
                        <div className={style.displayInRow}>
                        <ExpandIcon
                                className={`${style.iconStyle} ${style.cursorPointer} `}
                                onClick={toggleExpand}
                                sx={{ color: '#06617A' }} 
                            />
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div>
                    </div>
                    <div className={style.marginTop}>
                        {file?.fileType === 'application/pdf' ? (
                            <iframe src={file?.fileURL} width="100%" height="600px"></iframe>
                        ) : file?.fileType?.startsWith("image/") ? (
                            <img src={file?.fileURL} alt="" width="100%" height="600px" className={style.objectFitContain} />
                        ) : ''}
                    </div>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); }}>CLOSE</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default FileDisplayDialog;