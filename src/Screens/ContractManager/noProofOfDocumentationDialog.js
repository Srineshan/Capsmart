import React from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import style from './index.module.scss';
import NoDataBox from '../../Components/ReusableSmallComponents/noDataBox';


const NoProofOfDocumentationDialog = ({getNoProofOfDocumentationDialog}) => {
    return(
        <Dialog isOpen={getNoProofOfDocumentationDialog} onClose={() => getNoProofOfDocumentationDialog(false)} className={`${style.noDataDialogStyle} ${style.noDataDialogBackground}`}>
            <div className={`${Classes.DIALOG_BODY} `}>
                <div className={style.floatRight}>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getNoProofOfDocumentationDialog(false)}  />
                </div>
                <NoDataBox 
                    heading={'Proof Of Documentation is not included in your plan. please upgrade your plan'} 
                    subHeading={''} 
                    onClickText={'Click To View & Upgrade Your Plan'}
                    onClickFunction={() => {}} 
                />
            </div>
        </Dialog>
    )
}

export default NoProofOfDocumentationDialog;