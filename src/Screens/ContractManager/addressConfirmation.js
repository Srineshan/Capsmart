/* eslint-disable array-callback-return */
import React from "react";
import {
    Dialog,
    Classes,
    Icon,
    Intent
} from "@blueprintjs/core";
import style from "./index.module.scss";
import RedWarning from "./../../images/redWarning.png";

const AddressConfirmationAlert = ({
    alert,
    getAddressConfirmation,
    fieldData,
    setContinueLoading,
    addressConfirmationFunction,
    buttonName
}) => {

    const handleContinueClick = () => {
        addressConfirmationFunction(buttonName)
    };

    const handleClose = () => {
        setContinueLoading(false);
        getAddressConfirmation(false);
    };

    return (
        <Dialog
            isOpen={alert}
            onClose={handleClose}
            className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}
        >
            <div
                className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}  ${style.margin20}`}
            >
                <div className={`${style.warningTextAlign} `}>
                    <div className={`${style.extensionStyle} ${style.warningTextAlign}`}>
                        <img
                            src={RedWarning}
                            alt="WARNING"
                            className={`${style.warningIconStyle}`}
                        />
                        <span className={style.marginLeft5}>
                            Alert! Please Confirm The Address
                        </span>
                    </div>
                    <Icon
                        icon="cross"
                        size={20}
                        intent={Intent.DANGER}
                        className={style.crossStyle}
                        onClick={handleClose}
                    />
                </div>
                <div className={style.extensionBorder}></div>
                <div className={`${style.marginTop30} ${style.marginLeft30}`}>
                    <p
                        className={`${style.deleteDescriptionStyle} ${style.marginTop10}`}
                    >
                        {fieldData?.addressLine}
                    </p>
                    <p
                        className={`${style.deleteDescriptionStyle} ${style.marginTop10}`}
                    >
                        {`${fieldData?.city}, ${fieldData?.state}`}
                    </p>
                    <p
                        className={`${style.deleteDescriptionStyle} ${style.marginTop10}`}
                    >
                        {fieldData?.zipcode}
                    </p>
                </div>

                <div className={`${style.positionCenter} ${style.marginTop20}`}>
                    <button
                        className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`}
                        onClick={handleClose}
                    >
                        BACK
                    </button>
                    <button
                        className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`}
                        onClick={handleContinueClick}
                    >
                        CONTINUE
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export default AddressConfirmationAlert;
