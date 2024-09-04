import React, { useState } from 'react';
import AcknowledgmentDialog from './AcknowledgmentDialog';

import style from "./../index.module.scss";

const AcknowledgementForm = () => {
    const [showDialog, setShowDialog] = useState(true);
    return (
        showDialog && (
            <AcknowledgmentDialog open={showDialog} handleClose={setShowDialog} />
        )
    )
}

export default AcknowledgementForm;